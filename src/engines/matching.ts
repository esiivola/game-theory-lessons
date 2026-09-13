// Deferred acceptance (Gale-Shapley) and stability checking, for one-to-one matching with strict
// preferences. Reused for the marriage market and for school choice (students propose, schools
// hold by priority). Framework-free and unit-testable.

export type Prefs = Record<string, string[]>;
export type CompatibilityGraph = Record<string, string[]>;

export function directedCycles(graph: CompatibilityGraph, maxLength: number): string[][] {
  const found = new Map<string, string[]>();
  for (const start of Object.keys(graph)) {
    const visit = (path: string[]) => {
      const current = path[path.length - 1];
      for (const next of graph[current] ?? []) {
        if (next === start && path.length >= 2) {
          const rotations = path.map((_, i) => [...path.slice(i), ...path.slice(0, i)]);
          const cycle = rotations.sort((a, b) => a.join('|').localeCompare(b.join('|')))[0];
          found.set(cycle.join('|'), cycle);
        } else if (path.length < maxLength && !path.includes(next)) {
          visit([...path, next]);
        }
      }
    };
    visit([start]);
  }
  return [...found.values()].sort((a, b) => a.join('|').localeCompare(b.join('|')));
}

export function longestDonorChain(
  graph: CompatibilityGraph,
  donor: string,
  maxPairs: number,
): string[] {
  let best = [donor];
  const visit = (path: string[]) => {
    if (path.length > best.length || (path.length === best.length && path.join('|') < best.join('|'))) {
      best = path;
    }
    if (path.length > maxPairs) return;
    for (const next of graph[path[path.length - 1]] ?? []) {
      if (!path.includes(next)) visit([...path, next]);
    }
  };
  visit([donor]);
  return best;
}

/**
 * Proposer-optimal deferred acceptance. Each proposer works down its list; each receiver holds its
 * best proposer so far and rejects the rest. Returns the matching as proposer -> receiver.
 */
export function deferredAcceptance(proposers: string[], proposerPrefs: Prefs, receiverPrefs: Prefs): Record<string, string> {
  const nextIdx: Record<string, number> = {};
  proposers.forEach((p) => (nextIdx[p] = 0));
  const held: Record<string, string | null> = {};
  Object.keys(receiverPrefs).forEach((r) => (held[r] = null));
  const free = new Set(proposers);

  while (free.size > 0) {
    const p = [...free][0];
    const list = proposerPrefs[p];
    if (nextIdx[p] >= list.length) { free.delete(p); continue; } // exhausted list
    const r = list[nextIdx[p]++];
    const rank = receiverPrefs[r];
    if (!rank || rank.indexOf(p) === -1) continue; // receiver would never accept p
    const cur = held[r];
    if (cur === null) { held[r] = p; free.delete(p); }
    else if (rank.indexOf(p) < rank.indexOf(cur)) { held[r] = p; free.delete(p); free.add(cur); }
  }

  const match: Record<string, string> = {};
  Object.entries(held).forEach(([r, p]) => { if (p) match[p] = r; });
  return match;
}

/**
 * Blocking pairs of a matching given both sides' preferences. `match` maps each side to its partner.
 * A pair (a, b) blocks if a prefers b to its partner and b prefers a to its partner.
 */
export function blockingPairs(
  match: Record<string, string>,
  aPrefs: Prefs,
  bPrefs: Prefs
): [string, string][] {
  const out: [string, string][] = [];
  for (const a of Object.keys(aPrefs)) {
    for (const b of aPrefs[a]) {
      if (!bPrefs[b]) continue;
      const aBetter = match[a] === undefined || aPrefs[a].indexOf(b) < aPrefs[a].indexOf(match[a]);
      const bBetter = match[b] === undefined || bPrefs[b].indexOf(a) < bPrefs[b].indexOf(match[b]);
      if (aBetter && bBetter) out.push([a, b]);
    }
  }
  return out;
}
