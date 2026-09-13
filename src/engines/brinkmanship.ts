export const BRINKMANSHIP_THRESHOLD = 2 / 11;

export function rivalHoldPayoff(disasterRisk: number): number {
  return (1 - disasterRisk) * 1 + disasterRisk * -10;
}

export function rivalChoice(disasterRisk: number): 'hold' | 'yield' {
  return disasterRisk >= BRINKMANSHIP_THRESHOLD ? 'yield' : 'hold';
}
