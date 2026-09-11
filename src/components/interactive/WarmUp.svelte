<script lang="ts">
  interface WQ { q: string; options: string[]; answer: number; }
  let {
    title = 'From earlier lessons',
    sub = null,
    questions,
  }: { title?: string; sub?: string | null; questions: WQ[] } = $props();

  // Default subtitle has to agree with how many questions there actually are.
  const subline = $derived(
    sub ?? (questions.length === 1 ? 'One quick one before we start.' : `${questions.length === 2 ? 'Two' : questions.length} quick ones before we start.`)
  );

  let solved = $state<number[]>(questions.map(() => -1));
  let wrong = $state<number[][]>(questions.map(() => []));

  function pick(qi: number, oi: number) {
    if (solved[qi] !== -1) return;
    if (oi === questions[qi].answer) {
      solved[qi] = oi;
    } else if (!wrong[qi].includes(oi)) {
      wrong[qi] = [...wrong[qi], oi];
    }
  }
</script>

<div class="warmup">
  <div class="lab">{title}</div>
  <div class="sub">{subline}</div>
  {#each questions as q, qi}
    <div class="wq">
      <p>{q.q}</p>
      <div class="wopts">
        {#each q.options as opt, oi}
          <button
            class={(solved[qi] === oi ? 'ok' : '') + (wrong[qi].includes(oi) ? 'no' : '')}
            disabled={solved[qi] !== -1 || wrong[qi].includes(oi)}
            onclick={() => pick(qi, oi)}
          >{opt}</button>
        {/each}
      </div>
    </div>
  {/each}
</div>
