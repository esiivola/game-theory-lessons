<script lang="ts">
  import { agentUtility, effortChoice, minimumBonusForEffort, principalProfit } from '@/engines/moralHazard';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let predictionLabel = $state('');
  let base = $state(0);
  let bonus = $state(20);
  let riskAversion = $state(0);

  const effort = $derived(effortChoice(bonus, riskAversion));
  const util = $derived(agentUtility(base, bonus, riskAversion));
  const profit = $derived(principalProfit(base, bonus, riskAversion));
  const neededBonus = $derived(minimumBonusForEffort(riskAversion));
  const icMet = $derived(effort === 1);
  const irMet = $derived(util >= 0);
  const r1 = (x: number) => Math.round(x * 10) / 10;

  function onPredict(label: string) { predictionLabel = label; predicted = true; }
  function reset() { base = 0; bonus = 20; riskAversion = 0; }
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
      <span class="slab">Base pay (paid either way): <b class="mono">{r1(base)}</b></span>
      <input type="range" min="0" max="60" step="1" bind:value={base} aria-label="Base pay" />
    </label>
    <label class="slider">
      <span class="slab">Bonus for high output: <b class="mono">{r1(bonus)}</b></span>
      <input type="range" min="0" max="80" step="0.5" bind:value={bonus} aria-label="Bonus for high output" />
    </label>
    <label class="slider">
      <span class="slab">Agent risk aversion: <b class="mono">{riskAversion.toFixed(2)}</b></span>
      <input type="range" min="0" max="0.1" step="0.01" bind:value={riskAversion} aria-label="Agent risk aversion" />
    </label>

    <div class="tags">
      <span class={'tag ' + (icMet ? 'ok' : 'no')}>Effort: {effort === 1 ? 'works hard' : 'shirks'}</span>
      <span class={'tag ' + (irMet ? 'ok' : 'no')}>Agent {irMet ? 'takes the job' : 'walks away'}</span>
    </div>

    <div class="rows">
      <div class="mrow"><span class="mname">Agent's payoff</span><span class="mval mono">{r1(util)}</span></div>
      <div class="mrow big"><span class="mname">Principal's profit</span><span class="mval mono">{r1(profit)}</span></div>
    </div>

    <div class="readout" aria-live="polite">
      {#if !icMet}
        {#if neededBonus === null}No bonus up to 80 makes high effort preferable at this risk aversion.{:else}The bonus is too small to motivate effort; the first motivating slider value is {neededBonus}.{/if}
        The agent shirks, high output is unlikely, and profit is {r1(profit)}.
      {:else if !irMet}
        The bonus motivates effort, but the risky pay has certainty-equivalent value {r1(util)}. Add at least {r1(-util)} of base pay for the agent to accept.
      {:else if riskAversion === 0 && base === 0 && bonus === 38}
        This risk-neutral contract strictly motivates effort: base 0, bonus 38. Profit is {r1(profit)}, above the {r1(principalProfit(0, 0))} from not motivating effort. At exactly 37.5 the agent is indifferent.
      {:else}
        Effort is motivated and the agent accepts. {#if riskAversion > 0}The certainty equivalent is below the expected wage because noisy pay imposes risk. The principal may need more fixed pay or a less noisy performance measure.{:else}The smallest slider bonus that strictly motivates is 38.{/if}
      {/if}
    </div>

    <div class="play"><button class="tinybtn" disabled={neededBonus === null} onclick={() => { if (neededBonus !== null) bonus = neededBonus; }}>Smallest motivating bonus{neededBonus === null ? ' unavailable' : `: ${neededBonus}`}</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .slider { display: block; margin: 2px 0 10px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .tags { display: flex; gap: 8px; flex-wrap: wrap; margin: 4px 0 12px; }
  .tag { font-size: 11.5px; font-weight: 600; padding: 5px 10px; border-radius: 999px; border: 1px solid var(--border-strong); color: var(--ink-muted); }
  .tag.ok { border-color: var(--cooperate); color: var(--cooperate); background: var(--cooperate-soft); }
  .tag.no { border-color: var(--defect); color: var(--defect); background: var(--defect-soft); }
  .rows { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
  .mrow { display: flex; justify-content: space-between; align-items: baseline; }
  .mrow.big .mval { font-size: 20px; color: var(--accent); }
  .mname { font-size: 12.5px; color: var(--ink-muted); font-weight: 600; }
  .mval { font-size: 15px; color: var(--ink); }
  .note { font-size: 11.5px; color: var(--ink-muted); }
</style>
