import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState.tsx';
import TextWithFurigana from './TextWithFurigana.tsx';
import { GameMode, TextContent } from '../types.ts';

interface HeaderProps {
    mode?: GameMode;
    title?: TextContent;
    onHomeClick?: () => void;
    sessionChips?: number;
}

const Header: React.FC<HeaderProps> = ({ mode, title, onHomeClick, sessionChips }) => {
  const { playerState } = useGameState();
  const [imageData, setImageData] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const prevChips = useRef<number | undefined>(undefined);

  useEffect(() => {
    fetch('./data/base64/mimichip.txt')
      .then(response => response.text())
      .then(data => setImageData(data.trim()));
  }, []);
  
  const defaultTitle = { en: "Aria's Probability Survey", ja: "アリアの確率調査" };
  const titleToShow = title || defaultTitle;

  const chipsLabel = { en: 'Mimichips', ja: 'ミミチップ' };
  const trainingChipsLabel = { en: 'Earned Training Chips', ja: '獲得練習チップ' };

  const isTraining = mode === GameMode.TRAINING;
  const chipsToShow = isTraining ? (sessionChips ?? 0) : playerState.chips;
  const labelToShow = isTraining ? trainingChipsLabel : chipsLabel;

  useEffect(() => {
    if (prevChips.current !== undefined && prevChips.current !== chipsToShow) {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 500);
        return () => clearTimeout(timer);
    }
    prevChips.current = chipsToShow;
  }, [chipsToShow]);

  return (
    <header className="p-4 bg-white/50 shadow-md z-20 relative">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          {onHomeClick ? (
            <button
              onClick={onHomeClick}
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors duration-200 font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <TextWithFurigana content={{ en: 'Back to Home', ja: 'ホームに戻る' }} jaClass="text-lg" enClass="text-xs" containerClass="text-left" />
            </button>
          ) : (
            <TextWithFurigana content={titleToShow} jaClass="text-xl" enClass="text-xs" containerClass="text-left" />
          )}
        </div>
        <div className="text-right">
            <TextWithFurigana content={labelToShow} jaClass="text-sm" enClass="text-xs" containerClass="text-right" />
            <div className="flex items-center justify-end">
                <span className={`text-2xl font-bold mr-1 ${isTraining ? 'text-gray-600' : 'text-amber-500'} ${isAnimating ? 'animate-chip-pop' : ''}`}>{chipsToShow}</span>
                <img src={imageData} alt="ミミチップ" className="h-6 w-6" />
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;