<script lang="ts">
  import { posteriorGuilty, optimalFalsePositive, convictionRate, PRIOR, THRESH } from '@/engines/persuasion';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let x = $state(3 / 7); // rate at which an innocent defendant is flagged "guilty"

  const post = $derived(posteriorGuilty(x));
  const rate = $derived(convictionRate(x));
  const convicts = $derived(post >= THRESH);
  const xStar = optimalFalsePositive();
  const pct = (v: number) => Math.round(v * 100) + '%';

  function onPredict() { predicted = true; }
  function reset() { x = 3 / 7; }
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
    <div class="belief-bar" aria-hidden="true">
      <span class="fill" style={`width:${post * 100}%`} class:convict={convicts}></span>
      <span class="thresh" style={`left:${THRESH * 100}%`}></span>
    </div>
    <div class="blabel"><span>innocent</span><span class="mid">convict threshold {pct(THRESH)}</span><span>guilty</span></div>

    <label class="slider">
      <span class="slab">How often the signal flags an innocent defendant as "guilty": <b class="mono">{pct(x)}</b></span>
      <input type="range" min="0" max="1" step="0.01" bind:value={x} aria-label="Innocent-flag rate" />
    </label>

    <div class="rows">
      <div class="mrow"><span class="mname">Posterior after "guilty"</span><span class="mval mono">{pct(post)}</span></div>
      <div class="mrow"><span class="mname">Judge convicts on it?</span><span class="mval mono">{convicts ? 'yes' : 'no'}</span></div>
      <div class="mrow"><span class="mname">Conviction rate</span><span class="mval mono">{pct(rate)}</span></div>
    </div>

    <div class="readout" aria-live="polite">
      {#if !convicts}
        Flag innocents this often and a "guilty" report no longer clears {pct(THRESH)}, so the judge acquits everyone. Conviction rate falls to 0.
      {:else if Math.abs(x - xStar) < 0.02}
        This is the optimum: the signal pushes the posterior to exactly {pct(THRESH)}, the least that still convicts, so it convicts as often as possible: {pct(rate)}, though only {pct(PRIOR)} are truly guilty.
      {:else}
        The report is more convincing than it needs to be, so it convicts less often than it could. Raise the flag rate toward {pct(xStar)} to convict more, up to the point the posterior just reaches {pct(THRESH)}.
      {/if}
    </div>
    <p class="note">Compare the extremes: full disclosure (flag rate 0) convicts only the {pct(PRIOR)} truly guilty; total secrecy (always "guilty") convinces no one, so 0. Honest partial disclosure beats both.</p>

    <div class="play"><button class="tinybtn" onclick={() => (x = xStar)}>Optimal signal</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .belief-bar { position: relative; height: 14px; border-radius: 999px; background: var(--surface-2); overflow: visible; }
  .belief-bar .fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 999px; background: var(--ink-muted); transition: width .2s; }
  .belief-bar .fill.convict { background: var(--defect); }
  .belief-bar .thresh { position: absolute; top: -3px; bottom: -3px; width: 0; border-left: 2px dashed var(--gold); }
  .blabel { display: flex; justify-content: space-between; font-size: 10px; color: var(--ink-muted); margin-top: 5px; }
  .blabel .mid { color: var(--gold); font-weight: 600; }
  .slider { display: block; margin: 14px 0 12px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .rows { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
  .mrow { display: flex; justify-content: space-between; align-items: baseline; }
  .mname { font-size: 12.5px; color: var(--ink-muted); font-weight: 600; }
  .mval { font-size: 15px; color: var(--ink); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
