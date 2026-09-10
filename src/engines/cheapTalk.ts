// Crawford-Sobel cheap talk. An expert knows the state theta ~ U[0,1] and has a bias b: it wants
// the receiver to take action theta + b, while the receiver wants theta. Messages are costless.
// The most informative equilibrium partitions [0,1] into intervals; the larger the bias, the fewer
// intervals, collapsing to babbling (one interval) once b >= 1/4. Framework-free and unit-testable.

/** Maximum number of informative message intervals at bias b (Infinity as b -> 0, full revelation). */
export function maxIntervals(b: number): number {
  if (b <= 0) return Infinity;
  let n = 1;
  while ((n + 1) * n < 1 / (2 * b)) n += 1;
  return n;
}

/** Does an informative (at least two-interval) equilibrium exist? Only when b < 1/4. */
export function informativeExists(b: number): boolean {
  return b < 0.25;
}

/** The boundary type of the two-interval equilibrium: a1 = 1/2 - 2b (valid when b < 1/4). */
export function boundaryTwoInterval(b: number): number {
  return 0.5 - 2 * b;
}

/** The two receiver actions induced by the two-interval equilibrium: the interval midpoints. */
export function twoIntervalActions(b: number): [number, number] {
  const a1 = boundaryTwoInterval(b);
  return [a1 / 2, (a1 + 1) / 2];
}
