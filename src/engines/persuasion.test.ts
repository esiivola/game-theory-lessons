import { describe, it, expect } from 'vitest';
import { posteriorGuilty, optimalFalsePositive, convictionRate } from './persuasion';

describe('optimalFalsePositive', () => {
  it('is 3/7 for the prosecutor-judge case', () => {
    expect(optimalFalsePositive()).toBeCloseTo(3 / 7);
  });
});

describe('posteriorGuilty', () => {
  it('reaches the 0.5 threshold at the optimal flag rate', () => {
    expect(posteriorGuilty(optimalFalsePositive())).toBeCloseTo(0.5);
  });
  it('is 1 with no false positives (full disclosure) and falls as x rises', () => {
    expect(posteriorGuilty(0)).toBeCloseTo(1);
    expect(posteriorGuilty(1)).toBeCloseTo(0.3); // always "guilty": uninformative, back to prior
  });
});

describe('convictionRate', () => {
  it('is 0.6 at the optimum, beating full disclosure (0.3) and secrecy (0)', () => {
    expect(convictionRate(optimalFalsePositive())).toBeCloseTo(0.6);
    expect(convictionRate(0)).toBeCloseTo(0.3);   // full disclosure: convict only the truly guilty
    expect(convictionRate(1)).toBeCloseTo(0);      // babble: posterior 0.3 < 0.5, no conviction
  });
  it('drops to 0 once the flag rate pushes the posterior below the threshold', () => {
    expect(convictionRate(0.6)).toBe(0); // above 3/7, posterior < 0.5, judge acquits
  });
});
