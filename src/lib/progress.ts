// The ONLY module that reads or writes localStorage. Everything else goes through here.
// Defensive by design: private mode and blocked storage must not throw.

export type LessonStatus = 'not-started' | 'in-progress' | 'complete';

export interface LessonState {
  status: LessonStatus;
  sectionsViewed: string[];
  quizzes: Record<string, { answered: boolean; correct: boolean }>;
  completedAt: string | null;
}

export interface Progress {
  version: 1;
  lessons: Record<string, LessonState>;
  xp: number;
  daysLearned: string[];
  settings: { theme: 'system' | 'light' | 'dark' };
}

const KEY = 'gt.progress.v1';
const XP_PER_LESSON = 30;

const base = (): Progress => ({
  version: 1,
  lessons: {},
  xp: 0,
  daysLearned: [],
  settings: { theme: 'system' },
});

export function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1) return { ...base(), ...parsed };
    }
  } catch {
    /* storage blocked or corrupt: fall through to defaults */
  }
  return base();
}

function save(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore write failures */
  }
  try {
    window.dispatchEvent(new CustomEvent('gt:progress'));
  } catch {
    /* no window (build time) */
  }
}

function lesson(p: Progress, slug: string): LessonState {
  if (!p.lessons[slug]) {
    p.lessons[slug] = { status: 'not-started', sectionsViewed: [], quizzes: {}, completedAt: null };
  }
  return p.lessons[slug];
}

export const isComplete = (slug: string): boolean => load().lessons[slug]?.status === 'complete';

export const statusOf = (slug: string): LessonStatus =>
  load().lessons[slug]?.status ?? 'not-started';

export function markSectionViewed(slug: string, sectionId: string): void {
  const p = load();
  const l = lesson(p, slug);
  if (!l.sectionsViewed.includes(sectionId)) l.sectionsViewed.push(sectionId);
  if (l.status === 'not-started') l.status = 'in-progress';
  save(p);
}

export function recordQuiz(slug: string, id: string, correct: boolean): void {
  const p = load();
  const l = lesson(p, slug);
  l.quizzes[id] = { answered: true, correct };
  if (l.status === 'not-started') l.status = 'in-progress';
  save(p);
}

export function completeLesson(slug: string): { firstTime: boolean; xp: number } {
  const p = load();
  const l = lesson(p, slug);
  const firstTime = l.status !== 'complete';
  l.status = 'complete';
  if (firstTime) {
    l.completedAt = new Date().toISOString().slice(0, 10);
    p.xp += XP_PER_LESSON;
    const today = l.completedAt;
    if (!p.daysLearned.includes(today)) p.daysLearned.push(today);
  }
  save(p);
  return { firstTime, xp: XP_PER_LESSON };
}

export function getTheme(): 'system' | 'light' | 'dark' {
  return load().settings.theme;
}

export function setTheme(theme: 'system' | 'light' | 'dark'): void {
  const p = load();
  p.settings.theme = theme;
  save(p);
}

export function exportJSON(): string {
  return JSON.stringify(load(), null, 2);
}

export function reset(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  try {
    window.dispatchEvent(new CustomEvent('gt:progress'));
  } catch {
    /* ignore */
  }
}

export const XP = XP_PER_LESSON;
