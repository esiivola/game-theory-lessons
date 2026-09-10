// Quantal response equilibrium (logit). Instead of always best-responding, players choose better
// actions more often, with sharpness set by a rationality parameter lambda: lambda = 0 gives uniform
// randomization, lambda -> infinity gives exact best response (Nash). Framework-free and testable.

/** Probability of choosing action A over B given the expected-payoff advantage dEU = EU(A) - EU(B). */
export function logitProb(dEU: number, lambda: number): number {
  return 1 / (1 + Math.exp(-lambda * dEU));
}
