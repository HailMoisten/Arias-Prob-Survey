import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameMode, GamePhase } from '../types.js';
import { useGameState } from '../hooks/useGameState.js';
import { getQuestion, trainingCategories } from '../services/questionService.js';
import { simplifyFraction } from '../utils/math.js';
import { MAX_BET } from '../constants.js';
import Header from './Header.js';
import QuestionDisplay from './QuestionDisplay.js';
import SliderInput from './SliderInput.js';
import FractionInput from './FractionInput.js';
import Button from './Button.js';
import Modal from './Modal.js';
import Card from './Card.js';
import TextWithFurigana from './TextWithFurigana.js';
import BallDrawAnimation from './BallDrawAnimation.js';
import DiceRollAnimation from './DiceRollAnimation.js';
import CardDrawAnimation from './CardDrawAnimation.js';
import CoinFlipAnimation from './CoinFlipAnimation.js';
import Aria from './Aria.js';
import SpeechBubble from './SpeechBubble.js';
import HintSignboard from './HintSignboard.js';
const BallDisplay = ({ redBalls, whiteBalls }) => {
    const totalBalls = redBalls + whiteBalls;
    const seedrandom = (seed) => { let x = Math.sin(seed) * 10000; return x - Math.floor(x); };
    const balls = Array.from({ length: totalBalls }).map((_, i) => ({ isRed: i < redBalls, cx: 60 + seedrandom(i * 10) * 80, cy: 40 + seedrandom(i * 20) * 20 }));
    return (jsx("div", { className: "relative w-full h-full", children: jsxs("svg", { viewBox: "0 0 200 120", className: "w-full h-full drop-shadow-lg animate-bounce-sm", style: { animationDuration: '2s' }, children: [jsx("path", { d: "M 70 50 C 40 120, 160 120, 130 50 Q 100 65 70 50 Z", fill: "#a16207", stroke: "#854d0e", strokeWidth: "2" }), balls.map((ball, i) => jsx("circle", { cx: ball.cx, cy: ball.cy, r: "8", fill: ball.isRed ? '#ef4444' : '#f9fafb', stroke: "#00000033", strokeWidth: "1" }, i))] }) }));
};
const DiceDisplay = ({ count }) => (jsx("div", { className: "relative w-full h-full flex items-center justify-center space-x-1 animate-bounce-sm", children: Array.from({ length: Math.min(count, 3) }).map((_, i) => (jsx("div", { className: "w-10 h-10 bg-white rounded-lg shadow-md border-2 border-gray-300 p-1 transform -rotate-12", children: jsx("svg", { viewBox: "0 0 100 100", className: "w-full h-full", children: jsx("circle", { cx: "50%", cy: "50%", r: "10", fill: "black" }) }) }, i))) }));
const CoinDisplay = ({ count }) => (jsx("div", { className: "relative w-full h-full flex items-center justify-center space-x-[-1rem] animate-bounce-sm", children: Array.from({ length: Math.min(count, 3) }).map((_, i) => (jsx("div", { className: "w-12 h-12 bg-yellow-400 rounded-full shadow-md border-4 border-yellow-500 flex items-center justify-center transform -rotate-12", children: jsx("span", { className: "text-2xl font-bold text-yellow-800", children: "☆" }) }, i))) }));
const CardStackDisplay = ({ count, type }) => {
    const cardColor = type === 'trump' ? 'bg-blue-500' : 'bg-green-500';
    const cardElements = [];
    for (let i = 0; i < count; i++) {
        // This creates a fanned out effect.
        const rotation = (i - (count - 1) / 2) * 10;
        cardElements.push(jsx("div", { className: `w-12 h-16 ${cardColor} rounded-md shadow-lg border-2 border-white transform absolute`, style: { transform: `rotate(${rotation}deg) translateY(${Math.abs(rotation) * 0.5}px)`, zIndex: i } }, i));
    }
    return (jsx("div", { className: "relative w-full h-full flex items-center justify-center animate-bounce-sm", children: cardElements }));
};
const GameScreen = ({ mode }) => {
    const navigate = useNavigate();
    const { playerState, addChips, markAsPlayed } = useGameState();
    const isTraining = mode === GameMode.TRAINING;
    useEffect(() => {
        const originalBodyClass = document.body.className;
        if (isTraining) {
            document.body.className = 'bg-gray-50';
        }
        return () => {
            document.body.className = originalBodyClass;
        };
    }, [isTraining]);
    const [question, setQuestion] = useState(() => isTraining ? {} : getQuestion({ mode: GameMode.NORMAL }));
    const [phase, setPhase] = useState(isTraining ? GamePhase.QUESTION_SELECTION : GamePhase.BETTING);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubType, setSelectedSubType] = useState(null);
    const [betAmount, setBetAmount] = useState(isTraining ? 1 : 1);
    const [answerMethod, setAnswerMethod] = useState('slider');
    const [sliderValue, setSliderValue] = useState(50);
    const [fractionValue, setFractionValue] = useState({ numerator: '', denominator: '' });
    const [trainingWinnings, setTrainingWinnings] = useState(0);
    const [result, setResult] = useState(null);
    const [isExplanationOpen, setIsExplanationOpen] = useState(false);
    const currentChips = isTraining ? playerState.trainingChips : playerState.chips;
    const handleStartTrainingQuestion = () => {
        if (!selectedCategory || !selectedSubType)
            return;
        const newQuestion = getQuestion({
            mode: GameMode.TRAINING,
            type: selectedCategory,
            subType: selectedSubType,
        });
        setQuestion(newQuestion);
        setPhase(GamePhase.BETTING);
    };
    const handleBet = () => {
        if (betAmount >= 0 && betAmount <= currentChips) {
            setPhase(GamePhase.ANSWERING);
        }
    };
    const handleSubmitAnswer = () => {
        const { numerator: correctN, denominator: correctD } = question.answer;
        const correctProbability = correctD === 0 ? 0 : correctN / correctD;
        let isWin = Math.random() < correctProbability;
        let chipChange = 0;
        let odds = 2;
        let resultMessage;
        let accuracy = 'incorrect';
        let bonusMessage;
        if (answerMethod === 'slider') {
            const correctPercentage = correctProbability * 100;
            const approximatedCorrectPercentage = Math.round(correctPercentage / 5) * 5;
            const diff = Math.abs(sliderValue - approximatedCorrectPercentage);
            if (diff === 0) { // Exact match to 5% increment
                accuracy = 'approximate';
                chipChange = isWin ? betAmount * (odds - 1) : 0;
                bonusMessage = { ja: "はずれでも全部返ってくる！", en: "Bet is safe!" };
                resultMessage = isWin ? { en: "You win!", ja: "あたり！" } : { en: "Miss...", ja: "はずれ…" };
            }
            else if (diff === 5) { // Near miss by 5%
                accuracy = 'near-miss';
                const refund = isTraining ? 0 : Math.round(betAmount / 2);
                chipChange = isWin ? betAmount * (odds - 1) : -refund;
                bonusMessage = { ja: "はずれでも半分返ってくる！", en: "Half of your bet is returned!" };
                resultMessage = isWin ? { en: "You win!", ja: "あたり！" } : { en: "Miss...", ja: "はずれ…" };
            }
            else { // Incorrect
                accuracy = 'incorrect';
                chipChange = isWin ? betAmount * (odds - 1) : (isTraining ? 0 : -betAmount);
                bonusMessage = { ja: "不正解...", en: "Incorrect..." };
                resultMessage = isWin ? { en: "You win!", ja: "あたり！" } : { en: "Miss...", ja: "はずれ…" };
            }
        }
        else { // Fraction method
            const num = parseInt(fractionValue.numerator, 10);
            const den = parseInt(fractionValue.denominator, 10);
            const simplifiedUser = (num && den) ? simplifyFraction(num, den) : { numerator: 0, denominator: 1 };
            const simplifiedCorrect = simplifyFraction(correctN, correctD);
            if (simplifiedUser.numerator === simplifiedCorrect.numerator && simplifiedUser.denominator === simplifiedCorrect.denominator) {
                accuracy = 'exact';
                odds = Math.max(2, Math.round(1 / correctProbability) || 2);
                if (isWin) {
                    chipChange = betAmount * (odds - 1);
                    bonusMessage = { ja: `ボーナスでオッズが${odds}倍に！`, en: `Odds are x${odds}!` };
                    resultMessage = { en: "You win!", ja: "あたり！" };
                }
                else {
                    chipChange = 0;
                    bonusMessage = { ja: 'ベットは返ってくるよ！', en: 'Your bet is returned!' };
                    resultMessage = { en: "Miss...", ja: "はずれ…" };
                }
            }
            else {
                accuracy = 'incorrect';
                chipChange = isWin ? betAmount * (odds - 1) : (isTraining ? 0 : -betAmount);
                resultMessage = isWin ? { en: "You win!", ja: "あたり！" } : { en: "Miss...", ja: "はずれ…" };
            }
        }
        setResult({ isWin, chipChange, odds, correctProbability, resultMessage, accuracy, bonusMessage });
        setPhase(GamePhase.ANIMATING);
    };
    const handleAnimationEnd = useCallback(() => {
        if (!result)
            return;
        const { chipChange } = result;
        if (isTraining) {
            if (chipChange > 0) {
                setTrainingWinnings(prev => prev + chipChange);
            }
        }
        else {
            addChips(chipChange);
            if (betAmount > 0) {
                markAsPlayed();
            }
        }
        setPhase(GamePhase.RESULT);
    }, [result, isTraining, betAmount, addChips, markAsPlayed]);
    const handleGoHome = () => {
        navigate('/');
    };
    const handleRestartTraining = () => {
        setResult(null);
        setPhase(GamePhase.QUESTION_SELECTION);
        setQuestion({});
        setSelectedCategory(null);
        setSelectedSubType(null);
        setBetAmount(1);
        setSliderValue(50);
        setFractionValue({ numerator: '', denominator: '' });
        setTrainingWinnings(0);
        setIsExplanationOpen(false);
    };
    const ariaMessage = useMemo(() => {
        switch (phase) {
            case GamePhase.QUESTION_SELECTION: return { en: "What would you like to practice?", ja: "何を練習する？" };
            case GamePhase.BETTING: return { en: "Here's the question!", ja: "問題だよ！賭ける？" };
            case GamePhase.ANSWERING: return { en: "What's the probability?", ja: "勝率はどれくらい？" };
            case GamePhase.RESULT: return result?.isWin ? { en: "Congratulations!", ja: "おめでとう！" } : { en: "Too bad! Try again!", ja: "残念！また挑戦してね" };
            default: return undefined;
        }
    }, [phase, result]);
    const canSubmitAnswer = useMemo(() => {
        if (answerMethod === 'fraction') {
            const { numerator, denominator } = fractionValue;
            return !!(numerator && denominator && parseInt(numerator, 10) >= 0 && parseInt(denominator, 10) > 0);
        }
        return true; // Slider always has a value
    }, [answerMethod, fractionValue]);
    const renderQuestionSelectionPhase = () => (jsx(Card, { className: "z-10 relative w-full text-center", children: [jsx(TextWithFurigana, { content: { en: 'Select Category', ja: 'カテゴリを選択' } }), jsx("div", { className: "grid grid-cols-3 gap-2 my-4", children: trainingCategories.map(cat => (jsx("button", { onClick: () => { setSelectedCategory(cat.type); setSelectedSubType(null); }, className: `p-2 rounded-lg transition ${selectedCategory === cat.type ? 'bg-yellow-400 text-gray-800 shadow-inner' : 'bg-white hover:bg-yellow-100'}`, children: jsx(TextWithFurigana, { content: cat.text, jaClass: "text-sm", enClass: "text-xs" }) }, cat.type))) }), selectedCategory && (jsxs("div", { children: [jsx("div", { className: "w-full h-px bg-yellow-200 my-3" }), jsx(TextWithFurigana, { content: { en: 'Select Type', ja: 'タイプを選択' } }), jsx("div", { className: "grid grid-cols-2 gap-2 my-4", children: trainingCategories.find(c => c.type === selectedCategory)?.subTypes?.map(sub => (jsx("button", { onClick: () => setSelectedSubType(sub.subType), className: `p-2 rounded-lg transition ${selectedSubType === sub.subType ? 'bg-yellow-400 text-gray-800 shadow-inner' : 'bg-white hover:bg-yellow-100'}`, children: jsx(TextWithFurigana, { content: sub.text, jaClass: "text-sm", enClass: "text-xs" }) }, sub.subType))) })] })), jsx(Button, { text: { en: 'Start', ja: 'この問題で練習！' }, onClick: handleStartTrainingQuestion, disabled: !selectedCategory || !selectedSubType })] }));
    const renderBettingPhase = () => (jsx(Card, { className: "z-10 relative w-full", children: [isTraining ? (jsxs("div", { className: "text-center my-2", children: [jsx(TextWithFurigana, { content: { en: 'Bet Amount', ja: 'ベット枚数' }, jaClass: "text-base", enClass: "text-xs" }), jsx("p", { className: "text-3xl font-bold text-orange-600 w-16 text-center mx-auto mt-1", children: "1" }), jsx("p", { className: "text-xs text-gray-500 font-jp", children: "(トレーニングは1枚固定)" })] })) : (jsxs("div", { children: [jsx(TextWithFurigana, { content: { en: 'How many Mimichips to bet?', ja: '何枚賭ける？' }, jaClass: "text-lg", enClass: "text-sm" }), jsxs("div", { className: "flex items-center space-x-4 my-4", children: [jsx("input", { type: "range", min: "0", max: Math.min(MAX_BET, currentChips), value: betAmount, onChange: (e) => setBetAmount(parseInt(e.target.value)), className: "w-full h-3 bg-yellow-200 rounded-lg appearance-none cursor-pointer range-lg accent-orange-500" }), jsx("span", { className: "text-3xl font-bold text-orange-600 w-16 text-center", children: betAmount })] })] })), jsx(Button, { text: { en: 'Bet', ja: '賭ける' }, onClick: handleBet, disabled: !isTraining && currentChips < betAmount })] }));
    const renderAnsweringPhase = () => (jsx(Card, { className: "z-10 relative w-full", children: [jsxs("div", { className: "flex justify-center mb-4 rounded-lg bg-yellow-200 p-1", children: [jsx("button", { onClick: () => setAnswerMethod('slider'), className: `w-1/2 py-2 rounded-md transition ${answerMethod === 'slider' ? 'bg-white shadow' : ''}`, children: jsx(TextWithFurigana, { content: { en: 'Approximate', ja: 'おおよそ' } }) }), jsx("button", { onClick: () => setAnswerMethod('fraction'), className: `w-1/2 py-2 rounded-md transition ${answerMethod === 'fraction' ? 'bg-white shadow' : ''}`, children: jsx(TextWithFurigana, { content: { en: 'Exact', ja: 'ピッタリ' } }) })] }), answerMethod === 'slider' ? (jsx(SliderInput, { value: sliderValue, onChange: (e) => setSliderValue(parseInt(e.target.value)) })) : (jsx(FractionInput, { value: fractionValue, onChange: setFractionValue })), jsx(Button, { text: { en: 'Answer', ja: '回答する' }, onClick: handleSubmitAnswer, className: "mt-6", disabled: !canSubmitAnswer, variant: "primary" })] }));
    const getAccuracyText = (accuracy) => {
        switch (accuracy) {
            case 'exact': return { en: 'Exact Answer!', ja: 'ピッタリ正解！' };
            case 'approximate': return { en: 'Approximate Answer!', ja: 'おおよそ正解！' };
            case 'near-miss': return { en: 'Approximate Near Miss!', ja: 'おおよそニアピン！' };
            default: return { en: 'Incorrect Answer', ja: '不正解…' };
        }
    };
    const explanationRef = useRef(null);
    useEffect(() => {
        if (isExplanationOpen && explanationRef.current) {
            if (typeof renderMathInElement !== 'undefined' && typeof katex !== 'undefined') {
                renderMathInElement(explanationRef.current, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false },
                    ],
                    throwOnError: false,
                });
            }
        }
    }, [isExplanationOpen, question.explanation]);
    const renderResultPhase = () => (jsx(Modal, { isOpen: true, children: !isExplanationOpen ? (jsxs("div", { className: "text-center space-y-4 max-h-[90vh] overflow-y-auto pr-2 pb-2", children: [jsxs("div", { className: "space-y-3", children: [jsx(Card, { children: [jsx(TextWithFurigana, { content: { en: "Bet Result", ja: "賭けの結果" }, jaClass: "text-sm", enClass: "text-xs", containerClass: "text-left text-gray-500" }), jsx("div", { className: "w-full h-px bg-gray-200 my-1" }), jsx(TextWithFurigana, { content: result.resultMessage, jaClass: "text-xl font-bold", enClass: "text-sm" })] }), jsx(Card, { children: [jsx(TextWithFurigana, { content: { en: "Answer Accuracy", ja: "回答の答え合わせ" }, jaClass: "text-sm", enClass: "text-xs", containerClass: "text-left text-gray-500" }), jsx("div", { className: "w-full h-px bg-gray-200 my-1" }), jsx(TextWithFurigana, { content: getAccuracyText(result.accuracy), jaClass: "text-xl font-bold", enClass: "text-sm" }), result.bonusMessage && (jsx("div", { className: "mt-1 text-center", children: jsx(TextWithFurigana, { content: result.bonusMessage, jaClass: "text-sm", enClass: "text-xs", containerClass: "text-orange-500 font-bold" }) })), jsxs("p", { className: "text-sm space-y-1 text-gray-600 mt-2", children: ["正解の確率: ", Math.round(result.correctProbability * 100), "% (", simplifyFraction(question.answer.numerator, question.answer.denominator).numerator, "/", simplifyFraction(question.answer.numerator, question.answer.denominator).denominator, ")"] }), question.explanation && (jsx(Button, { text: { en: "Explanation", ja: "解説" }, onClick: () => setIsExplanationOpen(true), variant: "secondary", className: "mt-2 w-full" }))] }), jsxs(Card, { className: "bg-yellow-100/50", children: [jsx(TextWithFurigana, { content: isTraining ? { en: 'Earned Training Chips', ja: '獲得練習チップ' } : { en: 'Earned Mimichips', ja: '獲得ミミチップ' }, jaClass: "text-sm", enClass: "text-xs" }), jsxs("p", { className: `text-4xl font-bold ${result.chipChange > 0 ? 'text-green-500' : result.chipChange < 0 ? 'text-red-500' : 'text-gray-600'}`, children: [result.chipChange > 0 ? '+' : '', result.chipChange] })] })] }), isTraining ? (jsxs("div", { className: "flex flex-col space-y-2", children: [jsx(Button, { text: { en: 'Try Again', ja: 'もう一度' }, onClick: handleRestartTraining, variant: "primary" }), jsx(Button, { text: { en: 'Back to Home', ja: 'ホームに戻る' }, onClick: handleGoHome, variant: "secondary" })] })) : (jsx(Button, { text: { en: 'Back to Home', ja: 'ホームに戻る' }, onClick: handleGoHome }))] })) : (jsxs("div", { className: "text-center space-y-4", children: [jsx(TextWithFurigana, { content: { en: "Explanation", ja: "解説" }, jaClass: "text-2xl", enClass: "text-md" }), jsx("div", { ref: explanationRef, className: "text-left bg-white p-4 rounded-lg text-gray-700 font-jp leading-relaxed max-h-[60vh] overflow-y-auto whitespace-pre-wrap", children: question.explanation }), jsx(Button, { text: { en: 'Close', ja: '閉じる' }, onClick: () => setIsExplanationOpen(false), variant: "secondary" })] })) }));
    const renderAnimation = () => {
        if (!result)
            return null;
        const props = {
            question: question,
            isWin: result.isWin,
            onAnimationEnd: handleAnimationEnd,
        };
        switch (question.type) {
            case 'ball': return jsx(BallDrawAnimation, { ...props });
            case 'dice': return jsx(DiceRollAnimation, { ...props });
            case 'trump':
            case 'numberCard': return jsx(CardDrawAnimation, { ...props });
            case 'coin': return jsx(CoinFlipAnimation, { ...props });
            default: return null;
        }
    };
    const renderProblemIllustration = () => {
        switch (question.type) {
            case 'ball':
                return jsx(BallDisplay, { redBalls: question.redBalls ?? 0, whiteBalls: question.whiteBalls ?? 0 });
            case 'dice':
                return jsx(DiceDisplay, { count: question.diceCount ?? 1 });
            case 'coin':
                return jsx(CoinDisplay, { count: question.coinCount ?? 1 });
            case 'trump':
            case 'numberCard':
                return jsx(CardStackDisplay, { count: question.cardsToDraw ?? 1, type: question.type });
            default:
                return null;
        }
    };
    return (jsxs("div", { className: `flex flex-col h-screen ${isTraining ? 'bg-gray-100' : 'bg-yellow-30'}`, children: [jsx(Header, { mode: mode, onHomeClick: handleGoHome, sessionChips: isTraining ? trainingWinnings : undefined }), jsxs("main", { className: "flex-grow p-4 flex flex-col overflow-y-auto", children: [jsx("div", { className: "mb-4", children: (phase === GamePhase.BETTING || phase === GamePhase.ANSWERING) && (jsx(QuestionDisplay, { question: question })) }), jsxs("div", { className: "mt-auto flex flex-col items-center space-y-2", children: [ariaMessage && jsx(SpeechBubble, { message: ariaMessage, className: "relative z-20" }), jsx("div", { className: "relative w-full pt-16", children: jsx("div", { className: "relative z-10", children: [phase === GamePhase.ANSWERING && (jsx(HintSignboard, { hintText: question.hint || 'ガンバレー', 
                                    // ▼▼ 看板の位置調整 ▼▼
                                    // bottom-[XXrem]: 下のパネル上端からの垂直位置。数値を大きくすると上に移動します。
                                    //                 アリアの肩のミミ（ひよこ）の手に重なるように調整しました。
                                    // left-1/2:       画面中央に配置
                                    // -ml-[XXrem]:    中央からの水平位置の微調整。数値を大きくすると左に移動します。
                                    className: "absolute bottom-[7.5rem] left-1/2 -ml-[11.0rem] z-20" })), jsxs("div", { className: "absolute bottom-full left-1/2 -translate-x-1/2 flex items-end justify-center w-auto h-48 mb-[-4rem]", children: [jsx("div", { className: "w-48 h-48", children: jsx(Aria, { className: "w-full h-full" }) }), (phase === GamePhase.BETTING || phase === GamePhase.ANSWERING) && (jsx("div", { className: "w-32 h-32 ml-[-1rem] mb-12", children: renderProblemIllustration() }))] }), (phase === GamePhase.QUESTION_SELECTION && isTraining) && renderQuestionSelectionPhase(), (phase === GamePhase.BETTING) && renderBettingPhase(), (phase === GamePhase.ANSWERING) && renderAnsweringPhase()] }) })] })] }), phase === GamePhase.ANIMATING && renderAnimation(), phase === GamePhase.RESULT && renderResultPhase()] }));
};
export default GameScreen;
