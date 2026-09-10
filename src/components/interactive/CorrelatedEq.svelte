<script lang="ts">
  import { CHICKEN, DEVICE, payoff, correlatedValue, mixedNashValue, type Move } from '@/engines/correlated';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let rec = $state<Move | null>(null);   // your current recommendation
  let oppMove = $state<Move | null>(null);
  let total = $state(0);
  let rounds = $state(0);
  let last = $state('');

  const nashV = mixedNashValue();
  const coopV = correlatedValue().row;
  const avg = $derived(rounds === 0 ? 0 : total / rounds);
  const label = (m: Move) => (m === 'swerve' ? 'Swerve' : 'Straight');
  const r1 = (x: number) => Math.round(x * 100) / 100;

  function draw() {
    const cell = DEVICE[Math.floor(Math.random() * DEVICE.length)];
    rec = cell[0];
    oppMove = cell[1]; // the opponent obeys its own recommendation
    last = '';
  }
  function act(obey: boolean) {
    if (rec === null || oppMove === null) return;
    const myMove: Move = obey ? rec : (rec === 'swerve' ? 'straight' : 'swerve');
    const got = payoff(myMove, oppMove);
    total += got;
    rounds += 1;
    last = `The light told you ${label(rec)}. You ${obey ? 'obeyed' : 'deviated'} and played ${label(myMove)}; the other driver went ${label(oppMove)}. You scored ${got}.`;
    rec = null; oppMove = null;
  }
  function reset() { rec = null; oppMove = null; total = 0; rounds = 0; last = ''; }
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
    {#if rec === null}
      <div class="light off" aria-hidden="true"></div>
      <div class="play"><button class="choice" onclick={draw}>{rounds === 0 ? 'Read the light' : 'Next round'}</button></div>
    {:else}
      <div class={'light ' + rec} role="status" aria-live="polite">
        Your light: <b>{label(rec)}</b>
      </div>
      <div class="play">
        <button class="choice coop" onclick={() => act(true)}>Obey ({label(rec)})</button>
        <button class="choice def" onclick={() => act(false)}>Deviate ({label(rec === 'swerve' ? 'straight' : 'swerve')})</button>
      </div>
    {/if}

    <div class="readout" aria-live="polite">
      {last || 'A private signal recommends a move each round. The other driver follows their own signal. Should you follow yours?'}
    </div>

    {#if rounds > 0}
      <div class="bench">
        <div class="brow">
          <span class="bname">Your average</span>
          <span class="bbar"><i style={`width:${(avg / 7) * 100}%`}></i><span class="tick nash" style={`left:${(nashV / 7) * 100}%`}></span><span class="tick coop" style={`left:${(coopV / 7) * 100}%`}></span></span>
          <span class="bval mono">{r1(avg)}</span>
        </div>
        <p class="bnote">Over {rounds} round{rounds === 1 ? '' : 's'}. The dashed tick is the mixed-Nash payoff (<b class="mono">{r1(nashV)}</b>); the solid tick is what obeying the light earns on average (<b class="mono">{r1(coopV)}</b>). Following the signal clears the best Nash outcome.</p>
      </div>
    {/if}

    <div class="scoreline">
      <div class="score you"><span class="v mono">{total}</span><span class="l">Points</span></div>
      <div class="score"><span class="v mono">{rounds}</span><span class="l">Rounds</span></div>
      <button class="tinybtn" onclick={reset}>Reset</button>
    </div>
  {/if}
</div>

<style>
  .light { border-radius: 10px; padding: 12px 14px; font-size: 14px; margin-bottom: 12px; border: 1px solid var(--border); background: var(--surface); }
  .light b { font-weight: 700; }
  .light.swerve { border-color: var(--cooperate); background: var(--cooperate-soft); color: var(--cooperate); }
  .light.straight { border-color: var(--defect); background: var(--defect-soft); color: var(--defect); }
  .light.off { min-height: 8px; padding: 0; border: 0; background: transparent; margin-bottom: 0; }
  .bench { margin-top: 14px; }
  .brow { display: grid; grid-template-columns: 92px 1fr 40px; align-items: center; gap: 10px; }
  .bname { font-size: 11.5px; font-weight: 600; color: var(--ink-muted); }
  .bbar { position: relative; height: 9px; border-radius: 999px; background: var(--surface-2); overflow: visible; }
  .bbar > i { display: block; height: 100%; border-radius: 999px; background: var(--accent); }
  .bbar .tick { position: absolute; top: -3px; bottom: -3px; width: 0; }
  .bbar .tick.nash { border-left: 1.5px dashed var(--ink-muted); }
  .bbar .tick.coop { border-left: 2px solid var(--gold); }
  .bval { font-size: 12px; text-align: right; }
  .bnote { font-size: 11.5px; color: var(--ink-muted); margin: 6px 0 0; line-height: 1.5; }
  .bnote b { color: var(--ink); }
</style>
