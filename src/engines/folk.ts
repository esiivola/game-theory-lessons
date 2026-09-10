// Folk-theorem geometry for the repeated Prisoner's Dilemma (T5 R3 P1 S0).
// The feasible payoff set is the convex hull of the four stage-payoff pairs; the individually
// rational region is everything with both payoffs at or above the minmax value (P = 1). As the
// discount factor approaches 1, every feasible, individually rational point is a subgame-perfect
// equilibrium payoff. Framework-free and unit-testable.

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

/** Both players at or above the minmax payoff: no one would rather be punished. */
export function isIndividuallyRational(p: Pt, minmax = MINMAX): boolean {
  return p[0] >= minmax - 1e-9 && p[1] >= minmax - 1e-9;
}

/** A payoff is supportable as an equilibrium (for delta near 1) iff feasible and IR. */
export function supportable(p: Pt): boolean {
  return inFeasible(p) && isIndividuallyRational(p);
}

export type Verdict = 'supportable' | 'below-minmax' | 'infeasible';
export function classify(p: Pt): Verdict {
  if (!inFeasible(p)) return 'infeasible';
  if (!isIndividuallyRational(p)) return 'below-minmax';
  return 'supportable';
}
