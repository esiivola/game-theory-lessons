<script lang="ts">
  import { settle, isEquilibrium, bestResponse, type Graph } from '@/engines/graphical';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const GRAPHS: Record<string, { g: Graph; pos: Record<string, [number, number]> }> = {
    Star: {
      g: { c: ['l1', 'l2', 'l3', 'l4', 'l5'], l1: ['c'], l2: ['c'], l3: ['c'], l4: ['c'], l5: ['c'] },
      pos: { c: [140, 110], l1: [140, 24], l2: [225, 75], l3: [200, 175], l4: [80, 175], l5: [55, 75] },
    },
    'Six-cycle': {
      g: { a: ['b', 'f'], b: ['a', 'c'], c: ['b', 'd'], d: ['c', 'e'], e: ['d', 'f'], f: ['e', 'a'] },
      pos: { a: [140, 24], b: [225, 72], c: [225, 148], d: [140, 196], e: [55, 148], f: [55, 72] },
    },
  };

  let predicted = $state(predict === null);
  let which = $state<'Star' | 'Six-cycle'>('Star');
  let provides = $state<Set<string>>(new Set());

  const graph = $derived(GRAPHS[which].g);
  const pos = $derived(GRAPHS[which].pos);
  const nodes = $derived(Object.keys(graph));
  const eq = $derived(isEquilibrium(provides, graph));
  const edges = $derived.by(() => {
    const seen = new Set<string>();
    const out: [string, string][] = [];
    for (const n of nodes) for (const m of graph[n]) { const k = [n, m].sort().join('-'); if (!seen.has(k)) { seen.add(k); out.push([n, m]); } }
    return out;
  });

  function toggle(n: string) { const s = new Set(provides); s.has(n) ? s.delete(n) : s.add(n); provides = s; }
  function run() { provides = settle(provides, graph); }
  function setGraph(w: 'Star' | 'Six-cycle') { which = w; provides = new Set(); }
  function onPredict() { predicted = true; }
</script>

<div class="widget">
  {#if exhibit || caption}
    <div class="exhibit-cap"><span>{exhibit}</span> &nbsp;{caption}</div>
  {/if}

  {#if !predicted && predict}
    <div class="predict">
      <div class="q">{predict.question}</div>
      <div class="opts">
        {#each predict.options as o}
          <button onclick={onPredict}>{o.label}</button>
        {/each}
      </div>
    </div>
  {:else}
    <div class="seg" role="group" aria-label="Network">
      <button class={which === 'Star' ? 'on' : ''} onclick={() => setGraph('Star')}>Star</button>
      <button class={which === 'Six-cycle' ? 'on' : ''} onclick={() => setGraph('Six-cycle')}>Six-cycle</button>
    </div>

    <div class="plot-wrap">
      <svg viewBox="0 0 280 220" class="plot" role="img" aria-label="A small network; tap nodes to make them provide the shared good.">
        {#each edges as [n, m]}
          <line x1={pos[n][0]} y1={pos[n][1]} x2={pos[m][0]} y2={pos[m][1]} class="edge" />
        {/each}
        {#each nodes as n}
          <circle cx={pos[n][0]} cy={pos[n][1]} r="14" class={'node' + (provides.has(n) ? ' on' : '') + (provides.has(n) !== bestResponse(n, provides, graph) ? ' unhappy' : '')} onclick={() => toggle(n)} role="button" tabindex="0" onkeydown={(e) => (e.key === 'Enter' ? toggle(n) : null)} />
        {/each}
      </svg>
    </div>
    <div class="leg"><span class="l1">provides</span><span class="l2">free-rides</span></div>

    <div class="play"><button class="choice" onclick={run}>Let nodes best-respond</button></div>

    <div class={'verdict ' + (eq ? 'yes' : 'no')} aria-live="polite">
      {#if eq}
        Equilibrium: providers form a maximal independent set. {provides.size} node{provides.size === 1 ? '' : 's'} provide, the rest free-ride off a neighbour. {which === 'Star' ? 'On the star, the hub provides for everyone, so society pays just 1.' : 'On the six-cycle, providers alternate, so three must provide: the same rule, triple the cost.'}
      {:else}
        Not an equilibrium yet: some node is either providing next to another provider, or free-riding with no provider neighbour. Let them best-respond.
      {/if}
    </div>
  {/if}
</div>

<style>
  .seg { display: flex; border: 1px solid var(--border-strong); border-radius: 9px; overflow: hidden; margin-bottom: 12px; }
  .seg button { flex: 1; border: 0; background: var(--surface); color: var(--ink-muted); font-weight: 600; font-size: 12.5px; padding: 9px; cursor: pointer; }
  .seg button + button { border-left: 1px solid var(--border); }
  .seg button.on { background: var(--accent-soft); color: var(--accent); }
  .plot-wrap { display: flex; justify-content: center; }
  .plot { width: 100%; max-width: 280px; height: auto; display: block; }
  .edge { stroke: var(--border-strong); stroke-width: 1.5; }
  .node { fill: var(--surface-2); stroke: var(--border-strong); stroke-width: 1.5; cursor: pointer; }
  .node.on { fill: var(--accent); stroke: var(--accent); }
  .node.unhappy { stroke: var(--defect); stroke-dasharray: 3 2; }
  .leg { display: flex; gap: 14px; font-size: 11px; font-weight: 600; margin: 6px 0 2px; }
  .leg .l1 { color: var(--accent); } .leg .l2 { color: var(--ink-muted); }
  .leg span { display: inline-flex; align-items: center; gap: 5px; }
  .leg span::before { content: ""; width: 11px; height: 11px; border-radius: 50%; background: currentColor; }
  .verdict { border-radius: 9px; padding: 10px 14px; font-size: 13px; line-height: 1.5; margin-top: 10px; }
  .verdict.yes { background: var(--cooperate-soft); }
  .verdict.no { background: var(--defect-soft); }
</style>
