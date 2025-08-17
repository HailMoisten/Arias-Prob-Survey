
import React from 'react';

interface SliderInputProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SliderInput: React.FC<SliderInputProps> = ({ value, onChange }) => {
  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="text-5xl font-bold text-orange-600 drop-shadow-md">
        {value}<span className="text-3xl ml-1">%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={value}
        onChange={onChange}
        className="w-full h-4 bg-yellow-200 rounded-lg appearance-none cursor-pointer range-lg accent-orange-500"
      />
    </div>
  );
};

export default SliderInput;