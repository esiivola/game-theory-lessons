<script lang="ts">
  import { tradeOccurs, missedEfficientTrade, FIRST_BEST_SURPLUS, LINEAR_SURPLUS } from '@/engines/doubleAuction';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let vb = $state(0.7); // buyer value
  let vs = $state(0.4); // seller cost

  const trades = $derived(tradeOccurs(vb, vs));
  const missed = $derived(missedEfficientTrade(vb, vs));
  const r2 = (x: number) => Math.round(x * 100) / 100;

  // Unit square: x = buyer value, y = seller cost. Shade the trade region and the missed band.
  const S = 220, PAD = 22;
  const px = (v: number) => PAD + v * (S - 2 * PAD);
  const py = (v: number) => (S - PAD) - v * (S - 2 * PAD);

  function onPredict() { predicted = true; }
  function reset() { vb = 0.7; vs = 0.4; }
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
      <svg viewBox={`0 0 ${S} ${S}`} class="plot" role="img" aria-label="Buyer value against seller cost, with the trade region and the missed efficient band.">
        <!-- efficient (gains from trade) region: vb > vs, below the diagonal -->
        <polygon points={`${px(0)},${py(0)} ${px(1)},${py(1)} ${px(1)},${py(0)}`} class="eff" />
        <!-- actual trade region: vb >= vs + 1/4 -->
        <polygon points={`${px(0.25)},${py(0)} ${px(1)},${py(0.75)} ${px(1)},${py(0)}`} class="trade" />
        <line x1={px(0)} y1={py(0)} x2={px(1)} y2={py(1)} class="diag" />
        <line x1={PAD} y1={S - PAD} x2={S - PAD} y2={S - PAD} class="ax" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={S - PAD} class="ax" />
        <circle cx={px(vb)} cy={py(vs)} r="5" class={'pt ' + (trades ? 'yes' : missed ? 'miss' : 'no')} />
        <text x={S - PAD} y={S - 6} class="axlab" text-anchor="end">buyer value</text>
        <text x={6} y={PAD + 6} class="axlab">seller cost</text>
      </svg>
    </div>
    <div class="leg"><span class="l1">trades</span><span class="l2">gains, but missed</span></div>

    <label class="slider"><span class="slab">Buyer value: <b class="mono">{r2(vb)}</b></span><input type="range" min="0" max="1" step="0.01" bind:value={vb} aria-label="Buyer value" /></label>
    <label class="slider"><span class="slab">Seller cost: <b class="mono">{r2(vs)}</b></span><input type="range" min="0" max="1" step="0.01" bind:value={vs} aria-label="Seller cost" /></label>

    <div class="readout" aria-live="polite">
      {#if trades}
        The gap ({r2(vb - vs)}) clears 1/4, so they trade. Both gain.
      {:else if missed}
        There are real gains from trade ({r2(vb - vs)} > 0), but the gap is under 1/4, so each side shades enough that the deal falls through. This is the efficiency loss.
      {:else}
        No gains from trade here (the seller values the good more than the buyer), so no trade is correct.
      {/if}
    </div>
    <p class="note">The linear double auction realizes {r2(LINEAR_SURPLUS)} of surplus against the first-best {r2(FIRST_BEST_SURPLUS)}. Myerson-Satterthwaite: with two-sided private information, no mechanism captures every efficient trade.</p>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; display: flex; justify-content: center; }
  .plot { width: 100%; max-width: 240px; height: auto; display: block; }
  .ax { stroke: var(--border-strong); stroke-width: 1; }
  .diag { stroke: var(--ink-muted); stroke-width: 1; stroke-dasharray: 3 3; opacity: .5; }
  .eff { fill: var(--gold); opacity: .18; }
  .trade { fill: var(--cooperate); opacity: .28; }
  .pt { stroke: var(--surface); stroke-width: 1.5; }
  .pt.yes { fill: var(--cooperate); } .pt.miss { fill: var(--gold); } .pt.no { fill: var(--ink-muted); }
  .axlab { font-size: 9px; fill: var(--ink-muted); font-weight: 600; }
  .leg { display: flex; gap: 16px; font-size: 11px; font-weight: 600; margin: 6px 0 2px; }
  .leg .l1 { color: var(--cooperate); } .leg .l2 { color: var(--gold); }
  .leg span { display: inline-flex; align-items: center; gap: 5px; }
  .leg span::before { content: ""; width: 12px; height: 8px; border-radius: 2px; background: currentColor; opacity: .4; }
  .slider { display: block; margin: 10px 0 2px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 6px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
