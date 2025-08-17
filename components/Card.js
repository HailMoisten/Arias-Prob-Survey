
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;