import React, { useState } from 'react';
import { Fraction } from '../types.ts';

interface FractionInputProps {
  value: Fraction;
  onChange: (value: Fraction) => void;
}

const FractionInput: React.FC<FractionInputProps> = ({ value, onChange }) => {
  const [activeField, setActiveField] = useState<'numerator' | 'denominator'>('numerator');

  const handleNumberClick = (num: string) => {
    const currentValue = value[activeField];
    const newValue = currentValue === '0' ? num : currentValue + num;
    onChange({ ...value, [activeField]: newValue });
  };
  
  const handleClear = () => {
    onChange({ ...value, [activeField]: '' });
  };

  const handleBackspace = () => {
    onChange({ ...value, [activeField]: value[activeField].slice(0, -1) });
  };

  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="flex items-center justify-center space-x-4">
        <input
          type="text"
          readOnly
          value={value.numerator}
          onClick={() => setActiveField('numerator')}
          className={`w-24 text-center text-4xl font-bold p-2 bg-white rounded-lg border-4 ${activeField === 'numerator' ? 'border-orange-400' : 'border-gray-200'}`}
        />
        <span className="text-4xl font-bold text-gray-400">/</span>
        <input
          type="text"
          readOnly
          value={value.denominator}
          onClick={() => setActiveField('denominator')}
          className={`w-24 text-center text-4xl font-bold p-2 bg-white rounded-lg border-4 ${activeField === 'denominator' ? 'border-orange-400' : 'border-gray-200'}`}
        />
      </div>
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === 'C') handleClear();
              else if (btn === '⌫') handleBackspace();
              else handleNumberClick(btn);
            }}
            className="py-3 bg-white rounded-lg shadow-md text-2xl font-bold text-gray-700 active:bg-yellow-100 active:scale-95 transition"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FractionInput;