// Myerson optimal auction for one item, n bidders iid uniform on [0,1]. The optimal auction is a
// second-price auction with a reserve where the virtual value ψ(v) = 2v - 1 hits zero, r* = 1/2,
// independent of n. Framework-free and unit-testable.

/** Virtual value for the uniform distribution: 2v - 1. */
export function virtualValue(v: number): number {
  return 2 * v - 1;
}

/** The revenue-maximizing reserve: where the virtual value is zero, 1/2, for any n. */
export function optimalReserve(): number {
  return 0.5;
}

/** Expected seller revenue in a second-price auction with reserve r and n iid uniform bidders. */
export function expectedRevenue(r: number, n: number): number {
  // Exactly-one-above-reserve case pays the reserve; two-or-more pay the second-highest value.
  const oneAbove = r * n * (1 - r) * Math.pow(r, n - 1);
  if (n < 2) return oneAbove;
  const secondPart = n * (n - 1) * ((1 - Math.pow(r, n)) / n - (1 - Math.pow(r, n + 1)) / (n + 1));
  return oneAbove + secondPart;
}

/** Single-buyer monopoly revenue from posting price p: p(1-p), maximized at 1/2. */
export function monopolyRevenue(p: number): number {
  return p * (1 - p);
}
