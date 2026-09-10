<script lang="ts">
  import { topTradingCycles, type Prefs } from '@/engines/ttc';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const AGENTS = ['1', '2', '3', '4'];
  const OWNS: Record<string, string> = { '1': 'h1', '2': 'h2', '3': 'h3', '4': 'h4' };
  const PREFS: Prefs = {
    '1': ['h3', 'h2', 'h1', 'h4'],
    '2': ['h1', 'h3', 'h4', 'h2'],
    '3': ['h2', 'h1', 'h3', 'h4'],
    '4': ['h3', 'h4', 'h1', 'h2'],
  };

  let predicted = $state(predict === null);
  const result = topTradingCycles(AGENTS, OWNS, PREFS);
  let step = $state(0); // rounds revealed

  const shown = $derived(result.rounds.slice(0, step));
  const done = $derived(step >= result.rounds.length);
  const rankGot = (a: string) => (done ? PREFS[a].indexOf(result.assignment[a]) + 1 : null);

  function next() { if (step < result.rounds.length) step += 1; }
  function reset() { step = 0; }
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
    <div class="owns">
      {#each AGENTS as a}
        <div class="own"><span class="oa mono">Agent {a}</span><span class="oh">owns {OWNS[a]}</span><span class="op">wants {PREFS[a].join(' > ')}</span></div>
      {/each}
    </div>

    {#each shown as r, i}
      <div class="round">
        <div class="rlab">Round {i + 1}: each points to the owner of its favourite remaining house</div>
        <div class="ptrs">
          {#each Object.entries(r.pointer) as [a, owner]}
            <span class="ptr mono">{a}&rarr;{owner}</span>
          {/each}
        </div>
        <div class="traded">Cycle executed: {r.traded.map((a) => `${a} gets ${result.assignment[a]}`).join(', ')}</div>
      </div>
    {/each}

    <div class="readout" aria-live="polite">
      {#if done}
        Final assignment: {AGENTS.map((a) => `${a}→${result.assignment[a]}`).join(', ')}. Agents 1, 3, and 2 traded in a cycle; agent 4 kept its own house. Not everyone got their first choice; scarcity forces compromises. The outcome is the unique core allocation, and no agent can gain by misreporting.
      {:else}
        Step through the rounds to run the market.
      {/if}
    </div>

    <div class="play"><button class="choice" onclick={next} disabled={done}>Run next round</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .owns { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
  .own { display: grid; grid-template-columns: auto auto 1fr; gap: 10px; align-items: baseline; font-size: 12px; }
  .oa { font-weight: 700; }
  .oh { color: var(--ink-muted); }
  .op { color: var(--ink-muted); font-family: var(--font-mono); font-size: 11px; text-align: right; }
  .round { border: 1px solid var(--border); border-radius: 9px; padding: 10px 12px; margin-bottom: 8px; }
  .rlab { font-size: 11px; font-weight: 600; color: var(--ink-muted); margin-bottom: 6px; }
  .ptrs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 6px; }
  .ptr { font-size: 12px; background: var(--surface-2); border-radius: 6px; padding: 3px 8px; font-weight: 700; }
  .traded { font-size: 12px; color: var(--accent); font-weight: 600; }
</style>
