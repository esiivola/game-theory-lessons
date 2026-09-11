import { describe, it, expect } from 'vitest';
import { solveVCG, gspPayment, gspTopDeviation } from './positionAuction';

// Two slots (100, 80 clicks); bidders A=10, B=6, C=4 per click.
const VALUES = [10, 6, 4];
const CLICKS = [100, 80];

describe('position-auction VCG', () => {
  it('assigns A to slot 1 and B to slot 2', () => {
    const a = solveVCG(VALUES, CLICKS);
    expect(a.map((x) => x.index)).toEqual([0, 1]); // A then B
    expect(a[0].clicks).toBe(100);
    expect(a[1].clicks).toBe(80);
  });
  it('charges A 440 and B 320 (the externalities)', () => {
    const a = solveVCG(VALUES, CLICKS);
    // Without A the others get B->100 (600) plus C->80 (320) = 920; with A they get B->80 = 480.
    expect(a[0].vcgPayment).toBe(440);
    // Without B the others get A->100 (1000) plus C->80 (320) = 1320; with B they get A->100 = 1000.
    expect(a[1].vcgPayment).toBe(320);
  });
});

describe('GSP', () => {
  it('under truthful bids overcharges the top slot relative to VCG', () => {
    expect(gspPayment(VALUES, CLICKS, 0)).toBe(600); // B's bid 6 * 100 clicks
    expect(gspPayment(VALUES, CLICKS, 0)).toBeGreaterThan(440);
  });

  it('is not truthful: the top bidder gains by shading into the cheaper second slot', () => {
    const d = gspTopDeviation(VALUES, CLICKS);
    expect(d.stay).toBe(400); // 100 clicks * (10 - 6)
    expect(d.drop).toBe(480); // 80 clicks * (10 - 4)
    expect(d.profitable).toBe(true);
  });

  it('but the overcharge alone does not imply a deviation: a steep click drop keeps truth optimal', () => {
    // Same values, slot 2 worth only 50 clicks. GSP still overcharges the top slot (600 > 500),
    // yet dropping down is now worse (300 < 400), so truthful bidding survives here. Non-truthfulness
    // is about the deviation paying off, not about the gap to VCG.
    const steep = [100, 50];
    expect(gspPayment(VALUES, steep, 0)).toBeGreaterThan(solveVCG(VALUES, steep)[0].vcgPayment);
    const d = gspTopDeviation(VALUES, steep);
    expect(d.stay).toBe(400);
    expect(d.drop).toBe(300);
    expect(d.profitable).toBe(false);
  });

  it('collapses to the truthful second-price auction with a single slot', () => {
    const d = gspTopDeviation(VALUES, [100]);
    expect(gspPayment(VALUES, [100], 0)).toBe(600);
    expect(d.drop).toBe(0); // there is no lower slot to drop into
    expect(d.profitable).toBe(false);
  });
});
