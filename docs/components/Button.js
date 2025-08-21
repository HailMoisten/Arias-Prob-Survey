import { jsx, jsxs } from "react/jsx-runtime";
const Button = ({ children, text, variant = 'primary', className = '', ...props }) => {
    const baseClasses = 'w-full py-3 px-6 rounded-xl font-bold text-lg shadow-md transform transition-all duration-150 ease-in-out active:scale-95 focus:outline-none focus:ring-4 group';
    const variantClasses = {
        primary: 'bg-yellow-200 text-gray-600 hover:bg-yellow-300 focus:bg-orange-500 focus:text-white focus:ring-orange-300',
        secondary: 'bg-gray-200 text-gray-600 hover:bg-gray-300 focus:bg-gray-500 focus:text-white focus:ring-gray-300',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
    };
    const disabledClasses = 'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100';
    const textContent = text ? (jsxs("div", { className: "relative", children: [jsx("p", { className: `text-xs text-yellow-700 group-focus:text-yellow-200 font-sans opacity-80 transition-colors duration-150`, children: text.en }), jsx("p", { className: `text-lg font-jp font-bold`, children: text.ja })] })) : children;
    return (jsx("button", { className: `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`, ...props, children: text ? textContent : children }));
};
export default Button;
