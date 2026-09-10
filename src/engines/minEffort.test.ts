import { describe, it, expect } from 'vitest';
import { payoff, symmetricPayoff, bestResponse, isEquilibrium, STD } from './minEffort';

describe('payoff', () => {
  it('rewards the group minimum and charges your own effort', () => {
    expect(payoff(7, 7, STD)).toBeCloseTo(1.3); // all high
    expect(payoff(1, 1, STD)).toBeCloseTo(0.7); // all low
    expect(payoff(7, 1, STD)).toBeCloseTo(0.1); // you tried hard, someone slacked: worst
  });
});

describe('symmetricPayoff', () => {
  it('rises in the common effort, since b > c', () => {
    expect(symmetricPayoff(7, STD)).toBeGreaterThan(symmetricPayoff(1, STD));
    expect(symmetricPayoff(7, STD)).toBeCloseTo(1.3);
    expect(symmetricPayoff(1, STD)).toBeCloseTo(0.7);
  });
});

describe('bestResponse', () => {
  it('matches the minimum you expect from others', () => {
    expect(bestResponse(4, STD)).toBe(4);
  });
  it('never exceeds the max or drops below the min effort', () => {
    expect(bestResponse(9, STD)).toBe(7);
    expect(bestResponse(0, STD)).toBe(1);
  });
});

describe('isEquilibrium', () => {
  it('every common effort level is a Nash equilibrium', () => {
    for (let x = 1; x <= 7; x++) expect(isEquilibrium(x, STD)).toBe(true);
  });
  it('the all-7 equilibrium Pareto-dominates the all-1 equilibrium', () => {
    expect(symmetricPayoff(7, STD)).toBeGreaterThan(symmetricPayoff(1, STD));
  });
});
