import { describe, it, expect } from 'vitest';
import { median, turnoutOutcome, voteShare } from './medianVoter';

const VOTERS = [0.1, 0.2, 0.5, 0.8, 0.9];

describe('median voter', () => {
  it('finds the median position', () => {
    expect(median(VOTERS)).toBeCloseTo(0.5);
  });
  it('an off-median candidate can be beaten by one at the median', () => {
    expect(voteShare(0.3, 0.6, VOTERS)).toBeCloseTo(0.4); // 0.3 loses to the more central 0.6
    expect(voteShare(0.5, 0.6, VOTERS)).toBeGreaterThan(0.5); // the median position beats 0.6
  });
  it('distance-based abstention can make full convergence lose turnout', () => {
    expect(turnoutOutcome(0.5, 0.5, VOTERS, 0.25).turnout).toBe(1);
    expect(turnoutOutcome(0.3, 0.7, VOTERS, 0.25).turnout).toBe(5);
  });
});
