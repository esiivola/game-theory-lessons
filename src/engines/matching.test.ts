import { describe, it, expect } from 'vitest';
import { deferredAcceptance, blockingPairs } from './matching';

const MEN = { m1: ['w1', 'w2', 'w3'], m2: ['w2', 'w3', 'w1'], m3: ['w3', 'w1', 'w2'] };
const WOMEN = { w1: ['m2', 'm3', 'm1'], w2: ['m3', 'm1', 'm2'], w3: ['m1', 'm2', 'm3'] };

describe('deferred acceptance (marriage)', () => {
  it('man-proposing gives every man his first choice', () => {
    const m = deferredAcceptance(['m1', 'm2', 'm3'], MEN, WOMEN);
    expect(m).toEqual({ m1: 'w1', m2: 'w2', m3: 'w3' });
  });
  it('the man-optimal matching has no blocking pair', () => {
    const m = deferredAcceptance(['m1', 'm2', 'm3'], MEN, WOMEN);
    expect(blockingPairs(m, MEN, WOMEN).length).toBe(0);
  });
  it('woman-proposing gives every woman her first choice (the mirror)', () => {
    const m = deferredAcceptance(['w1', 'w2', 'w3'], WOMEN, MEN);
    expect(m).toEqual({ w1: 'm2', w2: 'm3', w3: 'm1' });
  });
});

describe('school choice via student-proposing DA', () => {
  const STUDENTS = { s1: ['A', 'B', 'C'], s2: ['A', 'C', 'B'], s3: ['B', 'A', 'C'] };
  const SCHOOLS = { A: ['s2', 's1', 's3'], B: ['s1', 's3', 's2'], C: ['s3', 's2', 's1'] };
  it('lands at s2 to A, s1 to B, s3 to C', () => {
    const m = deferredAcceptance(['s1', 's2', 's3'], STUDENTS, SCHOOLS);
    expect(m).toEqual({ s2: 'A', s1: 'B', s3: 'C' });
  });
});
