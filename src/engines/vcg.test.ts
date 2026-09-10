import { describe, it, expect } from 'vitest';
import { solve } from './vcg';

describe('VCG on two items', () => {
  it('splits the units between B and C when that beats giving the pair to A', () => {
    const o = solve(10, 8, 6);
    expect(o.allocation).toBe('BC');
    expect(o.welfare).toBe(14);
    expect(o.payments.B).toBe(4); // max(10,6) - 6
    expect(o.payments.C).toBe(2); // max(10,8) - 8
  });
  it('each winner pays below its own value (the externality)', () => {
    const o = solve(10, 8, 6);
    expect(o.payments.B).toBeLessThan(8);
    expect(o.payments.C).toBeLessThan(6);
  });
  it('gives the pair to A when A values it most, charging the displaced welfare', () => {
    const o = solve(20, 8, 6);
    expect(o.allocation).toBe('A');
    expect(o.payments.A).toBe(14); // b + c
  });
});
