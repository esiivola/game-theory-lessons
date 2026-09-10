import { describe, it, expect } from 'vitest';
import {
  payoff, mixedNashStraight, mixedNashValue, correlatedValue,
  conditional, expectedIf, obedienceHolds,
} from './correlated';

describe('Chicken payoffs', () => {
  it('reads the four cells', () => {
    expect(payoff('swerve', 'swerve')).toBe(6);
    expect(payoff('swerve', 'straight')).toBe(2);
    expect(payoff('straight', 'swerve')).toBe(7);
    expect(payoff('straight', 'straight')).toBe(0);
  });
});

describe('mixed Nash', () => {
  it('plays Straight one-third of the time', () => {
    expect(mixedNashStraight()).toBeCloseTo(1 / 3);
  });
  it('is worth about 4.67 per player', () => {
    expect(mixedNashValue()).toBeCloseTo(14 / 3, 6); // 4.666...
  });
});

describe('the correlated device', () => {
  it('gives each player 5, beating the mixed Nash', () => {
    const v = correlatedValue();
    expect(v.row).toBeCloseTo(5);
    expect(v.col).toBeCloseTo(5);
    expect(v.row).toBeGreaterThan(mixedNashValue());
  });
});

describe('obedience', () => {
  it('conditions the opponent correctly on the recommendation', () => {
    expect(conditional('swerve')).toEqual({ swerve: 0.5, straight: 0.5 });
    expect(conditional('straight')).toEqual({ swerve: 1, straight: 0 });
  });
  it('told Swerve, obeying (4) beats deviating (3.5)', () => {
    expect(expectedIf('swerve', 'swerve')).toBeCloseTo(4);
    expect(expectedIf('straight', 'swerve')).toBeCloseTo(3.5);
  });
  it('told Straight, obeying (7) beats deviating (6)', () => {
    expect(expectedIf('straight', 'straight')).toBeCloseTo(7);
    expect(expectedIf('swerve', 'straight')).toBeCloseTo(6);
  });
  it('so obedience is a best response, a correlated equilibrium', () => {
    expect(obedienceHolds()).toBe(true);
  });
});
