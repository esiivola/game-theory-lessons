<script lang="ts">
  import { equilibriumQ1, equilibriumRivalQ, firm1Profit, A } from '@/engines/bayesianCournot';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let mu = $state(0.5);   // prior that the rival is low-cost
  let q1 = $state(5);     // your output

  // The rival's two types sit at their equilibrium quantities for the current prior.
  const rival = $derived(equilibriumRivalQ(mu));
  const eqQ1 = $derived(equilibriumQ1(mu));
  const profit = $derived(firm1Profit(q1, mu, rival.low, rival.high));
  const r1 = (x: number) => Math.round(x * 10) / 10;

  // Profit curve over q1 in [0, 8].
  const W = 300, H = 130, PADL = 28, PADR = 12, PADT = 10, PADB = 22, QMAX = 8;
  const qs = Array.from({ length: 49 }, (_, i) => (i / 48) * QMAX);
  const prof = $derived(qs.map((q) => firm1Profit(q, mu, rival.low, rival.high)));
  const yMax = $derived(Math.max(1, ...prof));
  const sx = (q: number) => PADL + (q / QMAX) * (W - PADL - PADR);
  const sy = (p: number) => PADT + (1 - p / yMax) * (H - PADT - PADB);
  const path = $derived(qs.map((q, i) => `${i === 0 ? 'M' : 'L'} ${sx(q).toFixed(1)} ${sy(prof[i]).toFixed(1)}`).join(' '));

  function onPredict() { predicted = true; }
  function reset() { mu = 0.5; q1 = 5; }
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
      <svg viewBox={`0 0 ${W} ${H}`} class="plot" role="img" aria-label="Your expected profit as your output changes, with the equilibrium marked.">
        <line x1={PADL} y1={PADT} x2={PADL} y2={H - PADB} class="ax" />
        <line x1={PADL} y1={H - PADB} x2={W - PADR} y2={H - PADB} class="ax" />
        <path d={path} class="curve" />
        <line x1={sx(eqQ1)} y1={PADT} x2={sx(eqQ1)} y2={H - PADB} class="eqln" />
        <circle cx={sx(q1)} cy={sy(profit)} r="4" class="dot" />
        <text x={PADL} y={H - 7} class="axlab">q1 = 0</text>
        <text x={W - PADR} y={H - 7} class="axlab" text-anchor="end">{QMAX}</text>
      </svg>
    </div>

    <label class="slider">
      <span class="slab">Chance the rival is low-cost: <b class="mono">{Math.round(mu * 100)}%</b></span>
      <input type="range" min="0" max="1" step="0.01" bind:value={mu} aria-label="Prior the rival is low-cost" />
    </label>
    <label class="slider">
      <span class="slab">Your output q<sub>1</sub>: <b class="mono">{r1(q1)}</b></span>
      <input type="range" min="0" max={QMAX} step="0.1" bind:value={q1} aria-label="Your output" />
    </label>

    <div class="readout" aria-live="polite">
      The rival makes <b class="mono">{r1(rival.low)}</b> if low-cost and <b class="mono">{r1(rival.high)}</b> if high-cost, so on average <b class="mono">{r1(mu * rival.low + (1 - mu) * rival.high)}</b>. Your expected profit is <b class="mono">{r1(profit)}</b>, highest at q<sub>1</sub> = <b class="mono">{r1(eqQ1)}</b>.
      {#if Math.abs(q1 - eqQ1) < 0.15}This is your Bayes-Nash quantity: a best response to the rival's type distribution, not to any one realised type.{:else}Slide q<sub>1</sub> to the peak. As the rival is more likely low-cost, that peak slides down toward 4.{/if}
    </div>

    <div class="play"><button class="tinybtn" onclick={() => (q1 = Math.round(eqQ1 * 10) / 10)}>Snap to equilibrium</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; }
  .plot { width: 100%; height: auto; display: block; }
  .ax { stroke: var(--border-strong); stroke-width: 1; }
  .curve { fill: none; stroke: var(--accent); stroke-width: 2; }
  .eqln { stroke: var(--gold); stroke-width: 2; }
  .dot { fill: var(--accent); }
  .axlab { font-size: 9px; fill: var(--ink-muted); font-weight: 600; }
  .slider { display: block; margin: 10px 0 2px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 6px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
</style>
