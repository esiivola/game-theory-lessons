import { describe, it, expect } from 'vitest';
import { updatePosterior, entryValue, shouldEnter } from './reputation';

describe('updatePosterior', () => {
  it('a fight raises the belief that the incumbent is tough (both types fight, but tough for sure)', () => {
    const after = updatePosterior(0.2, 'fight', 0.8);
    expect(after).toBeCloseTo(0.2 / (0.2 + 0.8 * 0.8)); // ~0.238
    expect(after).toBeGreaterThan(0.2);
  });
  it('an accommodation reveals the normal type', () => {
    expect(updatePosterior(0.2, 'accommodate', 0.8)).toBe(0);
  });
  it('in the final town a normal never fights, so a fight reveals tough', () => {
    expect(updatePosterior(0.2, 'fight', 0)).toBe(1);
  });
});

describe('entryValue / shouldEnter', () => {
  it('early on, with the normal type fighting, entry is unprofitable', () => {
    expect(entryValue(0.2, 0.8)).toBeCloseTo(0.16 * 2 - 0.84); // -0.52
    expect(shouldEnter(0.2, 0.8)).toBe(false);
  });
  it('in the final town, where the normal type accommodates, entry pays', () => {
    // Belief has drifted up to ~0.24; normal fight prob is 0 in the last town.
    expect(entryValue(0.238, 0)).toBeGreaterThan(0);
    expect(shouldEnter(0.238, 0)).toBe(true);
  });
  it('even a small doubt deters when the normal type fights hard enough', () => {
    // With tiny mu but high normal fight probability, entry is still a loss.
    expect(shouldEnter(0.05, 0.9)).toBe(false);
  });
});
