import { describe, it, expect } from 'vitest';
import { virtualValue, optimalReserve, expectedRevenue, monopolyRevenue } from './myerson';

describe('virtual value and reserve', () => {
  it('virtual value is 2v-1, zero at 1/2', () => {
    expect(virtualValue(0.5)).toBeCloseTo(0);
    expect(optimalReserve()).toBe(0.5);
  });
});

describe('monopolyRevenue', () => {
  it('peaks at price 1/2 with revenue 1/4', () => {
    expect(monopolyRevenue(0.5)).toBeCloseTo(0.25);
    expect(monopolyRevenue(0.4)).toBeLessThan(0.25);
  });
});

describe('expectedRevenue', () => {
  it('the optimal reserve 1/2 beats nearby reserves, for any n', () => {
    for (const n of [1, 2, 3, 5]) {
      expect(expectedRevenue(0.5, n)).toBeGreaterThan(expectedRevenue(0.4, n));
      expect(expectedRevenue(0.5, n)).toBeGreaterThan(expectedRevenue(0.6, n));
    }
  });
  it('n=1 reduces to monopoly revenue', () => {
    expect(expectedRevenue(0.5, 1)).toBeCloseTo(0.25);
  });
});
