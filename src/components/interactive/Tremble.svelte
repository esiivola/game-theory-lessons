<script lang="ts">
  import { COORD, rowPayoffVsTremble, survivesTremble } from '@/engines/refinement';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let eps = $state(0.1);
  let pick = $state<'TL' | 'BR'>('BR');

  const r = $derived(pick === 'TL' ? 0 : 1);
  const c = $derived(pick === 'TL' ? 0 : 1);
  const survives = $derived(survivesTremble(COORD, r, c, eps));
  // Row's payoff to its intended action vs the deviation, given the column trembles.
  const payIntended = $derived(rowPayoffVsTremble(COORD, r, c, eps));
  const payDeviate = $derived(rowPayoffVsTremble(COORD, r === 0 ? 1 : 0, c, eps));
  const r2 = (x: number) => Math.round(x * 100) / 100;

  function onPredict() { predicted = true; }
  function reset() { eps = 0.1; pick = 'BR'; }
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
    <div class="matrix" role="group" aria-label="Coordination game: only (Top, Left) pays anything">
      <div class="mh corner">you&nbsp;&darr;<br />them&nbsp;&rarr;</div>
      <div class="mh">Left</div><div class="mh">Right</div>
      <div class="mh rowlab">Top</div>
      <div class={'cell' + (pick === 'TL' ? ' hi' : '')}><span class="pay">1, 1</span></div>
      <div class="cell"><span class="pay">0, 0</span></div>
      <div class="mh rowlab">Bottom</div>
      <div class="cell"><span class="pay">0, 0</span></div>
      <div class={'cell' + (pick === 'BR' ? ' hi' : '')}><span class="pay">0, 0</span></div>
    </div>

    <div class="picker">
      <button class={'pk' + (pick === 'TL' ? ' on' : '')} onclick={() => (pick = 'TL')}>Test (Top, Left)</button>
      <button class={'pk' + (pick === 'BR' ? ' on' : '')} onclick={() => (pick = 'BR')}>Test (Bottom, Right)</button>
    </div>

    <label class="slider">
      <span class="slab">Tremble size &epsilon; (chance each player slips): <b class="mono">{r2(eps)}</b></span>
      <input type="range" min="0" max="0.4" step="0.01" bind:value={eps} aria-label="Tremble size" />
    </label>

    <div class="readout" aria-live="polite">
      {#if pick === 'TL'}
        With the tiny chance the other slips, your intended Top still pays <b class="mono">{r2(payIntended)}</b> versus <b class="mono">{r2(payDeviate)}</b> from Bottom, so Top holds. (Top, Left) survives the tremble.
      {:else}
        If the other might slip to Left, your intended Bottom pays <b class="mono">{r2(payIntended)}</b> but Top would pay <b class="mono">{r2(payDeviate)}</b>. Any positive &epsilon; makes Top strictly better, so you abandon Bottom. (Bottom, Right) does not survive: it was only ever propped up by a move no one would risk making.
      {/if}
    </div>

    <div class={'verdict ' + (survives ? 'yes' : 'no')}>
      {survives ? 'Survives the tremble (trembling-hand perfect)' : 'Collapses under the tremble'}
    </div>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .matrix { display: grid; grid-template-columns: 24px 1fr 1fr; gap: 6px; align-items: stretch; margin-bottom: 12px; }
  .mh { display: flex; align-items: center; justify-content: center; font-size: 10.5px; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); text-align: center; }
  .mh.corner { font-size: 9px; font-weight: 600; line-height: 1.25; text-transform: none; }
  .mh.rowlab { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 9.5px; }
  .cell { background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 16px 6px; text-align: center; }
  .cell.hi { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-soft) inset; }
  .cell .pay { font-family: var(--font-mono); font-weight: 700; font-size: 15px; }
  .picker { display: flex; gap: 8px; margin-bottom: 12px; }
  .pk { flex: 1; border: 1.5px solid var(--border-strong); background: var(--surface); border-radius: 9px; padding: 9px; font-weight: 600; font-size: 12.5px; cursor: pointer; color: var(--ink); }
  .pk.on { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
  .slider { display: block; margin: 2px 0 12px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .verdict { border-radius: 9px; padding: 10px 14px; font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .verdict.yes { background: var(--cooperate-soft); color: var(--cooperate); }
  .verdict.no { background: var(--defect-soft); color: var(--defect); }
</style>
