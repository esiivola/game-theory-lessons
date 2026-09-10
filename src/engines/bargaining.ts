// Nash axiomatic bargaining over splitting a pie of size 1, with disagreement point (d1, d2).
// The Nash solution maximizes the Nash product (u1 - d1)(u2 - d2) on the frontier u1 + u2 = 1.
// Framework-free and unit-testable.

/** The Nash product for player 1's share x, given the disagreement payoffs. */
export function nashProduct(x: number, d1: number, d2: number): number {
  return (x - d1) * (1 - x - d2);
}

/**
 * Player 1's share at the Nash bargaining solution: x* = (1 + d1 - d2) / 2, clamped to the
 * feasible range [d1, 1 - d2].
 */
export function nashSolution(d1: number, d2: number): number {
  const x = (1 + d1 - d2) / 2;
  return Math.max(d1, Math.min(1 - d2, x));
}
