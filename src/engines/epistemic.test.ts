import { describe, it, expect } from 'vitest';
import { leaveNight, muddySees, deduceOwnMuddyNight } from './epistemic';

describe('muddy children', () => {
  it('n muddy children leave on night n', () => {
    expect(leaveNight(1)).toBe(1);
    expect(leaveNight(3)).toBe(3);
  });
  it('a muddy child sees everyone else', () => {
    expect(muddySees(3)).toBe(2);
    expect(muddySees(1)).toBe(0);
  });
  it('the deduction is consistent: seeing muddyCount-1 others implies leaving on night muddyCount', () => {
    for (let n = 1; n <= 6; n++) {
      expect(deduceOwnMuddyNight(muddySees(n))).toBe(leaveNight(n));
    }
  });
});
