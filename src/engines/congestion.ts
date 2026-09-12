// Congestion / potential game: N drivers choose road A (cost equals the number of users) or road B
// (flat cost). Strict better-response dynamics reach a pure Nash equilibrium because an exact
// potential strictly decreases at every improving switch. Framework-free and unit-testable.

export const N = 4;
export const B_COST = 3;

/** Cost to a road-A user when x drivers use A. */
export function costA(x: number): number {
  return x;
}

/** Exact potential at x drivers on A (and N - x on B): sum of arrival costs on each road. */
export function potential(x: number, n = N, bCost = B_COST): number {
  const roadA = (x * (x + 1)) / 2; // 1 + 2 + ... + x
  const roadB = bCost * (n - x);
  return roadA + roadB;
}

/** Is x on A a pure Nash equilibrium (no driver wants to switch roads)? */
export function isEquilibrium(x: number, n = N, bCost = B_COST): boolean {
  // An A-user (cost x) would switch to B if B's cost after joining (bCost) is lower.
  if (x > 0 && bCost < costA(x)) return false;
  // A B-user (cost bCost) would switch to A if A's cost after joining (x+1) is lower.
  if (x < n && x + 1 < bCost) return false;
  return true;
}

/** Strict better-response path: starting from x on A, let one unhappy driver switch at a time. */
export function bestResponsePath(x0: number, n = N, bCost = B_COST): number[] {
  const path = [x0];
  let x = x0;
  for (let step = 0; step < 20; step++) {
    if (x < n && x + 1 < bCost) { x += 1; path.push(x); continue; } // a B-user moves to A
    if (x > 0 && bCost < costA(x)) { x -= 1; path.push(x); continue; } // an A-user moves to B
    break;
  }
  return path;
}
