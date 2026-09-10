import { describe, it, expect } from 'vitest';
import { effortChoice, agentUtility, principalProfit, minBonusForEffort } from './moralHazard';

describe('minBonusForEffort', () => {
  it('is 37.5: the spread that satisfies incentive compatibility', () => {
    expect(minBonusForEffort).toBeCloseTo(37.5);
  });
});

describe('effortChoice', () => {
  it('works only when the bonus clears the IC threshold', () => {
    expect(effortChoice(37.5)).toBe(1);
    expect(effortChoice(30)).toBe(0);
  });
});

describe('the optimal incentive contract (base 0, bonus 37.5)', () => {
  it('gives the principal profit 50, beating the no-effort contract at 40', () => {
    expect(principalProfit(0, 37.5)).toBeCloseTo(50);
    expect(principalProfit(0, 0)).toBeCloseTo(40); // pay nothing, agent shirks
  });
  it('leaves the agent a rent of 15 (moral hazard cost equals the rent)', () => {
    expect(agentUtility(0, 37.5)).toBeCloseTo(15);
    // First-best with observable effort would let the principal keep 65; the 15 gap is the rent.
    expect(65 - principalProfit(0, 37.5)).toBeCloseTo(15);
  });
});
