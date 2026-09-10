// Fictitious play in Matching Pennies. Each player best-responds to the empirical frequency of the
// opponent's past moves. The matcher wants to match; the mismatcher wants to differ. Beliefs cycle,
// but the time-average of play converges to (1/2, 1/2), the mixed equilibrium. Framework-free.

/** The matcher's best response to a belief that the opponent plays Heads with frequency f. */
export function matcherBestResponse(f: number): 'H' | 'T' {
  return f >= 0.5 ? 'H' : 'T';
}

/** The mismatcher's best response to the same belief. */
export function mismatcherBestResponse(f: number): 'H' | 'T' {
  return f >= 0.5 ? 'T' : 'H';
}

export interface FpResult { p1HeadFreq: number; p2HeadFreq: number; }

/** Simulate two fictitious-play learners for a number of rounds; return time-average Heads frequencies. */
export function fictitiousPlay(rounds: number): FpResult {
  // Prior counts of the opponent's Heads/Tails (start at 1 each to avoid dividing by zero).
  let p1seesH = 1, p1seesT = 1; // player 1 (matcher) sees player 2's moves
  let p2seesH = 1, p2seesT = 1; // player 2 (mismatcher) sees player 1's moves
  let p1Heads = 0, p2Heads = 0;
  for (let t = 0; t < rounds; t++) {
    const m1 = matcherBestResponse(p1seesH / (p1seesH + p1seesT));
    const m2 = mismatcherBestResponse(p2seesH / (p2seesH + p2seesT));
    if (m1 === 'H') p1Heads++;
    if (m2 === 'H') p2Heads++;
    if (m2 === 'H') p1seesH++; else p1seesT++;
    if (m1 === 'H') p2seesH++; else p2seesT++;
  }
  return { p1HeadFreq: p1Heads / rounds, p2HeadFreq: p2Heads / rounds };
}
