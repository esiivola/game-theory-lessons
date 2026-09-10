<script lang="ts">
  import { maxIntervals, informativeExists, boundaryTwoInterval, twoIntervalActions } from '@/engines/cheapTalk';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let b = $state(0.125);

  const n = $derived(maxIntervals(b));
  const informative = $derived(informativeExists(b));
  const a1 = $derived(boundaryTwoInterval(b));
  const actions = $derived(twoIntervalActions(b));
  const r2 = (x: number) => Math.round(x * 100) / 100;
  const pct = (x: number) => Math.round(x * 100);

  // Partition bar of [0,1]. Show the two-interval split when it exists, else one babbling block.
  const W = 300, H = 40, PAD = 8;
  const sx = (v: number) => PAD + v * (W - 2 * PAD);

  function onPredict() { predicted = true; }
  function reset() { b = 0.125; }
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
      <svg viewBox={`0 0 ${W} ${H}`} class="plot" role="img" aria-label="The state line from 0 to 1 partitioned into message intervals.">
        {#if informative}
          <rect x={sx(0)} y="8" width={sx(a1) - sx(0)} height="18" rx="4" class="seg s1" />
          <rect x={sx(a1)} y="8" width={sx(1) - sx(a1)} height="18" rx="4" class="seg s2" />
          <line x1={sx(actions[0])} y1="4" x2={sx(actions[0])} y2="30" class="act" />
          <line x1={sx(actions[1])} y1="4" x2={sx(actions[1])} y2="30" class="act" />
          <text x={sx(a1)} y="38" class="tk" text-anchor="middle">boundary {r2(a1)}</text>
        {:else}
          <rect x={sx(0)} y="8" width={sx(1) - sx(0)} height="18" rx="4" class="seg babble" />
          <text x={sx(0.5)} y="38" class="tk" text-anchor="middle">one block: no information</text>
        {/if}
        <text x={sx(0)} y="6" class="tk">state 0</text>
        <text x={sx(1)} y="6" class="tk" text-anchor="end">1</text>
      </svg>
    </div>

    <label class="slider">
      <span class="slab">Expert's bias b: <b class="mono">{r2(b)}</b></span>
      <input type="range" min="0" max="0.5" step="0.01" bind:value={b} aria-label="Expert bias" />
    </label>

    <div class="readout" aria-live="polite">
      Most informative equilibrium: <b class="mono">{n === Infinity ? 'full revelation' : n + (n === 1 ? ' interval' : ' intervals')}</b>.
      {#if !informative}
        With bias this large the only equilibrium is babbling: no message the expert sends can be believed, so the receiver ignores all of it and just acts on the prior.
      {:else}
        The expert can credibly say only which of {n} coarse regions the state is in, not the exact value. At b = 1/8 that is two regions split at 1/4, inducing receiver actions {r2(actions[0])} and {r2(actions[1])}.
      {/if}
    </div>
    <p class="note">Slide the bias up: informative talk degrades and, past b = 1/4, collapses to babbling. A more biased expert conveys less, not the same information shifted over.</p>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; }
  .plot { width: 100%; height: auto; display: block; }
  .seg { stroke-width: 1; }
  .s1 { fill: var(--accent-soft); stroke: var(--accent); }
  .s2 { fill: var(--cooperate-soft); stroke: var(--cooperate); }
  .babble { fill: var(--defect-soft); stroke: var(--defect); }
  .act { stroke: var(--gold); stroke-width: 2; }
  .tk { font-size: 8px; fill: var(--ink-muted); font-weight: 600; }
  .slider { display: block; margin: 12px 0 2px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
