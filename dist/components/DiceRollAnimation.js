import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState, useMemo } from 'react';
import Aria from './Aria.js';
const DiceFace = ({ face }) => {
    const dotPositions = {
        1: [{ cx: '50%', cy: '50%' }],
        2: [{ cx: '25%', cy: '25%' }, { cx: '75%', cy: '75%' }],
        3: [{ cx: '25%', cy: '25%' }, { cx: '50%', cy: '50%' }, { cx: '75%', cy: '75%' }],
        4: [{ cx: '25%', cy: '25%' }, { cx: '75%', cy: '25%' }, { cx: '25%', cy: '75%' }, { cx: '75%', cy: '75%' }],
        5: [{ cx: '25%', cy: '25%' }, { cx: '75%', cy: '25%' }, { cx: '50%', cy: '50%' }, { cx: '25%', cy: '75%' }, { cx: '75%', cy: '75%' }],
        6: [{ cx: '25%', cy: '25%' }, { cx: '75%', cy: '25%' }, { cx: '25%', cy: '50%' }, { cx: '75%', cy: '50%' }, { cx: '25%', cy: '75%' }, { cx: '75%', cy: '75%' }],
    };
    return (jsx("svg", { viewBox: "0 0 100 100", className: "w-full h-full", children: dotPositions[face]?.map((pos, i) => (jsx("circle", { cx: pos.cx, cy: pos.cy, r: "10", fill: "black" }, i))) }));
};
const DiceRollAnimation = ({ question, isWin, onAnimationEnd }) => {
    const [isAnimating, setIsAnimating] = useState(true);
    const [rollingFace, setRollingFace] = useState(1);
    useEffect(() => {
        const rollInterval = setInterval(() => {
            setRollingFace(Math.floor(Math.random() * 6) + 1);
        }, 100);
        const timer1 = setTimeout(() => {
            clearInterval(rollInterval);
            setIsAnimating(false);
        }, 2000);
        const timer2 = setTimeout(onAnimationEnd, 3500);
        return () => {
            clearInterval(rollInterval);
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onAnimationEnd]);
    const { winningFaces, losingFaces } = useMemo(() => {
        if (question.id === 'dice-roll-6') {
            return { winningFaces: [6], losingFaces: [1, 2, 3, 4, 5] };
        }
        if (question.id === 'dice-roll-even') {
            return { winningFaces: [2, 4, 6], losingFaces: [1, 3, 5] };
        }
        // Fallback for other questions
        return { winningFaces: [3], losingFaces: [1, 2, 4, 5, 6] };
    }, [question.id]);
    const resultFace = isWin
        ? winningFaces[Math.floor(Math.random() * winningFaces.length)]
        : losingFaces[Math.floor(Math.random() * losingFaces.length)];
    const resultText = { en: `It's a ${resultFace}!`, ja: `${resultFace}が出た！` };
    return (jsxs("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 overflow-hidden", children: [jsx(Aria, { className: "absolute bottom-4 right-4 w-28 h-28 animate-excited z-10" }), jsxs("div", { className: "relative w-64 h-64 flex justify-center items-center", children: [isAnimating ? (jsx("div", { className: "w-24 h-24 bg-white rounded-2xl animate-dice-roll border-2 border-gray-300 p-2 shadow-lg", children: jsx(DiceFace, { face: rollingFace }) })) : (jsx("div", { className: "w-24 h-24 bg-white rounded-2xl border-2 border-gray-300 animate-swoop-in p-2 shadow-lg", children: jsx(DiceFace, { face: resultFace }) })), !isAnimating && (jsx("div", { className: "absolute inset-x-0 -bottom-8 flex justify-center items-center", children: jsx("div", { className: "bg-white/90 rounded-xl px-6 py-3 text-2xl font-bold animate-swoop-in shadow-xl border-2 border-white text-gray-700", children: [jsx("p", { className: "text-xs text-center", children: resultText.en }), jsx("p", { children: resultText.ja })] }) }))] })] }));
};
export default DiceRollAnimation;
