import { describe, it, expect } from 'vitest';
import { leaf, value, bestBranch, type Node } from './tree';

// The entry game. Player 0 = entrant, player 1 = incumbent.
// Out (0,2); In then Accommodate (2,1); In then Fight (-1,0).
const entryGame: Node = {
  kind: 'node', player: 0, label: 'Entrant',
  branches: [
    { label: 'Stay out', child: leaf([0, 2]) },
    { label: 'Enter', child: {
      kind: 'node', player: 1, label: 'Incumbent',
      branches: [
        { label: 'Accommodate', child: leaf([2, 1]) },
        { label: 'Fight', child: leaf([-1, 0]) },
      ],
    } },
  ],
};

describe('value', () => {
  it('folds the entry game to (In, Accommodate) = (2,1)', () => {
    expect(value(entryGame)).toEqual([2, 1]);
  });
  it('a leaf is its own value', () => {
    expect(value(leaf([3, 3]))).toEqual([3, 3]);
  });
});

describe('bestBranch', () => {
  it('the incumbent accommodates (1 > 0)', () => {
    const incumbent = entryGame.branches[1].child as Node;
    expect(bestBranch(incumbent)).toBe(0);
  });
  it('the entrant enters (2 > 0)', () => {
    expect(bestBranch(entryGame)).toBe(1);
  });
});

describe('a credible threat flips the outcome', () => {
  // Capacity costs 0.2 in every branch and makes fighting cheap after entry.
  const deterrable: Node = {
    kind: 'node', player: 0, label: 'Entrant',
    branches: [
      { label: 'Stay out', child: leaf([0, 1.8]) },
      { label: 'Enter', child: {
        kind: 'node', player: 1, label: 'Incumbent',
        branches: [
          { label: 'Accommodate', child: leaf([2, 0.8]) },
          { label: 'Fight', child: leaf([-1, 1.8]) },
        ],
      } },
    ],
  };
  it('now the incumbent fights and the entrant stays out', () => {
    const incumbent = deterrable.branches[1].child as Node;
    expect(bestBranch(incumbent)).toBe(1); // Fight, since 1.8 > 0.8
    expect(bestBranch(deterrable)).toBe(0); // Stay out, since 0 > -1
    expect(value(deterrable)).toEqual([0, 1.8]);
  });
});
