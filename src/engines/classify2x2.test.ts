import { describe, it, expect } from 'vitest';
import {
  pureNash, classify, strictlyDominant, isStrictlyCompetitive, isDominanceSolvable, type M2,
} from './classify2x2';

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

describe('classify tells the truth on games that only look like a classic', () => {
  it('a cycling game that is not strictly competitive is not Matching Pennies', () => {
    const cycling: M2 = [[[1, -1], [-1, 1]], [[-1, 1], [3, -1]]];
    expect(pureNash(cycling).length).toBe(0);
    expect(classify(cycling)).toBe('cycling');
    expect(classify(PENNIES)).toBe('matching-pennies'); // strictly opposed, so it is
  });

  it('an affine rescaling of Matching Pennies still counts as strictly competitive', () => {
    const scaled: M2 = [[[11, 4], [9, 6]], [[9, 6], [11, 4]]]; // u1 = 10 + p, u2 = 5 - p/2
    expect(isStrictlyCompetitive(scaled)).toBe(true);
    expect(classify(scaled)).toBe('matching-pennies');
  });

  it('a Pareto-dominated lone equilibrium without dominance is not a Prisoner’s Dilemma', () => {
    // Unique equilibrium at (Top, Right) paying (1,0), beaten for both by (Bottom, Left)'s (2,1).
    // Neither player holds a strictly dominant strategy, so the dilemma's engine is missing.
    const noDominance: M2 = [[[0, 0], [1, 0]], [[2, 1], [0, 2]]];
    expect(pureNash(noDominance)).toEqual([[0, 1]]);
    expect(strictlyDominant(noDominance, 0)).toBeNull();
    expect(strictlyDominant(noDominance, 1)).toBeNull();
    expect(classify(noDominance)).toBe('general');
    expect(classify(PD)).toBe('prisoners-dilemma'); // dominance plus a dominated outcome
  });

  it('one player’s dominance plus a dominated outcome is dominance-solvable, not a dilemma', () => {
    // The column player has a strictly dominant choice and the row player a strict reply, but the
    // row player has no dominant strategy, so this is not the two-sided trap of the dilemma.
    const oneSided: M2 = [[[0, 0], [1, 1]], [[2, 2], [0, 3]]];
    expect(strictlyDominant(oneSided, 0)).toBeNull();
    expect(strictlyDominant(oneSided, 1)).toBe(1);
    expect(classify(oneSided)).toBe('dominance-solvable');
  });

  it('two equilibria in one row are an indifferent player, not anti-coordination', () => {
    const indifferent: M2 = [[[2, 1], [2, 1]], [[0, 0], [0, 0]]];
    expect(pureNash(indifferent)).toEqual([[0, 0], [0, 1]]);
    expect(classify(indifferent)).toBe('general');
  });

  it('tied coordination equilibria are pure coordination, not a Stag Hunt', () => {
    const tied: M2 = [[[1, 1], [0, 0]], [[0, 0], [1, 1]]];
    expect(classify(tied)).toBe('pure-coordination');
    expect(classify(STAG)).toBe('stag-hunt'); // ranked the same way, so the tension is real
  });

  it('dominance-solvability needs a strict best reply, not just a dominant strategy', () => {
    // Row 0 strictly dominates, but the column player is indifferent inside it.
    const noStrictReply: M2 = [[[2, 1], [2, 1]], [[0, 0], [0, 0]]];
    expect(strictlyDominant(noStrictReply, 0)).toBe(0);
    expect(isDominanceSolvable(noStrictReply)).toBe(false);
    // Here the column player does have a strict reply, so dominance resolves the game.
    const solvable: M2 = [[[2, 1], [2, 3]], [[0, 0], [0, 0]]];
    expect(isDominanceSolvable(solvable)).toBe(true);
    expect(classify(solvable)).toBe('dominance-solvable');
  });

  it('four identical cells are every-cell equilibria, reported as general', () => {
    const flat: M2 = [[[1, 1], [1, 1]], [[1, 1], [1, 1]]];
    expect(pureNash(flat).length).toBe(4);
    expect(classify(flat)).toBe('general');
  });
});
