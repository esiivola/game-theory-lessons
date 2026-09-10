// Repeated games with imperfect public monitoring (Green-Porter). Players only see a noisy public
// signal, not each other's moves. A bad signal can appear even when both cooperated, so any trigger
// strategy sometimes punishes innocent cooperation. Framework-free and unit-testable.

/**
 * Long-run fraction of rounds spent cooperating under a trigger-and-forgive strategy: cooperate
 * until a bad signal, then punish for T rounds, then reset. q is the chance of a bad signal in a
 * cooperative round. A renewal argument gives (1/q) cooperative rounds per (1/q + T) total.
 * Grim trigger is T = Infinity, which drives cooperation to zero.
 */
export function coopFraction(q: number, T: number): number {
  if (q <= 0) return 1;
  if (!isFinite(T)) return 0;
  return 1 / (1 + q * T);
}

/** Average per-round payoff, blending the cooperative reward R and the punishment payoff P. */
export function avgPayoff(q: number, T: number, R: number, P: number): number {
  const f = coopFraction(q, T);
  return f * R + (1 - f) * P;
}

export type Phase = 'coop' | 'war';
export interface Round { signal: 'good' | 'bad'; phase: Phase; }

/**
 * Simulate a run of the trigger-and-forgive strategy while both players always intend to cooperate.
 * Bad signals arrive with probability q during cooperation and start a T-round war.
 */
export function simulate(q: number, T: number, rounds: number, rng: () => number = Math.random): Round[] {
  const out: Round[] = [];
  let warLeft = 0;
  for (let i = 0; i < rounds; i++) {
    if (warLeft > 0) {
      out.push({ signal: 'bad', phase: 'war' });
      warLeft -= 1;
      continue;
    }
    const bad = rng() < q;
    out.push({ signal: bad ? 'bad' : 'good', phase: 'coop' });
    if (bad) warLeft = isFinite(T) ? T : rounds; // grim: never forgive within the horizon
  }
  return out;
}
