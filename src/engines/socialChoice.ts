// Social choice: pairwise majority and Condorcet cycles. A ranking lists alternatives best to
// worst. Majority rule can fail to produce a consistent winner (a Condorcet cycle), which is the
// seed of Arrow's theorem. Framework-free and unit-testable.

export type Rank = string[];

/** Does this voter prefer x to y? */
export function prefers(r: Rank, x: string, y: string): boolean {
  return r.indexOf(x) < r.indexOf(y);
}

/** Pairwise majority winner between x and y (null on a tie). */
export function pairwiseWinner(rankings: Rank[], x: string, y: string): string | null {
  let xw = 0, yw = 0;
  for (const r of rankings) (prefers(r, x, y) ? xw++ : yw++);
  return xw > yw ? x : yw > xw ? y : null;
}

/** The Condorcet winner (beats every other alternative pairwise), or null if none exists. */
export function condorcetWinner(rankings: Rank[], alts: string[]): string | null {
  for (const x of alts) {
    if (alts.every((y) => y === x || pairwiseWinner(rankings, x, y) === x)) return x;
  }
  return null;
}

/** Is there a majority cycle: no Condorcet winner, so majority rule is intransitive here? */
export function hasCycle(rankings: Rank[], alts: string[]): boolean {
  return condorcetWinner(rankings, alts) === null;
}
