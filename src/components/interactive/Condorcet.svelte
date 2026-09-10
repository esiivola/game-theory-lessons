<script lang="ts">
  import { pairwiseWinner, condorcetWinner, type Rank } from '@/engines/socialChoice';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const ALTS = ['A', 'B', 'C'];
  const PERMS: Rank[] = [
    ['A', 'B', 'C'], ['A', 'C', 'B'], ['B', 'A', 'C'],
    ['B', 'C', 'A'], ['C', 'A', 'B'], ['C', 'B', 'A'],
  ];
  const permIndex = (r: Rank) => PERMS.findIndex((p) => p.join() === r.join());

  let predicted = $state(predict === null);
  // Start on the classic cycle.
  let voters = $state<Rank[]>([['A', 'B', 'C'], ['B', 'C', 'A'], ['C', 'A', 'B']]);

  const pairs = $derived([
    ['A', 'B'], ['B', 'C'], ['C', 'A'],
  ].map(([x, y]) => ({ x, y, w: pairwiseWinner(voters, x, y) })));
  const winner = $derived(condorcetWinner(voters, ALTS));

  function cycleVoter(i: number) {
    const cur = permIndex(voters[i]);
    const next = PERMS[(cur + 1) % PERMS.length];
    voters = voters.map((v, j) => (j === i ? next : v));
  }
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
    <div class="voters">
      {#each voters as v, i}
        <button class="voter" onclick={() => cycleVoter(i)} aria-label={`Voter ${i + 1} ranking, tap to change`}>
          <span class="vlab">Voter {i + 1}</span>
          <span class="rank mono">{v.join(' > ')}</span>
        </button>
      {/each}
    </div>
    <p class="hint">Tap a voter to change their ranking.</p>

    <div class="pairs">
      {#each pairs as p}
        <div class="prow"><span class="pq mono">{p.x} vs {p.y}</span><span class="pw">majority prefers <b class="mono">{p.w ?? 'tie'}</b></span></div>
      {/each}
    </div>

    <div class={'verdict ' + (winner ? 'yes' : 'no')} aria-live="polite">
      {#if winner}
        {winner} beats both others head to head: a Condorcet winner. Majority rule gives a clear answer here.
      {:else}
        No Condorcet winner. The majorities cycle ({pairs.map((p) => p.w).join(' beats ')} beats back to the start), so majority rule has no consistent choice.
      {/if}
    </div>
    <p class="note">This intransitivity is the seed of Arrow's theorem: with three or more options, no ranking rule can satisfy unanimity and independence of irrelevant alternatives without being a dictatorship.</p>
  {/if}
</div>

<style>
  .voters { display: flex; gap: 8px; flex-wrap: wrap; }
  .voter { flex: 1; min-width: 90px; border: 1px solid var(--border-strong); background: var(--surface); border-radius: 9px; padding: 10px; cursor: pointer; text-align: left; }
  .voter:hover { border-color: var(--accent); }
  .vlab { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 4px; }
  .rank { font-size: 15px; font-weight: 700; color: var(--ink); }
  .hint { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 12px; }
  .pairs { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
  .prow { display: flex; justify-content: space-between; align-items: baseline; font-size: 13px; }
  .pq { color: var(--ink-muted); font-weight: 600; }
  .pw b { color: var(--accent); }
  .verdict { border-radius: 10px; padding: 12px 14px; font-size: 13.5px; line-height: 1.5; }
  .verdict.yes { background: var(--cooperate-soft); }
  .verdict.no { background: var(--defect-soft); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 10px 0 0; line-height: 1.5; }
</style>
