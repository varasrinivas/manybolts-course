# The Quarter — retrospective

**Score: 72 / 100.** Played with the six M19 prerequisites in place — tier table,
registry, canonical steering, merge-queue policy, one encoded golden path, fitness
functions — which is the run a learner should make *after* the course rather than before.

| Dimension | Score | |
|---|---|---|
| Bolts landed | 11 / 15 | Round 2 deliberately shipped nothing |
| Validator queue time | 13 / 15 | Tier 3 held for two weeks by choice |
| Contract breakages | 10 / 10 | Boundary contract agreed before anyone built |
| **Cross-repo contract breakage** | **6 / 10** | The divergence was found, months late |
| Steering drift events | 9 / 10 | One stale instruction file left in place |
| Flag debt | 8 / 10 | The version pin is an undeclared flag and it survived the quarter |
| **Evidence completeness** | **8 / 20** | Two of five auditor questions answerable |
| Security queue depth | 7 / 10 | Gate held; the transitive advisory was caught |

## The two lowest, traced

**Evidence completeness — 8 of 20.** The practice that was missing is M16's: a provenance
record that names the validator, the tier at review, and the gates that ran. We had v1,
which records who merged. That single field cost 14 minutes in the middle of a Sev-2 and
two unanswerable audit questions six weeks later. v2 was designed during round 5 and did
not land inside the quarter, so it scores nothing — correctly. Evidence cannot be earned
retroactively, which is exactly what the rubric's 20 points are there to teach.

**Cross-repo contract breakage — 6 of 10.** The practice was M09's: a consumer-driven
contract test asserting on evaluation *outcomes*, plus a version-drift report. Both were
built in round 2 and both work. The score is 6 because they were built in response to
finding a divergence that had been live for months. Detection after the fact is worth
something; it is not worth what prevention would have been worth.

## The three questions

**1. Which round went worst, and was it a missing artifact or a decision under
pressure?** Round 5, and it was a missing artifact. Nothing about round 5 is hard if the
records exist. Every minute of it was spent discovering that they did not.

**2. What did I do in round 1 or 2 that I paid for in round 4 or 5?** Round 2's decision
to hold the Tier 3 change was right, and I did not go back and ask the same question of
work that had *already* landed. UOW-49 was sitting on trunk, tiered as service-internal,
reading the threshold constant. The tier table existed; nothing applied it retroactively
to the previous quarter's changes. That is what became the Sev-2.

**3. Which single practice, in place on day one, would have changed the most rounds?**
The provenance chain with validator identity. It touches round 4 (14 minutes of an
incident), round 5 (two of five questions), and round 6 (the cost argument rests on being
able to say what review actually costs). It is also the least glamorous item on the M19
prerequisite list, and the one I would have deferred if the rubric had not priced it at
20 points.

## What the run says about the course

Two things, one of each kind.

The Intent Sync in round 1 is the clearest single demonstration in the fixture. Ninety
minutes of one question — which aggregates will you touch — turned two merge conflicts, a
duplicate migration version and an incoherent shared enum into three clean landings. The
ungoverned run during the prototype gate produced all three problems; the governed run
produced none. Nothing else in the quarter has that signal-to-effort ratio.

And an event that did less work than it should: **round 3**. Onboarding a fourth mob is
real, but with canonical steering and a registry already in place the correct moves are
mechanical — generate their steering, add their rows, point them at the tier table — and
nothing in the round forces a judgement I had not already made in rounds 1 and 2. It
tests whether artifacts exist rather than whether the lead can think. If a round were to
be cut or rewritten, it is that one; the fix is probably to have the fourth mob arrive
with a deadline and a strong opinion, so that the lead has to decide what to refuse.
