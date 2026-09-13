<script lang="ts">
  import { BRINKMANSHIP_THRESHOLD, rivalChoice, rivalHoldPayoff } from '@/engines/brinkmanship';

  let predicted = $state(false);
  let predictionLabel = $state('');
  let risk = $state(0.05);
  const predict = { reveal: 'The cutoff is 2/11, about 18%. At that risk, holding gives 1 - 11q = -1, the same as yielding.' };
  const choice = $derived(rivalChoice(risk));
  const holdPayoff = $derived(rivalHoldPayoff(risk));
  const pct = (value: number) => `${Math.round(value * 100)}%`;

  function onPredict(label: string) {
    predictionLabel = label;
    predicted = true;
  }
</script>

<div class="widget">
  <div class="exhibit-cap"><span>Exhibit 1</span> &nbsp;Static Chicken versus a committed risk</div>
  {#if !predicted}
    <div class="predict">
      <div class="q">The rival gets -1 by yielding, +1 by holding if control survives, and -10 in disaster. Roughly how much committed disaster risk makes yielding optimal?</div>
      <div class="opts">
        <button onclick={() => onPredict('Less than 10%')}>Less than 10%</button>
        <button onclick={() => onPredict('About 18%')}>About 18%</button>
        <button onclick={() => onPredict('More than 50%')}>More than 50%</button>
      </div>
    </div>
  {:else}
    <div class="prediction-memory"><b>Your prediction:</b> {predictionLabel}</div>
    <details class="prediction-answer"><summary>Compare after playing</summary><p>{predict.reveal}</p></details>
    <div class="compare">
      <div><span>Static mixed Nash</span><b class="mono">10%</b><small>Each side independently holds with this probability.</small></div>
      <div><span>Your commitment</span><b class="mono">{pct(risk)}</b><small>You publicly create this risk before the rival chooses.</small></div>
    </div>
    <label class="slider">
      <span>Committed disaster risk: <b class="mono">{pct(risk)}</b></span>
      <input type="range" min="0" max="0.5" step="0.01" bind:value={risk} aria-label="Committed disaster risk" />
    </label>
    <div class="readout" aria-live="polite">
      If the rival holds, its expected payoff is <b class="mono">{holdPayoff.toFixed(2)}</b>, versus <b class="mono">-1.00</b> from yielding.
      At this risk it chooses <b>{choice === 'yield' ? 'yield' : 'hold firm'}</b>.
      {#if choice === 'yield'}The threat works without anyone choosing certain catastrophe.{:else}The committed risk is still too small to deter it.{/if}
    </div>
    <p class="note">The response switches at {pct(BRINKMANSHIP_THRESHOLD)}. This commitment threshold is not the 10% mixing rate from the simultaneous game.</p>
  {/if}
</div>

<style>
  .compare { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .55rem; margin-bottom: .9rem; }
  .compare div { border: 1px solid var(--border); border-radius: .55rem; padding: .65rem; }
  .compare span, .compare small { display: block; color: var(--ink-muted); font-size: .72rem; line-height: 1.4; }
  .compare b { display: block; font-size: 1.25rem; margin: .15rem 0; }
  .slider { display: block; margin-bottom: .75rem; }
  .slider span { display: block; font-size: .82rem; margin-bottom: .35rem; }
  .slider input { width: 100%; accent-color: var(--accent); }
  .note { color: var(--ink-muted); font-size: .75rem; line-height: 1.5; margin: .65rem 0 0; }
</style>
