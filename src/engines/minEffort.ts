// Minimum-effort (weakest-link) coordination game (Van Huyck, Battalio, Beil 1990).
// Each player picks an effort in {1..7}. Payoff = a + b * min(all efforts) - c * own effort.
// With a = 0.6, b = 0.2, c = 0.1, every "everyone picks x" is a Nash equilibrium; all-7 pays the
// most (1.3) and all-1 is the safest (0.7). Framework-free and unit-testable.

export interface Params { a: number; b: number; c: number; lo: number; hi: number; }
export const STD: Params = { a: 0.6, b: 0.2, c: 0.1, lo: 1, hi: 7 };

/** Payoff to a player given its own effort and the minimum effort in the group. */
export function payoff(own: number, groupMin: number, p: Params = STD): number {
  return p.a + p.b * groupMin - p.c * own;
}

/** Payoff when everyone (including you) coordinates on the same effort x. */
export function symmetricPayoff(x: number, p: Params = STD): number {
  return p.a + (p.b - p.c) * x;
}

/**
 * Best response to an expected group minimum among the others: match it. Going higher only pays
 * the marginal cost c with no gain (the min does not rise); going lower would lower the min itself.
 */
export function bestResponse(expectedOthersMin: number, p: Params = STD): number {
  return Math.max(p.lo, Math.min(p.hi, expectedOthersMin));
}

/** Is a common effort x a Nash equilibrium? Every common effort is, since b > 0 and b - c can be any sign. */
export function isEquilibrium(x: number, p: Params = STD): boolean {
  if (x < p.lo || x > p.hi) return false;
  // If all others play x, your min is min(own, x). Raising own above x leaves min at x but costs more,
  // and lowering own to y < x gives payoff a + b*y - c*y <= a + (b-c)*x iff (b-c)(x-y) >= ... check directly.
  const atX = payoff(x, x, p);
  for (let y = p.lo; y <= p.hi; y++) {
    const groupMin = Math.min(y, x);
    if (payoff(y, groupMin, p) > atX + 1e-12) return false;
  }
  return true;
}
