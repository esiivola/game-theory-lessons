import { describe, it, expect } from 'vitest';
import { attackerTarget, expectedLoss, optimalCoverageTwo } from './securityGame';

describe('security game', () => {
  it('optimal coverage of the $10 target (vs $5) is 2/3', () => {
    expect(optimalCoverageTwo(10, 5)).toBeCloseTo(2 / 3);
  });
  it('at the optimal mix the attacker is indifferent and expected loss is 10/3', () => {
    const c0 = optimalCoverageTwo(10, 5);
    expect(expectedLoss([c0, 1 - c0], [10, 5])).toBeCloseTo(10 / 3);
  });
  it('always guarding the $10 target invites an attack on the $5 target for loss 5', () => {
    expect(attackerTarget([1, 0], [10, 5])).toBe(1);
    expect(expectedLoss([1, 0], [10, 5])).toBe(5); // worse than 3.33
  });
});
