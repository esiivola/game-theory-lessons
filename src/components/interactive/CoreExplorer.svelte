<script lang="ts">
  import { isInCore, blocking, type CharFn } from '@/engines/cooperative';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const V: CharFn = [0, 0, 0, 100, 0, 100, 0, 100]; // seller(0) + two buyers(1,2)
  const NAMES = ['Seller', 'Buyer 1', 'Buyer 2'];
  const MASKNAME: Record<number, string> = { 1: 'Seller', 2: 'Buyer 1', 3: 'Seller + Buyer 1', 4: 'Buyer 2', 5: 'Seller + Buyer 2', 6: 'the two buyers' };

  let predicted = $state(predict === null);
  let x1 = $state(60); // seller
  let x2 = $state(20); // buyer 1

  const x3 = $derived(100 - x1 - x2);
  const alloc = $derived([x1, x2, x3]);
  const feasible = $derived(x3 >= 0);
  const blocks = $derived(feasible ? blocking(alloc, V, 3) : []);
  const core = $derived(feasible && isInCore(alloc, V, 3));

  function onPredict() { predicted = true; }
  function reset() { x1 = 60; x2 = 20; }
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
    <p class="setup">One seller, two buyers. A sale needs the seller plus one buyer, worth 100. Alone, or as the two buyers, they can make nothing. Split the 100.</p>

    <label class="slider"><span class="slab">Seller gets: <b class="mono">{x1}</b></span><input type="range" min="0" max="100" step="1" bind:value={x1} aria-label="Seller share" /></label>
    <label class="slider"><span class="slab">Buyer 1 gets: <b class="mono">{x2}</b></span><input type="range" min="0" max="100" step="1" bind:value={x2} aria-label="Buyer 1 share" /></label>
    <div class="third">Buyer 2 gets: <b class="mono">{x3}</b> {#if !feasible}<span class="over">(over budget)</span>{/if}</div>

    {#if feasible}
      <div class="readout" aria-live="polite">
        {#if core}
          No coalition can do better by breaking away. This allocation is in the core.
        {:else}
          Blocked by {blocks.map((m) => MASKNAME[m]).join(', ')}: {blocks.length === 1 ? 'that coalition' : 'those coalitions'} can guarantee more than offered here, so this allocation is unstable.
        {/if}
      </div>
    {/if}

    <p class="note">Try to give the buyers anything at all. Any share to a buyer lets the seller-plus-other-buyer coalition (worth 100) block you, so the only core allocation is (100, 0, 0). Buyer competition hands all the surplus to the scarce seller.</p>

    <div class="play"><button class="tinybtn" onclick={() => { x1 = 100; x2 = 0; }}>Try the core point</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .setup { font-size: 13px; color: var(--ink-muted); margin: 0 0 12px; line-height: 1.5; }
  .slider { display: block; margin: 2px 0 8px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 6px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .third { font-size: 12.5px; color: var(--ink-muted); margin-bottom: 10px; }
  .third b { color: var(--ink); } .third .over { color: var(--defect); font-weight: 600; }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
