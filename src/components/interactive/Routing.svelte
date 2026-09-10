<script lang="ts">
  import { pigouCost, PIGOU_NASH, PIGOU_OPT, PIGOU_POA, braessBefore, braessAfter } from '@/engines/routing';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let shortcut = $state(false); // Braess: is the shortcut built?

  const time = $derived(shortcut ? braessAfter() : braessBefore());
  const r2 = (x: number) => Math.round(x * 100) / 100;

  function onPredict() { predicted = true; }
  function reset() { shortcut = false; }
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
    <div class="section">
      <div class="stitle">Braess paradox: 4000 drivers, two routes</div>
      <div class="timebox">
        <span class="tlab">Travel time per driver</span>
        <span class={'tval mono' + (shortcut ? ' worse' : '')}>{time} min</span>
      </div>
      <label class="check"><input type="checkbox" bind:checked={shortcut} /> Build the zero-cost shortcut</label>
      <div class="readout" aria-live="polite">
        {#if shortcut}
          Everyone funnels through the shortcut, overloading both congested segments. Travel time rises to <b class="mono">{braessAfter()}</b>, worse than the <b class="mono">{braessBefore()}</b> before. Adding a road made everyone slower.
        {:else}
          Traffic splits evenly across the two routes, each driver taking <b class="mono">{braessBefore()}</b> minutes. Now add the shortcut and predict what happens.
        {/if}
      </div>
    </div>

    <div class="section">
      <div class="stitle">Pigou: price of anarchy</div>
      <div class="poarow"><span>Selfish (Nash) total cost</span><span class="mono">{r2(PIGOU_NASH)}</span></div>
      <div class="poarow"><span>Coordinated optimum</span><span class="mono">{r2(PIGOU_OPT)}</span></div>
      <div class="poarow big"><span>Price of anarchy</span><span class="mono">{r2(PIGOU_POA)}</span></div>
      <p class="note">Selfish drivers all take the congestible link (cost 1); splitting in half would cost only 0.75. The ratio 4/3 is the price of anarchy, and for affine costs it never exceeds 4/3.</p>
    </div>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .section { border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; margin-bottom: 12px; }
  .stitle { font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 10px; }
  .timebox { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
  .tlab { font-size: 12.5px; color: var(--ink-muted); }
  .tval { font-size: 22px; font-weight: 700; color: var(--cooperate); }
  .tval.worse { color: var(--defect); }
  .check { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; margin-bottom: 10px; }
  .poarow { display: flex; justify-content: space-between; align-items: baseline; font-size: 13px; margin-bottom: 6px; color: var(--ink-muted); }
  .poarow.big { font-weight: 700; color: var(--ink); font-size: 15px; margin-top: 4px; }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
