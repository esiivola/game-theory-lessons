<script lang="ts">
  import { subTriangles, panchromatic, MIDPOINT_OPTIONS } from '@/engines/sperner';

  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }
  let { exhibit = '', caption = '', predict = null }:
    { exhibit?: string; caption?: string; predict?: Predict | null } = $props();

  let predicted = $state(predict === null);
  let m1 = $state(1), m2 = $state(2), m3 = $state(3);

  const pan = $derived(panchromatic(m1, m2, m3));
  const tris = $derived(subTriangles(m1, m2, m3));
  const COLOR = ['', 'var(--accent)', 'var(--defect)', 'var(--gold)'];

  // Geometry: A bottom-left, B bottom-right, C top; midpoints on each edge.
  const A = { x: 30, y: 190 }, B = { x: 230, y: 190 }, Cc = { x: 130, y: 24 };
  const M1 = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
  const M2 = { x: (B.x + Cc.x) / 2, y: (B.y + Cc.y) / 2 };
  const M3 = { x: (Cc.x + A.x) / 2, y: (Cc.y + A.y) / 2 };
  const polys: Record<string, { x: number; y: number }[]> = {
    A: [A, M1, M3], B: [M1, B, M2], C: [M3, M2, Cc], center: [M1, M2, M3],
  };
  const pts = (ps: { x: number; y: number }[]) => ps.map((p) => `${p.x},${p.y}`).join(' ');
  function cycle(which: 'm1' | 'm2' | 'm3') {
    const opts = MIDPOINT_OPTIONS[which];
    if (which === 'm1') m1 = m1 === opts[0] ? opts[1] : opts[0];
    if (which === 'm2') m2 = m2 === opts[0] ? opts[1] : opts[0];
    if (which === 'm3') m3 = m3 === opts[0] ? opts[1] : opts[0];
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
    <div class="plot-wrap">
      <svg viewBox="0 0 260 210" class="plot" role="img" aria-label="A triangle split into four, with corners colored 1, 2, 3 and midpoints you choose.">
        {#each tris as t}
          <polygon points={pts(polys[t.name])} class={'st' + (pan.includes(t.name) ? ' pan' : '')} />
        {/each}
        {#each [[A, 1], [B, 2], [Cc, 3], [M1, m1], [M2, m2], [M3, m3]] as [p, col]}
          <circle cx={p.x} cy={p.y} r="7" style={`fill:${COLOR[col]}`} class="vtx" />
          <text x={p.x} y={p.y + 3} class="vlab">{col}</text>
        {/each}
      </svg>
    </div>

    <div class="picker">
      <button class="pk" onclick={() => cycle('m1')}>Bottom midpoint: {m1}</button>
      <button class="pk" onclick={() => cycle('m2')}>Right midpoint: {m2}</button>
      <button class="pk" onclick={() => cycle('m3')}>Left midpoint: {m3}</button>
    </div>

    <div class="readout" aria-live="polite">
      Corners are fixed at 1, 2, 3; each midpoint may take either of its two corner colors. However you color them, at least one small triangle uses all three colors: here the {pan.join(' and ')} triangle{pan.length > 1 ? 's are' : ' is'} fully colored. A panchromatic triangle always exists, but which one depends on the coloring.
    </div>
    <p class="note">That guaranteed-but-hard-to-locate triangle mirrors Nash equilibrium: existence is certain, yet finding it can require a long search. Computing a Nash equilibrium is PPAD-complete.</p>
  {/if}
</div>

<style>
  .plot-wrap { overflow-x: auto; display: flex; justify-content: center; }
  .plot { width: 100%; max-width: 260px; height: auto; display: block; }
  .st { fill: var(--surface-2); stroke: var(--border-strong); stroke-width: 1; }
  .st.pan { fill: var(--accent-soft); stroke: var(--accent); stroke-width: 2; }
  .vtx { stroke: var(--surface); stroke-width: 1.5; }
  .vlab { font-size: 8px; font-weight: 700; fill: var(--bg); text-anchor: middle; }
  .picker { display: flex; gap: 7px; flex-wrap: wrap; margin: 12px 0; }
  .pk { border: 1.5px solid var(--border-strong); background: var(--surface); border-radius: 9px; padding: 8px 11px; font-weight: 600; font-size: 12px; cursor: pointer; color: var(--ink); }
  .pk:hover { border-color: var(--accent); }
  .note { font-size: 11.5px; color: var(--ink-muted); margin: 8px 0 0; line-height: 1.5; }
</style>
