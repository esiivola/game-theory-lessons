export function settlementRange(
  award: number,
  plaintiffWinBelief: number,
  defendantPlaintiffWinBelief: number,
  plaintiffTrialCost: number,
  defendantTrialCost: number,
) {
  const plaintiffMinimum = plaintiffWinBelief * award - plaintiffTrialCost;
  const defendantMaximum = defendantPlaintiffWinBelief * award + defendantTrialCost;
  const surplus = defendantMaximum - plaintiffMinimum;
  return { plaintiffMinimum, defendantMaximum, surplus, settles: surplus >= 0 };
}
