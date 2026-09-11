<script lang="ts">
  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  // The same unfair $8/$2 offer arrives either chosen by a person or drawn by a wheel.
  // Rejection rates are far higher when the stingy split was intended.
  let predicted = $state(predict === null);
  let source = $state<'person' | 'wheel'>('person');

  // Illustrative rejection rates for a lowball offer, from the reciprocity literature (Blount).
  const rejectRate = $derived(source === 'person' ? 0.65 : 0.2);
  const pct = (x: number) => Math.round(x * 100) + '%';

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
    <p class="setup">You are offered a lopsided split: $2 for you, $8 for them. The outcome is identical either way; only its cause differs.</p>

    <div class="seg" role="group" aria-label="Source of the offer">
      <button class={source === 'person' ? 'on' : ''} onclick={() => (source = 'person')}>Chosen by the other player</button>
      <button class={source === 'wheel' ? 'on' : ''} onclick={() => (source = 'wheel')}>Drawn by a random wheel</button>
    </div>

    <div class="meter">
      <span class="mlab">Rejection rate</span>
      <span class="mbar"><i style={`width:${rejectRate * 100}%`}></i></span>
      <span class="mval mono">{pct(rejectRate)}</span>
    </div>

    <div class="readout" aria-live="polite">
      {#if source === 'person'}
        When a person deliberately chose the stingy split, people reject it far more often, paying to punish the unkind intent, not just the unequal outcome.
      {:else}
        When a blind wheel produced the same $2 offer, rejections drop sharply: there is no one to punish, so the unequal outcome is largely accepted.
      {/if}
    </div>
    <p class="note">Identical outcomes, very different responses. Intentions matter: reciprocity weighs how the other player behaved, not only the final payoffs. Outcome-based inequity aversion alone cannot explain the gap. The two rates are illustrative, sized to the gap Blount (1995) measured between deliberate and randomly generated offers, not exact published figures.</p>
  {/if}
</div>

<style>
  .setup { font-size: 13px; color: var(--ink-muted); margin: 0 0 12px; line-height: 1.5; }
  .seg { display: flex; border: 1px solid var(--border-strong); border-radius: 9px; overflow: hidden; margin-bottom: 14px; }
  .seg button { flex: 1; border: 0; background: var(--surface); color: var(--ink-muted); font-weight: 600; font-size: 12px; padding: 9px 6px; cursor: pointer; }
  .seg button + button { border-left: 1px solid var(--border); }
  .seg button.on { background: var(--accent-soft); color: var(--accent); }
  .meter { display: grid; grid-template-columns: 1fr auto; grid-template-areas: "lab val" "bar bar"; gap: 4px 10px; margin-bottom: 12px; }
  .mlab { grid-area: lab; font-size: 11.5px; font-weight: 600; color: var(--ink-muted); }
  .mval { grid-area: val; font-size: 13px; }
  .mbar { grid-area: bar; height: 12px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
  .mbar > i { display: block; height: 100%; border-radius: 999px; background: var(--defect); transition: width .2s; }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
