import { describe, it, expect } from 'vitest';
import { PIGOU_NASH, PIGOU_OPT, PIGOU_POA, braessBefore, braessAfter } from './routing';

describe('Pigou price of anarchy', () => {
  it('Nash cost 1, optimum 0.75, PoA = 4/3', () => {
    expect(PIGOU_NASH).toBeCloseTo(1);
    expect(PIGOU_OPT).toBeCloseTo(0.75);
    expect(PIGOU_POA).toBeCloseTo(4 / 3);
  });
});

describe('Braess paradox', () => {
  it('adding the shortcut raises everyone travel time from 65 to 80', () => {
    expect(braessBefore()).toBe(65);
    expect(braessAfter()).toBe(80);
    expect(braessAfter()).toBeGreaterThan(braessBefore());
  });
});
