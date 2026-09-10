// The revelation principle, shown on a two-bidder first-price auction with values iid uniform on
// [0,1]. The first-price equilibrium bid is v/2; its outcome is reproduced by a direct mechanism in
// which each bidder reports its value truthfully. Framework-free and unit-testable.

/** First-price equilibrium bid with two bidders and uniform values: v/2. */
export function fpaBidTwo(v: number): number {
  return v / 2;
}

/** Probability of winning with value v against one rival with a uniform value: v. */
export function winProb(v: number): number {
  return v;
}

/** Interim expected payment: win probability times the equilibrium bid, v * (v/2) = v^2 / 2. */
export function interimPayment(v: number): number {
  return winProb(v) * fpaBidTwo(v);
}

/** Interim expected surplus: expected value from winning minus expected payment. */
export function interimSurplus(v: number): number {
  return winProb(v) * v - interimPayment(v); // v^2 - v^2/2 = v^2/2
}
