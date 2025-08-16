
import { Question, GameMode, TextContent } from '../types';

const BALL_HINT = '6!=720 \\\\ 7!=5040 \\\\ 8!=40320';
const DICE_HINT = '6^2=36 \\\\ 6^3=216';
const COIN_HINT = '2^2=4 \\\\ 2^3=8';

const generateBallQuestionDrawOne = (): Question => {
  const redBalls = Math.floor(Math.random() * 5) + 1;
  const whiteBalls = Math.floor(Math.random() * 5) + 1;
  const totalBalls = redBalls + whiteBalls;
  
  return {
    id: 'random-ball-draw-1',
    type: 'ball',
    text: {
      en: `A bag has ${redBalls} red and ${whiteBalls} white balls. You draw one. You win if it's red!`,
      ja: `赤玉${redBalls}個、白玉${whiteBalls}個が入った袋から玉を1個取り出すよ。赤玉なら当たり！`,
    },
    answer: {
      numerator: redBalls,
      denominator: totalBalls,
    },
    redBalls,
    whiteBalls,
    hint: BALL_HINT,
  };
};

const generateBallQuestionAtLeastOneRed = (): Question => {
  const redBalls = Math.floor(Math.random() * 4) + 2;
  const whiteBalls = Math.floor(Math.random() * 5) + 1;
  const totalBalls = redBalls + whiteBalls;

  let numerator, denominator;
  if (whiteBalls < 2) {
    numerator = 1;
    denominator = 1;
  } else {
    denominator = totalBalls * (totalBalls - 1);
    const wwNumerator = whiteBalls * (whiteBalls - 1);
    numerator = denominator - wwNumerator;
  }
  
  return {
    id: 'random-ball-draw-2-at-least-one-red',
    type: 'ball',
    text: {
      en: `A bag has ${redBalls} red and ${whiteBalls} white balls. You draw two. You win if at least one is red!`,
      ja: `赤玉${redBalls}個、白玉${whiteBalls}個が入った袋から玉を2個取り出すよ。赤玉が1個以上なら当たり！`,
    },
    answer: {
      numerator,
      denominator,
    },
    redBalls,
    whiteBalls,
    hint: BALL_HINT,
  };
};

const generateBallQuestionBothRed = (): Question => {
  const redBalls = Math.floor(Math.random() * 4) + 2;
  const whiteBalls = Math.floor(Math.random() * 5) + 1;
  const totalBalls = redBalls + whiteBalls;

  let numerator, denominator;
  if (redBalls < 2) {
    numerator = 0;
    denominator = 1;
  } else {
    numerator = redBalls * (redBalls - 1) * 2;
    denominator = totalBalls * (totalBalls - 1);
  }
  
  return {
    id: 'random-ball-draw-2-both-red',
    type: 'ball',
    text: {
      en: `A bag has ${redBalls} red and ${whiteBalls} white balls. You draw two. You win if both are red!`,
      ja: `赤玉${redBalls}個、白玉${whiteBalls}個が入った袋から玉を2個取り出すよ。2個とも赤玉なら当たり！`,
    },
    answer: {
      numerator,
      denominator,
    },
    redBalls,
    whiteBalls,
    hint: BALL_HINT,
  };
};

const generateBallQuestionFirstLastRed = (): Question => {
  const redBalls = Math.floor(Math.random() * 4) + 2; // 2 to 5 red balls
  const whiteBalls = Math.floor(Math.random() * 5) + 1;
  const totalBalls = redBalls + whiteBalls;

  const numerator = redBalls * (redBalls - 1);
  const denominator = totalBalls * (totalBalls - 1);
  
  return {
    id: 'random-ball-all-out-first-last-red',
    type: 'ball',
    text: {
      en: `You draw all ${redBalls} red and ${whiteBalls} white balls and line them up. You win if the first and last are both red!`,
      ja: `赤玉${redBalls}個、白玉${whiteBalls}個を全部取り出して一列に並べるよ。最初と最後が赤玉なら当たり！`,
    },
    answer: {
      numerator,
      denominator,
    },
    redBalls,
    whiteBalls,
    hint: BALL_HINT,
  };
};

const generateBallQuestionFirstOrLastRed = (): Question => {
  const redBalls = Math.floor(Math.random() * 4) + 2; // 2 to 5 red balls
  const whiteBalls = Math.floor(Math.random() * 5) + 1;
  const totalBalls = redBalls + whiteBalls;

  const denominator = totalBalls * (totalBalls - 1);
  const numerator = denominator - (whiteBalls * (whiteBalls - 1));
  
  return {
    id: 'random-ball-all-out-first-or-last-red',
    type: 'ball',
    text: {
      en: `You draw all ${redBalls} red and ${whiteBalls} white balls and line them up. You win if the first or the last is red!`,
      ja: `赤玉${redBalls}個、白玉${whiteBalls}個を全部取り出して一列に並べるよ。最初か最後が赤玉なら当たり！`,
    },
    answer: {
      numerator,
      denominator,
    },
    redBalls,
    whiteBalls,
    hint: BALL_HINT,
  };
};

const generateBallQuestionAdjacentRed = (): Question => {
  const redBalls = 2;
  const whiteBalls = Math.floor(Math.random() * 5) + 1;
  const totalBalls = redBalls + whiteBalls;

  const numerator = 2;
  const denominator = totalBalls;
  
  return {
    id: 'random-ball-all-out-adjacent-red',
    type: 'ball',
    text: {
      en: `You draw all 2 red and ${whiteBalls} white balls and line them up. You win if the two red balls are adjacent!`,
      ja: `赤玉2個、白玉${whiteBalls}個を全部取り出して一列に並べるよ。2つの赤玉が隣り合ったら当たり！`,
    },
    answer: {
      numerator,
      denominator,
    },
    redBalls,
    whiteBalls,
    hint: BALL_HINT,
  };
};

const diceQuestionGenerators = {
  Roll6: (): Question => ({
      id: 'dice-roll-6',
      type: 'dice',
      diceCount: 1,
      text: {
          en: 'You roll a fair six-sided die once. You win if you roll a 6!',
          ja: '公正な6面のサイコロを1回振るよ。6の目が出たら当たり！',
      },
      answer: {
          numerator: 1,
          denominator: 6,
      },
      hint: DICE_HINT,
  }),
  RollEven: (): Question => ({
      id: 'dice-roll-even',
      type: 'dice',
      diceCount: 1,
      text: {
          en: 'You roll a fair six-sided die once. You win if you roll an even number!',
          ja: '公正な6面のサイコロを1回振るよ。偶数の目が出たら当たり！',
      },
      answer: {
          numerator: 3,
          denominator: 6,
      },
      hint: DICE_HINT,
  }),
  RollSum7: (): Question => ({
    id: 'dice-roll-sum-7',
    type: 'dice',
    diceCount: 2,
    text: {
        en: 'You roll two fair six-sided dice. You win if the sum is 7!',
        ja: '大小2つのサイコロを投げ、目の和が7なら当たり！',
    },
    answer: {
        numerator: 6,
        denominator: 36,
    },
    hint: DICE_HINT,
  }),
  RollSum6Or8: (): Question => ({
    id: 'dice-roll-sum-6-or-8',
    type: 'dice',
    diceCount: 2,
    text: {
        en: 'You roll two fair six-sided dice. You win if the sum is 6 or 8!',
        ja: '大小2つのサイコロを投げ、目の和が6か8なら当たり！',
    },
    answer: {
        numerator: 10,
        denominator: 36,
    },
    hint: DICE_HINT,
  }),
  ThreeDiceTwoSame: (): Question => ({
    id: 'dice-roll-three-two-same',
    type: 'dice',
    diceCount: 3,
    text: {
        en: 'You roll three fair six-sided dice. You win if exactly two dice are the same!',
        ja: '大中小3つのサイコロを投げ、同じ目が2つだけ出たら当たり！',
    },
    answer: {
        numerator: 90,
        denominator: 216,
    },
    hint: DICE_HINT,
  }),
};

const trumpQuestionGenerators = {
  DrawOneAce: (): Question => ({
    id: 'cards-1-ace',
    type: 'trump',
    cardsToDraw: 1,
    text: {
        en: 'You draw one card from a 52-card deck. You win if it\'s an Ace!',
        ja: '52枚のトランプから1枚引くよ。エースなら当たり！',
    },
    answer: {
        numerator: 4,
        denominator: 52,
    },
    hint: '_{52}C_1 = 52',
  }),
  ThreeOfAKind: (): Question => ({
    id: 'cards-5-three-of-a-kind',
    type: 'trump',
    cardsToDraw: 5,
    text: {
        en: 'You draw 5 cards from a 52-card deck. You win if you get three of a kind!',
        ja: '52枚の山札から5枚引いてスリーカード(同じ数字が3枚)ならあたり',
    },
    answer: {
        numerator: 54912,
        denominator: 2598960,
    },
    hint: '_{52}C_5 \\approx 2.6 \\times 10^6',
  }),
  TwoPair: (): Question => ({
    id: 'cards-5-two-pair',
    type: 'trump',
    cardsToDraw: 5,
    text: {
        en: 'You draw 5 cards from a 52-card deck. You win if you get two pair!',
        ja: '52枚の山札から5枚引いてツーペア(同じ数字が2枚ずつ)ならあたり',
    },
    answer: {
        numerator: 123552,
        denominator: 2598960,
    },
    hint: '_{52}C_5 \\approx 2.6 \\times 10^6',
  }),
  Flush: (): Question => ({
    id: 'cards-5-flush',
    type: 'trump',
    cardsToDraw: 5,
    text: {
        en: 'You draw 5 cards from a 52-card deck. You win if you get a flush (all same suit)!',
        ja: '52枚の山札から5枚引いてフラッシュ(すべて同じマーク)ならあたり',
    },
    answer: {
        numerator: 5148,
        denominator: 2598960,
    },
    hint: '_{52}C_5 \\approx 2.6 \\times 10^6',
  }),
};

const numberCardQuestionGenerators = {
  ThreeDigitNumber: (): Question => ({
    id: 'number-card-3-digit',
    type: 'numberCard',
    cardsToDraw: 3,
    text: {
        en: 'From 5 cards (0-4), you arrange 3 to make a number. You win if it\'s a 3-digit number (1st can\'t be 0)!',
        ja: '0,1,2,3,4の5枚の数字のカードから3枚並べて3桁の数になったらあたり（1枚目が0ならはずれ）',
    },
    answer: {
        numerator: 48,
        denominator: 60,
    },
    hint: '_5P_3 = 60',
  }),
  ThreeDigitEven: (): Question => ({
    id: 'number-card-3-digit-even',
    type: 'numberCard',
    cardsToDraw: 3,
    text: {
        en: 'From 5 cards (0-4), you arrange 3 to make a number. You win if it\'s a 3-digit even number!',
        ja: '0,1,2,3,4の5枚の数字のカードから3枚並べて3桁の偶数になったらあたり',
    },
    answer: {
        numerator: 30,
        denominator: 48,
    },
    hint: '_5P_3 = 60',
  }),
  FiveDigitNumber: (): Question => ({
    id: 'number-card-5-digit',
    type: 'numberCard',
    cardsToDraw: 5,
    text: {
        en: 'From 5 cards (0-4), you arrange all 5 to make a number. You win if it\'s a 5-digit number!',
        ja: '0,1,2,3,4の5枚の数字のカードを全て並べて5桁の数になったらあたり',
    },
    answer: {
        numerator: 96,
        denominator: 120,
    },
    hint: '5! = 120',
  }),
  FiveDigitEven: (): Question => ({
    id: 'number-card-5-digit-even',
    type: 'numberCard',
    cardsToDraw: 5,
    text: {
        en: 'From 5 cards (0-4), you arrange all 5 to make a number. You win if it\'s a 5-digit even number!',
        ja: '0,1,2,3,4の5枚の数字のカードを全て並べて5桁の偶数になったらあたり',
    },
    answer: {
        numerator: 60,
        denominator: 96,
    },
    hint: '5! = 120',
  }),
};

const coinQuestionGenerators = {
  TwoCoinsOneHead: (): Question => ({
    id: 'coin-two-one-head',
    type: 'coin',
    coinCount: 2,
    text: {
      en: 'You toss two coins. You win if exactly one is heads!',
      ja: '2枚のコインを投げ、1枚だけ表ならあたり！',
    },
    answer: {
      numerator: 2,
      denominator: 4,
    },
    hint: COIN_HINT,
  }),
  ThreeCoinsAtLeastOneHead: (): Question => ({
    id: 'coin-three-at-least-one-head',
    type: 'coin',
    coinCount: 3,
    text: {
      en: 'You toss three coins. You win if at least one is heads!',
      ja: '3枚のコインを投げ、1枚以上表ならあたり！',
    },
    answer: {
      numerator: 7,
      denominator: 8,
    },
    hint: COIN_HINT,
  }),
};

type QuestionSubType = 'DrawOne' | 'AtLeastOneRed' | 'BothRed' | 'FirstLastRed' | 'AdjacentRed' | 'FirstOrLastRed' | 'Roll6' | 'RollEven' | 'RollSum7' | 'RollSum6Or8' | 'ThreeDiceTwoSame' | 'TwoCoinsOneHead' | 'ThreeCoinsAtLeastOneHead' | 'DrawOneAce' | 'ThreeOfAKind' | 'TwoPair' | 'Flush' | 'ThreeDigitNumber' | 'ThreeDigitEven' | 'FiveDigitNumber' | 'FiveDigitEven';
export interface QuestionOptions {
  mode: GameMode;
  type?: 'ball' | 'dice' | 'trump' | 'coin' | 'numberCard';
  subType?: QuestionSubType;
}

const ballQuestionGenerators = {
  DrawOne: generateBallQuestionDrawOne,
  AtLeastOneRed: generateBallQuestionAtLeastOneRed,
  BothRed: generateBallQuestionBothRed,
  FirstLastRed: generateBallQuestionFirstLastRed,
  FirstOrLastRed: generateBallQuestionFirstOrLastRed,
  AdjacentRed: generateBallQuestionAdjacentRed,
};

export const trainingCategories: { type: QuestionOptions['type']; text: TextContent; subTypes: { subType: string; text: TextContent }[] }[] = [
    { type: 'coin', text: { en: 'Coins', ja: 'コイン' }, subTypes: [
        { subType: 'TwoCoinsOneHead', text: { en: '1 of 2 is Heads', ja: '2枚中1枚だけ表' } },
        { subType: 'ThreeCoinsAtLeastOneHead', text: { en: '>=1 of 3 is Heads', ja: '3枚中1枚以上表' } },
    ]},
    { type: 'ball', text: { en: 'Red & White Balls', ja: '赤玉白玉' }, subTypes: [
        { subType: 'DrawOne', text: { en: 'Draw One', ja: '1個取り出す' } },
        { subType: 'AtLeastOneRed', text: { en: 'At Least One Red', ja: '赤玉が1個以上' } },
        { subType: 'BothRed', text: { en: 'Both Red', ja: '2個とも赤玉' } },
        { subType: 'FirstLastRed', text: { en: 'First & Last Red', ja: '最初と最後が赤玉' } },
        { subType: 'FirstOrLastRed', text: { en: 'First or Last Red', ja: '最初か最後が赤玉' } },
        { subType: 'AdjacentRed', text: { en: 'Adjacent Reds', ja: '2つの赤玉が隣り合う' } },
    ]},
    { type: 'dice', text: { en: 'Dice', ja: 'サイコロ' }, subTypes: [
        { subType: 'Roll6', text: { en: 'Roll a 6', ja: '6が出る' } },
        { subType: 'RollEven', text: { en: 'Roll an Even Number', ja: '偶数が出る' } },
        { subType: 'RollSum7', text: { en: 'Sum is 7 (2 dice)', ja: '2つの和が7' } },
        { subType: 'RollSum6Or8', text: { en: 'Sum is 6 or 8 (2 dice)', ja: '2つの和が6か8' } },
        { subType: 'ThreeDiceTwoSame', text: { en: '2 of 3 are Same', ja: '3つのうち2つが同じ目' } },
    ]},
    { type: 'numberCard', text: { en: 'Number Cards', ja: '数字カード' }, subTypes: [
        { subType: 'ThreeDigitNumber', text: { en: '3-digit number', ja: '3桁の数' } },
        { subType: 'ThreeDigitEven', text: { en: '3-digit even number', ja: '3桁の偶数' } },
        { subType: 'FiveDigitNumber', text: { en: '5-digit number', ja: '5桁の数' } },
        { subType: 'FiveDigitEven', text: { en: '5-digit even number', ja: '5桁の偶数' } },
    ]},
    { type: 'trump', text: { en: 'Playing Cards', ja: 'トランプ' }, subTypes: [
        { subType: 'DrawOneAce', text: { en: 'Draw an Ace', ja: 'エースを引く' } },
        { subType: 'ThreeOfAKind', text: { en: 'Three of a Kind (5 cards)', ja: 'スリーカード(5枚)' } },
        { subType: 'TwoPair', text: { en: 'Two Pair (5 cards)', ja: 'ツーペア(5枚)' } },
        { subType: 'Flush', text: { en: 'Flush (5 cards)', ja: 'フラッシュ(5枚)' } },
    ]},
];

const allQuestionGenerators = {
  ...ballQuestionGenerators,
  ...diceQuestionGenerators,
  ...coinQuestionGenerators,
  ...trumpQuestionGenerators,
  ...numberCardQuestionGenerators,
};

const mulberry32 = (a: number) => {
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export const getQuestion = (options: QuestionOptions): Question => {
  if (options.mode === GameMode.TRAINING && options.type && options.subType) {
    const generator = allQuestionGenerators[options.subType as keyof typeof allQuestionGenerators];
    if (generator) {
      return generator();
    }
  }

  const generators = Object.values(allQuestionGenerators);
  
  if (options.mode === GameMode.NORMAL) {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const random = mulberry32(seed);
    const randomIndex = Math.floor(random() * generators.length);
    return generators[randomIndex]();
  }

  const randomIndex = Math.floor(Math.random() * generators.length);
  return generators[randomIndex]();
};