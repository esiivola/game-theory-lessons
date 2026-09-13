import { describe, expect, it } from 'vitest';
import { graduatedPenalty, resourceStep } from './commons';

describe('renewable common resource', () => {
  it('grows logistically and subtracts total harvest', () => {
    expect(resourceStep(50, [4, 4, 4, 4], 100, 0.8)).toEqual({
      growth: 20,
      harvest: 16,
      nextStock: 54,
    });
  });

  it('cannot fall below zero or rise above carrying capacity', () => {
    expect(resourceStep(5, [10, 10], 100, 0.8).nextStock).toBe(0);
    expect(resourceStep(100, [0], 100, 0.8).nextStock).toBe(100);
  });

  it('makes the penalty larger after repeated violations', () => {
    expect(graduatedPenalty(8, 4, 1, 2)).toBe(8);
    expect(graduatedPenalty(8, 4, 3, 2)).toBe(24);
  });
});
