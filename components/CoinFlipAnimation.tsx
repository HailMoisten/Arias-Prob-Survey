

import React, { useEffect, useState, useMemo } from 'react';
import { Question } from '../types.ts';
import Aria from './Aria.tsx';

interface CoinFlipAnimationProps {
  question: Question;
  isWin: boolean;
  onAnimationEnd: () => void;
}

const FlippableCoin: React.FC<{ isFlipped: boolean; face: 'H' | 'T' }> = ({ isFlipped, face }) => {
    return (
        <div className={`relative w-20 h-20 transition-transform duration-1000`} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
            {/* Coin Back */}
            <div className="absolute w-full h-full rounded-full bg-gray-400 border-2 border-gray-500 flex justify-center items-center shadow-lg" style={{ backfaceVisibility: 'hidden' }}>
                 <div className="w-10 h-10 rounded-full bg-gray-500 opacity-50"></div>
            </div>
            {/* Coin Front */}
            <div className="absolute w-full h-full rounded-full bg-yellow-400 border-2 border-yellow-600 flex justify-center items-center shadow-lg" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <span className="text-5xl font-bold text-yellow-800">{face === 'H' ? '☆' : ''}</span>
            </div>
        </div>
    );
};


const CoinFlipAnimation: React.FC<CoinFlipAnimationProps> = ({ question, isWin, onAnimationEnd }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setIsFlipped(true), 500);
        const timer2 = setTimeout(onAnimationEnd, 3500);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onAnimationEnd]);

    const { faces, resultText } = useMemo(() => {
        let facesToShow: ('H' | 'T')[] = [];
        let text: { en: string; ja: string };

        if (question.id === 'coin-two-one-head') {
            if (isWin) {
                facesToShow = Math.random() < 0.5 ? ['H', 'T'] : ['T', 'H'];
                text = { en: "Exactly one heads!", ja: "表が1枚！" };
            } else {
                facesToShow = Math.random() < 0.5 ? ['H', 'H'] : ['T', 'T'];
                text = { en: "Not one heads...", ja: "表が1枚じゃない…" };
            }
        } else if (question.id === 'coin-three-at-least-one-head') {
            if (isWin) {
                // Any combination except TTT
                const winOutcomes = [['H','H','H'], ['H','H','T'], ['H','T','H'], ['T','H','H'], ['H','T','T'], ['T','H','T'], ['T','T','H']];
                facesToShow = winOutcomes[Math.floor(Math.random() * winOutcomes.length)] as ('H' | 'T')[];
                text = { en: "At least one heads!", ja: "表が1枚以上！" };
            } else {
                facesToShow = ['T', 'T', 'T'];
                text = { en: "All tails...", ja: "全部裏だ…" };
            }
        }
        return { faces: facesToShow, resultText: text };
    }, [question.id, isWin]);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 overflow-hidden">
            <Aria className="absolute bottom-4 right-4 w-28 h-28 animate-excited z-10" />
            <div className="relative w-full h-64 flex justify-center items-center space-x-4" style={{ perspective: '1000px' }}>
                {faces.map((face, i) => (
                    <div key={i} style={{ animationDelay: `${i * 150}ms` }}>
                        <FlippableCoin isFlipped={isFlipped} face={face} />
                    </div>
                ))}
                
                {isFlipped && (
                    <div className="absolute inset-x-0 -bottom-8 flex justify-center items-center">
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

export default CoinFlipAnimation;