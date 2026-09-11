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
  // The conserved quantity of the continuous replicator flow on fair (zero-sum) RPS.
  const H = (x: number[]) => x[0] * x[1] * x[2];
  const dist = (x: number[]) => Math.hypot(x[0] - 1 / 3, x[1] - 1 / 3, x[2] - 1 / 3);

  it('keeps the center fixed under fair ties', () => {
    const c = [1 / 3, 1 / 3, 1 / 3];
    const next = rpsStep(c, 0, 0.1);
    expect(next[0]).toBeCloseTo(1 / 3, 6);
  });

  it('traces a closed orbit under fair ties, conserving x_R x_P x_S', () => {
    // The lesson claims the fair-RPS orbit never converges and never diverges. That is a property
    // of the flow, and an integrator with one-signed error destroys it: forward Euler spiralled
    // outward by 22% over this same run, which is what the reader would have seen on screen.
    const start = [0.5, 0.3, 0.2];
    let x = [...start];
    for (let i = 0; i < 3000; i++) x = rpsStep(x, 0, 0.02);
    expect(H(x)).toBeCloseTo(H(start), 7);
    // The orbit is a level curve, not a circle, so its distance from the centre oscillates
    // within a band rather than staying constant. What must not happen is a one-way drift.
    expect(dist(x)).toBeGreaterThan(0.15);
    expect(dist(x)).toBeLessThan(0.3);
  });

  it('holds that orbit over a hundred times the widget run', () => {
    const start = [0.5, 0.3, 0.2];
    let x = [...start];
    for (let i = 0; i < 300000; i++) x = rpsStep(x, 0, 0.02);
    expect(H(x)).toBeCloseTo(H(start), 7);
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
