import { describe, expect, it } from 'vitest';
import { BRINKMANSHIP_THRESHOLD, rivalChoice, rivalHoldPayoff } from './brinkmanship';

describe('brinkmanship commitment', () => {
  it('derives the risk that makes yielding weakly optimal', () => {
    expect(BRINKMANSHIP_THRESHOLD).toBeCloseTo(2 / 11);
    expect(rivalHoldPayoff(BRINKMANSHIP_THRESHOLD)).toBeCloseTo(-1);
  });

  it('changes the rival response only when committed risk reaches the threshold', () => {
    expect(rivalChoice(0.1)).toBe('hold');
    expect(rivalChoice(0.2)).toBe('yield');
  });
});
