<script lang="ts">
  import { threshold, regimeFalls, crisisProbability } from '@/engines/globalGames';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let c = $state(0.5);      // cost of attacking
  let theta = $state(0.4);  // this economy's fundamental

  const tStar = $derived(threshold(c));
  const falls = $derived(regimeFalls(theta, c));
  const pCrisis = $derived(crisisProbability(c));
  const pct = (x: number) => Math.round(x * 100) + '%';
  const r2 = (x: number) => Math.round(x * 100) / 100;

  const W = 300, H = 46, PAD = 8;
  const sx = (v: number) => PAD + v * (W - 2 * PAD);

  function onPredict() { predicted = true; }
  function reset() { c = 0.5; theta = 0.4; }
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
      <svg viewBox={`0 0 ${W} ${H}`} class="plot" role="img" aria-label="The fundamentals line with the crisis threshold marked.">
        <rect x={sx(0)} y="10" width={sx(tStar) - sx(0)} height="18" rx="4" class="crisis" />
        <rect x={sx(tStar)} y="10" width={sx(1) - sx(tStar)} height="18" rx="4" class="safe" />
        <line x1={sx(theta)} y1="4" x2={sx(theta)} y2="34" class="now" />
        <circle cx={sx(theta)} cy="19" r="4" class="dot" />
        <text x={sx(0)} y="8" class="tk">weak 0</text>
        <text x={sx(1)} y="8" class="tk" text-anchor="end">strong 1</text>
        <text x={sx(tStar)} y="44" class="tk" text-anchor="middle">threshold {r2(tStar)}</text>
      </svg>
    </div>
    <div class="leg"><span class="c1">regime falls</span><span class="c2">regime holds</span></div>

    <label class="slider">
      <span class="slab">Cost of attacking c: <b class="mono">{r2(c)}</b></span>
      <input type="range" min="0.05" max="0.95" step="0.01" bind:value={c} aria-label="Cost of attacking" />
    </label>
    <label class="slider">
      <span class="slab">This economy's fundamental &theta;: <b class="mono">{r2(theta)}</b></span>
      <input type="range" min="0" max="1" step="0.01" bind:value={theta} aria-label="Fundamental theta" />
    </label>

    <div class="readout" aria-live="polite">
      In this benchmark limiting model, the threshold is &theta;* = 1 - c = <b class="mono">{r2(tStar)}</b>. This economy ({r2(theta)}) {falls ? 'is below it, so the attack succeeds and the regime falls.' : 'is above it, so the peg holds and an attack fails.'}
      Across all fundamentals, the crisis rate is <b class="mono">{pct(pCrisis)}</b>.
      {#if c < 0.4}Cheap attacks push the threshold up, so more economies collapse.{/if}
    </div>
    <p class="note">This is the Morris-Shin limiting benchmark. Its noisy private signals pin down one threshold where complete information would allow many self-fulfilling outcomes.</p>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; }
  .plot { width: 100%; height: auto; display: block; }
  .crisis { fill: var(--defect-soft); stroke: var(--defect); stroke-width: 1; }
  .safe { fill: var(--cooperate-soft); stroke: var(--cooperate); stroke-width: 1; }
  .now { stroke: var(--ink-muted); stroke-width: 1; opacity: .6; }
  .dot { fill: var(--ink); }
  .tk { font-size: 8px; fill: var(--ink-muted); font-weight: 600; }
  .leg { display: flex; gap: 16px; font-size: 11px; font-weight: 600; margin: 8px 0 2px; }
  .leg .c1 { color: var(--defect); } .leg .c2 { color: var(--cooperate); }
  .leg span { display: inline-flex; align-items: center; gap: 5px; }
  .leg span::before { content: ""; width: 12px; height: 8px; border-radius: 2px; background: currentColor; opacity: .3; }
  .slider { display: block; margin: 10px 0 8px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
