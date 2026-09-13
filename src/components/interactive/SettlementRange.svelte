<script lang="ts">
  import { settlementRange } from '@/engines/settlement';

  let plaintiffBelief = $state(0.6);
  let defendantBelief = $state(0.6);
  const range = $derived(settlementRange(100, plaintiffBelief, defendantBelief, 10, 10));
  const pct = (value: number) => `${Math.round(value * 100)}%`;
  const money = (value: number) => `${Math.round(value)}k`;
</script>

<div class="widget">
  <div class="exhibit-cap"><span>Exhibit 2</span> &nbsp;The settlement range</div>
  <p class="note">The court award is 100k and each side would spend 10k at trial. Set each side's belief that the plaintiff wins.</p>
  <label class="slider"><span>Plaintiff's belief: <b class="mono">{pct(plaintiffBelief)}</b></span><input type="range" min="0" max="1" step="0.01" bind:value={plaintiffBelief} aria-label="Plaintiff belief that plaintiff wins" /></label>
  <label class="slider"><span>Defendant's belief: <b class="mono">{pct(defendantBelief)}</b></span><input type="range" min="0" max="1" step="0.01" bind:value={defendantBelief} aria-label="Defendant belief that plaintiff wins" /></label>
  <div class="rows">
    <div><span>Plaintiff accepts from</span><b class="mono">{money(range.plaintiffMinimum)}</b></div>
    <div><span>Defendant pays up to</span><b class="mono">{money(range.defendantMaximum)}</b></div>
  </div>
  <div class="readout" aria-live="polite">
    {#if range.settles}
      The ranges overlap by <b class="mono">{money(range.surplus)}</b>. Any payment from {money(range.plaintiffMinimum)} to {money(range.defendantMaximum)} beats trial for both.
    {:else}
      The ranges miss by <b class="mono">{money(-range.surplus)}</b>. The plaintiff demands more than the defendant will pay, so this simple model predicts trial.
    {/if}
  </div>
  <div class="play"><button class="tinybtn" onclick={() => { plaintiffBelief = 0.9; defendantBelief = 0.3; }}>Try divergent beliefs</button><button class="tinybtn" onclick={() => { plaintiffBelief = 0.6; defendantBelief = 0.6; }}>Reset</button></div>
</div>

<style>
  .note { margin: 0 0 .75rem; color: var(--ink-muted); font-size: .78rem; line-height: 1.5; }
  .slider { display: block; margin-bottom: .65rem; }
  .slider span { display: block; font-size: .82rem; margin-bottom: .3rem; }
  .slider input { width: 100%; accent-color: var(--accent); }
  .rows { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .55rem; margin: .75rem 0; }
  .rows div { border: 1px solid var(--border); border-radius: .55rem; padding: .65rem; }
  .rows span, .rows b { display: block; }
  .rows span { color: var(--ink-muted); font-size: .72rem; }
  .rows b { font-size: 1.1rem; margin-top: .2rem; }
</style>
