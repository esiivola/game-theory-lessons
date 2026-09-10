export const siteConfig = {
  title: 'Game Theory, Played',
  tagline: 'Learn strategy by playing it.',
  description:
    'A visual, playable course in game theory, from the Prisoner’s Dilemma to mechanism design.',
};

/**
 * Build an internal URL that respects the GitHub Pages base path.
 * BASE_URL is '/game-theory-lessons/' in production and '/' in dev.
 */
export const withBase = (p = ''): string =>
  import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + String(p).replace(/^\//, '');
