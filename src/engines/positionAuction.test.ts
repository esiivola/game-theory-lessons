import { describe, it, expect } from 'vitest';
import { solveVCG, gspPayment } from './positionAuction';

// Two slots (100, 50 clicks); bidders A=10, B=6, C=4 per click.
const VALUES = [10, 6, 4];
const CLICKS = [100, 50];

describe('position-auction VCG', () => {
  it('assigns A to slot 1 and B to slot 2', () => {
    const a = solveVCG(VALUES, CLICKS);
    expect(a.map((x) => x.index)).toEqual([0, 1]); // A then B
    expect(a[0].clicks).toBe(100);
    expect(a[1].clicks).toBe(50);
  });
  it('charges A 500 and B 200 (the externalities)', () => {
    const a = solveVCG(VALUES, CLICKS);
    expect(a[0].vcgPayment).toBe(500);
    expect(a[1].vcgPayment).toBe(200);
  });
});

describe('GSP', () => {
  it('under truthful bids overcharges the top slot relative to VCG', () => {
    expect(gspPayment(VALUES, CLICKS, 0)).toBe(600); // B's bid 6 * 100 clicks
    expect(gspPayment(VALUES, CLICKS, 0)).toBeGreaterThan(500); // so truthful bidding is not optimal
  });
});
