type Tier = 'basic' | 'intermediate' | 'expert' | 'applied';

interface OrderableLesson {
  id: string;
  data: {
    tier: Tier;
    order: number;
    kind: 'lesson' | 'case' | 'review';
    placement?: string | null;
  };
}

const tierOrder: Record<Tier, number> = { basic: 0, intermediate: 1, expert: 2, applied: 3 };

export function orderLessons<T extends OrderableLesson>(entries: T[]): T[] {
  const lessons = entries
    .filter(({ data }) => data.kind !== 'case')
    .sort((a, b) => tierOrder[a.data.tier] - tierOrder[b.data.tier] || a.data.order - b.data.order);
  const ids = new Set(lessons.map(({ id }) => id));
  const after = new Map<string, T[]>();
  const capstones: T[] = [];

  for (const entry of entries.filter(({ data }) => data.kind === 'case')) {
    const placement = entry.data.placement;
    if (placement === 'capstone') {
      capstones.push(entry);
      continue;
    }
    if (!placement?.startsWith('after:') || !ids.has(placement.slice(6))) {
      throw new Error(`Applied case ${entry.id} has missing placement anchor: ${placement ?? 'none'}`);
    }
    const anchor = placement.slice(6);
    after.set(anchor, [...(after.get(anchor) ?? []), entry]);
  }

  const ordered = lessons.flatMap((entry) => [
    entry,
    ...(after.get(entry.id) ?? []).sort((a, b) => a.data.order - b.data.order),
  ]);
  return [...ordered, ...capstones.sort((a, b) => a.data.order - b.data.order)];
}
