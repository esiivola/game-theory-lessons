import { describe, it, expect } from 'vitest';
import { panchromatic, MIDPOINT_OPTIONS } from './sperner';

describe('Sperner lemma', () => {
  it('always yields at least one panchromatic sub-triangle', () => {
    for (const m1 of MIDPOINT_OPTIONS.m1)
      for (const m2 of MIDPOINT_OPTIONS.m2)
        for (const m3 of MIDPOINT_OPTIONS.m3)
          expect(panchromatic(m1, m2, m3).length).toBeGreaterThanOrEqual(1);
  });
  it('finds the center for m1=1, m2=2, m3=3', () => {
    expect(panchromatic(1, 2, 3)).toContain('center');
  });
});
