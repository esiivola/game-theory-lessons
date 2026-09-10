// Median-voter model. Two candidates pick positions on a line; each voter backs the nearer one.
// The unique equilibrium has both candidates at the median. Framework-free and unit-testable.

export function median(voters: number[]): number {
  const s = [...voters].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Vote share for candidate 1 at position x1 against candidate 2 at x2 (ties split evenly). */
export function voteShare(x1: number, x2: number, voters: number[]): number {
  let s = 0;
  for (const v of voters) {
    const d1 = Math.abs(v - x1), d2 = Math.abs(v - x2);
    if (d1 < d2) s += 1; else if (d1 === d2) s += 0.5;
  }
  return s / voters.length;
}
