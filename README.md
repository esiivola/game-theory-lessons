# Game Theory, Played

A visual, playable game theory course. Mobile-first, static, hosted on GitHub Pages, with all
progress stored in the browser. See [SPEC.md](SPEC.md) for the product and design spec,
[AGENTS.md](AGENTS.md) for build conventions, and [docs/LESSONS.md](docs/LESSONS.md) for the
per-lesson content (example games and interactions).

## Stack

Astro (static, MDX content collection), Svelte 5 islands for the interactives, KaTeX for math
(remark-math + rehype-katex), and a hand-authored token CSS design system in `src/styles/global.css`
(no Tailwind: the design is entirely CSS-variable driven).

## Develop

```bash
npm install
npm run dev       # http://localhost:4321/game-theory/
npm run build     # static output to ./dist
npm run preview   # serve the built site (test the real base path)
```

## Deploy (GitHub Pages)

1. In the repo settings, set Pages -> Build and deployment -> Source to **GitHub Actions**.
2. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys.
3. If your GitHub account is not `esiivola`, update `site` in `astro.config.mjs`. The project is
   served under the `/game-theory` base path; all internal links go through `withBase()` in
   `src/config/site.ts`, so keep using that helper.

## Structure

- `src/content/lessons/*.mdx` one file per lesson (typed frontmatter in `src/content.config.ts`).
- `src/components/interactive/*.svelte` the playable islands (payoff matrix, quiz, warm-up).
- `src/components/ui/*.astro` static building blocks (callouts, sources, nav, section wrapper).
- `src/lib/progress.ts` the only module that touches `localStorage`.
- `src/content/references.ts` the shared bibliography, keyed by cite key.

## What is built

The MVP vertical slice: the lesson map with live progress, the Progress and About pages, and the
first arc of Basic lessons (What is a game, Rationality, Expected utility, Dominance,
Rationalizability, Nash equilibrium) plus the fully playable Prisoner's Dilemma. The full 63-lesson
plus applied-case curriculum is specified in SPEC.md and docs/LESSONS.md.
