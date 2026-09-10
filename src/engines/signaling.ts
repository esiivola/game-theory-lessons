// Spence job-market signaling. Two worker types, Low (productivity 1) and High (productivity 2).
// Education e is a costly signal that does not raise productivity; its cost is e/theta, so it is
// cheaper for the High type (single crossing). Firms pay the inferred productivity as a wage.
// Framework-free and unit-testable.

export const THETA_LOW = 1;
export const THETA_HIGH = 2;

/** Cost of education level e to a worker of productivity theta. */
export function cost(e: number, theta: number): number {
  return e / theta;
}

/** A worker's net payoff: the wage it is paid minus its education cost. */
export function net(wage: number, e: number, theta: number): number {
  return wage - cost(e, theta);
}

/**
 * Would the Low type mimic a separating education level e (to be paid the High wage)? It compares
 * grabbing the High wage at cost e/1 against staying at e=0 for the Low wage. Strict mimicry only.
 */
export function lowMimics(e: number): boolean {
  return net(THETA_HIGH, e, THETA_LOW) > net(THETA_LOW, 0, THETA_LOW);
}

/** Does the High type prefer to separate at e (High wage) over pooling down to e=0 (Low wage)? */
export function highSeparates(e: number): boolean {
  return net(THETA_HIGH, e, THETA_HIGH) >= net(THETA_LOW, 0, THETA_HIGH);
}

/** Is e a valid least-cost-or-higher separating signal? Low does not mimic and High still separates. */
export function isSeparating(e: number): boolean {
  return !lowMimics(e) && highSeparates(e);
}

/** The least-cost separating education level: e* = theta_high - theta_low. */
export function leastCostSeparating(): number {
  return THETA_HIGH - THETA_LOW;
}
