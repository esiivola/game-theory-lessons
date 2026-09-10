<script lang="ts">
  import { u, certaintyEquivalent } from '@/engines/utility';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let r = $state(0.5); // curvature; 1 = risk-neutral, lower = more risk-averse

  const A = 0, B = 100;
  const ce = $derived(certaintyEquivalent(A, B, r));
  const eu = $derived(0.5 * u(A, r) + 0.5 * u(B, r));
  const r1 = (x: number) => Math.round(x * 10) / 10;

  // Plot u(x) = x^r over [0,100], normalized so u(100) sits at the top.
  const W = 300, H = 170, PADL = 30, PADR = 12, PADT = 12, PADB = 24;
  const uMax = $derived(u(B, r));
  const sx = (x: number) => PADL + (x / B) * (W - PADL - PADR);
  const sy = (val: number) => PADT + (1 - val / uMax) * (H - PADT - PADB);
  const curve = $derived(
    Array.from({ length: 51 }, (_, i) => (i / 50) * B)
      .map((x, i) => `${i === 0 ? 'M' : 'L'} ${sx(x).toFixed(1)} ${sy(u(x, r)).toFixed(1)}`)
      .join(' ')
  );

  function onPredict() { predicted = true; }
  function reset() { r = 0.5; }
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
      <svg viewBox={`0 0 ${W} ${H}`} class="plot" role="img" aria-label="A concave utility curve with the expected utility and certainty equivalent of a fifty-fifty gamble marked.">
        <line x1={PADL} y1={PADT} x2={PADL} y2={H - PADB} class="ax" />
        <line x1={PADL} y1={H - PADB} x2={W - PADR} y2={H - PADB} class="ax" />
        <!-- chord from (0, u0) to (100, u100): its midpoint height is the gamble's expected utility -->
        <line x1={sx(A)} y1={sy(u(A, r))} x2={sx(B)} y2={sy(u(B, r))} class="chord" />
        <path d={curve} class="curve" />
        <!-- expected utility level and the certainty equivalent below it -->
        <line x1={PADL} y1={sy(eu)} x2={sx(ce)} y2={sy(eu)} class="guide" />
        <line x1={sx(ce)} y1={sy(eu)} x2={sx(ce)} y2={H - PADB} class="guide" />
        <circle cx={sx(50)} cy={sy(eu)} r="3.5" class="dotc" />
        <circle cx={sx(ce)} cy={sy(u(ce, r))} r="4" class="dot" />
        <text x={PADL} y={H - 8} class="axlab">$0</text>
        <text x={W - PADR} y={H - 8} class="axlab" text-anchor="end">$100</text>
      </svg>
    </div>

    <label class="slider">
      <span class="slab">Risk attitude: <b>{r >= 0.98 ? 'risk-neutral' : r <= 0.35 ? 'very cautious' : 'cautious'}</b> <span class="dim">(curvature r = {r1(r * 10) / 10})</span></span>
      <input type="range" min="0.2" max="1" step="0.01" bind:value={r} aria-label="Risk attitude" />
    </label>

    <div class="readout" aria-live="polite">
      A coin flip pays $0 or $100, so its expected value is $50. This agent would trade that gamble for a sure <b class="mono">${r1(ce)}</b>, its certainty equivalent.
      {#if r >= 0.98}At risk-neutral, the certainty equivalent equals the $50 expected value.{:else}The gap below $50 is the risk premium: the price this agent pays to avoid the uncertainty.{/if}
    </div>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; }
  .plot { width: 100%; height: auto; display: block; }
  .ax { stroke: var(--border-strong); stroke-width: 1; }
  .curve { fill: none; stroke: var(--accent); stroke-width: 2; }
  .chord { stroke: var(--ink-muted); stroke-width: 1; stroke-dasharray: 3 3; opacity: .6; }
  .guide { stroke: var(--gold); stroke-width: 1; stroke-dasharray: 2 2; }
  .dot { fill: var(--accent); }
  .dotc { fill: var(--ink-muted); }
  .axlab { font-size: 9px; fill: var(--ink-muted); font-weight: 600; }
  .slider { display: block; margin: 12px 0 2px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); } .slab .dim { opacity: .7; }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
</style>
