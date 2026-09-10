<script lang="ts">
  import { leaveNight, muddySees } from '@/engines/epistemic';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let n = $state(3);      // number of muddy children
  let night = $state(0);  // nights elapsed

  const leaves = $derived(leaveNight(n));
  const done = $derived(night >= leaves);

  function step() { if (night < leaves) night += 1; }
  function reset() { night = 0; }
  function setN(v: number) { n = v; night = 0; }
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
    <div class="kids" aria-hidden="true">
      {#each Array(n) as _, i}
        <span class={'kid' + (done ? ' left' : '')}>{done ? '✓' : '🙂'}</span>
      {/each}
    </div>
    <p class="kidnote">{n} muddy {n === 1 ? 'child' : 'children'}. Each sees the other {muddySees(n)} but not their own forehead. The oracle has announced, publicly, that at least one is muddy.</p>

    <label class="slider">
      <span class="slab">Number of muddy children: <b class="mono">{n}</b></span>
      <input type="range" min="1" max="6" step="1" value={n} oninput={(e) => setN(+(e.target as HTMLInputElement).value)} aria-label="Number of muddy children" />
    </label>

    <div class="readout" aria-live="polite">
      {#if night === 0}
        Night 0: nobody has acted. Step through the nights and see when they figure it out.
      {:else if done}
        Night {night}: all {n} muddy children leave together. Each reasoned: "I see {muddySees(n)} muddy others; if I were clean they would have left on night {muddySees(n)}; they did not, so I must be muddy too."
      {:else}
        Night {night}: still no one leaves. Each muddy child is waiting to see whether the {muddySees(n)} others go, which rules nothing out yet.
      {/if}
    </div>

    <div class="play"><button class="choice" onclick={step} disabled={done}>Advance one night</button><button class="tinybtn" onclick={reset}>Reset nights</button></div>
    <p class="note">The announcement seems to tell adults nothing new (everyone could already see a muddy face for n above 1), yet it creates common knowledge to all orders, and that is exactly what powers the induction to night {leaves}.</p>
  {/if}
</div>

<style>
  .kids { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; font-size: 26px; }
  .kid { transition: opacity .2s; }
  .kid.left { opacity: .35; }
  .kidnote { font-size: 12px; color: var(--ink-muted); margin: 0 0 12px; line-height: 1.5; }
  .slider { display: block; margin: 2px 0 12px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 10px 0 0; line-height: 1.5; }
</style>
