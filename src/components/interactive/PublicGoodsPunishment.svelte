<script lang="ts">
  import { applyPunishment, payoff, mpcr } from '@/engines/publicGoods';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const n = 4, e = 20, factor = 1.6;
  let predicted = $state(predict === null);
  let predictionLabel = $state('');
  let punish = $state(false);
  let punishPoints = $state(0);
  let give = $state(15);
  let bots = $state<[number, number, number]>([10, 12, 4]); // includes one persistent free-rider
  let round = $state(0);
  let history = $state<{ average: number; you: number; freeRider: number; points: number }[]>([]);

  function playRound() {
    const others = bots.slice();
    const all = [give, ...others];
    const avg = all.reduce((s, x) => s + x, 0) / n;
    const yourBase = payoff(give, others, e, factor, n);
    const freeRiderBase = payoff(others[2], [give, others[0], others[1]], e, factor, n);
    const points = punish ? punishPoints : 0;
    const paid = applyPunishment(yourBase, freeRiderBase, points);
    history = [...history, { average: avg, you: paid.punisher, freeRider: paid.target, points }];
    round += 1;
    // Conditional cooperators copy the average; with punishment they hold high, without they decay.
    const cond = (self: number) => {
      const rest = (all.reduce((s, x) => s + x, 0) - self) / (n - 1);
      return Math.max(0, Math.round(rest));
    };
    if (punish && points > 0) {
      // This illustrative free-rider raises its next contribution by the penalty imposed.
      bots = [cond(bots[0]), cond(bots[1]), Math.min(e, bots[2] + 3 * points)];
    } else {
      bots = [Math.max(0, bots[0] - 1), cond(bots[1]), cond(bots[2])];
    }
  }
  function reset() { give = 15; punishPoints = 0; bots = [10, 12, 4]; round = 0; history = []; }
  function onPredict(label: string) { predictionLabel = label; predicted = true; }

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
          <button onclick={() => onPredict(o.label)}>{o.label}</button>
        {/each}
      </div>
    </div>
  {:else}
    {#if predictionLabel}<div class="prediction-memory"><b>Your prediction:</b> {predictionLabel}</div>{/if}
    {#if predictionLabel && predict}
      <details class="prediction-answer"><summary>Compare after playing</summary><p>{predict.reveal}</p></details>
    {/if}
    <label class="check"><input type="checkbox" bind:checked={punish} /> Allow costly punishment of free-riders</label>

    {#if punish}
      <label class="slider"><span class="slab">Punishment points: <b class="mono">{punishPoints}</b> (each costs you $1 and cuts the free-rider by $3)</span><input type="range" min="0" max="4" step="1" bind:value={punishPoints} aria-label="Punishment points" /></label>
    {/if}

    <label class="slider"><span class="slab">Your contribution: <b class="mono">${give}</b> of ${e}</span><input type="range" min="0" max={e} step="1" bind:value={give} aria-label="Your contribution" /></label>

    {#if history.length > 0}
      <div class="rounds">
        {#each history as h, i}
          <div class="rc"><span class="rbar" style={`height:${(h.average / e) * 100}%`}></span><span class="rn mono">{i + 1}</span></div>
        {/each}
      </div>
      <p class="rnote">Average group contribution by round. Contributions respond only when you actually buy punishment points.</p>
    {/if}

    <div class="readout" aria-live="polite">
      {#if last === null}
        Each $1 you contribute returns ${r1(mpcr(factor, n))} to you, so free-riding is tempting. Play rounds and watch what punishment does.
      {:else}
        Round {round}: group averaged <b class="mono">${r1(last.average)}</b>. Your payoff was <b class="mono">${r1(last.you)}</b>; the free-rider's payoff after punishment was <b class="mono">${r1(last.freeRider)}</b>.
        {#if last.points > 0}The next-round contribution response is an explicit behavioral rule in this demonstration, not a Nash prediction.{:else}No punishment was imposed this round.{/if}
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
