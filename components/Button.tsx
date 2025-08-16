import React from 'react';
import TextWithFurigana from './TextWithFurigana';
import { TextContent } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  text?: TextContent;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, text, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'w-full py-3 px-6 rounded-xl font-bold text-lg shadow-md transform transition-all duration-150 ease-in-out active:scale-95 focus:outline-none focus:ring-4 group';
  
  const variantClasses = {
    primary: 'bg-yellow-200 text-gray-600 hover:bg-yellow-300 focus:bg-orange-500 focus:text-white focus:ring-orange-300',
    secondary: 'bg-gray-200 text-gray-600 hover:bg-gray-300 focus:bg-gray-500 focus:text-white focus:ring-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
  };

  const disabledClasses = 'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100';

  const textContent = text ? (
    <div className="relative">
      <p className={`text-xs text-yellow-700 group-focus:text-yellow-200 font-sans opacity-80 transition-colors duration-150`}>{text.en}</p>
      <p className={`text-lg font-jp font-bold`}>{text.ja}</p>
    </div>
  ) : children;


  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`} {...props}>
      {text ? textContent : children}
    </button>
  );
};

export default Button;