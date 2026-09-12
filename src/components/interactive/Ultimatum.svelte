<script lang="ts">
  import { rejects, rejectionThreshold, PIE } from '@/engines/behavioralGames';

  interface NormPreset { key: string; label: string; alpha: number; }
  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let {
    presets = null, exhibit = '', caption = '', predict = null,
  }: { presets?: NormPreset[] | null; exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let offer = $state(3); // amount offered to the responder
  let alpha = $state(presets ? presets[0].alpha : 0.5);
  let presetKey = $state(presets ? presets[0].key : '');
  let result = $state<'none' | 'accept' | 'reject'>('none');

  const threshold = $derived(rejectionThreshold(alpha));
  const yourKeep = $derived(PIE - offer);

  function propose() { result = rejects(offer, alpha) ? 'reject' : 'accept'; }
  function setPreset(p: NormPreset) { presetKey = p.key; alpha = p.alpha; result = 'none'; }
  function reset() { offer = 3; result = 'none'; if (presets) { alpha = presets[0].alpha; presetKey = presets[0].key; } }
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
    {#if presets}
      <div class="presets">
        {#each presets as p}
          <button class={'pk' + (presetKey === p.key ? ' on' : '')} onclick={() => setPreset(p)}>{p.label}</button>
        {/each}
      </div>
    {/if}

    <p class="setup">You are the proposer splitting ${PIE}. Offer the responder a share; they accept or reject, and rejection leaves both with nothing.</p>

    <label class="slider"><span class="slab">Offer to responder: <b class="mono">${offer}</b> (you keep ${yourKeep})</span><input type="range" min="0" max={PIE} step="0.5" bind:value={offer} aria-label="Offer to responder" /></label>

    <div class="pie" aria-hidden="true">
      <span class="them" style={`width:${(offer / PIE) * 100}%`}>them ${offer}</span>
      <span class="you" style={`width:${(yourKeep / PIE) * 100}%`}>you ${yourKeep}</span>
    </div>

    <div class="play"><button class="choice" onclick={propose}>Make the offer</button><button class="tinybtn" onclick={reset}>Reset</button></div>

    <div class="readout" aria-live="polite">
      {#if result === 'accept'}
        Accepted. You keep ${yourKeep}. Offers at or above the responder's fairness threshold of about ${Math.round(threshold * 10) / 10} go through.
      {:else if result === 'reject'}
        Rejected. Both get nothing. The responder refuses offers below about ${Math.round(threshold * 10) / 10}, walking away from real money to punish an unfair split.
      {:else}
        A purely self-interested responder would accept any positive offer, but real responders reject lowball splits. Make an offer and see.
      {/if}
    </div>
    {#if !presets}<p class="note">Fehr-Schmidt inequity aversion: the responder dislikes being behind, so a stingy offer stings enough to reject. The modal real offer is close to 50/50, not the penny that subgame perfection predicts.</p>{/if}
  {/if}
</div>

<style>
  .presets { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 12px; }
  .pk { border: 1.5px solid var(--border-strong); background: var(--surface); border-radius: 999px; padding: 6px 11px; font-size: 12px; font-weight: 600; cursor: pointer; color: var(--ink-muted); }
  .pk.on { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
  .setup { font-size: 13px; color: var(--ink-muted); margin: 0 0 12px; line-height: 1.5; }
  .slider { display: block; margin: 2px 0 10px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .pie { display: flex; height: 28px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); margin-bottom: 12px; }
  .pie span { display: grid; place-items: center; font-size: 11px; font-weight: 700; color: var(--bg); overflow: hidden; white-space: nowrap; }
  .pie .them { background: var(--ink-muted); } .pie .you { background: var(--accent); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
