// Rubinstein alternating-offers bargaining over a pie of size 1. Each round of delay shrinks a
// player's valuation by their discount factor. The unique subgame-perfect equilibrium has the
// first proposer offer immediately, keeping 1/(1+delta) with a common delta. Framework-free.

/** The proposer's equilibrium share with a common discount factor delta. */
export function proposerShare(delta: number): number {
  return 1 / (1 + delta);
}

/** The responder's equilibrium share (what the proposer must leave on the table). */
export function responderShare(delta: number): number {
  return delta / (1 + delta);
}

/** Two-sided version: proposer (player 1) share when the two sides discount at d1 and d2. */
export function proposerShareTwoSided(d1: number, d2: number): number {
  return (1 - d2) / (1 - d1 * d2);
}

/**
 * Whether the responder accepts an offer giving them `offerToResponder`, playing the SPE:
 * accept iff it is at least their continuation value from rejecting, delta/(1+delta).
 */
export function accepts(offerToResponder: number, delta: number): boolean {
  return offerToResponder >= responderShare(delta) - 1e-12;
}
