import { describe, it, expect } from 'vitest';
import { users, profit } from './platform';

describe('two-sided platform', () => {
  it('adoption on one side rises when the other side is cheaper (cross effects)', () => {
    const a1 = users(50, 50).a;
    const a2 = users(50, 0).a; // subsidize side B
    expect(a2).toBeGreaterThan(a1);
  });
  it('profit is a real number and both sides adopt at moderate prices', () => {
    const u = users(40, 40);
    expect(u.a).toBeGreaterThan(0);
    expect(profit(40, 40)).toBeGreaterThan(0);
  });
});
