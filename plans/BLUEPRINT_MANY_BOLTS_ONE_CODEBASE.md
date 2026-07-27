# BLUEPRINT — Many Bolts, One Codebase
### AI-DLC beyond the pilot team

> **Status:** standalone course blueprint. **Supersedes** `COURSE_PLAN_ADDENDUM_T9_MANY_BOLTS.md`, which is retained as the source for nine carried-over module specs (§6).
> **Domain anchor:** the MeridianCare Prior Auth *platform* — `AuthRequest`, `Member`, `Provider`, `ClinicalCriteria`, `Determination`, `AuthStatus`, `AUTO_APPROVE_THRESHOLD = 0.85`, nurse review queue
> **Player architecture:** unchanged — single-file HTML, MODS array, `renderVisual()` switch, warm paper palette, token-only SVG colors, audience filter
> **Visual key prefix:** `mb_`
> **Authoring workflow:** `/plan-module` → `/build-module` → `/build-lab` → `/validate-module`, one module per session, `/clear` between, PROGRESS.md tracking

---

## 1. Course identity

| Field | Value |
|---|---|
| Title | **Many Bolts, One Codebase** |
| Subtitle | AI-DLC beyond the pilot team |
| Modules | 22 (M00–M21) across 6 tracks |
| Audience | Staff engineers, architects, platform leads, engineering directors responsible for **several teams and one shared platform** |
| Prerequisite | **None hard.** Track 0 gets a reader in cold. Sprint Teams or the conceptual AI-DLC course recommended, not required. |
| Dual-path | Path A **Claude Code** · Path B **GitHub Copilot** — plus one module (M13) on running both at once, deliberately |
| Estimated duration | 16–20 hours including the capstone |
| Spine artifact | **The Quarter** — a three-mob, one-platform simulation run across a compressed quarter (§7) |
| Differentiator | The only course in the ecosystem where the unit of analysis is the **platform**, not the team |

### Course promise (landing page)

> Your pilot mob succeeded. That was the easy part. This course is about the second mob, and the fifth — five mobs against one platform, one clinical SME, one CI pipeline, and a change advisory board that meets Thursdays. AI-DLC as published has no answer for any of that. Here is one.

### The thesis

> **A validation bottleneck is a shared resource.** The moment a second mob touches the same codebase, AI-DLC stops being a method and becomes a queueing problem.

Every module derives from that sentence. Nothing new is invented — the course takes AI-DLC's own primitives (intent, unit of work, bolt, validation checkpoint) and asks what breaks when six of each run concurrently. Where AWS's method has no answer, the course says so plainly rather than papering over it. That honesty is a feature and should survive editing.

---

## 2. Positioning in the ecosystem

| Course | Unit of analysis | Relationship |
|---|---|---|
| *AI-DLC* (conceptual, 33 modules) | The method | Receives MS1–MS3 condensation as a **funnel into this course** (§11). Build after, not before. |
| *AI-DLC in Practice: 76-Day Mandate* | One team, one deadline | Deliberately single-mob. Untouched. Natural predecessor. |
| *AI-DLC for Sprint Teams* | One team migrating | Natural predecessor. Stays at 28 modules. |
| *10x Toolkit* | The individual engineer's tools | **Shares the fixture repos** (§7). Its AI-DLC graduate arc ends by pointing here. |
| **Many Bolts, One Codebase** | **The platform** | This course |

### The reading path, stated on the landing page

```
10x Toolkit (tools)  →  Sprint Teams (one team)  →  Many Bolts (the platform)
                             ↑
       AI-DLC conceptual (the method, for leaders) ─┘
```

---

## 3. Cold-start policy

The audience is senior, so the recap can be short and unapologetic. **Track 0 is three modules plus orientation**, not a full foundations track — a reader who has run exactly one bolt, or read about one, must be able to start at M00 and finish M21 without opening another course.

Enforced by validator rule 1 (§12): no module may depend on material outside M00–M21 except as a marked optional callback.

**Anti-goal:** do not re-teach AI-DLC. M01 recaps the primitives in one sitting and moves on. If M01 exceeds 40 minutes, it has become a different course.

---

## 4. Track structure

| # | Track | Color token | Modules | Audience skew |
|---|---|---|---|---|
| 0 | **Orientation & the scaling problem** | `#6366f1` | M00–M03 | both |
| 1 | **The validation economy** | `#b45309` | M04–M07 | both |
| 2 | **Trunk & integration mechanics** | `#0d9488` | M08–M11 | practitioner |
| 3 | **Coordination artifacts** | `#2b4a7e` | M12–M15 | both |
| 4 | **Operating the platform** | `#7c3aed` | M16–M18 | both |
| 5 | **Rolling it out** | `#be123c` | M19–M21 | leader-weighted |

Track 1 is the spine. If the course had to shrink to eight modules, they would be M03, M04, M05, M06, M08, M12, M14, M18.

---

## 5. Module map

| ID | Title | Track | Audience | Source |
|---|---|---|---|---|
| M00 | Orientation: the platform, the fixture, how to use this course | 0 | both | new |
| M01 | AI-DLC in one sitting, for people who've already run one | 0 | both | new |
| M02 | The Prior Auth platform: three services, five mobs, one trunk | 0 | both | new |
| M03 | Where the method stops | 0 | both | T9 M28 |
| M04 | The validation bottleneck under load | 1 | both | T9 M29 |
| M05 | Platform teams as validator-capacity multipliers | 1 | both | new |
| M06 | Constraint-time architecture governance | 1 | practitioner | T9 M33 |
| M07 | Security review at generation volume | 1 | practitioner | new |
| M08 | Trunk mechanics for concurrent bolts | 2 | practitioner | T9 M30 |
| M09 | Multi-repo, monorepo, and the agent's context boundary | 2 | practitioner | new |
| M10 | Shared CI, test volume, and environment contention | 2 | practitioner | T9 M34 |
| M11 | Brownfield at scale: fifteen years, no tests, five mobs | 2 | practitioner | new |
| M12 | Governing shared steering artifacts | 3 | both | T9 M31 |
| M13 | Mixed-engine estates | 3 | practitioner | new |
| M14 | Cross-mob intent decomposition and Intent Sync | 3 | both | T9 M32 |
| M15 | Conway's law at agent speed | 3 | both | new |
| M16 | Release coordination and audit evidence | 4 | both | T9 M35 |
| M17 | Incident response for code nobody remembers writing | 4 | practitioner | new |
| M18 | Portfolio metrics, cost governance, and the comparison trap | 4 | leader | T9 M36 |
| M19 | The second-team cliff | 5 | leader | new |
| M20 | Making the case: risk, compliance, and the executive ask | 5 | leader | new |
| M21 | Capstone: The Quarter | 5 | both | new |

---

## 6. Carried-over modules — renumbering and deltas

The nine Track 9 specs transfer nearly intact. Read the original spec in `COURSE_PLAN_ADDENDUM_T9_MANY_BOLTS.md` §3, then apply the delta.

| Old | New | Delta to apply |
|---|---|---|
| M28 | **M03** | Drop the "you already did M00–M21 of Sprint Teams" assumption. Cold open now lands after M02's platform tour, so the five mobs are already named characters. Contention inventory lab output feeds M21, not M36. |
| M29 | **M04** | Unchanged in substance. Add a forward pointer to M05 (platform as capacity multiplier) at the end of §3's four responses — it becomes the fifth response and the one this course argues for. |
| M30 | **M08** | Add a section on cross-*repo* landing once M09 exists; if M09 is built first, reference it. Fixture references update to `platform-fixture/`. |
| M31 | **M12** | Section 6 (multi-engine reality) is **cut and promoted** to M13. Replace with a section on steering artifacts for a shared library consumed by three mobs — `priorauth-clinical-rules` is the new example. |
| M32 | **M14** | Registry now spans three repos, not one. Add a subsection on registry scope: per-platform, not per-repo. |
| M33 | **M06** | Moves earlier and into Track 1, because in this course it is primarily a *validator-capacity* argument, not an architecture-hygiene one. Reframe the opening accordingly; the labs are unchanged. |
| M34 | **M10** | Unchanged. |
| M35 | **M16** | The compliance-conversation section (§6) is **cut and promoted** to M20. |
| M36 | **M18** | Six metrics become eight — add security-review queue depth (M07) and cross-repo contract breakage (M09). Closes the loop on M03's inventory *and* feeds M21's scoring. |

---

## 7. Fixture — `platform-fixture/`

> **Build this first. See §8.**

### Repos

| Repo | Role | Contention character |
|---|---|---|
| `priorauth-api` | Spring Boot core service | Code contention hotspot; owns `Determination` |
| `priorauth-web` | React portal + nurse queue UI | Shared component library, design-token drift |
| `priorauth-clinical-rules` | Shared Java library, consumed by both | **The real hotspot** — every mob depends on it, no mob owns it |

The third repo is the structural addition over the Track 9 fixture and the reason this course needs its own. A shared library that everyone consumes and nobody owns is where multi-team AI-DLC actually breaks, and it cannot be demonstrated with a single repo.

### The three mobs

| Mob | Intent | Primary repo | Collides with |
|---|---|---|---|
| **Appeals** | Members can appeal a denied `Determination` | api | Gate (status ownership), Portal (new UI surface) |
| **Gate** | `AUTO_APPROVE_THRESHOLD` becomes criteria-specific | rules → api | Appeals (service region), Portal (displayed reasons) |
| **Portal** | Provider-facing submission and status portal | web → api | Appeals (UI surface), Gate (reason rendering) |

Every pair collides. That's deliberate — pairwise collision is instructive, three-way collision is the capstone.

### The Quarter — capstone simulation

Six timed rounds, each a compressed two-week window. Learner plays **platform lead**, not mob member: they don't write the features, they run the governance and absorb the events.

| Round | Injected event | Modules under test |
|---|---|---|
| 1 | Baseline — three mobs start parallel bolts | M03, M14 |
| 2 | Clinical SME goes on two weeks' leave | **M04, M05** |
| 3 | A fourth mob onboards mid-quarter | M12, M15, M19 |
| 4 | Sev-2 in production, cause unclear, code six weeks old | **M17**, M16 |
| 5 | Compliance requests evidence for a threshold change | M16, M07 |
| 6 | Exec asks which mob is performing best | **M18, M20** |

Scored on: bolts landed, validator queue time, contract breakages, steering drift events, flag debt, evidence completeness. **Not** on speed alone — a run that lands everything fast and fails round 5 scores worse than a slower clean run. Say so in the rubric.

### Planted defects

| ID | Where | Surfaces in |
|---|---|---|
| PD-1 | Duplicate `V47__` migration across two mobs | M08 |
| PD-2 | `ClinicalCriteriaEvaluator` invites Tier-1 misclassification | M04 |
| PD-3 | `@PhiBoundary` dropped by the Gate mob | M12, M06 |
| PD-4 | Three overlapping UoWs across the three intents | M14 |
| PD-5 | `clinical` → `web` package dependency | M06 |
| PD-6 | Time-dependent flake in `DeterminationServiceIT` | M10 |
| PD-7 | Provenance schema v1 cannot record validator identity | M16 |
| PD-8 | `priorauth-clinical-rules` has no owner in CODEOWNERS | M05, M15 |
| PD-9 | Portal pins an old `clinical-rules` version; Gate's change silently no-ops | M09 |
| PD-10 | Agent-added transitive dependency with a known CVE | M07 |
| PD-11 | Two mobs' steering files disagree on error-handling convention | M12, M13 |
| PD-12 | 4,000-line untested legacy `EligibilityService` nobody will touch | M11 |

**Prototype gate:** PD-8, PD-9, and PD-12 are the ones that justify the standalone course. If the three-mob simulation doesn't make them bite, the course's spine is decorative — see §8.

### Sharing with the 10x Toolkit

`priorauth-api` and `priorauth-web` already exist in the Toolkit kit with a planted-bug inventory. **Decide ownership before building** (open decision #1): one canonical repo pair consumed by both courses, or a fork that will drift. Recommendation: canonical, with `platform-fixture/` as an additive overlay directory so the Toolkit is unaffected.

---

## 8. Prototype gate — do this before authoring anything

Two sessions, before the module list is committed.

**Session P1 — Build the minimum three-mob simulation.** Three repos, three intents, PD-8 / PD-9 / PD-12 planted, rounds 1 and 2 only.

**Session P2 — Run it yourself, ungoverned.** Play platform lead. Record what actually goes wrong.

**Gate questions — answer honestly:**

1. Does PD-9 (version pin silently no-oping another mob's work) actually surface, or does the learner just not notice and move on? If they don't notice, it needs a symptom.
2. Does the shared-library ownership gap (PD-8) produce a *decision point*, or just friction?
3. Is round 2 (SME on leave) genuinely harder than the Track 9 collision, or is it the same lesson with more repos?
4. Could rounds 1–2 have been taught with one repo? If yes, the third repo isn't earning its build cost, and the honest move is to go back to Track 9 inside Sprint Teams.

**Question 4 is the real gate.** Answer it before writing M00.

---

## 9. New module specs

`/plan-module`-ready. Carried-over modules: see §6 and the addendum.

---

### M00 — Orientation: the platform, the fixture, how to use this course

`both` · 20 min · no lab

**Objectives:** navigate the course; set up the three fixture repos; understand the scoring philosophy of The Quarter.

**Spine:** who this is for and who it isn't (if you have one team, take Sprint Teams first — say it plainly); the platform tour in 3 minutes; fixture setup and verification; the audience filter; how The Quarter is scored and why speed alone loses.

**Visuals:** `mb_course_map` (6 tracks, 22 modules, the eight-module spine highlighted), `mb_repo_topology` (three repos, dependency arrows, mob overlay)

**Gate:** all three repos clone, build, and pass `verify-fixture.sh`.

---

### M01 — AI-DLC in one sitting, for people who've already run one

`both` · 35 min · 15 min lab

> **Hard length cap.** If this exceeds 40 minutes it has become a different course. Recap, don't teach.

**Objectives:** state the AI-DLC primitives precisely; identify which are single-mob assumptions; run one bolt end to end to establish a shared baseline.

**Spine:** Inception / Construction / Operations in one diagram; intent → unit of work → bolt; Mob Elaboration and Mob Construction as rituals; the human validation checkpoint as the load-bearing element; **the annotation pass** — re-read the same diagram marking every place the spec says "the mob" and means "the only mob." That annotation is the course's opening move and should feel like a small betrayal.

**Visuals:** `mb_aidlc_primitives` (the canonical diagram), `mb_singlemob_annotation` (same diagram, assumptions highlighted on toggle)

**Lab:** one bolt, one unit of work, on `priorauth-api`. Deliberately easy. Establishes the baseline everything else degrades from. Path A/B.

**Gate:** learner can name the four primitives and identify two single-mob assumptions unprompted.

---

### M02 — The Prior Auth platform: three services, five mobs, one trunk

`both` · 30 min · 20 min lab

**Objectives:** know the domain well enough for every later example to land; map the three repos and their dependency; meet the mobs.

**Spine:** prior authorisation in five minutes for readers outside healthcare (utilisation management, why `0.85` exists, what a nurse review queue is and what it costs per item); the three repos and the dependency that matters (`clinical-rules` consumed by both, owned by neither — plant the discomfort here, pay it off in M05); the five mobs as named teams with real charters; the platform's constraints — CAB Thursdays, one clinical SME, one shared UAT, HIPAA.

**Visuals:** `mb_domain_flow` (AuthRequest → criteria → determination → queue-or-approve), `mb_repo_topology` (reused from M00, now with ownership shading — `clinical-rules` deliberately unshaded), `mb_mob_charters`

**Lab:** trace one `AuthRequest` end to end across all three repos with the agent, producing a system map the learner keeps.

**Gate:** learner can state which repo owns `Determination` and which owns nothing.

---

### M05 — Platform teams as validator-capacity multipliers

`both` · 45 min · 40 min lab

> The course's constructive answer to M04. If M04 is the diagnosis, this is the treatment.

**Objectives:** explain why adding validators scales linearly and encoding capacity scales non-linearly; design a golden path as agent-consumable constraint rather than documentation; assign ownership to a shared library nobody owns; recognise when a platform team becomes a *new* bottleneck.

**Spine:**
1. Recap M04's four responses, then the fifth: **make the validation unnecessary.** A rule encoded as a constraint the agent must satisfy consumes zero SME time per bolt, forever.
2. The economics, worked: one SME hour spent encoding a rule vs. one SME hour spent reviewing. Break-even is usually under two weeks at five mobs. Show the arithmetic — this is the module's persuasive core and it must be numeric, not rhetorical.
3. **Golden paths as generated scaffolds.** Not a wiki page; a template + constraint set the agent starts from. Prior Auth example: a new endpoint that touches PHI is scaffolded with `@PhiBoundary`, the audit write, and the fitness test already in place. The mob can't forget what was never optional.
4. **PD-8: the shared library with no owner.** `priorauth-clinical-rules` is consumed by three mobs. Every change needs clinical review; no mob has clinical capacity; changes queue behind whichever mob happens to need one. Three ownership models — owning mob, platform team, inner-source with designated maintainers — with honest costs.
5. When the platform team becomes the bottleneck. Symptom: mobs waiting on platform. The rule that prevents it: **platform owns constraints and scaffolds, never the change itself.** A platform team that reviews changes has recreated the SME queue with extra steps.
6. Staffing honestly: what this costs, and why the first platform hire is usually the SME who was drowning.

**Visuals:** `mb_capacity_math` (interactive: encode-vs-review break-even across mob count and rule reuse), `mb_golden_path` (a bolt starting from scaffold vs from blank, constraints pre-satisfied), `mb_ownership_models` (three models for `clinical-rules`, costs shown), `mb_platform_bottleneck` (the anti-pattern, animated)

**Lab — "Encode the SME out of the loop"**
Supplied: three clinical review comments the SME has made repeatedly across past bolts (realistic, from the fixture's history). Learner converts each into something that doesn't need the SME next time — a fitness test, a scaffold default, or a steering invariant — and justifies which mechanism fits which comment. Then assigns ownership for `priorauth-clinical-rules` and writes the CODEOWNERS entry.
- **Adversarial step:** one of the three comments **cannot** be encoded — it's a genuine clinical judgement call. The learner must identify it and leave it at Tier 3. An agent will try to encode all three. Graded moment.

**Gate:** two comments encoded and passing; the third correctly left as human judgement with a written rationale; `clinical-rules` has an owner.

**Glossary:** capacity multiplier, golden path, encode-vs-review break-even, inner-source maintainer, platform bottleneck anti-pattern

---

### M07 — Security review at generation volume

`practitioner` · 35 min · 35 min lab

**Objectives:** quantify how agent-driven development changes the dependency surface; place supply-chain checks as constraints, not gates; tier security review by blast radius (M04 callback); handle the PHI-adjacent case specifically.

**Spine:** agents add dependencies enthusiastically and plausibly — the library is real, popular, and unnecessary; dependency growth rate, single-mob vs five-mob; why security review can't be a human gate at this volume; SBOM generation per bolt, CVE gating in the merge queue (M08 callback), license checks; the PHI case — agents log helpfully, and helpful logging is a breach; `@PhiBoundary` enforcement as a fitness function (M06 callback); **PD-10** — the transitive CVE, found by the pipeline, not by a person.

**Visuals:** `mb_dependency_growth` (dependency count over a quarter, 1 vs 5 mobs), `mb_supply_chain_gate` (where SBOM/CVE/license checks sit in the bolt loop), `mb_phi_leak` (an agent-generated log line that ships PHI, and the constraint that stops it)

**Lab — "Ship the CVE, then stop it"** Learner runs a bolt that pulls PD-10, observes review miss it, then adds the pipeline gate and a PHI-logging fitness test. Re-runs; both fire.

**Gate:** CVE gate blocks correctly; PHI-logging test catches a deliberately reintroduced violation; learner explains why a human reviewer reliably misses both.

**Glossary:** dependency surface, SBOM per bolt, transitive CVE, PHI-adjacent logging, supply-chain constraint

---

### M09 — Multi-repo, monorepo, and the agent's context boundary

`practitioner` · 40 min · 40 min lab

**Objectives:** separate three boundaries that get conflated — repo, team, agent context; predict which cross-repo changes an agent will get wrong and why; make cross-repo contracts visible to the agent; handle versioned shared libraries under fast bolts.

**Spine:**
1. Three different boundaries, routinely treated as one: **repo** (deployment/versioning), **team** (ownership), **agent context** (what the model can see). Multi-team AI-DLC pain is usually a mismatch between them.
2. Monorepo: agent sees everything, context cost is high, cross-cutting changes are atomic. Multi-repo: cheap context, contracts must be explicit, cross-cutting changes span days and versions.
3. **The version-pin failure (PD-9).** Gate ships a `clinical-rules` change. Portal pins the previous version. Gate's change silently no-ops in one of two consumers. Nobody's tests fail. Nobody notices for three weeks. This is the module's centrepiece — and it's the failure that most reliably convinces senior engineers the multi-repo question is real.
4. Making contracts visible: contract tests as the agent's only reliable view across a repo boundary (M06 callback), version compatibility encoded rather than documented.
5. The pragmatic middle — vendored contracts, generated clients, a contracts repo — and when each is worth it.
6. Honest section: **AI-DLC has no position on repo topology.** It assumes the mob can see the code. That assumption breaks first at repo boundaries, and the method doesn't say what to do.

**Visuals:** `mb_three_boundaries` (repo / team / context as three overlays, misalignment highlighted), `mb_version_noop` (animated PD-9: change ships, one consumer silently unaffected), `mb_context_cost` (agent context consumption, monorepo vs multi-repo, on a real bolt)

**Lab — "Find the silent no-op"** Learner ships the Gate mob's `clinical-rules` change and verifies it works. It does — in one consumer. Learner must discover the second consumer is unaffected using only what the repos expose, then add the contract test that would have caught it at merge.

**Gate:** PD-9 found and explained; contract test fails correctly against the pinned version; learner states which boundary was actually misaligned.

**Glossary:** context boundary, version-pin no-op, contracts repo, boundary visibility, topology-agnostic method

---

### M11 — Brownfield at scale: fifteen years, no tests, five mobs

`practitioner` · 40 min · 45 min lab

**Objectives:** explain why brownfield breaks AI-DLC's validation loop specifically; use characterization tests as the entry move; scope agent context in a codebase too large to load; sequence strangler-fig work across mobs without collision.

**Spine:**
1. Every AI-DLC example is greenfield. Real platforms are not. The specific breakage: the validation checkpoint assumes you can tell whether the change is correct, and in untested legacy you cannot — so validation degrades to "it compiles and the demo works."
2. **Characterization tests as the entry move.** Not to specify correct behaviour — to pin *current* behaviour so change becomes visible. This is the one place where agent-generated tests are unambiguously excellent, because "what does it do now" is a question agents answer well and humans find tedious.
3. **PD-12: `EligibilityService`**, 4,000 lines, no tests, touched by all three mobs, understood by nobody. Learner characterizes it before anyone changes it.
4. Context scoping when the codebase exceeds any window: what to load, what to summarise, what to leave out, and how to tell when the agent is confabulating structure it hasn't seen. Concrete tells.
5. Strangler fig across mobs: seams as ownership boundaries (M15 forward reference), sequencing so two mobs don't strangle the same seam.
6. What not to do: the full-rewrite pitch that AI capability makes newly tempting and no more likely to succeed. Be direct — this is the most expensive mistake available to this audience right now.

**Visuals:** `mb_brownfield_loop` (the validation checkpoint failing for lack of an oracle), `mb_characterization` (behaviour pinned, then a change made visible), `mb_strangler_seams` (`EligibilityService` seams with mob assignments and sequence)

**Lab — "Pin it before you touch it"** Learner directs the agent to characterize `EligibilityService` (target: meaningful coverage of observable behaviour), then makes a small change and observes exactly what moved. Then identifies a seam and writes the strangler plan.

**Gate:** characterization suite pins current behaviour including two counter-intuitive cases; the change's blast radius is visible in test output; strangler plan assigns seams without overlap.

**Glossary:** characterization test, behavioural oracle, context scoping, confabulated structure, strangler seam

---

### M13 — Mixed-engine estates

`practitioner` · 35 min · 30 min lab

**Objectives:** maintain one canonical steering source across engines; recognise engine-specific dialect; decide what to standardise and what to leave to mob preference; handle provenance when engines differ.

**Spine:** the reality — procurement, preference, and history mean one platform runs Claude Code, Copilot, and possibly Q simultaneously; **canonical `STEERING.md` → generated per-engine files**, never hand-maintained parallel copies (M12 callback); dialect by engine, observed honestly — engines differ in test verbosity, comment density, error-handling idiom, and these show up as codebase divergence when mobs split by engine; **PD-11** — two mobs' steering files disagree on error handling, and the disagreement is invisible until you read generated code side by side; what to standardise (invariants, architecture, security) vs what not to (formatting preference, prompt style, workflow); provenance across engines — the record must name the engine, and M16's schema must accommodate it.

**Visuals:** `mb_engine_fanout` (canonical source → three generated files), `mb_dialect_compare` (same unit of work, three engines, divergence highlighted), `mb_steering_conflict` (PD-11 surfacing)

**Lab — "One source, three engines"** Learner writes a canonical steering file, generates per-engine variants, runs the same small unit of work on both available engines, and diffs the output. Then resolves PD-11 by deciding which convention is the invariant and encoding it as a fitness function rather than a steering line.

**Gate:** generated files are consistent; the divergence is identified as convention rather than correctness; the resolution is a fitness function, not a longer steering doc. (That last point is the lesson.)

**Glossary:** canonical steering source, engine dialect, generated steering, standardisation boundary

---

### M15 — Conway's law at agent speed

`both` · 40 min · 30 min lab

**Objectives:** explain why agents accelerate Conway's law rather than escaping it; treat mob composition as an architecture decision; align ownership boundaries with module seams; recognise when the org chart is the architecture problem.

**Spine:**
1. Conway's law, restated: systems mirror the communication structure of the organisation that builds them. The AI-DLC twist — a mob's agent is scoped to the mob's context, so **the agent has no view across the team boundary at all**. Agents don't transcend Conway's law; they enforce it faster and more literally than humans, who at least gossip.
2. Evidence in the fixture: `clinical-rules` has no owner (PD-8), so its code has no coherent design — three mobs' idioms layered on each other. The architecture of an unowned module is the average of everyone who touched it.
3. **Mob composition as an architecture decision.** Splitting mobs by feature vs by service produces measurably different codebases within a quarter. Show both.
4. Ownership boundaries should follow module seams; when they don't, every bolt is a cross-boundary bolt and the M14 registry fills with overlaps. The registry's overlap rate is a *readout of org design* — reframe M14's artifact as a diagnostic.
5. The inverse manoeuvre — change the team structure to get the architecture — and its honest cost at a real company, where reorgs are expensive and political and often not yours to call.
6. What to do when you can't reorg: explicit boundary contracts (M14), designated maintainers, and accepting that some seams will be badly placed.

**Visuals:** `mb_conway_speed` (drift from org structure into code structure, human-paced vs agent-paced), `mb_mob_split` (feature-split vs service-split, resulting codebases after one quarter), `mb_overlap_diagnostic` (registry overlap rate as an org-design readout)

**Lab — "Read the org from the code"** Learner analyses the fixture's commit history and module structure with the agent, infers the team boundaries, checks the inference against the actual mob charters (M02), and identifies the one seam that's misaligned.

**Gate:** team boundaries correctly inferred from code alone; misaligned seam identified; learner proposes both a boundary-contract fix and a composition fix, with costs.

**Glossary:** Conway acceleration, mob composition, seam alignment, overlap rate as diagnostic, inverse manoeuvre

---

### M17 — Incident response for code nobody remembers writing

`practitioner` · 40 min · 40 min lab

> The payoff for M16's provenance chain. Build after M16.

**Objectives:** run an incident where no human recalls authoring the code; use the provenance chain as an investigative tool; use the agent under time pressure without letting it confabulate; write a postmortem that names systemic causes rather than blaming the agent.

**Spine:**
1. The new failure mode: Sev-2, cause somewhere in code shipped six weeks ago, and nobody on the call has read it. Under sprints, someone always remembered. Under AI-DLC at volume, nobody does. This is not a hypothetical and it's worth stating that bluntly.
2. **Provenance as investigation.** M16's chain — UoW, bolt, mob, engine, validator, tier, steering version, fitness gates passed — is not just audit paperwork; under incident it's the fastest path from symptom to context. This reframing is the module's argument for why anyone should bother building the chain.
3. Investigating with the agent under pressure: it's excellent at reading unfamiliar code fast and dangerous at asserting causation confidently. Concrete tells for confabulation; the discipline of demanding evidence per claim.
4. **Round 4 of The Quarter** runs live here.
5. Rollback when three mobs have shipped on top of the suspect change. Flags (M16) as the escape hatch; what to do when the change predates the flag.
6. Postmortem without a scapegoat. "The agent wrote it" is not a cause. The causes available: tier misassignment (M04), missing constraint (M06), steering drift (M12), boundary invisibility (M09). Every one is a system fix.

**Visuals:** `mb_incident_timeline` (symptom → provenance query → suspect UoW → context, with elapsed time), `mb_confabulation_tells` (three agent claims, one unsupported, learner picks), `mb_rollback_tree` (three mobs' work stacked on the suspect change)

**Lab — "Sev-2, six weeks cold"** Timed. A live break in the fixture; learner uses provenance plus the agent to find cause, mitigate, and write the postmortem. Provenance is deliberately v1 (PD-7) — the missing validator identity costs them time, which is the point, and connects back to M16's lab.

**Gate:** cause found within the time box; at least one agent claim challenged for lack of evidence; postmortem names a systemic cause and no individual.

**Glossary:** provenance-led investigation, confabulation tell, cold code, systemic postmortem, flag-era boundary

---

### M19 — The second-team cliff

`leader` · 40 min · 30 min lab

**Objectives:** explain why pilots succeed and second teams fail; sequence a rollout on evidence; identify which prerequisites must exist before team two starts; recognise a stalling rollout early.

**Spine:**
1. **The cliff.** The pilot mob is volunteers, best engineers, greenfield-ish, unlimited SME attention, and executive interest. Team two has none of that. Every rollout failure looks like a method failure and is a conditions failure.
2. What the pilot proved and what it didn't. It proved the method works under ideal conditions. It said nothing about contention — which is the entire subject of this course.
3. **Prerequisites before team two starts**, as a checklist derived from Tracks 1–4: validation tiers (M04), at least one encoded golden path (M05), fitness functions (M06), merge queue (M08), canonical steering (M12), registry (M14). Rolling out without these is how you get M03's 3× cycle-time regression.
4. Sequencing: which team second, and why the answer is usually *not* the most enthusiastic one. Argument for picking a team with a boring, well-tested codebase and moderate enthusiasm — you're testing conditions, not motivation.
5. Round 3 of The Quarter — onboarding a mob mid-quarter — as the exercise.
6. Early warning signs of a stalling rollout, with the leading indicator being validator queue time (M04) rather than anything about the teams.
7. The honest version: some teams shouldn't migrate yet, and saying so protects the rollout. What that conversation sounds like.

**Visuals:** `mb_second_team_cliff` (pilot metrics vs team two, same method), `mb_prereq_checklist` (six prerequisites, each linked to the module that builds it), `mb_rollout_sequence` (team ordering by conditions, not enthusiasm)

**Lab — "Sequence your own rollout"** Learner maps their real teams against the prerequisite checklist and produces a sequenced plan with the conditions each team is missing. Agent assists with structuring; judgement is graded.

**Gate:** plan identifies at least one team that should wait, with a defensible reason; validator capacity is addressed before team two, not after.

**Glossary:** second-team cliff, conditions failure, rollout prerequisite, sequencing by conditions, leading indicator

---

### M20 — Making the case: risk, compliance, and the executive ask

`leader` · 40 min · 30 min lab

**Objectives:** make the control-chain argument to a risk officer; answer the executive productivity question without overclaiming; present cost honestly against validator time; know where the argument legitimately runs out.

**Spine:**
1. The risk conversation. Walk a risk officer from "AI wrote it" to "here is a stronger control chain than we had before" — tiering (M04), constraints (M06), provenance (M16), evidence as by-product. The strong form: these controls are *mechanical* where the previous ones were *cultural*.
2. **Where the argument runs out.** Say it plainly: constraints catch what you thought to encode. Novel failure modes are still novel. Anyone claiming AI-DLC eliminates review risk is selling something. Ending here rather than on the strong form is what makes the argument credible to a competent risk officer — and this audience will be in the room with one.
3. The executive productivity question, answered without overclaiming: what DORA 2025 and METR actually support, what they don't, and why cycle-time gains at the mob level can vanish at platform level through contention (the whole course, in one sentence).
4. Cost: token spend per mob against validator hours per mob, to scale. The ratio is usually surprising and argues for visibility over quota (M18 callback).
5. The ranking question, again — it arrives from executives, not just internally, and M18's answer needs an external-facing version.
6. Assembling the ask: what to request, in what order, with which evidence. Usually validator capacity or a platform hire, not tools.

**Visuals:** `mb_control_chain` (old cultural controls vs new mechanical ones, side by side, honest gaps marked), `mb_evidence_ladder` (claim → evidence → what it doesn't support), `mb_cost_ratio` (tokens vs validator hours, to scale)

**Lab — "The one-page ask"** Learner writes a one-pager for their actual leadership: the ask, the evidence, the honest limits, the cost. Agent drafts; learner supplies judgement. Graded on whether the limits section is real.

**Gate:** the one-pager contains a genuine limitation, no unsupported productivity claim, and an ask that is capacity or platform rather than tooling.

**Glossary:** control chain, mechanical vs cultural control, evidence ladder, the honest limit, capacity ask

---

### M21 — Capstone: The Quarter

`both` · 20 min setup · 2–3 hr simulation

**Objectives:** run six rounds as platform lead; absorb the injected events; produce a scored quarter and a retrospective naming which module's absence hurt most.

**Structure:** rounds per §7. Each round: plan → run → event fires → respond → score. Scoring rubric visible from the start; a fast run that fails round 5 scores worse than a slower clean one, and learners should know that before round 1 rather than discovering it at the end.

**Visuals:** `mb_quarter_board` (live scoreboard across six rounds, eight metrics), `mb_event_deck` (the six events), `mb_quarter_retro` (final scores against the course's eight-module spine, showing which absence cost most)

**Gate:** all six rounds completed; retrospective identifies the two lowest-scoring dimensions and traces each to a specific module's practice.

---

## 10. Audience filter mapping

| Module | `leader` | `practitioner` | Note |
|---|---|---|---|
| M00–M03 | ✓ | ✓ | Shared |
| M04 | ✓ | ✓ | Leader: §1–3, §6. Practitioner: §4–5 + lab |
| M05 | ✓ | ✓ | Leader: economics + staffing. Practitioner: golden path + lab |
| M06, M07, M08, M09, M10, M11, M13 | — | ✓ | Leader view: summary card each |
| M12 | ✓ | ✓ | Leader: ownership + drift. Practitioner: hierarchy + lab |
| M14, M15 | ✓ | ✓ | Split as in the module specs |
| M16 | ✓ | ✓ | |
| M17 | — | ✓ | Leader view: the postmortem section only |
| M18, M19, M20 | ✓ | — | Practitioner view: which numbers you'll be asked for |
| M21 | ✓ | ✓ | Both play platform lead |

---

## 11. MS1–MS3 — the funnel

Three modules added to the conceptual 33-module AI-DLC course, **built last**, once this course exists and you know what they're advertising.

| ID | Title | Sources | Note |
|---|---|---|---|
| MS1 | The validation bottleneck is a shared resource | M03, M04 | |
| MS2 | Coordinating mobs against one codebase | M12, M14, M15 | |
| MS3 | Governing AI-DLC at portfolio scale | M18, M20 | |

Lakeview Build analogy, engine-free, no Prior Auth storyline. Each ends pointing here.

---

## 12. Validator rules

Adapt `validate-track9.ps1` → `validate-manybolts.ps1`. Rules 1–7 carry over with these changes:

- **Rule 1 (cold start):** now enforces M00–M21 self-containment. No dependency on any other course except as marked optional callbacks.
- **Rule 2 (contention class):** unchanged. M03 declares all three.
- **Rule 3 (scale-claim qualification):** unchanged; still a warning, still the one to actually read.
- **Rule 4 (planted defects):** range extends to PD-1…PD-12.
- **Rule 5 (dual-path parity):** unchanged, except M13 which is *about* engine difference — exempt via `ENGINE-COMPARATIVE`.
- **Rule 6 (comparison trap):** applies to M18 **and M20** — no per-team identifiers in either.
- **Rule 7 (glossary):** unchanged.
- **Rule 8 (new) — honest-limit rule:** M05, M09, M11, M17, M19, M20 must each contain a section marked `honest-limit` stating where the practice fails or the argument stops. The course's credibility with a senior audience rests on these, and they are the first thing to get edited out by an agent optimising for confidence.

---

## 13. Build order

| Phase | Sessions | Content |
|---|---|---|
| **Prototype** | 2 | §8. **Stop and re-decide if question 4 fails.** |
| Fixture | 2–3 | Full three-repo fixture, PD-1…PD-12, The Quarter harness |
| Slots + kit | 1 | Track registry, 22 MOD markers, CLAUDE.md, validator, PROGRESS |
| Track 0 | 4 | M00, M01, M02, M03 |
| Track 1 | 4 | M04 → M05 → M06 → M07 (M04 first; keystone) |
| Track 3 | 4 | M12, M14, M13, M15 (before Track 2 — M14's registry feeds M06/M09 labs) |
| Track 2 | 4 | M08, M09, M10, M11 |
| Track 4 | 3 | M16 → M17 (17 needs 16's chain) → M18 |
| Track 5 | 3 | M19, M20, M21 |
| The Quarter | 2 | Run it yourself twice; patch labs |
| MS1–MS3 | 1 | Funnel modules |
| **Total** | **30–32** | |

Roughly double the Track 9 estimate. That's the honest price of the standalone course, and worth knowing before session 1.

---

## 14. Open decisions

1. **Fixture repo ownership** — canonical repos shared with the 10x Toolkit, or a fork. Decide before the prototype. Recommendation: canonical, `platform-fixture/` as an additive overlay.
2. **Third engine.** Q Developer appears in the 76-Day Mandate. Include it in M13 or keep this course two-engine? Two is cheaper and loses little.
3. **Course length.** 22 modules and ~31 sessions. If that's too much, cut M07 and M13 first (both are real but the least load-bearing), taking it to 20 and ~28 sessions. Do not cut M05, M09, M11 or M17 — those are the modules that justify the course existing separately.
4. **Capstone delivery.** The Quarter as an in-browser simulation (expensive to build, better experience, consistent with your other simulation work) or a guided repo exercise (cheaper, more realistic). Recommendation: guided repo exercise for v1, simulate later if the course lands.
5. **Title.** "Many Bolts, One Codebase" is strong but opaque out of context. If discoverability matters more than character, "AI-DLC at Platform Scale" is duller and clearer. Subtitle can carry whichever one the title doesn't.
