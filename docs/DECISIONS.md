# Course regression log

## 2026-09-13: Applied cases follow their placement metadata

- Symptom: every applied case appeared after the Expert tier, even when its frontmatter said `after:<slug>`.
- Root cause: the map and lesson navigation independently sorted by tier and order and ignored `placement`.
- Fix: both views use `orderLessons`, which inserts an inline case immediately after its anchor and leaves capstones at the end.
- Guard: `src/lib/lessonOrder.test.ts` covers inline, capstone, and missing-anchor behavior.

## 2026-09-13: Predictions remain available for comparison

- Symptom: choosing a prediction replaced the prompt with the game and discarded the chosen answer and explanation.
- Root cause: interactive components stored only a boolean gate.
- Fix: prediction-based games retain the selected label and expose the explanation in a closed “Compare after playing” disclosure.
- Guard: `src/components/interactive/predictionContract.test.ts` checks every prediction-based Svelte component for the retained label and reveal text.

## 2026-09-13: Incentive compatibility uses the stated tie rule

- Symptom: the moral-hazard game treated the exact indifference cutoff as sufficient for high effort while the lesson described high effort as strictly preferred.
- Root cause: the engine used `>=` at the cutoff.
- Fix: the engine requires a strict inequality, the demonstration uses the next feasible bonus, and the copy identifies the cutoff as indifference.
- Guard: `src/engines/moralHazard.test.ts` checks behavior below, at, and above the cutoff.

## 2026-09-13: Applied simulations expose their assumptions

- Symptom: several examples presented an illustrative bot response or symmetric parameter choice as an equilibrium or empirical conclusion.
- Root cause: simulation behavior and model-derived behavior were not distinguished in the interface.
- Fix: the reputation, punishment, platform, level-k, culture, learning, and commons interactives label illustrative presets and behavior rules. The commons now has a renewable-stock engine instead of a static shared pot.
- Guard: engine tests cover stock dynamics, punishment costs, monitoring incentives, bargaining shares, QRE fixed points, and randomized EWA choice.
