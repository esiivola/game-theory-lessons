<script lang="ts">
  import { graduatedPenalty, resourceStep } from '@/engines/commons';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const capacity = 100;
  const growthRate = 0.8;
  const limit = 4;
  let predicted = $state(predict === null);
  let predictionLabel = $state('');
  let stock = $state(60);
  let catchAmount = $state(4);
  let otherCatches = $state<[number, number, number]>([4, 4, 8]);
  let monitoring = $state(false);
  let violations = $state(0);
  let history = $state<{ stock: number; growth: number; harvest: number; penalty: number }[]>([]);

  function onPredict(label: string) { predictionLabel = label; predicted = true; }

  function playRound() {
    const violation = otherCatches[2] > limit;
    const nextViolation = monitoring && violation ? violations + 1 : 0;
    const penalty = monitoring ? graduatedPenalty(otherCatches[2], limit, nextViolation, 0.5) : 0;
    const result = resourceStep(stock, [catchAmount, ...otherCatches], capacity, growthRate);
    history = [...history, { stock: result.nextStock, growth: result.growth, harvest: result.harvest, penalty }];
    stock = result.nextStock;
    violations = nextViolation;

    if (monitoring && violation) {
      otherCatches = [4, 4, Math.max(limit, otherCatches[2] - nextViolation)];
    }
  }

  function reset() {
    stock = 60;
    catchAmount = 4;
    otherCatches = [4, 4, 8];
    monitoring = false;
    violations = 0;
    history = [];
  }

  const preview = $derived(resourceStep(stock, [catchAmount, ...otherCatches], capacity, growthRate));
  const r1 = (value: number) => Math.round(value * 10) / 10;
</script>

<div class="widget">
  {#if exhibit || caption}<div class="exhibit-cap"><span>{exhibit}</span> &nbsp;{caption}</div>{/if}

  {#if !predicted && predict}
    <div class="predict">
      <div class="q">{predict.question}</div>
      <div class="opts">{#each predict.options as option}<button onclick={() => onPredict(option.label)}>{option.label}</button>{/each}</div>
    </div>
  {:else}
    {#if predictionLabel}<div class="prediction-memory"><b>Your prediction:</b> {predictionLabel}</div>{/if}
    {#if predictionLabel && predict}
      <details class="prediction-answer"><summary>Compare after playing</summary><p>{predict.reveal}</p></details>
    {/if}

    <div class="stock" aria-live="polite">
      <span>Fish stock</span><b class="mono">{r1(stock)} / {capacity}</b>
      <div class="track"><span style={`width:${stock}%`}></span></div>
    </div>

    <label class="slider"><span>Your catch this round: <b class="mono">{catchAmount}</b></span><input type="range" min="0" max="10" step="1" bind:value={catchAmount} aria-label="Your catch this round" /></label>
    <label class="check"><input type="checkbox" bind:checked={monitoring} /> Monitor catches and use graduated sanctions above the limit of {limit}</label>

    <div class="forecast">
      The four catches total <b class="mono">{preview.harvest}</b>. The stock regenerates <b class="mono">{r1(preview.growth)}</b> before harvest, so this round would {preview.nextStock >= stock ? 'increase' : 'reduce'} the stock to <b class="mono">{r1(preview.nextStock)}</b>.
    </div>

    {#if history.length > 0}
      <div class="rounds" aria-label="Fish stock by round">
        {#each history as round, index}<div class="round"><span style={`height:${round.stock}%`}></span><small>{index + 1}</small></div>{/each}
      </div>
      <p class="note">The high extractor now catches {otherCatches[2]}. Its response to sanctions is an explicit behavior rule for this demonstration, not an equilibrium result.</p>
      {#if history[history.length - 1].penalty > 0}<p class="note">Latest graduated penalty: <b class="mono">{r1(history[history.length - 1].penalty)}</b>.</p>{/if}
    {/if}

    <div class="play"><button class="choice" onclick={playRound} disabled={stock <= 0}>Play round</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .stock { margin-bottom: 14px; font-size: 13px; }
  .stock > span { color: var(--ink-muted); margin-right: 8px; }
  .track { height: 10px; background: var(--surface-2); border-radius: 5px; overflow: hidden; margin-top: 7px; }
  .track span { display: block; height: 100%; background: var(--accent); transition: width .25s ease; }
  .slider { display: block; margin-bottom: 12px; font-size: 13px; }
  .slider span { display: block; margin-bottom: 7px; }
  .slider input { width: 100%; accent-color: var(--accent); }
  .check { display: flex; gap: 8px; align-items: flex-start; font-size: 13px; line-height: 1.45; margin-bottom: 12px; }
  .forecast { border-top: 1px solid var(--border); padding-top: 12px; font-size: 13px; line-height: 1.5; }
  .rounds { display: flex; align-items: flex-end; gap: 6px; height: 86px; margin-top: 14px; border-bottom: 1px solid var(--border); }
  .round { display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%; gap: 3px; }
  .round span { width: 16px; min-height: 2px; background: var(--accent); border-radius: 3px 3px 0 0; }
  .round small, .note { font-size: 11px; color: var(--ink-muted); }
  .note { line-height: 1.45; margin: 6px 0 0; }
</style>
