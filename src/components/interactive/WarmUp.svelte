<script lang="ts">
  interface WQ { q: string; options: string[]; answer: number; }
  let {
    title = 'From earlier lessons',
    sub = 'Two quick ones before we start.',
    questions,
  }: { title?: string; sub?: string; questions: WQ[] } = $props();

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
  <div class="sub">{sub}</div>
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
