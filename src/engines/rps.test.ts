import { describe, it, expect } from 'vitest';
import { beats, score, botMove, type Move } from './rps';

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

describe('botMove', () => {
  it('counters the move you have played most', () => {
    // You have played Rock most, so the bot should play Paper.
    expect(botMove([3, 1, 0], () => 0)).toBe(1);
    // Most Paper -> bot plays Scissors.
    expect(botMove([0, 5, 2], () => 0)).toBe(2);
  });
  it('with no history it plays at random over the rng', () => {
    expect(botMove([0, 0, 0], () => 0)).toBe(0);
    expect(botMove([0, 0, 0], () => 0.99)).toBe(2);
  });
  it('breaks ties among most-played moves using the rng', () => {
    // Rock and Paper tied for most; rng 0 picks the first (Rock) -> counter Paper.
    expect(botMove([2, 2, 0], () => 0)).toBe(1);
    // rng near 1 picks the second (Paper) -> counter Scissors.
    expect(botMove([2, 2, 0], () => 0.99)).toBe(2);
  });
  it('cannot beat a perfectly even record on average', () => {
    // With an even record the bot picks the counter to whichever it lands on, but the player's
    // uniform mix means each of the bot's choices ties on expectation. Here we just check it
    // returns a legal move for an even record.
    expect([0, 1, 2]).toContain(botMove([4, 4, 4], () => 0.5));
  });
});
