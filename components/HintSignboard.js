
import React, { useEffect, useRef } from 'react';

// KaTeX and its auto-render extension are loaded via CDN in index.html
declare var renderMathInElement: any;
declare var katex: any;

interface HintSignboardProps {
  hintText: string;
  className?: string;
  style?: React.CSSProperties;
}

const HintSignboard: React.FC<HintSignboardProps> = ({ hintText, className = '', style = {} }) => {
  const katexContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = katexContainerRef.current;
    if (container && hintText && typeof renderMathInElement !== 'undefined' && typeof katex !== 'undefined') {
      try {
        renderMathInElement(container, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
          ],
          throwOnError: false,
        });
      } catch (e) {
        console.error('KaTeX auto-render error:', e);
      }
    }
  }, [hintText]);
  
  return (
    <div 
      className={`relative bg-yellow-700 border-1 border-yellow-700/80 rounded-lg p-1 shadow-lg backdrop-blur-sm transform -rotate-12 w-24 ${className}`}
      style={style}
    >
      <div className="bg-amber-50/80 rounded p-1 border-1 border-amber-800/50 h-12 flex items-center justify-center">
        <div 
          ref={katexContainerRef}
          className="text-yellow-900 font-sans text-sm text-center"
        >
          {hintText}
        </div>
      </div>
       {/* Sign post */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2 h-10 bg-yellow-700 border-x-1 border-yellow-700/80"></div>
    </div>
  );
};

export default HintSignboard;