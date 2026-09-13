import { describe, expect, it } from 'vitest';
import { allPayOutcome } from './allPay';

describe('all-pay contest', () => {
  it('charges both winner and loser their bids', () => {
    expect(allPayOutcome(60, 40, 100)).toEqual({
      myPayoff: 40,
      rivalPayoff: -40,
      totalSpent: 100,
      winner: 'you',
    });
  });

  it('splits the prize on a tie while both bids remain sunk', () => {
    expect(allPayOutcome(40, 40, 100)).toEqual({
      myPayoff: 10,
      rivalPayoff: 10,
      totalSpent: 80,
      winner: 'tie',
    });
  });
});
