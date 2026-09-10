// Muddy children / blue eyes: common knowledge from a public announcement. With n muddy children,
// all of them deduce their state and leave on night n. Framework-free and unit-testable.

/** The night on which all muddy children leave, given how many there are. */
export function leaveNight(muddyCount: number): number {
  return muddyCount;
}

/** How many muddy others a muddy child sees (everyone but themselves). */
export function muddySees(muddyCount: number): number {
  return Math.max(0, muddyCount - 1);
}

/**
 * A muddy child's deduction: seeing `seen` muddy others, it reasons "if I were clean, those `seen`
 * would leave on night `seen`; when they do not, I must be muddy too", so it leaves on night seen+1.
 */
export function deduceOwnMuddyNight(seen: number): number {
  return seen + 1;
}
