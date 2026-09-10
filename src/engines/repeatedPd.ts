// Infinitely repeated Prisoner's Dilemma with discounting. Framework-free and unit-testable.
// Standard course payoffs T=5, R=3, P=1, S=0. A player discounts future stage payoffs by delta,
// which is equivalent to a match that ends after each round with probability 1 - delta.

export type Play = 'C' | 'D';
export type StratId = 'allc' | 'tft' | 'grim' | 'alld';

export interface Pd {
  T: number; // temptation: defect against a cooperator
  R: number; // reward: both cooperate
  P: number; // punishment: both defect
  S: number; // sucker: cooperate against a defector
}

export const STD_PD: Pd = { T: 5, R: 3, P: 1, S: 0 };

export const STRAT_NAMES: Record<StratId, string> = {
  allc: 'Always cooperate',
  tft: 'Tit-for-tat',
  grim: 'Grim trigger',
  alld: 'Always defect',
};

/** Grim-trigger sustains cooperation in the infinitely repeated PD iff delta >= (T-R)/(T-P). */
export function grimThreshold(pd: Pd = STD_PD): number {
  return (pd.T - pd.R) / (pd.T - pd.P);
}

/** A strategy's move this round, given its own and the opponent's move histories. */
export function move(strat: StratId, myHist: Play[], theirHist: Play[]): Play {
  switch (strat) {
    case 'allc':
      return 'C';
    case 'alld':
      return 'D';
    case 'tft':
      return theirHist.length === 0 ? 'C' : theirHist[theirHist.length - 1];
    case 'grim':
      return theirHist.includes('D') ? 'D' : 'C';
  }
}

/** Stage payoff to the first player for a pair of moves. */
export function stagePayoff(mine: Play, theirs: Play, pd: Pd = STD_PD): number {
  if (mine === 'C') return theirs === 'C' ? pd.R : pd.S;
  return theirs === 'C' ? pd.T : pd.P;
}

export interface Match {
  moves: [Play, Play][]; // per round, [a's move, b's move]
  payA: number[];
  payB: number[];
}

/** Play two deterministic strategies against each other for a fixed number of rounds. */
export function playMatch(a: StratId, b: StratId, rounds: number, pd: Pd = STD_PD): Match {
  const histA: Play[] = [];
  const histB: Play[] = [];
  const moves: [Play, Play][] = [];
  const payA: number[] = [];
  const payB: number[] = [];
  for (let t = 0; t < rounds; t++) {
    const ma = move(a, histA, histB);
    const mb = move(b, histB, histA);
    moves.push([ma, mb]);
    payA.push(stagePayoff(ma, mb, pd));
    payB.push(stagePayoff(mb, ma, pd));
    histA.push(ma);
    histB.push(mb);
  }
  return { moves, payA, payB };
}

/** Present discounted value of a stream of stage payoffs: sum_t delta^t * u_t. */
export function discounted(payoffs: number[], delta: number): number {
  let sum = 0;
  let d = 1;
  for (const u of payoffs) {
    sum += d * u;
    d *= delta;
  }
  return sum;
}

/** Expected discounted payoff to each strategy in a long match (equivalently, random stopping). */
export function expectedDiscounted(
  a: StratId,
  b: StratId,
  delta: number,
  pd: Pd = STD_PD,
  rounds = 500
): { a: number; b: number } {
  const m = playMatch(a, b, rounds, pd);
  return { a: discounted(m.payA, delta), b: discounted(m.payB, delta) };
}

/** Round-robin tournament: each strategy's average discounted score against all the others. */
export function tournament(
  strats: StratId[],
  delta: number,
  pd: Pd = STD_PD,
  rounds = 500
): { id: StratId; score: number }[] {
  const totals = new Map<StratId, number>(strats.map((s) => [s, 0]));
  for (const a of strats) {
    for (const b of strats) {
      if (a === b) continue;
      const { a: sa } = expectedDiscounted(a, b, delta, pd, rounds);
      totals.set(a, (totals.get(a) as number) + sa);
    }
  }
  const opponents = strats.length - 1;
  return strats
    .map((id) => ({ id, score: (totals.get(id) as number) / Math.max(1, opponents) }))
    .sort((x, y) => y.score - x.score);
}
