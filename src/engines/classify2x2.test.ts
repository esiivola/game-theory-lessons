import { describe, it, expect } from 'vitest';
import { pureNash, classify, type M2 } from './classify2x2';

const PD: M2 = [[[3, 3], [0, 5]], [[5, 0], [1, 1]]];
const STAG: M2 = [[[4, 4], [0, 3]], [[3, 0], [3, 3]]];
const BOS: M2 = [[[2, 1], [0, 0]], [[0, 0], [1, 2]]];
const CHICKEN: M2 = [[[6, 6], [2, 7]], [[7, 2], [0, 0]]];
const PENNIES: M2 = [[[1, -1], [-1, 1]], [[-1, 1], [1, -1]]];

describe('pureNash count', () => {
  it('PD has one', () => { expect(pureNash(PD).length).toBe(1); });
  it('Stag Hunt has two (both diagonal)', () => { expect(pureNash(STAG)).toEqual([[0, 0], [1, 1]]); });
  it('Battle of the Sexes has two (both diagonal)', () => { expect(pureNash(BOS).length).toBe(2); });
  it('Chicken has two (both off-diagonal)', () => { expect(pureNash(CHICKEN)).toEqual([[0, 1], [1, 0]]); });
  it('Matching Pennies has none', () => { expect(pureNash(PENNIES).length).toBe(0); });
});

describe('classify', () => {
  it('names each classic game', () => {
    expect(classify(PD)).toBe('prisoners-dilemma');
    expect(classify(STAG)).toBe('stag-hunt');
    expect(classify(BOS)).toBe('battle-of-the-sexes');
    expect(classify(CHICKEN)).toBe('chicken');
    expect(classify(PENNIES)).toBe('matching-pennies');
  });
  it('separates Stag Hunt (players agree) from Battle of the Sexes (players disagree)', () => {
    // Stag Hunt: both prefer the (Stag,Stag) equilibrium.
    expect(classify(STAG)).toBe('stag-hunt');
    // BoS: each prefers a different equilibrium.
    expect(classify(BOS)).toBe('battle-of-the-sexes');
  });
});
