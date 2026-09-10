import { describe, it, expect } from 'vitest';
import {
  grimThreshold, move, stagePayoff, playMatch, discounted, expectedDiscounted, tournament,
  STD_PD, type Play,
} from './repeatedPd';

describe('grimThreshold', () => {
  it('is (T-R)/(T-P), so 1/2 for the standard numbers', () => {
    expect(grimThreshold(STD_PD)).toBeCloseTo(0.5);
  });
  it('rises when the punishment is milder', () => {
    expect(grimThreshold({ T: 5, R: 3, P: 2, S: 0 })).toBeCloseTo(2 / 3);
  });
});

describe('move', () => {
  const none: Play[] = [];
  it('tit-for-tat cooperates first, then copies the opponent', () => {
    expect(move('tft', none, none)).toBe('C');
    expect(move('tft', ['C'], ['D'])).toBe('D');
    expect(move('tft', ['D'], ['C'])).toBe('C');
  });
  it('grim defects forever after a single opponent defection', () => {
    expect(move('grim', ['C', 'C'], ['C', 'C'])).toBe('C');
    expect(move('grim', ['C', 'C'], ['C', 'D'])).toBe('D');
  });
  it('allc and alld are constant', () => {
    expect(move('allc', none, ['D'])).toBe('C');
    expect(move('alld', none, ['C'])).toBe('D');
  });
});

describe('stagePayoff', () => {
  it('matches T, R, P, S', () => {
    expect(stagePayoff('C', 'C')).toBe(3); // R
    expect(stagePayoff('C', 'D')).toBe(0); // S
    expect(stagePayoff('D', 'C')).toBe(5); // T
    expect(stagePayoff('D', 'D')).toBe(1); // P
  });
});

describe('playMatch', () => {
  it('grim vs grim cooperates every round', () => {
    const m = playMatch('grim', 'grim', 5);
    expect(m.moves.every(([a, b]) => a === 'C' && b === 'C')).toBe(true);
  });
  it('tit-for-tat vs always-defect defects from round two on', () => {
    const m = playMatch('tft', 'alld', 4);
    expect(m.moves[0]).toEqual(['C', 'D']); // tft cooperates once, gets suckered
    expect(m.moves.slice(1).every(([a]) => a === 'D')).toBe(true);
  });
});

describe('discounted', () => {
  it('sums a constant stream to R/(1-delta) in the limit', () => {
    const stream = Array(600).fill(3);
    expect(discounted(stream, 0.6)).toBeCloseTo(3 / (1 - 0.6), 4);
  });
});

describe('the discounting threshold decides cooperation', () => {
  it('above 1/2, cooperating beats a one-time defection against grim', () => {
    const coop = expectedDiscounted('grim', 'grim', 0.9).a;
    const cheat = expectedDiscounted('alld', 'grim', 0.9).a;
    expect(coop).toBeGreaterThan(cheat);
  });
  it('below 1/2, the one-time defection wins', () => {
    const coop = expectedDiscounted('grim', 'grim', 0.4).a;
    const cheat = expectedDiscounted('alld', 'grim', 0.4).a;
    expect(cheat).toBeGreaterThan(coop);
  });
});

describe('tournament', () => {
  it('returns every strategy, scored and sorted descending', () => {
    const table = tournament(['allc', 'tft', 'grim', 'alld'], 0.9);
    expect(table.map((r) => r.id).sort()).toEqual(['allc', 'alld', 'grim', 'tft']);
    for (let i = 1; i < table.length; i++) {
      expect(table[i - 1].score).toBeGreaterThanOrEqual(table[i].score);
    }
  });
});
