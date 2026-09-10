// VCG on a two-item combinatorial example. Bidder A wants the pair (value a; a single unit is
// worthless to A); bidders B and C each want one unit (values b and c). The efficient allocation
// maximizes total value, and each winner pays the externality it imposes on the others (the drop in
// others' welfare its presence causes). Framework-free and unit-testable.

export interface VcgOutcome {
  allocation: 'A' | 'BC';
  welfare: number;
  payments: Record<string, number>;
}

export function solve(a: number, b: number, c: number): VcgOutcome {
  const aWins = a > b + c;
  if (aWins) {
    // A takes the pair; others get nothing. A's payment = others' best welfare without A = b + c.
    return { allocation: 'A', welfare: a, payments: { A: b + c } };
  }
  // B and C each get a unit. Each pays what its presence costs the others.
  // Without B, the best others can do is max(a, c); with B present, others get c. Payment = max(a,c) - c.
  return {
    allocation: 'BC',
    welfare: b + c,
    payments: { B: Math.max(a, c) - c, C: Math.max(a, b) - b },
  };
}
