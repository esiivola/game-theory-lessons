import { describe, it, expect } from 'vitest';
import { inFeasible, isIndividuallyRational, supportable, classify, MINMAX } from './folk';

describe('inFeasible', () => {
  it('accepts the hull vertices and interior points', () => {
    expect(inFeasible([3, 3])).toBe(true);
    expect(inFeasible([1, 1])).toBe(true);
    expect(inFeasible([4, 1])).toBe(true); // interior
    expect(inFeasible([2, 2])).toBe(true);
  });
  it('rejects points outside the hull', () => {
    expect(inFeasible([0.5, 0.5])).toBe(false); // below the (P,P)-(T,S) edge
    expect(inFeasible([5, 5])).toBe(false);
  });
});

describe('individual rationality', () => {
  it('requires both payoffs strictly above the minmax of 1', () => {
    expect(MINMAX).toBe(1);
    expect(isIndividuallyRational([3, 3])).toBe(true);
    expect(isIndividuallyRational([3.5, 2])).toBe(true);
    expect(isIndividuallyRational([4, 0.5])).toBe(false);
  });
  it('rejects the boundary, where a player sits exactly at its minmax', () => {
    // Holding player 2 to exactly 1 in the PD means permanent mutual defection, which caps
    // player 1 at 1 as well, so (4, 1) and (1, 1) are not equilibrium payoffs.
    expect(isIndividuallyRational([4, 1])).toBe(false);
    expect(isIndividuallyRational([1, 1])).toBe(false);
  });
});

describe('classify / supportable', () => {
  it('(3,3) is supportable', () => {
    expect(classify([3, 3])).toBe('supportable');
    expect(supportable([3, 3])).toBe(true);
  });
  it('(3.5,2) is supportable, an asymmetric equilibrium payoff', () => {
    expect(inFeasible([3.5, 2])).toBe(true);
    expect(classify([3.5, 2])).toBe('supportable');
  });
  it('(4,1) is feasible but sits on the minmax boundary, so it is not supportable', () => {
    expect(inFeasible([4, 1])).toBe(true);
    expect(classify([4, 1])).toBe('below-minmax');
  });
  it('(0.5,0.5) is below minmax and infeasible', () => {
    // It is also outside the hull, so "infeasible" is reported first.
    expect(classify([0.5, 0.5])).toBe('infeasible');
  });
  it('a feasible point below minmax is flagged below-minmax', () => {
    // (4, 0.3): inside the hull (near the (T,S) corner) but player 2 is below the minmax of 1.
    expect(inFeasible([4, 0.3])).toBe(true);
    expect(classify([4, 0.3])).toBe('below-minmax');
  });
});
