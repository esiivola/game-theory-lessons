import { describe, it, expect } from 'vitest';
import { maxIntervals, informativeExists, boundaryTwoInterval, twoIntervalActions } from './cheapTalk';

describe('maxIntervals', () => {
  it('allows two intervals at bias 1/8', () => {
    expect(maxIntervals(1 / 8)).toBe(2);
  });
  it('allows more intervals as the bias shrinks', () => {
    expect(maxIntervals(0.05)).toBe(3);
    expect(maxIntervals(0.02)).toBeGreaterThanOrEqual(4);
  });
  it('collapses to babbling (one interval) at bias 1/4 and above', () => {
    expect(maxIntervals(0.25)).toBe(1);
    expect(maxIntervals(0.4)).toBe(1);
  });
});

describe('informativeExists', () => {
  it('is true below 1/4 and false at or above it', () => {
    expect(informativeExists(0.1)).toBe(true);
    expect(informativeExists(0.25)).toBe(false);
  });
});

describe('two-interval equilibrium', () => {
  it('has boundary 1/4 at bias 1/8', () => {
    expect(boundaryTwoInterval(1 / 8)).toBeCloseTo(0.25);
  });
  it('induces the two interval midpoints as actions', () => {
    const [y1, y2] = twoIntervalActions(1 / 8); // a1 = 0.25
    expect(y1).toBeCloseTo(0.125); // midpoint of [0, 0.25]
    expect(y2).toBeCloseTo(0.625); // midpoint of [0.25, 1]
  });
});
