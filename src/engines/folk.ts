// Folk-theorem geometry for the repeated Prisoner's Dilemma (T5 R3 P1 S0).
// The feasible payoff set is the convex hull of the four stage-payoff pairs; the individually
// rational region is everything with both payoffs at or above the minmax value (P = 1). The folk
// theorem guarantees the strict interior for discount factors close to 1. Boundary points need
// separate analysis: some, including (P,P), are equilibria too. Framework-free and unit-testable.

export type Pt = [number, number];

// Hull vertices in counter-clockwise order: (P,P), (T,S), (R,R), (S,T).
export const PD_HULL: Pt[] = [
  [1, 1],
  [5, 0],
  [3, 3],
  [0, 5],
];
export const MINMAX = 1;

/** Is the point inside (or on the boundary of) the feasible convex hull? */
export function inFeasible(p: Pt, hull: Pt[] = PD_HULL): boolean {
  const n = hull.length;
  for (let i = 0; i < n; i++) {
    const a = hull[i];
    const b = hull[(i + 1) % n];
    const edge: Pt = [b[0] - a[0], b[1] - a[1]];
    const rel: Pt = [p[0] - a[0], p[1] - a[1]];
    const cross = edge[0] * rel[1] - edge[1] * rel[0];
    if (cross < -1e-9) return false; // outside this CCW edge
  }
  return true;
}

/**
 * Both players STRICTLY above the minmax payoff. This is the standard sufficient condition in the
 * folk theorem. It does not rule out boundary equilibria, which require separate analysis.
 */
export function isIndividuallyRational(p: Pt, minmax = MINMAX): boolean {
  return p[0] > minmax + 1e-9 && p[1] > minmax + 1e-9;
}

/** A payoff is guaranteed by the strict folk-theorem condition iff it is feasible and strictly IR. */
export function supportable(p: Pt): boolean {
  return inFeasible(p) && isIndividuallyRational(p);
}

export type Verdict = 'supportable' | 'on-minmax' | 'below-minmax' | 'infeasible';
export function classify(p: Pt): Verdict {
  if (!inFeasible(p)) return 'infeasible';
  if (isIndividuallyRational(p)) return 'supportable';
  if (p[0] >= MINMAX - 1e-9 && p[1] >= MINMAX - 1e-9) return 'on-minmax';
  return 'below-minmax';
}
