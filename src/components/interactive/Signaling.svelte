<script lang="ts">
  import { net, lowMimics, highSeparates, isSeparating, leastCostSeparating, THETA_HIGH, THETA_LOW } from '@/engines/signaling';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let e = $state(1); // the education the High type acquires to separate

  const sep = $derived(isSeparating(e));
  const highNet = $derived(net(THETA_HIGH, e, THETA_HIGH));
  const lowMimicPay = $derived(net(THETA_HIGH, e, THETA_LOW)); // Low's payoff if it mimicked e
  const eStar = leastCostSeparating();
  const r2 = (x: number) => Math.round(x * 100) / 100;

  // Plot High's net payoff (2 - e/2) over e in [0,3], with the valid separating band [1,2] shaded.
  const W = 300, H = 150, PADL = 28, PADR = 12, PADT = 12, PADB = 24, EMAX = 3;
  const sx = (x: number) => PADL + (x / EMAX) * (W - PADL - PADR);
  const yLo = 0, yHi = 2.2;
  const sy = (v: number) => PADT + (1 - (v - yLo) / (yHi - yLo)) * (H - PADT - PADB);
  const line = Array.from({ length: 61 }, (_, i) => (i / 60) * EMAX)
    .map((x, i) => `${i === 0 ? 'M' : 'L'} ${sx(x).toFixed(1)} ${sy(net(THETA_HIGH, x, THETA_HIGH)).toFixed(1)}`)
    .join(' ');

  function onPredict() { predicted = true; }
  function reset() { e = 1; }
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
      <svg viewBox={`0 0 ${W} ${H}`} class="plot" role="img" aria-label="The High type's net payoff as education rises, with the separating range shaded.">
        <rect x={sx(1)} y={PADT} width={sx(2) - sx(1)} height={H - PADT - PADB} class="band" />
        <line x1={PADL} y1={PADT} x2={PADL} y2={H - PADB} class="ax" />
        <line x1={PADL} y1={H - PADB} x2={W - PADR} y2={H - PADB} class="ax" />
        <line x1={PADL} y1={sy(1)} x2={W - PADR} y2={sy(1)} class="ref" />
        <path d={line} class="curve" />
        <line x1={sx(e)} y1={PADT} x2={sx(e)} y2={H - PADB} class="pnow" />
        <circle cx={sx(e)} cy={sy(highNet)} r="4" class="dot" />
        <text x={PADL} y={H - 7} class="axlab">education 0</text>
        <text x={W - PADR} y={H - 7} class="axlab" text-anchor="end">{EMAX}</text>
      </svg>
    </div>
    <p class="leg">Shaded band: education levels that separate the types. The flat line is the payoff of not signalling (pooling down to the Low wage).</p>

    <label class="slider">
      <span class="slab">Education the High worker gets: <b class="mono">{r2(e)}</b></span>
      <input type="range" min="0" max="3" step="0.05" bind:value={e} aria-label="High worker education level" />
    </label>

    <div class="readout" aria-live="polite">
      {#if !sep && lowMimics(e)}
        Not separating: at education {r2(e)} the Low worker would mimic (it earns {r2(lowMimicPay)} by grabbing the High wage, beating its 1), so a degree here proves nothing.
      {:else if !sep && !highSeparates(e)}
        Not worth it: at {r2(e)} the education is so costly the High worker would rather skip it and take the Low wage. Wasteful over-signalling.
      {:else}
        Separating equilibrium: the Low worker will not mimic (it would net only {r2(lowMimicPay)}, below its 1), and the High worker still comes out ahead, netting <b class="mono">{r2(highNet)}</b>. The cheapest such signal is education {eStar}, where the High worker nets {r2(net(THETA_HIGH, eStar, THETA_HIGH))}.
      {/if}
    </div>

    <div class="play"><button class="tinybtn" onclick={() => (e = eStar)}>Least-cost signal</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; }
  .plot { width: 100%; height: auto; display: block; }
  .ax { stroke: var(--border-strong); stroke-width: 1; }
  .ref { stroke: var(--ink-muted); stroke-width: 1; stroke-dasharray: 3 3; opacity: .5; }
  .band { fill: var(--accent-soft); opacity: .6; }
  .curve { fill: none; stroke: var(--accent); stroke-width: 2; }
  .pnow { stroke: var(--ink-muted); stroke-width: 1; opacity: .55; }
  .dot { fill: var(--accent); }
  .axlab { font-size: 9px; fill: var(--ink-muted); font-weight: 600; }
  .leg { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 2px; line-height: 1.5; }
  .slider { display: block; margin: 10px 0 2px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 6px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
</style>
