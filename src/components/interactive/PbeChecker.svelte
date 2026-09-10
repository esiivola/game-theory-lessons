<script lang="ts">
  import { acceptEV, receiverAccepts, poolingOnGiveIsPBE } from '@/engines/pbe';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let p = $state(0.6); // prior that the sender is a Friend

  // On the path of "both types give", Bayes fixes the belief after a gift at the prior p.
  const belief = $derived(p);
  const accepts = $derived(receiverAccepts(belief));
  const isPBE = $derived(poolingOnGiveIsPBE(p));
  const pct = (x: number) => Math.round(x * 100) + '%';
  const r2 = (x: number) => Math.round(x * 100) / 100;

  function onPredict() { predicted = true; }
  function reset() { p = 0.6; }
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
      <span class="slab">Prior that the sender is a Friend: <b class="mono">{pct(p)}</b></span>
      <input type="range" min="0" max="1" step="0.01" bind:value={p} aria-label="Prior probability the sender is a Friend" />
    </label>

    <div class="belief-bar" aria-hidden="true">
      <span class="fill" style={`width:${belief * 100}%`}></span>
      <span class="thresh" style="left:50%"></span>
    </div>
    <div class="blabel"><span>0</span><span class="mid">accept threshold, belief 1/2</span><span>1</span></div>

    <div class="checks">
      <div class={'chk ' + (true ? 'ok' : '')}>
        <span class="mk">1</span><span>Belief on the path: both types give, so a gift implies belief <b class="mono">{r2(belief)}</b> by Bayes.</span>
      </div>
      <div class={'chk ' + (true ? 'ok' : '')}>
        <span class="mk">2</span><span>Receiver is sequentially rational: accepting pays <b class="mono">{r2(acceptEV(belief))}</b> versus 0, so it <b>{accepts ? 'accepts' : 'rejects'}</b>.</span>
      </div>
      <div class={'chk ' + (accepts ? 'ok' : 'no')}>
        <span class="mk">3</span><span>Sender is sequentially rational: if the gift is {accepts ? 'accepted, both types earn 1 > 0, so giving is optimal.' : 'rejected, both types earn -1 < 0, so they would rather not give.'}</span>
      </div>
      <div class="chk">
        <span class="mk">4</span><span>Off-path beliefs (never needed here on the path) must still make any deviation unprofitable.</span>
      </div>
    </div>

    <div class={'verdict ' + (isPBE ? 'yes' : 'no')} aria-live="polite">
      {#if isPBE}
        Pooling on Give is a perfect Bayesian equilibrium. With a friendly enough prior, the gift is trusted.
      {:else}
        Pooling on Give is not a PBE here. The belief {r2(belief)} is below 1/2, so the receiver rejects, and both types prefer not to give. The equilibrium is pooling on No gift, held up by an off-path belief that a gift comes from an Enemy.
      {/if}
    </div>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .slider { display: block; margin: 2px 0 12px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .belief-bar { position: relative; height: 12px; border-radius: 999px; background: var(--surface-2); overflow: visible; }
  .belief-bar .fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 999px; background: var(--accent); transition: width .2s; }
  .belief-bar .thresh { position: absolute; top: -3px; bottom: -3px; width: 0; border-left: 2px dashed var(--gold); }
  .blabel { display: flex; justify-content: space-between; font-size: 10px; color: var(--ink-muted); margin-top: 5px; }
  .blabel .mid { color: var(--gold); font-weight: 600; }
  .checks { margin: 16px 0 12px; display: flex; flex-direction: column; gap: 9px; }
  .chk { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; line-height: 1.5; }
  .chk .mk { flex: 0 0 auto; width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; font-weight: 700; background: var(--surface-2); color: var(--ink-muted); }
  .chk.ok .mk { background: var(--cooperate); color: var(--bg); }
  .chk.no .mk { background: var(--defect); color: var(--bg); }
  .chk b { color: var(--ink); }
  .verdict { border-radius: 10px; padding: 12px 14px; font-size: 13.5px; line-height: 1.5; }
  .verdict.yes { background: var(--cooperate-soft); }
  .verdict.no { background: var(--defect-soft); }
</style>
