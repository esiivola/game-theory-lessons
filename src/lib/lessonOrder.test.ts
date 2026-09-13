import { describe, expect, it } from 'vitest';
import { orderLessons } from './lessonOrder';

const lesson = (
  id: string,
  tier: 'basic' | 'intermediate' | 'expert' | 'applied',
  order: number,
  kind: 'lesson' | 'case' = 'lesson',
  placement: string | null = null
) => ({ id, data: { tier, order, kind, placement } });

describe('orderLessons', () => {
  it('places inline cases after their anchor and capstones last', () => {
    const lessons = [
      lesson('capstone', 'applied', 2, 'case', 'capstone'),
      lesson('later', 'intermediate', 3),
      lesson('inline', 'applied', 1, 'case', 'after:early'),
      lesson('early', 'basic', 1),
      lesson('middle', 'basic', 2),
    ];

    expect(orderLessons(lessons).map(({ id }) => id)).toEqual([
      'early',
      'inline',
      'middle',
      'later',
      'capstone',
    ]);
  });

  it('rejects a case whose anchor does not exist', () => {
    expect(() =>
      orderLessons([lesson('orphan', 'applied', 1, 'case', 'after:missing')])
    ).toThrow('missing');
  });
});
