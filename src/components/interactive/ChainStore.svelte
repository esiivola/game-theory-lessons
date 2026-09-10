<script lang="ts">
  import { updatePosterior, entryValue, ENTRANT, type Response } from '@/engines/reputation';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const TOWNS = 6;
  const MU0 = 0.2;        // prior that the incumbent is tough
  const FIGHT_PROB = 0.85; // a normal incumbent fights this often while defending its reputation

  let predicted = $state(predict === null);
  let tough = $state(Math.random() < MU0); // hidden type, fixed for the run
  let revealed = $state(false);            // has the normal type been caught accommodating?
  let mu = $state(MU0);                    // entrant's posterior that the incumbent is tough
  let town = $state(1);
  let score = $state(0);
  let log = $state<{ town: number; action: string; response?: Response; pay: number }[]>([]);
  let done = $state(false);

  const isLast = $derived(town === TOWNS);
  const normalFightProb = $derived(isLast ? 0 : FIGHT_PROB); // no future to protect in the last town
  const pct = (x: number) => Math.round(x * 100) + '%';

  function respond(): Response {
    if (tough) return 'fight';
    if (revealed || isLast) return 'accommodate';
    return Math.random() < FIGHT_PROB ? 'fight' : 'accommodate';
  }
  function advance() { if (town >= TOWNS) { done = true; } else { town += 1; } }

  function enter() {
    const r = respond();
    if (r === 'accommodate' && !tough) revealed = true;
    const pay = r === 'fight' ? ENTRANT.fight : ENTRANT.accommodate;
    score += pay;
    mu = updatePosterior(mu, r, normalFightProb);
    log = [...log, { town, action: 'entered', response: r, pay }];
    advance();
  }
  function stayOut() {
    score += ENTRANT.out;
    log = [...log, { town, action: 'stayed out', pay: ENTRANT.out }];
    advance();
  }
  function reset() {
    tough = Math.random() < MU0; revealed = false; mu = MU0; town = 1; score = 0; log = []; done = false;
  }
  function onPredict() { predicted = true; }

  const ev = $derived(entryValue(mu, normalFightProb));
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
    <div class="rep">
      <span class="rlab">Chance the incumbent is tough</span>
      <span class="rbar"><i style={`width:${mu * 100}%`}></i></span>
      <span class="rval mono">{pct(mu)}</span>
    </div>

    <div class="tapewrap">
      {#each Array(TOWNS) as _, i}
        {@const rec = log.find((l) => l.town === i + 1)}
        <div class={'town' + (i + 1 === town && !done ? ' now' : '')}>
          <span class="tn mono">{i + 1}</span>
          <span class={'mk ' + (rec ? (rec.response ?? 'out') : 'pending')}>
            {#if rec}{rec.response === 'fight' ? 'F' : rec.response === 'accommodate' ? 'A' : '-'}{:else}&middot;{/if}
          </span>
        </div>
      {/each}
    </div>
    <div class="tapekey"><span>F fought</span><span>A accommodated</span><span>- stayed out</span></div>

    {#if !done}
      <div class="readout" aria-live="polite">
        Town {town} of {TOWNS}. You are the entrant. {isLast ? 'This is the last town: there is no future reputation for the incumbent to protect.' : 'The incumbent still has later towns to deter.'} Entering pays about <b class="mono">{Math.round(ev * 100) / 100}</b> on average against 0 for staying out.
      </div>
      <div class="play">
        <button class="choice def" onclick={enter}>Enter town {town}</button>
        <button class="choice" onclick={stayOut}>Stay out</button>
      </div>
    {:else}
      <div class="readout" aria-live="polite">
        Done. The incumbent was <b>{tough ? 'tough (it would always fight)' : 'normal (an ordinary firm bluffing to protect its reputation)'}</b>. Entering early meant walking into fights; the safe entry was the final town, once deterrence no longer paid the incumbent.
      </div>
      <div class="play"><button class="choice" onclick={reset}>New incumbent</button></div>
    {/if}

    <div class="scoreline">
      <div class="score you"><span class="v mono">{score > 0 ? '+' + score : score}</span><span class="l">Your total</span></div>
      <button class="tinybtn" onclick={reset}>Reset</button>
    </div>
  {/if}
</div>

<style>
  .rep { display: grid; grid-template-columns: 1fr auto; grid-template-areas: "lab val" "bar bar"; gap: 4px 10px; margin-bottom: 14px; }
  .rlab { grid-area: lab; font-size: 11.5px; font-weight: 600; color: var(--ink-muted); }
  .rval { grid-area: val; font-size: 12px; }
  .rbar { grid-area: bar; height: 9px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
  .rbar > i { display: block; height: 100%; border-radius: 999px; background: var(--defect); transition: width .3s cubic-bezier(.2,.8,.2,1); }
  .tapewrap { display: flex; gap: 6px; flex-wrap: wrap; }
  .town { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .town.now .mk { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
  .tn { font-size: 9px; color: var(--ink-muted); }
  .mk { width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center; border: 1.5px solid var(--border-strong); font-family: var(--font-mono); font-weight: 700; font-size: 13px; color: var(--ink-muted); background: var(--surface); }
  .mk.fight { background: var(--defect-soft); color: var(--defect); border-color: var(--defect); }
  .mk.accommodate { background: var(--cooperate-soft); color: var(--cooperate); border-color: var(--cooperate); }
  .mk.out { color: var(--ink-muted); }
  .tapekey { display: flex; gap: 14px; font-size: 10.5px; font-weight: 600; color: var(--ink-muted); margin: 8px 0 2px; }
</style>
