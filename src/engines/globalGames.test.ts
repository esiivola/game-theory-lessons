import { describe, it, expect } from 'vitest';
import { threshold, regimeFalls, crisisProbability } from './globalGames';

describe('threshold', () => {
  it('is 1 - c, so 1/2 when attacking costs 1/2', () => {
    expect(threshold(0.5)).toBeCloseTo(0.5);
    expect(threshold(0.2)).toBeCloseTo(0.8);
  });
});

describe('regimeFalls', () => {
  it('collapses only below the threshold', () => {
    expect(regimeFalls(0.3, 0.5)).toBe(true);  // 0.3 < 0.5
    expect(regimeFalls(0.7, 0.5)).toBe(false); // 0.7 > 0.5
  });
});

describe('crisisProbability', () => {
  it('cheaper attacking (lower c) means more crises', () => {
    expect(crisisProbability(0.2)).toBeGreaterThan(crisisProbability(0.8));
    expect(crisisProbability(0.5)).toBeCloseTo(0.5);
  });
});
