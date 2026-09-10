import { describe, it, expect } from 'vitest';
import { u, certaintyEquivalent } from './utility';

describe('certaintyEquivalent of a 50/50 on 0 or 100', () => {
  it('equals the expected value 50 when risk-neutral (r = 1)', () => {
    expect(certaintyEquivalent(0, 100, 1)).toBeCloseTo(50);
  });
  it('is 25 for square-root utility (r = 1/2)', () => {
    expect(certaintyEquivalent(0, 100, 0.5)).toBeCloseTo(25);
  });
  it('falls below the expected value as the agent gets more risk-averse', () => {
    expect(certaintyEquivalent(0, 100, 0.7)).toBeLessThan(50);
    expect(certaintyEquivalent(0, 100, 0.3)).toBeLessThan(certaintyEquivalent(0, 100, 0.7));
  });
});

describe('u', () => {
  it('is increasing in wealth', () => {
    expect(u(100, 0.5)).toBeGreaterThan(u(50, 0.5));
  });
});
