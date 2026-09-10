# Lesson contents and example games

The per-lesson content backbone: for each lesson, the specific example game with real payoff
numbers, the playable interactive, one worked example, the misconceptions to target as quiz
distractors, and a canonical source. This is the working brief for authoring each lesson. It pairs
with the high-level curriculum in [../SPEC.md](../SPEC.md) §5. House rules from SPEC apply: the
§3.2 template, the §11 voice, and no em dashes.

Numbering matches the adjusted curriculum: 63 core lessons (L1 to L63) across 17 units, plus a
12-case applied track (A1 to A12). Changes from the first draft: focal points moved up to L11;
the old screening lesson split into L29 (adverse selection and screening) and L30 (cheap talk),
which sets up the communication arc L30 to L31.

## Conventions reused across the course

**Standard numbers** (recognition compounds when the same game recurs):
- Prisoner's Dilemma: T=5, R=3, P=1, S=0 (used in L1, L4, L6, L7, L20 to L23, A6).
- Entry game (entrant first): Out (0,2), In then Accommodate (2,1), In then Fight (-1,0) (L14, L15, L40, A4).
- Cournot: inverse demand P = 120 - Q, marginal cost c = 0 (L12, L15).
- Chicken / Hawk-Dove: (Swerve,Swerve)=(6,6), (Swerve,Straight)=(2,7), (Straight,Swerve)=(7,2), (Straight,Straight)=(0,0) (L7, L16, A3).
- Seller plus two buyers: v(12)=v(13)=100, v(23)=0, v(123)=100 (L42 to L44).

**Reusable interactive engines** (build these once, reuse everywhere):
1. Tappable payoff matrix (L1, L4, L6, L7, L16).
2. Best-response / reaction-curve slider (L5, L8, L10, L12, L17).
3. Foldable game tree (L14, L15, L23, A4).
4. Discounted repeated-play engine with a δ slider and swappable bot strategies (L20 to L23, A6).
5. Coordination "match the crowd" widget (L2, L11).
6. Auction sandbox, one bidding UI with swappable rules FPA/SPA/common-value/reserve/GSP (L25, L26, L39, L41, A2).
7. Belief / allocation manipulator (PBE checker L27, persuasion posterior-split L31, cooperative allocation checker L42 to L44).
8. Economic game lab, one parameterised engine for ultimatum/dictator/trust/public-goods with swappable norms, punishment, and regeneration (L58 to L63, A9).
9. Population sim with rare mutations (L48 to L50, A6, A9).
10. Route-choice / congestion engine (L53, L54, L55).

---

# TIER 1, BASIC

## Unit 1, Foundations

### L1 What is a game (normal form)
- **Example game:** Prisoner's Dilemma, (row, col): Silent/Silent (3,3), Silent/Confess (0,5), Confess/Silent (5,0), Confess/Confess (1,1). Real-world framing: two gas stations choosing High or Low price.
- **Interactive:** tappable 2x2 grid; learner picks a row, a bot picks a column, the cell lights and the payoff pops out. A toggle relabels "prison years" as "utility" to show payoffs are rankings. Predict-then-reveal: circle the cell you expect to land in, then play a round.
- **Worked example:** read every payoff for one action ("Silent while they Confess gives 0, the worst cell"). Faded: fill a missing cell. Solo: write the matrix for the gas-station story.
- **Misconceptions:** the first number is always mine regardless of which player I am; payoffs are dollars not utility; players move in sequence rather than simultaneously.
- **Source:** Osborne, An Introduction to Game Theory (2004), ch. 2.

### L2 Rationality and common knowledge
- **Example game:** the p-beauty contest, guess 2/3 of the average of integers 0 to 100; unique equilibrium under common knowledge of rationality is 0. Real-world framing: the blue-eyed islanders puzzle (a known fact becomes actionable only when announced publicly).
- **Interactive:** learner types a number; plays against bots at explicit reasoning depths (level-0 ~50, level-1 33, level-2 22, ...). Reveal the winning number and the learner's place on the ladder. Predict-then-reveal: what number will win?
- **Worked example:** iterate best responses: random average 50, best reply 33, then 22, to the limit 0. Distinguish "rational" from "everyone knows everyone is rational, to all orders."
- **Misconceptions:** the equilibrium 0 is the smart guess against real people (it loses); common knowledge means everyone knows (it needs the infinite hierarchy); rationality alone pins down behavior.
- **Source:** Nagel (1995); common knowledge from Lewis (1969).

### L3 Preferences and expected utility (vNM)
- **Example game:** lotteries to build a utility curve, then the Allais paradox. Problem 1: A = $1M sure vs B = (89% $1M, 10% $5M, 1% $0). Problem 2: C = (11% $1M, 89% $0) vs D = (10% $5M, 90% $0). Most pick A and D, violating independence. Real-world framing: buying insurance under concave utility.
- **Interactive:** a risk slider bending u(x)=x^r; the certainty equivalent of a 50/50 on $0 or $100 slides from $50 (risk-neutral) toward $0 (risk-averse). Then the two Allais choices as taps. Predict-then-reveal: the app shows your A/D pair is inconsistent with any single utility function.
- **Worked example:** with u(x)=sqrt(x), value the 50/50 on $0 or $100: EU = 5, certainty equivalent $25. Faded: u(x)=x gives $50. Solo: which insurance policy a sqrt-utility agent prefers.
- **Misconceptions:** rational means maximise expected money; utility is comparable across people; doubling all payoffs changes decisions (affine transforms do not).
- **Source:** von Neumann and Morgenstern (1944); Allais (1953).

## Unit 2, Static solution concepts

### L4 Dominance and iterated elimination
- **Example game:** Gibbons 2x3. Up: (1,0),(1,2),(0,1); Down: (0,3),(0,1),(2,0). Right is strictly dominated by Middle for the column player; delete it, then Up dominates Down; outcome (Up, Middle)=(1,2). Real-world framing: a too-high menu price that is never worth it whatever the rival does.
- **Interactive:** learner taps a row or column they think is dominated; if right it greys out and the matrix shrinks; a tooltip shows the dominating strategy. Predict-then-reveal: how many strategies survive?
- **Worked example:** walk the two deletions in order, each time stating "Middle beats Right in every row (2>1 and 1>0)." Faded: do the second deletion. Solo: a fresh 3x3.
- **Misconceptions:** the deletion order changes the answer (it does not for strict); a strategy is dominated if beaten in one column (needs every column); confusing dominant with dominated.
- **Source:** Gibbons (1992), sec. 1.1.B.

### L5 Rationalizability and best response
- **Example game:** a 3x3 where marking each player's best response to every opponent action does the work, plus a never-best-response strategy that survives IESDS but dies under rationalizability. Real-world framing: the beauty-contest ladder from L2 is iterated best response.
- **Interactive:** for each opponent action, tap your best reply; cells that are a best response for both players get flagged (foreshadows Nash). Predict-then-reveal: which of your strategies is never a best reply?
- **Worked example:** in a 2x2, compute best responses action by action ("if column plays L, best row is T since 4>2"), then take the surviving set.
- **Misconceptions:** rationalizable equals Nash (it is a larger set); best response is unique (ties give a set); a best response must be high-payoff (only relative to the fixed opponent action).
- **Source:** Bernheim (1984); Pearce (1984).

### L6 Pure-strategy Nash equilibrium
- **Example game:** Battle of the Sexes: Opera/Opera (2,1), Opera/Football (0,0), Football/Opera (0,0), Football/Football (1,2); two pure Nash. Contrast the PD's unique (Confess,Confess)=(1,1). Real-world framing: two firms adopting the same technology standard.
- **Interactive:** the underline method, tactile. Tap the column player's best payoff in each row and the row player's best in each column; cells with both marks turn gold, the Nash equilibria. Predict-then-reveal: how many gold cells?
- **Worked example:** in BoS mark row-best per column and col-best per row; the two doubly-marked cells are the equilibria. Faded: mark one player's side. Solo: find pure Nash of a 3x3.
- **Misconceptions:** Nash is the best outcome for the group (the PD's Nash is jointly worst); every game has exactly one Nash; Nash is where both get their maximum (it is mutual best response).
- **Source:** Nash (1950).

### L7 Classic 2x2 games (the zoo)
- **Example games:** PD (R3/S0/T5/P1, one Nash); Stag Hunt Stag/Stag (4,4), Stag/Hare (0,3), Hare/Stag (3,0), Hare/Hare (3,3) (two Nash, payoff- vs risk-dominant); Battle of the Sexes (2,1)/(0,0)/(0,0)/(1,2); Chicken/Hawk-Dove (6,6)/(2,7)/(7,2)/(0,0); Matching Pennies (1,-1)/(-1,1)/(-1,1)/(1,-1) (no pure Nash). Framings: arms race, team project, couple coordinating, labor strike, penalty kicks.
- **Interactive:** a "game zoo": one 2x2 whose four payoffs the learner nudges with steppers; a live badge shows the game family and Nash structure changing as incentives cross thresholds. Predict-then-reveal: how many pure Nash for each preset?
- **Worked example:** classify Stag Hunt by finding both pure Nash and ranking them (both prefer Stag-Stag but Hare-Hare is safer); contrast Matching Pennies where best-response marks never coincide (motivates L8).
- **Misconceptions:** all 2x2 dilemmas are prisoner's dilemmas; two equilibria means players are indifferent between them (BoS players disagree which); no pure Nash means unsolvable (there is a mixed one).
- **Source:** Rapoport and Guyer (1966).

### L8 Mixed strategies and mixed Nash
- **Example game:** Matching Pennies (mixed Nash p=q=1/2), then BoS mixed Nash. Real-world framing: soccer penalty kicks and tax audits.
- **Interactive:** a slider for your probability of Heads; two lines plot the opponent's expected payoff to Heads vs Tails; drag to the crossing where the opponent is indifferent. A bot exploits any non-1/2 mix over repeated rounds. Predict-then-reveal: what mix makes you unexploitable?
- **Worked example:** Matching Pennies: opponent Heads w.p. q, your payoff to Heads = 2q-1, to Tails = 1-2q, indifference gives q=1/2. Faded: BoS, set row Opera prob p so column is indifferent, p·1=(1-p)·2, p=2/3. Solo: Chicken mixed Nash (Straight w.p. 2/3).
- **Misconceptions:** you mix to hedge yourself (you mix to make the opponent indifferent); at the mixed Nash you maximise your payoff (you are indifferent); 50/50 is always the answer (BoS is 2/3-1/3).
- **Source:** Osborne (2004), ch. 4; penalty-kick evidence Palacios-Huerta (2003).

### L9 Existence of Nash
- **Example game:** Rock-Paper-Scissors (unique mixed Nash 1/3 each) as the witness that a game with no pure Nash still has a mixed one. Real-world framing: RPS and cyclic-dominance (side-blotched lizards).
- **Interactive:** an adaptive RPS bot that shifts toward whatever you overplay; a live bar chart of your move frequencies shows only 1/3-1/3-1/3 stops the bot from gaining. Predict-then-reveal: is there a mix the bot cannot beat?
- **Worked example:** by symmetry each move has probability 1/3; verify each action then gives expected payoff 0, so all are best responses. State Nash's theorem (Brouwer fixed point intuition).
- **Misconceptions:** some games have no equilibrium (finite games always have one, possibly mixed); existence means uniqueness; existence tells you which one gets played.
- **Source:** Nash (1950).

### L10 Zero-sum and minimax
- **Example game:** a 2x2 zero-sum matrix (payoffs to row): T/L 2, T/R -1, B/L -1, B/R 1; value 1/5, optimal mixes p=q=2/5. Plus RPS. Real-world framing: penalty kicks and attack/defend allocation. Include the "minimax in the field" reality-check callout (professionals really do randomise, forward-link to L62).
- **Interactive:** two security-level bars; drag your mixing probability and watch the payoff you can guarantee regardless of the opponent; it peaks at the minimax mix. Predict-then-reveal: what can you guarantee yourself?
- **Worked example:** row mixes p on T; guaranteed vs Left 3p-1, vs Right 1-2p; set equal, p=2/5, value 1/5. State von Neumann's minimax theorem.
- **Misconceptions:** zero-sum means both get zero (payoffs sum to a constant); minimax is pessimistic (in zero-sum it is the equilibrium); the value depends on who moves first.
- **Source:** von Neumann (1928); Osborne (2004), ch. 11.

## Unit 3, Applications and equilibrium selection

### L11 Schelling and focal points (moved up from L13)
- **Example game:** pure coordination with labels: both name a place to meet in NYC, match (1,1), mismatch (0,0); most say Grand Central, noon. Companions: heads/tails, "name a positive number" (most say 1), split $100 (most say 50/50). Real-world framing: which side of the road, default meeting times, queueing.
- **Interactive:** learner and a bot (calibrated to Mehta et al. human frequencies) must independently match on a labeled choice; payoff only if they match. Predict-then-reveal: which option will most people pick, before the histogram.
- **Worked example:** in a 2x2 pure coordination game both equilibria are payoff-identical, so theory cannot choose; salience (a label, tradition, roundness) selects one without changing any payoff.
- **Misconceptions:** the focal point is the highest-payoff cell (payoffs are equal); focal points are irrational (they are a rational response to needing to match); focal points are universal (they are cultural).
- **Source:** Schelling (1960); Mehta, Starmer and Sugden (1994).

### L12 Cournot and Bertrand (was L11)
- **Example game:** Cournot P=120-Q, c=0; reaction qi=(120-qj)/2; Nash q1=q2=40, P=40, profit 1600 each (monopoly Q=60, P=60, 3600 total). Bertrand with equal MC: unique Nash p=c=0, zero profit (the paradox). Real-world framing: OPEC quotas (Cournot) vs airfare price wars (Bertrand). Separate the Bertrand paradox (homogeneous goods) from differentiated Bertrand (positive margins).
- **Interactive:** a quantity slider; the bot best-responds each round and the two reaction lines are drawn with the play point walking to their intersection. A toggle switches to Bertrand (price slider) and undercutting collapses profit to zero. Predict-then-reveal: where do the lines cross, and what price survives Bertrand?
- **Worked example:** firm 1 maximises (120-q1-q2)q1, FOC 120-2q1-q2=0, impose symmetry q=40. Faded: recompute with c=30. Solo: Stackelberg preview.
- **Misconceptions:** more firms does not change price (Cournot falls toward MC as n grows); two firms behave like a monopoly (output 80 > 60); price and quantity competition give similar outcomes.
- **Source:** Cournot (1838); Bertrand (1883); Gibbons (1992), sec. 1.2.

### L13 Public goods and the commons (was L12)
- **Example game:** linear public-goods game, n=4, each endowed $10, contributions summed and multiplied by 1.6, split equally (MPCR=0.4); Nash contribute 0, optimum contribute all. Real-world framing: climate, overfishing, vaccination, office kitchen. Include the "free-riding vs conditional cooperation" reality-check callout (forward-link to L60).
- **Interactive:** a contribution slider 0-10 against three bots (free-riders and conditional cooperators); own payoff and group total update live; a multi-round view shows cooperation decaying. Predict-then-reveal: your selfish best contribution (0) vs the group optimum (10).
- **Worked example:** contributing $1 returns 1.6/4 = $0.40, a private loss of $0.60, so selfish is 0; everyone contributing $1 nets each +$0.60, so the optimum is full contribution. The gap is the dilemma.
- **Misconceptions:** rational players cooperate for the common good (Nash is zero); the commons fails from malice (pure self-interest suffices); bigger groups cooperate more (larger n lowers MPCR).
- **Source:** Hardin (1968); Ledyard (1995).

## Unit 4, Sequential games

### L14 Extensive form and backward induction
- **Example game:** the entry game (tree): entrant In/Out; if In, incumbent Fight/Accommodate; Out (0,2), In+Accommodate (2,1), In+Fight (-1,0). Backward induction: accommodate (1>0), so enter (2>0), outcome (In, Accommodate). Companion: the centipede game. Real-world framing: a startup entering an incumbent's market.
- **Interactive:** click branches down the tree to a leaf and see the payoff; a "solve backward" button folds the tree, greying pruned branches. Predict-then-reveal: what will the incumbent do if you enter?
- **Worked example:** solve the incumbent's node first (Accommodate 1 > Fight 0), replace with its value, then the entrant compares In 2 vs Out 0 and enters. Faded: same tree, new leaf payoffs. Solo: a 3-move centipede.
- **Misconceptions:** the incumbent will fight to punish entry (not credible, off-path); first mover always wins (depends on payoffs); a normal-form Nash equals the backward-induction outcome (some rely on non-credible threats).
- **Source:** Selten (1965); Rosenthal (1981) for centipede.

### L15 Subgame perfection and commitment
- **Example game:** the entry game in normal form has two Nash, (In, Accommodate) and (Out, Fight), but only (In, Accommodate) is subgame perfect; (Out, Fight) rests on a non-credible threat. Commitment via Stackelberg (P=120-Q, c=0): leader commits q1=60, follower q2=30, P=30, leader profit 1800 > Cournot 1600. Real-world framing: capacity precommitment, burning the boats. Include the ultimatum reality-check callout (SPE says offer a penny, humans reject; forward-link to L58).
- **Interactive:** a "commit or stay flexible" toggle; committing first lets the bot best-respond and the learner sees profit rise above the simultaneous case. Predict-then-reveal: does removing your own option help or hurt?
- **Worked example:** Stackelberg by backward induction: substitute q2=(120-q1)/2 into leader profit, maximise, q1=60, q2=30, leader profit 1800. Contrast pruning the non-credible (Out, Fight).
- **Misconceptions:** more options is always better (commitment can raise payoff); any Nash of the tree is fine (only subgame-perfect ones); a first mover's threat is automatically believed.
- **Source:** Selten (1975); Schelling (1960); Stackelberg (1934).

---

# TIER 2, INTERMEDIATE

## Unit 5, Correlation and complementarities

### L16 Correlated equilibrium
- **Example game:** Chicken (6,6)/(2,7)/(7,2)/(0,0) with a traffic-light mediator recommending each of the three non-(Straight,Straight) cells w.p. 1/3; obeying is a best response, giving expected (5,5), beating the mixed Nash (4.67, 4.67). Real-world framing: traffic lights and any public signal.
- **Interactive:** a shared signal privately recommends Go or Stop each round; the learner chooses Obey or Deviate; a scoreboard compares to the Nash benchmark. Predict-then-reveal: can following a light beat playing Nash?
- **Worked example:** told "Swerve," the opponent Swerves w.p. 1/2, so obey gives 4 vs deviate 3.5; told "Straight," the opponent surely Swerves, so Straight 7 vs Swerve 6; average (5,5).
- **Misconceptions:** a correlated equilibrium is just a mixed Nash (it can beat every Nash); you would always ignore the recommendation; it needs enforcement (obedience is self-interested).
- **Source:** Aumann (1974).

### L17 Supermodular games
- **Example game:** the minimum-effort coordination game (Van Huyck et al.): each picks effort 1 to 7, payoff = 0.6 + 0.2·min(all) - 0.1·(own); every "all pick x" is a Nash; all-7 best (1.3), all-1 safest (0.7). Real-world framing: bank runs, adopting a standard, a weakest-link team.
- **Interactive:** an effort slider 1 to 7 against bots; payoff depends on the group minimum, so one low bot drags everyone down; over rounds coordination ratchets down. Predict-then-reveal: what effort should you pick?
- **Worked example:** best response is "match the minimum you expect"; raising effort above it only costs 0.1 with no benefit; because best response is increasing in others' actions, equilibria are Pareto-ranked.
- **Misconceptions:** players coordinate on the best equilibrium (risk-dominance pulls to all-1); complementarity means everyone wants the same thing (they want to match, but fear others will not); more players makes high coordination easier.
- **Source:** Van Huyck, Battalio and Beil (1990); Milgrom and Roberts (1990).

## Unit 6, Bargaining

### L18 Nash (axiomatic) bargaining
- **Example game:** split $1, disagreement d=(0,0); the Nash solution maximises (u1-d1)(u2-d2); symmetric gives 50/50; with outside option d1=0.2 the split shifts to (0.6, 0.4). Real-world framing: a wage negotiation where disagreement payoffs set the threat point.
- **Interactive:** drag the settlement point along a Pareto frontier; the Nash product shows live and the learner hunts its maximum; a second slider moves d and the optimal split follows. Predict-then-reveal: where is the fairest split?
- **Worked example:** maximise x(1-x), x=1/2; with d1=0.2, maximise (x-0.2)(1-x), x=0.6. State the four axioms (efficiency, symmetry, invariance, IIA).
- **Misconceptions:** bargaining always splits 50/50; a better outside option means I concede more (I get more); the Nash solution describes real haggling (it is axiomatic; L19 is the strategic model).
- **Source:** Nash (1950).

### L19 Strategic bargaining (Rubinstein)
- **Example game:** split $1 by alternating offers, pie discounted by δ each round; unique SPE gives the proposer 1/(1+δ), agreement in round 1. Real-world framing: a strike or house sale where delay shrinks the surplus.
- **Interactive:** a patience slider δ and a shrinking pie; the learner offers against a bot playing the SPE; greedy offers get rejected and the pie shrinks. Predict-then-reveal: who gets more, and does patience help?
- **Worked example:** the proposer leaves the responder their continuation value: x=1-δx, x=1/(1+δ); at δ=0.9, proposer 0.526. Two-sided: proposer share (1-δ2)/(1-δ1δ2). As δ to 1 the split approaches the Nash bargaining 50/50 (the Nash program).
- **Misconceptions:** impatience is always a weakness (relative patience matters); bargaining takes many rounds (SPE settles in round 1); the first mover gets almost everything (only for small δ).
- **Source:** Rubinstein (1982).

## Unit 7, Repeated games

### L20 Repeated games and discounting
- **Example game:** infinitely repeated PD (T5/R3/P1/S0) with grim trigger; cooperation sustainable iff δ >= (T-R)/(T-P) = 1/2. Real-world framing: tacit price collusion, an ongoing relationship. This is the condensed Evolution of Trust pattern.
- **Interactive:** a patience slider δ and a strategy picker (Grim, Tit-for-Tat, Always Defect); play a bot over a run with random stopping (=1-δ) and see the discounted total. Predict-then-reveal: at what δ does cooperation survive?
- **Worked example:** cooperate forever = R/(1-δ); defect once = T + δP/(1-δ); cooperate if 3/(1-δ) >= 5 + δ/(1-δ), giving δ >= 1/2. Faded: recompute with P=2. Solo: does Tit-for-Tat sustain at δ=0.6?
- **Misconceptions:** repetition always produces cooperation (needs δ >= threshold); a finitely repeated PD sustains cooperation (backward induction unravels it); grim trigger is robust to noise (it is not, motivates L22).
- **Source:** Friedman (1971); Axelrod (1984).

### L21 Folk theorems
- **Example game:** the repeated PD; the feasible set is the convex hull of {(3,3),(5,0),(0,5),(1,1)}, the individually rational region is everything above the minmax 1; as δ to 1 any point in that region is a subgame-perfect equilibrium payoff. Real-world framing: why many collusive prices or norms are all self-enforcing.
- **Interactive:** drag a target payoff point around the plotted feasible region; the app shades the IR sub-region and reports "supportable (δ >= ...)" or "below minmax, impossible." Predict-then-reveal: can you sustain (4,1)? (0.5,0.5)?
- **Worked example:** support (3,3) with grim trigger; support an asymmetric (3.5, 2) by alternating with punishment, checking each player stays above minmax 1. Distinguish the Nash-threat folk theorem (Friedman) from the minmax one (Fudenberg-Maskin).
- **Misconceptions:** the folk theorem predicts cooperation (it predicts almost anything above minmax); it needs infinite repetition; any payoff at all is achievable (only feasible and above minmax).
- **Source:** Fudenberg and Maskin (1986).

### L22 Repeated games with imperfect monitoring
- **Example game:** repeated PD where you see only a noisy public signal ("good" market w.p. 0.9 if they cooperated, 0.1 if they defected), the Green-Porter model; grim trigger fails because noise triggers punishment even with no cheating, so equilibrium needs occasional on-path price wars. Real-world framing: OPEC seeing only the price, an employer seeing output not effort.
- **Interactive:** a monitoring-noise slider; at low noise grim-trigger cooperation holds; raise noise and cooperation periodically collapses into price wars even though both meant to cooperate; a punishment-length slider lets the learner tune forgiveness. Predict-then-reveal: should punishment be forever or temporary?
- **Worked example:** a 10% false-bad signal almost surely triggers a permanent war under grim trigger, destroying value; a "trigger-and-forgive" (T-period war, then reset) keeps cooperation alive with occasional expected wars.
- **Misconceptions:** punishments only happen when someone actually cheats (under noise they must happen anyway); better monitoring is unnecessary; observed price wars prove someone defected.
- **Source:** Green and Porter (1984); Abreu, Pearce and Stacchetti (1990).

### L23 Reputation
- **Example game:** the chain-store game with incomplete information: an incumbent faces entrants in N towns; with small probability the incumbent is a "tough" type who always fights; a normal incumbent fights early to build a reputation, deterring later entry. Real-world framing: brand/quality reputation, a central bank building anti-inflation credibility.
- **Interactive:** the learner is a sequence of entrants deciding In/Out after watching the incumbent's history; a bot incumbent (unknown type) fights early and the learner feels deterrence build; then roles flip. Predict-then-reveal: after the incumbent fights the first two entrants, do you enter town 3?
- **Worked example:** backward induction with a small tough-type probability: in the last town the normal incumbent accommodates, but early on the value of the reputation exceeds the one-period cost of fighting, so it fights, and entrants stay out. Even a tiny probability sustains deterrence over long horizons.
- **Misconceptions:** reputation requires actually being tough (a small doubt suffices); with complete information the incumbent would still deter (Selten's paradox: it would not); reputation lasts forever (it collapses near the end).
- **Source:** Kreps and Wilson, Milgrom and Roberts, KMRW (all 1982).

## Unit 8, Incomplete information (static)

### L24 Bayesian games and Bayes-Nash
- **Example game:** Cournot with private cost. P=12-Q; firm 1 cost 0; firm 2 cost 0 (prob 1/2) or 6 (prob 1/2), unseen by firm 1. BNE: q1=5, q2(low)=3.5, q2(high)=0.5. Discrete companion: Battle of the Sexes with a Sociable-or-Shy partner. Real-world framing: a sealed bid when you do not know a rival's cost.
- **Interactive:** a slider for the prior that firm 2 is low-cost; set q1, two type-bots best-respond, profit shown live. Predict-then-reveal: as the prior of low-cost rises, does q1 rise or fall? (falls toward 4).
- **Worked example:** q2(t)=(12-q1-c_t)/2, E[q2]=4.5-q1/2; firm 1 FOC q1=(12-E[q2])/2, q1=5, q2(low)=3.5, q2(high)=0.5.
- **Misconceptions:** you best-respond to the realised type (no, to the type distribution); types must be independent; Bayes-Nash requires updating during play (a static Bayesian game uses fixed types).
- **Source:** Harsanyi (1967-68).

### L25 Auctions I (first/second price, revenue equivalence)
- **Example game:** IPV, values U[0,100]. SPA with three bidders valuing 40, 70, 90: the 90-bidder wins, pays 70; truthful bidding is dominant. Symmetric FPA, U[0,1]: b(v)=v(n-1)/n; for n=3, b(v)=2v/3. Real-world framing: eBay proxy bidding (SPA), sealed procurement (FPA).
- **Interactive:** the auction sandbox; set one bid against two bots (values U[0,100]), toggle FPA vs SPA; win/price/surplus per round, and a running average of seller revenue converges to the same number in both formats. Predict-then-reveal: which format earns you more? (neither).
- **Worked example:** FPA bid = expected highest of the other n-1 values given all below v = v(n-1)/n; n=2 gives v/2; expected revenue for U[0,1] is (n-1)/(n+1), n=3 gives 1/2.
- **Misconceptions:** in a second-price auction you should shade (truthful is dominant); first-price bidders bid their value (they shade to (n-1)/n·v); first-price raises more revenue.
- **Source:** Vickrey (1961).

### L26 Auctions II (common values, winner's curse)
- **Example game:** the jar-of-coins experiment (a jar worth $8, average bid $5, winning bid over $10). Klemperer's wallet game: value t1+t2, each ti ~ U[0,1] private, symmetric SPA equilibrium b(t)=2t. Real-world framing: oil-lease and spectrum auctions, M&A bidding. Include the winner's-curse-behavior reality-check callout (novices overbid; forward-link to L62).
- **Interactive:** "the jar": true value hidden, each bot and the learner get a noisy signal, submit a bid; reveal whether you won and overpaid; a histogram contrasts "bid your signal" vs "shade"; a slider on N shows the curse worsening. Predict-then-reveal: more rivals, bid higher or lower? (lower).
- **Worked example:** wallet game: conditional on winning your type is higher, so E[value | win] = t + t/2 = 3t/2, above the naive estimate; the equilibrium bid 2t makes the tying type indifferent.
- **Misconceptions:** bid your unbiased estimate (condition on winning, shade); more bidders means bid more aggressively (be more conservative); the winner's curse means you always lose money.
- **Source:** Wilson (1969); Milgrom and Weber (1982).

## Unit 9, Dynamic information and communication

### L27 Perfect Bayesian equilibrium
- **Example game:** the Gift game (Watson): sender Friend (prob p) or Enemy; chooses Give or Not; receiver seeing a gift chooses Accept or Reject; the receiver accepts iff the posterior that the sender is a Friend is >= 1/2. Real-world framing: a vendor's free trial, is the firm a Friend (good product) or Enemy (lock-in)?
- **Interactive:** a PBE checker; drag the receiver's belief at each information set and pick continuation actions; the app lights up the four PBE conditions live. Predict-then-reveal: at p=0.4, can "both types Give" be a PBE? (no).
- **Worked example:** p=0.6, pooling on Give is a PBE (on-path belief 0.6, accept since 2·0.6-1>0); p=0.4, pooling on Give fails, the PBE is pooling on Not with off-path belief 0 supporting Reject.
- **Misconceptions:** PBE only restricts on-path beliefs (sequential rationality is required everywhere); every Nash is a PBE; off-path beliefs are free so anything goes (the resulting actions must still be optimal).
- **Source:** Fudenberg and Tirole (1991).

### L28 Signaling games (Spence)
- **Example game:** Spence education: types θL=1 (prob 1/2), θH=2 (prob 1/2); cost c(e,θ)=e/θ; firms pay inferred productivity; least-cost separating e*=1 (High picks 1, Low picks 0). Beer-Quiche (Cho-Kreps): Surly (0.9) / Wimp (0.1). Real-world framing: a degree signaling ability, professional certifications.
- **Interactive:** "signal chooser": as the High worker drag education e; the inferred wage and net payoff update live, separating vs pooling regions shaded; a beer-quiche mode toggles off-path beliefs to watch quiche-pooling collapse under the intuitive criterion. Predict-then-reveal the least-cost separating e*.
- **Worked example:** Low will not mimic: 2-e* <= 1, e* >= 1; High will separate: 2-e*/2 >= 1, e* <= 2; least-cost e*=1, wages w(0)=1, w(1)=2, High net 1.5.
- **Misconceptions:** education raises productivity (in pure Spence it is a pure signal); the separating level is unique (a continuum, refinement selects least-cost); the strong type eats quiche to blend in (pooling is on beer).
- **Source:** Spence (1973); Cho and Kreps (1987).

### L29 Adverse selection and screening (split from the old L29)
- **Example game:** Akerlof lemons: quality q ~ U[0,100], sellers value q, buyers value 1.5q; at price p only sellers with q <= p sell, so expected quality p/2 and buyer willingness 0.75p < p; the market unravels to p=0. Screening: Rothschild-Stiglitz insurance menus that separate risk types. Real-world framing: used cars, health insurance.
- **Interactive:** "the lemons dial": drag a price, the app shades which sellers participate and shows the buyer's expected payoff collapsing to zero. Predict-then-reveal: is there any price the market clears at? (only 0).
- **Worked example:** buyer value 0.75p < p for all p>0, so only p=0 clears; contrast screening, where a menu of (price, deductible) lets buyers self-select by type.
- **Misconceptions:** adverse selection is hidden action (it is hidden type; moral hazard is hidden action); in screening the seller knows each type (buyers self-select); a small quality spread breaks the market (unraveling can be total).
- **Source:** Akerlof (1970); Rothschild and Stiglitz (1976).

### L30 Cheap talk (split from the old L29)
- **Example game:** Crawford-Sobel: an expert knows θ ~ U[0,1], has bias b, wants action θ+b; the receiver wants θ; with b=1/8 the most informative equilibrium is a 2-interval partition with boundary 1/4. Real-world framing: a biased analyst or lobbyist advising a decision-maker. Contrast with L31: cheap talk has no commitment, persuasion does.
- **Interactive:** drag the bias b and watch the maximum number of informative message intervals shrink to one (babbling) as b passes 1/4. Predict-then-reveal: how much can an expert with bias b credibly convey?
- **Worked example:** the boundary type is indifferent between the two induced actions; 2(a1+b) = y1+y2 gives a1 = 1/2 - 2b (=1/4 at b=1/8); a 2-interval equilibrium exists only if b < 1/4.
- **Misconceptions:** costless messages cannot inform (they can, partially); expert bias just shifts the message not its informativeness (large bias destroys information); babbling means the expert lies.
- **Source:** Crawford and Sobel (1982).

## Unit 10, Information design and contracts

### L31 Information design and Bayesian persuasion
- **Example game:** prosecutor-judge (Kamenica-Gentzkow): prior Pr(guilty)=0.3; the judge convicts iff posterior >= 0.5; the prosecutor commits to a signal (not a lie); optimal signal reports "guilty" always when guilty and w.p. 3/7 when innocent, so "guilty" yields posterior exactly 0.5; conviction rate 60% though only 30% are guilty. Real-world framing: a ratings agency's grade scale, an ad platform's disclosure.
- **Interactive:** "split the prior": drag a Bayes-plausible split of 0.3 into two posteriors; the sender's expected payoff is read off the concavified value; the optimum snaps when one posterior hits 0.5. Predict-then-reveal: can partial disclosure beat both full disclosure and secrecy? (yes).
- **Worked example:** report innocent as "guilty" w.p. x; posterior 0.3/(0.3+0.7x)=0.5 gives x=3/7; P(conviction)=0.3+0.7·(3/7)=0.6.
- **Misconceptions:** persuasion requires lying (it uses honest committed signals); a rational judge cannot be pushed above the 30% prior; full disclosure is always best for the receiver.
- **Source:** Kamenica and Gentzkow (2011).

### L32 Contract theory and moral hazard
- **Example game:** principal-agent, hidden effort. Output High (100) or Low (0); effort e in {0,1}, P(High|1)=0.8, P(High|0)=0.4, cost 15; risk-neutral agent with limited liability, reservation 0. Real-world framing: CEO stock options, sales commissions, sharecropping, insurance deductibles.
- **Interactive:** "design the bonus": set base and bonus; the app shows the agent's best-response effort (does IC hold?), the agent's utility (IR), and principal profit; a slider on the productivity gap moves the required bonus and the rent. Predict-then-reveal the profit-maximising contract.
- **Worked example:** IC for e=1: 0.8 w_H + 0.2 w_L - 15 >= 0.4 w_H + 0.6 w_L, so w_H - w_L >= 37.5; cheapest with limited liability w_L=0, w_H=37.5; agent rent 15; principal profit 50 (beats 40); moral hazard costs the principal 15, exactly the rent.
- **Misconceptions:** moral hazard is solved with a high fixed salary (flat pay kills incentives); the agent should be the full residual claimant (only if risk-neutral and unconstrained); moral hazard equals adverse selection.
- **Source:** Holmström (1979); Grossman and Hart (1983).

---

# TIER 3, EXPERT

## Unit 11, Refinements and epistemics

### L33 Sequential equilibrium and refinements
- **Example game:** the 2x2 (T,L)=(1,1), else (0,0): both (T,L) and (B,R) are Nash, but (B,R) survives only on weakly dominated play. Selten's Horse distinguishes sequential from PBE. Reference the intuitive criterion from L28. Real-world framing: discarding equilibria propped up by never-tested threats.
- **Interactive:** "shake the tree": inject small trembles ε on each action and watch which equilibria survive as ε to 0; (B,R) collapses; a belief-consistency panel reports whether a belief is justified by some totally-mixed sequence. Predict-then-reveal: does (B,R) survive a tremble?
- **Worked example:** if the column player trembles to L w.p. ε, Row earns ε from T vs 0 from B, so prefers T, and (B,R) is not trembling-hand perfect. Hierarchy: Nash superset subgame-perfect superset sequential superset trembling-hand perfect superset proper.
- **Misconceptions:** subgame perfection removes all non-credible behavior (games with no proper subgames need PBE/sequential); a weakly dominated strategy can anchor a reasonable equilibrium; PBE and sequential are identical.
- **Source:** Kreps and Wilson (1982); Selten (1975).

### L34 Epistemic foundations (common knowledge, agreement)
- **Example game:** blue eyes / muddy children: with n blue-eyed people, all leave on night n after the public announcement, which creates common knowledge. Aumann agreement / no-trade: common priors plus commonly known posteriors rule out disagreement and speculative trade. Real-world framing: the financial no-trade theorem, coordinated-attack messaging.
- **Interactive:** a muddy-children simulator: set the number of muddy children and step through nights, predicting which night they deduce; an agreement mode where two bots exchange posteriors until they converge. Predict-then-reveal: which night do they leave?
- **Worked example:** n blue-eyed people leave on night n; each already saw blue eyes, but the announcement created common knowledge to all orders, which powers the induction.
- **Misconceptions:** the islanders learned nothing from the announcement (they gained higher-order knowledge); rational agents with different information bet against each other (no-trade); common knowledge just means everyone knows.
- **Source:** Aumann (1976); Rubinstein (1989).

### L35 Global games
- **Example game:** currency-attack / regime change (Morris-Shin): the peg collapses iff attackers >= fundamental θ; attacking costs c; complete information gives multiplicity for intermediate θ, but noisy private signals x_i = θ + noise give a unique threshold, regime falls iff θ < θ* = 1-c (θ*=1/2 at c=1/2). Real-world framing: the 1992 ERM attack, bank runs, sovereign-debt rollover.
- **Interactive:** "attack or hold": set a signal-threshold strategy against threshold bots; sliders for noise and cost c; across many fundamental draws the app shows the fraction attacking and whether the regime falls, then reveals θ*=1-c. Predict-then-reveal: does cheaper attacking make crises more or less likely? (more).
- **Worked example:** at the switching signal the marginal agent's belief about the fraction attacking is uniform on [0,1], and indifference gives θ*=1-c; c=1/2 gives θ*=1/2.
- **Misconceptions:** crises are pure sunspot multiplicity (global games give a unique fundamentals threshold); tiny noise leaves the equilibrium set unchanged (it selects uniqueness); strong fundamentals always prevent a crisis.
- **Source:** Carlsson and van Damme (1993); Morris and Shin (1998).

## Unit 12, Mechanism design and social choice

### L36 Social choice (Arrow, Gibbard-Satterthwaite)
- **Example game:** Condorcet cycle: V1 A>B>C, V2 B>C>A, V3 C>A>B; A beats B, B beats C, C beats A, no winner. Gibbard-Satterthwaite manipulation under plurality: 45% A, 30% B, 25% C where C-voters prefer B to A, so they vote B and elect B. Real-world framing: the spoiler effect, ranked-choice reform.
- **Interactive:** "cycle finder / manipulation lab": set three rankings and the app flashes any pairwise-majority cycle; a second mode lets one voter change a ballot and flip the winner in their favor. Predict-then-reveal.
- **Worked example:** the profile above yields a strict majority cycle, so no rule satisfies unrestricted domain, Pareto, and IIA without a dictator (Arrow); the plurality profile shows a manipulable non-dictatorial rule (Gibbard-Satterthwaite).
- **Misconceptions:** majority rule always yields a consistent ranking (Condorcet cycles); Arrow proves democracy is impossible (it constrains ranking rules under IIA); some clever rule is fully strategy-proof with 3+ options (only dictatorship among onto rules).
- **Source:** Arrow (1951); Gibbard (1973); Satterthwaite (1975).

### L37 Mechanism design and the revelation principle
- **Example game:** selling one item to two buyers, values iid U[0,1]; the second-price auction is the truthful direct implementation of the first-price auction's outcome. Real-world framing: designing procurement rules, then simplifying to "just report your value."
- **Interactive:** "be the designer": specify an allocation rule and payments; the app checks whether truth-telling is a BNE (IC) and whether IR holds, and reports revenue; a revelation toggle takes the first-price mechanism (b=v/2) and shows its truthful direct equivalent.
- **Worked example:** in the n=2 FPA, type v bids v/2, wins w.p. v, interim expected payment v^2/2; the direct mechanism "report v, win iff highest, pay that interim expected payment" reproduces the same outcome with truthful reporting optimal.
- **Misconceptions:** direct mechanisms are always best in practice (the principle characterises achievable outcomes, not robustness); IC means no private information (honesty is optimal despite it); the principle lets you implement any goal (only equilibrium outcomes subject to IC/IR).
- **Source:** Myerson (1979); Gibbard (1973).

### L38 VCG mechanisms
- **Example game:** combinatorial VCG, two identical items, three bidders: A values the pair at 10, B one unit at 8, C one unit at 6; efficient allocation gives one unit each to B and C (welfare 14 > 10). Real-world framing: spectrum auctions, ad-slot allocation, the Clarke tax for public goods.
- **Interactive:** "VCG allocator": submit a bid against bots; the app computes the efficient allocation and each bidder's pivot payment, then invites the learner to lower their payment by misreporting and shows they cannot. Predict-then-reveal: dominant-strategy truthfulness.
- **Worked example:** B's payment = others' welfare without B (10) minus others' welfare with B (6) = 4; C's = 10 - 8 = 2; each pays below value; single-item VCG is the second-price auction.
- **Misconceptions:** in VCG you pay your own bid (you pay the externality you impose); VCG is budget-balanced or profitable (it often runs a deficit); VCG is fully manipulation-proof (vulnerable to collusion and shills).
- **Source:** Vickrey (1961); Clarke (1971); Groves (1973).

### L39 Optimal (Myerson) auctions
- **Example game:** single item, n bidders iid U[0,1]; virtual value ψ(v)=2v-1; the optimal auction is a second-price auction with reserve r where ψ(r)=0, r=1/2, independent of n. Real-world framing: eBay and ad-auction reserves. Thread revenue equivalence from L25: it pins expected payments, so revenue maximisation reduces to choosing the allocation and reserve.
- **Interactive:** "set your reserve" in the auction sandbox; set a reserve in an SPA against n bots (U[0,1]), run many rounds, and a revenue-vs-reserve curve peaks at 1/2; a slider on n keeps the peak at 1/2. Predict-then-reveal the optimal reserve.
- **Worked example:** ψ(v)=2v-1=0 gives r*=1/2; single buyer, post price p to maximise p(1-p), p=1/2, revenue 1/4; the optimal reserve is independent of n.
- **Misconceptions:** more bidders means raise the reserve (independent of n for iid); the optimal auction always sells (the reserve means sometimes no sale); revenue-maximising equals efficient.
- **Source:** Myerson (1981).

### L40 Implementation theory (feature Myerson-Satterthwaite)
- **Example game:** Myerson-Satterthwaite: buyer v_b ~ U[0,1], seller cost v_s ~ U[0,1]; no mechanism is efficient, IC, IR, and budget-balanced at once; the Chatterjee-Samuelson double auction trades iff v_b >= v_s + 1/4, missing all efficient trades in the gap. Maskin monotonicity characterises Nash-implementable rules. Real-world framing: why negotiations collapse despite gains from trade.
- **Interactive:** "the double auction": as buyer set a bid, a bot seller uses the linear ask, and the app shows when trade happens and the surplus left on the table against a first-best benchmark. Predict-then-reveal the 1/4 gap.
- **Worked example:** first-best gains from trade 1/6; the linear equilibrium captures 9/64 ≈ 0.141 < 0.167, the loss forced by two-sided private information.
- **Misconceptions:** rational parties always reach efficient agreements (Myerson-Satterthwaite: impossible with two-sided private information); Nash implementation just needs Pareto efficiency (needs Maskin monotonicity); clever payments design around the impossibility.
- **Source:** Myerson and Satterthwaite (1983); Maskin (1999).

### L41 Auctions III (multi-unit, combinatorial, position/GSP)
- **Example game:** position auction (search ads): two slots with click volumes 100 and 50, advertisers A, B, C with per-click values 10, 6, 4; efficient A to slot 1, B to slot 2; VCG payments A pays 500 (5/click), B pays 200 (4/click); GSP is not truthful but its lowest envy-free equilibrium matches VCG. Real-world framing: Google/Bing ads, FCC spectrum, Treasury uniform-price.
- **Interactive:** "bid for ad slots" in the auction sandbox; set a per-click bid against bots for two slots; slot won, price, and profit shown, with a GSP/VCG toggle demonstrating truthful bidding is not optimal under GSP. Predict-then-reveal the bid shading.
- **Worked example:** A's VCG payment = others' welfare without A (B·100 + C·50 = 800) minus others' welfare with A (B in slot 2 = 300) = 500; B's = 1200 - 1000 = 200.
- **Misconceptions:** GSP is a second-price auction so truthful bidding is dominant (false with multiple slots); uniform-price auctions are demand-truthful (demand reduction); simultaneous bidding on complements is safe (the exposure problem).
- **Source:** Edelman, Ostrovsky and Schwarz (2007); Ausubel and Milgrom (2004).

## Unit 13, Cooperative game theory (one running game: seller + two buyers)

### L42 Coalitional games and the core
- **Example game:** seller + two buyers: v(1)=v(2)=v(3)=0, v(12)=v(13)=100, v(23)=0, v(123)=100; the buyers compete, so the core is the single point (100,0,0). Real-world framing: a scarce resource with competing buyers.
- **Interactive:** "form a coalition": propose an allocation summing to 100; the app flags any coalition S with v(S) above its members' payoffs (a blocking coalition) in red; the learner hunts for an unblocked (core) allocation. Predict-then-reveal: can the buyers extract anything? (no).
- **Worked example:** core needs x1+x2 >= 100 so x3=0, and x1+x3 >= 100 so x2=0, hence x1=100; buyer competition hands all surplus to the scarce seller.
- **Misconceptions:** the core is always nonempty (empty for the 3-player majority game); the core splits surplus fairly (it tracks bargaining power); any efficient allocation is in the core (it must be unblocked by every coalition).
- **Source:** Gillies (1959); von Neumann and Morgenstern (1944).

### L43 Shapley value
- **Example game:** the same seller + two buyers game; Shapley value = (200/3, 50/3, 50/3) ≈ (66.7, 16.7, 16.7), which lies outside the core (66.7+16.7 = 83.3 < 100) because the game is not convex. Real-world framing: the airport runway cost-sharing game.
- **Interactive:** "sample the orderings": Monte Carlo over random player orderings, recording each player's marginal contribution; the running average converges to the Shapley value on screen; overlay the core to show Shapley outside it. Predict-then-reveal the exact values.
- **Worked example:** for the seller, marginal contributions across the six orderings are 0,0,100,100,100,100, so φ1=400/6=200/3; by symmetry φ2=φ3=50/3.
- **Misconceptions:** the Shapley value is always in the core (only for convex games); it is the average of what each coalition gets (it is the average marginal contribution); a null player can still get a payout.
- **Source:** Shapley (1953).

### L44 Nucleolus
- **Example game:** the 3-player majority game v(S)=1 for |S|>=2, v(123)=1: the core is empty yet the nucleolus is (1/3,1/3,1/3). Flagship real case: the Talmud bankruptcy rule (Aumann-Maschler); claims (100,200,300), estate 200, nucleolus (50,75,75). Real-world framing: dividing an insufficient estate fairly.
- **Interactive:** "shrink the worst complaint": adjust an allocation; the app shows the sorted vector of coalition excesses (complaints); the learner lexicographically minimises the largest, then the next; reveal the nucleolus against the Shapley marker.
- **Worked example:** in the majority game each pair's excess is 1-(x_i+x_j); symmetry minimises the maximum, giving (1/3,1/3,1/3). On v(12)=v(13)=60, v(23)=40, v(123)=120 the nucleolus is (53.3,33.3,33.3) vs Shapley (46.7,36.7,36.7).
- **Misconceptions:** the nucleolus equals the Shapley value; it may not exist or be unique (it always exists and is unique); it needs a nonempty core.
- **Source:** Schmeidler (1969); Aumann and Maschler (1985).

## Unit 14, Matching and market design

### L45 Stable matching (Gale-Shapley)
- **Example game:** the fully cyclic marriage instance. Men m1: w1>w2>w3, m2: w2>w3>w1, m3: w3>w1>w2; women w1: m2>m3>m1, w2: m3>m1>m2, w3: m1>m2>m3. Man-proposing DA gives each man his first choice and each woman her last; woman-proposing reverses it. Real-world framing: the medical residency match, school choice.
- **Interactive:** "step deferred acceptance": click through rounds (propose, tentatively hold, reject); a toggle switches the proposing side to a different stable matching; then hunt for a blocking pair (there is none). Predict-then-reveal which side is better off.
- **Worked example:** man-proposing round 1: m1 to w1, m2 to w2, m3 to w3, all held, done; check stability (w1 prefers m2 but m2 prefers w2, no blocking pair). Woman-proposing reaches the mirror image.
- **Misconceptions:** a stable matching is unique (often several); DA maximises total happiness (it is stable and proposer-optimal); both sides do best under the same run (the proposing side is advantaged).
- **Source:** Gale and Shapley (1962).

### L46 Top trading cycles
- **Example game:** Shapley-Scarf housing, four agents owning h1 to h4; preferences 1: h3>h2>h1>h4; 2: h1>h3>h4>h2; 3: h2>h1>h3>h4; 4: h3>h4>h1>h2. Real-world framing: kidney exchange, dorm reassignment, course swaps.
- **Interactive:** "run the cycles": each agent points to the owner of its favorite remaining house; click to find and execute a cycle; matched agents gray out; repeat; the app verifies the unique core and lets the learner try misreporting (no gain). Predict-then-reveal.
- **Worked example:** round 1 pointing 1 to 3, 2 to 1, 3 to 2, 4 to 3; the cycle 1-3-2 executes (1 gets h3, 3 gets h2, 2 gets h1); round 2, agent 4 gets h4; result strategy-proof and Pareto-efficient.
- **Misconceptions:** TTC gives everyone their first choice (scarcity forces compromises); TTC and DA coincide in school choice (TTC is efficient but can violate priorities); agents can gain by misreporting (it is strategy-proof).
- **Source:** Shapley and Scarf (1974); Roth, Sönmez and Ünver (2004) for kidney exchange.

### L47 Matching with contracts and design without money
- **Example game:** Hatfield-Milgrom: contract terms (wage, hours) are part of each contract; under substitutes a cumulative offer process yields a stable allocation, and auctions are a special case. School-choice instance: students s1: A>B>C, s2: A>C>B, s3: B>A>C; priorities A: s2>s1>s3, B: s1>s3>s2, C: s3>s2>s1; student-proposing DA gives s2 to A, s1 to B, s3 to C. Real-world framing: Boston's 2005 switch to DA; kidney exchange without prices.
- **Interactive:** "assign the seats": step student-proposing DA with school priorities and check stability; a Boston-mechanism toggle shows honest ranking getting punished; a contracts mode runs the cumulative offer process with a wage choice. Predict-then-reveal that DA is strategy-proof for students, Boston is not.
- **Worked example:** DA run: round 1 s1,s2 to A, s3 to B; A keeps s2, rejects s1; round 2 s1 to B, which prefers s1, rejects s3; round 3 s3 to A, rejected; round 4 s3 to C, accepted; result s2-A, s1-B, s3-C, stable.
- **Misconceptions:** without money efficient fair assignment is impossible (DA/TTC achieve it); the Boston mechanism is best for families (it is manipulable); matching with contracts is unrelated to auctions (auctions are a special case).
- **Source:** Hatfield and Milgrom (2005); Abdulkadiroğlu and Sönmez (2003).

## Unit 15, Evolution and learning

### L48 Evolutionarily stable strategies (ESS)
- **Example game:** Hawk-Dove with V=2, C=6: Hawk vs Hawk (V-C)/2 = -2, Hawk vs Dove 2, Dove vs Hawk 0, Dove vs Dove 1; since C>V there is no pure ESS, the ESS is a mixed population p*=V/C=1/3. Real-world framing: animal conflict, aggression in markets.
- **Interactive:** sliders for V and C and a population dial; predict the stable Hawk fraction, then Run: bots pair off, the higher-payoff strategy reproduces, and the Hawk share converges to V/C live. Predict-then-reveal.
- **Worked example:** fitness of Hawk at Hawk-fraction p is 2-4p, of Dove is 1-p; equate, p*=1/3=V/C; the population resists invasion by either pure type.
- **Misconceptions:** ESS is just Nash played by rational agents (it adds an invasion condition, no rationality); the stable mix is 50/50 because there are two strategies; raising injury cost C makes Hawks more common (it lowers the Hawk share).
- **Source:** Maynard Smith and Price (1973).

### L49 Replicator dynamics
- **Example game:** Rock-Paper-Scissors, zero-sum; the replicator equation has interior fixed point (1/3,1/3,1/3) with closed orbits; a tie bonus of +0.1 spirals inward (stable), -0.1 outward. A Hawk-Dove toggle converges to the L48 ESS (the bridge). Real-world framing: cyclic strategy fads.
- **Interactive:** a triangle simplex; drag the starting mix, predict the path, watch the trajectory; a "tie bonus" slider flips between closed orbit, inward spiral, and outward spiral. Predict-then-reveal.
- **Worked example:** at (0.5,0.3,0.2) for (R,P,S), payoff to Rock = x_S - x_P = -0.1, to Paper = 0.3, to Scissors = -0.2; Paper is above average so its share grows, producing the cycle.
- **Misconceptions:** replicator dynamics always converge to Nash (zero-sum RPS orbits forever); the center is unstable (neutrally stable); the dynamics require reasoning (it is pure reproduction).
- **Source:** Taylor and Jonker (1978); Hofbauer and Sigmund (1998).

### L50 Stochastic stability and conventions
- **Example game:** Stag Hunt (4,4)/(0,3)/(3,0)/(3,3), two strict equilibria; add rare mutations. The Hare basin is 3/4 > 1/2, so Hare-Hare (risk-dominant) is stochastically stable even though Stag-Stag pays more. Real-world framing: which convention (a standard, a norm) wins in the long run.
- **Interactive:** a grid population best-responds to a random opponent with a mutation-rate slider; predict which convention wins in the long run, then watch it settle; lowering the mutation rate only changes the waiting time. Predict-then-reveal.
- **Worked example:** you choose Stag only if belief q that the other plays Stag satisfies 4q >= 3, q >= 3/4; the Hare basin exceeds 1/2, so Hare is risk-dominant and stochastically stable.
- **Misconceptions:** the payoff-dominant equilibrium is selected (risk-dominant is); lowering the mutation rate changes which equilibrium is stable (only the waiting time); the starting state determines the long-run outcome (it is start-independent).
- **Source:** Kandori, Mailath and Rob (1993); Young (1993).

### L51 Learning in games (fictitious play, no-regret)
- **Example game:** Matching Pennies for fictitious play (beliefs cycle, time-average converges to (1/2,1/2)); a 2x2 for regret matching. Real-world framing: firms feeling their way to a price, bidders learning to shade.
- **Interactive:** play repeated Matching Pennies against a fictitious-play bot; a live bar shows the bot's belief counts converging to 50/50; a second mode swaps in a no-regret (multiplicative weights) bot and plots cumulative regret flattening. Predict-then-reveal.
- **Worked example:** the bot has seen Heads 6, Tails 4, believes P(Heads)=0.6 and exploits it; if both learn, empirical frequencies converge to (1/2,1/2); no-regret guarantees average payoff within O(sqrt(ln n / T)) of the best fixed action.
- **Misconceptions:** fictitious play converges to Nash in every game (it can cycle; guaranteed for zero-sum and potential games); no-regret converges to Nash (to coarse correlated equilibrium in general); converging beliefs means actions stop changing.
- **Source:** Brown (1951); Hart and Mas-Colell (2000).

## Unit 16, Algorithmic game theory

### L52 Complexity of equilibria (PPAD) [shorter puzzle lesson]
- **Example scenario:** existence of Nash is guaranteed but finding one is PPAD-complete, as hard as the End-of-Line problem; the combinatorial heart is Sperner's Lemma (a valid 3-coloring always has a panchromatic triangle, but locating it can need exponential search). This is a shorter concept/puzzle lesson, not a bot match.
- **Interactive:** a Sperner triangle puzzle: color interior vertices under the boundary rule, then "walk the corridor" (the End-of-Line path) to the tricolor cell; a solution provably exists yet the path can be long. Predict-then-reveal: how long is the walk?
- **Worked example:** Lemke-Howson finds a 2-player Nash by pivoting along a path of almost-equilibria (the End-of-Line structure); Savani-von Stengel built games forcing exponentially many pivots; zero-sum Nash is a linear program, so easy.
- **Misconceptions:** if an equilibrium exists it can be computed efficiently; Nash is NP-complete to find (it is PPAD-complete); two-player zero-sum is also hard (it is easy via LP).
- **Source:** Daskalakis, Goldberg and Papadimitriou (2009).

### L53 Congestion and potential games
- **Example game:** four drivers route s to t over two roads, road A cost = number of users (c_A(x)=x), road B flat 3; the game has an exact potential and best-response dynamics reach a pure Nash. Real-world framing: commuting route choice, load balancing.
- **Interactive:** assign drivers to roads and watch each unhappy driver switch one at a time; a live meter shows the potential Φ strictly decreasing each switch to the equilibrium. Predict-then-reveal the final split.
- **Worked example:** equilibrium is 3 on A (each pays 3), 1 on B (pays 3); no one gains by switching; Φ at this state is (1+2+3)+3 = 9 vs all-4-on-A 1+2+3+4 = 10; best response lowers Φ monotonically.
- **Misconceptions:** best-response dynamics can cycle forever (impossible in a potential game); the potential equals total social cost (a different function); only networks are congestion games.
- **Source:** Rosenthal (1973); Monderer and Shapley (1996).

### L54 Price of anarchy and Braess
- **Example game:** Pigou: one unit of traffic, link 1 cost 1, link 2 cost x; Nash all on x (cost 1), optimum splits half (0.75), PoA = 4/3. Braess: 4000 drivers, each route x/100 plus a fixed 45; add a zero-cost shortcut and everyone funnels through it. Real-world framing: adding a road that slows everyone down.
- **Interactive:** a road map where selfish drivers route themselves; a "build the new road" button adds the Braess shortcut; predict travel time will fall, then watch it rise; a second view computes PoA live for the Pigou split. Predict-then-reveal.
- **Worked example:** Pigou PoA = 1 / 0.75 = 4/3. Braess: before the shortcut 2000 per route, time 2000/100+45 = 65; after, everyone through the shortcut, 4000/100+4000/100 = 80, and deviating costs 85, so 80 is the equilibrium; adding a road made everyone slower.
- **Misconceptions:** adding a road always helps or is neutral (Braess); selfish routing wastes an unbounded factor (capped at 4/3 for affine costs); the equilibrium minimises total travel time.
- **Source:** Roughgarden and Tardos (2002); Braess (1968).

### L55 Network and graphical games
- **Example game:** best-shot public good on a 6-node graph: each node pays 1 to provide, value 2 if it or a neighbor provides; pure equilibria are maximal independent sets. On a star the center provides and leaves free-ride (cost 1); on a 6-cycle providers alternate (cost 3). Real-world framing: who installs the shared resource in a network.
- **Interactive:** toggle nodes on a small network; each node best-responds to neighbors and the display converges to an equilibrium; add a hub to show free-riding concentrate on high-degree neighbors. Predict-then-reveal which nodes provide.
- **Worked example:** star: center provides, five leaves free-ride, society pays 1; 6-cycle: providers must be an independent set of size 3, cost 3; same rule, structure triples the cost.
- **Misconceptions:** network games need a global solver (local best-responses suffice for many graphical games); more links always help coordination; every node behaves the same at equilibrium (degree and position matter).
- **Source:** Kearns, Littman and Singh (2001).

## Unit 17, Behavioral and experimental (economic game lab engine)

### L56 Limited reasoning (level-k, cognitive hierarchy)
- **Example game:** p-beauty contest, p=2/3, guesses 0 to 100; level ladder L0 ~50, L1 33.3, L2 22.2, L3 14.8; cognitive hierarchy uses Poisson levels with mean τ ≈ 1.5; humans cluster near 33 and 22, not 0. Real-world framing: Keynesian beauty contest in asset prices, product-launch timing.
- **Interactive:** enter a guess, see your place on the level ladder and the real human distribution overlaid (spikes near 33 and 22), then the winning number (~20 to 25); optionally play a live round against a Poisson(1.5) bot mix. Predict-then-reveal.
- **Worked example:** full rationality iterates 2/3 to 0, but empirically the mode is 33 and 22 (one and two rounds from 50); a guess of 0 loses; best response to a Poisson(1.5) crowd is ~20 to 22.
- **Misconceptions:** 0 is the smart answer (it loses against humans); everyone reasons to the same depth; repetition drives everyone to 0 immediately (convergence is slow).
- **Source:** Nagel (1995); Camerer, Ho and Chong (2004).

### L57 Quantal response equilibrium
- **Example game:** asymmetric Matching Pennies (own-payoff effects) and centipede, where Nash mispredicts and QRE fits; logit choice P(a) ∝ exp(λ·EU(a)); λ=0 uniform, λ to ∞ Nash. Real-world framing: auction overbidding, voter turnout, graded route choice.
- **Interactive:** a single λ "rationality dial"; set λ, predict the play mix, watch QRE move from 50/50 (λ=0) toward Nash (large λ), with experimental data pinned at an intermediate λ. Predict-then-reveal.
- **Worked example:** with EU_A - EU_B = 1 util, P(A) = 1/(1+e^(-λ)): λ=0 gives 0.50, λ=1 gives 0.73, λ=3 gives 0.95, λ to ∞ gives 1; data fit a moderate λ.
- **Misconceptions:** QRE means players are random (better actions are more likely); QRE abandons equilibrium beliefs (beliefs are still consistent); λ is a property of the game not the players.
- **Source:** McKelvey and Palfrey (1995).

### L58 Social preferences: fairness (ultimatum, dictator, trust)
- **Example game:** ultimatum split of $10: modal offer 50/50, mean ~$4 to $4.50, offers of $1 to $2 rejected about half the time (~16% overall). Dictator: mean given ~$2 to $2.80. Trust game: investor sends ~$5 (tripled), trustee returns ~$4 to $5. Real-world framing: downward wage rigidity, surge-pricing backlash, tipping.
- **Interactive:** as proposer set an ultimatum offer; a responder bot calibrated to real rejection data accepts or rejects, then the human distribution is revealed; a toggle switches to dictator mode and offers collapse. Predict-then-reveal.
- **Worked example:** Fehr-Schmidt responder utility when behind: U_R = s - α(10-2s); reject if s < 10α/(1+2α); with α=0.5 the threshold is $2.50, matching the empirical rejection spike.
- **Misconceptions:** rational responders accept any positive offer so low offers are safe; dictator and ultimatum giving are the same (dictator is much lower); fairness means everyone wants exactly 50/50 (envy α exceeds guilt β).
- **Source:** Güth, Schmittberger and Schwarze (1982); Fehr and Schmidt (1999); Berg, Dickhaut and McCabe (1995).

### L59 Reciprocity and intentions
- **Example scenario:** an unfair offer from a random device is rejected far less than the same offer chosen by a person (Blount); Rabin's fairness equilibrium (kindness answered with kindness, a psychological game); Charness-Rabin adds a distributional-plus-reciprocity utility. Real-world framing: gift exchange in firms, concession-matching in negotiation.
- **Interactive:** the same $10 offer arrives two ways, "chosen by the other player" vs "drawn by a wheel"; predict your acceptance threshold in each, then see data showing far higher tolerance for the random version; a reciprocity-weight dial changes predicted rejections. Predict-then-reveal.
- **Worked example:** U_B = (1 - θq)·x_B + θq·x_A with q<0 when A behaved unkindly and q≈0 when accidental; an intentional stingy offer lowers (even flips) the weight on A's payoff, so B pays to punish, while the identical accidental outcome leaves B nearly self-interested.
- **Misconceptions:** only the final distribution matters (intent changes responses); reciprocity equals inequity aversion (outcome-based vs intention-based); kind behavior is unconditional.
- **Source:** Rabin (1993); Charness and Rabin (2002); Blount (1995).

### L60 Cooperation and punishment (public goods)
- **Example game:** linear public good, n=4, endowment 20, multiplier 1.6, MPCR 0.4; Nash contribute 0, optimum full; contributions start at 40 to 60% and decay without punishment, but costly punishment (pay 1 to cut a free-rider by 3) revives and holds them near full. Real-world framing: team shirking, tax compliance, climate.
- **Interactive:** a repeated 4-player public-goods game vs bots (conditional cooperators plus a defector); set a contribution each round; a punishment toggle lets you pay 1 to cut a free-rider by 3; chart contributions collapsing without punishment, then rebounding with it. Predict-then-reveal.
- **Worked example:** contributing 1 loses you 1 and returns 0.40, net -0.60, so selfish is 0; but four contributing 20 each gives a pot of 128 split to 32 each vs 20 from hoarding; n·MPCR = 1.6 > 1 makes cooperation efficient.
- **Misconceptions:** people free-ride from the start (contributions begin high and decay); punishment is irrational so no one punishes (it is common); punishment always raises welfare (its cost can offset gains).
- **Source:** Fehr and Gächter (2000).

### L61 Learning and adaptation (EWA)
- **Example game:** a learning model fit to p-beauty or a coordination game; EWA attraction update A_j(t) = [φ·N(t-1)·A_j(t-1) + (δ + (1-δ)·1{chosen})·π_j(t)] / N(t), N(t)=ρ·N(t-1)+1, logit choice; δ=0 gives pure reinforcement, δ=1 with φ=ρ gives fictitious play; estimates φ≈0.8 to 1, δ≈0.5. Real-world framing: pricing drifting to competitive or collusive levels, bidders learning to shade.
- **Interactive:** two dials, φ (memory) and δ (imagination); predict how a bot with given (φ,δ) adapts, then race two bots at the extremes to see reinforcement lag belief learning. Predict-then-reveal.
- **Worked example:** δ=0 reinforces only the played action by its realised payoff (reinforcement learning); δ=1, φ=ρ reinforces every action by its would-be payoff (fictitious play); estimated δ≈0.5 says people weight foregone payoffs about half.
- **Misconceptions:** reinforcement and belief learning are unrelated (both are EWA special cases); people learn only from experienced outcomes (counterfactuals matter); one rule fits all games with the same parameters.
- **Source:** Camerer and Ho (1999).

### L62 Field tests and boundaries (penalty kicks, centipede)
- **Example game:** penalty kicks (Palacios-Huerta, 1,417 kicks): scoring (Kick L, Dive L)=0.60, (L,R)=0.95, (R,R)=0.70, (R,L)=0.90; equilibrium mix ~36% Left, and observed play matches minimax with serial independence. Centipede (McKelvey-Palfrey): subgame-perfect says take at node 1, yet ~1% do. Real-world framing: when the theory holds and when it fails. Differentiate from A8: here the question is "does minimax hold in the field?"
- **Interactive:** a penalty shootout vs a keeper bot; after 20 kicks the app runs a serial-independence test on the learner's choices and compares to the minimax prediction; a centipede mode shows how far real pairs go. Predict-then-reveal.
- **Worked example:** keeper indifference sets the kicker's Left mix: 0.60p+0.90(1-p) = 0.95p+0.70(1-p) gives p ≈ 0.36; kicker indifference gives the keeper's dive-left q ≈ 0.45; observed frequencies match, and choices are serially independent.
- **Misconceptions:** real experts do not mix randomly (they do); backward induction predicts centipede behavior (it fails); always shoot your stronger side (exploitable).
- **Source:** Palacios-Huerta (2003); McKelvey and Palfrey (1992).

### L63 Culture, context, and design (WEIRD, market design)
- **Example scenario:** cross-cultural ultimatum (Henrich et al.): US mean offer ~48%, Machiguenga ~26% with ~5% rejections, Lamalera ~58% (hyper-fair), some groups make rejection-inducing over-offers; WEIRD subjects are outliers. Market-design failures: the pre-1998 medical match unraveling; Boston's old manipulable school-choice mechanism. Real-world framing: designing for the players you actually have.
- **Interactive:** run the same ultimatum/public-goods engine under swappable norm presets (WEIRD, small-scale, market-integrated); predict the offer distribution per culture, then see the real data; a second module lets the learner "break" a market by watching offers unravel earlier without a clearinghouse. Predict-then-reveal.
- **Worked example:** market integration predicts fairness: communities with more anonymous market exchange make higher, more equal offers; the Machiguenga, who rarely trade with strangers, treat the game as a windfall and offer little; a WEIRD subject imports a 50/50 norm.
- **Misconceptions:** undergrad lab results generalise to all humans; fairness is innate and universal in magnitude (it varies with institutions); a theoretically optimal mechanism succeeds regardless of context.
- **Source:** Henrich et al. (2001, 2010).

---

# UNIT 18, APPLIED TRACK: GAME THEORY IN THE WILD

Placement (SPEC §4): inline cases appear right after their home theory lesson; capstone cases run in
a closing sequence with a capstone project. Anchor texts: Dixit and Nalebuff; Roth; Schelling;
Milgrom; Ostrom; Tambe.

### A1 Matching markets (inline after L46) [medical match, school choice, kidney exchange]
- **Scenario:** the NRMP unraveled into exploding offers, then adopted deferred acceptance (Roth-Peranson, 1998); Boston moved to DA in 2005; kidney exchange builds cycles and non-directed-donor chains.
- **Applies:** L45 to L47 (matching, DA, TTC, strategy-proofness).
- **Interactive:** rank students and schools, run DA step by step, and the app flags any blocking pair to show stability; kidney mode links compatible pairs into a 2-cycle or a chain and shows how many transplants a chain unlocks.
- **Worked example:** DA is strategy-proof for the proposing side, unlike the old Boston mechanism where families had to game rankings; a 2-way swap needs mutual compatibility, while a non-directed donor starting a chain relaxes that.
- **Misconceptions:** a stable matching maximises total happiness; you should misreport to do better (not under proposer DA); kidney exchange is just a waiting list.
- **Source:** Gale and Shapley (1962); Roth, Who Gets What and Why (2015).

### A2 Auctions in the wild (inline after L26) [spectrum, ad auctions]
- **Scenario:** FCC spectrum auctions (simultaneous multiple-round design from 1994); the 2016-17 incentive auction paid broadcasters ~$10B and raised ~$19.8B; online ads use GSP, which is not truthful.
- **Applies:** L25, L26, L38, L41.
- **Interactive:** bid in a GSP ad auction with two slots and posted click rates; see slot, price, and profit, and discover you can beat truthful bidding; a toggle shows VCG's charge.
- **Worked example:** two slots CTR 1000 and 400, values A=$10, B=$4, C=$2; under GSP with truthful bids A wins slot 1 and pays $4/click (profit $6,000); VCG charges the externality instead; because GSP charges the next bid, A can sometimes shade without losing slot 1.
- **Misconceptions:** GSP is a second-price auction so bid your value; a higher bid always means a better slot at the same profit; revenue-maximising and efficient auctions are the same.
- **Source:** Edelman, Ostrovsky and Schwarz (2007); Milgrom (2004).

### A3 Deterrence and brinkmanship (capstone) [Cuban Missile Crisis]
- **Scenario:** the 1962 crisis, often modeled as Chicken: both swerve (0,0), one holds firm (+1, -1), both hold firm catastrophe (-10, -10); Schelling's "threat that leaves something to chance." Caveat: Chicken is a contested model; Dixit-McAdams-Skeath (2019) argue a dynamic sequential-bargaining version fits better. Present Chicken as the entry point and flag the critique.
- **Applies:** L14, L15, L20.
- **Interactive:** an escalation ladder; each turn hold or de-escalate against a bot, but every step raises a random chance the crisis goes nuclear; feel the tradeoff of squeezing concessions vs rising accident risk. Predict-then-reveal your intended vs realized risk.
- **Worked example:** two pure equilibria plus a mixed one where hold w.p. p makes the opponent indifferent, -10p + 1(1-p) = 0, p = 1/11 ≈ 9%; brinkmanship commits to a positive catastrophe probability bad enough to make the rival yield.
- **Misconceptions:** deterrence just needs threatening the worst response (credibility is the problem); Chicken has a stable cooperative outcome; rational actors never risk catastrophe.
- **Source:** Schelling (1960, 1966).

### A4 Entry deterrence in business (inline after L15)
- **Scenario:** chain-store paradox and capacity commitment (Dixit 1980). Incumbent earns 100 as monopolist; on entry, fight (entrant -10, incumbent 20) or accommodate (40, 50); without commitment the incumbent accommodates and entry happens.
- **Applies:** L15 (commitment), L12.
- **Interactive:** an extensive-form tree as incumbent, first without commitment (fighting is not credible, entry happens), then with a sunk capacity investment that makes fighting profitable and deters entry. Predict-then-reveal: does the threat deter?
- **Worked example:** post-entry fight 20 < accommodate 50, so the threat is empty and the entrant enters; a sunk investment raising the fight payoff above the accommodate payoff makes fighting the credible best response, the entrant stays out.
- **Misconceptions:** announcing you will fight deters entry; commitment is about resolve not payoffs (it changes your own future payoffs); sunk costs are always bad.
- **Source:** Dixit (1980); Selten (1978).

### A5 Co-opetition and platforms (inline after L11)
- **Scenario:** Brandenburger-Nalebuff value net; complementors raise everyone's value (Wintel, consoles subsidizing hardware, two-sided card pricing, the ~30% app-store take); platform economics turns on cross-side network effects.
- **Applies:** L7 (coordination), L11.
- **Interactive:** run a two-sided platform, setting a price to each side; cross-side effects mean a low price on one side grows the other; total adoption and profit update live, showing why platforms subsidize one side.
- **Worked example:** when each extra user makes the platform more valuable to developers and vice versa, the profit-maximising structure often prices one side below cost to ignite the network, then monetizes the other.
- **Misconceptions:** competitors are only rivals (complementors expand the pie); each side should cover its own cost; bigger share always means more profit on a platform.
- **Source:** Brandenburger and Nalebuff (1996); Rochet and Tirole (2003).

### A6 The roots of cooperation (inline after L21) [Axelrod, cartels]
- **Scenario:** Axelrod's tournaments (T5/R3/P1/S0): Tit-for-Tat won; real cartels sustain collusion with price-war punishments (Green-Porter, the JEC railroad cartel).
- **Applies:** L20, L21.
- **Interactive:** an Axelrod-style tournament (Evolution of Trust style): pick or build a strategy (Always Defect, TFT, Grim, Forgiving) and run a round-robin plus an evolutionary sweep.
- **Worked example:** cooperation is sustainable under Grim/TFT if δ >= (T-R)/(T-P) = 1/2; patient players cooperate, impatient ones defect; cartels break down when the short-run gain from cheating beats future punishment.
- **Misconceptions:** defection is always rational so cooperation is impossible (repetition sustains it); nice strategies are naive (TFT wins); cartels are stable by agreement (they need a credible punishment path).
- **Source:** Axelrod (1984).

### A7 Bargaining and negotiation (inline after L19) [strikes, BATNA]
- **Scenario:** Rubinstein alternating offers over a shrinking pie; strikes and lockouts are the costly disagreement BATNA and Nash bargaining explain; a worse BATNA means a worse deal.
- **Applies:** L18, L19.
- **Interactive:** alternating-offers negotiation vs a bot with a shrinking pie (modeling a strike's cost); set offers and see how patience and the outside option move the split. Predict-then-reveal the equilibrium division.
- **Worked example:** SPE gives the proposer 1/(1+δ), the responder δ/(1+δ); at δ=0.9, 0.526 vs 0.474; as δ to 1 it approaches 50/50; BATNAs truncate the range and shift the split toward the better alternative.
- **Misconceptions:** strikes prove bargaining is irrational (they come from asymmetric information); the first mover always wins big (advantage vanishes with patience); your BATNA does not matter until talks fail.
- **Source:** Rubinstein (1982); Nash (1950).

### A8 Mixed strategies in sport (inline after L8) [penalty kicks]
- **Scenario:** applied minimax in penalty kicks, tennis serves, and pitch selection; the equilibrium requires unpredictable mixing at frequencies that equalize success. Differentiate from L62: here the question is "how to win", play vs an adaptive exploiting bot.
- **Applies:** L8, L10.
- **Interactive:** a penalty shootout vs an adaptive bot that detects patterns; any predictable bias gets punished; an "exploitability" meter shows how much the bot profits from a pattern.
- **Worked example:** with the L62 scoring matrix, the kicker's equilibrium mix is ~36% Left; at that mix the keeper cannot raise the save rate by favoring either side; "always natural side" lets an adaptive keeper cut your scoring.
- **Misconceptions:** mix 50/50 to be unpredictable (equilibrium frequencies are usually not 50/50); take your best shot every time; alternating sides is random (it is a detectable pattern).
- **Source:** Chiappori, Levitt and Groseclose (2002); Palacios-Huerta (2003).

### A9 The commons (inline after L13) [Ostrom, climate]
- **Scenario:** Hardin's tragedy vs Ostrom's Governing the Commons and her eight design principles; climate is a global public good with cross-national free-riding.
- **Applies:** L13, L20.
- **Interactive:** a shared fishery (or carbon budget) that the learner and bots harvest; overshoot the regeneration and the stock crashes; toggles for communication, monitoring, and graduated sanctions show Ostrom's principles rescue the resource (reuse the L60 engine with a regenerating stock).
- **Worked example:** each fisher's private incentive is to take one more fish while the depletion cost is shared, so extraction overshoots the sustainable yield; adding monitoring plus graduated sanctions changes the payoff enough to restore cooperation, as Ostrom documented.
- **Misconceptions:** the commons must be privatized or state-run (self-governance works); one big penalty deters best (graduated sanctions outperform); climate is unsolvable because it is a pure PD.
- **Source:** Ostrom (1990); Hardin (1968).

### A10 Political economy (capstone) [median voter, lobbying]
- **Scenario:** Downs/Hotelling median-voter convergence; lobbying as an all-pay contest (Baye-Kovenock-de Vries) and rational ignorance.
- **Applies:** L11, L36.
- **Interactive:** drag two candidate positions along a spectrum with a visible voter distribution; vote shares update and any off-median position is beaten; add a base-turnout penalty for extremism to break full convergence; a second module runs an all-pay lobbying auction where money is spent even in defeat.
- **Worked example:** voters at {0.1,0.2,0.5,0.8,0.9}, median 0.5; if A sits at 0.4 and B at 0.6, B slides to 0.5 and wins, so both-at-median is the only Nash; extremist abstention pulls the equilibrium apart.
- **Misconceptions:** candidates adopt sincere views (they chase votes); the median voter theorem holds in multi-dimensional or 3-candidate races (it generally fails); lobbying just buys votes directly.
- **Source:** Downs (1957); Baye, Kovenock and de Vries (1993).

### A11 Contracts and the law (inline after L32) [moral hazard, settlement]
- **Scenario:** principal-agent moral hazard (pay tied to noisy output, Holmström 1979); litigation vs settlement (parties settle to avoid trial costs; settlement fails under divergent estimates or asymmetric information).
- **Applies:** L32, L29.
- **Interactive:** (1) as principal set an incentive contract slope; the agent bot chooses effort and the app shows the effort-vs-risk tradeoff; (2) settlement bargaining: set an offer given each side's win probability and see trial or settlement.
- **Worked example:** plaintiff wins $100k w.p. 0.6 (expected $60k), each side's trial cost $10k; plaintiff trial value $50k, defendant expected loss $70k; any settlement in [50k, 70k] beats trial, a $20k surplus; settlement fails when win estimates diverge enough that the ranges do not overlap.
- **Misconceptions:** make the agent bear all risk (over-punishes a risk-averse agent for noise); rational parties always settle (they litigate under optimism or asymmetric info); higher-powered incentives are always better.
- **Source:** Holmström (1979); Shavell (2004).

### A12 Security games and multi-agent AI (capstone)
- **Scenario:** Stackelberg security games (Tambe): the defender commits to a randomized patrol first, the attacker best-responds after surveillance; deployed as ARMOR (LAX), IRIS (air marshals), PROTECT (Coast Guard, with a QRE attacker); related AI: superhuman poker via counterfactual regret minimization.
- **Applies:** L8, L15, L24, and L57 (QRE).
- **Interactive:** allocate a limited patrol as coverage probabilities across targets; an attacker bot best-responds to the announced mix; a meter shows expected loss, and deterministic "guard the most valuable target" is exploitable while the right randomization minimizes worst-case loss; a QRE toggle for a noisy attacker.
- **Worked example:** two targets valued 10 and 5, one patrol unit (c1+c2=1); equalize attacker payoff (1-c1)·10 = (1-c2)·5 with c2=1-c1, giving c1=2/3, c2=1/3, expected loss ≈ 3.33; "always guard the $10 target" invites an attack on the $5 target for a loss of 5 > 3.33.
- **Misconceptions:** always defend the highest-value target; predictable patrols are fine if frequent (surveillance makes any pattern exploitable); assume a perfectly rational attacker (QRE fits real adversaries).
- **Source:** Tambe (2011).

---

## Capstone project
After the capstone cases (A3, A10, A12, plus the integrative Cuban Missile Crisis and a spectrum or
climate simulation), the learner picks a real episode, identifies the players, the game form, the
equilibrium, and one design intervention that would change the outcome.
