// The economic-game lab: ultimatum, dictator, and trust games with Fehr-Schmidt inequity aversion.
// A responder dislikes getting less than the proposer (envy, weight alpha) and, less strongly,
// getting more (guilt, weight beta). Framework-free and unit-testable.

export const PIE = 10;

/** Responder's utility from keeping s (proposer keeps PIE - s), under Fehr-Schmidt preferences. */
export function responderUtility(s: number, alpha = 0.5, beta = 0.25, pie = PIE): number {
  const other = pie - s;
  return s - alpha * Math.max(other - s, 0) - beta * Math.max(s - other, 0);
}

/** The responder rejects an ultimatum offer of s if accepting yields negative utility. */
export function rejects(s: number, alpha = 0.5, pie = PIE): boolean {
  return responderUtility(s, alpha, 0, pie) < 0;
}

/** Smallest acceptable offer: reject below alpha*PIE/(1+2 alpha). */
export function rejectionThreshold(alpha = 0.5, pie = PIE): number {
  return (alpha * pie) / (1 + 2 * alpha);
}
