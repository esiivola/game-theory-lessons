// Trembling-hand refinement on a 2x2. Some Nash equilibria survive only because opponents play a
// weakly dominated action that is never actually tested. Injecting a small tremble (each action
// played by mistake with probability eps) breaks those. Payoffs m[row][col] = [rowPayoff, colPayoff].
// Framework-free and unit-testable.

export type Cell = [number, number];
export type M2 = [[Cell, Cell], [Cell, Cell]];

// The coordination-style game: (T,L) pays (1,1), every other cell pays (0,0).
export const COORD: M2 = [[[1, 1], [0, 0]], [[0, 0], [0, 0]]];

/** Row's expected payoff to row action r when the column player intends colIntended but trembles. */
export function rowPayoffVsTremble(m: M2, r: number, colIntended: number, eps: number): number {
  const other = colIntended === 0 ? 1 : 0;
  return (1 - eps) * m[r][colIntended][0] + eps * m[r][other][0];
}

/** Column's expected payoff to column action c when the row player intends rowIntended but trembles. */
export function colPayoffVsTremble(m: M2, c: number, rowIntended: number, eps: number): number {
  const other = rowIntended === 0 ? 1 : 0;
  return (1 - eps) * m[rowIntended][c][1] + eps * m[other][c][1];
}

/** Does the pure profile (r,c) survive a tremble of size eps: is each action still a best reply? */
export function survivesTremble(m: M2, r: number, c: number, eps: number): boolean {
  const rOther = r === 0 ? 1 : 0;
  const cOther = c === 0 ? 1 : 0;
  const rowOK = rowPayoffVsTremble(m, r, c, eps) >= rowPayoffVsTremble(m, rOther, c, eps) - 1e-12;
  const colOK = colPayoffVsTremble(m, c, r, eps) >= colPayoffVsTremble(m, cOther, r, eps) - 1e-12;
  return rowOK && colOK;
}
