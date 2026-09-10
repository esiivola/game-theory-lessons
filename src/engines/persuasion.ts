// Bayesian persuasion (Kamenica-Gentzkow), prosecutor-judge case. The prior probability of guilt is
// PRIOR; the judge convicts only if the posterior reaches THRESH. The prosecutor commits (honestly)
// to a signal that always reports "guilty" when guilty and reports "guilty" with probability x when
// innocent. Framework-free and unit-testable.

export const PRIOR = 0.3;
export const THRESH = 0.5;

/** Posterior probability of guilt after a "guilty" report, given innocent-flag rate x. */
export function posteriorGuilty(x: number, prior = PRIOR): number {
  const pGuiltyMsg = prior + (1 - prior) * x;
  return pGuiltyMsg === 0 ? prior : prior / pGuiltyMsg;
}

/** The innocent-flag rate x that pushes the posterior exactly to the conviction threshold. */
export function optimalFalsePositive(prior = PRIOR, thresh = THRESH): number {
  return (prior * (1 - thresh)) / ((1 - prior) * thresh);
}

/** Conviction rate: the chance of a "guilty" report, but only if the judge actually convicts on it. */
export function convictionRate(x: number, prior = PRIOR, thresh = THRESH): number {
  const pGuiltyMsg = prior + (1 - prior) * x;
  return posteriorGuilty(x, prior) >= thresh ? pGuiltyMsg : 0;
}
