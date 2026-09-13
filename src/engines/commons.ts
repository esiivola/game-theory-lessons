export interface ResourceStep {
  growth: number;
  harvest: number;
  nextStock: number;
}

export function resourceStep(
  stock: number,
  harvests: number[],
  capacity: number,
  growthRate: number
): ResourceStep {
  const growth = growthRate * stock * (1 - stock / capacity);
  const harvest = harvests.reduce((sum, amount) => sum + amount, 0);
  const nextStock = Math.min(capacity, Math.max(0, stock + growth - harvest));
  return { growth, harvest, nextStock };
}

export function graduatedPenalty(
  catchAmount: number,
  limit: number,
  violationNumber: number,
  rate: number
): number {
  return Math.max(0, catchAmount - limit) * Math.max(0, violationNumber) * rate;
}
