<script lang="ts">
  import { rpsStep } from '@/engines/evolution';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let tie = $state(0); // tie payoff: <0 penalize (inward), >0 reward (outward)
  let startR = $state(0.5);
  let startP = $state(0.3);

  // Barycentric to 2D for an equilateral triangle. Corners: Rock (bottom-left), Paper (bottom-right), Scissors (top).
  const W = 260, H = 230, PAD = 20;
  const A = { x: PAD, y: H - PAD };           // Rock
  const B = { x: W - PAD, y: H - PAD };       // Paper
  const Cc = { x: W / 2, y: PAD };            // Scissors
  const toXY = (x: number[]) => ({ x: A.x * x[0] + B.x * x[1] + Cc.x * x[2], y: A.y * x[0] + B.y * x[1] + Cc.y * x[2] });

  const trajectory = $derived.by(() => {
    let x = [startR, startP, Math.max(0, 1 - startR - startP)];
    const tot = x[0] + x[1] + x[2];
    x = x.map((v) => v / tot);
    const pts: { x: number; y: number }[] = [toXY(x)];
    for (let i = 0; i < 3000; i++) { x = rpsStep(x, tie, 0.02); if (i % 6 === 0) pts.push(toXY(x)); }
    return pts;
  });
  const path = $derived(trajectory.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' '));
  const r2 = (x: number) => Math.round(x * 100) / 100;

  function onPredict() { predicted = true; }
  function reset() { tie = 0; startR = 0.5; startP = 0.3; }
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
    <div class="plot-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} class="plot" role="img" aria-label="Population trajectory on the Rock-Paper-Scissors simplex.">
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${Cc.x},${Cc.y}`} class="tri" />
        <circle cx={W / 2} cy={(A.y + B.y + Cc.y) / 3} r="2.5" class="center" />
        <path d={path} class="traj" />
        <circle cx={trajectory[0].x} cy={trajectory[0].y} r="4" class="start" />
        <circle cx={trajectory[trajectory.length - 1].x} cy={trajectory[trajectory.length - 1].y} r="4" class="end" />
        <text x={A.x} y={A.y + 12} class="tk">Rock</text>
        <text x={B.x} y={B.y + 12} class="tk" text-anchor="end">Paper</text>
        <text x={Cc.x} y={Cc.y - 6} class="tk" text-anchor="middle">Scissors</text>
      </svg>
    </div>

    <label class="slider"><span class="slab">Tie payoff: <b class="mono">{r2(tie)}</b> <span class="dim">(negative penalizes ties)</span></span><input type="range" min="-0.2" max="0.2" step="0.01" bind:value={tie} aria-label="Tie payoff" /></label>
    <label class="slider"><span class="slab">Start Rock share: <b class="mono">{r2(startR)}</b></span><input type="range" min="0.05" max="0.9" step="0.01" bind:value={startR} aria-label="Starting Rock share" /></label>
    <label class="slider"><span class="slab">Start Paper share: <b class="mono">{r2(startP)}</b></span><input type="range" min="0.05" max="0.9" step="0.01" bind:value={startP} aria-label="Starting Paper share" /></label>

    <div class="readout" aria-live="polite">
      {#if Math.abs(tie) < 0.005}
        Fair ties: the trajectory circles the center on a closed orbit forever, never settling. This is the zero-sum RPS cycle.
      {:else if tie < 0}
        Ties are penalized, so matching the crowd is costly and diversity is favoured: the path spirals inward to the even mix, a stable rest point.
      {:else}
        Ties are rewarded, so the population spirals outward toward the edges, cycling between near-pure Rock, Paper, and Scissors phases.
      {/if}
    </div>

    <div class="play"><button class="tinybtn" onclick={reset}>Reset</button></div>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; display: flex; justify-content: center; }
  .plot { width: 100%; max-width: 280px; height: auto; display: block; }
  .tri { fill: var(--surface-2); stroke: var(--border-strong); stroke-width: 1; opacity: .5; }
  .center { fill: var(--gold); }
  .traj { fill: none; stroke: var(--accent); stroke-width: 1.5; }
  .start { fill: var(--ink-muted); }
  .end { fill: var(--defect); }
  .tk { font-size: 9px; fill: var(--ink-muted); font-weight: 600; }
  .slider { display: block; margin: 8px 0 4px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 5px; }
  .slab b { color: var(--ink); } .slab .dim { opacity: .7; }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
</style>
