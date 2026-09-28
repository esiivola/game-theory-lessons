import { describe, expect, it } from 'vitest';
import { shuffleOptions } from './quizOptions';

describe('quiz option order', () => {
  it('is stable, preserves all options, and varies the correct position', () => {
    const options = [{ text: 'right', correct: true }, { text: 'wrong 1' }, { text: 'wrong 2' }];
    const positions = new Set<number>();
    for (let i = 0; i < 30; i++) {
      const shuffled = shuffleOptions(options, `lesson-${i}:q1`);
      expect(shuffled).toEqual(shuffleOptions(options, `lesson-${i}:q1`));
      expect(shuffled).toHaveLength(options.length);
      expect(shuffled).toEqual(expect.arrayContaining(options));
      positions.add(shuffled.findIndex((option) => option.correct));
    }
    expect(positions).toEqual(new Set([0, 1, 2]));
    expect(options[0].text).toBe('right');
  });
});
