<script lang="ts">
  import { excesses, nucleolus3, shapley, type CharFn } from '@/engines/cooperative';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  // 3-player majority game: any pair (or all three) is worth 1.
  const V: CharFn = [0, 0, 0, 1, 0, 1, 1, 1];
  const COAL = ['{1}', '{2}', '{1,2}', '{3}', '{1,3}', '{2,3}'];

  let predicted = $state(predict === null);
  let x1 = $state(0.5);
  let x2 = $state(0.3);

  const x3 = $derived(1 - x1 - x2);
  const feasible = $derived(x3 >= -1e-9);
  const exc = $derived(feasible ? excesses([x1, x2, Math.max(0, x3)], V, 3) : []);
  const worst = $derived(exc.length ? Math.max(...exc) : 0);
  const nuc = nucleolus3(V);
  const shap = shapley(V, 3);
  const r2 = (x: number) => Math.round(x * 100) / 100;

  function onPredict() { predicted = true; }
  function reset() { x1 = 0.5; x2 = 0.3; }
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
    <p class="setup">A three-player majority game: any two players (or all three) can secure the whole prize of 1. The core is empty, so no split is unblockable. The nucleolus makes the biggest complaint as small as possible.</p>

    <label class="slider"><span class="slab">Player 1 gets: <b class="mono">{r2(x1)}</b></span><input type="range" min="0" max="1" step="0.01" bind:value={x1} aria-label="Player 1 share" /></label>
    <label class="slider"><span class="slab">Player 2 gets: <b class="mono">{r2(x2)}</b></span><input type="range" min="0" max="1" step="0.01" bind:value={x2} aria-label="Player 2 share" /></label>
    <div class="third">Player 3 gets: <b class="mono">{r2(Math.max(0, x3))}</b> {#if !feasible}<span class="over">(over budget)</span>{/if}</div>

    {#if feasible}
      <div class="excbars">
        {#each exc as e, i}
          <div class="erow">
            <span class="ename mono">{COAL[i]}</span>
            <span class="ebar"><i class={e > 0 ? 'pos' : 'neg'} style={`width:${Math.min(100, Math.abs(e) * 100)}%`}></i></span>
            <span class="eval mono">{r2(e)}</span>
          </div>
        {/each}
        <p class="enote">Each bar is a coalition's complaint (what it could get, minus what it is offered). The largest complaint now is <b class="mono">{r2(worst)}</b>.</p>
      </div>
    {/if}

    <div class="readout" aria-live="polite">
      The nucleolus minimizes the largest complaint, then the next, and so on. Here it is the equal split (<b class="mono">{r2(nuc[0])}</b>, <b class="mono">{r2(nuc[1])}</b>, <b class="mono">{r2(nuc[2])}</b>), which for this symmetric game matches the Shapley value (<b class="mono">{r2(shap[0])}</b>, <b class="mono">{r2(shap[1])}</b>, <b class="mono">{r2(shap[2])}</b>). In asymmetric games the two differ.
    </div>

    <div class="play"><button class="tinybtn" onclick={() => { x1 = nuc[0]; x2 = nuc[1]; }}>Snap to the nucleolus</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .setup { font-size: 13px; color: var(--ink-muted); margin: 0 0 12px; line-height: 1.5; }
  .slider { display: block; margin: 2px 0 8px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 6px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .third { font-size: 12.5px; color: var(--ink-muted); margin-bottom: 12px; }
  .third b { color: var(--ink); } .third .over { color: var(--defect); font-weight: 600; }
  .excbars { margin-bottom: 12px; }
  .erow { display: grid; grid-template-columns: 46px 1fr 42px; align-items: center; gap: 10px; margin-bottom: 6px; }
  .ename { font-size: 11px; color: var(--ink-muted); }
  .ebar { height: 8px; border-radius: 999px; background: var(--surface-2); position: relative; overflow: hidden; }
  .ebar > i { display: block; height: 100%; border-radius: 999px; }
  .ebar > i.pos { background: var(--defect); } .ebar > i.neg { background: var(--cooperate); }
  .eval { font-size: 11.5px; text-align: right; }
  .enote { font-size: 11.5px; color: var(--ink-muted); margin: 6px 0 0; line-height: 1.5; }
  .enote b { color: var(--ink); }
</style>
