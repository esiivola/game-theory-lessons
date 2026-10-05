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

// Copy of the last state saved in this page session. Safari private mode, blocked site data and
// full storage make localStorage throw or silently drop writes. Without this copy every read
// would come back empty, so a quiz answered correctly was forgotten at once and the lesson could
// never complete. The copy is only read after a write has failed, so storage stays authoritative whenever it works.
let memory: Progress | null = null;
let storageFailed = false;

export function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1) return { ...base(), ...parsed };
    }
  } catch {
    /* storage blocked or corrupt: fall through to the in-page copy */
  }
  return storageFailed && memory ? structuredClone(memory) : base();
}

function reportStorageProblem(reason: string): void {
  try {
    window.dispatchEvent(new CustomEvent('gt:storage-error', { detail: { reason } }));
  } catch {
    /* no window */
  }
}

function save(p: Progress): void {
  memory = structuredClone(p);
  try {
    const json = JSON.stringify(p);
    localStorage.setItem(KEY, json);
    // Some browsers accept the write and drop it, so confirm it can be read back.
    storageFailed = localStorage.getItem(KEY) !== json;
    if (storageFailed) reportStorageProblem('write was dropped');
  } catch (e) {
    storageFailed = true;
    reportStorageProblem(e instanceof Error ? e.name : 'write failed');
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
  const l = p.lessons[slug];
  // Older or hand-edited saves can lack these fields. Writing into a missing one threw, and the
  // quiz card swallows that error, so the answer showed green and was never recorded.
  if (!l.quizzes || typeof l.quizzes !== 'object') l.quizzes = {};
  if (!Array.isArray(l.sectionsViewed)) l.sectionsViewed = [];
  return l;
}

export const isComplete = (slug: string): boolean => load().lessons[slug]?.status === 'complete';

export const statusOf = (slug: string): LessonStatus =>
  load().lessons[slug]?.status ?? 'not-started';

export const quizState = (slug: string, id: string) => load().lessons[slug]?.quizzes[id] ?? null;

export function meetsCompletionRequirements(
  slug: string,
  sectionIds: string[],
  quizIds: string[],
): boolean {
  const state = load().lessons[slug];
  if (!state) return false;
  const viewed = Array.isArray(state.sectionsViewed) ? state.sectionsViewed : [];
  // Normal case: the end quizzes decide, and section views are ignored.
  if (quizIds.length > 0) return quizIds.every((id) => state.quizzes?.[id]?.correct);
  // A lesson with no quiz has nothing to answer, so reaching its last section finishes it.
  return sectionIds.length > 0 && sectionIds.every((id) => viewed.includes(id));
}

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
  return { firstTime, xp: firstTime ? XP_PER_LESSON : 0 };
}

export function tryCompleteLesson(
  slug: string,
  sectionIds: string[],
  quizIds: string[],
): { complete: boolean; firstTime: boolean; xp: number } {
  if (!meetsCompletionRequirements(slug, sectionIds, quizIds)) {
    return { complete: false, firstTime: false, xp: 0 };
  }
  return { complete: true, ...completeLesson(slug) };
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
  memory = null;
  storageFailed = false;
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
