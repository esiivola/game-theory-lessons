import { describe, it, expect } from 'vitest';
import { isInCore, blocking, shapley, nucleolus3, type CharFn } from './cooperative';

// Seller (0) + two buyers (1, 2). v(12)=v(13)=100, v(23)=0, v(123)=100.
// masks: 1={0},2={1},3={0,1},4={2},5={0,2},6={1,2},7=all
const SELLER: CharFn = [0, 0, 0, 100, 0, 100, 0, 100];
// 3-player majority game: v(S)=1 for |S|>=2, v(N)=1.
const MAJORITY: CharFn = [0, 0, 0, 1, 0, 1, 1, 1];

describe('core of the seller game', () => {
  it('is the single point (100, 0, 0)', () => {
    expect(isInCore([100, 0, 0], SELLER, 3)).toBe(true);
    expect(isInCore([80, 10, 10], SELLER, 3)).toBe(false);
  });
  it('flags the blocking coalition when buyers are given a share', () => {
    // {seller, buyer1} = mask 3 can get 100 but is offered only 90.
    expect(blocking([80, 10, 10], SELLER, 3)).toContain(3);
  });
});

describe('Shapley value of the seller game', () => {
  it('is (200/3, 50/3, 50/3), outside the core', () => {
    const s = shapley(SELLER, 3);
    expect(s[0]).toBeCloseTo(200 / 3, 4);
    expect(s[1]).toBeCloseTo(50 / 3, 4);
    expect(s[2]).toBeCloseTo(50 / 3, 4);
    expect(isInCore(s, SELLER, 3)).toBe(false); // 66.7 + 16.7 < 100
  });
});

describe('nucleolus of the majority game', () => {
  it('is the equal split (1/3, 1/3, 1/3)', () => {
    const nuc = nucleolus3(MAJORITY);
    expect(nuc[0]).toBeCloseTo(1 / 3, 2);
    expect(nuc[1]).toBeCloseTo(1 / 3, 2);
    expect(nuc[2]).toBeCloseTo(1 / 3, 2);
  });
});
