import { GameMode } from '../types.js';
const generateBallQuestionDrawOne = () => {
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
        hint: `$${"_{"}${totalBalls}}C_1 = ${totalBalls}$`,
        explanation: `全体の玉の数は $${redBalls} + ${whiteBalls} = ${totalBalls}$ 個。
    赤玉を引く場合の数は $${redBalls}$ 通りなので、確率は
    $$\\frac{赤玉の数}{全体の数} = \\frac{${redBalls}}{${totalBalls}}$$`
    };
};
const generateBallQuestionAtLeastOneRed = () => {
    const redBalls = Math.floor(Math.random() * 4) + 2;
    const whiteBalls = Math.floor(Math.random() * 5) + 1;
    const totalBalls = redBalls + whiteBalls;
    let numerator, denominator;
    const wwNumerator = whiteBalls * (whiteBalls - 1);
    denominator = totalBalls * (totalBalls - 1);
    numerator = denominator - wwNumerator;
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
        hint: `$${"_{"}${totalBalls}}P_2 = ${denominator}$`,
        explanation: `「少なくとも1個が赤」は「$1$ - (2個とも白)」の確率です。
    全ての組み合わせは $_{${totalBalls}}P_2 = ${denominator}$ 通り。
    2個とも白の組み合わせは $_{${whiteBalls}}P_2 = ${wwNumerator}$ 通り。
    よって確率は $1 - \\frac{${wwNumerator}}{${denominator}} = \\frac{${numerator}}{${denominator}}$`
    };
};
const generateBallQuestionBothRed = () => {
    const redBalls = Math.floor(Math.random() * 4) + 2;
    const whiteBalls = Math.floor(Math.random() * 5) + 1;
    const totalBalls = redBalls + whiteBalls;
    let numerator, denominator;
    if (redBalls < 2) {
        numerator = 0;
        denominator = 1;
    }
    else {
        numerator = redBalls * (redBalls - 1);
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
        hint: `$${"_{"}${totalBalls}}P_2 = ${denominator}$`,
        explanation: `分母は${totalBalls}個から2個選んで並べる順列で $_{${totalBalls}}P_2 = ${denominator}$ 通り。
    分子は${redBalls}個の赤玉から2個選んで並べる順列で $_{${redBalls}}P_2 = ${numerator}$ 通り。
    よって確率は $\\frac{${numerator}}{${denominator}}$`
    };
};
const generateBallQuestionFirstLastRed = () => {
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
        hint: `$${"_{"}${totalBalls}}P_2 = ${denominator}$`,
        explanation: `並べ方の総数は $${totalBalls}!$ 通り。
    最初と最後が赤玉になる並べ方は、まず赤玉2個を両端に置く($_{${redBalls}}P_2$通り)。
    残りの $${totalBalls - 2}$ 個の玉を中央に並べる(${totalBalls - 2}!$通り)。
    よって確率は $\\frac{_{${redBalls}}P_2 \\times (${totalBalls}-2)!}{${totalBalls}!} = \\frac{${redBalls}(${redBalls}-1)}{${totalBalls}(${totalBalls}-1)}$`
    };
};
const generateBallQuestionFirstOrLastRed = () => {
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
        hint: `$${"_{"}${totalBalls}}P_2 = ${denominator}$`,
        explanation: `「最初か最後が赤」は「$1$ - (最初と最後が両方白)」の確率です。
    両方白になる確率は $\\frac{_{${whiteBalls}}P_2}{_{${totalBalls}}P_2} = \\frac{${whiteBalls}(${whiteBalls}-1)}{${totalBalls}(${totalBalls}-1)}$
    よって確率は $1 - \\frac{${whiteBalls}(${whiteBalls}-1)}{${totalBalls}(${totalBalls}-1)}$`
    };
};
const generateBallQuestionAdjacentRed = () => {
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
        hint: `$${"_{"}${totalBalls}}C_2 = ${totalBalls * (totalBalls - 1) / 2}$`,
        explanation: `赤玉2個を1つの塊と見なすと、白玉${whiteBalls}個との合計 $${whiteBalls + 1}$ 個の並べ方になる。
    よって並べ方は $(${whiteBalls}+1)!$ 通り。赤玉2個の入れ替えも考えて $2!$ を掛ける。
    全ての並べ方は $${totalBalls}!$ 通り。
    よって確率は $\\frac{(${whiteBalls}+1)! \\times 2!}{${totalBalls}!} = \\frac{2}{${totalBalls}}$`
    };
};
const diceQuestionGenerators = {
    Roll6: () => ({
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
        hint: '$6^1 = 6$',
        explanation: `サイコロの目は6通り。6の目が出るのは1通り。
      確率は $\\frac{1}{6}$`
    }),
    RollEven: () => ({
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
        hint: '$6^1 = 6$',
        explanation: `サイコロの目は6通り。偶数(2, 4, 6)が出るのは3通り。
      確率は $\\frac{3}{6}$`
    }),
    RollSum7: () => ({
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
        hint: '$6^2 = 36$',
        explanation: `2つのサイコロの目の出方は $6 \\times 6 = 36$ 通り。
    和が7になる組み合わせは (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) の6通り。
    確率は $\\frac{6}{36}$`
    }),
    RollSum6Or8: () => ({
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
        hint: '$6^2 = 36$',
        explanation: `目の出方は36通り。
    和が6: (1,5), (2,4), (3,3), (4,2), (5,1) の5通り。
    和が8: (2,6), (3,5), (4,4), (5,3), (6,2) の5通り。
    合計10通りなので確率は $\\frac{10}{36}$`
    }),
    ThreeDiceTwoSame: () => ({
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
        hint: '$6^3 = 216$',
        explanation: `目の出方は $6^3=216$ 通り。
    2つだけ同じ目になるのは、どの目が同じになるか($_{6}C_1$通り)、どのサイコロが違う目になるか($_{3}C_1$通り)、違う目が何か(5通り)を掛けて、
    $6 \\times 3 \\times 5 = 90$ 通り。
    確率は $\\frac{90}{216}$`
    }),
};
const trumpQuestionGenerators = {
    DrawOneAce: () => ({
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
        hint: '$_{52}C_1 = 52$',
        explanation: `52枚のカードから1枚引くのは52通り。
    エースは4枚あるので、確率は $\\frac{4}{52}$`
    }),
    ThreeOfAKind: () => ({
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
        hint: '$_{52}C_5 = 2598960$',
        explanation: `5枚引く組み合わせは $_{52}C_5 \\approx 260$万通り。
    スリーカードになる組み合わせを計算すると54912通り。
    確率は $\\frac{54912}{2598960}$`
    }),
    TwoPair: () => ({
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
        hint: '$_{52}C_5 = 2598960$',
        explanation: `5枚引く組み合わせは $_{52}C_5 \\approx 260$万通り。
    ツーペアになる組み合わせを計算すると123552通り。
    確率は $\\frac{123552}{2598960}$`
    }),
    Flush: () => ({
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
        hint: '$_{52}C_5 = 2598960$',
        explanation: `5枚引く組み合わせは $_{52}C_5 \\approx 260$万通り。
    フラッシュになる組み合わせは5148通り。
    確率は $\\frac{5148}{2598960}$`
    }),
};
const numberCardQuestionGenerators = {
    ThreeDigitNumber: () => ({
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
        hint: '$_5P_3 = 60$',
        explanation: `【考え方】
    5枚から3枚並べる順列は $_5P_3 = 60$ 通り。
    3桁の数になるのは、百の位が0以外の場合。
    百の位は4通り、十の位は残り4枚から1枚、一の位は残り3枚から1枚なので、
    $4 \\times 4 \\times 3 = 48$ 通り。
    確率は $\\frac{48}{60}$`
    }),
    ThreeDigitEven: () => ({
        id: 'number-card-3-digit-even',
        type: 'numberCard',
        cardsToDraw: 3,
        text: {
            en: 'From 5 cards (0-4), you arrange 3 to make a number. You win if it\'s a 3-digit even number!',
            ja: '0,1,2,3,4の5枚の数字のカードから3枚並べて3桁の偶数になったらあたり',
        },
        answer: {
            numerator: 30,
            denominator: 60,
        },
        hint: '$_5P_3 = 60$',
        explanation: `【考え方】
    5枚から3枚並べる順列は $_5P_3 = 60$ 通り。
    3桁の偶数になるのは、一の位が0, 2, 4の場合。
    (i) 一の位が0: 百の位は残り4枚、十の位は3枚で $4 \\times 3 = 12$ 通り。
    (ii) 一の位が2か4: 百の位は0以外の3枚、十の位は残り3枚で $3 \\times 3 \\times 2 = 18$ 通り。
    合計 $12+18=30$ 通り。
    確率は $\\frac{30}{60}$`
    }),
    FiveDigitNumber: () => ({
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
        hint: '$5! = 120$',
        explanation: `【考え方】
    5枚全て並べる順列は $5! = 120$ 通り。
    5桁の数になるのは、最初の位が0以外の場合。
    最初の位が0になるのは、残り4枚を並べる $4! = 24$ 通り。
    よって、5桁の数になるのは $120 - 24 = 96$ 通り。
    確率は $\\frac{96}{120}$`
    }),
    FiveDigitEven: () => ({
        id: 'number-card-5-digit-even',
        type: 'numberCard',
        cardsToDraw: 5,
        text: {
            en: 'From 5 cards (0-4), you arrange all 5 to make a number. You win if it\'s a 5-digit even number!',
            ja: '0,1,2,3,4の5枚の数字のカードを全て並べて5桁の偶数になったらあたり',
        },
        answer: {
            numerator: 60,
            denominator: 120,
        },
        hint: '$5! = 120$',
        explanation: `【考え方】
    5枚全て並べる順列は $5! = 120$ 通り。
    5桁の偶数になるのは、一の位が0, 2, 4の場合。
    (i) 一の位が0: $4! = 24$ 通り。
    (ii) 一の位が2か4: 最初の位は0以外なので $3 \\times 3! \\times 2 = 36$ 通り。
    合計 $24+36=60$ 通り。
    確率は $\\frac{60}{120}$`
    }),
};
const coinQuestionGenerators = {
    TwoCoinsOneHead: () => ({
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
        hint: '$2^2 = 4$',
        explanation: `2枚のコインの出方は $2^2=4$ 通り (表表, 表裏, 裏表, 裏裏)。
    1枚だけ表なのは (表裏, 裏表) の2通り。
    確率は $\\frac{2}{4}$`
    }),
    ThreeCoinsAtLeastOneHead: () => ({
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
        hint: '$2^3 = 8$',
        explanation: `3枚のコインの出方は $2^3=8$ 通り。
    「少なくとも1枚表」は「$1$ - (全て裏)」の確率です。
    全て裏になるのは1通りなので、確率は $1 - \\frac{1}{8} = \\frac{7}{8}$`
    }),
};
const ballQuestionGenerators = {
    DrawOne: generateBallQuestionDrawOne,
    AtLeastOneRed: generateBallQuestionAtLeastOneRed,
    BothRed: generateBallQuestionBothRed,
    FirstLastRed: generateBallQuestionFirstLastRed,
    FirstOrLastRed: generateBallQuestionFirstOrLastRed,
    AdjacentRed: generateBallQuestionAdjacentRed,
};
export const trainingCategories = [
    { type: 'coin', text: { en: 'Coins', ja: 'コイン' }, subTypes: [
            { subType: 'TwoCoinsOneHead', text: { en: '1 of 2 is Heads', ja: '2枚中1枚だけ表' } },
            { subType: 'ThreeCoinsAtLeastOneHead', text: { en: '>=1 of 3 is Heads', ja: '3枚中1枚以上表' } },
        ] },
    { type: 'ball', text: { en: 'Red & White Balls', ja: '赤玉白玉' }, subTypes: [
            { subType: 'DrawOne', text: { en: 'Draw One', ja: '1個取り出す' } },
            { subType: 'AtLeastOneRed', text: { en: 'At Least One Red', ja: '赤玉が1個以上' } },
            { subType: 'BothRed', text: { en: 'Both Red', ja: '2個とも赤玉' } },
            { subType: 'FirstLastRed', text: { en: 'First & Last Red', ja: '最初と最後が赤玉' } },
            { subType: 'FirstOrLastRed', text: { en: 'First or Last Red', ja: '最初か最後が赤玉' } },
            { subType: 'AdjacentRed', text: { en: 'Adjacent Reds', ja: '2つの赤玉が隣り合う' } },
        ] },
    { type: 'dice', text: { en: 'Dice', ja: 'サイコロ' }, subTypes: [
            { subType: 'Roll6', text: { en: 'Roll a 6', ja: '6が出る' } },
            { subType: 'RollEven', text: { en: 'Roll an Even Number', ja: '偶数が出る' } },
            { subType: 'RollSum7', text: { en: 'Sum is 7 (2 dice)', ja: '2つの和が7' } },
            { subType: 'RollSum6Or8', text: { en: 'Sum is 6 or 8 (2 dice)', ja: '2つの和が6か8' } },
            { subType: 'ThreeDiceTwoSame', text: { en: '2 of 3 are Same', ja: '3つのうち2つが同じ目' } },
        ] },
    { type: 'numberCard', text: { en: 'Number Cards', ja: '数字カード' }, subTypes: [
            { subType: 'ThreeDigitNumber', text: { en: '3-digit number', ja: '3桁の数' } },
            { subType: 'ThreeDigitEven', text: { en: '3-digit even number', ja: '3桁の偶数' } },
            { subType: 'FiveDigitNumber', text: { en: '5-digit number', ja: '5桁の数' } },
            { subType: 'FiveDigitEven', text: { en: '5-digit even number', ja: '5桁の偶数' } },
        ] },
    { type: 'trump', text: { en: 'Playing Cards', ja: 'トランプ' }, subTypes: [
            { subType: 'DrawOneAce', text: { en: 'Draw an Ace', ja: 'エースを引く' } },
            { subType: 'ThreeOfAKind', text: { en: 'Three of a Kind (5 cards)', ja: 'スリーカード(5枚)' } },
            { subType: 'TwoPair', text: { en: 'Two Pair (5 cards)', ja: 'ツーペア(5枚)' } },
            { subType: 'Flush', text: { en: 'Flush (5 cards)', ja: 'フラッシュ(5枚)' } },
        ] },
];
const allQuestionGenerators = {
    ...ballQuestionGenerators,
    ...diceQuestionGenerators,
    ...coinQuestionGenerators,
    ...trumpQuestionGenerators,
    ...numberCardQuestionGenerators,
};
const mulberry32 = (a) => {
    return () => {
        a |= 0;
        a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
};
export const getQuestion = (options) => {
    if (options.mode === GameMode.TRAINING && options.type && options.subType) {
        const generator = allQuestionGenerators[options.subType];
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
