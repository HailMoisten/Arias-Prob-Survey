import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import Card from './Card.tsx';
import TextWithFurigana from './TextWithFurigana.tsx';
const QuestionDisplay = ({ question }) => {
    return (_jsx(Card, { className: "w-full", children: _jsx(TextWithFurigana, { content: question.text, jaClass: "text-lg leading-relaxed font-bold", enClass: "text-xs leading-tight", containerClass: "text-left" }) }));
};
export default QuestionDisplay;
