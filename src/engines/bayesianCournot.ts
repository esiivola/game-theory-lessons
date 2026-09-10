// Cournot competition with a privately-known cost (a Bayesian game). Inverse demand P = A - Q.
// Firm 1's cost is 0; firm 2 is low-cost (cLow) with probability mu and high-cost (cHigh) otherwise,
// unseen by firm 1. Firm 1 best-responds to the DISTRIBUTION of types, each firm-2 type to firm 1.
// Framework-free and unit-testable.

export const A = 12;
export const C_LOW = 0;
export const C_HIGH = 6;

/** Firm 2 (type with cost c) best-responds to firm 1's quantity q1. */
export function rivalBest(q1: number, c: number): number {
  return Math.max(0, (A - q1 - c) / 2);
}

/** Firm 1's Bayes-Nash quantity given the prior mu that firm 2 is low-cost: (A + expected cost)/3. */
export function equilibriumQ1(mu: number, cLow = C_LOW, cHigh = C_HIGH): number {
  const cbar = mu * cLow + (1 - mu) * cHigh;
  return (A + cbar) / 3;
}

/**
 * Firm 1's expected profit from choosing q1 while firm 2's two types stay at fixed quantities
 * q2Low and q2High. This is the Nash object: holding the rival at equilibrium, firm 1's profit
 * peaks at its own equilibrium quantity.
 */
export function firm1Profit(q1: number, mu: number, q2Low: number, q2High: number): number {
  const profitVs = (q2: number) => Math.max(0, A - q1 - q2) * q1;
  return mu * profitVs(q2Low) + (1 - mu) * profitVs(q2High);
}

/** The equilibrium type-conditional quantities for firm 2, given the prior mu. */
export function equilibriumRivalQ(mu: number, cLow = C_LOW, cHigh = C_HIGH): { low: number; high: number } {
  const q1 = equilibriumQ1(mu, cLow, cHigh);
  return { low: rivalBest(q1, cLow), high: rivalBest(q1, cHigh) };
}
