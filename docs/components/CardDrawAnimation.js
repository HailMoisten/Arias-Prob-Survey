import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState, useMemo } from 'react';
import Aria from './Aria.js';
const PlayingCard = ({ isFlipped, rank, suit }) => {
    const suitColor = ['♥', '♦'].includes(suit) ? 'text-red-500' : 'text-gray-800';
    return (jsxs("div", { className: `relative w-16 h-24 sm:w-20 sm:h-28 transition-transform duration-500`, style: { transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }, children: [jsx("div", { className: "absolute w-full h-full bg-blue-500 rounded-lg border-2 border-white p-1 flex justify-center items-center", style: { backfaceVisibility: 'hidden' }, children: jsx("div", { className: "w-full h-full border-2 border-dashed border-blue-300 rounded-md" }) }), jsxs("div", { className: "absolute w-full h-full bg-white rounded-lg border-2 border-gray-200 flex flex-col justify-between p-1", style: { backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }, children: [jsxs("div", { className: `text-left text-base sm:text-lg font-bold ${suitColor}`, children: [jsx("div", { className: "text-center", children: rank }), jsx("div", { className: "text-center -mt-1 sm:-mt-2", children: suit })] }), jsxs("div", { className: `text-right text-base sm:text-lg font-bold ${suitColor} transform rotate-180`, children: [jsx("div", { className: "text-center", children: rank }), jsx("div", { className: "text-center -mt-1 sm:-mt-2", children: suit })] })] })] }));
};
const NumberCard = ({ isFlipped, number }) => {
    return (jsxs("div", { className: `relative w-16 h-24 sm:w-20 sm:h-28 transition-transform duration-500`, style: { transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }, children: [jsx("div", { className: "absolute w-full h-full bg-green-500 rounded-lg border-2 border-white p-1 flex justify-center items-center", style: { backfaceVisibility: 'hidden' }, children: jsx("div", { className: "w-full h-full border-2 border-dashed border-green-300 rounded-md" }) }), jsx("div", { className: "absolute w-full h-full bg-white rounded-lg border-2 border-gray-200 flex flex-col justify-center items-center p-2", style: { backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }, children: jsx("span", { className: "text-4xl sm:text-5xl font-bold text-gray-800", children: number }) })] }));
};
const CardDrawAnimation = ({ question, isWin, onAnimationEnd }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    useEffect(() => {
        const timer1 = setTimeout(() => setIsFlipped(true), 1000);
        const timer2 = setTimeout(onAnimationEnd, 3500);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onAnimationEnd]);
    const { cards, resultText } = useMemo(() => {
        let text;
        let cardData = [];
        const numCards = question.cardsToDraw || 1;
        if (question.type === 'numberCard') {
            text = isWin ? { en: "You win!", ja: "あたり！" } : { en: "You lose...", ja: "はずれ…" };
            let numbers = [];
            if (numCards === 3) {
                numbers = isWin ? ['1', '2', '4'] : ['1', '2', '3']; // even vs odd
            }
            else { // 5 cards
                numbers = isWin ? ['1', '2', '3', '4', '0'] : ['0', '1', '2', '3', '4']; // valid vs invalid start
            }
            cardData = numbers.map(n => ({ type: 'numberCard', number: n }));
        }
        else { // 'trump'
            if (numCards === 1) { // cards-1-ace
                text = isWin ? { en: `It's an Ace!`, ja: 'エースだ！' } : { en: `Not an Ace...`, ja: 'エースじゃない…' };
                const rank = isWin ? 'A' : '7';
                const suit = isWin ? '♥' : '♣';
                cardData = [{ type: 'trump', rank, suit }];
            }
            else { // 5 card hands
                text = isWin ? { en: `It's a winning hand!`, ja: '当たり役だ！' } : { en: `Not a winning hand...`, ja: '役なしだ…' };
                let hand;
                if (question.id === 'cards-5-flush') {
                    hand = isWin
                        ? [{ rank: 'A', suit: '♥' }, { rank: 'K', suit: '♥' }, { rank: 'J', suit: '♥' }, { rank: '8', suit: '♥' }, { rank: '5', suit: '♥' }]
                        : [{ rank: 'A', suit: '♥' }, { rank: 'K', suit: '♥' }, { rank: 'J', suit: '♥' }, { rank: '8', suit: '♥' }, { rank: '5', suit: '♠' }];
                }
                else if (question.id === 'cards-5-two-pair') {
                    hand = isWin
                        ? [{ rank: 'A', suit: '♥' }, { rank: 'A', suit: '♦' }, { rank: 'K', suit: '♣' }, { rank: 'K', suit: '♠' }, { rank: '5', suit: '♥' }]
                        : [{ rank: 'A', suit: '♥' }, { rank: 'A', suit: '♦' }, { rank: 'J', suit: '♣' }, { rank: '8', suit: '♠' }, { rank: '5', suit: '♥' }];
                }
                else { // three of a kind
                    hand = isWin
                        ? [{ rank: 'A', suit: '♥' }, { rank: 'A', suit: '♦' }, { rank: 'A', suit: '♣' }, { rank: 'K', suit: '♠' }, { rank: '5', suit: '♥' }]
                        : [{ rank: 'A', suit: '♥' }, { rank: 'A', suit: '♦' }, { rank: 'J', suit: '♣' }, { rank: '8', suit: '♠' }, { rank: '5', suit: '♥' }];
                }
                cardData = hand.map(c => ({ type: 'trump', rank: c.rank, suit: c.suit }));
            }
        }
        return { cards: cardData, resultText: text };
    }, [question, isWin]);
    return (jsxs("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 overflow-hidden", children: [jsx(Aria, { className: "absolute bottom-4 right-4 w-28 h-28 animate-excited z-10" }), jsxs("div", { className: "relative w-full flex justify-center items-center gap-1 px-2", style: { perspective: '1000px' }, children: [cards.map((card, i) => (jsx("div", { className: "animate-swoop-in", style: { animationDelay: `${i * 150}ms`, opacity: 0, transform: 'scale(0.5) translateY(-50px)' }, children: card.type === 'trump'
                            ? jsx(PlayingCard, { isFlipped: isFlipped, rank: card.rank, suit: card.suit })
                            : jsx(NumberCard, { isFlipped: isFlipped, number: card.number }) }, i))), isFlipped && (jsx("div", { className: "absolute inset-x-0 -bottom-12 flex justify-center items-center", children: jsx("div", { className: "bg-white/90 rounded-xl px-6 py-3 text-2xl font-bold animate-swoop-in shadow-xl border-2 border-white text-gray-700", children: [jsx("p", { className: "text-xs text-center", children: resultText.en }), jsx("p", { children: resultText.ja })] }) }))] })] }));
};
export default CardDrawAnimation;
