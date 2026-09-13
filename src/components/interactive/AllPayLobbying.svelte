<script lang="ts">
  import { allPayOutcome } from '@/engines/allPay';

  const prize = 100;
  const rivalBid = 40;
  let myBid = $state(30);
  let played = $state(false);
  const outcome = $derived(allPayOutcome(myBid, rivalBid, prize));
</script>

<div class="widget">
  <div class="exhibit-cap"><span>Exhibit 2</span> &nbsp;Lobbying as an all-pay contest</div>
  <p class="note">The policy prize is worth 100 to either side. The rival spends 40. Your spending is paid whether you win or lose.</p>
  <label class="slider">
    <span>Your lobbying spend: <b class="mono">{myBid}</b></span>
    <input type="range" min="0" max="100" step="1" bind:value={myBid} aria-label="Your lobbying spend" />
  </label>
  <div class="play">
    <button class="choice" onclick={() => (played = true)}>Submit spending</button>
    <button class="tinybtn" onclick={() => { myBid = 30; played = false; }}>Reset</button>
  </div>
  <div class="readout" aria-live="polite">
    {#if played}
      {#if outcome.winner === 'you'}You win the policy prize.{:else if outcome.winner === 'rival'}The rival wins the policy prize.{:else}You split the prize on a tie.{/if}
      Your net payoff is <b class="mono">{outcome.myPayoff}</b>, the rival's is <b class="mono">{outcome.rivalPayoff}</b>, and total resources spent are <b class="mono">{outcome.totalSpent}</b>. The loser's spending is not refunded.
    {:else}
      Choose how much to spend against the rival's fixed bid of 40.
    {/if}
  </div>
</div>

<style>
  .note { margin: 0 0 .75rem; color: var(--ink-muted); font-size: .78rem; line-height: 1.5; }
  .slider { display: block; margin-bottom: .75rem; }
  .slider span { display: block; font-size: .82rem; margin-bottom: .35rem; }
  .slider input { width: 100%; accent-color: var(--accent); }
</style>
