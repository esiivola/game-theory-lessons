<script lang="ts">
  import { botMove, score, beats, MOVE_NAMES, type Move } from '@/engines/rps';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let counts = $state<[number, number, number]>([0, 0, 0]);
  let wins = $state(0);
  let losses = $state(0);
  let ties = $state(0);
  let last = $state('');

  const total = $derived(counts[0] + counts[1] + counts[2]);
  const freq = (i: number) => (total === 0 ? 0 : counts[i] / total);
  const pctText = (i: number) => (total === 0 ? '0%' : Math.round(freq(i) * 100) + '%');
  const net = $derived(wins - losses);

  function play(m: Move) {
    // The bot counters your most-played move so far, then you commit this move.
    const bot = botMove(counts, Math.random);
    const s = score(m, bot);
    counts[m] += 1;
    if (s === 1) wins += 1;
    else if (s === -1) losses += 1;
    else ties += 1;
    last = `You played ${MOVE_NAMES[m]}, the bot played ${MOVE_NAMES[bot]}. ` +
      (s === 1 ? 'You win the round.' : s === -1 ? 'You lose the round.' : 'A tie.');
  }
  function reset() {
    counts = [0, 0, 0]; wins = 0; losses = 0; ties = 0;
    last = 'Reset. The bot reads your history, so keep it even.';
  }
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
    <div class="play">
      {#each MOVE_NAMES as name, i}
        <button class="choice" onclick={() => play(i as Move)}>{name}</button>
      {/each}
    </div>

    <div class="readout" aria-live="polite">
      {last || 'Pick a move. The bot shifts toward whatever you overplay.'}
    </div>

    <div class="freqs" aria-hidden="false">
      {#each MOVE_NAMES as name, i}
        <div class="frow">
          <span class="fname">{name}</span>
          <span class="fbar"><i style={`width:${freq(i) * 100}%`}></i><span class="third"></span></span>
          <span class="fval mono">{pctText(i)}</span>
        </div>
      {/each}
      <p class="fnote">The dotted mark is 1/3. Stay near it on all three and the bot has nothing to punish.</p>
    </div>

    <div class="scoreline">
      <div class="score you"><span class="v mono">{wins}</span><span class="l">Won</span></div>
      <div class="score"><span class="v mono">{ties}</span><span class="l">Tied</span></div>
      <div class="score"><span class="v mono">{losses}</span><span class="l">Lost</span></div>
      <div class="score"><span class="v mono">{net > 0 ? '+' + net : net}</span><span class="l">Net</span></div>
      <button class="tinybtn" onclick={reset}>Reset</button>
    </div>
  {/if}
</div>

<style>
  .freqs { margin-top: 14px; }
  .frow { display: grid; grid-template-columns: 62px 1fr 42px; align-items: center; gap: 10px; margin-bottom: 8px; }
  .fname { font-size: 12px; font-weight: 600; color: var(--ink-muted); }
  .fbar { position: relative; height: 8px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
  .fbar > i { display: block; height: 100%; border-radius: 999px; background: var(--accent); transition: width .3s cubic-bezier(.2,.8,.2,1); }
  .fbar .third { position: absolute; top: -2px; bottom: -2px; left: 33.33%; width: 0; border-left: 1.5px dashed var(--ink-muted); opacity: .7; }
  .fval { font-size: 12px; text-align: right; color: var(--ink); }
  .fnote { font-size: 11.5px; color: var(--ink-muted); margin: 4px 0 0; line-height: 1.5; }
  .scoreline .score { min-width: 0; }
</style>
