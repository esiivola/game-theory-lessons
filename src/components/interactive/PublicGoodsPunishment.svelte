<script lang="ts">
  import { payoff, mpcr } from '@/engines/publicGoods';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const n = 4, e = 20, factor = 1.6;
  let predicted = $state(predict === null);
  let punish = $state(false);
  let give = $state(15);
  let bots = $state<[number, number, number]>([10, 12, 4]); // includes one persistent free-rider
  let round = $state(0);
  let history = $state<number[]>([]);

  function playRound() {
    const others = bots.slice();
    const all = [give, ...others];
    const avg = all.reduce((s, x) => s + x, 0) / n;
    history = [...history, avg];
    round += 1;
    // Conditional cooperators copy the average; with punishment they hold high, without they decay.
    const cond = (self: number) => {
      const rest = (all.reduce((s, x) => s + x, 0) - self) / (n - 1);
      return Math.max(0, Math.round(rest));
    };
    if (punish) {
      // Punishment drags the free-rider up and keeps cooperators high.
      bots = [Math.min(e, bots[0] + 5), Math.min(e, cond(bots[1]) + 3), Math.min(e, cond(bots[2]) + 3)];
    } else {
      bots = [Math.max(0, bots[0] - 1), cond(bots[1]), cond(bots[2])];
    }
  }
  function reset() { give = 15; bots = [10, 12, 4]; round = 0; history = []; }
  function onPredict() { predicted = true; }

  const last = $derived(history[history.length - 1] ?? null);
  const r1 = (x: number) => Math.round(x * 10) / 10;
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
    <label class="check"><input type="checkbox" bind:checked={punish} /> Allow costly punishment of free-riders</label>

    <label class="slider"><span class="slab">Your contribution: <b class="mono">${give}</b> of ${e}</span><input type="range" min="0" max={e} step="1" bind:value={give} aria-label="Your contribution" /></label>

    {#if history.length > 0}
      <div class="rounds">
        {#each history as h, i}
          <div class="rc"><span class="rbar" style={`height:${(h / e) * 100}%`}></span><span class="rn mono">{i + 1}</span></div>
        {/each}
      </div>
      <p class="rnote">Average group contribution by round. {punish ? 'With punishment available, contributions climb and hold.' : 'Without punishment, contributions decay toward zero.'}</p>
    {/if}

    <div class="readout" aria-live="polite">
      {#if last === null}
        Each $1 you contribute returns ${r1(mpcr(factor, n))} to you, so free-riding is tempting. Play rounds and watch what punishment does.
      {:else}
        Round {round}: group averaged <b class="mono">${r1(last)}</b>.
        {#if punish}Costly punishment (pay 1 to cut a free-rider by 3) keeps cooperation alive, even though punishing is itself individually costly.{:else}Without a way to punish, even the cooperators give up: contributions slide toward the selfish zero.{/if}
      {/if}
    </div>

    <div class="play"><button class="choice" onclick={playRound}>Play round</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .check { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; margin-bottom: 12px; font-weight: 600; }
  .slider { display: block; margin: 2px 0 6px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .rounds { display: flex; align-items: flex-end; gap: 5px; height: 72px; margin-top: 12px; padding: 6px 0; border-bottom: 1px solid var(--border); }
  .rc { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 4px; flex: 0 0 auto; height: 100%; }
  .rbar { width: 16px; min-height: 2px; background: var(--accent); border-radius: 3px 3px 0 0; transition: height .3s cubic-bezier(.2,.8,.2,1); }
  .rn { font-size: 9px; color: var(--ink-muted); }
  .rnote { font-size: 11.5px; color: var(--ink-muted); margin: 4px 0 0; }
  .play { align-items: center; }
</style>
