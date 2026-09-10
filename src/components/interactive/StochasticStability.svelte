<script lang="ts">
  import { basins, bestResponse, stochasticallyStable } from '@/engines/stochasticStability';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const N = 20; // population size
  let predicted = $state(predict === null);
  let mutation = $state(0.1);
  let stagShare = $state(0.5);
  let history = $state<number[]>([]);
  let rounds = $state(0);

  const b = basins();
  const pct = (x: number) => Math.round(x * 100) + '%';

  function stepMany(k: number) {
    let s = Math.round(stagShare * N);
    const hist = [...history];
    for (let t = 0; t < k; t++) {
      // Each agent best-responds to the current Stag share, plus rare mutation flips.
      const q = s / N;
      const br = bestResponse(q); // whole population tends toward the best response
      let target = br === 'stag' ? N : 0;
      // Move part way, then apply mutations.
      s = Math.round(s + (target - s) * 0.5);
      for (let i = 0; i < N; i++) if (Math.random() < mutation / 5) s += (Math.random() < 0.5 ? 1 : -1);
      s = Math.max(0, Math.min(N, s));
      hist.push(s / N);
    }
    stagShare = s / N; history = hist.slice(-60); rounds += k;
  }
  function reset() { mutation = 0.1; stagShare = 0.5; history = []; rounds = 0; }
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
    <div class="basinbar" aria-hidden="true">
      <span class="hare" style={`width:${b.hare * 100}%`}>Hare basin {pct(b.hare)}</span>
      <span class="stag" style={`width:${b.stag * 100}%`}>Stag {pct(b.stag)}</span>
    </div>
    <p class="barnote">Stag is a best response only if you expect at least {pct(0.75)} of others to hunt Stag, so its basin is small.</p>

    <label class="slider"><span class="slab">Mutation rate: <b class="mono">{Math.round(mutation * 100)}%</b></span><input type="range" min="0.02" max="0.4" step="0.01" bind:value={mutation} aria-label="Mutation rate" /></label>

    {#if history.length > 0}
      <div class="tape">
        {#each history as h}
          <span class="bar" style={`height:${h * 100}%`} class:stagcol={h >= 0.75}></span>
        {/each}
      </div>
      <p class="tapenote">Stag share over {rounds} rounds. It keeps collapsing back toward all-Hare.</p>
    {/if}

    <div class="readout" aria-live="polite">
      The population spends almost all its time at all-Hare, the risk-dominant convention, even though all-Stag pays more (4 versus 3). Lowering the mutation rate does not change the winner, only how long the population lingers before drifting back.
    </div>

    <div class="play"><button class="choice" onclick={() => stepMany(20)}>Run 20 rounds</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .basinbar { display: flex; height: 26px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
  .basinbar span { display: grid; place-items: center; font-size: 10.5px; font-weight: 700; color: var(--bg); overflow: hidden; white-space: nowrap; }
  .basinbar .hare { background: var(--ink-muted); }
  .basinbar .stag { background: var(--accent); }
  .barnote { font-size: 11.5px; color: var(--ink-muted); margin: 6px 0 12px; }
  .slider { display: block; margin: 2px 0 10px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 6px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .tape { display: flex; align-items: flex-end; gap: 2px; height: 60px; padding: 4px 0; border-bottom: 1px solid var(--border); }
  .bar { flex: 1; min-height: 1px; background: var(--ink-muted); border-radius: 2px 2px 0 0; }
  .bar.stagcol { background: var(--accent); }
  .tapenote { font-size: 11.5px; color: var(--ink-muted); margin: 4px 0 0; }
</style>
