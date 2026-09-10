<script lang="ts">
  import { colEV, rowGuarantee, indifferenceP, securityP, type Matrix2 } from '@/engines/mixed';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let {
    matrix,
    topLabel,
    bottomLabel,
    leftLabel,
    rightLabel,
    mode = 'indifference',
    exhibit = '',
    caption = '',
    predict = null,
  }: {
    matrix: Matrix2;
    topLabel: string;    // row player's first action (the one p weights)
    bottomLabel: string;
    leftLabel: string;   // column player's first action
    rightLabel: string;
    mode?: 'indifference' | 'security';
    exhibit?: string;
    caption?: string;
    predict?: Predict | null;
  } = $props();

  let predicted = $state(predict === null);
  let p = $state(0.5);

  const crossing = mode === 'security' ? securityP(matrix) : indifferenceP(matrix);
  const fmt = (n: number) => (Math.round(n * 100) / 100).toString();
  const pct = (n: number) => Math.round(n * 100) + '%';

  // Two lines over p in [0,1]: the column player's EV to each action, or the row player's
  // guaranteed payoff against each pure reply.
  const line = (pp: number): [number, number] => (mode === 'security' ? rowGuarantee(matrix, pp) : colEV(matrix, pp));
  const ends = $derived([line(0), line(1)] as [[number, number], [number, number]]);
  const now = $derived(line(p));

  // Plot geometry.
  const W = 320, H = 176, PADL = 34, PADR = 12, PADT = 12, PADB = 26;
  const ys = $derived([ends[0][0], ends[1][0], ends[0][1], ends[1][1]]);
  const yMin = $derived(Math.min(...ys));
  const yMax = $derived(Math.max(...ys));
  const span = $derived(yMax - yMin || 1);
  const sx = (pp: number) => PADL + pp * (W - PADL - PADR);
  const sy = (v: number) => PADT + (yMax - v) / span * (H - PADT - PADB);

  const guaranteed = $derived(Math.min(now[0], now[1]));

  function onPredict() { predicted = true; }
  function reset() { p = 0.5; }
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
      <svg viewBox={`0 0 ${W} ${H}`} class="plot" role="img"
           aria-label={`Two lines over your probability of ${topLabel}. ${mode === 'security' ? 'Each line is the payoff you can guarantee against one of the column player\'s replies.' : 'Each line is the column player\'s expected payoff to one of its actions.'}`}>
        <!-- axes -->
        <line x1={PADL} y1={PADT} x2={PADL} y2={H - PADB} class="ax" />
        <line x1={PADL} y1={H - PADB} x2={W - PADR} y2={H - PADB} class="ax" />
        <!-- line 1 (left / vs left) -->
        <line x1={sx(0)} y1={sy(ends[0][0])} x2={sx(1)} y2={sy(ends[1][0])} class="ln1" />
        <!-- line 2 (right / vs right) -->
        <line x1={sx(0)} y1={sy(ends[0][1])} x2={sx(1)} y2={sy(ends[1][1])} class="ln2" />
        {#if crossing !== null}
          <line x1={sx(crossing)} y1={PADT} x2={sx(crossing)} y2={H - PADB} class="cross" />
          <circle cx={sx(crossing)} cy={sy(line(crossing)[0])} r="3.5" class="crossdot" />
        {/if}
        <!-- current p marker -->
        <line x1={sx(p)} y1={PADT} x2={sx(p)} y2={H - PADB} class="pnow" />
        <circle cx={sx(p)} cy={sy(now[0])} r="4" class="d1" />
        <circle cx={sx(p)} cy={sy(now[1])} r="4" class="d2" />
        <text x={PADL} y={H - 8} class="axlab">0%</text>
        <text x={W - PADR} y={H - 8} class="axlab" text-anchor="end">100%</text>
      </svg>
    </div>

    <div class="legend">
      <span class="k1">{mode === 'security' ? `If they play ${leftLabel}` : `Their ${leftLabel}`}</span>
      <span class="k2">{mode === 'security' ? `If they play ${rightLabel}` : `Their ${rightLabel}`}</span>
    </div>

    <label class="slider">
      <span class="slab">Your chance of {topLabel}: <b class="mono">{pct(p)}</b></span>
      <input type="range" min="0" max="1" step="0.01" bind:value={p}
             aria-label={`Your probability of playing ${topLabel}`} />
    </label>

    <div class="readout" aria-live="polite">
      {#if mode === 'security'}
        Playing {topLabel} {pct(p)} of the time, you guarantee at least <b class="mono">{fmt(guaranteed)}</b>
        (their {leftLabel} gives you <b class="mono">{fmt(now[0])}</b>, their {rightLabel} <b class="mono">{fmt(now[1])}</b>).
        {#if crossing !== null}
          {#if Math.abs(p - crossing) < 0.02}This is the best you can lock in: the two replies pay you the same.{:else}A sharp opponent picks your worse case. Slide to the crossing to raise the floor.{/if}
        {/if}
      {:else}
        At {topLabel} {pct(p)}, the column player earns <b class="mono">{fmt(now[0])}</b> from {leftLabel}
        and <b class="mono">{fmt(now[1])}</b> from {rightLabel}.
        {#if crossing !== null}
          {#if Math.abs(p - crossing) < 0.02}They are indifferent, so they cannot exploit you. This is your unexploitable mix.{:else}They will pick their better action and adjust to beat you. Slide to the crossing to make them indifferent.{/if}
        {/if}
      {/if}
    </div>

    <div class="play">
      {#if crossing !== null}
        <button class="tinybtn" onclick={() => (p = crossing)}>Snap to the crossing</button>
      {/if}
      <button class="tinybtn" onclick={reset}>Reset</button>
    </div>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; }
  .plot { width: 100%; height: auto; display: block; }
  .ax { stroke: var(--border-strong); stroke-width: 1; }
  .ln1 { stroke: var(--accent); stroke-width: 2; }
  .ln2 { stroke: var(--defect); stroke-width: 2; }
  .cross { stroke: var(--gold); stroke-width: 1; stroke-dasharray: 3 3; }
  .crossdot { fill: var(--gold); }
  .pnow { stroke: var(--ink-muted); stroke-width: 1; opacity: .55; }
  .d1 { fill: var(--accent); }
  .d2 { fill: var(--defect); }
  .axlab { font-size: 9px; fill: var(--ink-muted); font-weight: 600; }
  .legend { display: flex; gap: 16px; font-size: 11px; font-weight: 600; margin: 8px 0 2px; }
  .legend .k1 { color: var(--accent); }
  .legend .k2 { color: var(--defect); }
  .legend span { display: inline-flex; align-items: center; gap: 5px; }
  .legend span::before { content: ""; width: 14px; height: 2px; background: currentColor; display: inline-block; }
  .slider { display: block; margin: 12px 0 2px; }
  .slab { font-size: 12.5px; color: var(--ink-muted); display: block; margin-bottom: 7px; }
  .slab b { color: var(--ink); }
  .slider input[type="range"] { width: 100%; accent-color: var(--accent); }
</style>
