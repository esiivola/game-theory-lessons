// Best-shot public goods on a network. Each node pays 1 to provide a good worth 2 to itself and its
// neighbours; a node is happy providing iff no neighbour provides, and happy not providing iff some
// neighbour does. Pure equilibria are exactly the maximal independent sets of providers.
// Framework-free and unit-testable.

export type Graph = Record<string, string[]>; // adjacency list

/** Best response for a node: provide iff none of its neighbours currently provides. */
export function bestResponse(node: string, provides: Set<string>, g: Graph): boolean {
  return !g[node].some((nb) => provides.has(nb));
}

/** Is the current provider set a pure Nash equilibrium (a maximal independent set)? */
export function isEquilibrium(provides: Set<string>, g: Graph): boolean {
  for (const node of Object.keys(g)) {
    const wants = bestResponse(node, provides, g);
    if (wants !== provides.has(node)) return false;
  }
  return true;
}

/** Run best-response dynamics from a starting provider set to an equilibrium. */
export function settle(start: Set<string>, g: Graph): Set<string> {
  const provides = new Set(start);
  for (let step = 0; step < 100; step++) {
    let changed = false;
    for (const node of Object.keys(g)) {
      const want = bestResponse(node, provides, g);
      if (want && !provides.has(node)) { provides.add(node); changed = true; }
      else if (!want && provides.has(node)) { provides.delete(node); changed = true; }
    }
    if (!changed) break;
  }
  return provides;
}
