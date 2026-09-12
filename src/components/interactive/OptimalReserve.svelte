<script lang="ts">
  import { expectedRevenue, optimalReserve } from '@/engines/myerson';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let r = $state(0.5);
  let n = $state(3);

  const rStar = optimalReserve();
  const rev = $derived(expectedRevenue(r, n));
  const r3 = (x: number) => Math.round(x * 1000) / 1000;

  // Revenue-vs-reserve curve for the current n.
  const W = 300, H = 150, PADL = 34, PADR = 12, PADT = 12, PADB = 24;
  const grid = Array.from({ length: 51 }, (_, i) => i / 50);
  const revs = $derived(grid.map((rr) => expectedRevenue(rr, n)));
  const yMax = $derived(Math.max(...revs, 0.001) * 1.1);
  const sx = (rr: number) => PADL + rr * (W - PADL - PADR);
  const sy = (v: number) => PADT + (1 - v / yMax) * (H - PADT - PADB);
  const path = $derived(grid.map((rr, i) => `${i === 0 ? 'M' : 'L'} ${sx(rr).toFixed(1)} ${sy(revs[i]).toFixed(1)}`).join(' '));

  function onPredict() { predicted = true; }
  function reset() { r = 0.5; n = 3; }
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
      <svg viewBox={`0 0 ${W} ${H}`} class="plot" role="img" aria-label="Expected seller revenue in the iid-uniform model as the reserve price changes, peaking at one half.">
        <line x1={PADL} y1={PADT} x2={PADL} y2={H - PADB} class="ax" />
        <line x1={PADL} y1={H - PADB} x2={W - PADR} y2={H - PADB} class="ax" />
        <line x1={sx(rStar)} y1={PADT} x2={sx(rStar)} y2={H - PADB} class="opt" />
        <path d={path} class="curve" />
        <line x1={sx(r)} y1={PADT} x2={sx(r)} y2={H - PADB} class="pnow" />
        <circle cx={sx(r)} cy={sy(rev)} r="4" class="dot" />
        <text x={PADL} y={H - 7} class="axlab">reserve 0</text>
        <text x={W - PADR} y={H - 7} class="axlab" text-anchor="end">1</text>
      </svg>
    </div>

    <label class="slider"><span class="slab">Reserve price: <b class="mono">{r3(r)}</b></span><input type="range" min="0" max="1" step="0.01" bind:value={r} aria-label="Reserve price" /></label>
    <label class="slider"><span class="slab">Number of bidders: <b class="mono">{n}</b></span><input type="range" min="1" max="8" step="1" bind:value={n} aria-label="Number of bidders" /></label>

    <div class="readout" aria-live="polite">
      Expected revenue at this reserve: <b class="mono">{r3(rev)}</b>. In this iid-uniform model, the peak sits at <b class="mono">{rStar}</b>, the reserve where the virtual value hits zero.
      {#if Math.abs(r - rStar) < 0.02}This is the optimal reserve.{/if}
      Change the number of bidders: the peak does not move. The optimal reserve is 1/2 whatever n is. Different value distributions can imply a different reserve.
    </div>

    <div class="play"><button class="tinybtn" onclick={() => (r = rStar)}>Optimal reserve</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; }
  .plot { width: 100%; height: auto; display: block; }
  .ax { stroke: var(--border-strong); stroke-width: 1; }
  .opt { stroke: var(--gold); stroke-width: 2; }
  .curve { fill: none; stroke: var(--accent); stroke-width: 2; }
  .pnow { stroke: var(--ink-muted); stroke-width: 1; opacity: .55; }
  .dot { fill: var(--accent); }
  .axlab { font-size: 9px; fill: var(--ink-muted); font-weight: 600; }
  .slider { display: block; margin: 10px 0 2px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 6px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
</style>
