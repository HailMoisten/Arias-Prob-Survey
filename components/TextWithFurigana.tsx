import React from 'react';
import { TextContent } from '../types.ts';

interface TextWithFuriganaProps {
  content: TextContent;
  jaClass?: string;
  enClass?: string;
  containerClass?: string;
}

const TextWithFurigana: React.FC<TextWithFuriganaProps> = ({
  content,
  jaClass = 'text-lg',
  enClass = 'text-xs',
  containerClass = 'text-center',
}) => {
  return (
    <div className={containerClass}>
      <p className={`${enClass} text-orange-500 font-sans`}>{content.en}</p>
      <p className={`${jaClass} text-gray-700 font-jp font-bold`}>{content.ja}</p>
    </div>
  );
};

export default TextWithFurigana;