<script lang="ts">
  import { median, voteShare } from '@/engines/medianVoter';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const VOTERS = [0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9];
  let predicted = $state(predict === null);
  let x1 = $state(0.35);
  let x2 = $state(0.65);

  const med = median(VOTERS);
  const s1 = $derived(voteShare(x1, x2, VOTERS));
  const pct = (x: number) => Math.round(x * 100) + '%';

  const W = 300, H = 70, PAD = 16;
  const sx = (v: number) => PAD + v * (W - 2 * PAD);

  function onPredict() { predicted = true; }
  function reset() { x1 = 0.35; x2 = 0.65; }
</script>

<div class="widget">
  {#if exhibit || caption}
    <div class="exhibit-cap"><span>{exhibit}</span> &nbsp;{caption}</div>
  {/if}

  {#if !predicted && predict}
    <div class="predict">
      <div class="q">{predict.question}</div>
      <div class="opts">
        {#each predict.options as o}<button onclick={onPredict}>{o.label}</button>{/each}
      </div>
    </div>
  {:else}
    <div class="plot-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} class="plot" role="img" aria-label="Voters on a left-right line with two candidate positions.">
        <line x1={PAD} y1="40" x2={W - PAD} y2="40" class="axis" />
        {#each VOTERS as v}<circle cx={sx(v)} cy="40" r="4" class="voter" />{/each}
        <line x1={sx(med)} y1="26" x2={sx(med)} y2="54" class="med" />
        <circle cx={sx(x1)} cy="18" r="6" class="c1" /><text x={sx(x1)} y="14" class="clab" text-anchor="middle">A</text>
        <circle cx={sx(x2)} cy="18" r="6" class="c2" /><text x={sx(x2)} y="14" class="clab" text-anchor="middle">B</text>
        <text x={PAD} y="66" class="tk">left</text><text x={W - PAD} y="66" class="tk" text-anchor="end">right</text>
        <text x={sx(med)} y="66" class="tk" text-anchor="middle">median</text>
      </svg>
    </div>

    <label class="slider"><span class="slab">Candidate A position: <b class="mono">{Math.round(x1 * 100) / 100}</b></span><input type="range" min="0" max="1" step="0.01" bind:value={x1} aria-label="Candidate A position" /></label>
    <label class="slider"><span class="slab">Candidate B position: <b class="mono">{Math.round(x2 * 100) / 100}</b></span><input type="range" min="0" max="1" step="0.01" bind:value={x2} aria-label="Candidate B position" /></label>

    <div class="shares">
      <span class="sa" style={`width:${s1 * 100}%`}>A {pct(s1)}</span>
      <span class="sb" style={`width:${(1 - s1) * 100}%`}>B {pct(1 - s1)}</span>
    </div>

    <div class="readout" aria-live="polite">
      {#if Math.abs(x1 - med) < 0.03 && Math.abs(x2 - med) < 0.03}
        Both candidates sit at the median: neither can gain by moving. This is the only equilibrium.
      {:else}
        The candidate closer to the median wins more votes. Whoever is off-median can grab the majority by sliding toward the middle, so both are pulled to the median voter.
      {/if}
    </div>
    <p class="note">The median voter theorem: with one dimension and two candidates, both converge on the median. It fails with three candidates or multiple issue dimensions.</p>

    <div class="play"><button class="tinybtn" onclick={() => { x1 = med; x2 = med; }}>Both to the median</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; }
  .plot { width: 100%; height: auto; display: block; }
  .axis { stroke: var(--border-strong); stroke-width: 1.5; }
  .voter { fill: var(--ink-muted); }
  .med { stroke: var(--gold); stroke-width: 2; stroke-dasharray: 3 2; }
  .c1 { fill: var(--accent); } .c2 { fill: var(--defect); }
  .clab { font-size: 8px; font-weight: 700; fill: var(--ink-muted); }
  .tk { font-size: 8px; fill: var(--ink-muted); font-weight: 600; }
  .slider { display: block; margin: 8px 0 2px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 6px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .shares { display: flex; height: 24px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); margin: 12px 0; }
  .shares span { display: grid; place-items: center; font-size: 11px; font-weight: 700; color: var(--bg); overflow: hidden; white-space: nowrap; }
  .shares .sa { background: var(--accent); } .shares .sb { background: var(--defect); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
