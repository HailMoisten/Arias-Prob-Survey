import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const Card = ({ children, className = '' }) => {
    return (_jsx("div", { className: `bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50 ${className}`, children: children }));
};
export default Card;
