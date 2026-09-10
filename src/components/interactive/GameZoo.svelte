<script lang="ts">
  import { pureNash, classify, FAMILY_NAME, type M2 } from '@/engines/classify2x2';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const PRESETS: { name: string; m: M2 }[] = [
    { name: "Prisoner's Dilemma", m: [[[3, 3], [0, 5]], [[5, 0], [1, 1]]] },
    { name: 'Stag Hunt', m: [[[4, 4], [0, 3]], [[3, 0], [3, 3]]] },
    { name: 'Battle of the Sexes', m: [[[2, 1], [0, 0]], [[0, 0], [1, 2]]] },
    { name: 'Chicken', m: [[[6, 6], [2, 7]], [[7, 2], [0, 0]]] },
    { name: 'Matching Pennies', m: [[[1, -1], [-1, 1]], [[-1, 1], [1, -1]]] },
  ];

  let predicted = $state(predict === null);
  let m = $state<M2>(structuredClone(PRESETS[0].m));
  let presetName = $state(PRESETS[0].name);

  const nash = $derived(pureNash(m));
  const family = $derived(classify(m));
  const isNash = (r: number, c: number) => nash.some((n) => n[0] === r && n[1] === c);
  const fmt = (n: number) => (n > 0 ? '+' + n : '' + n);

  function load(p: { name: string; m: M2 }) { m = structuredClone(p.m); presetName = p.name; }
  function bump(r: number, c: number, who: 0 | 1, d: number) {
    const next = structuredClone(m);
    next[r][c][who] = Math.max(-9, Math.min(9, next[r][c][who] + d));
    m = next;
    presetName = '';
  }
  function onPredict() { predicted = true; }

  const rowLabels = ['Top', 'Bottom'];
  const colLabels = ['Left', 'Right'];
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
    <div class="presets">
      {#each PRESETS as p}
        <button class={'pchip' + (presetName === p.name ? ' on' : '')} onclick={() => load(p)}>{p.name}</button>
      {/each}
    </div>

    <div class="zgrid">
      <div class="zh corner"></div>
      {#each colLabels as cl}<div class="zh">They {cl}</div>{/each}
      {#each rowLabels as rl, r}
        <div class="zh rowlab">You {rl}</div>
        {#each colLabels as _, c}
          <div class={'zcell' + (isNash(r, c) ? ' nash' : '')}>
            <div class="pair">
              <div class="ctl"><button aria-label="decrease your payoff" onclick={() => bump(r, c, 0, -1)}>-</button><span class="you mono">{fmt(m[r][c][0])}</span><button aria-label="increase your payoff" onclick={() => bump(r, c, 0, 1)}>+</button></div>
              <div class="ctl"><button aria-label="decrease their payoff" onclick={() => bump(r, c, 1, -1)}>-</button><span class="them mono">{fmt(m[r][c][1])}</span><button aria-label="increase their payoff" onclick={() => bump(r, c, 1, 1)}>+</button></div>
            </div>
          </div>
        {/each}
      {/each}
    </div>

    <div class="badge-row">
      <span class="fbadge">{presetName || FAMILY_NAME[family]}</span>
      <span class="nbadge mono">{nash.length} pure Nash</span>
    </div>

    <div class="readout" aria-live="polite">
      {#if nash.length === 0}
        No cell is stable: whoever you land on, someone wants to jump. There is no pure-strategy equilibrium, only a mixed one (the next lesson).
      {:else if nash.length === 1}
        One stable cell (gold). {family === 'prisoners-dilemma' ? 'Both players would prefer another cell, yet dominance drags them here: a dilemma.' : 'The game resolves to a single equilibrium.'}
      {:else}
        Two stable cells (gold). {family === 'stag-hunt' ? 'Both prefer the same one, but the other is safer: a coordination game.' : family === 'battle-of-the-sexes' ? 'Each player prefers a different one: coordination with conflict.' : 'They sit off the diagonal: an anti-coordination game where each wants to do the opposite of the other.'}
      {/if}
    </div>
    <p class="znote">Nudge the payoffs and watch the family and the equilibria change as incentives cross thresholds.</p>
  {/if}
</div>

<style>
  .presets { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
  .pchip { border: 1px solid var(--border-strong); background: var(--surface); border-radius: 999px; padding: 6px 11px; font-size: 12px; font-weight: 600; cursor: pointer; color: var(--ink-muted); }
  .pchip:hover { border-color: var(--accent); color: var(--ink); }
  .pchip.on { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
  .zgrid { display: grid; grid-template-columns: auto 1fr 1fr; gap: 6px; align-items: stretch; }
  .zh { display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); text-align: center; padding: 2px; }
  .zh.rowlab { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 9.5px; }
  .zh.corner { min-width: 18px; }
  .zcell { background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 8px 4px; }
  .zcell.nash { border-color: var(--gold); box-shadow: 0 0 0 2px var(--gold) inset; }
  .pair { display: flex; flex-direction: column; gap: 6px; }
  .ctl { display: flex; align-items: center; justify-content: center; gap: 6px; }
  .ctl button { width: 22px; height: 22px; border-radius: 6px; border: 1px solid var(--border-strong); background: var(--bg); color: var(--ink); font-weight: 700; font-size: 13px; cursor: pointer; line-height: 1; }
  .ctl button:hover { border-color: var(--accent); color: var(--accent); }
  .ctl .you { color: var(--accent); font-weight: 700; min-width: 24px; text-align: center; }
  .ctl .them { color: var(--ink-muted); font-weight: 700; min-width: 24px; text-align: center; }
  .badge-row { display: flex; align-items: center; gap: 10px; margin-top: 14px; }
  .fbadge { font-family: var(--font-display); font-size: 18px; color: var(--ink); }
  .nbadge { font-size: 11px; font-weight: 700; color: var(--accent); border: 1px solid var(--accent); border-radius: 999px; padding: 3px 9px; }
  .znote { font-size: 11.5px; color: var(--ink-muted); margin: 6px 0 0; line-height: 1.5; }
</style>
