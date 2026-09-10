<script lang="ts">
  import { levelKGuess, target, winner } from '@/engines/beautyContest';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let guess = $state(33);
  let played = $state(false);
  let botGuesses = $state<number[]>([]);

  // A crowd of bots at explicit reasoning depths, level 0 jittered around 50.
  function makeBots(): number[] {
    const levels = [0, 0, 1, 1, 2, 3];
    return levels.map((k) => (k === 0 ? Math.round(30 + Math.random() * 40) : Math.round(levelKGuess(k))));
  }

  const all = $derived(played ? [guess, ...botGuesses] : []);
  const t = $derived(played ? target(all) : 0);
  const win = $derived(played ? winner(all) : -1);
  const r1 = (x: number) => Math.round(x * 10) / 10;
  const ladder = [50, 33, 22, 15, 10, 0];

  function play() { botGuesses = makeBots(); played = true; }
  function reset() { played = false; botGuesses = []; guess = 33; }
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
      <span class="slab">Your guess: <b class="mono">{guess}</b> <span class="dim">(0 to 100)</span></span>
      <input type="range" min="0" max="100" step="1" bind:value={guess} aria-label="Your guess" />
    </label>

    <div class="play"><button class="choice" onclick={play}>{played ? 'Play again' : 'Play against the crowd'}</button>{#if played}<button class="tinybtn" onclick={reset}>Reset</button>{/if}</div>

    {#if played}
      <div class="readout" aria-live="polite">
        The crowd guessed {botGuesses.join(', ')}, and you guessed {guess}. The average is <b class="mono">{r1(all.reduce((a, b) => a + b, 0) / all.length)}</b>, so the winning target (two-thirds of it) is <b class="mono">{r1(t)}</b>.
        {win === 0 ? ' You won.' : ' A bot closer to the target won.'}
        {guess <= 3 ? ' Guessing near 0 only wins if everyone reasons infinitely far, which real crowds do not.' : ''}
      </div>
    {:else}
      <div class="readout">Whoever lands closest to two-thirds of the average wins. What will everyone else do?</div>
    {/if}

    <div class="ladder">
      <div class="llab">The reasoning ladder</div>
      <div class="lrow">
        {#each ladder as v, i}
          <span class="lstep mono">{v}</span>{#if i < ladder.length - 1}<span class="larr">&rarr;</span>{/if}
        {/each}
      </div>
      <p class="lnote">Random play averages 50, so one step down is 33, then 22, toward 0 in the limit. Real winners usually sit around 20 to 33.</p>
    </div>
  {/if}
</div>

<style>
  .slider { display: block; margin: 2px 0 10px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); } .slab .dim { opacity: .7; }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .ladder { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border); }
  .llab { font-size: 10.5px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 10px; }
  .lrow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .lstep { display: inline-grid; place-items: center; min-width: 30px; height: 28px; padding: 0 6px; border-radius: 7px; background: var(--accent-soft); color: var(--accent); font-weight: 700; font-size: 12px; }
  .larr { color: var(--ink-muted); }
  .lnote { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
