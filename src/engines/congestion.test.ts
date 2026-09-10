import { describe, it, expect } from 'vitest';
import { potential, isEquilibrium, bestResponsePath } from './congestion';

describe('congestion potential game', () => {
  it('x=3 on road A is a pure Nash equilibrium', () => {
    expect(isEquilibrium(3)).toBe(true);
    expect(isEquilibrium(0)).toBe(false); // everyone on B would rather move to A
  });
  it('the potential is lowest at the equilibrium region', () => {
    expect(potential(3)).toBeLessThanOrEqual(potential(0));
    expect(potential(3)).toBeLessThanOrEqual(potential(4));
  });
  it('best-response dynamics from all-on-B stop at 2 on A, matching the lesson', () => {
    expect(bestResponsePath(0)).toEqual([0, 1, 2]);
    expect(isEquilibrium(2)).toBe(true); // a third mover would pay 3 on A, no better than B
  });
});
