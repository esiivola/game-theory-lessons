<script lang="ts">
  import { payoff, mpcr } from '@/engines/publicGoods';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let {
    e = 10,
    factor = 1.6,
    exhibit = '',
    caption = '',
    predict = null,
  }: { e?: number; factor?: number; exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const n = 4; // you plus three bots
  const share = mpcr(factor, n);

  let predicted = $state(predict === null);
  let give = $state(5);
  let round = $state(0);
  // Three bots: one free-rider, two conditional cooperators who match the others' last average.
  let bots = $state<[number, number, number]>([0, 7, 7]);
  let history = $state<{ mine: number; avg: number; pay: number }[]>([]);

  function playRound() {
    const others = bots.slice();
    const myPay = payoff(give, others, e, factor, n);
    const all = [give, ...others];
    const avg = all.reduce((s, x) => s + x, 0) / n;
    history = [...history, { mine: give, avg, pay: myPay }];
    round += 1;
    // Update bots for next round: free-rider stays 0; conditional cooperators copy the
    // average of everyone else in the round just played.
    const nextCond = (self: number) => {
      const rest = all.reduce((s, x) => s + x, 0) - self;
      return Math.max(0, Math.round((rest / (n - 1)) * 10) / 10);
    };
    bots = [0, nextCond(bots[1]), nextCond(bots[2])];
  }
  function reset() {
    give = 5; round = 0; bots = [0, 7, 7]; history = [];
  }
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
    <label class="slider">
      <span class="slab">Your contribution: <b class="mono">${give}</b> of ${e}</span>
      <input type="range" min="0" max={e} step="1" bind:value={give} aria-label="Your contribution" />
    </label>

    <div class="readout" aria-live="polite">
      {#if last}
        Round {round}: you gave <b class="mono">${r1(last.mine)}</b>, the group averaged <b class="mono">${r1(last.avg)}</b>.
        You ended the round with <b class="mono">${r1(last.pay)}</b>.
        {#if round >= 3}Watch the average slide: the free-rider drags the conditional cooperators down, round after round.{/if}
      {:else}
        Each $1 you contribute returns <b class="mono">${r1(share)}</b> to you, so giving looks like a private loss. Play a round and see.
      {/if}
    </div>

    {#if history.length > 0}
      <div class="rounds">
        {#each history as h, i}
          <div class="rc">
            <span class="rbar" style={`height:${(h.avg / e) * 100}%`}></span>
            <span class="rn mono">{i + 1}</span>
          </div>
        {/each}
      </div>
      <p class="rnote">Group average contribution by round.</p>
    {/if}

    <div class="play">
      <button class="choice" onclick={playRound}>Play round</button>
      <button class="tinybtn" onclick={reset}>Reset</button>
    </div>
  {/if}
</div>

<style>
  .slider { display: block; margin: 2px 0; }
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
