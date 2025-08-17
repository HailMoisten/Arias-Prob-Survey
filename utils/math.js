
export const gcd = (a: number, b: number): number => {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
};

export const simplifyFraction = (numerator: number, denominator: number): { numerator: number, denominator: number } => {
  if (denominator === 0) {
    return { numerator, denominator };
  }
  const commonDivisor = gcd(numerator, denominator);
  return {
    numerator: numerator / commonDivisor,
    denominator: denominator / commonDivisor,
  };
};