import { describe, it, expect } from 'vitest';
import { equilibriumKickLeft, equilibriumValue, keeperDive, predictLeft, concededRate, type Side } from './penalty';

describe('equilibrium', () => {
  it('the kicker shoots Left about 36% of the time', () => {
    expect(equilibriumKickLeft()).toBeCloseTo(4 / 11, 4); // 0.3636...
  });
  it('an unreadable kicker scores about 79%', () => {
    expect(equilibriumValue()).toBeCloseTo(0.791, 2);
  });
});

describe('keeperDive', () => {
  it('dives Left against a Left-leaning kicker', () => {
    expect(keeperDive(0.8)).toBe(0);
  });
  it('dives Right against a Right-leaning kicker', () => {
    expect(keeperDive(0.1)).toBe(1);
  });
  it('is indifferent exactly at the equilibrium mix', () => {
    const p = equilibriumKickLeft();
    const ifL = p * 0.6 + (1 - p) * 0.9;
    const ifR = p * 0.95 + (1 - p) * 0.7;
    expect(ifL).toBeCloseTo(ifR, 6);
  });
});

describe('predictLeft', () => {
  it('starts at 1/2 with no history', () => {
    expect(predictLeft([])).toBe(0.5);
  });
  it('reads a pure-Left kicker as Left', () => {
    expect(predictLeft([0, 0, 0, 0])).toBe(1);
  });
  it('catches strict alternation via last-move conditioning', () => {
    // After a Left the kicker always goes Right, and vice versa. Given the last was Left,
    // it predicts Right (0 probability of Left).
    const alt: Side[] = [0, 1, 0, 1, 0, 1, 0]; // ends on Left
    expect(predictLeft(alt)).toBe(0); // after Left it always played Right
  });
});

describe('exploitation lowers scoring below the equilibrium value', () => {
  it('a readable kicker concedes rate below 79%', () => {
    expect(concededRate(1)).toBeLessThan(equilibriumValue());   // always Left -> keeper dives Left -> 0.60
    expect(concededRate(0)).toBeLessThan(equilibriumValue());   // always Right -> keeper dives Right -> 0.70
    expect(concededRate(1)).toBeCloseTo(0.60, 6);
  });
  it('the equilibrium mix concedes exactly the equilibrium value', () => {
    expect(concededRate(equilibriumKickLeft())).toBeCloseTo(equilibriumValue(), 6);
  });
});
