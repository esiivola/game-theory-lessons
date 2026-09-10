// Expected utility and risk aversion. A CRRA-style curve u(x) = x^r with r in (0,1] is concave,
// so the agent is risk-averse and the certainty equivalent of a gamble sits below its expected
// value. r = 1 is risk-neutral. Framework-free and unit-testable.

/** Utility of wealth x under curvature r. */
export function u(x: number, r: number): number {
  return Math.pow(x, r);
}

/** Certainty equivalent of a gamble paying a (prob pa) or b: the sure amount with equal utility. */
export function certaintyEquivalent(a: number, b: number, r: number, pa = 0.5): number {
  const eu = pa * u(a, r) + (1 - pa) * u(b, r);
  return Math.pow(eu, 1 / r);
}
