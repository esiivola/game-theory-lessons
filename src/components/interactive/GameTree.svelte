<script lang="ts">
  import { type Tree, type Node, value, bestBranch } from '@/engines/tree';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let {
    tree,
    players = ['You', 'Them'],
    exhibit = '',
    caption = '',
    predict = null,
  }: { tree: Tree; players?: [string, string] | string[]; exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let path = $state<number[]>([]);
  let solved = $state(false);

  // ---- layout -------------------------------------------------------------
  type PNode = { key: string; x: number; y: number; t: Tree };
  type PEdge = { key: string; x1: number; y1: number; x2: number; y2: number; label: string; nodeKey: string; branch: number; lx: number; ly: number };

  function layout(root: Tree) {
    const nodes: PNode[] = [];
    const edges: PEdge[] = [];
    let row = 0;
    let maxDepth = 0;
    function walk(t: Tree, key: string, depth: number): number {
      maxDepth = Math.max(maxDepth, depth);
      let y: number;
      if (t.kind === 'leaf') {
        y = row; row += 1;
      } else {
        const ys = t.branches.map((b, i) => walk(b.child, key + i, depth + 1));
        y = ys.reduce((s, v) => s + v, 0) / ys.length;
        t.branches.forEach((b, i) => {
          edges.push({ key: key + '>' + i, x1: depth, y1: y, x2: depth + 1, y2: ys[i], label: b.label, nodeKey: key, branch: i, lx: 0, ly: 0 });
        });
      }
      nodes.push({ key, x: depth, y, t });
      return y;
    }
    walk(root, '', 0);
    return { nodes, edges, maxDepth, rows: row };
  }

  const L = $derived(layout(tree));
  const xStep = 112, yStep = 56, mX = 16, mY = 26;
  const W = $derived(mX * 2 + L.maxDepth * xStep + 46);
  const H = $derived(mY * 2 + (L.rows - 1) * yStep + 10);
  const px = (x: number) => mX + x * xStep;
  const py = (y: number) => mY + y * yStep;

  // The node the learner is currently standing at (following the chosen path).
  const cursor = $derived.by(() => {
    let t: Tree = tree; let key = '';
    for (const b of path) {
      if (t.kind !== 'node') break;
      t = t.branches[b].child; key += b;
    }
    return { t, key };
  });

  // Realized backward-induction path (chain of best branches from the root).
  const inductionKeys = $derived.by(() => {
    const set = new Set<string>();
    let t: Tree = tree; let key = '';
    while (t.kind === 'node') {
      const b = bestBranch(t);
      set.add(key + '>' + b);
      t = t.branches[b].child; key += b;
    }
    return set;
  });

  function isBestEdge(e: PEdge): boolean {
    // find the node for e.nodeKey
    let t: Tree = tree;
    for (const ch of e.nodeKey) { if (t.kind !== 'node') break; t = t.branches[Number(ch)].child; }
    return t.kind === 'node' && bestBranch(t) === e.branch;
  }
  function edgeSelected(e: PEdge): boolean {
    // is this edge on the learner's chosen path?
    let acc = '';
    for (let i = 0; i < path.length; i++) {
      const nodeKey = acc;
      if (nodeKey === e.nodeKey && path[i] === e.branch) return true;
      acc += path[i];
    }
    return false;
  }
  function edgeClass(e: PEdge): string {
    if (solved) return isBestEdge(e) ? (inductionKeys.has(e.key) ? 'e realized' : 'e best') : 'e pruned';
    return edgeSelected(e) ? 'e sel' : 'e';
  }

  const outcome = $derived(value(tree));
  const cursorNode = $derived(cursor.t.kind === 'node' ? (cursor.t as Node) : null);
  const cursorLeaf = $derived(cursor.t.kind === 'leaf' ? cursor.t.payoff : null);

  function choose(i: number) { if (!solved) path = [...path, i]; }
  function reset() { path = []; solved = false; }
  function onPredict() { predicted = true; }
  const fmt = (p: [number, number]) => `(${p[0]}, ${p[1]})`;
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
    <div class="plot-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} class="tree" role="img" aria-label="Game tree; use the buttons below to walk it or solve it backward.">
        {#each L.edges as e}
          <line x1={px(e.x1)} y1={py(e.y1)} x2={px(e.x2)} y2={py(e.y2)} class={edgeClass(e)} />
          <text x={(px(e.x1) + px(e.x2)) / 2} y={(py(e.y1) + py(e.y2)) / 2 - 4} class="elab" text-anchor="middle">{e.label}</text>
        {/each}
        {#each L.nodes as nd}
          {#if nd.t.kind === 'node'}
            <circle cx={px(nd.x)} cy={py(nd.y)} r="11" class={'nd p' + nd.t.player + (solved && inductionKeys.has(nd.key + '>' + bestBranch(nd.t as Node)) ? '' : '') + (cursor.key === nd.key && !solved ? ' here' : '')} />
            <text x={px(nd.x)} y={py(nd.y) + 3.5} class="ndlab" text-anchor="middle">{players[(nd.t as Node).player][0]}</text>
            <text x={px(nd.x)} y={py(nd.y) - 16} class="ndname" text-anchor="middle">{players[(nd.t as Node).player]}</text>
          {:else}
            <rect x={px(nd.x) - 2} y={py(nd.y) - 11} width="46" height="22" rx="6" class="leaf" />
            <text x={px(nd.x) + 21} y={py(nd.y) + 4} class="leaflab" text-anchor="middle">{fmt(nd.t.payoff)}</text>
          {/if}
        {/each}
      </svg>
    </div>

    <div class="readout" aria-live="polite">
      {#if solved}
        Folded from the last move back: {players[0]} can see {players[1]}'s reply is fixed, so the outcome is <b class="mono">{fmt(outcome)}</b>. The greyed branches rest on choices no rational player would make.
      {:else if cursorLeaf}
        You reached a leaf: payoff <b class="mono">{fmt(cursorLeaf)}</b> ({players[0]}, {players[1]}). Solve backward to see what actually happens.
      {:else if cursorNode}
        {players[cursorNode.player]} to move at this node. Pick a branch.
      {/if}
    </div>

    <div class="play">
      {#if cursorNode && !solved}
        {#each cursorNode.branches as b, i}
          <button class="choice" onclick={() => choose(i)}>{b.label}</button>
        {/each}
      {/if}
      <button class="tinybtn" onclick={() => { solved = true; }}>Solve backward</button>
      <button class="tinybtn" onclick={reset}>Reset</button>
    </div>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; }
  .tree { width: 100%; height: auto; display: block; min-width: 260px; }
  .e { stroke: var(--border-strong); stroke-width: 1.5; }
  .e.sel { stroke: var(--accent); stroke-width: 2.5; }
  .e.best, .e.realized { stroke: var(--accent); stroke-width: 2.5; }
  .e.pruned { stroke: var(--border); stroke-width: 1.2; stroke-dasharray: 3 3; opacity: .6; }
  .elab { font-size: 9.5px; fill: var(--ink-muted); font-weight: 600; }
  .nd { fill: var(--surface); stroke: var(--ink-muted); stroke-width: 1.5; }
  .nd.p0 { stroke: var(--accent); }
  .nd.p1 { stroke: var(--defect); }
  .nd.here { fill: var(--accent-soft); }
  .ndlab { font-size: 10px; font-weight: 700; fill: var(--ink); font-family: var(--font-mono); }
  .ndname { font-size: 8.5px; font-weight: 700; fill: var(--ink-muted); text-transform: uppercase; letter-spacing: .4px; }
  .leaf { fill: var(--surface-2); stroke: var(--border); stroke-width: 1; }
  .leaflab { font-size: 10.5px; font-weight: 700; fill: var(--ink); font-family: var(--font-mono); }
  .play { flex-wrap: wrap; align-items: center; }
</style>
