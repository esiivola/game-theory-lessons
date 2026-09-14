<script lang="ts">
  import { ASYMMETRIC_PLATFORM, platformOutcome, users, profit } from '@/engines/platform';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let predictionLabel = $state('');
  let pA = $state(50); // price to side A (e.g. developers)
  let pB = $state(50); // price to side B (e.g. users)
  let model = $state<'symmetric' | 'asymmetric'>('symmetric');

  const u = $derived(model === 'symmetric' ? users(pA, pB) : platformOutcome(pA, pB, ASYMMETRIC_PLATFORM));
  const prof = $derived(model === 'symmetric' ? profit(pA, pB) : platformOutcome(pA, pB, ASYMMETRIC_PLATFORM).profit);
  const r0 = (x: number) => Math.round(x);

  function onPredict(label: string) { predictionLabel = label; predicted = true; }
  function reset() { pA = 50; pB = 50; }
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
    <div class="seg" role="group" aria-label="Platform demand model">
      <button class={model === 'symmetric' ? 'on' : ''} aria-pressed={model === 'symmetric'} onclick={() => (model = 'symmetric')}>Symmetric demand</button>
      <button class={model === 'asymmetric' ? 'on' : ''} aria-pressed={model === 'asymmetric'} onclick={() => (model = 'asymmetric')}>Users pull developers</button>
    </div>
    <p class="setup">A platform serves two sides. Each side grows when the other side is large, so pricing is not just cost-plus.</p>

    <label class="slider"><span class="slab">Price to side A: <b class="mono">{pA}</b></span><input type="range" min="-40" max="100" step="1" bind:value={pA} aria-label="Price to side A" /></label>
    <label class="slider"><span class="slab">Price to side B: <b class="mono">{pB}</b></span><input type="range" min="-40" max="100" step="1" bind:value={pB} aria-label="Price to side B" /></label>

    <div class="rows">
      <div class="mrow"><span class="mname">Side A adopters</span><span class="mval mono">{r0(u.a)}</span></div>
      <div class="mrow"><span class="mname">Side B adopters</span><span class="mval mono">{r0(u.b)}</span></div>
      <div class="mrow big"><span class="mname">Platform profit</span><span class="mval mono">{r0(prof)}</span></div>
    </div>

    <div class="readout" aria-live="polite">
      Cutting one side's price raises participation on both sides through the cross-side effect.
      {#if model === 'symmetric'}In the symmetric model, the displayed subsidy earns less than balanced pricing.{:else}Here side A is more price-sensitive, it attracts side B strongly, and side B brings extra revenue. Under these stated assumptions the subsidy can beat balanced pricing.{/if}
    </div>

    <div class="play"><button class="tinybtn" onclick={() => { pA = -10; pB = 70; }}>Test a subsidy</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .setup { font-size: 13px; color: var(--ink-muted); margin: 0 0 12px; line-height: 1.5; }
  .seg { display: flex; border: 1px solid var(--border-strong); border-radius: .55rem; overflow: hidden; margin-bottom: .75rem; }
  .seg button { flex: 1; min-height: 2.75rem; border: 0; background: var(--surface); color: var(--ink-muted); font-weight: 600; cursor: pointer; }
  .seg button + button { border-left: 1px solid var(--border); }
  .seg button.on { background: var(--accent-soft); color: var(--accent); }
  .slider { display: block; margin: 2px 0 8px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 6px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .rows { display: flex; flex-direction: column; gap: 6px; margin: 12px 0; }
  .mrow { display: flex; justify-content: space-between; align-items: baseline; }
  .mrow.big .mval { font-size: 19px; color: var(--accent); }
  .mname { font-size: 12.5px; color: var(--ink-muted); font-weight: 600; }
  .mval { font-size: 14px; color: var(--ink); }
</style>
