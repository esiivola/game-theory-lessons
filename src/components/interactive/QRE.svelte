<script lang="ts">
  import { logitProb } from '@/engines/qre';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let lambda = $state(1);
  // A game where action A has a 1-util expected advantage; Nash would pick A for sure.
  const dEU = 1;
  const pA = $derived(logitProb(dEU, lambda));
  const pct = (x: number) => Math.round(x * 100) + '%';

  function onPredict() { predicted = true; }
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
          <button onclick={onPredict}>{o.label}</button>
        {/each}
      </div>
    </div>
  {:else}
    <label class="slider">
      <span class="slab">Rationality &lambda;: <b class="mono">{Math.round(lambda * 100) / 100}</b> <span class="dim">(0 = random, high = Nash)</span></span>
      <input type="range" min="0" max="10" step="0.1" bind:value={lambda} aria-label="Rationality parameter lambda" />
    </label>

    <div class="probs">
      <div class="prow"><span class="pn">Better action A</span><span class="pbar"><i style={`width:${pA * 100}%`}></i></span><span class="pv mono">{pct(pA)}</span></div>
      <div class="prow"><span class="pn">Worse action B</span><span class="pbar"><i class="dim" style={`width:${(1 - pA) * 100}%`}></i></span><span class="pv mono">{pct(1 - pA)}</span></div>
    </div>

    <div class="readout" aria-live="polite">
      Action A has a 1-util edge. At &lambda; = 0 the player picks 50/50, ignoring payoffs entirely. As &lambda; rises, the better action is played more, and at large &lambda; it converges on the pure best response (Nash).
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
