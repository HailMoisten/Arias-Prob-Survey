export const gcd = (a, b) => {
    if (!b) {
        return a;
    }
    return gcd(b, a % b);
};
export const simplifyFraction = (numerator, denominator) => {
    if (denominator === 0) {
        return { numerator, denominator };
    }
    const commonDivisor = gcd(numerator, denominator);
    return {
        numerator: numerator / commonDivisor,
        denominator: denominator / commonDivisor,
    };
};
