// Cournot (quantity) and Bertrand (price) duopoly with linear demand P = a - Q and
// constant marginal cost c. Framework-free and unit-testable.

/** Firm i's best-response quantity to the rival's quantity qOther. */
export function bestResponseQ(a: number, c: number, qOther: number): number {
  return Math.max(0, (a - c - qOther) / 2);
}

/** Symmetric Cournot-Nash quantity per firm: (a - c) / 3. */
export function cournotNash(a: number, c: number): number {
  return (a - c) / 3;
}

/** Firm i's profit at quantities (qi, qj). Price cannot go below zero. */
export function profit(a: number, c: number, qi: number, qj: number): number {
  const price = Math.max(0, a - qi - qj);
  return (price - c) * qi;
}

/** Stackelberg leader quantity: (a - c) / 2, committed before the follower replies. */
export function stackelbergLeader(a: number, c: number): number {
  return (a - c) / 2;
}
