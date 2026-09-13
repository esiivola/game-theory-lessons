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

/** Logit QRE attack probabilities, based on each target's uncovered value. */
export function attackProbabilities(
  coverage: number[],
  values: number[],
  precision: number,
): number[] {
  const utilities = values.map((value, i) => (1 - coverage[i]) * value);
  const peak = Math.max(...utilities);
  const weights = utilities.map((utility) => Math.exp(precision * (utility - peak)));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return weights.map((weight) => weight / total);
}

/** Defender loss when a logit QRE attacker may choose either target. */
export function behavioralExpectedLoss(
  coverage: number[],
  values: number[],
  precision: number,
): number {
  const probabilities = attackProbabilities(coverage, values, precision);
  return probabilities.reduce(
    (loss, probability, i) => loss + probability * (1 - coverage[i]) * values[i],
    0,
  );
}

/** Best two-target allocation against a logit QRE attacker, to the nearest 0.001. */
export function optimalBehavioralCoverageTwo(v0: number, v1: number, precision: number): number {
  let bestCoverage = 0;
  let bestLoss = Infinity;
  for (let step = 0; step <= 1000; step++) {
    const coverage = step / 1000;
    const loss = behavioralExpectedLoss([coverage, 1 - coverage], [v0, v1], precision);
    if (loss < bestLoss) {
      bestCoverage = coverage;
      bestLoss = loss;
    }
  }
  return bestCoverage;
}
