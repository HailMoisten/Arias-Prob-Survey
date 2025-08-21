import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
const HintSignboard = ({ hintText, className = '', style = {} }) => {
    const katexContainerRef = useRef(null);
    useEffect(() => {
        const container = katexContainerRef.current;
        if (container && hintText && typeof renderMathInElement !== 'undefined' && typeof katex !== 'undefined') {
            try {
                renderMathInElement(container, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false },
                    ],
                    throwOnError: false,
                });
            }
            catch (e) {
                console.error('KaTeX auto-render error:', e);
            }
        }
    }, [hintText]);
    return (_jsxs("div", { className: `relative bg-yellow-700 border-1 border-yellow-700/80 rounded-lg p-1 shadow-lg backdrop-blur-sm transform -rotate-12 w-24 ${className}`, style: style, children: [_jsx("div", { className: "bg-amber-50/80 rounded p-1 border-1 border-amber-800/50 h-12 flex items-center justify-center", children: _jsx("div", { ref: katexContainerRef, className: "text-yellow-900 font-sans text-sm text-center", children: hintText }) }), _jsx("div", { className: "absolute -bottom-10 left-1/2 -translate-x-1/2 w-2 h-10 bg-yellow-700 border-x-1 border-yellow-700/80" })] }));
};
export default HintSignboard;
