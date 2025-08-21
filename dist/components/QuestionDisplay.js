import { jsx } from "react/jsx-runtime";
import Card from './Card.js';
import TextWithFurigana from './TextWithFurigana.js';
const QuestionDisplay = ({ question }) => {
    return (jsx(Card, { className: "w-full", children: jsx(TextWithFurigana, { content: question.text, jaClass: "text-lg leading-relaxed font-bold", enClass: "text-xs leading-tight", containerClass: "text-left" }) }));
};
export default QuestionDisplay;
