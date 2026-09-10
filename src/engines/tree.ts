// Extensive-form game trees and backward induction. Framework-free and unit-testable.
// Payoffs are [player-0 payoff, player-1 payoff]. Internal nodes name which player chooses.

export type Leaf = { kind: 'leaf'; payoff: [number, number] };
export type Branch = { label: string; child: Tree };
export type Node = { kind: 'node'; player: 0 | 1; label: string; branches: Branch[] };
export type Tree = Leaf | Node;

export const leaf = (payoff: [number, number]): Leaf => ({ kind: 'leaf', payoff });

/** The backward-induction payoff of a subtree (each mover picks the branch best for itself). */
export function value(t: Tree): [number, number] {
  if (t.kind === 'leaf') return t.payoff;
  const vals = t.branches.map((b) => value(b.child));
  let best = 0;
  for (let i = 1; i < vals.length; i++) {
    if (vals[i][t.player] > vals[best][t.player]) best = i;
  }
  return vals[best];
}

/** Index of the branch a rational mover chooses at this node under backward induction. */
export function bestBranch(n: Node): number {
  const vals = n.branches.map((b) => value(b.child));
  let best = 0;
  for (let i = 1; i < vals.length; i++) {
    if (vals[i][n.player] > vals[best][n.player]) best = i;
  }
  return best;
}
