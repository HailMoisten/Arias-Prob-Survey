import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const TextWithFurigana = ({ content, jaClass = 'text-lg', enClass = 'text-xs', containerClass = 'text-center', }) => {
    return (_jsxs("div", { className: containerClass, children: [_jsx("p", { className: `${enClass} text-orange-500 font-sans`, children: content.en }), _jsx("p", { className: `${jaClass} text-gray-700 font-jp font-bold`, children: content.ja })] }));
};
export default TextWithFurigana;
