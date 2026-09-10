import { describe, it, expect } from 'vitest';
import { matcherBestResponse, mismatcherBestResponse, fictitiousPlay } from './learning';

describe('best responses', () => {
  it('the matcher chases the opponent, the mismatcher flees', () => {
    expect(matcherBestResponse(0.7)).toBe('H');
    expect(mismatcherBestResponse(0.7)).toBe('T');
  });
});

describe('fictitious play in Matching Pennies', () => {
  it('time-averaged play converges to (1/2, 1/2)', () => {
    const r = fictitiousPlay(4000);
    expect(r.p1HeadFreq).toBeCloseTo(0.5, 1);
    expect(r.p2HeadFreq).toBeCloseTo(0.5, 1);
  });
});
