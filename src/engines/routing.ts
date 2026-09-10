// Price of anarchy (Pigou) and the Braess paradox. Selfish routing can be worse than a coordinated
// optimum, and adding a road can make everyone slower. Framework-free and unit-testable.

// --- Pigou: one unit of traffic, a fixed link (cost 1) and a congestible link (cost = its load). ---

/** Total travel time when a fraction f of traffic takes the congestible link. */
export function pigouCost(f: number): number {
  // fixed link carries (1-f) at cost 1; congestible link carries f at cost f.
  return (1 - f) * 1 + f * f;
}
/** Selfish (Nash) routing sends everyone to the congestible link: total cost 1. */
export const PIGOU_NASH = pigouCost(1); // = 1
/** The social optimum splits traffic in half: total cost 0.75. */
export const PIGOU_OPT = pigouCost(0.5); // = 0.75
/** Price of anarchy: Nash cost divided by optimum cost = 4/3. */
export const PIGOU_POA = PIGOU_NASH / PIGOU_OPT;

// --- Braess: 4000 drivers, two routes each x/100 + 45, plus an optional zero-cost shortcut. ---

/** Travel time per driver before the shortcut: traffic splits 2000/2000. */
export function braessBefore(): number {
  return 2000 / 100 + 45; // = 65
}
/** Travel time per driver after the zero-cost shortcut: everyone funnels through it. */
export function braessAfter(): number {
  return 4000 / 100 + 4000 / 100; // = 80
}
