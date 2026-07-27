---
description: Build the full three-repo platform fixture with all twelve planted defects
---

# /build-fixture

Build `platform-fixture/` per blueprint §7. Run **after** `/prototype-gate` passes.

## Repos
| Repo | Role |
|---|---|
| `priorauth-api` | Spring Boot core; owns `Determination` |
| `priorauth-web` | React portal + nurse queue |
| `priorauth-clinical-rules` | Shared library, consumed by both |

If `priorauth-api` / `priorauth-web` already exist in the 10x Toolkit kit, **extend them as an additive overlay** — do not fork. See open decision #1.

## Structure
**Layout is fixed by M00's setup instructions — students are told to run exactly this:**
```bash
git clone <host>/platform-fixture && cd platform-fixture
./scripts/setup.sh          # clones the three services into repos/
./scripts/verify-fixture.sh
```

```
platform-fixture/
  README.md                     # three intents, nothing else
  repos/                        # priorauth-api, priorauth-web,
                                # priorauth-clinical-rules (cloned by setup.sh)
  intents/                      # INTENT_APPEALS.md, INTENT_GATE.md, INTENT_PORTAL.md
  branches/                     # one patch per mob per round
  registry/UOW_REGISTRY.template.md
  governance/
    VALIDATION_TIERS.template.md
    STEERING.canonical.md
    architecture-rules.prose.md
  pipeline/bloated-suite/
  evidence/
    auditor-questions.md
    PROVENANCE_SCHEMA.v1.json
  quarter/                      # six round definitions, event deck, scoring rubric
  records/                      # empty; learner artifacts land here (M01-M21 labs)
  scripts/
    setup.sh verify-fixture.sh reset-quarter.sh time-round.sh break-round4.sh
  .solutions/                   # excluded from the learner bundle
```

## Planted defects — all twelve
PD-1 duplicate `V47__` migration · PD-2 `ClinicalCriteriaEvaluator` invites Tier-1 misclassification · PD-3 `@PhiBoundary` dropped by Gate · PD-4 three overlapping UoWs · PD-5 `clinical`→`web` dependency · PD-6 **time-dependent** flake in `DeterminationServiceIT` · PD-7 provenance v1 has no validator-identity field · PD-8 `clinical-rules` unowned · PD-9 version-pin silent no-op · PD-10 transitive CVE · PD-11 two mobs' steering files disagree on error handling · PD-12 untested `EligibilityService`

**PD-6 must be time-, ordering-, or concurrency-dependent. Never a random seed** — random flakes teach the wrong debugging instinct.

If you implement PD-6 as a concurrency race, do not promise a fixed failure rate: a race moves with machine load. Assert *intermittency* instead — never zero failures in twenty, never twenty. A tunable rate is only achievable for a timing flake, and pretending otherwise is the kind of false precision this course tells people to avoid.

**PD-9 needs a symptom** the learner can eventually find. Silent forever is not a lesson.

## Verify — run these and report results
```bash
cd platform-fixture && ./scripts/verify-fixture.sh          # all three repos build
# pairwise collision: each mob's round-1 patch applies alone, any two collide
# flake: 20 runs of DeterminationServiceIT → intermittent (not 0, not 20)
# reset: run twice from a dirty tree, clean both times
```

## Constraints
- Learner-facing `README.md` describes the three intents and **nothing else**. No defect list, no hints.
- Do not fix any planted defect.
- Report each PD as placed, with file and line, so the author can spot-check.
