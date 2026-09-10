// Akerlof's market for lemons. Car quality q is uniform on [0, QMAX]. A seller values a car at q,
// so at price p only sellers with q <= p list. Buyers value a car at BUYER_MULT times its quality.
// Because listing selects the worse cars, the buyer's willingness to pay falls below the price for
// every positive p, and the market unravels. Framework-free and unit-testable.

export const QMAX = 100;
export const BUYER_MULT = 1.5;

/** Average quality of cars actually listed at price p: E[q | q <= p] for uniform q. */
export function avgQualityOnMarket(p: number): number {
  return Math.min(Math.max(p, 0), QMAX) / 2;
}

/** Buyer's willingness to pay at price p: BUYER_MULT times the average listed quality (= 0.75 p). */
export function buyerWTP(p: number): number {
  return BUYER_MULT * avgQualityOnMarket(p);
}

/** Fraction of sellers who list at price p. */
export function fractionSelling(p: number): number {
  return Math.min(Math.max(p, 0), QMAX) / QMAX;
}

/** Does the market clear? Only when the buyer's WTP covers the price, which happens solely at p = 0. */
export function marketClears(p: number): boolean {
  return p <= 0 || buyerWTP(p) >= p;
}
