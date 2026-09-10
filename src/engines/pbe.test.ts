import { describe, it, expect } from 'vitest';
import { acceptEV, receiverAccepts, poolingOnGiveIsPBE, equilibrium } from './pbe';

describe('receiver sequential rationality', () => {
  it('accepts iff the posterior of Friend is at least 1/2', () => {
    expect(receiverAccepts(0.6)).toBe(true);
    expect(receiverAccepts(0.5)).toBe(true); // indifferent, accepts at the threshold
    expect(receiverAccepts(0.4)).toBe(false);
  });
  it('accept EV is 2b - 1', () => {
    expect(acceptEV(0.6)).toBeCloseTo(0.2);
    expect(acceptEV(0.4)).toBeCloseTo(-0.2);
  });
});

describe('pooling on Give', () => {
  it('is a PBE when the prior is at least 1/2', () => {
    expect(poolingOnGiveIsPBE(0.6)).toBe(true);
    expect(equilibrium(0.6)).toBe('pool-give');
  });
  it('fails at p = 0.4, where the equilibrium is pooling on Not', () => {
    expect(poolingOnGiveIsPBE(0.4)).toBe(false);
    expect(equilibrium(0.4)).toBe('pool-not');
  });
});
