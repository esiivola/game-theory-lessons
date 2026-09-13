<script lang="ts">
  import { onMount } from 'svelte';
  import { quizState, recordQuiz } from '@/lib/progress';

  interface Opt { text: string; correct?: boolean; feedback: string; }
  let {
    slug,
    id,
    question,
    options,
    badge = '',
  }: { slug: string; id: string; question: string; options: Opt[]; badge?: string } = $props();

  let solvedIdx = $state<number | null>(null);
  let wrong = $state<number[]>([]);
  let feedback = $state('');
  let good = $state(false);
  const solved = $derived(solvedIdx !== null);

  onMount(() => {
    if (!quizState(slug, id)?.correct) return;
    const index = options.findIndex((option) => option.correct);
    if (index < 0) return;
    solvedIdx = index;
    good = true;
    feedback = options[index].feedback;
  });

  function answer(i: number) {
    if (solved || wrong.includes(i)) return;
    const o = options[i];
    if (o.correct) {
      solvedIdx = i;
      good = true;
      feedback = o.feedback;
      try { recordQuiz(slug, id, true); } catch { /* ignore */ }
      try { window.dispatchEvent(new CustomEvent('gt:solved', { detail: { slug, id } })); } catch { /* ignore */ }
    } else {
      if (!wrong.includes(i)) wrong = [...wrong, i];
      good = false;
      feedback = o.feedback;
      try { recordQuiz(slug, id, false); } catch { /* ignore */ }
    }
  }
</script>

<div class="quiz" data-quiz={id} data-slug={slug} data-solved={solved}>
  <div class="meta">
    <span class="step">Check yourself{#if badge}<span class="badge">{badge}</span>{/if}</span>
  </div>
  <div class="q">{@html question}</div>
  {#each options as o, i}
    <button
      class={'opt' + (solvedIdx === i ? ' correct' : '') + (wrong.includes(i) ? ' wrong' : '')}
      aria-disabled={solved || wrong.includes(i)}
      onclick={() => answer(i)}
    >
      <span class="mk" aria-hidden="true">{#if solvedIdx === i}&#10003;{:else if wrong.includes(i)}&#10007;{/if}</span>
      <span>{@html o.text}</span>
    </button>
  {/each}
  {#if feedback}
    <div class={'fb ' + (good ? 'good' : 'bad')} role="status" aria-live="polite" aria-atomic="true">
      {@html (good ? '<b>Right.</b> ' : '<b>Not that one.</b> ') + feedback}
    </div>
  {/if}
</div>
