// Rock-paper-scissors, with an adaptive bot that punishes any move you overplay.
// Moves: 0 rock, 1 paper, 2 scissors.

export type Move = 0 | 1 | 2;
export const MOVES: Move[] = [0, 1, 2];
export const MOVE_NAMES = ['Rock', 'Paper', 'Scissors'] as const;

/** The move that beats m. */
export function beats(m: Move): Move {
  return ((m + 1) % 3) as Move;
}

/** Result for the first player against the second: +1 win, 0 tie, -1 loss. */
export function score(a: Move, b: Move): -1 | 0 | 1 {
  if (a === b) return 0;
  return beats(b) === a ? 1 : -1;
}

/**
 * The bot's move: it counters whatever you have played most so far, so any lopsided mix loses.
 * With no history, or a perfect 1/3-1/3-1/3 record, it plays at random and cannot gain.
 */
export function botMove(counts: [number, number, number], rng: () => number = Math.random): Move {
  const total = counts[0] + counts[1] + counts[2];
  if (total === 0) return Math.floor(rng() * 3) as Move;
  const max = Math.max(counts[0], counts[1], counts[2]);
  const favourites = MOVES.filter((i) => counts[i] === max);
  const fav = favourites[Math.floor(rng() * favourites.length)];
  return beats(fav);
}
