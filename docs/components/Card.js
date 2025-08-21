import { jsx } from "react/jsx-runtime";
const Card = ({ children, className = '' }) => {
    return (jsx("div", { className: `bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50 ${className}`, children: children }));
};
export default Card;
