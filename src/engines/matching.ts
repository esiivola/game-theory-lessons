// Deferred acceptance (Gale-Shapley) and stability checking, for one-to-one matching with strict
// preferences. Reused for the marriage market and for school choice (students propose, schools
// hold by priority). Framework-free and unit-testable.

export type Prefs = Record<string, string[]>;

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
