# The Quarter — scoring rubric

Visible from round 1. That is deliberate.

| Dimension | Points | Scored on |
|---|---|---|
| Bolts landed | 15 | Units of work landed on trunk across all three mobs |
| Validator queue time | 15 | Mean hours a ready bolt waits, by tier |
| Contract breakages | 10 | In-repo contract failures reaching trunk |
| Cross-repo contract breakage | 10 | A consumer silently not receiving a change |
| Steering drift events | 10 | Root invariants weakened or omitted below root |
| Flag debt | 10 | Live flags past expiry, weighted by age |
| **Evidence completeness** | **20** | Landed units of work with every required provenance field, none inferred |
| Security queue depth | 10 | Dependency and PHI-path reviews outstanding at round end |

**A fast run that fails round 5 scores below a slower run that keeps its evidence.**
Bolts landed is worth 15 of 100. Evidence completeness is worth 20.

## Scoring a dimension

| Band | Points of the dimension's maximum |
|---|---|
| Handled, with evidence | 100% |
| Handled, evidence partial | 60% |
| Noticed, not addressed | 30% |
| Missed | 0% |

Score each round, then total. Record the two lowest dimensions — the retrospective
is about those, not about the total.
