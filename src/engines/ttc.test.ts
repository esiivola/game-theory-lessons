import { describe, it, expect } from 'vitest';
import { topTradingCycles } from './ttc';

const AGENTS = ['1', '2', '3', '4'];
const OWNS = { '1': 'h1', '2': 'h2', '3': 'h3', '4': 'h4' };
const PREFS = {
  '1': ['h3', 'h2', 'h1', 'h4'],
  '2': ['h1', 'h3', 'h4', 'h2'],
  '3': ['h2', 'h1', 'h3', 'h4'],
  '4': ['h3', 'h4', 'h1', 'h2'],
};

describe('top trading cycles', () => {
  it('executes the 3-cycle then assigns agent 4 its own house', () => {
    const { assignment } = topTradingCycles(AGENTS, OWNS, PREFS);
    expect(assignment).toEqual({ '1': 'h3', '2': 'h1', '3': 'h2', '4': 'h4' });
  });
  it('the first round trades agents 1, 2, and 3', () => {
    const { rounds } = topTradingCycles(AGENTS, OWNS, PREFS);
    expect(rounds[0].traded.sort()).toEqual(['1', '2', '3']);
  });
});
