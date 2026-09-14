<script lang="ts">
  import {
    attackProbabilities,
    attackerTarget,
    behavioralExpectedLoss,
    expectedLoss,
    optimalBehavioralCoverageTwo,
    optimalCoverageTwo,
  } from '@/engines/securityGame';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const VALUES = [10, 5];
  let predicted = $state(predict === null);
  let predictionLabel = $state('');
  let c0 = $state(0.5); // coverage of the $10 target; the $5 target gets 1 - c0
  let model = $state<'perfect' | 'qre'>('perfect');
  let precision = $state(0.5);

  const coverage = $derived([c0, 1 - c0]);
  const target = $derived(attackerTarget(coverage, VALUES));
  const probabilities = $derived(attackProbabilities(coverage, VALUES, precision));
  const loss = $derived(model === 'perfect'
    ? expectedLoss(coverage, VALUES)
    : behavioralExpectedLoss(coverage, VALUES, precision));
  const opt = $derived(model === 'perfect'
    ? optimalCoverageTwo(VALUES[0], VALUES[1])
    : optimalBehavioralCoverageTwo(VALUES[0], VALUES[1], precision));
  const r2 = (x: number) => Math.round(x * 100) / 100;
  const pct = (x: number) => Math.round(x * 100) + '%';

  function onPredict(label: string) { predictionLabel = label; predicted = true; }
  function reset() { c0 = 0.5; }
</script>

<div class="widget">
  {#if exhibit || caption}
    <div class="exhibit-cap"><span>{exhibit}</span> &nbsp;{caption}</div>
  {/if}

  {#if !predicted && predict}
    <div class="predict">
      <div class="q">{predict.question}</div>
      <div class="opts">
        {#each predict.options as o}<button onclick={() => onPredict(o.label)}>{o.label}</button>{/each}
      </div>
    </div>
  {:else}
    {#if predictionLabel}<div class="prediction-memory"><b>Your prediction:</b> {predictionLabel}</div>{/if}
    {#if predictionLabel && predict}
      <details class="prediction-answer"><summary>Compare after playing</summary><p>{predict.reveal}</p></details>
    {/if}
    <p class="setup">You have one patrol to split between two targets, worth 10 and 5. You commit to coverage probabilities first; the attacker then strikes the target that maximizes its expected value.</p>

    <div class="models" role="group" aria-label="Attacker model">
      <button class="tinybtn" class:chosen={model === 'perfect'} aria-pressed={model === 'perfect'} onclick={() => (model = 'perfect')}>Perfect best response</button>
      <button class="tinybtn" class:chosen={model === 'qre'} aria-pressed={model === 'qre'} onclick={() => (model = 'qre')}>Noisy QRE attacker</button>
    </div>

    {#if model === 'qre'}
      <label class="slider"><span class="slab">Response precision: <b class="mono">{precision.toFixed(1)}</b> (higher means closer to a perfect best response)</span><input type="range" min="0" max="2" step="0.1" bind:value={precision} aria-label="Attacker response precision" /></label>
    {/if}

    <label class="slider"><span class="slab">Coverage of the $10 target: <b class="mono">{pct(c0)}</b> (the $5 target gets {pct(1 - c0)})</span><input type="range" min="0" max="1" step="0.01" bind:value={c0} aria-label="Coverage of the high-value target" /></label>

    <div class="targets">
      <div class={'tgt' + (model === 'perfect' && target === 0 ? ' hit' : '')}><span class="tv">$10 target</span><span class="tc">covered {pct(c0)}</span>{#if model === 'perfect' && target === 0}<span class="atk">attacked</span>{:else if model === 'qre'}<span class="atk">{pct(probabilities[0])} attack chance</span>{/if}</div>
      <div class={'tgt' + (model === 'perfect' && target === 1 ? ' hit' : '')}><span class="tv">$5 target</span><span class="tc">covered {pct(1 - c0)}</span>{#if model === 'perfect' && target === 1}<span class="atk">attacked</span>{:else if model === 'qre'}<span class="atk">{pct(probabilities[1])} attack chance</span>{/if}</div>
    </div>

    <div class="readout" aria-live="polite">
      {#if model === 'perfect'}
        The attacker hits the <b>${VALUES[target]}</b> target, so your expected loss is <b class="mono">{r2(loss)}</b>.
        {#if Math.abs(c0 - opt) < 0.02}This is optimal: the attacker is indifferent between targets, and your worst-case loss is minimized at about {r2(10 / 3)}.{:else if c0 >= 0.99}Guarding only the $10 target invites an attack on the undefended $5 one for a loss of 5, worse than the {r2(10 / 3)} you could guarantee.{:else}Slide toward {pct(opt)} coverage of the big target to equalize the attacker's options and lower your worst-case loss.{/if}
      {:else}
        The noisy attacker spreads its choices across both targets, so your expected loss is <b class="mono">{r2(loss)}</b>.
        {#if Math.abs(c0 - opt) < 0.02}This is the best coverage against the selected response precision.{:else}For this noisy response, the lowest-loss coverage is about <b>{pct(opt)}</b> on the $10 target.{/if}
      {/if}
    </div>
    <p class="note">A QRE attacker chooses higher-payoff targets more often, but can still make mistakes. Change its precision to see why behavioral assumptions retune the patrol mix.</p>

    <div class="play"><button class="tinybtn" onclick={() => (c0 = opt)}>Optimal coverage</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .setup { font-size: 13px; color: var(--ink-muted); margin: 0 0 12px; line-height: 1.5; }
  .models { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
  .models .chosen { border-color: var(--accent); color: var(--accent); }
  .slider { display: block; margin: 2px 0 12px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .targets { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
  .tgt { border: 1px solid var(--border); border-radius: 10px; padding: 12px; text-align: center; }
  .tgt.hit { border-color: var(--defect); background: var(--defect-soft); }
  .tv { display: block; font-weight: 700; font-size: 14px; }
  .tc { display: block; font-size: 11.5px; color: var(--ink-muted); margin-top: 4px; }
  .atk { display: inline-block; margin-top: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--defect); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
