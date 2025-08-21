import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
const Aria = ({ className = '' }) => {
    const [imageData, setImageData] = useState('');
    useEffect(() => {
        fetch('./data/base64/ariamimi.txt')
            .then(response => response.text())
            .then(data => setImageData(data.trim()));
    }, []);
    return (_jsx("div", { className: `relative flex flex-col items-center ${className}`, children: _jsx("img", { src: imageData, alt: "Aria the rabbit with Mimi the chick", className: "w-full h-full object-contain drop-shadow-lg" }) }));
};
export default Aria;
