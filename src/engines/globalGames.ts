// Global games: the limiting Morris-Shin currency-attack benchmark. Under its information and
// payoff assumptions, noisy private signals select a threshold: the regime falls when the
// fundamental theta is below theta* = 1 - c, where c is the cost of attacking. With theta uniform
// on [0,1], theta* is also the fraction of fundamentals that collapse.
// Framework-free and unit-testable.

/** The unique fundamentals threshold: the regime falls iff theta < 1 - c. */
export function threshold(c: number): number {
  return Math.max(0, Math.min(1, 1 - c));
}

/** Does the regime collapse at fundamental theta given attack cost c? */
export function regimeFalls(theta: number, c: number): boolean {
  return theta < threshold(c);
}

/** Fraction of crises when theta is uniform on [0,1]: equals the threshold. */
export function crisisProbability(c: number): number {
  return threshold(c);
}
