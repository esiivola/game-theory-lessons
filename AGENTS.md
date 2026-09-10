# AGENTS.md, working guide for this repo

Conventions and guardrails for AI coding agents (and humans) building **Game Theory, Played**, a
static, mobile-first interactive game-theory course on GitHub Pages. Read [SPEC.md](SPEC.md) for
what and why; this file is how.

> If SPEC.md and this file disagree, SPEC.md wins on product and design intent; this file wins on
> code conventions. Keep both updated when a decision changes.

---

## 1. What this project is (30-second version)

A course of short, one-concept lessons that teach game theory by letting you play first, then
explaining, then giving the formal math. Static Astro site, lessons in MDX, math via KaTeX,
interactive mini-games as Svelte islands, all progress in `localStorage`. No backend, no accounts,
no analytics. Minimal, consulting-grade visual design matched to esiivola.github.io. Mobile-first
(design at about 375px, then scale up).

---

## 2. Stack and the only commands you need

Astro (site, routing, MDX), Tailwind CSS (styling via design tokens), Svelte 5 (interactive
islands), vanilla TypeScript (simulation engines), remark-math and rehype-katex (math), GitHub Pages
(host).

```bash
npm install          # deps
npm run dev          # local dev server (http://localhost:4321)
npm run build        # static build to ./dist
npm run preview      # serve the built site locally (test the real base path)
npm run check        # astro check + svelte-check + tsc (run before you call anything done)
```

Node 20+. Package manager: npm (lockfile committed). Do not add a second package manager.

---

## 3. Golden rules

1. **Write like a person, and never use em dashes.** Follow the voice guide in §5a: plain, direct, concrete, no AI-tell vocabulary (no delve, leverage, robust, seamless, crucial-as-filler, comprehensive-as-filler, and the rest of the banned list), no em dashes anywhere (copy, code, comments, commit messages, docs). Use commas, colons, parentheses, or a rewrite. Sweep generated files before delivering.
2. **Mobile-first, and simple.** Build and verify at about 375px before desktop. Tap targets 44px or more. Body text 16px or more. No horizontal scroll on the page body (wide tables, diagrams, and display math scroll inside their own `overflow-x:auto` container). Prefer whitespace and hairlines to boxes and shadows; one clear action per screen; fewer distinct UI treatments. Simplicity is a requirement, not a preference.
3. **Follow the pedagogy** (SPEC §3): warm-up recall, then prediction BEFORE instruction, then play, then formalise with concreteness fading (concrete, then matrix, then notation), then worked-example-to-solo, then a Bloom-laddered quiz whose last item interleaves a prior concept. One new mechanic per lesson. A correct formal section. A real-world anchor. Retries reward persistence.
4. **Include the math, and get it right.** The lead reader is mathematically fluent. Each lesson has a formal section with precise definitions and a short, correct derivation, typeset with KaTeX. Do not hand-wave or water it down. If you are unsure a claim is correct, check it before shipping.
5. **Cite sources.** Every lesson ends with a Sources list wired to the shared bibliography (`src/content/references.ts`). Add new references there with a stable cite key; never duplicate a reference inline.
6. **Ship JS only where needed.** Prose stays zero-JS. Every interactive is an island hydrated `client:visible` (default) or `client:idle`. Never make a whole page an island.
7. **Tokens, not hex.** All colours, spacing, and radii come from CSS variables / the Tailwind theme. No raw hex or magic px in components. Both light and dark must work (they do automatically if you use tokens).
8. **One owner for storage.** Only `src/lib/progress.ts` reads and writes `localStorage`. Components use the store or the API, never `localStorage` directly.
9. **Accessible by construction.** Real `<button>`/`<a>`, visible focus, keyboard-operable, ARIA on progress and feedback, respects `prefers-reduced-motion`. See §9.
10. **Keep it small.** Reuse existing components and patterns before adding a dependency. Prefer CSS/SVG over a library. New deps need a one-line justification.
11. **Mind the base path.** GitHub Pages serves under `/game-theory/`. Every internal link and asset goes through the base helper (§8). A hard-coded `/lessons/x` link 404s in production.
12. **Verify before claiming done.** Run `npm run check` and `npm run build`; test the built site with `npm run preview` at mobile width. Report real results, including failures.

---

## 4. Repo map (where things go)

```
src/
  config/site.ts        siteConfig (title, tagline) + withBase() link helper
  styles/tokens.css     design-system CSS variables (light + dark)   <- edit palette HERE only
  content/
    config.ts           lesson collection schema (frontmatter types incl. refs)
    references.ts       shared bibliography, keyed by cite key
    lessons/*.mdx       one lesson per file (see §6)
  layouts/              BaseLayout.astro, LessonLayout.astro (imports KaTeX CSS)
  pages/                index (map), lessons/[slug], progress, about (+ References), 404
  components/
    ui/                 shell, BottomNav, TopBar, LessonCard, ProgressRing, QuizCard, Callout, DefinitionAside, ExhibitCaption, SourcesList…
    interactive/        Svelte islands (PayoffMatrix.svelte, RepeatedPD.svelte, …)
  engines/              vanilla TS sim logic (pd.ts, tournament.ts, segregation.ts, auction.ts …)
  lib/
    progress.ts         THE localStorage owner (typed, versioned, try/catch)
    store.ts            reactive progress store consumed by islands + map
    quiz.ts             quiz types + scoring
design/prototype.html   standalone clickable design prototype (published as the design artifact)
```

- **UI vs interactive:** `components/ui` is presentational with little or no game logic; `components/interactive` are the mini-game islands. Game math lives in `engines/` (framework-free, unit-testable), not inside the Svelte component.

---

## 5. Design tokens and styling

- The palette, spacing scale, radii, and font stacks live once in `src/styles/tokens.css` as CSS variables, with a dark-theme override block. Tailwind maps utility colours to those variables so `bg-surface`, `text-ink`, `text-cooperate`, and the like resolve in both themes.
- **Palette (matched to esiivola.github.io):** cream `--bg #F4F1E8`, warm-white `--surface #FFFDF7`, well `--surface-2 #E8E4DA`, ink `--ink #0B1721`, muted `--ink-muted #59636A`, hairline `--border #DED8CC`, accent teal `--accent #0A6F6A`. Semantic domain colours: `--cooperate` (teal, equals accent) and `--defect #B24A2E`. Sparing `--gold #9C7A1E` for XP. Dark theme values are in SPEC §9.1 and tokens.css.
- **Buttons:** primary action uses `--ink` background with `--bg` text (dark navy pill in light, cream pill in dark), matching the site. Ghost buttons are surface with a hairline border.
- **Type:** GFS Didot for display and headings (weight 400, large, tight negative tracking), Inter for body and UI, JetBrains Mono for numbers and matrices (tabular figures). Self-host via Fontsource where possible, `font-display: swap`, with a real fallback stack.
- **Minimal look:** near-flat. Prefer hairline borders and whitespace to shadow. Small radii (8 to 10). Reserve soft shadow for the device frame and transient overlays.
- **Exhibits:** label domain figures with an uppercase caption ("Exhibit 1, payoff matrix (your gain, their gain)"). Number them; they are referenced, so this is structural, not decorative.
- **Theme rule:** never define a colour only inside a dark block. Define the light value on the token, override in dark. Give `body` an explicit token background.

---

## 5a. Writing voice (read before writing any copy)

Full guide in SPEC §11. The one-line target: a knowledgeable person explaining an idea to a smart
colleague. Plain, direct, concrete, quietly confident, occasionally dry, zero hype. Matches
esiivola.github.io.

- **Do:** open on a concrete situation or a plain claim; use "you"; vary sentence length (a long sentence, then a short blunt one); use real numbers and named examples; state the point first, then explain; take a stance; use plain connectives (And, But, So); let a paragraph be one line; define a term in-line the first time; in quiz feedback say why an answer is right or wrong, not "Great job".
- **Don't use these words (empty, decorative senses):** delve, leverage, utilize, harness, foster, cultivate, unlock, unleash, elevate, navigate (figurative), underscore, showcase, empower, streamline, boast, surpass, robust, seamless, crucial/pivotal/vital (unqualified), comprehensive (as filler), intricate, nuanced, transformative, groundbreaking, revolutionary, meticulous, profound, myriad, landscape, realm, tapestry, journey, endeavor, testament, insights (as filler), synergy. A word is fine when it carries real specific meaning.
- **Don't use these shapes:** "In today's world", "Let's dive in", "In conclusion", "Ultimately"; "not only X but also Y"; "it is not just X, it is Y"; reflexive rule-of-three; Moreover/Furthermore/Additionally as glue; uniform paragraph blocks; bullet lists where reasoning belongs; empty enthusiasm and vague praise; hedging on every claim; recap paragraphs; em dashes.
- Read copy aloud before shipping. If you would not say it to a colleague, cut it.

---

## 6. Authoring a lesson (the common task)

A lesson is one MDX file in `src/content/lessons/`. Frontmatter is typed by `src/content/config.ts`:

Follow the §3.2 template order from SPEC: warm-up, hook, predict-then-play, self-explanation,
formalise, worked example, key idea, quiz, sources.

```mdx
---
title: "The Prisoner's Dilemma"
slug: "prisoners-dilemma"          # URL + progress key; kebab-case, stable forever
tier: "basic"                       # basic | intermediate | expert
unit: 2                             # unit number 1..18 (see SPEC §5)
order: 7                            # global lesson order (drives the linear map)
kind: "lesson"                      # lesson | case | review  (case = applied Unit 18; review = spaced-review)
placement: null                     # for kind:case only, e.g. "after:prisoners-dilemma" | "capstone"
summary: "Why two rational players both betray, and both lose."
tags: ["dilemma", "cooperation"]
estMinutes: 6
mvp: true
prereqs: ["dominance", "pure-nash"]        # slugs; drives the concept map + gating
concepts: ["prisoners-dilemma", "dominance"] # concept ids for adaptive scaffolding + interleaving
anchorImage: "/images/gas-stations.svg"
refs: ["axelrod1984", "flood1958", "nash1950", "osborne1994"]   # keys in references.ts
---

import PayoffMatrix from "@/components/interactive/PayoffMatrix.svelte";
import WarmUp from "@/components/ui/WarmUp.astro";
import Quiz from "@/components/ui/QuizCard.astro";
import Callout from "@/components/ui/Callout.astro";
import DefinitionAside from "@/components/ui/DefinitionAside.astro";
import WorkedExample from "@/components/ui/WorkedExample.astro";
import SourcesList from "@/components/ui/SourcesList.astro";

<WarmUp from={["dominance","pure-nash"]} />   {/* 2 retrieval questions from earlier lessons */}

Hook: open on a concrete situation, in the target voice. Two gas stations across the street ...

## Predict, then play                {/* prediction commits BEFORE any explanation */}
<PayoffMatrix client:visible sectionId="play" preset="prisoners-dilemma" predictFirst />

## Why did that happen?              {/* self-explanation, tap-to-reveal */}
<Callout kind="ask">Before reading on: why did both players end up worse off?</Callout>

## The math                         {/* concreteness fading: name, then the matrix above, then notation */}
A game in normal form is $G=(N,(S_i),(u_i))$ ...

$$u_i(D,a) > u_i(C,a)\quad\text{for all } a\in S_{-i}.$$

<DefinitionAside label="Nash equilibrium">
A profile $s^*$ is a Nash equilibrium if $u_i(s_i^*,s_{-i}^*) \ge u_i(s_i,s_{-i}^*)$ for all $s_i$, all $i$.
</DefinitionAside>

## Find the equilibrium yourself     {/* worked -> faded -> solo; fades for advanced learners */}
<WorkedExample sectionId="worked" preset="prisoners-dilemma" />

## Key idea
<Callout kind="key-idea">Both defecting is the only stable outcome, yet both would prefer to cooperate.</Callout>

## Check yourself                    {/* Bloom ladder; last item interleaves a prior concept */}
<Quiz id="q1" level="apply" ... />
<Quiz id="q2" level="analyse" interleaves="dominance" ... />

<SourcesList refs={frontmatter.refs} />
```

**Rules when adding a lesson**
- `slug` is permanent, it is the progress key. Renaming it orphans learner progress.
- Set `tier`, `unit`, `order`, `prereqs`, and `concepts` correctly. `prereqs` and `concepts` drive the concept map, mastery gating, adaptive scaffolding, and interleaved retrieval.
- Give each scrollable section a stable `sectionId` (used for section-viewed tracking and completion).
- **Order matters:** prediction commits before any explanation; the concrete game comes before notation (concreteness fading); the quiz ends with an item that interleaves an earlier concept.
- Write a correct formal section: define the objects, state the claim, give a short derivation. Use `$...$` inline and `$$...$$` for display. Keep display math from overflowing (rewrite or wrap in `overflow-x:auto`).
- 2 to 4 quizzes on a Bloom ladder (recognise, apply, analyse), each with a stable `id`, a correct answer, and explanatory feedback for every wrong option (each distractor maps to a specific misconception you correct).
- List sources via `refs` (keys in `references.ts`); the SourcesList and the global References page render from those keys.
- Keep prose short and in the §5a voice. The interaction and the math carry the idea. One new mechanic only. No em dashes.
- The lesson map reads the collection via `tier`, `unit`, and `order`; the concept map reads `prereqs`.
- **Applied cases** (`kind: "case"`, Unit 18) apply existing theory to a real episode with real cases and empirical evidence. Set `placement` so an "after:<slug>" case is surfaced inline right after its theory lesson, and a "capstone" case runs in the closing sequence (SPEC §4, §5a). Behavioral lessons (Unit 17) are Expert tier and carry the actual models (level-k, QRE logit, Fehr-Schmidt utility, EWA); get the models right, they are the point.
- **Reality-check callouts:** seed short `Callout kind="reality-check"` asides in Basic and Intermediate that forward-link to the Behavioral unit (SPEC §5e). One claim, a small exhibit, a link. Do not derail the core lesson.

---

## 7. Building a mini-game island

- Put game logic and math in `src/engines/<name>.ts` as pure, typed functions (`bestResponse(matrix)`, `playRound(strategy, history)`). Tests live here; reason carefully here; keep it framework-free.
- Put presentation and interaction in `src/components/interactive/<Name>.svelte`, importing the engine. Props are data-driven (a `preset` key or an explicit payoff matrix) so one component serves many lessons.
- **Every island must:**
  - accept a `sectionId` and report "viewed" and meaningful "interacted" events to the store so progress and completion work;
  - respect `prefers-reduced-motion` (and the manual toggle): no autoplay loops, offer step or instant instead of animated transitions;
  - be keyboard operable (buttons and sliders focusable, arrow-key support on sliders) with visible focus and appropriate ARIA (`aria-live` for result readouts, `role="progressbar"` where relevant);
  - provide an obvious reset or replay;
  - use semantic cooperate/defect colours and tabular figures;
  - lay out responsively (works at 320px wide).
- Canvas sims: drive with `requestAnimationFrame`, pause when off-screen or reduced-motion, clean up on destroy. Keep per-island JS small; lazy-hydrate.

---

## 8. Routing, links, and the base path (the number-one footgun)

- Production base is `/game-theory/`. Configure in `astro.config.mjs`: `site: 'https://<USERNAME>.github.io'`, `base: '/game-theory'`.
- **Never hard-code internal URLs.** Use the helper:
  ```ts
  // src/config/site.ts
  export const withBase = (p: string) =>
    (import.meta.env.BASE_URL + p.replace(/^\//, '')).replace(/\/{2,}/g, '/');
  ```
  Then `<a href={withBase('lessons/nash')}>`. Same for `<img src>` and any public-asset fetch.
- Test the base path with `npm run preview` (not just `npm run dev`) before declaring a nav change done.
- `public/.nojekyll` must exist. A friendly `src/pages/404.astro` handles genuine misses.

---

## 9. Accessibility and performance checklist (per change)

- [ ] Works at 320 to 414px wide; no body horizontal scroll; tap targets 44px or more; body text 16px or more.
- [ ] Keyboard: everything reachable and operable; visible focus ring; logical order; Esc closes modals.
- [ ] `prefers-reduced-motion` honoured (and manual toggle); no autoplay looping motion.
- [ ] Contrast AA in both light and dark.
- [ ] ARIA: headings in order; `role="progressbar"` plus `aria-valuenow/max`; `aria-live` for quiz feedback and XP; meaningful SVG has `<title>`, decorative SVG `aria-hidden`. KaTeX MathML is present for screen readers.
- [ ] Islands hydrate lazily; no unnecessary JS on prose pages; KaTeX CSS scoped to lesson pages.
- [ ] `npm run build` clean; mobile Lighthouse about Perf 95+ / A11y 100 / BP 95+ / SEO 95+; LCP under 2.5s, CLS under 0.1, INP under 200ms.
- [ ] Zero em dashes in the diff.

---

## 10. Progress and storage API

- `progress.ts` owns key `gt.progress.v1`, wraps all access in `try/catch`, parses with a schema-default fallback, and exposes typed methods (`markSectionViewed(slug, sectionId)`, `recordQuiz(slug, id, correct)`, `isLessonComplete(slug)`, `getProgress()`, `exportJSON()`, `reset()`). Completion equals all sections viewed and all quizzes answered correctly, then set `completedAt`, award XP, add today to `daysLearned`, fire the celebration.
- Bump the version key and write a migration if the schema changes; never silently break saved data.
- Settings must offer Export and Reset, and state that data stays on the device.

---

## 11. Do / Don't

**Do**
- Keep lessons short and interactive; make the learner act before you explain, then give the real math.
- Reuse PayoffMatrix, QuizCard, Callout, DefinitionAside, SourcesList, ProgressRing instead of new bespoke markup.
- Put game math in `engines/` and unit-test the tricky ones (best-response, Nash finding, tournament scoring, mixed-strategy indifference).
- Write copy in a plain, precise, colleague voice; define terms on first use.

**Don't**
- Don't use em dashes, anywhere.
- Don't add a backend, accounts, analytics, or any network call for core functionality.
- Don't ship a formal section that is vague or wrong; check the derivation.
- Don't introduce streaks-you-can-lose, leaderboards, or childish mascot energy.
- Don't hard-code colours, links, or the base path.
- Don't put two new mechanics in one lesson, or explain before letting the learner play.
- Don't touch `localStorage` outside `progress.ts`.
- Don't ship an island that breaks keyboard use or ignores reduced-motion.

---

## 12. Definition of done (for a lesson or feature)

A lesson is done when: it follows SPEC §5 anatomy; has at least one interactive that is
keyboard-operable and reduced-motion-aware; has a correct, typeset formal section; includes a
predict-then-reveal beat; has 2 to 4 quizzes with explanatory feedback and retry; anchors to a
real-world scenario; lists sources wired to the shared bibliography; contains zero em dashes;
completion flips the map node and awards XP; passes the §9 checklist; `npm run check` and `npm run
build` are clean; and it has been eyeballed at 375px on the previewed (base-path) build.

A feature or PR is done when: it is mobile-verified, token-styled, accessible, base-path-safe, adds
no unjustified deps, contains zero em dashes, and the build and checks pass, with results reported
honestly.
