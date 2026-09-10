import { describe, it, expect } from 'vitest';
import { COORD, survivesTremble } from './refinement';

describe('trembling-hand refinement on the coordination game', () => {
  it('both profiles are Nash at zero tremble (weakly)', () => {
    expect(survivesTremble(COORD, 0, 0, 0)).toBe(true); // (T,L)
    expect(survivesTremble(COORD, 1, 1, 0)).toBe(true); // (B,R), only weakly
  });
  it('(T,L) survives a small tremble', () => {
    expect(survivesTremble(COORD, 0, 0, 0.1)).toBe(true);
  });
  it('(B,R) collapses under any positive tremble', () => {
    expect(survivesTremble(COORD, 1, 1, 0.1)).toBe(false);
    expect(survivesTremble(COORD, 1, 1, 0.01)).toBe(false);
  });
});
