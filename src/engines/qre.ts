// Quantal response equilibrium (logit). Instead of always best-responding, players choose better
// actions more often, with sharpness set by a rationality parameter lambda: lambda = 0 gives uniform
// randomization, lambda -> infinity gives exact best response (Nash). Framework-free and testable.

/** Probability of choosing action A over B given the expected-payoff advantage dEU = EU(A) - EU(B). */
export function logitProb(dEU: number, lambda: number): number {
  return 1 / (1 + Math.exp(-lambda * dEU));
}

type Matrix2 = [[number, number], [number, number]];

export function logitQre2x2(
  payoffs: { row: Matrix2; col: Matrix2 },
  lambda: number
): { rowA: number; colA: number } {
  let rowA = 0.5;
  let colA = 0.5;
  for (let i = 0; i < 10000; i++) {
    const rowAdvantage =
      colA * (payoffs.row[0][0] - payoffs.row[1][0]) +
      (1 - colA) * (payoffs.row[0][1] - payoffs.row[1][1]);
    const colAdvantage =
      rowA * (payoffs.col[0][0] - payoffs.col[0][1]) +
      (1 - rowA) * (payoffs.col[1][0] - payoffs.col[1][1]);
    const nextRow = logitProb(rowAdvantage, lambda);
    const nextCol = logitProb(colAdvantage, lambda);
    if (Math.abs(nextRow - rowA) + Math.abs(nextCol - colA) < 1e-10) {
      return { rowA: nextRow, colA: nextCol };
    }
    rowA = 0.75 * rowA + 0.25 * nextRow;
    colA = 0.75 * colA + 0.25 * nextCol;
  }
  return { rowA, colA };
}
