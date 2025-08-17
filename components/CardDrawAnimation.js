

import React, { useEffect, useState, useMemo } from 'react';
import { Question } from '../types.js';
import Aria from './Aria.js';

interface CardDrawAnimationProps {
  question: Question;
  isWin: boolean;
  onAnimationEnd: () => void;
}

type PlayingCardData = { type: 'trump'; rank: string; suit: string; };
type NumberCardData = { type: 'numberCard'; number: string; };
type CardData = PlayingCardData | NumberCardData;


const PlayingCard: React.FC<{isFlipped: boolean; rank: string; suit: string}> = ({ isFlipped, rank, suit }) => {
    const suitColor = ['♥', '♦'].includes(suit) ? 'text-red-500' : 'text-gray-800';

    return (
        <div className={`relative w-16 h-24 sm:w-20 sm:h-28 transition-transform duration-500`} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
            {/* Card Back */}
            <div className="absolute w-full h-full bg-blue-500 rounded-lg border-2 border-white p-1 flex justify-center items-center" style={{ backfaceVisibility: 'hidden' }}>
                <div className="w-full h-full border-2 border-dashed border-blue-300 rounded-md"></div>
            </div>
            {/* Card Front */}
            <div className="absolute w-full h-full bg-white rounded-lg border-2 border-gray-200 flex flex-col justify-between p-1" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className={`text-left text-base sm:text-lg font-bold ${suitColor}`}>
                    <div className="text-center">{rank}</div>
                    <div className="text-center -mt-1 sm:-mt-2">{suit}</div>
                </div>
                <div className={`text-right text-base sm:text-lg font-bold ${suitColor} transform rotate-180`}>
                    <div className="text-center">{rank}</div>
                    <div className="text-center -mt-1 sm:-mt-2">{suit}</div>
                </div>
            </div>
        </div>
    )
};

const NumberCard: React.FC<{isFlipped: boolean; number: string}> = ({ isFlipped, number }) => {
    return (
        <div className={`relative w-16 h-24 sm:w-20 sm:h-28 transition-transform duration-500`} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
            {/* Card Back */}
            <div className="absolute w-full h-full bg-green-500 rounded-lg border-2 border-white p-1 flex justify-center items-center" style={{ backfaceVisibility: 'hidden' }}>
                <div className="w-full h-full border-2 border-dashed border-green-300 rounded-md"></div>
            </div>
            {/* Card Front */}
            <div className="absolute w-full h-full bg-white rounded-lg border-2 border-gray-200 flex flex-col justify-center items-center p-2" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <span className="text-4xl sm:text-5xl font-bold text-gray-800">{number}</span>
            </div>
        </div>
    );
};


const CardDrawAnimation: React.FC<CardDrawAnimationProps> = ({ question, isWin, onAnimationEnd }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setIsFlipped(true), 1000);
        const timer2 = setTimeout(onAnimationEnd, 3500);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onAnimationEnd]);

    const { cards, resultText } = useMemo((): { cards: CardData[], resultText: { en: string, ja: string } } => {
        let text: { en: string, ja: string };
        let cardData: CardData[] = [];
        
        const numCards = question.cardsToDraw || 1;

        if (question.type === 'numberCard') {
            text = isWin ? { en: "You win!", ja: "あたり！" } : { en: "You lose...", ja: "はずれ…" };
            let numbers: string[] = [];
            if (numCards === 3) {
                 numbers = isWin ? ['1','2','4'] : ['1','2','3']; // even vs odd
            } else { // 5 cards
                 numbers = isWin ? ['1','2','3','4','0'] : ['0','1','2','3','4']; // valid vs invalid start
            }
            cardData = numbers.map(n => ({ type: 'numberCard', number: n }));
        } else { // 'trump'
            if (numCards === 1) { // cards-1-ace
                text = isWin ? { en: `It's an Ace!`, ja: 'エースだ！' } : { en: `Not an Ace...`, ja: 'エースじゃない…' };
                const rank = isWin ? 'A' : '7';
                const suit = isWin ? '♥' : '♣';
                cardData = [{ type: 'trump', rank, suit }];
            } else { // 5 card hands
                text = isWin ? { en: `It's a winning hand!`, ja: '当たり役だ！' } : { en: `Not a winning hand...`, ja: '役なしだ…' };
                let hand: {rank: string, suit: string}[];
                if (question.id === 'cards-5-flush') {
                    hand = isWin 
                        ? [{rank: 'A', suit: '♥'}, {rank: 'K', suit: '♥'}, {rank: 'J', suit: '♥'}, {rank: '8', suit: '♥'}, {rank: '5', suit: '♥'}]
                        : [{rank: 'A', suit: '♥'}, {rank: 'K', suit: '♥'}, {rank: 'J', suit: '♥'}, {rank: '8', suit: '♥'}, {rank: '5', suit: '♠'}];
                } else if (question.id === 'cards-5-two-pair') {
                     hand = isWin 
                        ? [{rank: 'A', suit: '♥'}, {rank: 'A', suit: '♦'}, {rank: 'K', suit: '♣'}, {rank: 'K', suit: '♠'}, {rank: '5', suit: '♥'}]
                        : [{rank: 'A', suit: '♥'}, {rank: 'A', suit: '♦'}, {rank: 'J', suit: '♣'}, {rank: '8', suit: '♠'}, {rank: '5', suit: '♥'}];
                } else { // three of a kind
                     hand = isWin 
                        ? [{rank: 'A', suit: '♥'}, {rank: 'A', suit: '♦'}, {rank: 'A', suit: '♣'}, {rank: 'K', suit: '♠'}, {rank: '5', suit: '♥'}]
                        : [{rank: 'A', suit: '♥'}, {rank: 'A', suit: '♦'}, {rank: 'J', suit: '♣'}, {rank: '8', suit: '♠'}, {rank: '5', suit: '♥'}];
                }
                cardData = hand.map(c => ({ type: 'trump', rank: c.rank, suit: c.suit }));
            }
        }
        return { cards: cardData, resultText: text };
    }, [question, isWin]);
    
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 overflow-hidden">
            <Aria className="absolute bottom-4 right-4 w-28 h-28 animate-excited z-10" />
            <div className="relative w-full flex justify-center items-center gap-1 px-2" style={{ perspective: '1000px' }}>
                {cards.map((card, i) => (
                    <div key={i} className="animate-swoop-in" style={{ animationDelay: `${i * 150}ms`, opacity: 0, transform: 'scale(0.5) translateY(-50px)' }}>
                        {card.type === 'trump'
                            ? <PlayingCard isFlipped={isFlipped} rank={card.rank} suit={card.suit} />
                            : <NumberCard isFlipped={isFlipped} number={card.number} />
                        }
                    </div>
                ))}

                {isFlipped && (
                    <div className="absolute inset-x-0 -bottom-12 flex justify-center items-center">
                        <div className="bg-white/90 rounded-xl px-6 py-3 text-2xl font-bold animate-swoop-in shadow-xl border-2 border-white text-gray-700">
                            <p className="text-xs text-center">{resultText.en}</p>
                            <p>{resultText.ja}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardDrawAnimation;