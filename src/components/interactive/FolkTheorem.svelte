<script lang="ts">
  import { PD_HULL, classify, type Pt } from '@/engines/folk';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let u1 = $state(3);
  let u2 = $state(3);

  const verdict = $derived(classify([u1, u2] as Pt));
  const r1 = (n: number) => Math.round(n * 10) / 10;

  // Plot: payoff space [0,5] x [0,5].
  const W = 300, H = 300, PAD = 30, LO = 0, HI = 5;
  const sx = (v: number) => PAD + ((v - LO) / (HI - LO)) * (W - 2 * PAD);
  const sy = (v: number) => H - PAD - ((v - LO) / (HI - LO)) * (H - 2 * PAD);
  const hullPath = PD_HULL.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p[0])} ${sy(p[1])}`).join(' ') + ' Z';
  // IR box: u1>=1 and u2>=1, clipped to the plot.
  const irX = sx(1), irY = sy(5), irW = sx(5) - sx(1), irH = sy(1) - sy(5);

  const presets: { label: string; p: Pt }[] = [
    { label: '(3, 3)', p: [3, 3] },
    { label: '(3.5, 2)', p: [3.5, 2] },
    { label: '(4, 1)', p: [4, 1] },
    { label: '(0.5, 0.5)', p: [0.5, 0.5] },
  ];
  function set(p: Pt) { u1 = p[0]; u2 = p[1]; }
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
    <div class="plot-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} class="plot" role="img" aria-label="Feasible payoff region with the individually rational area shaded and the target point marked.">
        <rect x={irX} y={irY} width={irW} height={irH} class="ir" />
        <path d={hullPath} class="hull" />
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} class="ax" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} class="ax" />
        <line x1={sx(1)} y1={PAD} x2={sx(1)} y2={H - PAD} class="mm" />
        <line x1={PAD} y1={sy(1)} x2={W - PAD} y2={sy(1)} class="mm" />
        <circle cx={sx(u1)} cy={sy(u2)} r="5" class={'pt ' + verdict} />
        <text x={sx(0)} y={H - 10} class="axlab">0</text>
        <text x={sx(5)} y={H - 10} class="axlab" text-anchor="end">you 5</text>
        <text x={8} y={sy(5) + 3} class="axlab">them 5</text>
      </svg>
    </div>

    <label class="slider">
      <span class="slab">Your payoff: <b class="mono">{r1(u1)}</b></span>
      <input type="range" min="0" max="5" step="0.1" bind:value={u1} aria-label="Your target payoff" />
    </label>
    <label class="slider">
      <span class="slab">Their payoff: <b class="mono">{r1(u2)}</b></span>
      <input type="range" min="0" max="5" step="0.1" bind:value={u2} aria-label="Their target payoff" />
    </label>

    <div class="readout" aria-live="polite">
      {#if verdict === 'supportable'}
        <b class="ok">Supportable.</b> ({r1(u1)}, {r1(u2)}) is feasible and strictly above the minmax of 1, so for a discount factor close to 1 it is a subgame-perfect equilibrium payoff.
      {:else if verdict === 'below-minmax'}
        <b class="no">Not above the minmax.</b> A player can guarantee 1 by defecting forever, so no equilibrium can hold them under it. The boundary is out too: pinning a player at exactly 1 takes permanent punishment, which leaves the other nothing to gain either.
      {:else}
        <b class="no">Infeasible.</b> ({r1(u1)}, {r1(u2)}) lies outside what the stage game can even produce, so no strategy reaches it.
      {/if}
    </div>

    <div class="play">
      {#each presets as pr}
        <button class="tinybtn" onclick={() => set(pr.p)}>{pr.label}</button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; display: flex; justify-content: center; }
  .plot { width: 100%; max-width: 320px; height: auto; display: block; }
  .ax { stroke: var(--border-strong); stroke-width: 1; }
  .mm { stroke: var(--ink-muted); stroke-width: 1; stroke-dasharray: 3 3; opacity: .5; }
  .hull { fill: var(--accent-soft); stroke: var(--accent); stroke-width: 1.5; opacity: .9; }
  .ir { fill: var(--gold); opacity: .12; }
  .pt { stroke: var(--surface); stroke-width: 1.5; }
  .pt.supportable { fill: var(--accent); }
  .pt.below-minmax, .pt.infeasible { fill: var(--defect); }
  .axlab { font-size: 9px; fill: var(--ink-muted); font-weight: 600; }
  .slider { display: block; margin: 10px 0 2px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 6px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .readout .ok { color: var(--cooperate); }
  .readout .no { color: var(--defect); }
</style>
