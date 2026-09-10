// Classify a 2x2 game: count its pure-strategy Nash equilibria and name its family. Payoffs are
// indexed m[row 0|1][col 0|1] = [rowPayoff, colPayoff]. Framework-free and unit-testable.

export type Cell = [number, number];
export type M2 = [[Cell, Cell], [Cell, Cell]];

/** All pure-strategy Nash equilibria as [row, col] index pairs (weak: ties count as best replies). */
export function pureNash(m: M2): [number, number][] {
  const out: [number, number][] = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const otherR = r === 0 ? 1 : 0;
      const otherC = c === 0 ? 1 : 0;
      const rowBest = m[r][c][0] >= m[otherR][c][0];
      const colBest = m[r][c][1] >= m[r][otherC][1];
      if (rowBest && colBest) out.push([r, c]);
    }
  }
  return out;
}

/** Is cell (r,c) strictly Pareto-dominated by some other cell (both players strictly better)? */
function paretoDominated(m: M2, r: number, c: number): boolean {
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      if (i === r && j === c) continue;
      if (m[i][j][0] > m[r][c][0] && m[i][j][1] > m[r][c][1]) return true;
    }
  }
  return false;
}

export type Family =
  | 'prisoners-dilemma'
  | 'stag-hunt'
  | 'battle-of-the-sexes'
  | 'chicken'
  | 'matching-pennies'
  | 'dominance-solvable'
  | 'general';

export const FAMILY_NAME: Record<Family, string> = {
  'prisoners-dilemma': 'Prisoner’s Dilemma',
  'stag-hunt': 'Stag Hunt',
  'battle-of-the-sexes': 'Battle of the Sexes',
  chicken: 'Chicken',
  'matching-pennies': 'Matching Pennies',
  'dominance-solvable': 'Dominance-solvable',
  general: 'General 2x2',
};

/** A best-effort family label from the game's structure. */
export function classify(m: M2): Family {
  const nash = pureNash(m);
  if (nash.length === 0) return 'matching-pennies'; // no pure equilibrium: a cycling game
  if (nash.length === 1) {
    const [r, c] = nash[0];
    return paretoDominated(m, r, c) ? 'prisoners-dilemma' : 'dominance-solvable';
  }
  if (nash.length === 2) {
    const [a, b] = nash;
    const diagonal = a[0] === a[1] && b[0] === b[1]; // both on the main diagonal
    if (diagonal) {
      // Coordination. Do the players agree on which equilibrium is better?
      const p1PrefersA = m[a[0]][a[1]][0] > m[b[0]][b[1]][0];
      const p2PrefersA = m[a[0]][a[1]][1] > m[b[0]][b[1]][1];
      return p1PrefersA === p2PrefersA ? 'stag-hunt' : 'battle-of-the-sexes';
    }
    return 'chicken'; // two off-diagonal equilibria: anti-coordination
  }
  return 'general';
}
