
import React from 'react';
import { Question } from '../types';
import Card from './Card';
import TextWithFurigana from './TextWithFurigana';

interface QuestionDisplayProps {
  question: Question;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  return (
      <Card className="w-full">
        <TextWithFurigana
          content={question.text}
          jaClass="text-lg leading-relaxed font-bold"
          enClass="text-xs leading-tight"
          containerClass="text-left"
        />
      </Card>
  );
};

export default QuestionDisplay;