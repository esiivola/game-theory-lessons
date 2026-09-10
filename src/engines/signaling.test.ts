import { describe, it, expect } from 'vitest';
import { cost, net, lowMimics, highSeparates, isSeparating, leastCostSeparating, THETA_HIGH } from './signaling';

describe('cost and single crossing', () => {
  it('education is cheaper for the High type', () => {
    expect(cost(1, 1)).toBe(1);   // Low pays 1
    expect(cost(1, 2)).toBe(0.5); // High pays 0.5 for the same education
  });
});

describe('incentive constraints', () => {
  it('the Low type stops mimicking once e reaches 1', () => {
    expect(lowMimics(0.5)).toBe(true);  // 2 - 0.5 = 1.5 > 1
    expect(lowMimics(1)).toBe(false);   // 2 - 1 = 1, not strictly better than 1
    expect(lowMimics(1.5)).toBe(false);
  });
  it('the High type separates for e up to 2', () => {
    expect(highSeparates(1)).toBe(true);   // 2 - 0.5 = 1.5 >= 1
    expect(highSeparates(2)).toBe(true);   // 2 - 1 = 1 >= 1
    expect(highSeparates(2.5)).toBe(false); // 2 - 1.25 = 0.75 < 1
  });
});

describe('separating range', () => {
  it('is the interval [1, 2]', () => {
    expect(isSeparating(0.5)).toBe(false); // Low mimics
    expect(isSeparating(1)).toBe(true);
    expect(isSeparating(2)).toBe(true);
    expect(isSeparating(2.5)).toBe(false); // High would rather pool down
  });
  it('the least-cost separating level is 1, giving the High type net 1.5', () => {
    const e = leastCostSeparating();
    expect(e).toBe(1);
    expect(net(THETA_HIGH, e, THETA_HIGH)).toBeCloseTo(1.5);
  });
});
