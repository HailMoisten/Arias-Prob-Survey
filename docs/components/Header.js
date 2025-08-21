import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState.js';
import TextWithFurigana from './TextWithFurigana.js';
import { GameMode } from '../types.js';
const Header = ({ mode, title, onHomeClick, sessionChips }) => {
    const { playerState } = useGameState();
    const [imageData, setImageData] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const prevChips = useRef(undefined);
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
    return (jsx("header", { className: "p-4 bg-white/50 shadow-md z-20 relative", children: jsxs("div", { className: "flex justify-between items-center", children: [jsx("div", { className: "flex-1", children: onHomeClick ? (jsxs("button", { onClick: onHomeClick, className: "flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors duration-200 font-bold", children: [jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), jsx(TextWithFurigana, { content: { en: 'Back to Home', ja: 'ホームに戻る' }, jaClass: "text-lg", enClass: "text-xs", containerClass: "text-left" })] })) : (jsx(TextWithFurigana, { content: titleToShow, jaClass: "text-xl", enClass: "text-xs", containerClass: "text-left" })) }), jsxs("div", { className: "text-right", children: [jsx(TextWithFurigana, { content: labelToShow, jaClass: "text-sm", enClass: "text-xs", containerClass: "text-right" }), jsxs("div", { className: "flex items-center justify-end", children: [jsx("span", { className: `text-2xl font-bold mr-1 ${isTraining ? 'text-gray-600' : 'text-amber-500'} ${isAnimating ? 'animate-chip-pop' : ''}`, children: chipsToShow }), jsx("img", { src: imageData, alt: "ミミチップ", className: "h-6 w-6" })] })] })] }) }));
};
export default Header;
