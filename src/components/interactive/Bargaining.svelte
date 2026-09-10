<script lang="ts">
  import { nashProduct, nashSolution } from '@/engines/bargaining';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let x = $state(0.5);  // player 1's share
  let d1 = $state(0);   // player 1's outside option

  const d2 = 0;
  const star = $derived(nashSolution(d1, d2));
  const prod = $derived(nashProduct(x, d1, d2));
  const r2 = (n: number) => Math.round(n * 100) / 100;
  const pct = (n: number) => Math.round(n * 100) + '%';

  // Plot the Nash product over feasible x in [d1, 1 - d2].
  const W = 320, H = 150, PADL = 30, PADR = 12, PADT = 12, PADB = 24;
  const xs = $derived(Array.from({ length: 61 }, (_, i) => d1 + (i / 60) * (1 - d2 - d1)));
  const ys = $derived(xs.map((xx) => nashProduct(xx, d1, d2)));
  const yMax = $derived(Math.max(0.0001, ...ys));
  const sx = (xx: number) => PADL + ((xx - 0) / 1) * (W - PADL - PADR);
  const sy = (yy: number) => PADT + (1 - yy / yMax) * (H - PADT - PADB);
  const path = $derived(xs.map((xx, i) => `${i === 0 ? 'M' : 'L'} ${sx(xx).toFixed(1)} ${sy(ys[i]).toFixed(1)}`).join(' '));

  function onPredict() { predicted = true; }
  function reset() { x = 0.5; d1 = 0; }
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
      <svg viewBox={`0 0 ${W} ${H}`} class="plot" role="img" aria-label="The Nash product across possible splits, with its maximum marked.">
        <line x1={PADL} y1={PADT} x2={PADL} y2={H - PADB} class="ax" />
        <line x1={PADL} y1={H - PADB} x2={W - PADR} y2={H - PADB} class="ax" />
        <path d={path} class="curve" />
        <line x1={sx(star)} y1={PADT} x2={sx(star)} y2={H - PADB} class="starln" />
        <line x1={sx(x)} y1={PADT} x2={sx(x)} y2={H - PADB} class="pnow" />
        <circle cx={sx(x)} cy={sy(Math.max(0, prod))} r="4" class="dot" />
        <text x={PADL} y={H - 7} class="axlab">your share 0</text>
        <text x={W - PADR} y={H - 7} class="axlab" text-anchor="end">1</text>
      </svg>
    </div>

    <label class="slider">
      <span class="slab">Your share of the pie: <b class="mono">{pct(x)}</b>, so they get <b class="mono">{pct(1 - x)}</b></span>
      <input type="range" min="0" max="1" step="0.01" bind:value={x} aria-label="Your share" />
    </label>
    <label class="slider">
      <span class="slab">Your outside option (walk-away value): <b class="mono">{r2(d1)}</b></span>
      <input type="range" min="0" max="0.45" step="0.01" bind:value={d1} aria-label="Your outside option" />
    </label>

    <div class="readout" aria-live="polite">
      Nash product (your gain above the walk-away, times theirs): <b class="mono">{r2(Math.max(0, prod))}</b>.
      It peaks at your share <b class="mono">{pct(star)}</b>.
      {#if Math.abs(x - star) < 0.02}This is the Nash bargaining solution.{:else if d1 > 0}A better outside option pulls the fair split in your favour, up from 50%.{:else}Slide toward the peak; with no outside options it sits at an even split.{/if}
    </div>

    <div class="play"><button class="tinybtn" onclick={() => (x = star)}>Snap to the solution</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; }
  .plot { width: 100%; height: auto; display: block; }
  .ax { stroke: var(--border-strong); stroke-width: 1; }
  .curve { fill: none; stroke: var(--accent); stroke-width: 2; }
  .starln { stroke: var(--gold); stroke-width: 2; }
  .pnow { stroke: var(--ink-muted); stroke-width: 1; opacity: .55; }
  .dot { fill: var(--accent); }
  .axlab { font-size: 9px; fill: var(--ink-muted); font-weight: 600; }
  .slider { display: block; margin: 12px 0 2px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
</style>
