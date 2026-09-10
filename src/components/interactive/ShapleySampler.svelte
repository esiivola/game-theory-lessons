<script lang="ts">
  import { marginalContributions, shapley, type CharFn } from '@/engines/cooperative';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const V: CharFn = [0, 0, 0, 100, 0, 100, 0, 100];
  const NAMES = ['Seller', 'Buyer 1', 'Buyer 2'];
  const exact = shapley(V, 3);

  let predicted = $state(predict === null);
  let totals = $state<[number, number, number]>([0, 0, 0]);
  let samples = $state(0);

  const avg = $derived(samples === 0 ? [0, 0, 0] : totals.map((t) => t / samples));
  const r1 = (x: number) => Math.round(x * 10) / 10;

  function shuffle(): number[] {
    const a = [0, 1, 2];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function sample(k: number) {
    let t: [number, number, number] = [...totals];
    for (let s = 0; s < k; s++) {
      const mc = marginalContributions(V, shuffle(), 3);
      t = [t[0] + mc[0], t[1] + mc[1], t[2] + mc[2]];
    }
    totals = t; samples += k;
  }
  function reset() { totals = [0, 0, 0]; samples = 0; }
  function onPredict() { predicted = true; }
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
    <p class="setup">The Shapley value averages each player's marginal contribution over all the orders they could join. Sample random join orders and watch the averages settle.</p>

    <div class="bars">
      {#each NAMES as nm, i}
        <div class="brow">
          <span class="bname">{nm}</span>
          <span class="bbar"><i style={`width:${(avg[i] / 100) * 100}%`}></i><span class="mark" style={`left:${(exact[i] / 100) * 100}%`}></span></span>
          <span class="bval mono">{samples === 0 ? '-' : r1(avg[i])}</span>
        </div>
      {/each}
    </div>
    <p class="hint">The tick marks the exact Shapley value. Samples: <b class="mono">{samples}</b>.</p>

    <div class="play">
      <button class="choice" onclick={() => sample(1)}>Sample 1 order</button>
      <button class="tinybtn" onclick={() => sample(200)}>Sample 200</button>
      <button class="tinybtn" onclick={reset}>Reset</button>
    </div>

    <div class="readout" aria-live="polite">
      The running averages converge to <b class="mono">{r1(exact[0])}</b>, <b class="mono">{r1(exact[1])}</b>, <b class="mono">{r1(exact[2])}</b>, that is (200/3, 50/3, 50/3). Note the seller's 66.7 plus one buyer's 16.7 is only 83.3, below 100, so the Shapley value lies outside the core: it is a different notion of fairness, not stability.
    </div>
  {/if}
</div>

<style>
  .setup { font-size: 13px; color: var(--ink-muted); margin: 0 0 14px; line-height: 1.5; }
  .bars { display: flex; flex-direction: column; gap: 9px; }
  .brow { display: grid; grid-template-columns: 68px 1fr 42px; align-items: center; gap: 10px; }
  .bname { font-size: 12px; font-weight: 600; color: var(--ink-muted); }
  .bbar { position: relative; height: 10px; border-radius: 999px; background: var(--surface-2); overflow: visible; }
  .bbar > i { display: block; height: 100%; border-radius: 999px; background: var(--accent); transition: width .2s; }
  .bbar .mark { position: absolute; top: -3px; bottom: -3px; width: 0; border-left: 2px dashed var(--gold); }
  .bval { font-size: 12px; text-align: right; }
  .hint { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 4px; }
  .hint b { color: var(--ink); }
</style>
