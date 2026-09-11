import { describe, it, expect } from 'vitest';
import { colEV, rowGuarantee, indifferenceP, securityP, guaranteedValue, type Matrix2 } from './mixed';

// Matching Pennies: match wins for row. Symmetric, mixed Nash at p = 1/2.
const mp: Matrix2 = [[[1, -1], [-1, 1]], [[-1, 1], [1, -1]]];
// Battle of the Sexes: (2,1)/(0,0)/(0,0)/(1,2). Row's mix makes column indifferent at p = 2/3.
const bos: Matrix2 = [[[2, 1], [0, 0]], [[0, 0], [1, 2]]];
// Zero-sum raid game, payoffs to row. Maximin at p = 2/5, value 1/5.
const zs: Matrix2 = [[[2, -2], [-1, 1]], [[-1, 1], [1, -1]]];

describe('colEV', () => {
  it('is the column player expected payoff to each action', () => {
    // At p = 0 the row plays bottom for sure.
    expect(colEV(mp, 0)).toEqual([mp[1][0][1], mp[1][1][1]]);
    // At the equilibrium mix both of the column player actions pay the same (0 here).
    expect(colEV(mp, 0.5)[0]).toBeCloseTo(0);
    expect(colEV(mp, 0.5)[1]).toBeCloseTo(0);
  });
});

describe('indifferenceP', () => {
  it('finds 1/2 for Matching Pennies', () => {
    expect(indifferenceP(mp)).toBeCloseTo(0.5);
  });
  it('finds 2/3 for Battle of the Sexes', () => {
    expect(indifferenceP(bos)).toBeCloseTo(2 / 3);
  });
  it('returns null when the crossing lies outside [0,1]', () => {
    // Column always strictly prefers its left action; the lines never cross inside the unit interval.
    const dom: Matrix2 = [[[0, 1], [0, 0]], [[0, 3], [0, 0]]];
    expect(indifferenceP(dom)).toBeNull();
  });
  it('returns null when the two lines are parallel', () => {
    const flat: Matrix2 = [[[0, 2], [0, 0]], [[0, 2], [0, 0]]];
    expect(indifferenceP(flat)).toBeNull();
  });
});

describe('securityP and guaranteedValue', () => {
  it('gives the maximin mix and the value of the zero-sum game', () => {
    const p = securityP(zs);
    expect(p).toBeCloseTo(0.4);
    expect(guaranteedValue(zs, p as number)).toBeCloseTo(0.2);
  });
  it('guaranteedValue is the worse of the two pure replies', () => {
    const [a, b] = rowGuarantee(zs, 0.4);
    expect(guaranteedValue(zs, 0.4)).toBeCloseTo(Math.min(a, b));
  });
  it('the guaranteed value peaks at the maximin mix', () => {
    const p = securityP(zs) as number;
    expect(guaranteedValue(zs, p)).toBeGreaterThan(guaranteedValue(zs, p - 0.15));
    expect(guaranteedValue(zs, p)).toBeGreaterThan(guaranteedValue(zs, p + 0.15));
  });
});

// The expected-utility lesson claims a positive affine rescaling of every payoff leaves the
// players' choices untouched, which is the von Neumann-Morgenstern uniqueness result applied to a
// game. It is an easy claim to assert and a cheap one to check, so check it on the course's games.
describe('positive affine invariance', () => {
  const affine = (m: Matrix2, a: number, b: number): Matrix2 =>
    m.map((row) => row.map((c) => [a * c[0] + b, a * c[1] + b])) as Matrix2;

  const games: Record<string, Matrix2> = {
    'battle of the sexes': [[[2, 1], [0, 0]], [[0, 0], [1, 2]]],
    chicken: [[[6, 6], [2, 7]], [[7, 2], [0, 0]]],
    'matching pennies': [[[1, -1], [-1, 1]], [[-1, 1], [1, -1]]],
    'the raid game': zs,
  };

  for (const [name, m] of Object.entries(games)) {
    it(`leaves the mix and the maximin mix of ${name} exactly where they were`, () => {
      const t = affine(m, 10, 5);
      expect(indifferenceP(t)).toBe(indifferenceP(m));
      expect(securityP(t)).toBe(securityP(m));
    });
  }

  it('rescales the value itself by the same map, since the payoffs really do move', () => {
    expect(guaranteedValue(affine(zs, 10, 5), 0.4)).toBeCloseTo(10 * guaranteedValue(zs, 0.4) + 5);
  });

  it('is sign-blind on its own: the indifference point survives even a negative multiplier', () => {
    // Worth pinning down, because it is easy to assume otherwise. Negating every payoff negates
    // both sides of colEV(left) = colEV(right), so the crossing sits at the same p. What a
    // negative multiplier reverses is which side of that crossing is a best reply, which shows up
    // in the equilibrium set (see classify2x2.test.ts), not in this number.
    const bos = games['battle of the sexes'];
    expect(indifferenceP(affine(bos, -1, 0))).toBe(indifferenceP(bos));
  });
});
