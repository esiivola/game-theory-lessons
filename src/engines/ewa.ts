// Experience-weighted attraction (EWA) learning (Camerer-Ho). It nests reinforcement learning
// (delta = 0, learn only from what you played) and belief learning / fictitious play
// (delta = 1 with phi = rho, learn from foregone payoffs too) in one model. Framework-free.

export interface EwaState { A: number[]; N: number; }

/**
 * One EWA update. `played` is the chosen action index; `payoffs[j]` is the payoff action j WOULD
 * have earned this round. phi = decay of past attractions, delta = weight on foregone payoffs,
 * rho = decay of the experience count.
 */
export function ewaUpdate(state: EwaState, played: number, payoffs: number[], phi: number, delta: number, rho: number): EwaState {
  const N = rho * state.N + 1;
  const A = state.A.map((Aj, j) => {
    const weight = delta + (1 - delta) * (j === played ? 1 : 0);
    return (phi * state.N * Aj + weight * payoffs[j]) / N;
  });
  return { A, N };
}

/** Logit choice probabilities from attractions. */
export function choiceProbs(A: number[], lambda: number): number[] {
  const ex = A.map((a) => Math.exp(lambda * a));
  const s = ex.reduce((p, q) => p + q, 0);
  return ex.map((e) => e / s);
}
