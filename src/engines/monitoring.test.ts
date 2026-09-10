import { describe, it, expect } from 'vitest';
import { coopFraction, avgPayoff, simulate } from './monitoring';

describe('coopFraction', () => {
  it('is 1/(1+qT) for finite punishment', () => {
    expect(coopFraction(0.1, 5)).toBeCloseTo(1 / 1.5); // 0.667
    expect(coopFraction(0.2, 2)).toBeCloseTo(1 / 1.4);
  });
  it('is 1 with no noise', () => {
    expect(coopFraction(0, 5)).toBe(1);
  });
  it('collapses to 0 under grim trigger (T = Infinity)', () => {
    expect(coopFraction(0.1, Infinity)).toBe(0);
  });
  it('longer punishment lowers the cooperative fraction', () => {
    expect(coopFraction(0.1, 3)).toBeGreaterThan(coopFraction(0.1, 10));
  });
});

describe('avgPayoff', () => {
  it('blends reward and punishment by the cooperative fraction', () => {
    // q=0.1, T=5 -> f=0.667; R=3, P=1 -> 0.667*3 + 0.333*1 = 2.333
    expect(avgPayoff(0.1, 5, 3, 1)).toBeCloseTo(2 / 3 * 3 + 1 / 3 * 1, 6);
  });
});

describe('simulate', () => {
  it('a bad signal starts a war of exactly T rounds, then forgives', () => {
    // Force a bad signal on round 0, then good draws.
    let calls = 0;
    const rng = () => (calls++ === 0 ? 0 : 1); // first draw bad (0 < q), rest good
    const run = simulate(0.5, 3, 6, rng);
    expect(run[0]).toEqual({ signal: 'bad', phase: 'coop' });
    expect(run.slice(1, 4).every((r) => r.phase === 'war')).toBe(true); // T = 3 war rounds
    expect(run[4].phase).toBe('coop'); // forgiven
  });
  it('never leaves cooperation when there is no noise', () => {
    const run = simulate(0, 5, 8, () => 0.9);
    expect(run.every((r) => r.phase === 'coop' && r.signal === 'good')).toBe(true);
  });
});
