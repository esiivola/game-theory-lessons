<script lang="ts">
  import { proposerShare, responderShare, accepts } from '@/engines/rubinstein';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let delta = $state(0.8);
  let myShare = $state(0.5); // what you propose to keep
  let result = $state<'none' | 'accept' | 'reject'>('none');

  const spe = $derived(proposerShare(delta));       // your equilibrium share, 1/(1+delta)
  const theirFloor = $derived(responderShare(delta)); // what they can guarantee by waiting
  const pct = (n: number) => Math.round(n * 100) + '%';
  const r3 = (n: number) => Math.round(n * 1000) / 1000;

  function offer() {
    result = accepts(1 - myShare, delta) ? 'accept' : 'reject';
  }
  function reset() { myShare = 0.5; result = 'none'; }
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
    <label class="slider">
      <span class="slab">Patience &delta; (how little delay costs): <b class="mono">{r3(delta)}</b></span>
      <input type="range" min="0.1" max="0.95" step="0.01" bind:value={delta} aria-label="Discount factor delta" />
    </label>
    <label class="slider">
      <span class="slab">You propose to keep: <b class="mono">{pct(myShare)}</b>, offering them <b class="mono">{pct(1 - myShare)}</b></span>
      <input type="range" min="0" max="1" step="0.01" bind:value={myShare} aria-label="Your proposed share" />
    </label>

    <div class="pie" aria-hidden="true">
      <span class="mine" style={`width:${myShare * 100}%`}>you</span>
      <span class="theirs" style={`width:${(1 - myShare) * 100}%`}>them</span>
    </div>

    <div class="play"><button class="choice" onclick={offer}>Make the offer</button><button class="tinybtn" onclick={reset}>Reset</button></div>

    <div class="readout" aria-live="polite">
      {#if result === 'accept'}
        Accepted in round one. You keep <b class="mono">{pct(myShare)}</b>.
        {#if myShare < spe - 0.02}You could have kept up to {pct(spe)} and they would still have accepted: you left money on the table.{:else}That is at or below your equilibrium share of {pct(spe)}, so the deal closes at once.{/if}
      {:else if result === 'reject'}
        Rejected. By waiting they can secure {pct(theirFloor)} of the pie, and you offered only {pct(1 - myShare)}. Delay just shrinks the pie for both of you. The most you can demand and still close is <b class="mono">{pct(spe)}</b>.
      {:else}
        You move first. The responder will accept anything at least as good as waiting, which is worth {pct(theirFloor)} to them. So your best credible demand is {pct(spe)}.
      {/if}
    </div>

    <p class="note">Equilibrium: the proposer keeps 1/(1+&delta;) = <b class="mono">{pct(spe)}</b>, agreed immediately. As patience &delta; rises toward 1, that advantage fades to an even split.</p>
  {/if}
</div>

<style>
  .slider { display: block; margin: 2px 0 8px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .pie { display: flex; height: 30px; border-radius: 8px; overflow: hidden; margin: 8px 0 12px; border: 1px solid var(--border); }
  .pie span { display: grid; place-items: center; font-size: 11px; font-weight: 700; color: var(--bg); overflow: hidden; white-space: nowrap; }
  .pie .mine { background: var(--accent); }
  .pie .theirs { background: var(--ink-muted); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 10px 0 0; line-height: 1.5; }
  .note b { color: var(--ink); }
</style>
