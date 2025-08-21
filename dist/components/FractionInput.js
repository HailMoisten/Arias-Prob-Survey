import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
const FractionInput = ({ value, onChange }) => {
    const [activeField, setActiveField] = useState('numerator');
    const handleNumberClick = (num) => {
        const currentValue = value[activeField];
        const newValue = currentValue === '0' ? num : currentValue + num;
        onChange({ ...value, [activeField]: newValue });
    };
    const handleClear = () => {
        onChange({ ...value, [activeField]: '' });
    };
    const handleBackspace = () => {
        onChange({ ...value, [activeField]: value[activeField].slice(0, -1) });
    };
    const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];
    return (_jsxs("div", { className: "w-full flex flex-col items-center space-y-4", children: [_jsxs("div", { className: "flex items-center justify-center space-x-4", children: [_jsx("input", { type: "text", readOnly: true, value: value.numerator, onClick: () => setActiveField('numerator'), className: `w-24 text-center text-4xl font-bold p-2 bg-white rounded-lg border-4 ${activeField === 'numerator' ? 'border-orange-400' : 'border-gray-200'}` }), _jsx("span", { className: "text-4xl font-bold text-gray-400", children: "/" }), _jsx("input", { type: "text", readOnly: true, value: value.denominator, onClick: () => setActiveField('denominator'), className: `w-24 text-center text-4xl font-bold p-2 bg-white rounded-lg border-4 ${activeField === 'denominator' ? 'border-orange-400' : 'border-gray-200'}` })] }), _jsx("div", { className: "grid grid-cols-3 gap-3 w-full max-w-xs", children: buttons.map((btn) => (_jsx("button", { onClick: () => {
                        if (btn === 'C')
                            handleClear();
                        else if (btn === '⌫')
                            handleBackspace();
                        else
                            handleNumberClick(btn);
                    }, className: "py-3 bg-white rounded-lg shadow-md text-2xl font-bold text-gray-700 active:bg-yellow-100 active:scale-95 transition", children: btn }, btn))) })] }));
};
export default FractionInput;
