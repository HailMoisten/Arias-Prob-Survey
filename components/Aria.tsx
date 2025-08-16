import React, { useState, useEffect } from 'react';

interface AriaProps {
  className?: string;
}

const Aria: React.FC<AriaProps> = ({ className = '' }) => {
  const [imageData, setImageData] = useState('');

  useEffect(() => {
    fetch('./data/base64/ariamimi.txt')
      .then(response => response.text())
      .then(data => setImageData(data.trim()));
  }, []);

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <img src={imageData} alt="Aria the rabbit with Mimi the chick" className="w-full h-full object-contain drop-shadow-lg" />
    </div>
  );
};

export default Aria;