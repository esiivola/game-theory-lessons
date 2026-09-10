// Two-sided platform pricing. Adoption on each side rises with the other side's size (cross-side
// network effects), so a platform often prices one side below cost to ignite the other.
// Framework-free and unit-testable.

export const BASE = 100;   // baseline demand intercept per side
export const GAMMA = 0.5;  // cross-side network strength

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
