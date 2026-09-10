// Evolutionary dynamics: Hawk-Dove ESS and replicator dynamics (2-strategy and Rock-Paper-Scissors).
// Framework-free and unit-testable.

export interface HawkDove { HH: number; HD: number; DH: number; DD: number; }

/** Hawk-Dove payoffs from resource value V and injury cost C. */
export function hawkDove(V: number, C: number): HawkDove {
  return { HH: (V - C) / 2, HD: V, DH: 0, DD: V / 2 };
}

/** Evolutionarily stable Hawk fraction: V/C when C > V, otherwise all-Hawk. */
export function essHawkFraction(V: number, C: number): number {
  return C > V ? V / C : 1;
}

export function hawkFitness(p: number, V: number, C: number): number {
  const m = hawkDove(V, C);
  return p * m.HH + (1 - p) * m.HD;
}
export function doveFitness(p: number, V: number, C: number): number {
  const m = hawkDove(V, C);
  return p * m.DH + (1 - p) * m.DD;
}

/** One replicator step for the Hawk fraction: dp = p(1-p)(f_H - f_D). */
export function replicatorStepHawk(p: number, V: number, C: number, dt: number): number {
  const diff = hawkFitness(p, V, C) - doveFitness(p, V, C);
  const next = p + dt * p * (1 - p) * diff;
  return Math.max(0, Math.min(1, next));
}

// Rock-Paper-Scissors payoff matrix with a tie payoff e (0 = fair; +/- creates spirals).
function rpsMatrix(e: number): number[][] {
  return [
    [e, -1, 1],
    [1, e, -1],
    [-1, 1, e],
  ];
}

/** One replicator step for an RPS population x = [rock, paper, scissors]. */
export function rpsStep(x: number[], e: number, dt: number): number[] {
  const A = rpsMatrix(e);
  const f = x.map((_, i) => A[i][0] * x[0] + A[i][1] * x[1] + A[i][2] * x[2]);
  const avg = x[0] * f[0] + x[1] * f[1] + x[2] * f[2];
  let next = x.map((xi, i) => Math.max(0, xi + dt * xi * (f[i] - avg)));
  const total = next[0] + next[1] + next[2];
  return next.map((v) => v / total);
}
