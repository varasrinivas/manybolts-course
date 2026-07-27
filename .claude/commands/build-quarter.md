---
description: Build the six-round capstone harness for The Quarter
---

# /build-quarter

Build `platform-fixture/quarter/` — the M21 capstone. Blueprint §7.

## Rounds
| # | Event | Modules under test |
|---|---|---|
| 1 | Baseline: three mobs start parallel bolts | M03, M14 |
| 2 | Clinical SME on two weeks' leave | M04, M05 |
| 3 | A fourth mob onboards mid-quarter | M12, M15, M19 |
| 4 | Sev-2, cause unclear, code six weeks old | M17, M16 |
| 5 | Compliance requests evidence for a threshold change | M16, M07 |
| 6 | Exec asks which mob is performing best | M18, M20 |

## Each round needs
- A brief (what the learner sees), an event card (fires mid-round), the state delta it applies to the repos, and a scoring hook.

## Scoring — eight dimensions
bolts landed · validator queue time · contract breakages · steering drift events · flag debt · evidence completeness · security queue depth · cross-repo contract breakage

**The rubric must make a fast-but-sloppy run lose to a slower clean one**, and must be visible to the learner from round 1. Discovering the scoring at the end is a different, worse lesson than playing against it from the start.

## Delivery
Guided repo exercise for v1 — scripts, briefs, and a scoring sheet. Not an in-browser simulation (open decision #4). Build `time-round.sh` to capture the metrics automatically; a learner hand-tallying eight dimensions across six rounds will stop at round three.

## Verify
Run all six rounds end to end yourself. Confirm each event actually changes what the right move is — an event that doesn't alter the decision is decoration, and should be cut or rewritten.
