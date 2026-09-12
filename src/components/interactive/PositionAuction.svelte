<script lang="ts">
  import { solveVCG, gspPayment, gspTopDeviation } from '@/engines/positionAuction';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const CLICKS = [100, 80];
  const NAMES = ['A', 'B', 'C'];
  let predicted = $state(predict === null);
  let rule = $state<'vcg' | 'gsp'>('vcg');
  let values = $state([10, 6, 4]); // per-click values, truthful

  const assign = $derived(solveVCG(values, CLICKS));
  const dev = $derived(gspTopDeviation(values, CLICKS));
  const topName = $derived(NAMES[[...values].map((v, i) => i).sort((a, b) => values[b] - values[a])[0]]);
  const rows = $derived(assign.map((a) => {
    const pay = rule === 'vcg' ? a.vcgPayment : gspPayment(values, CLICKS, a.slot);
    return { name: NAMES[a.index], slot: a.slot + 1, clicks: a.clicks, value: a.value, pay, profit: a.value * a.clicks - pay };
  }));

  function bump(i: number, d: number) {
    const next = [...values];
    next[i] = Math.max(0, Math.min(20, next[i] + d));
    values = next;
  }
  function onPredict() { predicted = true; }
  function reset() { values = [10, 6, 4]; rule = 'vcg'; }
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
    <p class="setup">Two ad slots: slot 1 gets 100 clicks, slot 2 gets 80. Three advertisers bid per click.</p>
    <div class="bidders">
      {#each NAMES as nm, i}
        <div class="bidder">
          <span class="bname">{nm}</span>
          <span class="ctl"><button aria-label={`decrease ${nm}`} onclick={() => bump(i, -1)}>-</button><span class="bv mono">{values[i]}</span><button aria-label={`increase ${nm}`} onclick={() => bump(i, 1)}>+</button></span>
          <span class="bunit">/click</span>
        </div>
      {/each}
    </div>

    <div class="seg" role="group" aria-label="Pricing rule">
      <button class={rule === 'vcg' ? 'on' : ''} onclick={() => (rule = 'vcg')}>VCG</button>
      <button class={rule === 'gsp' ? 'on' : ''} onclick={() => (rule = 'gsp')}>GSP</button>
    </div>

    <div class="table">
      <div class="th"><span>Winner</span><span>Slot</span><span>Pays</span><span>Profit</span></div>
      {#each rows as r}
        <div class="tr"><span class="mono">{r.name}</span><span>{r.slot} ({r.clicks} clicks)</span><span class="mono">{Math.round(r.pay)}</span><span class="mono">{Math.round(r.profit)}</span></div>
      {/each}
    </div>

    <div class="readout" aria-live="polite">
      {#if rule === 'vcg'}
        VCG charges each winner the externality it imposes on the others. A bid can change the allocation and payment, but truthful bidding makes VCG maximize that bidder's true value plus others' reported value, so it is weakly dominant.
      {:else}
        GSP charges each slot the next advertiser's bid, so the top slot pays more here than under VCG.
        Bidding truthfully, {topName} keeps {Math.round(dev.stay)}; shading just under the second bid
        would win slot 2 at the third bid, worth {Math.round(dev.drop)}.
        {#if dev.profitable}
          Shading pays, so truthful bidding is not an equilibrium. Under the standard model, the lowest
          locally envy-free GSP equilibrium reproduces the VCG prices.
        {:else}
          Shading does not pay at these numbers, so truth survives here even though GSP overcharges. GSP is
          still not truthful in general: change the values or the click split and the deviation turns profitable.
        {/if}
      {/if}
    </div>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .setup { font-size: 13px; color: var(--ink-muted); margin: 0 0 12px; line-height: 1.5; }
  /* Row gap carries the stepper hit areas: the bidders wrap to two rows at 375px, and a 44px
     tap area on a 22px button needs the rows at least 44px apart or A's + steals C's taps. */
  .bidders { display: flex; gap: 20px 10px; flex-wrap: wrap; margin-bottom: 14px; }
  .bidder { display: flex; align-items: center; gap: 6px; }
  .bname { font-weight: 700; font-family: var(--font-mono); }
  .ctl { display: inline-flex; align-items: center; gap: 5px; }
  .ctl button { position: relative; width: 22px; height: 22px; border-radius: 6px; border: 1px solid var(--border-strong); background: var(--bg); color: var(--ink); font-weight: 700; cursor: pointer; }
  /* The steppers stay 22px on screen and take taps over 44px. The row is [-][value][+] with a
     5px gap and a 20px value, so the two expanded areas end 8px apart and never overlap. */
  .ctl button::after { content: ''; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 44px; height: 44px; }
  .ctl button:hover { border-color: var(--accent); color: var(--accent); }
  .bv { min-width: 20px; text-align: center; font-weight: 700; }
  .bunit { font-size: 11px; color: var(--ink-muted); }
  .seg { display: flex; border: 1px solid var(--border-strong); border-radius: 9px; overflow: hidden; margin-bottom: 12px; }
  .seg button { flex: 1; min-height: 44px; border: 0; background: var(--surface); color: var(--ink-muted); font-weight: 600; font-size: 12.5px; padding: 9px; cursor: pointer; }
  .seg button + button { border-left: 1px solid var(--border); }
  .seg button.on { background: var(--accent-soft); color: var(--accent); }
  .table { border: 1px solid var(--border); border-radius: 9px; overflow: hidden; margin-bottom: 12px; }
  .th, .tr { display: grid; grid-template-columns: 1fr 1.4fr 1fr 1fr; gap: 6px; padding: 8px 10px; align-items: center; font-size: 12.5px; }
  .th { background: var(--surface-2); font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); }
  .tr { border-top: 1px solid var(--border); }
  .readout { margin-top: 2px; }
</style>
