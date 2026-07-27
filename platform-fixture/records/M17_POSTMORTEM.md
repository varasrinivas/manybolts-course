# Postmortem — determinations auto-approving below the clinical bar

**Severity:** 2 · **Detected:** 02:40 by clinical operations · **Mitigated:** 03:11
**Author:** platform lead · **Round:** 4

## What members experienced

For six weeks, requests that met the weighted criteria score but failed a *required*
criterion were auto-approved instead of going to nurse review. The specific case: a
provider had not attested that documentation on file was current — a required rule worth
0.10 of the score. Confidence lands at 0.90, above the 0.85 threshold, and the request
was approved without a clinician ever seeing it.

Nobody was harmed by an approval. That is luck, not control: the same path would have
approved anything scoring above the threshold with any required rule unmet.

## Timeline

| Time | What happened |
|---|---|
| 6 weeks ago | UOW-49 landed: "read the threshold once rather than calling back into the library for every branch. Behaviour is unchanged." |
| 02:40 | Clinical operations reports auto-approval volume up ~40% since mid-month |
| 02:44 | Provenance query: four units of work landed in the window touching the decision path |
| 02:51 | UOW-49 identified as the only one that changed `DeterminationService.decide` |
| 03:05 | **Blocked for 14 minutes** on "who validated this?" — the record names an approver, not a validator, and the tier is recorded as 1 |
| 03:11 | Mitigated: criteria path forced to nurse review. Wrong outcomes stop |
| 03:29 | Mechanism confirmed by reading the diff: `evaluation.autoApprovable()` replaced with a bare confidence comparison, dropping `allRequiredMet` |

## Cause

`CriteriaEvaluation.autoApprovable()` is two conditions: all required rules met **and**
confidence at or above the threshold. UOW-49 replaced the call with the second condition
only. The comment says behaviour is unchanged, and the author believed it — the two agree
on every input where required rules are met, which is most traffic and all of the tests.

## Why nothing caught it

| Control | Why it did not fire |
|---|---|
| Tests | No test covered a high-confidence request with a required rule unmet. The library has one now (`missingAttestationBlocksAutoApprovalDespiteHighConfidence`); the service did not |
| Tiering | The change was recorded as Tier 1, service-internal. It reads the threshold constant, which the tier table makes Tier 3 |
| Review | The diff is six lines and looks like a refactor. A reviewer without the tier signal has no reason to look harder |
| Provenance | Recorded who merged it, not who judged it safe |

## Systemic cause

**Tier misassignment (M04).** A change that reads `AUTO_APPROVE_THRESHOLD` was classified
as service-internal. The tier table already says that is Tier 3; nothing enforced the
table at merge time, so the classification was a person's guess under time pressure.

Not "the agent wrote it". The generated change did what it was asked and said what it
believed. The control that should have caught it was a tier assignment nobody checked.

## Fixes

| Fix | Owner | Status |
|---|---|---|
| Fitness function: any change touching a file that reads `Thresholds` or `ClinicalCriteria` is Tier 3, enforced at merge | architecture guardian | landed this week |
| Service-level test for the high-confidence, required-unmet case | Gate mob | landed with the fix |
| Provenance v2 with validator identity and qualification, so this question takes seconds | platform | in flight (round 5) |
| Re-review every Tier-1 change from the last quarter that touches the decision path | platform + SME | 3 found, 1 needed re-tiering |

## What this cost

31 minutes to mitigate, of which **14 were spent on a question the provenance record
should have answered instantly**. That number is the business case for v2, and it is the
number to quote when someone asks why evidence work is worth doing.

No individual is named in this document, deliberately. The engineer who wrote UOW-49 was
working from a tier assignment the platform gave them.
