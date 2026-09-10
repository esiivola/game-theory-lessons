<script lang="ts">
  import {
    playMatch, expectedDiscounted, tournament, grimThreshold, STD_PD,
    STRAT_NAMES, type StratId,
  } from '@/engines/repeatedPd';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let delta = $state(0.6);
  let strat = $state<StratId>('tft');
  let ran = $state(false);

  const threshold = grimThreshold(STD_PD); // 0.5 for the standard numbers
  const VIS = 12; // rounds of moves to show as chips
  const opponent: StratId = 'grim';

  const vis = $derived(playMatch(strat, opponent, VIS, STD_PD).moves);
  const totals = $derived(expectedDiscounted(strat, opponent, delta, STD_PD));
  const table = $derived(tournament(['allc', 'tft', 'grim', 'alld'], delta, STD_PD));

  const r1 = (x: number) => Math.round(x * 10) / 10;
  const stratIds: StratId[] = ['allc', 'tft', 'grim', 'alld'];
  const cooperates = $derived(strat === 'allc' || strat === 'tft' || strat === 'grim');

  function onPredict() { predicted = true; }
  function reset() { delta = 0.6; strat = 'tft'; ran = false; }
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
      <span class="slab">Patience &delta; (chance the game continues): <b class="mono">{Math.round(delta * 100)}%</b></span>
      <input type="range" min="0.1" max="0.95" step="0.01" bind:value={delta} aria-label="Discount factor delta" />
    </label>

    <div class="picker" role="group" aria-label="Your strategy">
      {#each stratIds as id}
        <button class={'pk' + (strat === id ? ' on' : '')} onclick={() => { strat = id; }}>{STRAT_NAMES[id]}</button>
      {/each}
    </div>
    <p class="oppnote">You play <b>{STRAT_NAMES[strat]}</b> against a <b>Grim trigger</b> bot that cooperates until you defect once, then defects forever.</p>

    <button class="choice run" onclick={() => { ran = true; }}>Run the match</button>

    {#if ran}
      <div class="tape" aria-hidden="false">
        {#each vis as m, i}
          <div class="col">
            <span class={'chip ' + (m[0] === 'C' ? 'c' : 'd')}>{m[0]}</span>
            <span class={'chip ' + (m[1] === 'C' ? 'c' : 'd')}>{m[1]}</span>
          </div>
        {/each}
        <span class="tapemore">&hellip;</span>
      </div>
      <div class="tapekey"><span class="you">Top: you</span><span class="them">Bottom: bot</span></div>

      <div class="readout" aria-live="polite">
        Discounted totals: you <b class="mono">{r1(totals.a)}</b>, the bot <b class="mono">{r1(totals.b)}</b>.
        {#if cooperates}
          {#if delta >= threshold}At &delta; = {Math.round(delta * 100)}% cooperation pays: mutual cooperation forever is worth 3/(1-&delta;), above what a one-time defection nets. Both keep cooperating.{:else}At &delta; = {Math.round(delta * 100)}% the future is too light to protect cooperation. Even a cooperative strategy would rather grab the one-time gain. Cooperation is not sustained below &delta; = 50%.{/if}
        {:else}
          Always defecting grabs 5 in round one, then the grim bot punishes and you both sit at 1 forever. Against a cooperative future that is a bad trade whenever &delta; is at least 50%.
        {/if}
      </div>
    {/if}

    <div class="tourney">
      <div class="tlab">Round-robin at &delta; = {Math.round(delta * 100)}%, average discounted score</div>
      {#each table as row}
        <div class="trow">
          <span class="tname">{STRAT_NAMES[row.id]}</span>
          <span class="tbar"><i style={`width:${Math.max(2, (row.score / (STD_PD.R / (1 - delta))) * 100)}%`}></i></span>
          <span class="tval mono">{r1(row.score)}</span>
        </div>
      {/each}
    </div>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .slider { display: block; margin: 2px 0 10px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .picker { display: flex; flex-wrap: wrap; gap: 7px; }
  .pk { border: 1.5px solid var(--border-strong); background: var(--surface); border-radius: 9px; padding: 9px 11px; font-weight: 600; font-size: 12.5px; cursor: pointer; color: var(--ink); }
  .pk:hover { border-color: var(--accent); }
  .pk.on { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
  .oppnote { font-size: 12.5px; color: var(--ink-muted); margin: 10px 0; line-height: 1.5; }
  .run { width: 100%; margin-bottom: 4px; }
  .tape { display: flex; align-items: center; gap: 4px; overflow-x: auto; padding: 12px 0 4px; }
  .col { display: flex; flex-direction: column; gap: 4px; flex: 0 0 auto; }
  .chip { width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center; font-family: var(--font-mono); font-weight: 700; font-size: 11px; }
  .chip.c { background: var(--cooperate-soft); color: var(--cooperate); }
  .chip.d { background: var(--defect-soft); color: var(--defect); }
  .tapemore { color: var(--ink-muted); font-weight: 700; padding-left: 2px; }
  .tapekey { display: flex; gap: 14px; font-size: 10.5px; font-weight: 600; color: var(--ink-muted); margin-bottom: 4px; }
  .tourney { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border); }
  .tlab { font-size: 10.5px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 10px; }
  .trow { display: grid; grid-template-columns: 108px 1fr 40px; align-items: center; gap: 10px; margin-bottom: 8px; }
  .tname { font-size: 12px; font-weight: 600; color: var(--ink); }
  .tbar { height: 8px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
  .tbar > i { display: block; height: 100%; border-radius: 999px; background: var(--accent); }
  .tval { font-size: 12px; text-align: right; }
</style>
