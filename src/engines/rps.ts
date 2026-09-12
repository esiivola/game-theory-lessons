// Rock-paper-scissors, with a bot that best-responds to the mix a player commits to.
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

export type Mix = [number, number, number];

/** Draw a move from a declared probability mix. */
export function drawMove(mix: Mix, rng: () => number = Math.random): Move {
  const draw = rng();
  if (draw < mix[0]) return 0;
  if (draw < mix[0] + mix[1]) return 1;
  return 2;
}

/** The bot chooses a best response after observing the player's declared mix. */
export function bestResponseToMix(mix: Mix, rng: () => number = Math.random): Move {
  const max = Math.max(...mix);
  const favourites = MOVES.filter((i) => mix[i] === max);
  const fav = favourites[Math.floor(rng() * favourites.length)];
  return beats(fav);
}
