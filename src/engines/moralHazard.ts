// Principal-agent moral hazard with hidden effort and limited liability. Output is High (100) or
// Low (0). Effort e is 0 or 1; P(High|1)=0.8, P(High|0)=0.4; effort costs COST. The risk-neutral
// agent is paid a base plus a bonus on high output. Framework-free and unit-testable.

export const OUT_HIGH = 100;
export const OUT_LOW = 0;
export const P_HIGH_EFFORT = 0.8;
export const P_HIGH_SHIRK = 0.4;
export const COST = 15;

/** Minimum bonus (w_H - w_L) that makes the agent choose high effort. */
export const minBonusForEffort = COST / (P_HIGH_EFFORT - P_HIGH_SHIRK); // 37.5

/** The agent's best-response effort given the bonus (the spread w_H - w_L). */
export function effortChoice(bonus: number): 0 | 1 {
  return bonus * (P_HIGH_EFFORT - P_HIGH_SHIRK) >= COST ? 1 : 0;
}

function pHigh(e: 0 | 1): number { return e === 1 ? P_HIGH_EFFORT : P_HIGH_SHIRK; }

/** The agent's expected utility: expected wage minus effort cost, under its best-response effort. */
export function agentUtility(base: number, bonus: number): number {
  const e = effortChoice(bonus);
  const wage = pHigh(e) * (base + bonus) + (1 - pHigh(e)) * base;
  return wage - (e === 1 ? COST : 0);
}

/** The principal's expected profit: expected output minus expected wage. */
export function principalProfit(base: number, bonus: number): number {
  const e = effortChoice(bonus);
  const wage = pHigh(e) * (base + bonus) + (1 - pHigh(e)) * base;
  const output = pHigh(e) * OUT_HIGH + (1 - pHigh(e)) * OUT_LOW;
  return output - wage;
}
