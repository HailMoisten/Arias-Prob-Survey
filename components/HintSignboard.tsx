

import React, { useEffect, useRef } from 'react';

// KaTeX is loaded via CDN in index.html
declare var katex: any;

interface HintSignboardProps {
  hintText: string;
  className?: string;
  style?: React.CSSProperties;
}

const HintSignboard: React.FC<HintSignboardProps> = ({ hintText, className = '', style = {} }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && typeof katex !== 'undefined' && hintText) {
      try {
        katex.render(hintText, contentRef.current, {
          throwOnError: false,
          // displayMode: true は、小さなコンテナではレイアウトが崩れる可能性があるため無効化しています
        });
      } catch (e) {
        console.error('KaTeX rendering error:', e);
        // Fallback to plain text if KaTeX fails
        contentRef.current.textContent = hintText.replace(/\\\\/g, '\n');
      }
    }
  }, [hintText]);

  return (
    <div 
      // 看板の傾き調整: -rotate-XX の数値を変更 (例: -rotate-6, -rotate-12)
      className={`absolute bg-yellow-700 border-1 border-yellow-700/80 rounded-lg p-1 shadow-lg backdrop-blur-sm transform -rotate-12 ${className}`}
      style={style}
    >
      <div className="bg-amber-50/80 rounded px-7 py-5 border-1 border-amber-800/50">
        <div 
          ref={contentRef}
          // ヒントの文字サイズ調整: text-sm の値を変更 (例: text-xs, text-base)
          className="text-yellow-900 font-sans text-xs leading-tight text-center katex-container"
        >
          {/* KaTeX will render here */}
        </div>
      </div>
       {/* Sign post */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2 h-10 bg-yellow-700 border-x-1 border-yellow-700/80"></div>
    </div>
  );
};

export default HintSignboard;