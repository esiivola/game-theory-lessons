// Common-value auctions and the winner's curse. Every bidder wants the same true value V but sees
// only a noisy private signal. Winning is bad news: it means your signal was among the highest, so
// it likely overstated V. Reuses the sealed-bid resolver. Framework-free and unit-testable.

import { resolve, type Format } from './auction';

/** Each bidder's signal: the true value V plus symmetric noise of half-width `spread`. */
export function drawSignals(V: number, n: number, spread: number, rng: () => number = Math.random): number[] {
  return Array.from({ length: n }, () => V + (rng() * 2 - 1) * spread);
}

export interface CVOutcome { winner: number; price: number; sold: boolean; winnerProfit: number; }

/** Resolve a common-value auction and report the winner's realized profit, V minus the price paid. */
export function roundOutcome(V: number, bids: number[], format: Format, reserve = 0): CVOutcome {
  const o = resolve(bids, format, reserve);
  return { ...o, winnerProfit: o.sold ? V - o.price : 0 };
}
