<script lang="ts">
  import { essHawkFraction, replicatorStepHawk } from '@/engines/evolution';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let V = $state(2);
  let C = $state(6);
  let p = $state(0.8); // current Hawk fraction

  const ess = $derived(essHawkFraction(V, C));
  const pct = (x: number) => Math.round(x * 100) + '%';

  function evolve() {
    let x = p;
    for (let i = 0; i < 400; i++) x = replicatorStepHawk(x, V, C, 0.05);
    p = x;
  }
  function reset() { V = 2; C = 6; p = 0.8; }
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
    <div class="popbar" aria-hidden="true">
      <span class="hawk" style={`width:${p * 100}%`}>Hawks</span>
      <span class="dove" style={`width:${(1 - p) * 100}%`}>Doves</span>
      <span class="ess" style={`left:${ess * 100}%`}></span>
    </div>
    <p class="barnote">Hawk share <b class="mono">{pct(p)}</b>. The tick marks the ESS, <b class="mono">{pct(ess)}</b>.</p>

    <label class="slider"><span class="slab">Resource value V: <b class="mono">{V}</b></span><input type="range" min="1" max="8" step="1" bind:value={V} aria-label="Resource value" /></label>
    <label class="slider"><span class="slab">Injury cost C: <b class="mono">{C}</b></span><input type="range" min="1" max="10" step="1" bind:value={C} aria-label="Injury cost" /></label>
    <label class="slider"><span class="slab">Starting Hawk fraction: <b class="mono">{pct(p)}</b></span><input type="range" min="0" max="1" step="0.01" bind:value={p} aria-label="Starting Hawk fraction" /></label>

    <div class="readout" aria-live="polite">
      {#if C > V}
        With cost above value, neither pure type takes over: the population settles at Hawks = V/C = <b class="mono">{pct(ess)}</b>. Run the dynamics from any start and it returns there.
      {:else}
        Value exceeds cost, so fighting always pays: Hawks take over entirely (ESS = 100%).
      {/if}
    </div>

    <div class="play"><button class="choice" onclick={evolve}>Let it evolve</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .popbar { position: relative; display: flex; height: 30px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
  .popbar span.hawk, .popbar span.dove { display: grid; place-items: center; font-size: 11px; font-weight: 700; color: var(--bg); overflow: hidden; white-space: nowrap; transition: width .1s; }
  .popbar .hawk { background: var(--defect); }
  .popbar .dove { background: var(--cooperate); }
  .popbar .ess { position: absolute; top: -3px; bottom: -3px; width: 0; border-left: 2px dashed var(--gold); }
  .barnote { font-size: 11.5px; color: var(--ink-muted); margin: 6px 0 12px; }
  .barnote b { color: var(--ink); }
  .slider { display: block; margin: 2px 0 8px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 6px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
</style>
