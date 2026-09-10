// Penalty-kick shootout as a zero-sum game, with an adaptive keeper that punishes patterns.
// Scoring probabilities (kicker's chance of scoring) from Palacios-Huerta (2003), indexed
// SCORE[kick][dive] with 0 = Left, 1 = Right (from the kicker's own point of view).

export type Side = 0 | 1; // 0 = Left, 1 = Right

export const SCORE: number[][] = [
  [0.60, 0.95], // kick Left:  keeper dives Left / dives Right
  [0.90, 0.70], // kick Right: keeper dives Left / dives Right
];

/** Kicker's equilibrium probability of shooting Left (the mix that equalizes the keeper's options). */
export function equilibriumKickLeft(): number {
  const num = SCORE[1][1] - SCORE[1][0];
  const den = SCORE[0][0] - SCORE[0][1] - SCORE[1][0] + SCORE[1][1];
  return num / den;
}

/** Scoring rate at the equilibrium mix: what an unreadable kicker earns regardless of the keeper. */
export function equilibriumValue(): number {
  const p = equilibriumKickLeft();
  return p * SCORE[0][0] + (1 - p) * SCORE[1][0];
}

/** The keeper's best dive given its belief that the kicker shoots Left with probability predLeft. */
export function keeperDive(predLeft: number): Side {
  const ifDiveLeft = predLeft * SCORE[0][0] + (1 - predLeft) * SCORE[1][0];
  const ifDiveRight = predLeft * SCORE[0][1] + (1 - predLeft) * SCORE[1][1];
  return ifDiveLeft <= ifDiveRight ? 0 : 1; // dive to the side that lowers the kicker's score
}

/**
 * The keeper's read of the kicker's next side. It conditions on the previous shot once it has
 * enough data (so alternation and other simple patterns are caught), and otherwise falls back
 * to the overall Left frequency.
 */
export function predictLeft(history: Side[]): number {
  if (history.length === 0) return 0.5;
  const last = history[history.length - 1];
  let following = 0;
  let left = 0;
  for (let i = 1; i < history.length; i++) {
    if (history[i - 1] === last) {
      following += 1;
      if (history[i] === 0) left += 1;
    }
  }
  if (following >= 3) return left / following;
  const overallLeft = history.filter((s) => s === 0).length;
  return overallLeft / history.length;
}

/** Expected scoring rate the keeper concedes given its read: lower means it has exploited you more. */
export function concededRate(predLeft: number): number {
  const dive = keeperDive(predLeft);
  return predLeft * SCORE[0][dive] + (1 - predLeft) * SCORE[1][dive];
}
