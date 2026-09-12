import { describe, it, expect } from 'vitest';
import { beats, score, drawMove, bestResponseToMix, type Move } from './rps';

describe('beats', () => {
  it('names the move that beats each move, cyclically', () => {
    expect(beats(0)).toBe(1); // paper beats rock
    expect(beats(1)).toBe(2); // scissors beats paper
    expect(beats(2)).toBe(0); // rock beats scissors
  });
});

describe('score', () => {
  it('is +1 for a win, -1 for a loss, 0 for a tie', () => {
    expect(score(0, 2)).toBe(1); // rock over scissors
    expect(score(2, 0)).toBe(-1); // scissors under rock
    expect(score(1, 0)).toBe(1); // paper over rock
    expect(score(1, 1)).toBe(0); // tie
  });
  it('is antisymmetric', () => {
    for (const a of [0, 1, 2] as Move[]) {
      for (const b of [0, 1, 2] as Move[]) {
        // `|| 0` normalizes negative zero, which -1 * 0 produces and Object.is treats as distinct.
        expect(score(a, b)).toBe(-score(b, a) || 0);
      }
    }
  });
});

describe('drawMove', () => {
  it('draws from the declared intervals', () => {
    expect(drawMove([0.6, 0.2, 0.2], () => 0)).toBe(0);
    expect(drawMove([0.6, 0.2, 0.2], () => 0.7)).toBe(1);
    expect(drawMove([0.6, 0.2, 0.2], () => 0.9)).toBe(2);
  });
});

describe('bestResponseToMix', () => {
  it('counters the most likely move', () => {
    expect(bestResponseToMix([0.6, 0.2, 0.2], () => 0)).toBe(1); // paper beats likely Rock
    expect(bestResponseToMix([0.2, 0.6, 0.2], () => 0)).toBe(2); // scissors beats likely Paper
  });
  it('may choose any move against the uniform equilibrium mix', () => {
    expect(bestResponseToMix([1 / 3, 1 / 3, 1 / 3], () => 0)).toBe(1);
    expect(bestResponseToMix([1 / 3, 1 / 3, 1 / 3], () => 0.99)).toBe(0);
  });
});
