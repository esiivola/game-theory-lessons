# SPEC: Game Theory, Played

> Working title: **"Game Theory, Played"**, tagline *"Learn strategy by playing it."*
> (Title is a placeholder, safe to rename; it lives only in `siteConfig`.)

A mobile-first, static website that teaches game theory the way the best interactive explainers do:
you play first, form a guess, see what happens, then get the idea and the real math. It runs from a
short first lesson all the way to graduate topics (mechanism design, cooperative theory, algorithmic
and behavioral game theory), with a strong applied track that ties the theory to real decisions.
Everything runs client-side and is hosted on GitHub Pages; all learner progress lives in the browser
(`localStorage`). No backend, no accounts, no tracking.

This is the source of truth for what we build and why. Build conventions live in [AGENTS.md](AGENTS.md).

**Two house rules that override defaults everywhere (content, code, comments, docs):**
1. Never use em dashes. Use commas, colons, parentheses, or a rewrite.
2. Write like a person, not a model. Follow the voice guide in §11. No AI-tell vocabulary.

---

## 1. Goals and non-goals

### Goals
- Teach game theory from first principles to expert level, comprehensively, comparable to a full university sequence plus graduate topics, with a strong applied and behavioral track.
- Three tiers (Basic, Intermediate, Expert) of theory, 63 core lessons across 17 units, plus a 12-case applied track (Unit 18) that connects the theory to real decisions. Each lesson is one teachable concept. Per-lesson example games and interactives are specified in [docs/LESSONS.md](docs/LESSONS.md).
- Every lesson is interactive: at least one playable mini-game or manipulable diagram.
- Intuition first, then the real math. Each lesson has a correct, typeset formal section for a mathematically fluent reader, without watering it down.
- Evidence-based teaching: prediction before instruction, concreteness fading, retrieval practice and spaced review, worked examples, misconception-driven quizzes (§3).
- Prose that reads like an expert wrote it (§11). Cite sources per lesson and in a shared bibliography.
- Neat, minimal, editorial design in a management-consulting register, matched to the developer's own site (esiivola.github.io). Simplicity is a feature.
- Easy navigation: a lesson map and a concept map that show structure and suggested order while letting the learner move freely within an unlocked tier.
- Progress persists in the browser and shows in navigation. Fully static, fast on mobile (Lighthouse 95+), privacy-friendly.

### Non-goals (for now)
- No accounts, login, cloud sync, or leaderboards.
- No multiplayer against other humans (opponents are bots).
- No punitive streaks or dark-pattern gamification.
- No CMS or server-rendered content.

---

## 2. Audience, tiers, and platform

- **Audience:** curious adults and students. The lead reader is mathematically fluent, so formal sections are complete and correct. A beginner can follow the game and the plain-language idea and skip the notation.
- **Tiers:**
  - **Basic** (L1 to L15): the shared spine. Static games, solution concepts, classic applications, sequential games. Open access, browse freely.
  - **Intermediate** (L16 to L32): correlation and complementarities, bargaining, repeated games (including imperfect monitoring), incomplete information, auctions, signaling, adverse selection and cheap talk, information design, contract theory.
  - **Expert** (L33 to L63): refinements and epistemics, mechanism design and implementation, cooperative theory, matching and market design, evolutionary and learning dynamics, algorithmic game theory, and a full behavioral and experimental unit.
  - **Applied track** (Unit 18, A1 to A12): real-world case lessons. The single-concept cases are surfaced inline right after their theory lesson; the multi-concept ones form a capstone (see §4).
- **Device:** mobile portrait first (design at 360 to 414px). Pleasant on desktop.
- **Session length:** a Basic lesson is 4 to 6 minutes; Expert lessons run longer because the math is heavier. The learner can stop and resume anytime.

---

## 3. Pedagogical model (evidence-based)

These rules come from the learning-science benchmark (productive failure, retrieval practice,
spacing and interleaving, concreteness fading, worked examples, cognitive load theory, self
explanation, Bloom progression, self-determination theory). They drive the lesson template and the
course structure. They are not optional.

### 3.1 The seven levers, and how we use them
1. **Prediction before instruction (productive failure).** The learner commits a guess or a move before anything is explained. The gap between the guess and the result is the teaching moment.
2. **Concreteness fading.** Concept concrete first (the game just played), then pictorial (the payoff matrix), then symbolic (notation), one symbol at a time. Never open with notation.
3. **Retrieval practice and spacing.** Each lesson opens with a warm-up that retrieves earlier concepts. Every quiz includes an item that interleaves a prior concept. Checkpoints and reviews re-surface old material on an expanding schedule.
4. **Worked example, faded, then solo.** For any procedure, show one fully worked, one half-worked, then one solo, each with explanatory feedback.
5. **Self-explanation prompts.** After the reveal, "why did that happen?" before formalising; "where else would this apply?" at the close.
6. **Misconception-driven quizzes with explanatory feedback.** Distractors map to specific known errors; feedback says why the wrong answer is wrong. Unlimited retries.
7. **Adaptive scaffolding (expertise reversal).** Fade worked examples as the learner succeeds; the Expert tier is problem-first with solutions on demand; every lesson has a "skip to the problems" control.

### 3.2 The lesson template (canonical)
```
0  Warm-up recall     2 quick retrieval questions from earlier lessons (interleaved)
1  Hook               a concrete situation, in plain language
2  Predict then play  commit a prediction or a move FIRST, then play, then see the result
3  Self-explanation   "why did that happen?" (short, tap-to-reveal or one-line input)
4  Formalise          concreteness fading, segmented: name -> matrix -> notation, one step per screen
5  Worked -> faded -> solo   for any procedure, with explanatory feedback (fades as learner advances)
6  Key idea           one sentence plus one diagram (dual-coded)
7  Quiz               2 to 4 items on a Bloom ladder (recognise -> apply -> analyse); misconception
                      distractors; explanatory feedback; retry; last item interleaves a prior concept
8  Elaboration close  "where else does this apply?" transfer prompt (one line)
9  Sources            per-lesson references, wired to the shared bibliography
```
The formal block is visually distinct so a beginner can skim it and a fluent reader can rely on it.
Reading is a vertical scroll; quizzes are stepped cards, one per screen, 44px targets, immediate
feedback, retry.

---

## 4. Course structure

- **Concept map (prerequisite DAG).** Lessons form an explicit dependency graph, not a strict line. The static core (L1 to L10) is the trunk; branches hang off it: cooperative theory (needs L6), evolutionary and learning dynamics (need L8), algorithmic game theory (need L9 and L16), behavioral (needs L6, L8, L15). The DAG is the sequencing logic and the mastery-gating spec, and it is shown to the learner as a map.
- **Applied cases interleave, and also capstone (hybrid).** Single-concept applied cases (Unit 18) are surfaced inline right after their home theory lesson, so abstraction pays off immediately (penalty kicks after mixed strategies, matching markets after Gale-Shapley, deterrence after commitment). The multi-concept cases (Cuban Missile Crisis, a spectrum auction, climate) form a short capstone at the end, because real episodes combine several tools at once. This mirrors how the applied texts (Dixit and Nalebuff; Dixit, Skeath and Reiley) close each chapter with a case and how professional programs run integrative case weeks. It also protects completion rates.
- **Reality-check callouts seed behavioral ideas early.** Do not quarantine all behavior at the end. Short one-screen "Reality check" callouts appear in the Basic and Intermediate tiers and forward-link to the Behavioral unit: the beauty contest after L8 (real first-round play is not the equilibrium), ultimatum rejection after L15 (credibility has behavioral limits), the centipede alongside L14 and L15, free-riding versus conditional cooperation inside L12, the winner's curse inside L26, and minimax-in-the-field inside L10 (a positive check: professionals really do randomise).
- **Learning paths.** A default linear path, plus themed paths that follow branches. Examples: "market design" (L1 to L10, L24 to L26, L35 to L40, L44 to L46); "behavioral" (L6, L8, L10, L12, L15, L20, then L55 to L62, ending at L44 to L46 for the design payoff); "applied strategy" (Basic spine, then the Unit 18 cases).
- **Retrieval checkpoints.** After every 3 to 5 lessons, a short low-stakes cumulative check drawing from prior lessons, interleaved. Practice, never a graded exam.
- **Spaced review at tier boundaries.** A review lesson at the end of each tier re-surfaces earlier concepts on an expanding schedule.
- **Mastery gating, advanced tiers only.** Basic is open. To unlock Expert, reach about 80 to 90% on the Intermediate tier's apply and analyse items, with unlimited retries and targeted review of any missed prerequisites.
- **Adaptive scaffolding.** Track per-concept success. After N correct, stop showing the worked example and go problem-first. Expert lessons default to problem-first with solutions on demand.

---

## 5. Curriculum (63 core lessons, 17 units, plus a 12-case applied track)

This section is the map: tiers, units, lessons, and numbering. The per-lesson detail (the specific
example game with real payoff numbers, the playable interactive, a worked example, the misconceptions
to target as quiz distractors, and a source) lives in [docs/LESSONS.md](docs/LESSONS.md), which is
the authoring brief. Adjustments in this revision, from the content benchmark: focal points moved up
to L11 (equilibrium selection belongs beside the coordination games); the overloaded screening
lesson split into L29 (adverse selection and screening) and L30 (cheap talk), which sets up the
communication arc L30 (no commitment) to L31 (commitment). New lessons are flagged [new].

### TIER 1, BASIC (L1 to L15)
- **Unit 1, Foundations.** L1 What is a game (normal form). L2 Rationality and common knowledge (the beauty contest). L3 Preferences and expected utility (vNM, Allais).
- **Unit 2, Static solution concepts.** L4 Dominance and IESDS. L5 Rationalizability and best response. L6 Pure-strategy Nash. L7 Classic 2x2 games (the zoo: PD, stag hunt, BoS, chicken, matching pennies). L8 Mixed strategies and mixed Nash. L9 Existence of Nash (RPS witness). L10 Zero-sum and minimax.
- **Unit 3, Applications and equilibrium selection.** L11 Schelling and focal points (moved up). L12 Cournot and Bertrand. L13 Public goods and the commons.
- **Unit 4, Sequential games.** L14 Extensive form and backward induction (the entry game). L15 Subgame perfection and commitment (Stackelberg).

### TIER 2, INTERMEDIATE (L16 to L32)
- **Unit 5, Correlation and complementarities.** L16 Correlated equilibrium (traffic-light chicken). L17 [new] Supermodular games (minimum-effort coordination).
- **Unit 6, Bargaining.** L18 Nash (axiomatic) bargaining. L19 Strategic bargaining (Rubinstein).
- **Unit 7, Repeated games.** L20 Repeated games and discounting (grim trigger, δ >= 1/2). L21 Folk theorems. L22 [new] Repeated games with imperfect monitoring (Green-Porter). L23 Reputation (chain store).
- **Unit 8, Incomplete information (static).** L24 Bayesian games and Bayes-Nash. L25 Auctions I (first/second price, revenue equivalence). L26 Auctions II (common values, winner's curse).
- **Unit 9, Dynamic information and communication.** L27 Perfect Bayesian equilibrium (the gift game). L28 Signaling (Spence, beer-quiche). L29 [split] Adverse selection and screening (lemons). L30 [split] Cheap talk (Crawford-Sobel).
- **Unit 10, Information design and contracts.** L31 Information design and Bayesian persuasion (prosecutor-judge). L32 Contract theory and moral hazard (principal-agent).

### TIER 3, EXPERT (L33 to L63)
- **Unit 11, Refinements and epistemics.** L33 Sequential equilibrium and refinements. L34 [new] Epistemic foundations (common knowledge, agreement, muddy children). L35 Global games (currency attack).
- **Unit 12, Mechanism design and social choice.** L36 Social choice and Arrow, Gibbard-Satterthwaite. L37 Mechanism design and the revelation principle. L38 VCG mechanisms. L39 Optimal (Myerson) auctions. L40 [new] Implementation theory (features Myerson-Satterthwaite). L41 [new] Auctions III (multi-unit, combinatorial, position/GSP).
- **Unit 13, Cooperative game theory** (one running game, seller + two buyers). L42 Coalitional games and the core. L43 Shapley value (falls outside the core here). L44 Nucleolus (Talmud rule).
- **Unit 14, Matching and market design.** L45 Stable matching (Gale-Shapley). L46 Top trading cycles. L47 [new] Matching with contracts and design without money.
- **Unit 15, Evolution and learning.** L48 Evolutionarily stable strategies (Hawk-Dove, p*=V/C). L49 Replicator dynamics (RPS cycling, Hawk-Dove bridge). L50 [new] Stochastic stability and conventions. L51 Learning in games (fictitious play, no-regret).
- **Unit 16, Algorithmic game theory.** L52 Complexity of equilibria (PPAD, a shorter puzzle lesson). L53 Congestion and potential games. L54 Price of anarchy and Braess. L55 [new] Network and graphical games.
- **Unit 17, Behavioral and experimental** (one economic-game-lab engine). L56 Limited reasoning (level-k, cognitive hierarchy). L57 Quantal response equilibrium. L58 Social preferences: fairness (ultimatum, dictator, trust, Fehr-Schmidt). L59 Reciprocity and intentions (Rabin, Charness-Rabin). L60 Cooperation and punishment (public goods). L61 Learning and adaptation (EWA). L62 Field tests and boundaries (penalty kicks, centipede). L63 Culture, context, and design (WEIRD, market design). (Optional L64, Neuroeconomics of strategic choice.)

### 5a. Applied track (Unit 18): Game Theory in the Wild
Twelve case lessons grounded in real episodes. Placement per §4: inline cases surface right after
their home theory lesson; capstone cases combine several tools and run as a closing sequence, ending
with a capstone project. Detail and numbers in docs/LESSONS.md. Anchor texts: Dixit and Nalebuff;
Roth; Schelling; Milgrom; Ostrom; Tambe.

| # | Case | Applies | Placement |
|---|------|---------|-----------|
| A1 | Matching markets (medical match, school choice, kidney exchange) | L45 to L47 | inline after L46 |
| A2 | Auctions in the wild (spectrum, ad auctions) | L25, L26, L41 | inline after L26 |
| A3 | Deterrence and brinkmanship (Cuban Missile Crisis) | L14, L15, L20 | capstone |
| A4 | Entry deterrence in business | L15, L12 | inline after L15 |
| A5 | Co-opetition and platforms | L7, L11 | inline after L11 |
| A6 | The roots of cooperation (Axelrod, cartels) | L20, L21 | inline after L21 |
| A7 | Bargaining and negotiation (strikes, BATNA) | L18, L19 | inline after L19 |
| A8 | Mixed strategies in sport (penalty kicks, how to win) | L8, L10 | inline after L8 |
| A9 | The commons (Ostrom, climate) | L13, L20 | inline after L13 |
| A10 | Political economy (median voter, lobbying) | L11, L36 | capstone |
| A11 | Contracts and the law (moral hazard, settlement) | L32, L29 | inline after L32 |
| A12 | Security games and multi-agent AI | L8, L15, L24, L57 | capstone |

### 5b. Branches and learning paths
The static core is L1 to L10. Branches attach to it and can run in parallel with the
incomplete-information track: cooperative theory (L42+, needs L6), evolution and learning (L48+,
needs L8), algorithmic (L52+, needs L9 and L16), behavioral (L56+, needs L6, L8, L15). Themed paths:
"market design" (L1 to L10, L24 to L26, L37 to L41, L45 to L47, A1 to A2); "behavioral" (L6, L8, L10,
L12, L15, L20, then L56 to L63, ending L45 to L47 for the design payoff); "applied strategy" (Basic
spine, then the Unit 18 cases).

### 5c. If we ever need a leaner build
Enrichment that can be deferred without breaking the spine: L17, L22, L34, L40, L41, L47, L50, L55,
the optional L64, and the capstone-tagged applied cases (A3, A10, A12). Behavioral can ship as a
first four (L56 to L59) with the rest following.

### 5d. Content conventions and reusable engines
docs/LESSONS.md fixes two things once and reuses them, which halves build cost and helps recognition.
**Standard numbers** recur across the spiral: PD at T5/R3/P1/S0; the entry game (Out (0,2),
Accommodate (2,1), Fight (-1,0)); Cournot P=120-Q, c=0; Chicken (6,6)/(2,7)/(7,2)/(0,0); the seller
plus two buyers game across L42 to L44. **Reusable interactive engines:** a tappable payoff matrix; a
best-response / reaction-curve slider; a foldable game tree; a discounted repeated-play engine (δ
slider, swappable bot strategies); a coordination "match the crowd" widget; an auction sandbox (one
bidding UI, swappable rules) across L25, L26, L39, L41, A2; a belief / allocation manipulator across
L27, L31, L42 to L44; an economic game lab (ultimatum/dictator/trust/public-goods with swappable
norms and punishment) across L58 to L63 and A9; a population sim with rare mutations across L48 to
L50; a route-choice engine across L53 to L55. De-duplication: penalty kicks appear in L62 ("does
minimax hold in the field?") and A8 ("how to exploit"), which must ship as different interactives;
the Hawk-Dove-to-replicator bridge links L48 and L49; the stag-hunt mutation sim is reused in A6 and
A9. Caveat: A3 presents the Cuban Missile Crisis as Chicken but flags that this model is contested.

### 5e. Reality-check callouts (seed behavioral early)
A `Callout kind="reality-check"` variant appears in Basic and Intermediate and forward-links to Unit
17: the beauty contest (after L8), ultimatum rejection (after L15), the centipede (with L14 and L15),
free-riding vs conditional cooperation (in L13), winner's-curse behavior (in L26), minimax in the
field (in L10). Each is one claim, a small exhibit, and a link.

### 5f. References and citations
Every lesson ends with a Sources list generated from `refs` keys in a single shared bibliography
(`src/content/references.ts`), so nothing is entered twice, and a References page renders the full
deduplicated list. docs/LESSONS.md names a canonical source per lesson and applied case; the
bibliography holds a primary-source-plus-textbook citation for each. Style: author, year, title
(italic for books), publisher or journal. No em dashes.

---
## 6. Navigation and information architecture

- **Bottom tab bar (mobile), 4 items or fewer:** Learn (the lesson map), Map (the concept graph), Progress, About (with References). Bottom nav beats a hamburger for thumb reach.
- **Learn = a vertical scrolling lesson map** grouped into tiers and units, with the applied cases shown inline at their placement points. Node states: completed (accent + check), in-progress (partial ring), recommended next ("Start here"), available, and for Expert only, locked with an unlock hint.
- **Map = the concept graph** (prerequisite DAG) with locked, available, in-progress, and mastered nodes, so learners see structure and pick order within an unlocked tier.
- **Within a lesson:** slim sticky progress, a back-to-map affordance, a "skip to the problems" control, and "next up" on completion.
- **Deep-linkable:** every lesson is its own URL (`/lessons/<slug>`); refresh and share work.

---

## 7. Progress, completion, gamification

Level: progress rings, completion checks, light XP, and a gentle "days learned" count. No streaks,
no leaderboards.

- **Completion rule:** all sections viewed and all quiz questions answered correctly (unlimited retries). On completion: confetti, toast, node flips to the accent colour, XP awarded, "recommended next" advanced, persisted immediately.
- **Mastery, Expert unlock:** computed from Intermediate apply/analyse items (about 80 to 90%). Retakes allowed; missed prerequisites surfaced for review.
- **Adaptive scaffolding** reads per-concept success counts (§3.1.7).
- **Persistence:** `localStorage`, namespaced and versioned, defensive `try/catch`, schema-default fallback, export and reset in Settings, data never leaves the device. One module owns all access.

```jsonc
// key: "gt.progress.v1"
{
  "version": 1,
  "lessons": { "prisoners-dilemma": { "status": "complete", "sectionsViewed": ["hook","play","math"],
               "quizzes": { "q1": {"answered":true,"correct":true} }, "completedAt": "2026-09-05" } },
  "mastery": { "intermediate": 0.0 },
  "conceptSuccess": { "dominance": 3 },
  "xp": 120,
  "daysLearned": ["2026-09-03","2026-09-05"],
  "settings": { "theme": "system", "reducedMotion": "system", "scaffold": "auto" }
}
```

---

## 8. Mini-game / interactive catalog (build notes)

See §5d for the concept mapping. All are simple tap or slider interactions against a bot, no
multiplayer. Constants: act before being told the answer; live visual feedback; one tunable variable
at a time; 44px targets; instant reset; respects `prefers-reduced-motion`; keyboard-operable. Game
math lives in `src/engines/` (framework-free, unit-testable), separate from the Svelte island.

---

## 9. Visual design system, minimal and consulting-grade

Direction: minimal, editorial, management-consulting restraint, matched to esiivola.github.io. Warm
neutral ground, near-black cool ink, a single accent, elegant Didone display over a clean sans body,
near-flat surfaces, hairline rules, generous whitespace. Colour is used sparingly and, in domain
figures, semantically. Simplicity is an explicit requirement.

### 9.1 Colour tokens
Light: `--bg #F4F1E8`, `--surface #FFFDF7`, `--surface-2 #E8E4DA`, `--ink #0B1721`, `--ink-muted
#59636A`, `--border #DED8CC` (`--border-strong #CFC7B6`), `--accent #0A6F6A` (`--accent-hover
#085A56`, `--accent-soft #DDECEA`), `--cooperate #0A6F6A`, `--defect #B24A2E` (`--defect-soft
#F1E2DA`), `--gold #9C7A1E`, `--focus #0A6F6A`.
Dark: `--bg #0B1721`, `--surface #12212B`, `--surface-2 #1A2B36`, `--ink #F4F1E8`, `--ink-muted
#9AA6AD`, `--border #233139`, `--accent #5FB3AB`, `--cooperate #5FB3AB`, `--defect #DB7A56`, `--gold
#D7B15A`.
Buttons: primary uses `--ink` background with `--bg` text. All colours are semantic CSS variables;
components never hard-code hex. AA contrast in both themes.

### 9.2 Typography
GFS Didot for display and headings (weight 400, large, tight negative tracking; fallback Iowan Old
Style, Baskerville, serif). Inter for body and UI (never below 16px on mobile). JetBrains Mono for
payoff figures, scores, tabular data. KaTeX for math. Self-host via Fontsource, `font-display: swap`,
system fallback stacks.

### 9.3 Scale, spacing, shape
Spacing 4px base. Type scale about 1.2 (13, 16, 18, 20, 24, 30, 36, 44). Body line-height 1.6,
headings 1.12, measure 60 to 70ch. Radius 8 (inputs), 10 (cards), 999 (pills). Near-flat elevation;
reserve soft shadow for the device frame and overlays.

### 9.4 Figures as exhibits, kept light
Domain figures carry a small uppercase caption ("Exhibit 1, payoff matrix"). Caption plus figure,
no heavy borders.

### 9.5 Core components
App shell (slim top bar with wordmark and progress; bottom tab nav). Lesson map and concept map.
Lesson card. Lesson reader (scroll sections, inline figures with reset, warm-up recall,
self-explanation reveal, "Key idea" callout, "Definition" aside, reality-check callout,
worked-example stepper, exhibit caption, sources). PayoffMatrix. QuizCard (choice buttons, immediate
feedback, explanatory reveal, retry, Bloom-laddered). ProgressRing and check. XP chip. Buttons
(primary dark pill, ghost, choice). "Skip to problems" control. Toast plus confetti. References list.

---

## 10. Accessibility and performance

WCAG AA in both themes. Honour `prefers-reduced-motion` and a manual toggle; simulations pause or
step. Dark mode via `prefers-color-scheme` plus toggle, all colours tokenised. Full keyboard support,
visible focus, skip link, Esc closes modals. Correct headings; `role="progressbar"` with
`aria-valuenow/max`; `aria-live` for quiz feedback and XP; meaningful SVG has `<title>/<desc>`; KaTeX
emits MathML. Self-host fonts, preload body face, so CLS is near 0. Hydrate islands lazily; scope
KaTeX CSS to lesson pages; per-page JS budget well under 100KB. Mobile Lighthouse: Performance 95+,
Accessibility 100, Best Practices 95+, SEO 95+; LCP under 2.5s, CLS under 0.1, INP under 200ms.

---

## 11. Writing and voice

The prose must read like a knowledgeable person explaining an idea to a smart colleague. Plain,
direct, concrete, quietly confident, occasionally dry. Zero hype. This matches the developer's own
site.

### 11.1 Do
1. Open on a concrete situation or a plain claim, never on "In today's world" or a definition.
2. Use "you" and address the reader.
3. Vary sentence length. Follow a long explanatory sentence with a short, blunt one.
4. Use real numbers and named examples (payoffs, dollars, years, specific players).
5. State the point directly, then explain it. Put the surprising claim first.
6. Take a stance. It is fine to say a common intuition is wrong.
7. Use plain connectives (And, But, So) or none. Save "however" for real contrast.
8. Let a paragraph be one line when the point is one line.
9. Read it aloud; cut anything you would not say to a colleague.
10. Define a term in-line, briefly, the first time it appears.
11. Allow one dry aside per lesson where it fits. Do not force it.
12. In quiz feedback, say why an answer is right or wrong. Skip praise adjectives.

### 11.2 Don't (AI tells to avoid)
- Banned or avoid words: delve, leverage, utilize, harness, foster, cultivate, unlock, unleash, elevate, navigate (figurative), underscore, showcase, empower, streamline, boast, surpass, robust, seamless, crucial/pivotal/vital (unqualified), comprehensive (as filler), intricate, nuanced, transformative, groundbreaking, revolutionary, meticulous, profound, myriad, landscape, realm, tapestry, journey, endeavor, testament, insights (as filler), synergy. Prefer plain alternatives; often just delete.
- No formulaic intros or outros ("In today's world", "Let's dive in", "In conclusion").
- No "not only ... but also" and no "it is not just X, it is Y".
- No reflexive rule-of-three; do not stack three adjectives for effect.
- No Moreover / Furthermore / Additionally as default glue.
- No uniform paragraph blocks; no bullet list where reasoning belongs.
- No empty enthusiasm, vague praise, or hedging on every claim. No recap paragraphs. No em dashes.

Note: a banned word is fine when it carries real, specific meaning. The list targets empty use.

### 11.3 Calibration sample (Prisoner's Dilemma intro, target voice)
"Two gas stations sit across the street from each other. Each morning each owner picks: hold prices,
or cut them to pull in the other's customers. If both hold, both do well. If one cuts while the other
holds, the cutter takes the street. So both cut, and both earn less than if they had left prices
alone."

---

## 12. Technical architecture

**Stack:** Astro, Tailwind CSS, MDX, Svelte 5 islands, vanilla TypeScript engines, remark-math and
rehype-katex for math. Static output, GitHub Pages.

Why: Astro ships near-zero JS on prose pages, hydrates only opted-in islands, is MPA by default so
GitHub Pages routing works (real HTML per lesson, no SPA 404 hack, no base-path footgun), and MDX
lets lessons be prose with `<PayoffMatrix/>`, `<Quiz/>`, and `$math$` inline.

**Key decisions**
- Lessons authored as MDX in a content collection with typed frontmatter (`title, slug, tier, unit, order, kind (lesson|case|review), summary, tags, estMinutes, mvp, prereqs, concepts, refs, placement`). `prereqs`/`concepts` drive the concept map and adaptive scaffolding; `kind`/`placement` position applied cases and reviews.
- Math at build time with remark-math and rehype-katex; KaTeX CSS in the lesson layout, fonts self-hosted. Inline `$...$`, display `$$...$$`; wrap wide display math in `overflow-x: auto`. (The design prototype uses MathJax SVG for single-file rendering; the built site uses KaTeX.)
- References in one data file keyed by cite key; lesson `refs` render the Sources list and the References page.
- Islands hydrate `client:visible` or `client:idle`; canvas engines are framework-free TS modules in `engines/`.
- Tailwind wired to CSS-variable tokens; tokens declared once in global CSS.
- One typed `progress` module owns all `localStorage` I/O; a store exposes reactive progress.
- `astro.config.mjs`: `site: 'https://<USERNAME>.github.io'`, `base: '/game-theory-lessons'`; internal links via `import.meta.env.BASE_URL`; `.nojekyll`; deploy via `withastro/action` then `actions/deploy-pages`; friendly `404.astro`.
- Minimal libraries: Tailwind; CSS-first motion (Motion One only if needed); inline SVG for matrices and trees; canvas plus rAF for sims; KaTeX; canvas-confetti; Lucide icons; Fontsource fonts.

### Repo structure (target)
```
game-theory/
  SPEC.md  AGENTS.md  README.md
  astro.config.mjs  tailwind.config.*  package.json  tsconfig.json
  public/  .nojekyll, fonts/, images/
  .github/workflows/deploy.yml
  design/prototype.html          standalone clickable design prototype (the published artifact)
  src/
    config/site.ts               siteConfig + withBase()
    styles/tokens.css            design-system CSS variables (light/dark)
    content/
      config.ts                  lesson schema (tier, unit, kind, prereqs, concepts, refs, placement)
      references.ts              shared bibliography by cite key (L1 to L62, A1 to A12)
      lessons/*.mdx              one file per lesson or applied case
    layouts/                     BaseLayout, LessonLayout (imports KaTeX CSS)
    pages/                       index (lesson map), map (concept graph), lessons/[slug], progress, about, 404
    components/
      ui/                        shell, BottomNav, TopBar, LessonCard, ConceptMap, ProgressRing, QuizCard,
                                 Callout (incl. reality-check), DefinitionAside, WorkedExample, WarmUp,
                                 ExhibitCaption, SourcesList…
      interactive/               Svelte islands (PayoffMatrix, RepeatedPD, AuctionGame, DeferredAcceptance, …)
    engines/                     vanilla TS sim logic (pd, tournament, replicator, routing, deferredAcceptance,
                                 auction, qre, ewa, levelk, …)
    lib/
      progress.ts                the only localStorage owner (typed, versioned, try/catch)
      store.ts                   reactive progress store
      quiz.ts                    quiz types and scoring
```

---

## 13. MVP scope and milestones

MVP is a shippable, polished slice of the Basic tier that proves the whole format: the arc L1, L4,
L6, L7 (Prisoner's Dilemma focus), plus a trimmed L20 (repeated games) flagship, and one inline
applied case (A8, penalty kicks) plus one reality-check callout (beauty contest). It includes the
full shell, lesson map, a first cut of the concept map, progress, design system, math rendering, the
revised lesson template, references, and the writing voice.

1. **M0, Foundation:** Astro + Tailwind + MDX + remark-math/rehype-katex, tokens.css, shell and nav, deploy pipeline green. Content collection, references data, schema (tier, unit, kind, prereqs, concepts, placement).
2. **M1, Lesson engine:** LessonLayout, MDX rendering, WarmUp, self-explanation reveal, DefinitionAside, WorkedExample stepper, reality-check callout, section-viewed tracking, `progress.ts` and store, QuizCard (Bloom ladder, misconception feedback, retry, interleaved item), SourcesList, completion and confetti.
3. **M2, Maps and progress:** lesson map with node states and soft locks and inline cases; a first concept-map view; Progress tab (rings, XP, days-learned, per-tier); Settings (theme, reduce-motion, scaffold, export/reset); References page.
4. **M3, MVP lessons and mini-games:** author L1, L4, L6, L7 plus trimmed L20 plus case A8, in the template and voice; build PayoffMatrix, DominanceSweep, NashFinder, RepeatedPD plus a small tournament, and PenaltyShootout.
5. **M4, Polish and a11y/perf:** dark mode, reduced-motion, keyboard, Lighthouse to targets, copy edit (zero em dashes, no AI tells), og image and metadata. Ship.
6. **Post-MVP:** fill out Basic, then Intermediate, then Expert (the Behavioral unit is a priority within Expert given its applied value), then the applied cases and capstone, then retrieval checkpoints, spaced-review lessons, and mastery gating.

**Definition of done for a lesson:** follows the §3.2 template; at least one interactive that is
keyboard-operable and reduced-motion-aware; a correct, typeset formal section; a warm-up and an
interleaved quiz item; prediction before instruction; 2 to 4 misconception-driven quizzes with
explanatory feedback; a real-world anchor; a Sources list wired to the bibliography; prose that
passes §11 (no AI tells, no em dashes); completion flips the node; passes the a11y and perf targets.

---

## 14. Open questions / future

- Final site name and domain.
- How prominent the concept-map view should be vs the linear lesson map.
- Whether the behavioral experiments (Unit 17) store anonymous local-only responses to show the learner how they compare to Nash predictions and to the published human distributions.
- Illustration style for real-world anchors (flat SVG spot illustrations preferred).
- i18n (English only for v1).

---

## 15. Benchmarks and sources (for the builders)

**Curriculum and gap check:** Yale ECON-159 (Polak) https://oyc.yale.edu/economics/econ-159 ; MIT
14.12 and 14.16 OCW ; Stanford/UBC Coursera Game Theory I and II ; Roughgarden CS364A
https://timroughgarden.org/f13/f13.html ; Osborne and Rubinstein TOC ; Fudenberg and Tirole;
Myerson; Maschler, Solan and Zamir; Mas-Colell, Whinston and Green; Nisan et al. Algorithmic Game
Theory https://www.cs.cmu.edu/~sandholm/cs15-892F13/algorithmic-game-theory.pdf .

**Behavioral:** Camerer, *Behavioral Game Theory* (2003); Kagel and Roth, *Handbook of Experimental
Economics*; Nagel (1995) https://web.stanford.edu/~niederle/GuessingGames.pdf ; Camerer, Ho and Chong
(2004); McKelvey and Palfrey (1995) ; Fehr and Schmidt (1999) ; Rabin (1993) ; Erev and Roth (1998) ;
Camerer and Ho (1999) ; Fehr and Gächter (2000, 2002) ; Palacios-Huerta (2003)
http://palacios-huerta.com/docs/professionals.pdf ; Henrich et al. (2005) ; DellaVigna (2009).

**Applied:** Dixit and Nalebuff, *Thinking Strategically* and *The Art of Strategy*; Dixit, Skeath
and Reiley, *Games of Strategy*; McAdams, *Game-Changer*; Roth, *Who Gets What and Why*; Milgrom,
*Putting Auction Theory to Work*; Klemperer (2002) https://www.nuff.ox.ac.uk/Users/Klemperer/designnew.pdf ;
Edelman, Ostrovsky and Schwarz (2007); Schelling, *The Strategy of Conflict* and *Arms and
Influence*; Ostrom, *Governing the Commons*; Tambe, *Security and Game Theory*; Axelrod, *The
Evolution of Cooperation*.

**Gap additions (seminal):** Kamenica and Gentzkow (2011)
https://web.stanford.edu/~gentzkow/research/BayesianPersuasion.pdf ; Holmström (1979); Grossman and
Hart (1983); Aumann (1976) and Aumann and Brandenburger (1995); Maskin (1999); Milgrom and Roberts
(1990); Green and Porter (1984) and Abreu, Pearce and Stacchetti (1990); Kandori, Mailath and Rob
(1993); Hatfield and Milgrom (2005); Kearns, Littman and Singh (2001).

**Pedagogy and voice:** productive failure (Kapur 2014); interleaving (Rohrer 2019); concreteness
fading (Fyfe et al. 2014); self-explanation (Bisra et al. 2018); expertise reversal; Mayer's
multimedia principles; Nicky Case explorable-explanation patterns. Signs of AI writing
https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing . Target tone and visual: esiivola.github.io.

**Interactive and visual:** The Evolution of Trust https://ncase.me/trust/ ; Parable of the Polygons
https://ncase.me/polygons/ ; Setosa https://setosa.io/ .
