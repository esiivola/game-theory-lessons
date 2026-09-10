// Mixed-strategy math for 2x2 games. Framework-free and unit-testable.
// A 2x2 game: payoffs indexed [row 0|1][col 0|1] = [rowPayoff, colPayoff].
// The row player mixes with probability p on the top row.

export type Payoff = [number, number];
export type Matrix2 = [[Payoff, Payoff], [Payoff, Payoff]];

/** Column player's expected payoff to each of its two actions, given row plays top with prob p. */
export function colEV(m: Matrix2, p: number): [number, number] {
  const left = p * m[0][0][1] + (1 - p) * m[1][0][1];
  const right = p * m[0][1][1] + (1 - p) * m[1][1][1];
  return [left, right];
}

/** Row player's guaranteed payoff against each pure column response, given row plays top with prob p. */
export function rowGuarantee(m: Matrix2, p: number): [number, number] {
  const vsLeft = p * m[0][0][0] + (1 - p) * m[1][0][0];
  const vsRight = p * m[0][1][0] + (1 - p) * m[1][1][0];
  return [vsLeft, vsRight];
}

/**
 * p that makes the column player indifferent between its two actions (the row player's
 * mixed-Nash probability on the top row). Returns null if the two lines are parallel.
 */
export function indifferenceP(m: Matrix2): number | null {
  const atZero = m[1][0][1] - m[1][1][1]; // colEV(left) - colEV(right) at p = 0
  const atOne = m[0][0][1] - m[0][1][1]; // ... at p = 1
  const denom = atZero - atOne;
  if (denom === 0) return null;
  const p = atZero / denom;
  return p >= 0 && p <= 1 ? p : null;
}

/**
 * Maximin mix for a zero-sum-style game: the p where the two row-guarantee lines cross,
 * i.e. where the payoff the row player can guarantee is highest. Null if parallel.
 */
export function securityP(m: Matrix2): number | null {
  const atZero = m[1][0][0] - m[1][1][0];
  const atOne = m[0][0][0] - m[0][1][0];
  const denom = atZero - atOne;
  if (denom === 0) return null;
  const p = atZero / denom;
  return p >= 0 && p <= 1 ? p : null;
}

/** The value the row player can guarantee at mix p: the min over the column player's pure replies. */
export function guaranteedValue(m: Matrix2, p: number): number {
  const [a, b] = rowGuarantee(m, p);
  return Math.min(a, b);
}
