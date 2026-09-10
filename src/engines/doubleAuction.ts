// Myerson-Satterthwaite bilateral trade. A buyer with value v_b and a seller with cost v_s, both
// uniform on [0,1], trade through the Chatterjee-Samuelson linear double auction. No mechanism can
// be efficient, incentive compatible, individually rational, and budget balanced at once: trade
// happens only when v_b >= v_s + 1/4, missing efficient trades in the gap. Framework-free.

/** Buyer's linear equilibrium bid. */
export function buyerBid(vb: number): number {
  return (2 / 3) * vb + 1 / 12;
}

/** Seller's linear equilibrium ask. */
export function sellerAsk(vs: number): number {
  return (2 / 3) * vs + 1 / 4;
}

/** Trade occurs when the bid meets the ask, equivalently when v_b >= v_s + 1/4. */
export function tradeOccurs(vb: number, vs: number): boolean {
  return buyerBid(vb) >= sellerAsk(vs) - 1e-12;
}

/** Is this a socially efficient trade (positive gains) that the linear equilibrium misses? */
export function missedEfficientTrade(vb: number, vs: number): boolean {
  return vb >= vs && !tradeOccurs(vb, vs);
}

/** First-best expected gains from trade (trade whenever v_b >= v_s): 1/6. */
export const FIRST_BEST_SURPLUS = 1 / 6;
/** Expected surplus realized by the linear equilibrium: 9/64. */
export const LINEAR_SURPLUS = 9 / 64;
