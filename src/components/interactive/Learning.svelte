<script lang="ts">
  import { mismatcherBestResponse } from '@/engines/learning';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  // You are the matcher; the bot is a fictitious-play mismatcher tracking your history.
  let yourH = $state(1), yourT = $state(1); // bot's belief counts about you (start at 1 each)
  let wins = $state(0), losses = $state(0), rounds = $state(0);
  let last = $state('');

  const botHeadBelief = $derived(yourH / (yourH + yourT));

  function play(me: 'H' | 'T') {
    const bot = mismatcherBestResponse(botHeadBelief); // bot flees your predicted move
    // Matching Pennies: you (matcher) win if faces match.
    const youWin = me === bot;
    if (youWin) wins++; else losses++;
    rounds++;
    if (me === 'H') yourH++; else yourT++;
    last = `You played ${me}, the bot played ${bot}. ${youWin ? 'Match, you win.' : 'Mismatch, bot wins.'}`;
  }
  function reset() { yourH = 1; yourT = 1; wins = 0; losses = 0; rounds = 0; last = ''; }
  function onPredict() { predicted = true; }
  const pct = (x: number) => Math.round(x * 100) + '%';
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
    <p class="setup">Matching Pennies: you win by matching the bot. The bot learns by fictitious play, tracking how often you play Heads and fleeing your likely move.</p>

    <div class="play"><button class="choice" onclick={() => play('H')}>Play Heads</button><button class="choice" onclick={() => play('T')}>Play Tails</button></div>

    <div class="readout" aria-live="polite">{last || 'Take a shot. The bot best-responds to your track record.'}</div>

    <div class="belief">
      <span class="blab">Bot thinks you play Heads:</span>
      <span class="bbar"><i style={`width:${botHeadBelief * 100}%`}></i><span class="mid"></span></span>
      <span class="bval mono">{pct(botHeadBelief)}</span>
    </div>
    <p class="bnote">If you lean either way, the bot reads it and beats you. Only by mixing near 50/50 do you hold even, which is the mixed equilibrium the bot's beliefs converge to.</p>

    <div class="scoreline">
      <div class="score you"><span class="v mono">{wins}</span><span class="l">Won</span></div>
      <div class="score"><span class="v mono">{losses}</span><span class="l">Lost</span></div>
      <div class="score"><span class="v mono">{rounds}</span><span class="l">Rounds</span></div>
      <button class="tinybtn" onclick={reset}>Reset</button>
    </div>
  {/if}
</div>

<style>
  .setup { font-size: 13px; color: var(--ink-muted); margin: 0 0 12px; line-height: 1.5; }
  .belief { display: grid; grid-template-columns: 1fr auto; grid-template-areas: "lab val" "bar bar"; gap: 4px 10px; margin-top: 14px; }
  .blab { grid-area: lab; font-size: 11.5px; font-weight: 600; color: var(--ink-muted); }
  .bval { grid-area: val; font-size: 12px; }
  .bbar { grid-area: bar; position: relative; height: 9px; border-radius: 999px; background: var(--surface-2); overflow: visible; }
  .bbar > i { display: block; height: 100%; border-radius: 999px; background: var(--accent); transition: width .2s; }
  .bbar .mid { position: absolute; top: -3px; bottom: -3px; left: 50%; width: 0; border-left: 1.5px dashed var(--gold); }
  .bnote { font-size: 11.5px; color: var(--ink-muted); margin: 6px 0 0; line-height: 1.5; }
</style>
