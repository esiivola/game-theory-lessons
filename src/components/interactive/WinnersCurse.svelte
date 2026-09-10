<script lang="ts">
  import { drawSignals, roundOutcome, shadeFor } from '@/engines/commonValue';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const SPREAD = 15;
  let predicted = $state(predict === null);
  let rivals = $state(3);          // number of rival bidders
  let mySignal = $state(50);
  let myBid = $state(50);
  let trueV = $state(50);
  let botSignals = $state<number[]>([]);
  let last = $state('');
  let profit = $state(0);
  let wins = $state(0);
  let rounds = $state(0);

  const n = $derived(rivals + 1);
  const suggestedBid = $derived(Math.round(mySignal - shadeFor(n, SPREAD)));
  const r1 = (x: number) => Math.round(x);

  function deal() {
    trueV = Math.round(35 + Math.random() * 30); // hidden value in [35,65]
    const sigs = drawSignals(trueV, n, SPREAD);
    mySignal = Math.round(sigs[0]);
    botSignals = sigs.slice(1).map((s) => Math.round(s));
    myBid = mySignal; // start at "bid your signal", the tempting mistake
    last = '';
  }
  function submit() {
    // Rivals bid naively: their own signal. You bid whatever you chose.
    const bids = [myBid, ...botSignals];
    const o = roundOutcome(trueV, bids, 'fpa');
    rounds += 1;
    if (o.winner === 0) {
      wins += 1;
      profit += o.winnerProfit;
      last = `You won. The item was truly worth ${trueV}; you paid ${myBid}, for a profit of ${o.winnerProfit > 0 ? '+' + o.winnerProfit : o.winnerProfit}.`;
    } else {
      last = `A rival won at ${r1(o.price)}. The item was worth ${trueV}. You took nothing this round, and dodged any overpayment.`;
    }
  }
  function reset() { rivals = 3; profit = 0; wins = 0; rounds = 0; last = ''; deal(); }
  function onPredict() { predicted = true; deal(); }
  if (predicted) deal();
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
    <div class="sig">Your signal of the item's value: <b class="mono">{mySignal}</b> <span class="dim">(noisy, could be high or low)</span></div>

    <label class="slider">
      <span class="slab">Your bid: <b class="mono">{myBid}</b></span>
      <input type="range" min="0" max="90" step="1" bind:value={myBid} aria-label="Your bid" />
    </label>
    <label class="slider">
      <span class="slab">Rival bidders: <b class="mono">{rivals}</b></span>
      <input type="range" min="1" max="7" step="1" bind:value={rivals} onchange={deal} aria-label="Number of rivals" />
    </label>
    <p class="hint">Rivals bid their own signals. A signal-shading correction here would bid about <b class="mono">{suggestedBid}</b>: lower with more rivals, because winning means your signal was the highest of many.</p>

    <div class="play"><button class="choice" onclick={submit}>Submit bid</button><button class="tinybtn" onclick={deal}>New item</button><button class="tinybtn" onclick={reset}>Reset</button></div>

    <div class="readout" aria-live="polite">{last || 'Bid on an item of unknown common value. Everyone sees a different noisy signal of the same true worth.'}</div>

    <div class="scoreline">
      <div class="score you"><span class="v mono">{profit > 0 ? '+' + profit : profit}</span><span class="l">Net profit</span></div>
      <div class="score"><span class="v mono">{wins}/{rounds}</span><span class="l">Won</span></div>
    </div>
    {#if rounds >= 4 && profit < 0}
      <p class="curse">That running loss is the winner's curse: bidding near your signal wins exactly the items you overvalued.</p>
    {/if}
  {/if}
</div>

<style>
  .sig { font-size: 13.5px; margin-bottom: 10px; }
  .sig b { color: var(--accent); } .sig .dim { color: var(--ink-muted); font-size: 12px; }
  .slider { display: block; margin: 2px 0 8px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .hint { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 10px; line-height: 1.5; }
  .hint b { color: var(--ink); }
  .curse { font-size: 12px; color: var(--defect); font-weight: 600; margin: 8px 0 0; line-height: 1.5; }
</style>
