import { describe, it, expect } from 'vitest';
import { bestResponseQ, cournotNash, profit, stackelbergLeader } from './oligopoly';

// Standard course numbers: P = 120 - Q, marginal cost c = 0.
const a = 120, c = 0;

describe('bestResponseQ', () => {
  it('is (a - c - qOther)/2', () => {
    expect(bestResponseQ(a, c, 40)).toBe(40);
    expect(bestResponseQ(a, c, 60)).toBe(30);
  });
  it('never goes negative', () => {
    expect(bestResponseQ(a, c, 200)).toBe(0);
  });
});

describe('cournotNash', () => {
  it('is (a - c)/3, so 40 each here', () => {
    expect(cournotNash(a, c)).toBe(40);
  });
  it('is the fixed point of the best-response map', () => {
    const q = cournotNash(a, c);
    expect(bestResponseQ(a, c, q)).toBeCloseTo(q);
  });
  it('drops with marginal cost', () => {
    expect(cournotNash(120, 30)).toBe(30);
  });
});

describe('profit', () => {
  it('is 1600 per firm at the Cournot equilibrium', () => {
    expect(profit(a, c, 40, 40)).toBe(1600);
  });
  it('is zero once total output drives price to the floor', () => {
    expect(profit(a, c, 100, 100)).toBe(0);
  });
});

describe('stackelberg', () => {
  it('leader commits 60, follower best-responds 30', () => {
    const q1 = stackelbergLeader(a, c);
    expect(q1).toBe(60);
    expect(bestResponseQ(a, c, q1)).toBe(30);
  });
  it('the leader earns 1800, beating the 1600 of simultaneous play', () => {
    const q1 = stackelbergLeader(a, c);
    const q2 = bestResponseQ(a, c, q1);
    expect(profit(a, c, q1, q2)).toBe(1800);
    expect(profit(a, c, q1, q2)).toBeGreaterThan(profit(a, c, 40, 40));
  });
});
