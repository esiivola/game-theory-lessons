// Sealed-bid auction sandbox: one resolver serving first-price (FPA) and second-price (SPA)
// formats, with an optional reserve. Independent private values. Framework-free and unit-testable.

export type Format = 'fpa' | 'spa';

/** Symmetric first-price equilibrium bid for value v with n bidders, values iid uniform: v(n-1)/n. */
export function fpaBid(v: number, n: number): number {
  return (v * (n - 1)) / n;
}

export interface Outcome { winner: number; price: number; sold: boolean; }

/**
 * Resolve a sealed-bid auction. `bids[i]` is bidder i's bid. The high bidder wins if their bid
 * clears the reserve; FPA charges the winner's own bid, SPA the greater of the second-highest bid
 * and the reserve. Ties go to the lower index.
 */
export function resolve(bids: number[], format: Format, reserve = 0): Outcome {
  let winner = -1;
  let hi = -Infinity;
  for (let i = 0; i < bids.length; i++) {
    if (bids[i] > hi) { hi = bids[i]; winner = i; }
  }
  if (winner === -1 || hi < reserve) return { winner: -1, price: 0, sold: false };
  let second = -Infinity;
  for (let i = 0; i < bids.length; i++) {
    if (i !== winner && bids[i] > second) second = bids[i];
  }
  const price = format === 'fpa' ? hi : Math.max(second, reserve);
  return { winner, price, sold: true };
}

/** Expected seller revenue with n bidders, values iid uniform on [0,1] and no reserve: (n-1)/(n+1). */
export function expectedRevenueUniform(n: number): number {
  return (n - 1) / (n + 1);
}
