---
description: Build and run the minimum three-mob simulation before committing to the module list
---

# /prototype-gate

**Run this before authoring anything.** Two sessions. Its job is to tell you whether the standalone course is justified — and to say no if it isn't.

## Session P1 — minimum viable simulation

Build only:
- Three repos: `priorauth-api`, `priorauth-web`, `priorauth-clinical-rules`
- Three intents: Appeals, Gate, Portal (blueprint §7)
- **PD-8** — `priorauth-clinical-rules` has no CODEOWNERS entry
- **PD-9** — Portal pins an old `clinical-rules` version; Gate's change silently no-ops
- **PD-12** — 4,000-line untested `EligibilityService` touched by all three mobs
- Rounds 1 and 2 of The Quarter only (baseline, then SME goes on leave)

Nothing else. No player, no modules, no other defects.

## Session P2 — play it, ungoverned

The author plays platform lead with no governance in place. Record what actually happens: what broke, what went unnoticed, where time went.

## The gate — answer honestly, in writing

1. Does **PD-9** actually surface, or does the learner not notice and move on? If unnoticed, it needs a symptom — a failing consumer test, a metric, a support ticket in the fixture. A defect nobody notices teaches nothing.
2. Does **PD-8** produce a genuine *decision point* (who should own this?) or just friction?
3. Is round 2 meaningfully harder than the two-mob Track 9 collision, or the same lesson with more repos?
4. **Could rounds 1–2 have been taught with one repo?**

## What to do with the answer

Question 4 is the gate. If the answer is yes, the third repo is not earning its build cost, and the correct move is to go back to the nine-module Track 9 inside Sprint Teams — roughly twenty sessions saved.

Report the four answers plainly. Do not argue for the course. The author needs a real answer here more than an encouraging one.
