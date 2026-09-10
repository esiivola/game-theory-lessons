// The p-beauty contest (guess 2/3 of the average). Level-k reasoning: level 0 picks at random
// (average 50), and each higher level best-responds to the level below. Framework-free and testable.

/** A level-k reasoner's guess: 50 * (2/3)^k. Level 0 = 50, level 1 = 33.3, level 2 = 22.2, ... */
export function levelKGuess(k: number): number {
  return 50 * Math.pow(2 / 3, k);
}

/** The winning target: two-thirds of the average of all guesses. */
export function target(guesses: number[]): number {
  const avg = guesses.reduce((a, b) => a + b, 0) / guesses.length;
  return (2 / 3) * avg;
}

/** Index of the guess closest to the target (ties go to the lower index). */
export function winner(guesses: number[]): number {
  const t = target(guesses);
  let best = 0;
  let bestDist = Infinity;
  guesses.forEach((g, i) => {
    const d = Math.abs(g - t);
    if (d < bestDist) { bestDist = d; best = i; }
  });
  return best;
}
