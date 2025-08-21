import { jsxs, jsx } from "react/jsx-runtime";
const SliderInput = ({ value, onChange }) => {
    return (jsxs("div", { className: "w-full flex flex-col items-center space-y-4", children: [jsxs("div", { className: "text-5xl font-bold text-orange-600 drop-shadow-md", children: [value, jsx("span", { className: "text-3xl ml-1", children: "%" })] }), jsx("input", { type: "range", min: "0", max: "100", step: "5", value: value, onChange: onChange, className: "w-full h-4 bg-yellow-200 rounded-lg appearance-none cursor-pointer range-lg accent-orange-500" })] }));
};
export default SliderInput;
