<script lang="ts">
  import { logitQre2x2 } from '@/engines/qre';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let predictionLabel = $state('');
  let lambda = $state(1);
  const game = { row: [[2, 0], [0, 1]], col: [[2, 0], [0, 1]] } as const;
  const qre = $derived(logitQre2x2(game, lambda));
  const pct = (x: number) => Math.round(x * 100) + '%';

  function onPredict(label: string) { predictionLabel = label; predicted = true; }
  function reset() { lambda = 1; }
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
          <button onclick={() => onPredict(o.label)}>{o.label}</button>
        {/each}
      </div>
    </div>
  {:else}
    {#if predictionLabel}<div class="prediction-memory"><b>Your prediction:</b> {predictionLabel}</div>{/if}
    {#if predictionLabel && predict}
      <details class="prediction-answer"><summary>Compare after playing</summary><p>{predict.reveal}</p></details>
    {/if}
    <label class="slider">
      <span class="slab">Rationality &lambda;: <b class="mono">{Math.round(lambda * 100) / 100}</b> <span class="dim">(0 = random, high = Nash)</span></span>
      <input type="range" min="0" max="10" step="0.1" bind:value={lambda} aria-label="Rationality parameter lambda" />
    </label>

    <div class="probs">
      <div class="prow"><span class="pn">You choose A</span><span class="pbar"><i style={`width:${qre.rowA * 100}%`}></i></span><span class="pv mono">{pct(qre.rowA)}</span></div>
      <div class="prow"><span class="pn">They choose A</span><span class="pbar"><i style={`width:${qre.colA * 100}%`}></i></span><span class="pv mono">{pct(qre.colA)}</span></div>
    </div>

    <div class="readout" aria-live="polite">
      This is a coordination game: matching on A pays 2, matching on B pays 1, and a mismatch pays 0. Each displayed probability is a logit response to the other displayed probability, so beliefs and choices are mutually consistent. At &lambda; = 0 both mix 50/50; higher &lambda; moves this branch toward (A, A).
      {#if lambda > 0.5 && lambda < 4}Real experimental data typically fit a moderate &lambda; like this: better actions are favoured, but not with certainty.{/if}
    </div>
    <p class="note">QRE keeps equilibrium beliefs (choice probabilities are consistent) but replaces perfect best response with noisy, payoff-sensitive choice. It explains overbidding, turnout, and graded play that sharp Nash misses.</p>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .slider { display: block; margin: 2px 0 14px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); } .slab .dim { opacity: .7; }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .probs { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
  .prow { display: grid; grid-template-columns: 110px 1fr 44px; align-items: center; gap: 10px; }
  .pn { font-size: 12px; font-weight: 600; color: var(--ink-muted); }
  .pbar { height: 10px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
  .pbar > i { display: block; height: 100%; border-radius: 999px; background: var(--accent); transition: width .15s; }
  .pbar > i.dim { background: var(--ink-muted); }
  .pv { font-size: 12px; text-align: right; }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
