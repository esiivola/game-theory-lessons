<script lang="ts">
  import { costA, potential, isEquilibrium, N, B_COST } from '@/engines/congestion';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let onA = $state(0); // drivers on road A

  const phi = $derived(potential(onA));
  const eq = $derived(isEquilibrium(onA));
  const aCost = $derived(onA > 0 ? costA(onA) : 0);
  const maxPhi = potential(0);

  function moveToA() { if (onA < N) onA += 1; }
  function moveToB() { if (onA > 0) onA -= 1; }
  function reset() { onA = 0; }
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
    <p class="setup">{N} drivers pick a road. Road A costs its number of users; road B is a flat {B_COST}. Move drivers and watch the potential.</p>

    <div class="roads">
      <div class="road">
        <div class="rname">Road A (cost = users)</div>
        <div class="cars">{#each Array(onA) as _}<span class="car a">🚗</span>{/each}{#if onA === 0}<span class="empty">empty</span>{/if}</div>
        <div class="rcost">each pays <b class="mono">{aCost}</b></div>
      </div>
      <div class="road">
        <div class="rname">Road B (flat {B_COST})</div>
        <div class="cars">{#each Array(N - onA) as _}<span class="car b">🚗</span>{/each}{#if N - onA === 0}<span class="empty">empty</span>{/if}</div>
        <div class="rcost">each pays <b class="mono">{B_COST}</b></div>
      </div>
    </div>

    <div class="play"><button class="tinybtn" onclick={moveToB}>Move one to B</button><button class="tinybtn" onclick={moveToA}>Move one to A</button><button class="tinybtn" onclick={reset}>Reset</button></div>

    <div class="phi">
      <span class="plab">Potential &Phi;</span>
      <span class="pbar"><i style={`width:${(phi / maxPhi) * 100}%`}></i></span>
      <span class="pval mono">{phi}</span>
    </div>

    <div class={'verdict ' + (eq ? 'yes' : 'no')} aria-live="polite">
      {#if eq}
        Equilibrium: no driver can lower their cost by switching. The potential has bottomed out.
      {:else}
        Not stable: some driver would switch, and any improving switch strictly lowers the potential. Keep going.
      {/if}
    </div>
    <p class="note">Every improving move decreases the same potential function, so strict better-response dynamics cannot cycle and must reach a pure Nash equilibrium. A player can still switch among tied best responses unless the process specifies a tie rule.</p>
  {/if}
</div>

<style>
  .setup { font-size: 13px; color: var(--ink-muted); margin: 0 0 12px; line-height: 1.5; }
  .roads { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .road { border: 1px solid var(--border); border-radius: 10px; padding: 10px; }
  .rname { font-size: 11px; font-weight: 700; color: var(--ink-muted); margin-bottom: 8px; }
  .cars { min-height: 30px; font-size: 20px; letter-spacing: 2px; }
  .empty { font-size: 11px; color: var(--ink-muted); font-style: italic; }
  .rcost { font-size: 12px; color: var(--ink-muted); margin-top: 6px; }
  .rcost b { color: var(--ink); }
  .phi { display: grid; grid-template-columns: 1fr auto; grid-template-areas: "lab val" "bar bar"; gap: 4px 10px; margin: 14px 0 10px; }
  .plab { grid-area: lab; font-size: 11.5px; font-weight: 600; color: var(--ink-muted); }
  .pval { grid-area: val; font-size: 13px; }
  .pbar { grid-area: bar; height: 9px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
  .pbar > i { display: block; height: 100%; border-radius: 999px; background: var(--accent); transition: width .2s; }
  .verdict { border-radius: 9px; padding: 10px 14px; font-size: 13px; }
  .verdict.yes { background: var(--cooperate-soft); }
  .verdict.no { background: var(--defect-soft); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
