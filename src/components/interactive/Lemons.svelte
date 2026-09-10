<script lang="ts">
  import { avgQualityOnMarket, buyerWTP, fractionSelling, QMAX } from '@/engines/lemons';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let p = $state(60);

  const avgQ = $derived(avgQualityOnMarket(p));
  const wtp = $derived(buyerWTP(p));
  const frac = $derived(fractionSelling(p));
  const gap = $derived(p - wtp); // shortfall: price minus willingness to pay
  const r0 = (x: number) => Math.round(x);

  function onPredict() { predicted = true; }
  function reset() { p = 60; }
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
    <div class="qbar" aria-hidden="true">
      <span class="listed" style={`width:${frac * 100}%`}></span>
      <span class="qlabel low">worst cars</span>
      <span class="qlabel high">best cars</span>
    </div>
    <p class="barnote">Shaded: the cars whose owners will sell at this price (quality 0 to {r0(p)}). Raising the price only tempts better cars in slowly, while the ones already listed stay low quality.</p>

    <label class="slider">
      <span class="slab">Price offered: <b class="mono">{r0(p)}</b></span>
      <input type="range" min="0" max={QMAX} step="1" bind:value={p} aria-label="Price offered" />
    </label>

    <div class="rows">
      <div class="mrow"><span class="mname">Average quality listed</span><span class="mval mono">{r0(avgQ)}</span></div>
      <div class="mrow"><span class="mname">Buyer will pay for that</span><span class="mval mono">{r0(wtp)}</span></div>
      <div class="mrow"><span class="mname">Price asked</span><span class="mval mono">{r0(p)}</span></div>
    </div>

    <div class={'verdict ' + (p <= 0 ? 'yes' : 'no')} aria-live="polite">
      {#if p <= 0}
        Only at a price of 0 does the market clear, and then only worthless cars trade. The good cars are gone.
      {:else}
        Buyers value the listed cars at {r0(wtp)} but the price is {r0(p)}, a shortfall of {r0(gap)}. No trade at this price. Whatever price you try, the average car is worth only three-quarters of it, so the market unravels.
      {/if}
    </div>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .qbar { position: relative; height: 26px; border-radius: 8px; background: var(--surface-2); overflow: hidden; border: 1px solid var(--border); }
  .qbar .listed { position: absolute; left: 0; top: 0; bottom: 0; background: var(--defect-soft); border-right: 2px solid var(--defect); }
  .qbar .qlabel { position: absolute; top: 50%; transform: translateY(-50%); font-size: 9.5px; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); }
  .qbar .qlabel.low { left: 6px; } .qbar .qlabel.high { right: 6px; }
  .barnote { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 10px; line-height: 1.5; }
  .slider { display: block; margin: 2px 0 12px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .rows { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
  .mrow { display: flex; justify-content: space-between; align-items: baseline; }
  .mname { font-size: 12.5px; color: var(--ink-muted); font-weight: 600; }
  .mval { font-size: 15px; color: var(--ink); }
  .verdict { border-radius: 10px; padding: 12px 14px; font-size: 13.5px; line-height: 1.5; }
  .verdict.yes { background: var(--cooperate-soft); }
  .verdict.no { background: var(--defect-soft); }
</style>
