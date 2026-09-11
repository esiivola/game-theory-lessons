<script lang="ts">
  import { bestResponseQ, cournotNash, profit } from '@/engines/oligopoly';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let {
    a = 120,
    c = 0,
    allowToggle = false,
    leader = false,
    exhibit = '',
    caption = '',
    predict = null,
  }: {
    a?: number; c?: number; allowToggle?: boolean; leader?: boolean;
    exhibit?: string; caption?: string; predict?: Predict | null;
  } = $props();

  let predicted = $state(predict === null);
  let game = $state<'cournot' | 'bertrand'>('cournot');
  const Q = a - c; // choke quantity, and price ceiling for Bertrand
  const nash = cournotNash(a, c);

  // Cournot: your quantity q1; the rival best-responds.
  let q1 = $state(Math.round((a - c) / 2)); // start at the monopoly-ish quantity
  const q2 = $derived(bestResponseQ(a, c, q1));
  const price = $derived(Math.max(0, a - q1 - q2));
  const myProfit = $derived(profit(a, c, q1, q2));
  const theirProfit = $derived(profit(a, c, q2, q1));

  // Bertrand: your price p1; the rival undercuts by 1, but never below marginal cost.
  let p1 = $state(Math.round((a) / 2));
  const rivalPrice = $derived(Math.max(c, p1 - 1));
  const undercut = $derived(rivalPrice < p1); // at p1 = c there is nothing left to undercut

  const round = (n: number) => Math.round(n * 10) / 10;

  // Plot geometry (Cournot reaction lines in the (q1, q2) plane).
  const W = 320, H = 200, PADL = 30, PADR = 12, PADT = 12, PADB = 26;
  const sx = (q: number) => PADL + (q / Q) * (W - PADL - PADR);
  const sy = (q: number) => PADT + (1 - q / Q) * (H - PADT - PADB);

  function settle() {
    // Walk a few rounds of mutual best response toward the Nash intersection.
    let x = q1;
    for (let i = 0; i < 12; i++) {
      const y = bestResponseQ(a, c, x);
      x = bestResponseQ(a, c, y);
    }
    q1 = Math.round(x);
  }
  function reset() { q1 = Math.round((a - c) / 2); p1 = Math.round(a / 2); }
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
    {#if allowToggle}
      <div class="seg" role="group" aria-label="Competition type">
        <button class={game === 'cournot' ? 'on' : ''} onclick={() => (game = 'cournot')}>Cournot (quantities)</button>
        <button class={game === 'bertrand' ? 'on' : ''} onclick={() => (game = 'bertrand')}>Bertrand (prices)</button>
      </div>
    {/if}

    {#if game === 'cournot'}
      <div class="plot-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} class="plot" role="img"
             aria-label="Two reaction curves in the quantity plane, crossing at the Cournot equilibrium.">
          <line x1={PADL} y1={PADT} x2={PADL} y2={H - PADB} class="ax" />
          <line x1={PADL} y1={H - PADB} x2={W - PADR} y2={H - PADB} class="ax" />
          <!-- firm 1 reaction: q1 = (Q - q2)/2 -->
          <line x1={sx(Q / 2)} y1={sy(0)} x2={sx(0)} y2={sy(Q)} class="ln1" />
          <!-- firm 2 reaction: q2 = (Q - q1)/2 -->
          <line x1={sx(0)} y1={sy(Q / 2)} x2={sx(Q)} y2={sy(0)} class="ln2" />
          <circle cx={sx(nash)} cy={sy(nash)} r="3.5" class="crossdot" />
          <circle cx={sx(q1)} cy={sy(q2)} r="4.5" class="pt" />
          <text x={PADL} y={H - 8} class="axlab">your q = 0</text>
          <text x={W - PADR} y={H - 8} class="axlab" text-anchor="end">{Q}</text>
          <text x={4} y={PADT + 8} class="axlab">their q</text>
        </svg>
      </div>
      <div class="legend">
        <span class="k1">Your best reply</span>
        <span class="k2">Their best reply</span>
      </div>

      <label class="slider">
        <span class="slab">Your output q<sub>1</sub>: <b class="mono">{q1}</b></span>
        <input type="range" min="0" max={Q} step="1" bind:value={q1} aria-label="Your quantity" />
      </label>

      <div class="readout" aria-live="polite">
        You set q<sub>1</sub> = <b class="mono">{q1}</b>. The rival best-responds with q<sub>2</sub> = <b class="mono">{round(q2)}</b>,
        so price is <b class="mono">{round(price)}</b>. You earn <b class="mono">{round(myProfit)}</b>, they earn <b class="mono">{round(theirProfit)}</b>.
        {#if leader}
          {#if Math.abs(q1 - (a - c) / 2) < 1}Committing to {Math.round((a - c) / 2)} first (Stackelberg) beats the simultaneous {Math.round(nash)}: your profit {round(myProfit)} tops the Cournot {Math.round(nash * nash)}.{:else}Try committing to {Math.round((a - c) / 2)} before they move.{/if}
        {:else if Math.abs(q1 - nash) < 1}Both on their reaction curves: this is the Cournot equilibrium, q<sub>1</sub> = q<sub>2</sub> = {Math.round(nash)}.{/if}
      </div>

      <div class="play">
        {#if !leader}<button class="tinybtn" onclick={settle}>Let it settle</button>{/if}
        <button class="tinybtn" onclick={reset}>Reset</button>
      </div>
    {:else}
      <label class="slider">
        <span class="slab">Your price p<sub>1</sub>: <b class="mono">{p1}</b></span>
        <input type="range" min={c} max={a} step="1" bind:value={p1} aria-label="Your price" />
      </label>
      <div class="readout" aria-live="polite">
        {#if undercut}
          You post p<sub>1</sub> = <b class="mono">{p1}</b>. The rival undercuts to <b class="mono">{rivalPrice}</b> and takes the whole market,
          so you sell nothing and earn <b class="mono">0</b>.
          Whatever margin you post, one cent below it wins everything. The price war ends at cost.
        {:else}
          You post p<sub>1</sub> = <b class="mono">{p1}</b>, which is marginal cost. The rival can only match it, so you split the market
          and both earn <b class="mono">0</b>. That is the only Bertrand equilibrium: no one can cut further, and no one can raise
          their price without losing every customer.
        {/if}
      </div>
      <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
    {/if}
  {/if}
</div>

<style>
  .seg { display: flex; gap: 0; border: 1px solid var(--border-strong); border-radius: 9px; overflow: hidden; margin-bottom: 14px; }
  .seg button { flex: 1; border: 0; background: var(--surface); color: var(--ink-muted); font-weight: 600; font-size: 12.5px; padding: 9px 6px; cursor: pointer; }
  .seg button + button { border-left: 1px solid var(--border); }
  .seg button.on { background: var(--accent-soft); color: var(--accent); }
  .plot-wrap { overflow-x: auto; }
  .plot { width: 100%; height: auto; display: block; }
  .ax { stroke: var(--border-strong); stroke-width: 1; }
  .ln1 { stroke: var(--accent); stroke-width: 2; }
  .ln2 { stroke: var(--defect); stroke-width: 2; }
  .crossdot { fill: var(--gold); }
  .pt { fill: var(--ink); }
  .axlab { font-size: 9px; fill: var(--ink-muted); font-weight: 600; }
  .legend { display: flex; gap: 16px; font-size: 11px; font-weight: 600; margin: 8px 0 2px; }
  .legend .k1 { color: var(--accent); }
  .legend .k2 { color: var(--defect); }
  .legend span { display: inline-flex; align-items: center; gap: 5px; }
  .legend span::before { content: ""; width: 14px; height: 2px; background: currentColor; display: inline-block; }
  .slider { display: block; margin: 12px 0 2px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
</style>
