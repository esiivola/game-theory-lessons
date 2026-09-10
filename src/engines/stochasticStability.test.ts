import { describe, it, expect } from 'vitest';
import { stagThreshold, bestResponse, basins, stochasticallyStable } from './stochasticStability';

describe('Stag Hunt stochastic stability', () => {
  it('Stag is a best response only when the partner is very likely to hunt', () => {
    expect(stagThreshold()).toBeCloseTo(0.75);
    expect(bestResponse(0.8)).toBe('stag');
    expect(bestResponse(0.5)).toBe('hare');
  });
  it('the Hare basin is larger, so Hare is risk-dominant', () => {
    const b = basins();
    expect(b.hare).toBeCloseTo(0.75);
    expect(b.stag).toBeCloseTo(0.25);
    expect(b.hare).toBeGreaterThan(0.5);
  });
  it('the stochastically stable convention is Hare, despite Stag paying more', () => {
    expect(stochasticallyStable()).toBe('hare');
  });
});
