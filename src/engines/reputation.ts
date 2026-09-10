// The chain-store game with reputation (Kreps-Wilson, Milgrom-Roberts, KMRW). A long-lived
// incumbent faces a sequence of entrants across many towns. With small probability the incumbent
// is a "tough" type that always fights; a normal incumbent fights early to keep its reputation for
// toughness intact, and only accommodates once there is no future left to protect.
// Framework-free and unit-testable.

export type Response = 'fight' | 'accommodate';

// Entry-game payoffs to the entrant: staying out is 0.
export const ENTRANT = { accommodate: 2, fight: -1, out: 0 };

/**
 * Bayesian update of the belief that the incumbent is tough, after entering and observing a
 * response. `normalFightProb` is the chance the NORMAL type fights this town (the tough type
 * always fights). An accommodation can only come from the normal type, so it reveals normal.
 */
export function updatePosterior(mu: number, response: Response, normalFightProb: number): number {
  if (response === 'accommodate') return 0; // only a normal incumbent ever accommodates
  const num = mu; // tough fights with probability 1
  const den = mu + (1 - mu) * normalFightProb;
  return den === 0 ? mu : num / den;
}

/**
 * The entrant's expected payoff from entering, given belief `mu` that the incumbent is tough and
 * the probability `normalFightProb` that a normal incumbent would fight this town.
 */
export function entryValue(mu: number, normalFightProb: number): number {
  const pFight = mu + (1 - mu) * normalFightProb;
  const pAcc = 1 - pFight;
  return pAcc * ENTRANT.accommodate + pFight * ENTRANT.fight;
}

/** Should a rational entrant enter? Yes only if entering beats the outside value of 0. */
export function shouldEnter(mu: number, normalFightProb: number): boolean {
  return entryValue(mu, normalFightProb) > ENTRANT.out;
}
