

export enum GameMode {
  NORMAL = 'NORMAL',
  TRAINING = 'TRAINING',
}

export interface TextContent {
  en: string;
  ja: string;
}

export interface Question {
  id: string;
  type: 'ball' | 'dice' | 'trump' | 'coin' | 'numberCard';
  text: TextContent;
  answer: {
    numerator: number;
    denominator: number;
  };
  redBalls?: number;
  whiteBalls?: number;
  diceCount?: number;
  coinCount?: number;
  cardsToDraw?: number;
  hint?: string;
  explanation?: string;
}

export interface PlayerState {
  chips: number;
  trainingChips: number;
  lastPlayedDate: string | null;
  chipHistory: { date: string; chips: number }[];
}

export interface Fraction {
  numerator: string;
  denominator: string;
}

export enum GamePhase {
  QUESTION_SELECTION = 'QUESTION_SELECTION',
  BETTING = 'BETTING',
  ANSWERING = 'ANSWERING',
  ANIMATING = 'ANIMATING',
  RESULT = 'RESULT',
}

export type AnswerAccuracy = 'exact' | 'approximate' | 'near-miss' | 'incorrect';

export interface GameResult {
    isWin: boolean;
    chipChange: number;
    odds: number;
    correctProbability: number;
    accuracy: AnswerAccuracy;
    resultMessage: TextContent;
    bonusMessage?: TextContent;
}