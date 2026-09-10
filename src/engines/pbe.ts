// The Gift game (Watson) and its perfect Bayesian equilibria. A sender is a Friend with prior
// probability p or an Enemy otherwise; the sender chooses Give or Not; a receiver who sees a gift
// (but not the type) chooses Accept or Reject. Framework-free and unit-testable.
//
// Payoffs (sender, receiver): Friend+Accept (1,1), Friend+Reject (-1,0), Enemy+Accept (1,-1),
// Enemy+Reject (-1,0), Not give (0,0). Both types would rather have a gift accepted than not give,
// so there is no separating equilibrium; the receiver's belief is what matters.

/** Receiver's expected payoff from accepting, given belief b = P(Friend | gift); rejecting pays 0. */
export function acceptEV(b: number): number {
  return 2 * b - 1; // b*1 + (1-b)*(-1)
}

/** The receiver accepts iff the posterior that the sender is a Friend is at least 1/2. */
export function receiverAccepts(b: number): boolean {
  return acceptEV(b) >= 0;
}

/**
 * Is "both types Give" a perfect Bayesian equilibrium at prior p? On the path both types give, so
 * Bayes fixes the belief after a gift at p; the receiver then accepts iff p >= 1/2, and if accepted
 * both senders prefer giving (1) to not (0). So pooling-on-Give is a PBE exactly when p >= 1/2.
 */
export function poolingOnGiveIsPBE(p: number): boolean {
  return receiverAccepts(p);
}

/** The equilibrium play at prior p: pooling on Give (accepted) if p >= 1/2, else pooling on Not. */
export function equilibrium(p: number): 'pool-give' | 'pool-not' {
  return poolingOnGiveIsPBE(p) ? 'pool-give' : 'pool-not';
}
