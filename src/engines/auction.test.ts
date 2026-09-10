import { describe, it, expect } from 'vitest';
import { fpaBid, resolve, expectedRevenueUniform } from './auction';

describe('fpaBid', () => {
  it('shades toward value as bidders increase', () => {
    expect(fpaBid(1, 2)).toBeCloseTo(0.5);   // v/2
    expect(fpaBid(1, 3)).toBeCloseTo(2 / 3);  // 2v/3
    expect(fpaBid(1, 10)).toBeCloseTo(0.9);
  });
});

describe('resolve', () => {
  it('second-price: the top bidder wins and pays the second-highest bid', () => {
    // Values 40, 70, 90 with truthful bidding.
    const o = resolve([40, 70, 90], 'spa');
    expect(o.winner).toBe(2);
    expect(o.price).toBe(70);
  });
  it('first-price: the winner pays their own bid', () => {
    const o = resolve([40, 70, 90], 'fpa');
    expect(o.winner).toBe(2);
    expect(o.price).toBe(90);
  });
  it('a reserve can block a sale', () => {
    expect(resolve([30, 20], 'spa', 50).sold).toBe(false);
  });
  it('SPA price is at least the reserve when the sale clears it', () => {
    // High bid 80 clears reserve 50; second bid 20, so price is the reserve, 50.
    const o = resolve([80, 20], 'spa', 50);
    expect(o.sold).toBe(true);
    expect(o.price).toBe(50);
  });
});

describe('expectedRevenueUniform', () => {
  it('is (n-1)/(n+1); revenue equivalence pins it across formats', () => {
    expect(expectedRevenueUniform(3)).toBeCloseTo(0.5);
    expect(expectedRevenueUniform(2)).toBeCloseTo(1 / 3);
  });
});
