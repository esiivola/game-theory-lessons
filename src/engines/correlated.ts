// Correlated equilibrium in the game of Chicken, with a traffic-light mediator.
// Payoffs (row, col): (Swerve,Swerve)=(6,6), (Swerve,Straight)=(2,7),
// (Straight,Swerve)=(7,2), (Straight,Straight)=(0,0). Framework-free and unit-testable.

export type Move = 'swerve' | 'straight';

export const CHICKEN: Record<Move, Record<Move, [number, number]>> = {
  swerve: { swerve: [6, 6], straight: [2, 7] },
  straight: { swerve: [7, 2], straight: [0, 0] },
};

/** Row player's payoff when it plays `me` against `them`. */
export function payoff(me: Move, them: Move): number {
  return CHICKEN[me][them][0];
}

/** Symmetric mixed-Nash probability of playing Straight, and its per-player value. */
export function mixedNashStraight(): number {
  return 1 / 3;
}
export function mixedNashValue(): number {
  const q = mixedNashStraight();
  // Payoff to Swerve when the opponent plays Straight with probability q.
  return q * payoff('swerve', 'straight') + (1 - q) * payoff('swerve', 'swerve');
}

/** The mediator draws uniformly from the three cells other than (Straight, Straight). */
export const DEVICE: [Move, Move][] = [
  ['swerve', 'swerve'],
  ['swerve', 'straight'],
  ['straight', 'swerve'],
];

/** Expected payoff to each player when both obey the mediator. */
export function correlatedValue(): { row: number; col: number } {
  let r = 0, c = 0;
  for (const [a, b] of DEVICE) {
    r += CHICKEN[a][b][0];
    c += CHICKEN[a][b][1];
  }
  return { row: r / DEVICE.length, col: c / DEVICE.length };
}

/** Given the row player is told `rec`, the conditional distribution over the opponent's move. */
export function conditional(rec: Move): { swerve: number; straight: number } {
  const cells = DEVICE.filter((c) => c[0] === rec);
  const swerve = cells.filter((c) => c[1] === 'swerve').length / cells.length;
  return { swerve, straight: 1 - swerve };
}

/** Expected payoff to the row player from playing `play` after being told `rec`. */
export function expectedIf(play: Move, rec: Move): number {
  const cd = conditional(rec);
  return cd.swerve * payoff(play, 'swerve') + cd.straight * payoff(play, 'straight');
}

/** Obedience is a best response iff following each recommendation beats deviating from it. */
export function obedienceHolds(): boolean {
  const moves: Move[] = ['swerve', 'straight'];
  return (['swerve', 'straight'] as Move[]).every((rec) => {
    const other = moves.find((m) => m !== rec) as Move;
    return expectedIf(rec, rec) >= expectedIf(other, rec);
  });
}
