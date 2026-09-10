import { describe, it, expect } from 'vitest';
import { tradeOccurs, missedEfficientTrade, FIRST_BEST_SURPLUS, LINEAR_SURPLUS } from './doubleAuction';

describe('the double auction', () => {
  it('trades only when the buyer value exceeds the seller cost by at least 1/4', () => {
    expect(tradeOccurs(0.8, 0.5)).toBe(true);  // gap 0.3 >= 0.25
    expect(tradeOccurs(0.6, 0.5)).toBe(false); // gap 0.1 < 0.25
  });
  it('flags efficient trades it misses (positive gains, no trade)', () => {
    expect(missedEfficientTrade(0.6, 0.5)).toBe(true); // vb>vs but gap < 1/4
    expect(missedEfficientTrade(0.4, 0.5)).toBe(false); // no gains from trade anyway
  });
  it('leaves surplus on the table versus the first best', () => {
    expect(LINEAR_SURPLUS).toBeLessThan(FIRST_BEST_SURPLUS);
    expect(FIRST_BEST_SURPLUS).toBeCloseTo(1 / 6);
    expect(LINEAR_SURPLUS).toBeCloseTo(9 / 64);
  });
});
