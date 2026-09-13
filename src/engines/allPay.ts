export function allPayOutcome(myBid: number, rivalBid: number, prize: number) {
  const winner = myBid === rivalBid ? 'tie' : myBid > rivalBid ? 'you' : 'rival';
  const myPrize = winner === 'you' ? prize : winner === 'tie' ? prize / 2 : 0;
  const rivalPrize = winner === 'rival' ? prize : winner === 'tie' ? prize / 2 : 0;
  return {
    myPayoff: myPrize - myBid,
    rivalPayoff: rivalPrize - rivalBid,
    totalSpent: myBid + rivalBid,
    winner,
  } as const;
}
