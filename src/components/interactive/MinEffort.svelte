<script lang="ts">
  import { payoff, symmetricPayoff, STD } from '@/engines/minEffort';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let effort = $state(5);
  let bots = $state<number[]>([3, 5, 6]); // teammates; they herd to the last round's weakest link
  let round = $state(0);
  let history = $state<{ min: number; pay: number }[]>([]);

  const r2 = (x: number) => Math.round(x * 100) / 100;
  const last = $derived(history[history.length - 1] ?? null);

  function playRound() {
    const all = [effort, ...bots];
    const groupMin = Math.min(...all);
    const pay = payoff(effort, groupMin, STD);
    history = [...history, { min: groupMin, pay }];
    round += 1;
    // Teammates copy the round's weakest link next time: coordination can slide down, never up.
    bots = bots.map(() => groupMin);
  }
  function reset() { effort = 5; bots = [3, 5, 6]; round = 0; history = []; }
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
      <span class="slab">Your effort: <b class="mono">{effort}</b> <span class="dim">(1 to 7)</span></span>
      <input type="range" min="1" max="7" step="1" bind:value={effort} aria-label="Your effort level" />
    </label>
    <p class="team">Teammates this round: {#each bots as b}<span class="tchip mono">{b}</span>{/each}</p>

    <div class="readout" aria-live="polite">
      {#if last}
        Round {round}: the group's weakest link was <b class="mono">{last.min}</b>, so you earned <b class="mono">{r2(last.pay)}</b>.
        {#if effort > last.min}Your extra effort above {last.min} was wasted: the payoff tracks the minimum, not your input.{/if}
        {#if round >= 3}Watch the floor slide down. Nobody can pull it back up alone.{/if}
      {:else}
        Your payoff is 0.6 + 0.2 times the group minimum, minus 0.1 times your own effort. Match the crowd; overshooting only costs you.
      {/if}
    </div>

    {#if history.length > 0}
      <div class="rounds">
        {#each history as h, i}
          <div class="rc"><span class="rbar" style={`height:${(h.min / 7) * 100}%`}></span><span class="rn mono">{i + 1}</span></div>
        {/each}
      </div>
      <p class="rnote">Group minimum by round. All-7 pays {r2(symmetricPayoff(7))}, all-1 pays {r2(symmetricPayoff(1))}: both are equilibria, but only if everyone holds.</p>
    {/if}

    <div class="play"><button class="choice" onclick={playRound}>Play round</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .slider { display: block; margin: 2px 0 8px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slab .dim { opacity: .7; }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .team { font-size: 12.5px; color: var(--ink-muted); margin: 0 0 4px; }
  .tchip { display: inline-grid; place-items: center; width: 24px; height: 24px; border-radius: 6px; background: var(--surface-2); font-size: 11px; font-weight: 700; margin-left: 6px; }
  .rounds { display: flex; align-items: flex-end; gap: 5px; height: 66px; margin-top: 12px; padding: 6px 0; border-bottom: 1px solid var(--border); }
  .rc { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 4px; flex: 0 0 auto; height: 100%; }
  .rbar { width: 16px; min-height: 2px; background: var(--accent); border-radius: 3px 3px 0 0; transition: height .3s cubic-bezier(.2,.8,.2,1); }
  .rn { font-size: 9px; color: var(--ink-muted); }
  .rnote { font-size: 11.5px; color: var(--ink-muted); margin: 4px 0 0; line-height: 1.5; }
  .play { align-items: center; }
</style>
