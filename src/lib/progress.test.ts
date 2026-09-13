import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isComplete,
  load,
  markSectionViewed,
  meetsCompletionRequirements,
  quizState,
  recordQuiz,
  tryCompleteLesson,
} from './progress';

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
  clear() { this.values.clear(); }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  get length() { return this.values.size; }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage());
  vi.stubGlobal('window', { dispatchEvent: vi.fn() });
});

describe('lesson completion', () => {
  it('restores a correct quiz from stored progress', () => {
    recordQuiz('lesson', 'q1', true);

    expect(quizState('lesson', 'q1')).toEqual({ answered: true, correct: true });
  });

  it('requires every section and quiz', () => {
    markSectionViewed('lesson', 'play');
    recordQuiz('lesson', 'q1', true);

    expect(meetsCompletionRequirements('lesson', ['play', 'math'], ['q1', 'q2'])).toBe(false);

    markSectionViewed('lesson', 'math');
    recordQuiz('lesson', 'q2', true);

    expect(meetsCompletionRequirements('lesson', ['play', 'math'], ['q1', 'q2'])).toBe(true);
  });

  it('awards completion only once and never before eligibility', () => {
    expect(tryCompleteLesson('lesson', ['play'], ['q1'])).toEqual({
      complete: false,
      firstTime: false,
      xp: 0,
    });
    expect(isComplete('lesson')).toBe(false);

    markSectionViewed('lesson', 'play');
    recordQuiz('lesson', 'q1', true);

    expect(tryCompleteLesson('lesson', ['play'], ['q1'])).toEqual({
      complete: true,
      firstTime: true,
      xp: 30,
    });
    expect(tryCompleteLesson('lesson', ['play'], ['q1'])).toEqual({
      complete: true,
      firstTime: false,
      xp: 0,
    });
    expect(load().xp).toBe(30);
  });
});
