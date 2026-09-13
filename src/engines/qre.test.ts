import { describe, it, expect } from 'vitest';
import { logitProb, logitQre2x2 } from './qre';

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

describe('two-player logit QRE', () => {
  const coordination = {
    row: [[2, 0], [0, 1]] as [[number, number], [number, number]],
    col: [[2, 0], [0, 1]] as [[number, number], [number, number]],
  };

  it('returns mutually consistent choice probabilities', () => {
    const { rowA, colA } = logitQre2x2(coordination, 1);
    const rowAdvantage = colA * 2 + (1 - colA) * -1;
    const colAdvantage = rowA * 2 + (1 - rowA) * -1;
    expect(rowA).toBeCloseTo(logitProb(rowAdvantage, 1), 7);
    expect(colA).toBeCloseTo(logitProb(colAdvantage, 1), 7);
  });

  it('is uniform at zero precision', () => {
    expect(logitQre2x2(coordination, 0)).toEqual({ rowA: 0.5, colA: 0.5 });
  });
});
