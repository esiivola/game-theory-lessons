// Two-sided platform pricing. Adoption on each side rises with the other side's size (cross-side
// network effects), so a platform often prices one side below cost to ignite the other.
// Framework-free and unit-testable.

export const BASE = 100;   // baseline demand intercept per side
export const GAMMA = 0.5;  // cross-side network strength

export interface PlatformParameters {
  baseA: number;
  baseB: number;
  sensitivityA: number;
  sensitivityB: number;
  crossA: number;
  crossB: number;
  revenueA: number;
  revenueB: number;
}

export const ASYMMETRIC_PLATFORM: PlatformParameters = {
  baseA: 100,
  baseB: 100,
  sensitivityA: 1.4,
  sensitivityB: 0.5,
  crossA: 0.3,
  crossB: 0.8,
  revenueA: 0,
  revenueB: 30,
};

export function platformOutcome(pA: number, pB: number, parameters: PlatformParameters) {
  const p = parameters;
  const denominator = 1 - p.crossA * p.crossB;
  const a = Math.max(0, (p.baseA - p.sensitivityA * pA + p.crossA * (p.baseB - p.sensitivityB * pB)) / denominator);
  const b = Math.max(0, p.baseB - p.sensitivityB * pB + p.crossB * a);
  return { a, b, profit: (pA + p.revenueA) * a + (pB + p.revenueB) * b };
}

/** Solve the adoption fixed point given prices to each side. */
export function users(pA: number, pB: number, base = BASE, g = GAMMA): { a: number; b: number } {
  const denom = 1 - g * g;
  const a = Math.max(0, (base * (1 + g) - pA - g * pB) / denom);
  const b = Math.max(0, (base * (1 + g) - pB - g * pA) / denom);
  return { a, b };
}

/** Platform profit at the given prices (price times adoption on each side). */
export function profit(pA: number, pB: number, base = BASE, g = GAMMA): number {
  const u = users(pA, pB, base, g);
  return pA * u.a + pB * u.b;
}
