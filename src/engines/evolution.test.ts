import { describe, it, expect } from 'vitest';
import { essHawkFraction, hawkFitness, doveFitness, replicatorStepHawk, rpsStep } from './evolution';

describe('Hawk-Dove ESS', () => {
  it('is V/C when cost exceeds value', () => {
    expect(essHawkFraction(2, 6)).toBeCloseTo(1 / 3);
  });
  it('is all-Hawk when value exceeds cost', () => {
    expect(essHawkFraction(6, 2)).toBe(1);
  });
  it('fitness of Hawk and Dove are equal at the ESS', () => {
    expect(hawkFitness(1 / 3, 2, 6)).toBeCloseTo(doveFitness(1 / 3, 2, 6));
  });
  it('replicator dynamics converge to V/C', () => {
    let p = 0.9;
    for (let i = 0; i < 3000; i++) p = replicatorStepHawk(p, 2, 6, 0.05);
    expect(p).toBeCloseTo(1 / 3, 2);
  });
});

describe('RPS replicator', () => {
  it('keeps the center fixed under fair ties', () => {
    const c = [1 / 3, 1 / 3, 1 / 3];
    const next = rpsStep(c, 0, 0.1);
    expect(next[0]).toBeCloseTo(1 / 3, 6);
  });
  it('penalizing ties spirals inward toward the center; rewarding them spirals outward', () => {
    const start = [0.5, 0.3, 0.2];
    const d0 = Math.hypot(start[0] - 1 / 3, start[1] - 1 / 3);
    let inward = [...start];
    for (let i = 0; i < 8000; i++) inward = rpsStep(inward, -0.1, 0.01);
    expect(Math.hypot(inward[0] - 1 / 3, inward[1] - 1 / 3)).toBeLessThan(d0);
    let outward = [...start];
    for (let i = 0; i < 2000; i++) outward = rpsStep(outward, 0.1, 0.01);
    expect(Math.hypot(outward[0] - 1 / 3, outward[1] - 1 / 3)).toBeGreaterThan(d0);
  });
});
