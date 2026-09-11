<script lang="ts">
  type Tone = 'coop' | 'def' | 'neutral';
  interface Strat { key: string; label: string; tone?: Tone; }
  interface Predict { question: string; options: { key: string; label: string }[]; reveal: string; }

  let {
    rows,
    cols,
    payoffs,
    mode = 'read',
    exhibit = '',
    caption = '',
    predict = null,
    youChoiceLabels = null,
  }: {
    rows: Strat[];
    cols: Strat[];
    payoffs: Record<string, Record<string, [number, number]>>;
    mode?: 'read' | 'play' | 'nash';
    exhibit?: string;
    caption?: string;
    predict?: Predict | null;
    youChoiceLabels?: Record<string, string> | null;
  } = $props();

  const fmt = (n: number) => (n > 0 ? '+' + n : '' + n);
  const toneClass = (t?: Tone) => (t === 'coop' ? 'coop' : t === 'def' ? 'def' : '');

  let predicted = $state(predict === null);
  let sel = $state<string | null>(null); // "rKey|cKey"
  let hit = $state<string | null>(null);
  let readout = $state('');
  let scoreYou = $state(0);
  let scoreThem = $state(0);
  let revealBR = $state(false);
  let nashMsg = $state('');
  let rowCounts: Record<string, number> = {};
  const RM = () =>
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function bestRowResponses(cKey: string): Set<string> {
    const best = Math.max(...rows.map((r) => payoffs[r.key][cKey][0]));
    return new Set(rows.filter((r) => payoffs[r.key][cKey][0] === best).map((r) => r.key));
  }
  function bestColResponses(rKey: string): Set<string> {
    const best = Math.max(...cols.map((c) => payoffs[rKey][c.key][1]));
    return new Set(cols.filter((c) => payoffs[rKey][c.key][1] === best).map((c) => c.key));
  }
  const isNash = (rKey: string, cKey: string) =>
    bestRowResponses(cKey).has(rKey) && bestColResponses(rKey).has(cKey);

  function cellClasses(rKey: string, cKey: string): string {
    const id = rKey + '|' + cKey;
    let cls = 'cell';
    if (sel === id) cls += ' sel';
    if (hit === id) cls += ' hit';
    if (revealBR) {
      if (bestRowResponses(cKey).has(rKey)) cls += ' br1';
      if (bestColResponses(rKey).has(cKey)) cls += ' br2';
      if (isNash(rKey, cKey)) cls += ' nash';
    }
    return cls;
  }

  function readCell(r: Strat, c: Strat) {
    sel = r.key + '|' + c.key;
    const p = payoffs[r.key][c.key];
    if (mode === 'nash') {
      nashMsg = isNash(r.key, c.key)
        ? `Stable. From (${r.label}, ${c.label}) neither player can do better by moving alone.`
        : `Not stable. At least one player has a better reply, so someone would deviate.`;
    }
    readout = `<b>${r.label}</b> and <b>${c.label}</b>: you <b class="mono">${fmt(p[0])}</b>, them <b class="mono">${fmt(p[1])}</b>.`;
  }

  // The opponent is self-interested, not a coin flip: it best-responds to how you have played so
  // far (a uniform prior over your rows before any history). In a dilemma that means it defects
  // every round, which is exactly what the lesson claims will happen.
  function opponentColumn(): Strat {
    const weight = (rKey: string) => 1 + (rowCounts[rKey] ?? 0);
    const total = rows.reduce((s, r) => s + weight(r.key), 0);
    const ev = (cKey: string) =>
      rows.reduce((s, r) => s + (weight(r.key) / total) * payoffs[r.key][cKey][1], 0);
    const best = Math.max(...cols.map((c) => ev(c.key)));
    const tied = cols.filter((c) => ev(c.key) >= best - 1e-9);
    return tied[Math.floor(Math.random() * tied.length)];
  }

  function choose(r: Strat) {
    const c = opponentColumn();
    rowCounts[r.key] = (rowCounts[r.key] ?? 0) + 1;
    const p = payoffs[r.key][c.key];
    scoreYou += p[0];
    scoreThem += p[1];
    sel = r.key + '|' + c.key;
    if (!RM()) {
      hit = null;
      requestAnimationFrame(() => (hit = r.key + '|' + c.key));
    }
    readout = `You played <b>${r.label}</b>, they played <b>${c.label}</b>. You <b class="mono">${fmt(p[0])}</b>, them <b class="mono">${fmt(p[1])}</b>.`;
  }

  function resetRounds() {
    rowCounts = {};
    scoreYou = 0;
    scoreThem = 0;
    sel = null;
    hit = null;
    readout = 'Rounds reset. Make your move.';
  }

  function onPredict() {
    predicted = true;
    readout = predict ? predict.reveal : '';
  }
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
    <div
      class="matrix"
      style={`grid-template-columns:24px repeat(${cols.length}, minmax(0, 1fr))`}
      role="group"
      aria-label="Payoff matrix"
    >
      <div class="mh corner">You&nbsp;&darr;<br />Them&nbsp;&rarr;</div>
      {#each cols as c}
        <div class={'mh ' + toneClass(c.tone)}>{c.label}</div>
      {/each}
      {#each rows as r}
        <div class={'mh rowlab ' + toneClass(r.tone)}>{r.label}</div>
        {#each cols as c}
          <button
            class={cellClasses(r.key, c.key)}
            onclick={() => readCell(r, c)}
          >
            <span class="sr-only">{r.label}, {c.label}:</span>
            <div class="pay">
              <span class="you">{fmt(payoffs[r.key][c.key][0])}</span>
              <span class="them">{fmt(payoffs[r.key][c.key][1])}</span>
            </div>
            <div class="sub">you / them</div>
          </button>
        {/each}
      {/each}
    </div>

    <div class="readout" aria-live="polite">
      {#if readout}{@html readout}{:else if mode === 'nash'}Tap the cell you think is stable, then reveal the best responses.{:else}Tap a cell to read its payoffs.{/if}
      {#if nashMsg}<br />{nashMsg}{/if}
    </div>

    {#if mode === 'play'}
      <div class="play">
        {#each rows as r}
          <button class={'choice ' + toneClass(r.tone)} onclick={() => choose(r)}>
            {youChoiceLabels?.[r.key] ?? r.label}
          </button>
        {/each}
      </div>
      <div class="scoreline">
        <div class="score you"><span class="v mono">{scoreYou}</span><span class="l">You</span></div>
        <button class="tinybtn" onclick={resetRounds}>Reset</button>
        <div class="score"><span class="v mono">{scoreThem}</span><span class="l">Them</span></div>
      </div>
    {/if}

    {#if mode === 'nash'}
      <div class="play">
        <button class="tinybtn" onclick={() => (revealBR = !revealBR)}>
          {revealBR ? 'Hide best responses' : 'Show best responses'}
        </button>
      </div>
    {/if}
  {/if}
</div>
