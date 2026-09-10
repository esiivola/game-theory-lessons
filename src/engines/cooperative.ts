// Cooperative game theory for small games. A characteristic function v is an array indexed by
// coalition bitmask (bit i set means player i is in the coalition), v[0] = 0. Supports the core,
// the Shapley value, coalition excesses, and a numeric nucleolus. Framework-free and unit-testable.

export type CharFn = number[]; // length 2^n

/** Players present in a coalition bitmask. */
export function members(mask: number, n: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) if (mask & (1 << i)) out.push(i);
  return out;
}

const sumOver = (x: number[], mask: number, n: number) =>
  members(mask, n).reduce((s, i) => s + x[i], 0);

/** Coalitions that block allocation x: those getting less than they could guarantee themselves. */
export function blocking(x: number[], v: CharFn, n: number): number[] {
  const out: number[] = [];
  for (let mask = 1; mask < (1 << n) - 1; mask++) {
    if (v[mask] > sumOver(x, mask, n) + 1e-9) out.push(mask);
  }
  return out;
}

/** Is x in the core: efficient and unblocked by every coalition? */
export function isInCore(x: number[], v: CharFn, n: number): boolean {
  if (Math.abs(sumOver(x, (1 << n) - 1, n) - v[(1 << n) - 1]) > 1e-6) return false;
  return blocking(x, v, n).length === 0;
}

function permutations(n: number): number[][] {
  if (n === 0) return [[]];
  const out: number[][] = [];
  for (const p of permutations(n - 1)) {
    for (let i = 0; i <= p.length; i++) out.push([...p.slice(0, i), n - 1, ...p.slice(i)]);
  }
  return out;
}

/** Each player's marginal contribution when players join in the given order. */
export function marginalContributions(v: CharFn, order: number[], n: number): number[] {
  const out = new Array(n).fill(0);
  let mask = 0;
  for (const i of order) {
    const before = v[mask];
    mask |= (1 << i);
    out[i] = v[mask] - before;
  }
  return out;
}

/** The Shapley value: average marginal contribution over all join orders. */
export function shapley(v: CharFn, n: number): number[] {
  const perms = permutations(n);
  const total = new Array(n).fill(0);
  for (const p of perms) {
    const mc = marginalContributions(v, p, n);
    for (let i = 0; i < n; i++) total[i] += mc[i];
  }
  return total.map((t) => t / perms.length);
}

/** Excess (complaint) of each proper coalition at allocation x: v(S) minus what S is given. */
export function excesses(x: number[], v: CharFn, n: number): number[] {
  const out: number[] = [];
  for (let mask = 1; mask < (1 << n) - 1; mask++) out.push(v[mask] - sumOver(x, mask, n));
  return out;
}

/** Compare two excess vectors lexicographically by their descending-sorted entries. */
export function lexCompare(a: number[], b: number[]): number {
  const sa = [...a].sort((p, q) => q - p);
  const sb = [...b].sort((p, q) => q - p);
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] < sb[i] - 1e-12) return -1;
    if (sa[i] > sb[i] + 1e-12) return 1;
  }
  return 0;
}

/** Numeric nucleolus for a 3-player game: grid search minimizing the lexicographic excess vector. */
export function nucleolus3(v: CharFn): number[] {
  const V = v[7];
  let best: number[] = [V / 3, V / 3, V / 3];
  let bestExc: number[] = excesses(best, v, 3);
  const search = (lo: number[], hi: number[], steps: number) => {
    const sx = (hi[0] - lo[0]) / steps;
    const sy = (hi[1] - lo[1]) / steps;
    for (let i = 0; i <= steps; i++) {
      for (let j = 0; j <= steps; j++) {
        const x1 = lo[0] + i * sx;
        const x2 = lo[1] + j * sy;
        const x3 = V - x1 - x2;
        if (x3 < -1e-9) continue;
        const x = [x1, x2, Math.max(0, x3)];
        const e = excesses(x, v, 3);
        if (lexCompare(e, bestExc) < 0) { bestExc = e; best = x; }
      }
    }
  };
  search([0, 0], [V, V], 60);
  const d = V / 60;
  search([best[0] - d, best[1] - d], [best[0] + d, best[1] + d], 60);
  return best.map((z) => Math.round(z * 1000) / 1000);
}
