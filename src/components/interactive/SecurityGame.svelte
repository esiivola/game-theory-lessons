<script lang="ts">
  import { attackerTarget, expectedLoss, optimalCoverageTwo } from '@/engines/securityGame';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  const VALUES = [10, 5];
  let predicted = $state(predict === null);
  let c0 = $state(0.5); // coverage of the $10 target; the $5 target gets 1 - c0

  const coverage = $derived([c0, 1 - c0]);
  const target = $derived(attackerTarget(coverage, VALUES));
  const loss = $derived(expectedLoss(coverage, VALUES));
  const opt = optimalCoverageTwo(VALUES[0], VALUES[1]);
  const r2 = (x: number) => Math.round(x * 100) / 100;
  const pct = (x: number) => Math.round(x * 100) + '%';

  function onPredict() { predicted = true; }
  function reset() { c0 = 0.5; }
</script>

<div class="widget">
  {#if exhibit || caption}
    <div class="exhibit-cap"><span>{exhibit}</span> &nbsp;{caption}</div>
  {/if}

  {#if !predicted && predict}
    <div class="predict">
      <div class="q">{predict.question}</div>
      <div class="opts">
        {#each predict.options as o}<button onclick={onPredict}>{o.label}</button>{/each}
      </div>
    </div>
  {:else}
    <p class="setup">You have one patrol to split between two targets, worth 10 and 5. You commit to coverage probabilities first; the attacker then strikes the target that maximizes its expected value.</p>

    <label class="slider"><span class="slab">Coverage of the $10 target: <b class="mono">{pct(c0)}</b> (the $5 target gets {pct(1 - c0)})</span><input type="range" min="0" max="1" step="0.01" bind:value={c0} aria-label="Coverage of the high-value target" /></label>

    <div class="targets">
      <div class={'tgt' + (target === 0 ? ' hit' : '')}><span class="tv">$10 target</span><span class="tc">covered {pct(c0)}</span>{#if target === 0}<span class="atk">attacked</span>{/if}</div>
      <div class={'tgt' + (target === 1 ? ' hit' : '')}><span class="tv">$5 target</span><span class="tc">covered {pct(1 - c0)}</span>{#if target === 1}<span class="atk">attacked</span>{/if}</div>
    </div>

    <div class="readout" aria-live="polite">
      The attacker hits the <b>${VALUES[target]}</b> target, so your expected loss is <b class="mono">{r2(loss)}</b>.
      {#if Math.abs(c0 - opt) < 0.02}This is optimal: the attacker is indifferent between targets, and your worst-case loss is minimized at about {r2(10 / 3)}.{:else if c0 >= 0.99}Guarding only the $10 target invites an attack on the undefended $5 one for a loss of 5, worse than the {r2(10 / 3)} you could guarantee.{:else}Slide toward {pct(opt)} coverage of the big target to equalize the attacker's options and lower your worst-case loss.{/if}
    </div>
    <p class="note">Committing to a randomized patrol (Stackelberg) beats any deterministic guard, since surveillance makes a fixed pattern exploitable. Deployed systems like ARMOR and PROTECT use exactly this.</p>

    <div class="play"><button class="tinybtn" onclick={() => (c0 = opt)}>Optimal coverage</button><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .setup { font-size: 13px; color: var(--ink-muted); margin: 0 0 12px; line-height: 1.5; }
  .slider { display: block; margin: 2px 0 12px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
  .targets { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
  .tgt { border: 1px solid var(--border); border-radius: 10px; padding: 12px; text-align: center; }
  .tgt.hit { border-color: var(--defect); background: var(--defect-soft); }
  .tv { display: block; font-weight: 700; font-size: 14px; }
  .tc { display: block; font-size: 11.5px; color: var(--ink-muted); margin-top: 4px; }
  .atk { display: inline-block; margin-top: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--defect); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
