<script lang="ts">
  import { SCORE, equilibriumKickLeft, equilibriumValue, keeperDive, predictLeft, type Side } from '@/engines/penalty';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let history = $state<Side[]>([]);
  let goals = $state(0);
  let shots = $state(0);
  let last = $state('');
  let lastDive = $state<Side | null>(null);

  const eqLeft = equilibriumKickLeft();
  const eqValue = equilibriumValue();

  const leftCount = $derived(history.filter((s) => s === 0).length);
  const leftFreq = $derived(shots === 0 ? 0 : leftCount / shots);
  const rate = $derived(shots === 0 ? 0 : goals / shots);
  const read = $derived(predictLeft(history)); // keeper's current belief that you go Left
  const pctText = (x: number) => Math.round(x * 100) + '%';

  function shoot(kick: Side) {
    const dive = keeperDive(predictLeft(history)); // keeper reads the history BEFORE this shot
    const p = SCORE[kick][dive];
    const scored = Math.random() < p;
    shots += 1;
    if (scored) goals += 1;
    lastDive = dive;
    last = `You shot ${kick === 0 ? 'Left' : 'Right'}, the keeper dove ${dive === 0 ? 'Left' : 'Right'}. ` +
      (scored ? 'Goal.' : 'Saved.');
    history = [...history, kick];
  }
  function reset() { history = []; goals = 0; shots = 0; last = ''; lastDive = null; }
  function onPredict() { predicted = true; }

  // Exploitability: how far your realized rate sits below what an unreadable kicker would earn.
  const gap = $derived(Math.max(0, eqValue - rate));
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
      <button class="choice coop" onclick={() => shoot(0)}>Shoot Left</button>
      <button class="choice def" onclick={() => shoot(1)}>Shoot Right</button>
    </div>

    <div class="readout" aria-live="polite">
      {last || 'Take a shot. The keeper studies your past kicks and dives to where it expects the ball.'}
    </div>

    <div class="meters">
      <div class="mrow">
        <span class="mname">Your scoring</span>
        <span class="mbar"><i class="good" style={`width:${rate * 100}%`}></i><span class="mark" style={`left:${eqValue * 100}%`}></span></span>
        <span class="mval mono">{pctText(rate)}</span>
      </div>
      <div class="mrow">
        <span class="mname">You shoot Left</span>
        <span class="mbar"><i style={`width:${leftFreq * 100}%`}></i><span class="mark" style={`left:${eqLeft * 100}%`}></span></span>
        <span class="mval mono">{pctText(leftFreq)}</span>
      </div>
      <div class="mrow">
        <span class="mname">Keeper's read</span>
        <span class="mbar"><i class="warn" style={`width:${read * 100}%`}></i></span>
        <span class="mval mono">{pctText(read)}</span>
      </div>
      <p class="mnote">The tick is the equilibrium target: score about <b class="mono">{pctText(eqValue)}</b> by shooting Left about <b class="mono">{pctText(eqLeft)}</b> of the time, in no pattern. {#if shots >= 6}{#if gap > 0.06}The keeper is reading you: your scoring sits {pctText(gap)} below the unreadable {pctText(eqValue)}.{:else}You are hard to read. Your scoring is holding near the {pctText(eqValue)} an unexploitable kicker earns.{/if}{/if}</p>
    </div>

    <div class="scoreline">
      <div class="score you"><span class="v mono">{goals}</span><span class="l">Goals</span></div>
      <div class="score"><span class="v mono">{shots}</span><span class="l">Shots</span></div>
      <button class="tinybtn" onclick={reset}>Reset</button>
    </div>
  {/if}
</div>

<style>
  .meters { margin-top: 14px; }
  .mrow { display: grid; grid-template-columns: 92px 1fr 44px; align-items: center; gap: 10px; margin-bottom: 9px; }
  .mname { font-size: 11.5px; font-weight: 600; color: var(--ink-muted); }
  .mbar { position: relative; height: 9px; border-radius: 999px; background: var(--surface-2); overflow: visible; }
  .mbar > i { display: block; height: 100%; border-radius: 999px; background: var(--ink-muted); }
  .mbar > i.good { background: var(--cooperate); }
  .mbar > i.warn { background: var(--defect); }
  .mbar .mark { position: absolute; top: -3px; bottom: -3px; width: 0; border-left: 1.5px dashed var(--gold); }
  .mval { font-size: 12px; text-align: right; }
  .mnote { font-size: 11.5px; color: var(--ink-muted); margin: 6px 0 0; line-height: 1.5; }
  .mnote b { color: var(--ink); }
</style>
