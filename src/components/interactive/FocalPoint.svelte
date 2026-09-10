<script lang="ts">
  interface Opt { key: string; label: string; freq: number; } // freq = share of real people who pick it
  let {
    prompt,
    options,
    exhibit = '',
    caption = '',
    source = '',
  }: { prompt: string; options: Opt[]; exhibit?: string; caption?: string; source?: string } = $props();

  let chosen = $state<string | null>(null);
  let botKey = $state<string | null>(null);
  let revealed = $state(false);

  function sampleBot(): string {
    const r = Math.random();
    let acc = 0;
    for (const o of options) { acc += o.freq; if (r <= acc) return o.key; }
    return options[options.length - 1].key;
  }
  function pick(key: string) {
    if (chosen) return;
    chosen = key;
    botKey = sampleBot();
    revealed = true;
  }
  function reset() { chosen = null; botKey = null; revealed = false; }

  const matched = $derived(chosen !== null && chosen === botKey);
  const pct = (f: number) => Math.round(f * 100) + '%';
</script>

<div class="widget">
  {#if exhibit || caption}
    <div class="exhibit-cap"><span>{exhibit}</span> &nbsp;{caption}</div>
  {/if}

  <div class="fp-q">{prompt}</div>
  <div class="fp-opts">
    {#each options as o}
      <button
        class={'fp-opt' + (chosen === o.key ? ' picked' : '') + (revealed && o.key === botKey ? ' bot' : '')}
        disabled={chosen !== null}
        onclick={() => pick(o.key)}
      >{o.label}</button>
    {/each}
  </div>

  {#if revealed}
    <div class="readout" aria-live="polite">
      You picked <b>{options.find((o) => o.key === chosen)?.label}</b>; your partner picked
      <b>{options.find((o) => o.key === botKey)?.label}</b>.
      {#if matched}You match, so you both score. That is the whole game.{:else}No match, so you both score nothing, even though every option paid the same.{/if}
    </div>
    <div class="hist">
      {#each options as o}
        <div class="hrow">
          <span class="hname">{o.label}</span>
          <span class="hbar"><i style={`width:${o.freq * 100}%`} class={o.key === chosen ? 'me' : ''}></i></span>
          <span class="hval mono">{pct(o.freq)}</span>
        </div>
      {/each}
      <p class="hnote">Bars are how often real people picked each option{source ? `, from ${source}` : ''}. The crowd clusters, which is what makes a focal point work.</p>
    </div>
    <div class="play"><button class="tinybtn" onclick={reset}>Play again</button></div>
  {/if}
</div>

<style>
  .fp-q { font-weight: 600; font-size: 15.5px; margin-bottom: 13px; }
  .fp-opts { display: flex; flex-wrap: wrap; gap: 9px; }
  .fp-opt { border: 1.5px solid var(--border-strong); background: var(--surface); border-radius: 9px; padding: 11px 14px; font-weight: 600; font-size: 13.5px; cursor: pointer; color: var(--ink); }
  .fp-opt:hover:not(:disabled) { border-color: var(--accent); }
  .fp-opt.picked { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
  .fp-opt.bot { box-shadow: 0 0 0 2px var(--gold) inset; }
  .fp-opt:disabled { cursor: default; }
  .hist { margin-top: 14px; }
  .hrow { display: grid; grid-template-columns: 96px 1fr 42px; align-items: center; gap: 10px; margin-bottom: 8px; }
  .hname { font-size: 12px; font-weight: 600; color: var(--ink-muted); }
  .hbar { height: 8px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
  .hbar > i { display: block; height: 100%; border-radius: 999px; background: var(--ink-muted); }
  .hbar > i.me { background: var(--accent); }
  .hval { font-size: 12px; text-align: right; }
  .hnote { font-size: 11.5px; color: var(--ink-muted); margin: 4px 0 0; line-height: 1.5; }
</style>
