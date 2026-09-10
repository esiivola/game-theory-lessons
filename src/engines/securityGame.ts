// Stackelberg security game. The defender commits to coverage probabilities across targets; the
// attacker observes and strikes the target maximizing its expected value. The optimal coverage
// equalizes the attacker's payoff across targets. Framework-free and unit-testable.

/** The target the attacker hits given coverage probabilities and target values. */
export function attackerTarget(coverage: number[], values: number[]): number {
  let best = 0, bestVal = -Infinity;
  for (let i = 0; i < values.length; i++) {
    const v = (1 - coverage[i]) * values[i]; // expected value if undefended
    if (v > bestVal) { bestVal = v; best = i; }
  }
  return best;
}

/** Defender's expected loss: the attacked target's value times the chance it is uncovered. */
export function expectedLoss(coverage: number[], values: number[]): number {
  const t = attackerTarget(coverage, values);
  return (1 - coverage[t]) * values[t];
}

/** Optimal coverage of target 0 (with one patrol unit over two targets) equalizing attacker payoff. */
export function optimalCoverageTwo(v0: number, v1: number): number {
  // (1 - c0) v0 = (1 - (1 - c0)) v1  ->  c0 = v0 / (v0 + v1)
  return v0 / (v0 + v1);
}
