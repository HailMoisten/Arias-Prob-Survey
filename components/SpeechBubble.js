
import React from 'react';
import TextWithFurigana from './TextWithFurigana.js';
import { TextContent } from '../types.js';

interface SpeechBubbleProps {
  message?: TextContent;
  animation?: 'swoop-in' | 'bounce-sm';
  className?: string;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ message, animation = 'swoop-in', className = '' }) => {
  if (!message) return null;

  const animationClass = animation === 'swoop-in' ? 'animate-swoop-in' : 'animate-bounce-sm';

  return (
    <div className={`relative w-max max-w-xs mx-auto bg-white rounded-xl px-4 py-2 shadow-lg text-center text-gray-700 font-jp font-bold ${animationClass} ${className}`}>
      <TextWithFurigana content={message} jaClass="text-base" enClass="text-xs" />
      <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
    </div>
  );
};

export default SpeechBubble;