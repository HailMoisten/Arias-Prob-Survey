import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4", children: _jsxs("div", { className: "bg-yellow-50 rounded-2xl shadow-2xl p-6 m-4 w-full max-w-sm relative animate-swoop-in border-4 border-white", onClick: (e) => e.stopPropagation(), children: [onClose && (_jsx("button", { onClick: onClose, className: "absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" }) }) })), children] }) }));
};
export default Modal;
