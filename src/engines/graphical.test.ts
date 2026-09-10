import { describe, it, expect } from 'vitest';
import { settle, isEquilibrium, type Graph } from './graphical';

const STAR: Graph = { c: ['l1', 'l2', 'l3', 'l4', 'l5'], l1: ['c'], l2: ['c'], l3: ['c'], l4: ['c'], l5: ['c'] };
const CYCLE6: Graph = { a: ['b', 'f'], b: ['a', 'c'], c: ['b', 'd'], d: ['c', 'e'], e: ['d', 'f'], f: ['e', 'a'] };

describe('best-shot public goods on a network', () => {
  it('on a star, the centre provides and the leaves free-ride (cost 1)', () => {
    const eq = settle(new Set<string>(), STAR);
    expect(eq.has('c')).toBe(true);
    expect(eq.size).toBe(1);
    expect(isEquilibrium(eq, STAR)).toBe(true);
  });
  it('on a 6-cycle, providers form an independent set of size 3 (cost 3)', () => {
    const eq = settle(new Set(['a']), CYCLE6);
    expect(isEquilibrium(eq, CYCLE6)).toBe(true);
    expect(eq.size).toBe(3);
  });
});
