<script lang="ts">
  import { deferredAcceptance, blockingPairs, type Prefs } from '@/engines/matching';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let {
    aName, bName, aPrefs, bPrefs, canSwap = true, exhibit = '', caption = '', predict = null,
  }: {
    aName: string; bName: string; aPrefs: Prefs; bPrefs: Prefs; canSwap?: boolean;
    exhibit?: string; caption?: string; predict?: Predict | null;
  } = $props();

  let predicted = $state(predict === null);
  let side = $state<'a' | 'b'>('a'); // which side proposes

  const proposers = $derived(side === 'a' ? Object.keys(aPrefs) : Object.keys(bPrefs));
  const propPrefs = $derived(side === 'a' ? aPrefs : bPrefs);
  const recvPrefs = $derived(side === 'a' ? bPrefs : aPrefs);
  const match = $derived(deferredAcceptance(proposers, propPrefs, recvPrefs));
  const blocks = $derived(blockingPairs(match, aPrefs, bPrefs));

  // Rank a proposer got (1 = first choice) for a readout of who does well.
  function rankOf(prefsList: string[], got: string) { return prefsList.indexOf(got) + 1; }
  const avgRank = $derived(
    proposers.reduce((s, p) => s + rankOf(propPrefs[p], match[p]), 0) / proposers.length
  );

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
    {#if canSwap}
      <div class="seg" role="group" aria-label="Proposing side">
        <button class={side === 'a' ? 'on' : ''} onclick={() => (side = 'a')}>{aName} propose</button>
        <button class={side === 'b' ? 'on' : ''} onclick={() => (side = 'b')}>{bName} propose</button>
      </div>
    {/if}

    <div class="matches">
      {#each proposers as p}
        <div class="mrow"><span class="ma mono">{p}</span><span class="arrow">&harr;</span><span class="mb mono">{match[p]}</span><span class="rk">choice #{rankOf(propPrefs[p], match[p])}</span></div>
      {/each}
    </div>

    <div class="readout" aria-live="polite">
      The proposing side ({side === 'a' ? aName : bName}) averages choice #{Math.round(avgRank * 10) / 10}: the proposer-optimal stable matching.
      {#if blocks.length === 0}No blocking pair exists, so this matching is stable.{:else}Blocking pairs: {blocks.map((b) => b.join('-')).join(', ')}.{/if}
    </div>
    {#if canSwap}<p class="note">Swap the proposing side and watch the matching flip: whoever proposes does better. Both matchings are stable, so stability alone does not pick one.</p>{/if}
  {/if}
</div>

<style>
  .seg { display: flex; border: 1px solid var(--border-strong); border-radius: 9px; overflow: hidden; margin-bottom: 14px; }
  .seg button { flex: 1; min-height: 44px; border: 0; background: var(--surface); color: var(--ink-muted); font-weight: 600; font-size: 12.5px; padding: 9px 6px; cursor: pointer; }
  .seg button + button { border-left: 1px solid var(--border); }
  .seg button.on { background: var(--accent-soft); color: var(--accent); }
  .matches { display: flex; flex-direction: column; gap: 7px; margin-bottom: 12px; }
  .mrow { display: grid; grid-template-columns: 1fr auto 1fr auto; gap: 10px; align-items: center; padding: 9px 12px; border: 1px solid var(--border); border-radius: 9px; }
  .ma { font-weight: 700; color: var(--accent); }
  .mb { font-weight: 700; color: var(--ink); text-align: right; }
  .arrow { color: var(--ink-muted); }
  .rk { font-size: 10.5px; color: var(--ink-muted); font-weight: 600; grid-column: 1 / -1; text-align: center; }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
