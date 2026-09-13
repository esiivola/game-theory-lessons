import { describe, it, expect } from 'vitest';
import { agentUtility, certaintyEquivalent, effortChoice, minBonusForEffort, principalProfit } from './moralHazard';

describe('minBonusForEffort', () => {
  it('is 37.5: the spread that satisfies incentive compatibility', () => {
    expect(minBonusForEffort).toBeCloseTo(37.5);
  });
});

describe('effortChoice', () => {
  it('works only when the bonus clears the IC threshold', () => {
    expect(effortChoice(37.5)).toBe(0);
    expect(effortChoice(38)).toBe(1);
    expect(effortChoice(30)).toBe(0);
  });
});

describe('a strict incentive contract (base 0, bonus 38)', () => {
  it('gives the principal profit 49.6, beating the no-effort contract at 40', () => {
    expect(principalProfit(0, 38)).toBeCloseTo(49.6);
    expect(principalProfit(0, 0)).toBeCloseTo(40); // pay nothing, agent shirks
  });
  it('leaves the agent a rent of 15.4', () => {
    expect(agentUtility(0, 38)).toBeCloseTo(15.4);
  });
});

describe('risk-averse agent', () => {
  it('has the risk-neutral expected payoff when risk aversion is zero', () => {
    expect(certaintyEquivalent(0, 38, 1, 0)).toBeCloseTo(15.4);
  });
  it('values the same noisy contract less as risk aversion rises', () => {
    expect(certaintyEquivalent(0, 38, 1, 0.05)).toBeLessThan(certaintyEquivalent(0, 38, 1, 0));
  });
  it('can stop preferring effort under the same risky bonus', () => {
    expect(effortChoice(38, 0)).toBe(1);
    expect(effortChoice(38, 0.05)).toBe(0);
  });
});
