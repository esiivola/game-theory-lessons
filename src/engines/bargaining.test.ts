import { describe, it, expect } from 'vitest';
import { nashProduct, nashSolution } from './bargaining';

describe('nashSolution', () => {
  it('splits 50/50 with a symmetric disagreement point', () => {
    expect(nashSolution(0, 0)).toBeCloseTo(0.5);
  });
  it('a better outside option means you get MORE, not less', () => {
    expect(nashSolution(0.2, 0)).toBeCloseTo(0.6);
  });
  it('is symmetric in the two disagreement payoffs', () => {
    expect(nashSolution(0, 0.2)).toBeCloseTo(0.4);
  });
});

describe('nashProduct', () => {
  it('is maximized at the Nash solution', () => {
    const x = nashSolution(0.2, 0);
    const here = nashProduct(x, 0.2, 0);
    expect(here).toBeGreaterThan(nashProduct(x - 0.1, 0.2, 0));
    expect(here).toBeGreaterThan(nashProduct(x + 0.1, 0.2, 0));
  });
  it('the symmetric optimum x(1-x) peaks at 1/2', () => {
    expect(nashProduct(0.5, 0, 0)).toBeGreaterThan(nashProduct(0.4, 0, 0));
    expect(nashProduct(0.5, 0, 0)).toBeGreaterThan(nashProduct(0.6, 0, 0));
  });
});
