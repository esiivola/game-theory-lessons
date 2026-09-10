# Onboarding: implementing Game Theory, Played

Context for a fresh session picking up this build. Read this first, then the linked docs. House
rules apply to everything you write, including this repo's docs and any chat: **never use em dashes**,
and **write in the project voice** (plain, direct, concrete, no AI-tell vocabulary). Both are
specified in [SPEC.md](SPEC.md) §11 and [AGENTS.md](AGENTS.md) §5a.

## What this is

A mobile-first, static, GitHub Pages course that teaches game theory by letting you play first, then
formalise. All learner progress lives in the browser (`localStorage`). No backend, no accounts.

## The four source-of-truth docs (read in this order)

1. [README.md](README.md) how to run, deploy, and the repo map.
2. [SPEC.md](SPEC.md) product, pedagogy (§3), course structure (§4), the 63-lesson + 12-case curriculum outline (§5), design system (§9), voice (§11), tech (§12), MVP milestones (§13).
3. [AGENTS.md](AGENTS.md) build conventions: golden rules, design tokens, how to author a lesson (§6), how to build an island (§7), the base-path rule (§8), a11y/perf checklist (§9), definition of done (§12).
4. [docs/LESSONS.md](docs/LESSONS.md) the per-lesson content: for every lesson and applied case, the exact example game with real payoff numbers, the interactive, a worked example, the misconceptions, and a source. This is the authoring brief. It also lists the standard numbers and the reusable interactive engines to build once and reuse.

## Current state (what exists and works)

The MVP vertical slice builds cleanly (`npm run build`, 11 pages) and is verified in preview:

- Design system: `src/styles/global.css` (token CSS, light and dark, ported from the prototype). No Tailwind by design (see Decisions).
- App shell: `BaseLayout.astro` (theme init + toggle, top-bar progress ring), `TopBar.astro`, `BottomNav.astro`.
- Lesson map (`src/pages/index.astro`): reads the content collection, groups by tier and unit, client script sets node states (complete / "Start here" / available), overall and per-tier counts.
- Lesson engine: `LessonLayout.astro` renders the MDX and runs the completion controller (IntersectionObserver marks sections viewed; counts `[data-quiz]`; listens for `gt:solved`; on all-solved calls `completeLesson`, fires confetti, reveals the done panel).
- Interactives (Svelte 5 islands): `PayoffMatrix.svelte` (modes: read, play with prediction gate, nash), `QuizCard.svelte`, `WarmUp.svelte`.
- UI components (Astro): `Callout` (key-idea / ask / reality-check), `DefinitionAside`, `WorkedExample`, `ExhibitCaption`, `SourcesList`, `Section` (wraps a `data-section` block).
- Progress: `src/lib/progress.ts` is the ONLY module that touches `localStorage`. `src/lib/ui.ts` has ring/icon SVG helpers.
- Pages: map, `lessons/[slug]`, `progress` (ring, XP, days, per-tier bars, lesson list), `about` (references + export/reset), `404`.
- Content: 7 Basic lessons authored, `what-is-a-game`, `rationality`, `expected-utility`, `dominance`, `rationalizability`, `pure-nash`, and the fully playable `prisoners-dilemma` (the flagship). Schema in `src/content.config.ts`; bibliography in `src/content/references.ts`.
- Deploy: `.github/workflows/deploy.yml` (Astro to Pages).

Verified behaviors: build passes; map renders with live progress; the PD lesson renders the anchor, headline, semantic-colored lead, hydrated warm-up, prediction-gated matrix, KaTeX inline and centered display math, definition aside, worked example, quizzes; completing both quizzes fires confetti and writes progress; theme toggle and export/reset work.

## How to run

```bash
npm install
npm run dev       # http://localhost:4321/game-theory/
npm run build     # ./dist
npm run preview   # serves the built site at the real base path
```

## Architecture and conventions you must follow

- **Design = tokens, not hex.** Everything is CSS variables in `global.css`, defined for light and overridden for dark. Reuse the existing classes (`.matrix`, `.cell`, `.quiz`, `.keyidea`, `.def-aside`, `.node-row`, and so on). Do not add Tailwind.
- **Base path.** Production serves under `/game-theory/`. Never hard-code internal links or asset paths. Use `withBase()` from `src/config/site.ts`. Test with `npm run preview`, not just `dev`.
- **Progress is client-only.** Pages server-render a neutral skeleton, then a client `<script>` reads `progress.ts` and updates the DOM, re-rendering on the `gt:progress` event (dispatched by `progress.ts` on every write) and on `pageshow`. Only `progress.ts` reads or writes `localStorage`.
- **Completion.** A lesson completes when every `[data-quiz]` in the article is solved. `QuizCard` dispatches `window` event `gt:solved` with `{slug, id}` on a correct answer; the controller in `LessonLayout` counts them. If you add a non-quiz gate, wire it the same way.
- **Islands.** Game math goes in framework-free modules under `src/engines/` (none yet; add as needed); the `.svelte` island is a thin wrapper. Every island: keyboard-operable, respects `prefers-reduced-motion`, has a reset, uses semantic cooperate/defect colors and tabular figures. Hydrate with `client:visible`.

## Decisions and deviations (do not silently reverse)

- **No Tailwind.** The design is fully variable-driven; hand-authored token CSS matches the prototype and keeps the bundle lean. The SPEC names Tailwind, but this deviation is intentional and agreed in-session. Revisit only if the user asks for utility classes.
- **Fonts** self-hosted via Fontsource: GFS Didot (display), Inter (body), JetBrains Mono (numbers).
- **`site`/`base`** inferred as `https://esiivola.github.io` + `/game-theory`. Change `site` in `astro.config.mjs` if the account differs.
- **The prototype** at `design/prototype.html` (published Artifact) is the visual and interaction reference. The Astro site reimplements it; keep them visually consistent.

## Gotchas already hit (save yourself the time)

- **Astro 7 Markdown.** The default processor changed. `@astrojs/markdown-remark` must be installed for `markdown.remarkPlugins` / `rehypePlugins` (we use remark-math + rehype-katex). It is installed. Astro prints a deprecation warning suggesting you pass plugins to `unified({...})` directly; it still works pinned to `astro@^7.3.1`. Clean this up before a major Astro upgrade.
- **Display math** must be a multi-line block to render centered:
  ```
  $$
  T > R > P > S
  $$
  ```
  A single-line `$$ ... $$` renders inline. Inline math uses `$ ... $`.
- **MDX prop strings.** Component props in MDX are JS. An apostrophe inside a single-quoted string breaks parsing (for example "Prisoner's"). Use double quotes for option/feedback strings and avoid double quotes inside them, or reword.
- **`client:visible` hydration.** Islands hydrate when scrolled into view. Fine for users; but automated testing must physically scroll (and the browser pane must be visible) before clicking an island, or nothing happens. The completion controller counts server-rendered `[data-quiz]` wrappers, which exist before hydration, so counting is reliable.
- **Aliases.** `@/*` resolves to `src/*` (Astro reads `tsconfig.json` paths). Works in `.astro`, `.ts`, `.svelte`, and MDX imports.
- **Content collection** uses the loader API: `src/content.config.ts` with `glob()`, entry `id` is the filename (the slug). Render with `render(entry)` from `astro:content`.

## How to add a lesson (the common task)

Follow AGENTS.md §6 and the matching entry in docs/LESSONS.md. Concretely, copy an existing MDX file
in `src/content/lessons/`. Set frontmatter (`title, tier, unit, unitName, order, kind, summary,
prereqs, concepts, refs, anchorEmoji`). Structure the body as: anchor div, `# Title`, `<p class="lead">`,
then `<Section id="...">` blocks in the §3.2 order (warm-up, predict-then-play, self-explanation, the
math, worked example, key idea, quiz). Put the flagship interaction in `play`; gate it with the
`predict` prop when prediction-first fits. Use `QuizCard` with a stable `slug` (the file id) and `id`
per question, misconception feedback on every option. Add any new citation keys to
`src/content/references.ts` and pass them to `<SourcesList refs={[...]} />`. The map and routes pick
the lesson up automatically from the collection.

## Prioritized backlog (what to build next)

1. **Finish the Basic tier** (L8 mixed strategies, L9 existence, L10 zero-sum, L11 Schelling, L12 Cournot, L13 commons, L14 backward induction, L15 subgame perfection), authored from docs/LESSONS.md. New interactives needed: a mixed-strategy slider duel, an RPS existence widget, a foldable game tree. Extend `PayoffMatrix` where it fits rather than making new components.
2. **Flagship interactives** from the MVP list: `RepeatedPD` with a discount-factor slider and a small tournament (L20), and the penalty-kick shootout vs an adaptive bot (A8). Put the engines in `src/engines/`.
3. **Fill `references.ts`** with the full per-lesson citations captured in the benchmarks (docs/LESSONS.md names one canonical source per lesson; SPEC §5f lists the plan).
4. **Concept-map view** (the "Map" tab in the SPEC nav): render the prerequisite DAG from `prereqs`, with node states.
5. **Post-MVP structure:** retrieval checkpoints, spaced-review lessons, and mastery gating for the Expert tier (SPEC §4, §7).
6. **Cleanups:** resolve the Astro markdown deprecation; run an a11y and Lighthouse pass to the SPEC §10 targets; add `src/engines/` unit tests for the tricky math (best response, Nash finding).

## Verifying your work

Run `npm run build` (must be clean) and `npm run preview`, then check at ~375px width. When testing
islands in an automated browser, scroll them into view first so they hydrate. Confirm no em dashes in
the diff (`grep -r "—" src`).
