import { describe, it, expect } from 'vitest';
import { pairwiseWinner, condorcetWinner, hasCycle } from './socialChoice';

const ALTS = ['A', 'B', 'C'];
// The classic Condorcet cycle.
const CYCLE = [['A', 'B', 'C'], ['B', 'C', 'A'], ['C', 'A', 'B']];

describe('pairwise majority', () => {
  it('gives the cyclic A>B, B>C, C>A pattern', () => {
    expect(pairwiseWinner(CYCLE, 'A', 'B')).toBe('A');
    expect(pairwiseWinner(CYCLE, 'B', 'C')).toBe('B');
    expect(pairwiseWinner(CYCLE, 'C', 'A')).toBe('C');
  });
});

describe('condorcetWinner / hasCycle', () => {
  it('finds no winner in the cyclic profile', () => {
    expect(condorcetWinner(CYCLE, ALTS)).toBeNull();
    expect(hasCycle(CYCLE, ALTS)).toBe(true);
  });
  it('finds a winner when one alternative beats the rest', () => {
    const clear = [['A', 'B', 'C'], ['A', 'C', 'B'], ['B', 'A', 'C']];
    expect(condorcetWinner(clear, ALTS)).toBe('A');
    expect(hasCycle(clear, ALTS)).toBe(false);
  });
});
