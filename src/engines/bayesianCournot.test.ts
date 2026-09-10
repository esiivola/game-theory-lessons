import { describe, it, expect } from 'vitest';
import { rivalBest, equilibriumQ1, firm1Profit, equilibriumRivalQ } from './bayesianCournot';

describe('rivalBest', () => {
  it('a low-cost rival produces more than a high-cost one', () => {
    expect(rivalBest(5, 0)).toBeCloseTo(3.5);
    expect(rivalBest(5, 6)).toBeCloseTo(0.5);
  });
});

describe('equilibriumQ1', () => {
  it('is 5 at an even prior', () => {
    expect(equilibriumQ1(0.5)).toBeCloseTo(5);
  });
  it('falls toward 4 as the rival is surely low-cost', () => {
    expect(equilibriumQ1(1)).toBeCloseTo(4);
    expect(equilibriumQ1(0)).toBeCloseTo(6); // surely high-cost rival -> firm 1 expands
    expect(equilibriumQ1(1)).toBeLessThan(equilibriumQ1(0));
  });
});

describe('equilibriumRivalQ', () => {
  it('gives the type-conditional quantities 3.5 and 0.5 at an even prior', () => {
    const { low, high } = equilibriumRivalQ(0.5);
    expect(low).toBeCloseTo(3.5);
    expect(high).toBeCloseTo(0.5);
  });
});

describe('firm1Profit', () => {
  it('is maximized at the Bayes-Nash quantity, holding the rival at equilibrium', () => {
    const q = equilibriumQ1(0.5);
    const { low, high } = equilibriumRivalQ(0.5);
    const best = firm1Profit(q, 0.5, low, high);
    expect(best).toBeGreaterThan(firm1Profit(q - 1, 0.5, low, high));
    expect(best).toBeGreaterThan(firm1Profit(q + 1, 0.5, low, high));
  });
});
