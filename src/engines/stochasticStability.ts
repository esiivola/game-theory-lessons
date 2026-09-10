// Stochastic stability in the Stag Hunt. Two strict equilibria, all-Stag (payoff-dominant) and
// all-Hare (risk-dominant). With rare mutations, the risk-dominant convention is stochastically
// stable: it is the one the population spends almost all its time at in the long run.
// Payoffs (Stag,Stag)=(4,4), (Stag,Hare)=(0,3), (Hare,Stag)=(3,0), (Hare,Hare)=(3,3).

/** Play Stag only if the belief q that the partner plays Stag is at least this threshold. */
export function stagThreshold(): number {
  return 3 / 4; // 4q >= 3  =>  q >= 3/4
}

/** Best response to a belief q that the partner plays Stag. */
export function bestResponse(q: number): 'stag' | 'hare' {
  return 4 * q >= 3 ? 'stag' : 'hare';
}

/** Basin of attraction (share of beliefs) for each convention. */
export function basins(): { stag: number; hare: number } {
  return { stag: 1 - stagThreshold(), hare: stagThreshold() };
}

/** The risk-dominant, hence stochastically stable, convention: the larger basin. */
export function stochasticallyStable(): 'stag' | 'hare' {
  const b = basins();
  return b.hare > b.stag ? 'hare' : 'stag';
}
