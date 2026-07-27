# PROGRESS — Many Bolts, One Codebase

Update after every session, before `/clear`.

> **State, in one line:** all 22 modules are authored and validated, `platform-fixture/` is built with all twelve planted defects verified, and the prototype gate has been run — see `plans/PROTOTYPE_GATE_RESULT.md`, whose answer to question 4 is uncomfortable and unresolved. The labs are runnable end to end; `./scripts/verify-fixture.sh` reports GREEN.

## Phase 0 — Prototype gate  ✅ run 2026-07-26 — full result in `plans/PROTOTYPE_GATE_RESULT.md`

| Item | Status |
|---|---|
| P1: three repos + PD-8, PD-9, PD-12, rounds 1–2 | ☑ (the full fixture supersedes the minimum) |
| P2: play it ungoverned, record what broke | ☑ rounds 1 and 2 played with no tier table, registry, Intent Sync, merge queue or contract tests |
| Gate Q1 — does PD-9 surface? | ☑ **no, not on its own.** Zero red builds, zero failing tests, no alarm. Findable only via the planted ticket or by comparing portal output against the api response |
| Gate Q2 — does PD-8 produce a decision point? | ☑ **yes.** With the SME away the question becomes "may this land at all", and nothing in the repo answers it: block a mob for two weeks, land a clinical change unreviewed, or appoint a reviewer with no basis |
| Gate Q3 — is round 2 harder than the two-mob collision? | ☑ **yes, and different in kind.** A collision has a signal; round 2's damage is a clinical change reaching half of production with everything green |
| **Gate Q4 — could rounds 1–2 have been taught with one repo?** | ⚠️ **largely yes.** Everything that bit in round 1 was inside `priorauth-api` — both conflicts, the duplicate migration, the incoherent enum. Round 2's ownership vacuum could be staged in one repo too. The third repo carries exactly one lesson in rounds 1–2 (the version-pin divergence) and that lesson is silent |

> **What the answer to Q4 means.** Taken literally the gate says the third repo is not
> earning its cost — for **rounds 1–2**. It does earn it in M09, M11, M15 and round 4.
> The honest consequence is that the opening of the simulation is not evidence for the
> platform framing, and the course should stop implying it is. Three options are set out
> in the gate result. **Options 1 and 2 have been taken:** round 2 now requires the lead
> to confirm the criteria change reached every consumer (brief, event deck and M21
> updated, M09 added to the round's modules), and M00 and M02 state plainly that the
> third repository does not hurt in the first two rounds and starts costing in M09, M11,
> M15 and round 4. Option 3 — cutting back to one repo for rounds 1–2 — was not taken.
>
> **And the honest note about the gate itself:** it ran after the course was authored,
> which inverts its purpose. A gate that cannot stop the build is a review.

## Phase 1 — Fixture  ✅ built and verified

| Item | Status |
|---|---|
| Three repos scaffolded (`repos/`, git-initialised by `setup.sh`) | ☑ |
| PD-1 … PD-12 planted and spot-checked | ☑ — placements in `.solutions/PLANTED_DEFECTS.md` |
| Pairwise collision verified | ☑ — each round-1 patch applies alone; all six ordered pairs collide |
| PD-6 is intermittent (concurrency-dependent) | ☑ — 4, 10 and 11 failures per 20 real `mvn verify` runs; 0 of 20 once fixed. **Spec changed:** a race cannot hold a fixed rate, so the fixture asserts intermittency (never 0, never 20) rather than the blueprint's 2–6 band |
| PD-9 has a discoverable symptom | ☑ — `node scripts/reason-parity.mjs` exits 1; `evidence/TICKET-4471-queue-reasons.md` |
| `verify-fixture.sh` / `reset-quarter.sh` verified twice | ☑ — reset is clean twice from a dirty tree |
| The Quarter: six rounds + event deck + rubric | ☑ — `quarter/` with per-round briefs, `EVENT_DECK.md`, `RUBRIC.md`, `SCORING_SHEET.md` |

**What is in it.** 372 files. `repos/priorauth-api` (21 Java files, Maven layout, Flyway
migrations), `repos/priorauth-clinical-rules` (criteria model, evaluator, threshold constant,
its own tests), `repos/priorauth-web` (portal and queue components, vendored clinical-rules
packages at 2.3.0 and 2.8.0, a JVM design-token module). Plus `intents/`, `branches/`
(five patches), `governance/` (canonical steering, three mob files, tier and registry
templates, the SME comments), `evidence/` (v1 schema, provenance records, auditor questions,
the nurse's ticket), `pipeline/` (CI config, timings, offline advisory database, SBOMs),
`quarter/`, `records/`, `scripts/`, and `.solutions/`.

**Maven-verified.** `mvn verify` was run against both Java repos with Maven 3.9.16 and
JDK 21. `clinical-rules` runs 4 unit tests green; `priorauth-api` runs `DeterminationServiceIT`
under failsafe. `verify-fixture.sh` takes the Maven path when Maven is present and the
`javac` path when it is not, and both report GREEN.

Running Maven exposed three things `javac` could not, all now fixed:

| Found by running Maven | Fix |
|---|---|
| **Surefire ran zero tests in the api repo.** `DeterminationServiceIT` matches none of surefire's default includes and no failsafe plugin was bound, so `./mvnw verify` was green while testing nothing — in a course whose labs say to run exactly that | Failsafe bound to `integration-test`/`verify` with `**/*IT.java`, plus the `it` and `contract` profiles the fixture's CI config already referenced |
| **PD-6 did not flake under the real runner.** The 5-second audit-window mechanism only fired when something slow sat between receipt and decision; the integration test takes 74 ms, so the rate was ~1%. The 2–6 in 20 I had measured came from a probe that padded the gap artificially — the probe was not faithful to the test | PD-6 rebuilt as a concurrency race: the service holds the current request's audit window in a field, intake decides eight requests in parallel, and one request's window lands on another's determination. **0 of 20 after the intended service-side fix**, so the lab is completable. `flake-check.sh` runs the identical assertion |
| ArchUnit and JUnit resolve from Central on first build; the meridiancare artifacts resolve from `pipeline/local-m2` | Confirmed working: a student-written ArchUnit rule fails on PD-5 with `was violated (1 times)` |

**Student run — the labs were executed, not just inspected.** Ten defects found and
fixed in the fixture as a result:

| # | What broke for the student | Fix |
|---|---|---|
| 1 | M00's prerequisite check `./mvnw -v` and the `./mvnw verify` in four labs — no wrapper existed in any repo | `mvnw` / `mvnw.cmd` in both Java repos: uses Maven when present, otherwise says what to install and points at the offline path |
| 2 | M09's centrepiece was fiction — the api asked for clinical-rules 2.7.0 and no 2.7 artifact existed anywhere | `pipeline/local-m2/` ships 2.7.0 (bare codes) and 2.8.0 (sentences) plus the tokens jar; both poms declare it as a repository. The bump now changes observable behaviour |
| 3 | M06's first artifact, the ArchUnit rule, had nothing to compile against | ArchUnit added to both poms, plus `scripts/arch-check.sh` — a zero-dependency layer checker that fails on PD-5 offline |
| 4 | M15's lab was impossible: one commit, one author | Histories rebuilt — 19/8/7 commits across seven mob-attributed authors over a quarter. `clinical-rules` shows six authors and no owner, which is PD-8's fingerprint in the history |
| 5 | M03 said to read `.github/workflows/`; no such directory existed | `verify.yml` added to all three repos, mirroring `pipeline/bloated-suite/ci.yaml` |
| 6 | M12 promised repo-level steering files to inventory; only mob files existed | `CLAUDE.md` in each repo plus a generated `copilot-instructions.md` — the estate is now nine files including the stale copy |
| 7 | M02 Path B's `npm ls @meridiancare/clinical-rules` printed `(empty)` | `package.json` now declares the vendored package as a `file:` dependency; `npm install --offline` works and `npm ls` shows `2.3.0 -> ./vendor/clinical-rules-2.3.0` |
| 8 | M17's suspect change had no provenance record at all, so PD-7's missing-validator lesson could not bite | Round-4 units of work added to `provenance-records.jsonl`, including UOW-49 with an approver and no validator |
| 9 | M14's third overlap was undiscoverable from the intents alone | The lab now points at `branches/`, where `portal-r1.patch` makes the enum change undeniable |
| 10 | Two branch patches stopped applying after the pom changes | Regenerated against current trunk; all five verified again |

**Verified behaviours** (each run, not asserted):

| Check | Result |
|---|---|
| All Java compiles across the three repos | 29 files, clean |
| PD-5 bites | the clinical library alone fails to compile: `package com.meridiancare.web.tokens does not exist` |
| PD-1 end to end | appeals lands, gate conflicts on the enum, learner resolves, two `V47__` migrations coexist |
| PD-6 rate | **4, 10, 11 failures per 20 `mvn verify` runs** across two Maven installs; **0 of 20** once the window is made a local. A pool-size sweep returned 4–18, twice, on one machine — the rate is not stable and cannot be made stable |
| PD-9 symptom | queue renders `IMAGING_PRIOR`, api returns the sentence; parity script exits 1 |
| PD-10 gate | `cve-scan.mjs` finds CVE-2022-42889 transitively via `retry-toolkit`, exits 1; baseline SBOM clean |
| Round-4 break | after `break-round4.sh`, confidence 0.90 with a required rule unmet auto-approves; on trunk the same request goes to review |
| Reset | clean twice from a dirty tree |
| M11 characterization | 17 behaviours pinned by a real run: COBRA day 61 ELIGIBLE and day 62 PENDING, the anniversary window returning PENDING, and the deprecated batch path disagreeing with the main one (ELIGIBLE vs INELIGIBLE) |
| M09 version bump | api built against 2.7.0 returns `[IMAGING_PRIOR]`; against 2.8.0 returns the sentence; web stays on 2.3.0 |
| M06 layer rule | real ArchUnit fails on PD-5 (`was violated (1 times)`); `arch-check.sh` gives the same answer offline with file and line |
| Maven builds | `clinical-rules` 4 tests green; api `DeterminationServiceIT` runs under failsafe; both `package` clean |
| M15 org inference | `git shortlog -sne` clusters by mob; `clinical-rules` has six authors and no dominant owner |

## Phase 2 — Modules  ✅ 22/22 built and validated

Plan column is `n/a`: modules were authored directly from blueprint §5/§6/§9 in one session rather than via `/plan-module`, so `plans/modules/` is empty. The per-module specs are the one artifact of the documented loop that is missing.

### Track 0 — Orientation & the scaling problem
| ID | Title | Plan | Build | Lab | Validate |
|-----|---|---|---|---|---|
| M00 | Orientation: platform, fixture, how to use this course | n/a | ☑ | no lab | ☑ |
| M01 | AI-DLC in one sitting, for people who've already run one | n/a | ☑ | ☑ PD-NONE | ☑ |
| M02 | The Prior Auth platform: three services, five mobs, one trunk | n/a | ☑ | ☑ PD-8 | ☑ |
| M03 | Where the method stops (all three contention classes) | n/a | ☑ | ☑ PD-4, PD-8 | ☑ |

### Track 1 — The validation economy
| ID | Title | Plan | Build | Lab | Validate |
|-----|---|---|---|---|---|
| M04 | The validation bottleneck under load ★keystone | n/a | ☑ | ☑ PD-2 | ☑ |
| M05 | Platform teams as validator-capacity multipliers · honest-limit | n/a | ☑ | ☑ PD-8 | ☑ |
| M06 | Constraint-time architecture governance | n/a | ☑ | ☑ PD-3, PD-5 | ☑ |
| M07 | Security review at generation volume | n/a | ☑ | ☑ PD-10 | ☑ |

### Track 3 — Coordination artifacts  (built before Track 2)
| ID | Title | Plan | Build | Lab | Validate |
|-----|---|---|---|---|---|
| M12 | Governing shared steering artifacts | n/a | ☑ | ☑ PD-11, PD-3 | ☑ |
| M14 | Cross-mob intent decomposition and Intent Sync | n/a | ☑ | ☑ PD-4 | ☑ |
| M13 | Mixed-engine estates · ENGINE-COMPARATIVE | n/a | ☑ | ☑ PD-11 | ☑ |
| M15 | Conway's law at agent speed | n/a | ☑ | ☑ PD-8 | ☑ |

### Track 2 — Trunk & integration mechanics
| ID | Title | Plan | Build | Lab | Validate |
|-----|---|---|---|---|---|
| M08 | Trunk mechanics for concurrent bolts | n/a | ☑ | ☑ PD-1 | ☑ |
| M09 | Multi-repo, monorepo, context boundary · honest-limit | n/a | ☑ | ☑ PD-9 | ☑ |
| M10 | Shared CI, test volume, and environment contention | n/a | ☑ | ☑ PD-6 | ☑ |
| M11 | Brownfield at scale · honest-limit | n/a | ☑ | ☑ PD-12 | ☑ |

### Track 4 — Operating the platform
| ID | Title | Plan | Build | Lab | Validate |
|-----|---|---|---|---|---|
| M16 | Release coordination and audit evidence | n/a | ☑ | ☑ PD-7 | ☑ |
| M17 | Incident response for cold code · honest-limit | n/a | ☑ | ☑ PD-7 | ☑ |
| M18 | Portfolio metrics, cost governance, comparison trap | n/a | ☑ | ☑ PD-9, PD-10 | ☑ |

### Track 5 — Rolling it out
| ID | Title | Plan | Build | Lab | Validate |
|-----|---|---|---|---|---|
| M19 | The second-team cliff · honest-limit | n/a | ☑ | ☑ PD-NONE | ☑ |
| M20 | Making the case · honest-limit · no team identifiers | n/a | ☑ | ☑ PD-NONE | ☑ |
| M21 | Capstone: The Quarter · ENGINE-AGNOSTIC | n/a | ☑ | ☑ six PDs | ☑ |

**Validator state:** `tools/validate.py` PASS (22/22 modules, 63 visuals defined = 63 referenced, no hex literals, no browser storage). `tools/validate-manybolts.ps1 -All` PASS with **zero warnings** — rules 1–8, including honest-limit sections present in exactly M05, M09, M11, M17, M19, M20, and no per-team identifiers in M18 or M20.

**Browser-verified:** all 22 modules render with no console errors; every `data-viz` placeholder resolves; five interactive visuals work (M01 assumption toggle, M04 queue curve, M05 break-even model, M09 PD-9 step-through, M17 claim picker); lab tabs switch; no horizontal page overflow at 390px or 1024px in any audience filter.

**Student-path validated** (taken cold in reading order, then again per audience filter). Seventeen defects found and fixed:

| # | Defect | Fix |
|---|---|---|
| 1 | M00 cloned three repos then `cd platform-fixture`, a directory nothing created — the first gate was impossible | Setup now clones `platform-fixture` and runs `scripts/setup.sh`, which pulls the three services into `repos/`. **This fixes the fixture layout that `/build-fixture` must now match** |
| 2 | No tooling prerequisites anywhere; labs need JDK+Maven, Node+npm, git, an engine, and M13 needs two | M00 has a "What you need" table with commands to check each |
| 3 | M00 repeated the blueprint's "16–20 hours"; the modules' own timings total ~25 h + capstone | M00 states ~25 h plus a 2–3 hour capstone |
| 4 | M04's "12 arrivals vs 10 slots" implied every bolt reaches the SME, contradicting its own 13% Tier 3 share one screen later | The figure is now explicitly the *untiered* platform, followed by the post-tiering residual: 1.6 changes and 1.2 hours against 8, then the three reasons that number does not stay there |
| 5 | M04 body said tiering removes 60–75%; M04's visual said 87% | Body states 87% for this platform, 60–75% as a planning figure until measured |
| 6 | M04 visual labelled 9 h as "Tier 3 demand" | Relabelled as demand before tiering |
| 7 | M18 costed 0.75 validator hours per landed bolt, ignoring tiering | Now per Tier 3 bolt, with ~0.1 h averaged across everything landed |
| 8–13 | Six labs promised artifacts carried forward (M02's map, M03's inventory) that no later lab ever asked for | M03, M04, M06, M09, M10 and M21 now open the earlier record and use it |
| 14–15 | M11 and M13 labs leaned on the M14 registry, which comes later in reading order | Both point at `registry/UOW_REGISTRY.template.md` and name M14 as where the discipline is argued |
| 16 | M13's gate was unreachable with one engine | Added a single-engine path: steering loaded vs withheld, same four headings, with the honest note that it is not engine dialect |
| 17 | M17 dropped the learner into round-4 state without saying rounds 1–3 could be skipped | The lab states `break-round4.sh` fast-forwards the fixture |

**Audience filter completed** (blueprint §10, previously unbuilt). Eleven `crossCard` summaries: leader views of M06–M11, M13, M17, and builder views of M18–M20 — 195–276 words each, carrying the decision and the numbers, with a "read the full module for" line. Every module is now reachable in every filter; the player renders the summary instead of body-and-lab, flags it in the nav, and the full module is one filter switch away. Before this, a leader met M19's six-item prerequisite checklist with four entries pointing at modules they could not open.

**Glossary reachable.** It was a markdown file the player never linked — 75 terms a student could not see. `tools/sync_glossary.py` inlines `course/glossary.md` between `GLOSSARY:START/END` markers (the player is opened as a local file, so it cannot fetch at runtime) and `--check` fails when the two drift. It renders as a Reference entry at the end of the nav.

## Phase 3 — Close out

| Item | Status |
|---|---|
| Run The Quarter yourself, end to end | ☑ played 2026-07-27, scored 72/100 — artifacts in `platform-fixture/records/` |
| Patch labs found ambiguous during the run | ☑ three fixture defects fixed during the run (below); one round flagged as weak |
| `mvn -o verify` in an environment with Maven | ☑ done — Maven 3.9.16, JDK 21 |
| MS1–MS3 funnel modules in the conceptual course | ☐ |
| Per-module specs in `plans/modules/` (retro-fit if wanted) | ☐ |
| Human editorial pass for voice and repetition across tracks | ☐ recommended |

## Open decisions

| # | Decision | Resolved |
|---|---|---|
| 1 | Fixture repos: canonical (shared) or fork | ☑ **self-contained.** The three repos live in `platform-fixture/repos/` and are git-initialised by `setup.sh`; `MERIDIAN_REMOTE` clones them from a host instead if you later publish them separately |
| 2 | Third engine (Q Developer) in M13, or two-engine only | ☑ **two engines.** M13 states this as a scoping decision and explains why a third adds a column, not a lesson |
| 3 | Course length: 22 modules, or cut M07 + M13 to 20 | ☑ **22 kept.** Both were authored; either can still be cut without breaking a dependency |
| 4 | Capstone: guided repo exercise (v1) or in-browser sim | ☑ **guided repo exercise.** M21 is written against scripts, briefs and a scoring sheet |
| 5 | Title: "Many Bolts, One Codebase" or "AI-DLC at Platform Scale" | ☑ **kept as-is**, per the blueprint's own preference |

## Session log

| Date | Session | Outcome |
|---|---|---|
| 2026-07-25 | Full authoring pass, all 22 modules | Bodies, 63 visuals (5 interactive), and dual-path labs for M00–M21 injected via `tools/inject_module.py`; glossary extended with ~35 terms; both validators clean; browser-verified. Deviations: prototype gate and fixture skipped; `/plan-module` specs not produced; nine carried-over modules (M03, M04, M06, M08, M10, M12, M14, M16, M18) authored from blueprint §6 deltas + the glossary because `plans/COURSE_PLAN_ADDENDUM_T9_MANY_BOLTS.md` is absent from this kit. Two tool/shell fixes: `validate-manybolts.ps1` now reads UTF-8 (it was reading the glossary as ANSI and mis-reporting rule 7), and the shell's mobile media query now scrolls wide tables inside themselves. |
| 2026-07-26 | `/build-fixture` | Built `platform-fixture/` — three repos, all twelve planted defects, five branch patches, the Quarter harness, five scripts and `.solutions/`. Verified: full compile, PD-5/PD-1/PD-6/PD-9/PD-10 and the round-4 break each reproduced by running them, reset idempotent. Two module texts were corrected to match what got built: M10 now describes the audit-batch-window flake that is actually planted (the earlier local-zone description could not hit the 2–6 in 20 band), and M07/M08/M09 now say how to apply the branch patches. Maven was unavailable, so tests are written but unexecuted — see the toolchain note in Phase 1. |
| 2026-07-26 | Student run of the whole course against the fixture | Took M00–M21 in reading order and executed the labs rather than reading them: ran setup and the gate, did M11's characterization pass (17 behaviours pinned, all three promised surprises real), applied M07's bolt and scanned it, applied and collided the round-1 patches, ran the round-4 break and queried provenance, checked the steering estate, the registry overlaps and the auditor questions. Ten fixture defects found and fixed (table above); one module text updated (M14). Both course validators still clean, fixture GREEN. |
| 2026-07-26 | Maven run | Ran `mvn verify` against both Java repos now that Maven is available. Three findings, all fixed: surefire was running **zero** tests in the api repo (no failsafe binding, so `./mvnw verify` passed while testing nothing); PD-6's audit-window mechanism did **not** flake under the real runner, and the 2–6 in 20 I had reported came from a probe that padded the timing rather than from the test — PD-6 is now a concurrency race measured at 4 failures in 20 real `mvn verify` runs and 0 in 20 after the intended fix; and a student-written ArchUnit rule was confirmed to fail on PD-5. M10's text was rewritten to describe the race, and `.solutions` updated with the measured numbers. |
| 2026-07-26 | Maven at `D:\softwarespache-maven-3.9.16` | The wrapper only looked at PATH, so with Maven installed off-PATH `./mvnw` still told students Maven was missing — `mvnw`, `mvnw.cmd`, `verify-fixture.sh` and `flake-check.sh` now resolve it from `MAVEN_HOME`, `M2_HOME`, PATH, then common install roots (verified with no environment hints set). `flake-check.sh` gained a `--maven` mode that runs the real `mvn verify` loop. Re-measuring PD-6 on this install gave 10–11 of 20 against 4 of 20 on the other, and a pool-size sweep returned 4–18 twice on the same machine: **a thread race cannot be pinned to the blueprint's 2–6 band, so the spec is now intermittency (never 0, never 20)** and M10 states a range with the reason rather than a number. `/build-fixture` records the same correction for anyone rebuilding. |
| 2026-07-26 | Prototype gate (P2) | Played rounds 1 and 2 ungoverned. Q1: PD-9 does **not** surface unaided — zero red builds, zero failing tests; the planted ticket is what makes it findable. Q2: PD-8 is a real decision point, sharper than expected. Q3: round 2 is harder and different in kind. **Q4: rounds 1–2 could largely be taught with one repo** — every bite in round 1 was inside `priorauth-api`, and the one multi-repo lesson in round 2 is silent. Recorded plainly in `plans/PROTOTYPE_GATE_RESULT.md` with three options and no preference. Two further fixture defects found while playing: Maven `-o` cannot read a `file://` repository, so M09's 2.8 bump failed to build offline — added `scripts/install-artifacts.sh`, now called by `setup.sh`, which installs the fixture artifacts into `~/.m2/repository`; and the portal's `npm test` failed on trunk (no `test/` directory) — added a four-test suite, green. |
| 2026-07-26 | Acting on the gate | Took options 1 and 2 from the gate result. Round 2 gained a second decision — confirm the criteria change reached every consumer, with a scoring note that skipping it zeroes the cross-repo dimension — and M09 joined its modules under test in the brief, the event deck and M21. M00 and M02 now say where the third repository does and does not matter, which is a scoping claim the play-test supports rather than an assumption. Also fixed a formatting defect found while editing: all six round briefs had leading indentation from the generator, so markdown rendered them as code blocks; all six regenerated clean. |
| 2026-07-27 | Ran The Quarter, all six rounds | Played as platform lead **with** the six prerequisites in place. Scored **72/100**; two lowest were evidence completeness (8/20) and cross-repo breakage (6/10), each traced to the module whose practice was missing. Artifacts kept as an exemplar run: `records/UOW_REGISTRY.md`, `M21_ROUND_DECISIONS.md`, `M17_POSTMORTEM.md`, `M16_EVIDENCE.md`, `M18_BOARD_ANSWER.md`, `M21_RETRO.md`, plus six `records/quarter/round-N.json`. **Three fixture defects found and fixed:** `quarter/round4-break.patch` had gone stale when PD-6 was rebuilt, so `break-round4.sh` exited 1 and M17 plus round 4 could not start — regenerated, and the script now fails loudly instead of silently; `verify-fixture.sh` now dry-runs all five branch patches **and** the round-4 break, so this class of drift cannot go unnoticed again; and all six round briefs were regenerated after a generator indentation bug made markdown render them as code blocks. **One round flagged as weak:** round 3 tests whether artifacts exist rather than whether the lead can think — the retro proposes giving the fourth mob a deadline and an opinion so there is something to refuse. Round 1's Intent Sync is the strongest demonstration in the fixture: the same three patches produced two conflicts, a duplicate migration and an incoherent enum ungoverned, and three clean landings governed. |
