import { jsxs, jsx } from "react/jsx-runtime";
const TextWithFurigana = ({ content, jaClass = 'text-lg', enClass = 'text-xs', containerClass = 'text-center', }) => {
    return (jsxs("div", { className: containerClass, children: [jsx("p", { className: `${enClass} text-orange-500 font-sans`, children: content.en }), jsx("p", { className: `${jaClass} text-gray-700 font-jp font-bold`, children: content.ja })] }));
};
export default TextWithFurigana;
