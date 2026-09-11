// Position (ad-slot) auctions. Slots have click volumes; bidders have per-click values. The
// efficient assignment pairs the highest values with the highest-click slots. VCG charges each
// winner the externality it imposes; the generalized second-price (GSP) auction charges the next
// bid, which is not truthful. Framework-free and unit-testable.

/** Efficient total welfare: sort values and clicks descending and pair them. */
function welfare(values: number[], clicks: number[]): number {
  const v = [...values].sort((a, b) => b - a);
  const c = [...clicks].sort((a, b) => b - a);
  let w = 0;
  for (let i = 0; i < Math.min(v.length, c.length); i++) w += v[i] * c[i];
  return w;
}

export interface Assignment { index: number; slot: number; value: number; clicks: number; vcgPayment: number; }

/** Efficient assignment plus each winner's total VCG payment (the externality it imposes). */
export function solveVCG(values: number[], clicks: number[]): Assignment[] {
  const order = values.map((v, i) => i).sort((a, b) => values[b] - values[a]);
  const sortedClicks = [...clicks].sort((a, b) => b - a);
  const all = welfare(values, clicks);
  const out: Assignment[] = [];
  for (let p = 0; p < Math.min(order.length, sortedClicks.length); p++) {
    const idx = order[p];
    const others = values.filter((_, i) => i !== idx);
    const welfareWithout = welfare(others, clicks);
    const contribution = values[idx] * sortedClicks[p];
    const othersWith = all - contribution;
    out.push({
      index: idx,
      slot: p,
      value: values[idx],
      clicks: sortedClicks[p],
      vcgPayment: welfareWithout - othersWith,
    });
  }
  return out;
}

/** GSP total payment for the winner in slot p under truthful bids: the next bid times its clicks. */
export function gspPayment(values: number[], clicks: number[], slot: number): number {
  const sortedVals = [...values].sort((a, b) => b - a);
  const sortedClicks = [...clicks].sort((a, b) => b - a);
  const nextBid = sortedVals[slot + 1] ?? 0;
  return nextBid * sortedClicks[slot];
}

/**
 * The top bidder's GSP payoff from holding slot 0 against shading down into slot 1, when everyone
 * else bids truthfully. Staying pays the next bid per click; shading to just under the second bid
 * wins slot 1 at the third bid per click. GSP is truthful for one slot but not for several, and
 * whether the deviation actually pays depends on the click gap: it does exactly when the cheaper
 * lower slot keeps enough traffic to beat the top slot's higher price.
 */
export function gspTopDeviation(
  values: number[],
  clicks: number[]
): { stay: number; drop: number; profitable: boolean } {
  const v = [...values].sort((a, b) => b - a);
  const c = [...clicks].sort((a, b) => b - a);
  const stay = (c[0] ?? 0) * (v[0] - (v[1] ?? 0));
  const drop = (c[1] ?? 0) * (v[0] - (v[2] ?? 0));
  return { stay, drop, profitable: drop > stay + 1e-9 };
}
