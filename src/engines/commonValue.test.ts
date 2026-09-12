import { describe, it, expect } from 'vitest';
import { drawSignals, roundOutcome } from './commonValue';

describe('drawSignals', () => {
  it('centres signals on V with noise up to the spread', () => {
    expect(drawSignals(50, 3, 10, () => 0.5)).toEqual([50, 50, 50]); // rng 0.5 -> zero noise
    expect(drawSignals(50, 2, 10, () => 0)).toEqual([40, 40]);        // rng 0 -> -spread
    expect(drawSignals(50, 2, 10, () => 1)).toEqual([60, 60]);        // rng 1 -> +spread
  });
});

describe('roundOutcome (the winner\'s curse)', () => {
  it('second-price cushions the winner', () => {
    // True value 50; you (index 0) overestimated at 60 and win, paying the runner-up bid 45.
    const o = roundOutcome(50, [60, 45, 40], 'spa');
    expect(o.winner).toBe(0);
    expect(o.price).toBe(45);
    expect(o.winnerProfit).toBe(5);
  });
  it('bidding your inflated signal in a first-price auction loses money', () => {
    // Same signals as bids: the winner pays their own 60 for something worth 50.
    const o = roundOutcome(50, [60, 45, 40], 'fpa');
    expect(o.winner).toBe(0);
    expect(o.price).toBe(60);
    expect(o.winnerProfit).toBe(-10); // the curse
  });
});
