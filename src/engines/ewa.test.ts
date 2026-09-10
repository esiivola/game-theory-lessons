import { describe, it, expect } from 'vitest';
import { ewaUpdate, choiceProbs } from './ewa';

describe('EWA update', () => {
  const start = { A: [0, 0], N: 1 };
  it('delta = 0 is reinforcement: only the played action is updated', () => {
    const s = ewaUpdate(start, 0, [10, 8], 0.5, 0, 0.5);
    // action 0 played, gets its payoff; action 1 foregone, weight 0.
    expect(s.A[0]).toBeGreaterThan(0);
    expect(s.A[1]).toBe(0);
  });
  it('delta = 1 is belief learning: both actions updated by their would-be payoff', () => {
    const s = ewaUpdate(start, 0, [10, 8], 0.5, 1, 0.5);
    expect(s.A[0]).toBeGreaterThan(0);
    expect(s.A[1]).toBeGreaterThan(0);
  });
});

describe('choiceProbs', () => {
  it('favours the higher-attraction action and sums to 1', () => {
    const p = choiceProbs([1, 0], 2);
    expect(p[0]).toBeGreaterThan(p[1]);
    expect(p[0] + p[1]).toBeCloseTo(1);
  });
});
