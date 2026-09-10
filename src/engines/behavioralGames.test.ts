import { describe, it, expect } from 'vitest';
import { responderUtility, rejects, rejectionThreshold } from './behavioralGames';

describe('ultimatum with Fehr-Schmidt', () => {
  it('rejects lowball offers, accepts fair ones', () => {
    expect(rejects(2)).toBe(true);   // below 2.5
    expect(rejects(3)).toBe(false);  // above 2.5
    expect(rejects(5)).toBe(false);  // fair
  });
  it('the rejection threshold is 2.5 at alpha = 0.5', () => {
    expect(rejectionThreshold(0.5)).toBeCloseTo(2.5);
  });
  it('a stronger envy weight raises the threshold', () => {
    expect(rejectionThreshold(1)).toBeGreaterThan(rejectionThreshold(0.5));
  });
  it('utility of an even split is just the amount kept', () => {
    expect(responderUtility(5)).toBeCloseTo(5);
  });
});
