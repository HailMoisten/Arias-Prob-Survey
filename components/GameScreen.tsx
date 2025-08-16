

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameMode, Question, Fraction, GamePhase, TextContent, GameResult, AnswerAccuracy } from '../types';
import { useGameState } from '../hooks/useGameState';
import { getQuestion, trainingCategories, QuestionOptions } from '../services/questionService';
import { simplifyFraction } from '../utils/math';
import { MAX_BET } from '../constants';

import Header from './Header';
import QuestionDisplay from './QuestionDisplay';
import SliderInput from './SliderInput';
import FractionInput from './FractionInput';
import Button from './Button';
import Modal from './Modal';
import Card from './Card';
import TextWithFurigana from './TextWithFurigana';
import BallDrawAnimation from './BallDrawAnimation';
import DiceRollAnimation from './DiceRollAnimation';
import CardDrawAnimation from './CardDrawAnimation';
import CoinFlipAnimation from './CoinFlipAnimation';
import Aria from './Aria';
import SpeechBubble from './SpeechBubble';
import HintSignboard from './HintSignboard';

interface GameScreenProps {
  mode: GameMode;
}

const BallDisplay: React.FC<{ redBalls: number; whiteBalls: number; }> = ({ redBalls, whiteBalls }) => {
  const totalBalls = redBalls + whiteBalls;
  const seedrandom = (seed: number) => { let x = Math.sin(seed) * 10000; return x - Math.floor(x); };
  const balls = Array.from({ length: totalBalls }).map((_, i) => ({ isRed: i < redBalls, cx: 60 + seedrandom(i * 10) * 80, cy: 40 + seedrandom(i * 20) * 20 }));
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-lg animate-bounce-sm" style={{animationDuration: '2s'}}>
        <path d="M 70 50 C 40 120, 160 120, 130 50 Q 100 65 70 50 Z" fill="#a16207" stroke="#854d0e" strokeWidth="2" />
        {balls.map((ball, i) => <circle key={i} cx={ball.cx} cy={ball.cy} r="8" fill={ball.isRed ? '#ef4444' : '#f9fafb'} stroke="#00000033" strokeWidth="1" />)}
      </svg>
    </div>
  );
};

const DiceDisplay: React.FC<{ count: number }> = ({ count }) => (
  <div className="relative w-full h-full flex items-center justify-center space-x-1">
      {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
          <div key={i} className="w-10 h-10 bg-white rounded-lg shadow-md border-2 border-gray-300 p-1 transform -rotate-12">
              <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50%" cy="50%" r="10" fill="black" /></svg>
          </div>
      ))}
  </div>
);

const CoinDisplay: React.FC<{ count: number }> = ({ count }) => (
  <div className="relative w-full h-full flex items-center justify-center space-x-[-1rem]">
      {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
          <div key={i} className="w-12 h-12 bg-yellow-400 rounded-full shadow-md border-4 border-yellow-500 flex items-center justify-center transform -rotate-12">
            <span className="text-2xl font-bold text-yellow-800">☆</span>
          </div>
      ))}
  </div>
);

const CardStackDisplay: React.FC<{ count: number, type: 'trump' | 'numberCard' }> = ({ count, type }) => {
    const cardColor = type === 'trump' ? 'bg-blue-500' : 'bg-green-500';
    const cardElements = [];
    const maxCards = Math.min(count, 5);

    for (let i = 0; i < maxCards; i++) {
        // This creates a fanned out effect.
        const rotation = (i - (maxCards - 1) / 2) * 10;
        cardElements.push(
            <div 
                key={i} 
                className={`w-12 h-16 ${cardColor} rounded-md shadow-lg border-2 border-white transform absolute`}
                style={{ transform: `rotate(${rotation}deg) translateY(${Math.abs(rotation) * 0.5}px)`, zIndex: i }}
            ></div>
        );
    }
    
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {cardElements}
        </div>
    );
};


const GameScreen: React.FC<GameScreenProps> = ({ mode }) => {
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

  const [question, setQuestion] = useState<Question>(() => isTraining ? ({} as Question) : getQuestion({ mode: GameMode.NORMAL }));
  const [phase, setPhase] = useState<GamePhase>(isTraining ? GamePhase.QUESTION_SELECTION : GamePhase.BETTING);
  
  const [selectedCategory, setSelectedCategory] = useState<QuestionOptions['type'] | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);

  const [betAmount, setBetAmount] = useState(isTraining ? 1 : 1);
  const [answerMethod, setAnswerMethod] = useState<'slider' | 'fraction'>('slider');
  const [sliderValue, setSliderValue] = useState<number>(50);
  const [fractionValue, setFractionValue] = useState<Fraction>({ numerator: '', denominator: '' });
  
  const [trainingWinnings, setTrainingWinnings] = useState(0);

  const [result, setResult] = useState<GameResult | null>(null);

  const currentChips = isTraining ? playerState.trainingChips : playerState.chips;

  const handleStartTrainingQuestion = () => {
    if (!selectedCategory || !selectedSubType) return;
    const newQuestion = getQuestion({
      mode: GameMode.TRAINING,
      type: selectedCategory,
      subType: selectedSubType as any,
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
    let resultMessage: TextContent;
    let accuracy: AnswerAccuracy = 'incorrect';
    let bonusMessage: TextContent | undefined;

    if (answerMethod === 'slider') {
      const correctPercentage = correctProbability * 100;
      const approximatedCorrectPercentage = Math.round(correctPercentage / 5) * 5;
      const diff = Math.abs(sliderValue - approximatedCorrectPercentage);

      if (diff === 0) { // Exact match to 5% increment
        accuracy = 'approximate';
        chipChange = isWin ? betAmount * (odds - 1) : 0;
        bonusMessage = { ja: "はずれでも全部返ってくる！", en: "Bet is safe!" };
        resultMessage = isWin ? { en: "You win!", ja: "あたり！" } : { en: "Miss...", ja: "はずれ…"};
      } else if (diff === 5) { // Near miss by 5%
        accuracy = 'near-miss';
        const refund = isTraining ? 0 : Math.round(betAmount / 2);
        chipChange = isWin ? betAmount * (odds - 1) : -refund;
        bonusMessage = { ja: "はずれでも半分返ってくる！", en: "Half of your bet is returned!" };
        resultMessage = isWin ? { en: "You win!", ja: "あたり！" } : { en: "Miss...", ja: "はずれ…"};
      } else { // Incorrect
        accuracy = 'incorrect';
        chipChange = isWin ? betAmount * (odds - 1) : (isTraining ? 0 : -betAmount);
        bonusMessage = { ja: "不正解...", en: "Incorrect..." };
        resultMessage = isWin ? { en: "You win!", ja: "あたり！" } : { en: "Miss...", ja: "はずれ…"};
      }
    } else { // Fraction method
      const num = parseInt(fractionValue.numerator, 10);
      const den = parseInt(fractionValue.denominator, 10);
      const simplifiedUser = (num && den) ? simplifyFraction(num, den) : {numerator: 0, denominator: 1};
      const simplifiedCorrect = simplifyFraction(correctN, correctD);

      if (simplifiedUser.numerator === simplifiedCorrect.numerator && simplifiedUser.denominator === simplifiedCorrect.denominator) {
        accuracy = 'exact';
        odds = Math.max(2, Math.round(1 / correctProbability) || 2);
        if (isWin) {
            chipChange = betAmount * (odds - 1);
            bonusMessage = { ja: `ボーナスでオッズが${odds}倍に！`, en: `Odds are x${odds}!` };
            resultMessage = { en: "You win!", ja: "あたり！" };
        } else {
            chipChange = 0;
            bonusMessage = { ja: 'ベットは返ってくるよ！', en: 'Your bet is returned!' };
            resultMessage = { en: "Miss...", ja: "はずれ…" };
        }
      } else {
        accuracy = 'incorrect';
        chipChange = isWin ? betAmount * (odds - 1) : (isTraining ? 0 : -betAmount);
        resultMessage = isWin ? { en: "You win!", ja: "あたり！" } : { en: "Miss...", ja: "はずれ…"};
      }
    }
    
    setResult({ isWin, chipChange, odds, correctProbability, resultMessage, accuracy, bonusMessage });
    setPhase(GamePhase.ANIMATING);
  };

  const handleAnimationEnd = useCallback(() => {
    if (!result) return;
    const { chipChange } = result;
     if (isTraining) {
      if (chipChange > 0) {
        setTrainingWinnings(prev => prev + chipChange);
      }
    } else {
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
      setQuestion({} as Question);
      setSelectedCategory(null);
      setSelectedSubType(null);
      setBetAmount(1);
      setSliderValue(50);
      setFractionValue({ numerator: '', denominator: '' });
      setTrainingWinnings(0);
  };

  const ariaMessage = useMemo(() => {
    switch(phase) {
      case GamePhase.QUESTION_SELECTION: return {en: "What would you like to practice?", ja: "何を練習する？"};
      case GamePhase.BETTING: return {en: "Here's the question!", ja: "問題だよ！賭ける？"};
      case GamePhase.ANSWERING: return {en: "What's the probability?", ja: "勝率はどれくらい？"};
      case GamePhase.RESULT: return result?.isWin ? {en: "Congratulations!", ja: "おめでとう！"} : {en: "Too bad! Try again!", ja: "残念！また挑戦してね"};
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

  const renderQuestionSelectionPhase = () => (
    <Card className="z-10 relative w-full text-center">
        <TextWithFurigana content={{ en: 'Select Category', ja: 'カテゴリを選択' }} />
        <div className="grid grid-cols-3 gap-2 my-4">
            {trainingCategories.map(cat => (
                <button key={cat.type} onClick={() => { setSelectedCategory(cat.type); setSelectedSubType(null); }} className={`p-2 rounded-lg transition ${selectedCategory === cat.type ? 'bg-yellow-400 text-gray-800 shadow-inner' : 'bg-white hover:bg-yellow-100'}`}>
                    <TextWithFurigana content={cat.text} jaClass="text-sm" enClass="text-xs" />
                </button>
            ))}
        </div>

        {selectedCategory && (
             <>
                <div className="w-full h-px bg-yellow-200 my-3"></div>
                <TextWithFurigana content={{ en: 'Select Type', ja: 'タイプを選択' }} />
                <div className="grid grid-cols-2 gap-2 my-4">
                    {trainingCategories.find(c => c.type === selectedCategory)?.subTypes?.map(sub => (
                        <button key={sub.subType} onClick={() => setSelectedSubType(sub.subType)} className={`p-2 rounded-lg transition ${selectedSubType === sub.subType ? 'bg-yellow-400 text-gray-800 shadow-inner' : 'bg-white hover:bg-yellow-100'}`}>
                            <TextWithFurigana content={sub.text} jaClass="text-sm" enClass="text-xs" />
                        </button>
                    ))}
                </div>
            </>
        )}
        
        <Button text={{en: 'Start', ja: 'この問題で練習！'}} onClick={handleStartTrainingQuestion} disabled={!selectedCategory || !selectedSubType} />
    </Card>
  );

  const renderBettingPhase = () => (
    <Card className="z-10 relative w-full">
        {isTraining ? (
            <div className="text-center my-2">
                <TextWithFurigana content={{en: 'Bet Amount', ja: 'ベット枚数'}} jaClass="text-base" enClass="text-xs" />
                <p className="text-3xl font-bold text-orange-600 w-16 text-center mx-auto mt-1">1</p>
                <p className="text-xs text-gray-500 font-jp">(トレーニングは1枚固定)</p>
            </div>
         ) : (
            <>
                <TextWithFurigana content={{en: 'How many Mimichips to bet?', ja: '何枚賭ける？'}} jaClass="text-lg" enClass="text-sm" />
                <div className="flex items-center space-x-4 my-4">
                    <input type="range" min="0" max={Math.min(MAX_BET, currentChips)} value={betAmount} onChange={(e) => setBetAmount(parseInt(e.target.value))} className="w-full h-3 bg-yellow-200 rounded-lg appearance-none cursor-pointer range-lg accent-orange-500" />
                    <span className="text-3xl font-bold text-orange-600 w-16 text-center">{betAmount}</span>
                </div>
            </>
         )}
        <Button text={{en: 'Bet', ja: '賭ける'}} onClick={handleBet} disabled={!isTraining && currentChips < betAmount} />
      </Card>
  );

  const renderAnsweringPhase = () => (
      <Card className="z-10 relative w-full">
        <div className="flex justify-center mb-4 rounded-lg bg-yellow-200 p-1">
            <button onClick={() => setAnswerMethod('slider')} className={`w-1/2 py-2 rounded-md transition ${answerMethod === 'slider' ? 'bg-white shadow' : ''}`}>
                <TextWithFurigana content={{en: 'Approximate', ja: 'おおよそ'}} />
            </button>
            <button onClick={() => setAnswerMethod('fraction')} className={`w-1/2 py-2 rounded-md transition ${answerMethod === 'fraction' ? 'bg-white shadow' : ''}`}>
                <TextWithFurigana content={{en: 'Exact', ja: 'ピッタリ'}} />
            </button>
        </div>
        {answerMethod === 'slider' ? (
          <SliderInput value={sliderValue} onChange={(e) => setSliderValue(parseInt(e.target.value))} />
        ) : (
          <FractionInput value={fractionValue} onChange={setFractionValue} />
        )}
         <Button text={{en: 'Answer', ja: '回答する'}} onClick={handleSubmitAnswer} className="mt-6" disabled={!canSubmitAnswer} variant="primary" />
      </Card>
  );
  
  const getAccuracyText = (accuracy: AnswerAccuracy): TextContent => {
    switch(accuracy){
      case 'exact': return { en: 'Exact Answer!', ja: 'ピッタリ正解！' };
      case 'approximate': return { en: 'Approximate Answer!', ja: 'おおよそ正解！' };
      case 'near-miss': return { en: 'Approximate Near Miss!', ja: 'おおよそニアピン！' };
      default: return { en: 'Incorrect Answer', ja: '不正解…' };
    }
  }

  const renderResultPhase = () => (
      <Modal isOpen={true}>
          <div className="text-center space-y-4 max-h-[90vh] overflow-y-auto pr-2 pb-2">
              <div className="space-y-3">
                 <Card>
                    <TextWithFurigana content={{en: "Bet Result", ja: "賭けの結果"}} jaClass="text-sm" enClass="text-xs" containerClass="text-left text-gray-500" />
                    <div className="w-full h-px bg-gray-200 my-1"></div>
                    <TextWithFurigana content={result!.resultMessage} jaClass="text-xl font-bold" enClass="text-sm" />
                 </Card>

                <Card>
                    <TextWithFurigana content={{en: "Answer Accuracy", ja: "回答の答え合わせ"}} jaClass="text-sm" enClass="text-xs" containerClass="text-left text-gray-500" />
                    <div className="w-full h-px bg-gray-200 my-1"></div>
                    <TextWithFurigana content={getAccuracyText(result!.accuracy)} jaClass="text-xl font-bold" enClass="text-sm" />
                    {result!.bonusMessage && (
                        <div className="mt-1 text-center">
                            <TextWithFurigana content={result!.bonusMessage} jaClass="text-sm" enClass="text-xs" containerClass="text-orange-500 font-bold"/>
                        </div>
                    )}
                    <p className="text-sm space-y-1 text-gray-600 mt-2">正解の確率: {Math.round(result!.correctProbability * 100)}% ({simplifyFraction(question.answer.numerator, question.answer.denominator).numerator}/{simplifyFraction(question.answer.numerator, question.answer.denominator).denominator})</p>
                </Card>

                <Card className="bg-yellow-100/50">
                    <TextWithFurigana content={isTraining ? {en: 'Earned Training Chips', ja: '獲得練習チップ'} : {en: 'Earned Mimichips', ja: '獲得ミミチップ'}} jaClass="text-sm" enClass="text-xs" />
                    <p className={`text-4xl font-bold ${result!.chipChange > 0 ? 'text-green-500' : result!.chipChange < 0 ? 'text-red-500' : 'text-gray-600'}`}>
                        {result!.chipChange > 0 ? '+' : ''}{result!.chipChange}
                    </p>
                </Card>
              </div>

              {isTraining ? (
                <div className="flex flex-col space-y-2">
                    <Button text={{en: 'Try Again', ja: 'もう一度'}} onClick={handleRestartTraining} variant="primary" />
                    <Button text={{en: 'Back to Home', ja: 'ホームに戻る'}} onClick={handleGoHome} variant="secondary" />
                </div>
              ) : (
                <Button text={{en: 'Back to Home', ja: 'ホームに戻る'}} onClick={handleGoHome} />
              )}
          </div>
      </Modal>
  );

  const renderAnimation = () => {
    if (!result) return null;
    const props = {
        question: question,
        isWin: result.isWin,
        onAnimationEnd: handleAnimationEnd,
    };
    switch(question.type) {
        case 'ball': return <BallDrawAnimation {...props} />;
        case 'dice': return <DiceRollAnimation {...props} />;
        case 'trump':
        case 'numberCard': return <CardDrawAnimation {...props} />;
        case 'coin': return <CoinFlipAnimation {...props} />;
        default: return null;
    }
  }
  
  const renderProblemIllustration = () => {
      switch (question.type) {
        case 'ball':
          return <BallDisplay redBalls={question.redBalls ?? 0} whiteBalls={question.whiteBalls ?? 0} />;
        case 'dice':
            return <DiceDisplay count={question.diceCount ?? 1} />;
        case 'coin':
            return <CoinDisplay count={question.coinCount ?? 1} />;
        case 'trump':
        case 'numberCard':
            return <CardStackDisplay count={question.cardsToDraw ?? 1} type={question.type} />;
        default:
          return null;
      }
  }

  return (
    <div className={`flex flex-col h-screen ${isTraining ? 'bg-gray-100' : 'bg-yellow-30'}`}>
      <Header mode={mode} onHomeClick={handleGoHome} sessionChips={isTraining ? trainingWinnings : undefined} />
      <main className="flex-grow p-4 flex flex-col overflow-y-auto">
        <div className="mb-4">
          {(phase === GamePhase.BETTING || phase === GamePhase.ANSWERING) && (
              <QuestionDisplay question={question} />
          )}
        </div>

        <div className="mt-auto flex flex-col items-center space-y-2">
            {ariaMessage && <SpeechBubble message={ariaMessage} className="relative z-20" />}
            
            <div className="relative w-full pt-16">
              <div className="relative z-10">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 flex items-end justify-center w-auto h-48 mb-[-4rem]">
                    {/* 看板の位置調整コメント: top, left, transformの値を変更して位置を微調整できます */}
                    {phase === GamePhase.ANSWERING && question.hint && (
                        <HintSignboard 
                            hintText={question.hint} 
                            className="z-20"
                            style={{ top: '0.3rem', left: '-0.5rem' }} 
                        />
                    )}
                    <div className="w-48 h-48">
                      <Aria className="w-full h-full"/>
                    </div>
                    {(phase === GamePhase.BETTING || phase === GamePhase.ANSWERING) && (
                      <div className="w-32 h-32 ml-[-1rem] mb-12">
                         {renderProblemIllustration()}
                      </div>
                    )}
                </div>
                {(phase === GamePhase.QUESTION_SELECTION && isTraining) && renderQuestionSelectionPhase()}
                {(phase === GamePhase.BETTING) && renderBettingPhase()}
                {(phase === GamePhase.ANSWERING) && renderAnsweringPhase()}
              </div>
            </div>
        </div>
      </main>
      {phase === GamePhase.ANIMATING && renderAnimation()}
      {phase === GamePhase.RESULT && renderResultPhase()}
    </div>
  );
};

export default GameScreen;