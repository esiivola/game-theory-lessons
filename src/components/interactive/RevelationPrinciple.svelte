<script lang="ts">
  import { fpaBidTwo, winProb, interimPayment, interimSurplus } from '@/engines/revelation';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let v = $state(0.6);
  let direct = $state(false); // toggle to the direct truthful mechanism

  const r2 = (x: number) => Math.round(x * 100) / 100;

  function onPredict() { predicted = true; }
  function reset() { v = 0.6; direct = false; }
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
    <div class="seg" role="group" aria-label="Mechanism">
      <button class={!direct ? 'on' : ''} onclick={() => (direct = false)}>First-price auction</button>
      <button class={direct ? 'on' : ''} onclick={() => (direct = true)}>Direct: just report</button>
    </div>

    <label class="slider">
      <span class="slab">Your value: <b class="mono">{r2(v)}</b></span>
      <input type="range" min="0" max="1" step="0.01" bind:value={v} aria-label="Your value" />
    </label>

    <div class="rows">
      <div class="mrow"><span class="mname">{direct ? 'You report' : 'You bid'}</span><span class="mval mono">{direct ? r2(v) + ' (your true value)' : r2(fpaBidTwo(v)) + ' (shade to v/2)'}</span></div>
      <div class="mrow"><span class="mname">Win probability</span><span class="mval mono">{r2(winProb(v))}</span></div>
      <div class="mrow"><span class="mname">Expected payment</span><span class="mval mono">{r2(interimPayment(v))}</span></div>
      <div class="mrow"><span class="mname">Expected surplus</span><span class="mval mono">{r2(interimSurplus(v))}</span></div>
    </div>

    <div class="readout" aria-live="polite">
      {#if direct}
        In the direct mechanism you simply report your value; it wins if highest and charges the same expected payment the first-price auction produced. Truth-telling is optimal, and the outcome is identical.
      {:else}
        In the first-price auction you shade your bid to v/2. The win probability, payment, and surplus are exactly what the truthful direct mechanism reproduces. Flip the toggle and compare.
      {/if}
    </div>
    <p class="note">Same allocation, same payments, same revenue: the revelation principle says any equilibrium outcome can be achieved by a mechanism where honesty is optimal. It simplifies analysis; it does not create new possibilities.</p>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .seg { display: flex; border: 1px solid var(--border-strong); border-radius: 9px; overflow: hidden; margin-bottom: 14px; }
  .seg button { flex: 1; border: 0; background: var(--surface); color: var(--ink-muted); font-weight: 600; font-size: 12.5px; padding: 9px 6px; cursor: pointer; }
  .seg button + button { border-left: 1px solid var(--border); }
  .seg button.on { background: var(--accent-soft); color: var(--accent); }
  .slider { display: block; margin: 2px 0 12px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .rows { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
  .mrow { display: flex; justify-content: space-between; align-items: baseline; }
  .mname { font-size: 12.5px; color: var(--ink-muted); font-weight: 600; }
  .mval { font-size: 14px; color: var(--ink); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
