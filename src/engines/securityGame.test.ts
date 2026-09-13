import { describe, it, expect } from 'vitest';
import {
  attackProbabilities,
  attackerTarget,
  behavioralExpectedLoss,
  expectedLoss,
  optimalBehavioralCoverageTwo,
  optimalCoverageTwo,
} from './securityGame';

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

  it('a zero-precision attacker chooses both targets equally', () => {
    expect(attackProbabilities([0.8, 0.2], [10, 5], 0)).toEqual([0.5, 0.5]);
  });

  it('a high-precision attacker nearly always chooses the better exposed target', () => {
    const probabilities = attackProbabilities([0.5, 0.5], [10, 5], 5);
    expect(probabilities[0]).toBeGreaterThan(0.999);
    expect(probabilities[1]).toBeLessThan(0.001);
  });

  it('QRE loss weights each target loss by its attack probability', () => {
    expect(behavioralExpectedLoss([0.5, 0.5], [10, 5], 0)).toBeCloseTo(3.75);
  });

  it('a noisy attacker shifts optimal coverage away from the minimax mix', () => {
    const noisy = optimalBehavioralCoverageTwo(10, 5, 0.5);
    expect(noisy).toBeGreaterThan(2 / 3);
    expect(noisy).toBeLessThan(0.75);
    expect(behavioralExpectedLoss([noisy, 1 - noisy], [10, 5], 0.5))
      .toBeLessThan(behavioralExpectedLoss([2 / 3, 1 / 3], [10, 5], 0.5));
  });
});
