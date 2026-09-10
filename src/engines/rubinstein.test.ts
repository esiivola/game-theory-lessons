import { describe, it, expect } from 'vitest';
import { proposerShare, responderShare, proposerShareTwoSided, accepts } from './rubinstein';

describe('proposerShare', () => {
  it('is 1/(1+delta): the proposer keeps more when the responder is impatient', () => {
    expect(proposerShare(0)).toBeCloseTo(1);        // impatient responder gets nothing
    expect(proposerShare(0.9)).toBeCloseTo(1 / 1.9); // ~0.526
    expect(proposerShare(1)).toBeCloseTo(0.5);      // fully patient: even split
  });
  it('shares sum to the whole pie', () => {
    expect(proposerShare(0.6) + responderShare(0.6)).toBeCloseTo(1);
  });
  it('the proposer advantage shrinks as delta rises toward 1', () => {
    expect(proposerShare(0.5)).toBeGreaterThan(proposerShare(0.9));
  });
});

describe('proposerShareTwoSided', () => {
  it('reduces to 1/(1+delta) when both discount equally', () => {
    expect(proposerShareTwoSided(0.9, 0.9)).toBeCloseTo(proposerShare(0.9));
  });
  it('the more patient side does better', () => {
    // Player 1 patient, player 2 impatient -> player 1 keeps almost everything.
    expect(proposerShareTwoSided(0.95, 0.5)).toBeGreaterThan(0.9);
  });
});

describe('accepts', () => {
  it('the responder accepts exactly its continuation value, rejects less', () => {
    const d = 0.8;
    expect(accepts(responderShare(d), d)).toBe(true);
    expect(accepts(responderShare(d) - 0.05, d)).toBe(false);
  });
});
