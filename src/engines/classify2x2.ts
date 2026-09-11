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
  | 'pure-coordination'
  | 'chicken'
  | 'matching-pennies'
  | 'cycling'
  | 'dominance-solvable'
  | 'general';

export const FAMILY_NAME: Record<Family, string> = {
  'prisoners-dilemma': 'Prisoner\u2019s Dilemma',
  'stag-hunt': 'Stag Hunt',
  'battle-of-the-sexes': 'Battle of the Sexes',
  'pure-coordination': 'Pure coordination',
  chicken: 'Chicken',
  'matching-pennies': 'Matching Pennies',
  cycling: 'Cycling, no pure equilibrium',
  'dominance-solvable': 'Dominance-solvable',
  general: 'General 2x2',
};

/** The player's strictly dominant strategy (a row for player 0, a column for player 1), or null. */
export function strictlyDominant(m: M2, player: 0 | 1): 0 | 1 | null {
  for (const own of [0, 1] as const) {
    const other = own === 0 ? 1 : 0;
    const beats = [0, 1].every((opp) =>
      player === 0
        ? m[own][opp][0] > m[other][opp][0]
        : m[opp][own][1] > m[opp][other][1]
    );
    if (beats) return own;
  }
  return null;
}

/**
 * Strictly competitive: the players rank the four outcomes in exactly opposite orders, so one
 * player's gain is always the other's loss. Constant-sum games qualify; so do their positive
 * affine rescalings, which a sum test would miss.
 */
export function isStrictlyCompetitive(m: M2): boolean {
  const cells: [number, number][] = [m[0][0], m[0][1], m[1][0], m[1][1]];
  for (let i = 0; i < cells.length; i++) {
    for (let j = i + 1; j < cells.length; j++) {
      const d1 = Math.sign(cells[i][0] - cells[j][0]);
      const d2 = Math.sign(cells[i][1] - cells[j][1]);
      if (d1 !== -d2) return false;
    }
  }
  return true;
}

/**
 * Does iterated elimination of strictly dominated strategies pin down a single cell? In a 2x2 that
 * needs one player to hold a strictly dominant strategy and the other to have a strict best reply
 * to it.
 */
export function isDominanceSolvable(m: M2): boolean {
  const r = strictlyDominant(m, 0);
  if (r !== null) return m[r][0][1] !== m[r][1][1];
  const c = strictlyDominant(m, 1);
  if (c !== null) return m[0][c][0] !== m[1][c][0];
  return false;
}

/**
 * Name the game's family from its structure. Each test is the family's defining property, not a
 * proxy: a Prisoner's Dilemma needs dominance plus a Pareto-dominated outcome, Matching Pennies
 * needs strictly opposed preferences, and anything that fits no family is reported as such rather
 * than filed under the nearest one.
 */
export function classify(m: M2): Family {
  const nash = pureNash(m);

  if (nash.length === 0) {
    // No resting cell, so best responses chase each other in a cycle. That cycle is Matching
    // Pennies only when the players want exactly opposite things.
    return isStrictlyCompetitive(m) ? 'matching-pennies' : 'cycling';
  }

  if (nash.length === 1) {
    const [r, c] = nash[0];
    const bothDominant = strictlyDominant(m, 0) !== null && strictlyDominant(m, 1) !== null;
    // The dilemma: dominance drags both players to a cell they would both trade away.
    if (bothDominant && paretoDominated(m, r, c)) return 'prisoners-dilemma';
    if (isDominanceSolvable(m)) return 'dominance-solvable';
    return 'general';
  }

  if (nash.length === 2) {
    const [a, b] = nash;
    const rowsDiffer = a[0] !== b[0];
    const colsDiffer = a[1] !== b[1];
    // Two equilibria sharing a row or a column mean one player is simply indifferent: neither
    // coordination nor anti-coordination.
    if (!rowsDiffer || !colsDiffer) return 'general';

    const matching = a[0] === a[1] && b[0] === b[1];
    if (!matching) return 'chicken'; // off-diagonal: each wants to do the opposite of the other

    const [a1, a2] = m[a[0]][a[1]];
    const [b1, b2] = m[b[0]][b[1]];
    if ((a1 > b1 && a2 < b2) || (a1 < b1 && a2 > b2)) return 'battle-of-the-sexes';
    if (a1 === b1 && a2 === b2) return 'pure-coordination';
    return 'stag-hunt';
  }

  return 'general';
}
