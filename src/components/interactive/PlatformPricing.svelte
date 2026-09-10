<script lang="ts">
  import { users, profit } from '@/engines/platform';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let pA = $state(50); // price to side A (e.g. developers)
  let pB = $state(50); // price to side B (e.g. users)

  const u = $derived(users(pA, pB));
  const prof = $derived(profit(pA, pB));
  const r0 = (x: number) => Math.round(x);

  function onPredict() { predicted = true; }
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
        {#each predict.options as o}<button onclick={onPredict}>{o.label}</button>{/each}
      </div>
    </div>
  {:else}
    <p class="setup">A platform serves two sides. Each side grows when the other side is large, so pricing is not just cost-plus.</p>

    <label class="slider"><span class="slab">Price to side A: <b class="mono">{pA}</b></span><input type="range" min="-40" max="100" step="1" bind:value={pA} aria-label="Price to side A" /></label>
    <label class="slider"><span class="slab">Price to side B: <b class="mono">{pB}</b></span><input type="range" min="-40" max="100" step="1" bind:value={pB} aria-label="Price to side B" /></label>

    <div class="rows">
      <div class="mrow"><span class="mname">Side A adopters</span><span class="mval mono">{r0(u.a)}</span></div>
      <div class="mrow"><span class="mname">Side B adopters</span><span class="mval mono">{r0(u.b)}</span></div>
      <div class="mrow big"><span class="mname">Platform profit</span><span class="mval mono">{r0(prof)}</span></div>
    </div>

    <div class="readout" aria-live="polite">
      Cut the price on one side (even below zero, a subsidy) and its adopters swell, which pulls in the other side too through the cross-side effect. Platforms often lose money on one side to monetize the other.
    </div>

    <div class="play"><button class="tinybtn" onclick={() => { pA = -10; pB = 70; }}>Subsidize side A</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .setup { font-size: 13px; color: var(--ink-muted); margin: 0 0 12px; line-height: 1.5; }
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
