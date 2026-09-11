<script lang="ts">
  import { coopFraction, avgPayoff, simulate, type Round } from '@/engines/monitoring';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let noise = $state(0.1);   // chance of a bad signal while cooperating
  let punish = $state(4);    // war length; the max value means grim (forever)
  let run = $state<Round[]>([]);

  const GRIM = 21; // slider max maps to "forever"
  const T = $derived(punish >= GRIM ? Infinity : punish);
  const grim = $derived(!isFinite(T));
  const ROUNDS = 40;

  const frac = $derived(coopFraction(noise, T));
  const pay = $derived(avgPayoff(noise, T, 3, 1));
  const pct = (x: number) => Math.round(x * 100) + '%';
  const r2 = (x: number) => Math.round(x * 100) / 100;

  function go() { run = simulate(noise, T, ROUNDS, Math.random); }
  function reset() { noise = 0.1; punish = 4; run = []; }
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
    <label class="slider">
      <span class="slab">Monitoring noise (bad signal despite cooperation): <b class="mono">{pct(noise)}</b></span>
      <input type="range" min="0" max="0.4" step="0.01" bind:value={noise} aria-label="Monitoring noise" />
    </label>
    <label class="slider">
      <span class="slab">Punishment length: <b class="mono">{grim ? 'forever (grim)' : punish + ' rounds'}</b></span>
      <input type="range" min="1" max={GRIM} step="1" bind:value={punish} aria-label="Punishment length" />
    </label>

    <div class="play"><button class="choice" onclick={go}>Run {ROUNDS} rounds</button><button class="tinybtn" onclick={reset}>Reset</button></div>

    {#if run.length > 0}
      <div class="tape" aria-hidden="false">
        {#each run as r}
          <span
            class={'cell ' + r.phase}
            title={r.phase === 'war' ? 'price war round' : r.signal === 'bad' ? 'bad signal: a war starts, though nobody cheated' : 'good signal: cooperation continues'}
          ></span>
        {/each}
      </div>
      <div class="tapekey"><span><i class="coop"></i>cooperating</span><span><i class="war"></i>price war</span></div>
    {/if}

    <div class="readout" aria-live="polite">
      {#if grim}
        Under grim trigger, the first bad signal, which noise makes inevitable, ends cooperation for good. Both meant to cooperate; the noise alone destroyed the relationship.
      {:else}
        Expected time cooperating: <b class="mono">{pct(frac)}</b>, for an average payoff of <b class="mono">{r2(pay)}</b> per round. Wars still happen, triggered by noise rather than by real cheating, but the relationship recovers after {punish} rounds.
      {/if}
    </div>

    {#if !grim}
      <p class="note">Raise the noise and wars come more often; shorten the punishment and cooperation recovers faster. Forgiveness, not permanent punishment, is what keeps value alive under noise.</p>
    {/if}
  {/if}
</div>

<style>
  .slider { display: block; margin: 2px 0 8px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .tape { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 14px; }
  .cell { width: 13px; height: 13px; border-radius: 3px; }
  .cell.coop { background: var(--cooperate); }
  .cell.war { background: var(--defect); }
  .tapekey { display: flex; gap: 16px; font-size: 11px; font-weight: 600; color: var(--ink-muted); margin-top: 8px; }
  .tapekey span { display: inline-flex; align-items: center; gap: 6px; }
  .tapekey i { width: 12px; height: 12px; border-radius: 3px; }
  .tapekey i.coop { background: var(--cooperate); }
  .tapekey i.war { background: var(--defect); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 10px 0 0; line-height: 1.5; }
</style>
