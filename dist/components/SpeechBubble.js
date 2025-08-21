import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import TextWithFurigana from './TextWithFurigana.tsx';
const SpeechBubble = ({ message, animation = 'swoop-in', className = '' }) => {
    if (!message)
        return null;
    const animationClass = animation === 'swoop-in' ? 'animate-swoop-in' : 'animate-bounce-sm';
    return (_jsxs("div", { className: `relative w-max max-w-xs mx-auto bg-white rounded-xl px-4 py-2 shadow-lg text-center text-gray-700 font-jp font-bold ${animationClass} ${className}`, children: [_jsx(TextWithFurigana, { content: message, jaClass: "text-base", enClass: "text-xs" }), _jsx("div", { className: "absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white" })] }));
};
export default SpeechBubble;
