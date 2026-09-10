// Top trading cycles (Shapley-Scarf housing market). Each agent owns one house and has strict
// preferences. Everyone points to the owner of their favourite remaining house; every cycle trades
// and leaves. The result is the unique core allocation and is strategy-proof. Framework-free.

export type Prefs = Record<string, string[]>;

export interface TtcRound { pointer: Record<string, string>; traded: string[]; }

/** Run TTC. `owns` maps agent -> house owned; `prefs` maps agent -> ranked houses. */
export function topTradingCycles(
  agents: string[],
  owns: Record<string, string>,
  prefs: Prefs
): { assignment: Record<string, string>; rounds: TtcRound[] } {
  const houseOwner: Record<string, string> = {};
  Object.entries(owns).forEach(([a, h]) => (houseOwner[h] = a));
  const assignment: Record<string, string> = {};
  const remaining = new Set(agents);
  const remHouses = new Set(Object.values(owns));
  const rounds: TtcRound[] = [];

  while (remaining.size > 0) {
    const pointer: Record<string, string> = {};
    for (const a of remaining) {
      const fav = prefs[a].find((h) => remHouses.has(h)) as string;
      pointer[a] = houseOwner[fav];
    }
    // Find every agent that lies on a cycle of the pointer graph.
    const inCycle = new Set<string>();
    for (const start of remaining) {
      if (inCycle.has(start)) continue;
      const path: string[] = [];
      const seen = new Set<string>();
      let cur = start;
      while (!seen.has(cur)) { seen.add(cur); path.push(cur); cur = pointer[cur]; }
      const ci = path.indexOf(cur);
      if (ci >= 0) for (let k = ci; k < path.length; k++) inCycle.add(path[k]);
    }
    const traded: string[] = [];
    for (const a of inCycle) {
      assignment[a] = prefs[a].find((h) => remHouses.has(h)) as string;
      traded.push(a);
    }
    for (const a of traded) { remaining.delete(a); remHouses.delete(assignment[a]); }
    rounds.push({ pointer, traded });
  }
  return { assignment, rounds };
}
