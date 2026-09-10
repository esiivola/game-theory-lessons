// Linear public-goods game. n players, each endowed e; contributions are summed, multiplied
// by a factor, and split equally. Framework-free and unit-testable.

/** Your payoff: what you keep, plus your equal share of the multiplied common pot. */
export function payoff(
  gi: number,
  others: number[],
  e: number,
  factor: number,
  n: number
): number {
  const total = gi + others.reduce((s, x) => s + x, 0);
  return e - gi + (factor / n) * total;
}

/** Marginal per-capita return: what one dollar contributed hands back to you. */
export function mpcr(factor: number, n: number): number {
  return factor / n;
}
