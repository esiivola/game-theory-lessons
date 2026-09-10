<script lang="ts">
  import { ewaUpdate, choiceProbs, type EwaState } from '@/engines/ewa';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let phi = $state(0.9);   // memory
  let delta = $state(0.5); // weight on foregone payoffs
  const lambda = 1.5, rho = 0.9;
  // Two actions; action 0 is the better one (payoff 6 vs 4 when chosen), but the model only
  // learns about the unchosen action to the extent delta allows.
  const PAYOFFS = [6, 4];

  // Simulate a learner over rounds: it plays action 0 with prob p, updates attractions.
  const trace = $derived.by(() => {
    let s: EwaState = { A: [0, 0], N: 1 };
    const probs: number[] = [];
    for (let t = 0; t < 30; t++) {
      const p = choiceProbs(s.A, lambda)[0];
      probs.push(p);
      const played = p >= 0.5 ? 0 : 1; // deterministic play toward the better-looking action
      s = ewaUpdate(s, played, PAYOFFS, phi, delta, rho);
    }
    return probs;
  });

  const W = 300, H = 130, PADL = 28, PADR = 12, PADT = 12, PADB = 22;
  const sx = (i: number) => PADL + (i / (trace.length - 1)) * (W - PADL - PADR);
  const sy = (p: number) => PADT + (1 - p) * (H - PADT - PADB);
  const path = $derived(trace.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(i).toFixed(1)} ${sy(p).toFixed(1)}`).join(' '));
  const r2 = (x: number) => Math.round(x * 100) / 100;

  function onPredict() { predicted = true; }
  function reset() { phi = 0.9; delta = 0.5; }
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
      <svg viewBox={`0 0 ${W} ${H}`} class="plot" role="img" aria-label="Probability of choosing the better action over rounds.">
        <line x1={PADL} y1={PADT} x2={PADL} y2={H - PADB} class="ax" />
        <line x1={PADL} y1={H - PADB} x2={W - PADR} y2={H - PADB} class="ax" />
        <path d={path} class="curve" />
        <text x={PADL} y={H - 6} class="axlab">round 1</text>
        <text x={W - PADR} y={H - 6} class="axlab" text-anchor="end">30</text>
        <text x={4} y={PADT + 6} class="axlab">P(better)</text>
      </svg>
    </div>

    <label class="slider"><span class="slab">&phi; memory (how much past attractions persist): <b class="mono">{r2(phi)}</b></span><input type="range" min="0" max="1" step="0.05" bind:value={phi} aria-label="Memory parameter phi" /></label>
    <label class="slider"><span class="slab">&delta; imagination (weight on foregone payoffs): <b class="mono">{r2(delta)}</b></span><input type="range" min="0" max="1" step="0.05" bind:value={delta} aria-label="Imagination parameter delta" /></label>

    <div class="readout" aria-live="polite">
      {#if delta < 0.15}
        At &delta; near 0 this is pure reinforcement learning: only the action actually played is updated, so learning is slow and depends on stumbling onto the better action.
      {:else if delta > 0.85}
        At &delta; near 1 this is belief learning (fictitious play): every action is updated by the payoff it would have earned, so the learner homes in on the better action fast.
      {:else}
        In between, the learner weights foregone payoffs partly, about half. Estimated human values sit here: people learn from counterfactuals, but discount them relative to experienced outcomes.
      {/if}
    </div>
    <p class="note">EWA nests reinforcement (&delta; = 0) and belief learning (&delta; = 1, &phi; = &rho;) in one model, with two dials for memory and imagination.</p>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; }
  .plot { width: 100%; height: auto; display: block; }
  .ax { stroke: var(--border-strong); stroke-width: 1; }
  .curve { fill: none; stroke: var(--accent); stroke-width: 2; }
  .axlab { font-size: 9px; fill: var(--ink-muted); font-weight: 600; }
  .slider { display: block; margin: 10px 0 2px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 6px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
