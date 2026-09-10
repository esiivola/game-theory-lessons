import { describe, it, expect } from 'vitest';
import { logitProb } from './qre';

describe('logit QRE', () => {
  it('is 50/50 when lambda is 0 (fully noisy)', () => {
    expect(logitProb(1, 0)).toBeCloseTo(0.5);
  });
  it('leans toward the better action as lambda grows', () => {
    expect(logitProb(1, 1)).toBeCloseTo(0.731, 2);
    expect(logitProb(1, 3)).toBeCloseTo(0.953, 2);
  });
  it('approaches pure best response as lambda goes large', () => {
    expect(logitProb(1, 20)).toBeGreaterThan(0.99);
  });
});
