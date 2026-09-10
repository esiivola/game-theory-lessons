<script lang="ts">
  import { solve } from '@/engines/vcg';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let a = $state(10); // A values the pair
  let b = $state(8);  // B values one unit
  let c = $state(6);  // C values one unit

  const out = $derived(solve(a, b, c));

  function onPredict() { predicted = true; }
  function reset() { a = 10; b = 8; c = 6; }
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
    <p class="setup">Two identical units for sale. Bidder <b>A</b> wants the pair; <b>B</b> and <b>C</b> each want one unit.</p>

    <label class="slider"><span class="slab">A values the pair: <b class="mono">{a}</b></span><input type="range" min="0" max="20" step="1" bind:value={a} aria-label="A value" /></label>
    <label class="slider"><span class="slab">B values one unit: <b class="mono">{b}</b></span><input type="range" min="0" max="12" step="1" bind:value={b} aria-label="B value" /></label>
    <label class="slider"><span class="slab">C values one unit: <b class="mono">{c}</b></span><input type="range" min="0" max="12" step="1" bind:value={c} aria-label="C value" /></label>

    <div class="alloc">
      Efficient allocation: <b>{out.allocation === 'A' ? 'A takes both units' : 'B and C each take one unit'}</b>
      <span class="wf mono">welfare {out.welfare}</span>
    </div>

    <div class="rows">
      {#if out.allocation === 'A'}
        <div class="mrow"><span class="mname">A pays (externality on B, C)</span><span class="mval mono">{out.payments.A}</span></div>
        <div class="mrow dim"><span class="mname">A's surplus</span><span class="mval mono">{a - out.payments.A}</span></div>
      {:else}
        <div class="mrow"><span class="mname">B pays</span><span class="mval mono">{out.payments.B}</span> <span class="ext">value {b}</span></div>
        <div class="mrow"><span class="mname">C pays</span><span class="mval mono">{out.payments.C}</span> <span class="ext">value {c}</span></div>
      {/if}
    </div>

    <div class="readout" aria-live="polite">
      Each winner pays the externality it imposes: the welfare the other bidders lose by its presence, not its own bid. That charge is below its value, so reporting truthfully is a dominant strategy, and no misreport lowers what you pay while still winning.
    </div>
    <p class="note">With a single item this rule is exactly the second-price auction. VCG generalises "pay the runner-up's value" to many goods.</p>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .setup { font-size: 13px; color: var(--ink-muted); margin: 0 0 12px; line-height: 1.5; }
  .setup b { color: var(--ink); }
  .slider { display: block; margin: 2px 0 8px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 6px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .alloc { font-size: 13.5px; margin: 12px 0; display: flex; justify-content: space-between; align-items: baseline; gap: 10px; flex-wrap: wrap; }
  .alloc b { color: var(--accent); }
  .alloc .wf { font-size: 12px; color: var(--ink-muted); }
  .rows { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
  .mrow { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .mrow.dim { opacity: .7; }
  .mname { font-size: 12.5px; color: var(--ink-muted); font-weight: 600; flex: 1; }
  .mval { font-size: 15px; color: var(--ink); }
  .ext { font-size: 11px; color: var(--ink-muted); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
