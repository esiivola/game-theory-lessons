import { describe, it, expect } from 'vitest';
import { payoff, mpcr } from './publicGoods';

// Course numbers: n = 4, endowment 10, multiplier 1.6, so MPCR = 0.4.
const e = 10, factor = 1.6, n = 4;

describe('mpcr', () => {
  it('is factor / n', () => {
    expect(mpcr(factor, n)).toBeCloseTo(0.4);
  });
});

describe('payoff', () => {
  it('contributing $1 alone returns only 40 cents, a net loss of 60', () => {
    // You give 1, others give 0. You keep 9, plus 0.4 * 1 back.
    expect(payoff(1, [0, 0, 0], e, factor, n)).toBeCloseTo(9.4);
  });
  it('free-riding while all others give everything is the best private outcome', () => {
    expect(payoff(0, [10, 10, 10], e, factor, n)).toBeCloseTo(22);
  });
  it('everyone contributing fully is the social optimum, $16 each', () => {
    expect(payoff(10, [10, 10, 10], e, factor, n)).toBeCloseTo(16);
  });
  it('giving less always pays you more, holding others fixed (dominance of zero)', () => {
    const others = [5, 5, 5];
    expect(payoff(0, others, e, factor, n)).toBeGreaterThan(payoff(10, others, e, factor, n));
  });
});
