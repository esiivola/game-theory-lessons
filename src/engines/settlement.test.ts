import { describe, expect, it } from 'vitest';
import { settlementRange } from './settlement';

describe('litigation settlement range', () => {
  it('finds the range created by saved trial costs under common beliefs', () => {
    expect(settlementRange(100, 0.6, 0.6, 10, 10)).toEqual({
      plaintiffMinimum: 50,
      defendantMaximum: 70,
      surplus: 20,
      settles: true,
    });
  });

  it('finds no range when the plaintiff is much more optimistic', () => {
    expect(settlementRange(100, 0.9, 0.3, 10, 10).settles).toBe(false);
  });
});
