import { describe, it, expect } from 'vitest';
import { avgQualityOnMarket, buyerWTP, fractionSelling, marketClears } from './lemons';

describe('avgQualityOnMarket', () => {
  it('is half the price (uniform quality up to p)', () => {
    expect(avgQualityOnMarket(60)).toBe(30);
    expect(avgQualityOnMarket(100)).toBe(50);
  });
});

describe('buyerWTP', () => {
  it('is 0.75 of the price, always below it for p > 0', () => {
    expect(buyerWTP(60)).toBeCloseTo(45);
    expect(buyerWTP(100)).toBeCloseTo(75);
    expect(buyerWTP(60)).toBeLessThan(60);
  });
});

describe('fractionSelling', () => {
  it('rises with price', () => {
    expect(fractionSelling(0)).toBe(0);
    expect(fractionSelling(50)).toBe(0.5);
    expect(fractionSelling(100)).toBe(1);
  });
});

describe('marketClears', () => {
  it('fails at every positive price', () => {
    expect(marketClears(20)).toBe(false);
    expect(marketClears(80)).toBe(false);
  });
  it('only clears at zero (total unraveling)', () => {
    expect(marketClears(0)).toBe(true);
  });
});
