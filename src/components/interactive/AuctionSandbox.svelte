<script lang="ts">
  import { fpaBid, resolve, expectedRevenueUniform, type Format } from '@/engines/auction';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const N = 3; // you plus two bots
  let predicted = $state(predict === null);
  let format = $state<Format>('spa');
  let myValue = $state(Math.round(Math.random() * 100));
  let myBid = $state(50);
  let last = $state('');
  // Cumulative seller revenue tracked per format to show revenue equivalence.
  let rev = $state<Record<Format, { sum: number; n: number }>>({ fpa: { sum: 0, n: 0 }, spa: { sum: 0, n: 0 } });
  let mySurplus = $state(0);

  const draw = () => Math.round(Math.random() * 100);
  const avg = (f: Format) => (rev[f].n === 0 ? 0 : rev[f].sum / rev[f].n);

  function submit() {
    const b1 = draw(), b2 = draw();
    // Bots play their equilibrium: truthful in SPA, shaded in FPA.
    const botBid = (v: number) => (format === 'spa' ? v : Math.round(fpaBid(v, N)));
    const bids = [myBid, botBid(b1), botBid(b2)];
    const o = resolve(bids, format);
    const iWon = o.winner === 0;
    const surplus = iWon ? myValue - o.price : 0;
    if (iWon) mySurplus += surplus;
    rev[format] = { sum: rev[format].sum + (o.sold ? o.price : 0), n: rev[format].n + 1 };
    last = iWon
      ? `You won at a price of ${o.price}. Your value was ${myValue}, so your surplus is ${surplus > 0 ? '+' + surplus : surplus}.`
      : `A rival won at ${o.price}. You bid ${myBid} on a value of ${myValue}, so you take 0 this round.`;
    myValue = draw();
    myBid = Math.min(myBid, 100);
  }
  function reset() {
    myValue = draw(); myBid = 50; last = ''; mySurplus = 0;
    rev = { fpa: { sum: 0, n: 0 }, spa: { sum: 0, n: 0 } };
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
    <div class="seg" role="group" aria-label="Auction format">
      <button class={format === 'spa' ? 'on' : ''} onclick={() => (format = 'spa')}>Second-price</button>
      <button class={format === 'fpa' ? 'on' : ''} onclick={() => (format = 'fpa')}>First-price</button>
    </div>

    <div class="valbox">Your value this round: <b class="mono">{myValue}</b></div>
    <label class="slider">
      <span class="slab">Your bid: <b class="mono">{myBid}</b></span>
      <input type="range" min="0" max="100" step="1" bind:value={myBid} aria-label="Your bid" />
    </label>
    <p class="hint">{format === 'spa' ? 'Second-price tip: bidding your true value is a dominant strategy.' : 'First-price tip: bidding your value wins you nothing; the equilibrium shades to about two-thirds of it here.'}</p>

    <div class="play"><button class="choice" onclick={submit}>Submit bid</button><button class="tinybtn" onclick={reset}>Reset</button></div>

    <div class="readout" aria-live="polite">{last || 'Set your bid against two rivals with unknown values, then submit.'}</div>

    <div class="rev">
      <div class="rrow"><span class="rname">Avg revenue, second-price</span><span class="rval mono">{rev.spa.n ? Math.round(avg('spa')) : '-'}</span></div>
      <div class="rrow"><span class="rname">Avg revenue, first-price</span><span class="rval mono">{rev.fpa.n ? Math.round(avg('fpa')) : '-'}</span></div>
      <p class="rnote">Play both formats for a while: the seller's average revenue converges to the same number. That is revenue equivalence.</p>
    </div>

    <div class="scoreline">
      <div class="score you"><span class="v mono">{mySurplus}</span><span class="l">Your surplus</span></div>
      <div class="score"><span class="v mono">{rev.spa.n + rev.fpa.n}</span><span class="l">Rounds</span></div>
    </div>
  {/if}
</div>

<style>
  .seg { display: flex; border: 1px solid var(--border-strong); border-radius: 9px; overflow: hidden; margin-bottom: 12px; }
  .seg button { flex: 1; border: 0; background: var(--surface); color: var(--ink-muted); font-weight: 600; font-size: 12.5px; padding: 9px 6px; cursor: pointer; }
  .seg button + button { border-left: 1px solid var(--border); }
  .seg button.on { background: var(--accent-soft); color: var(--accent); }
  .valbox { font-size: 13.5px; margin-bottom: 10px; }
  .valbox b { color: var(--accent); }
  .slider { display: block; margin: 2px 0; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .hint { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 10px; line-height: 1.5; }
  .rev { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border); }
  .rrow { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
  .rname { font-size: 12px; color: var(--ink-muted); font-weight: 600; }
  .rval { font-size: 15px; color: var(--ink); }
  .rnote { font-size: 11.5px; color: var(--ink-muted); margin: 4px 0 0; line-height: 1.5; }
</style>
