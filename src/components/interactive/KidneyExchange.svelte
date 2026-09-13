<script lang="ts">
  import { directedCycles, longestDonorChain } from '@/engines/matching';

  const graph = { A: ['B'], B: ['A', 'C'], C: ['B'], NDD: ['C'] };
  const cycles = directedCycles(graph, 3);
  const chain = longestDonorChain(graph, 'NDD', 3);
  let result = $state<'none' | 'cycles' | 'chain'>('none');
</script>

<div class="widget">
  <div class="exhibit-cap"><span>Exhibit 2</span> &nbsp;A kidney compatibility graph</div>
  <p class="note">An arrow A &rarr; B means A's donor can give to B's patient. NDD is a non-directed donor with no paired patient.</p>
  <div class="edges" aria-label="Compatibility edges">
    {#each Object.entries(graph) as [from, recipients]}
      <div><b class="mono">{from}</b> &rarr; <span class="mono">{recipients.join(', ')}</span></div>
    {/each}
  </div>
  <div class="play">
    <button class="choice" onclick={() => (result = 'cycles')}>Find closed cycles</button>
    <button class="choice" onclick={() => (result = 'chain')}>Start the donor chain</button>
  </div>
  <div class="readout" aria-live="polite">
    {#if result === 'cycles'}
      The compatible swaps are {cycles.map((cycle) => `${cycle.join(' → ')} → ${cycle[0]}`).join(' and ')}. Every donor in a cycle gives only if their paired patient receives.
    {:else if result === 'chain'}
      The non-directed donor starts {chain.join(' → ')}. The final donor can continue later, so the exchange need not close into a cycle.
    {:else}
      Find the closed swaps, then compare them with a chain started by NDD.
    {/if}
  </div>
</div>

<style>
  .note { margin: 0 0 .75rem; color: var(--ink-muted); font-size: .78rem; line-height: 1.5; }
  .edges { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .45rem; margin-bottom: .85rem; }
  .edges div { border: 1px solid var(--border); border-radius: .55rem; padding: .55rem .7rem; font-size: .82rem; }
  @media (max-width: 22rem) { .edges { grid-template-columns: 1fr; } }
</style>
