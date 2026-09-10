import { describe, it, expect } from 'vitest';
import { fpaBidTwo, winProb, interimPayment, interimSurplus } from './revelation';

describe('first-price outcome and its direct equivalent', () => {
  it('bids v/2, wins with probability v', () => {
    expect(fpaBidTwo(0.6)).toBeCloseTo(0.3);
    expect(winProb(0.6)).toBeCloseTo(0.6);
  });
  it('interim payment is v^2 / 2, matched by the truthful direct mechanism', () => {
    expect(interimPayment(0.6)).toBeCloseTo(0.18); // 0.6 * 0.3
    expect(interimPayment(1)).toBeCloseTo(0.5);
  });
  it('surplus is also v^2 / 2', () => {
    expect(interimSurplus(0.6)).toBeCloseTo(0.18);
  });
});
