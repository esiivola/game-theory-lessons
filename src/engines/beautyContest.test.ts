import { describe, it, expect } from 'vitest';
import { levelKGuess, target, winner } from './beautyContest';

describe('levelKGuess', () => {
  it('marches down the reasoning ladder', () => {
    expect(levelKGuess(0)).toBeCloseTo(50);
    expect(levelKGuess(1)).toBeCloseTo(33.33, 1);
    expect(levelKGuess(2)).toBeCloseTo(22.22, 1);
  });
});

describe('target', () => {
  it('is two-thirds of the average', () => {
    expect(target([30, 30, 30])).toBeCloseTo(20);
    expect(target([0, 60])).toBeCloseTo(20);
  });
});

describe('winner', () => {
  it('is the guess closest to the target', () => {
    // guesses 50,33,22 -> avg ~35, target ~23.3 -> 22 is closest (index 2)
    expect(winner([50, 33, 22])).toBe(2);
  });
  it('shows 0 loses against a real crowd', () => {
    // A crowd clustered around 22-33 with one 0: the 0 is far from the ~2/3-of-average target.
    const guesses = [0, 33, 22, 30, 25];
    expect(winner(guesses)).not.toBe(0);
  });
});
