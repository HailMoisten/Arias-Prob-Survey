
import React, { useEffect, useState, useMemo } from 'react';
import { Question } from '../types';
import Aria from './Aria';

interface BallDrawAnimationProps {
  question: Question;
  isWin: boolean;
  onAnimationEnd: () => void;
}

const BallDrawAnimation: React.FC<BallDrawAnimationProps> = ({ question, isWin, onAnimationEnd }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 500),   // Hand appears
      setTimeout(() => setStep(2), 1500),  // Hand goes into bag
      setTimeout(() => setStep(3), 3000),  // Hand reveals ball(s)
      setTimeout(onAnimationEnd, 4500),    // End animation and show result modal
    ];
    return () => timers.forEach(clearTimeout);
  }, [onAnimationEnd]);

  const isDrawTwoProblem = question.id === 'random-ball-draw-2-at-least-one-red' || question.id === 'random-ball-draw-2-both-red';

  const { ball1Color, ball2Color, drawnBallText } = useMemo(() => {
    if (isDrawTwoProblem) {
      let b1 = '#f9fafb'; // white
      let b2 = '#f9fafb'; // white
      let text = { en: 'Two White Balls...', ja: '白玉2個…' };

      if (question.id === 'random-ball-draw-2-at-least-one-red') {
        if (isWin) {
          b1 = '#ef4444'; // red
          text = { en: 'One Red, One White!', ja: '赤玉1個、白玉1個！' };
        }
      } else { // random-ball-draw-2-both-red
        if (isWin) {
          b1 = '#ef4444'; // red
          b2 = '#ef4444'; // red
          text = { en: 'Two Red Balls!', ja: '赤玉2個！' };
        } else {
          // Near miss for 'both red' is RW
          b1 = '#ef4444'; // red
          text = { en: 'One Red, One White...', ja: '赤玉1個、白玉1個…' };
        }
      }
      return { ball1Color: b1, ball2Color: b2, drawnBallText: text };
    } else {
      // Single draw logic for all other ball questions
      const color = isWin ? '#ef4444' : '#f9fafb';
      const text = isWin ? { en: 'Red Ball!', ja: '赤玉！' } : { en: 'White Ball!', ja: '白玉！' };
      return { ball1Color: color, ball2Color: null, drawnBallText: text };
    }
  }, [question.id, isWin, isDrawTwoProblem]);


  const redBallsCount = question.redBalls ?? question.answer.numerator;
  const whiteBallsCount = question.whiteBalls ?? (question.answer.denominator - question.answer.numerator);
  const totalBalls = redBallsCount + whiteBallsCount;

  const balls = Array.from({ length: totalBalls }).map((_, i) => ({
    isRed: i < redBallsCount,
    cx: 70 + Math.random() * 60,
    cy: 130 + Math.random() * 30,
  }));

  const getHandTransform = () => {
    switch (step) {
      case 0: return 'translateY(-200px)';
      case 1: return 'translateY(60px)';
      case 2: return 'translateY(120px)';
      case 3: return 'translateY(60px)';
      default: return 'translateY(60px)';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 overflow-hidden">
      <Aria className="absolute bottom-4 right-4 w-28 h-28 animate-excited z-10" />
      <div className="relative w-64 h-64">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
          {/* Changed from bowl to drawstring bag */}
          <path d="M 70 100 C 40 170, 160 170, 130 100 Q 100 115 70 100 Z" fill="#a16207" stroke="#854d0e" strokeWidth="2" />

          <g style={{ display: step < 2 ? 'block' : 'none', transition: 'opacity 0.5s', opacity: step < 2 ? 1 : 0 }}>
            {balls.map((ball, i) => (
              <circle key={i} cx={ball.cx} cy={ball.cy} r="8" fill={ball.isRed ? '#ef4444' : '#f9fafb'} stroke="#00000033" strokeWidth="1" />
            ))}
          </g>

          <g 
            transform={getHandTransform()}
            className="transition-transform duration-1000 ease-in-out"
          >
            <path d="M100,50 Q120,50 120,70 L120,100 L80,100 L80,70 Q80,50 100,50 Z" fill="transparent" stroke="transparent" strokeWidth="2" />
             {isDrawTwoProblem ? (
              <>
                <circle cx="90" cy="80" r="12" fill={ball1Color} stroke="#333" strokeWidth="1" style={{ transition: 'opacity 0.5s', opacity: step === 3 ? 1 : 0 }} />
                <circle cx="110" cy="80" r="12" fill={ball2Color!} stroke="#333" strokeWidth="1" style={{ transition: 'opacity 0.5s', opacity: step === 3 ? 1 : 0 }} />
              </>
            ) : (
              <circle cx="100" cy="80" r="12" fill={ball1Color} stroke="#333" strokeWidth="1" style={{ transition: 'opacity 0.5s', opacity: step === 3 ? 1 : 0 }} />
            )}
          </g>
        </svg>

        {step === 3 && (
          <div className="absolute inset-x-0 -bottom-8 flex justify-center items-center">
            <div
              className="bg-white/90 rounded-xl px-6 py-3 text-2xl font-bold animate-swoop-in shadow-xl border-2 border-white"
              style={{ color: isWin ? '#b91c1c' : '#374151' }}
            >
              <p className="text-xs text-center">{drawnBallText.en}</p>
              <p>{drawnBallText.ja}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BallDrawAnimation;