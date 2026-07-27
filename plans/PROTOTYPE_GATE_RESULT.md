# Prototype gate — result

Run 2026-07-26, against the built fixture, after the course had already been authored.
Rounds 1 and 2 played as platform lead with **no governance in place**: no tier table,
no unit-of-work registry, no Intent Sync, no merge queue, no contract tests, no drift
report. Three mobs landed work when they were ready.

The gate's own instruction is not to argue for the course. What follows is what happened.

---

## What the ungoverned run produced

### Round 1 — three mobs start parallel bolts

| Observation | Evidence |
|---|---|
| Two merge conflicts, both on the same file | `AuthStatus.java`, resolved once by Appeals→Gate and again by Gate→Portal |
| Every build green after every landing | 3 of 3 `mvn verify` green |
| Duplicate schema version landed and nothing complained | `V47__add_appeal_states.sql` and `V47__criteria_threshold.sql` coexist on trunk |
| The shared enum became semantically incoherent | `AUTO_APPROVED` beside `AUTO_APPROVED_CRITERIA`; `IN_REVIEW` beside `PENDING_REVIEW`. Ten values, three vocabularies, no reviewer of the whole |
| Signals available to the platform lead | none. No red build, no failing test, no warning |

### Round 2 — the clinical SME is on two weeks' leave

| Observation | Evidence |
|---|---|
| Nothing blocked a clinical change from landing unreviewed | no CODEOWNERS entry for the library (PD-8), no tier table saying it is Tier 3 |
| The change landed and the build stayed green | `mvn verify` green after `UOW-47` |
| The two consumers diverged | api resolves `clinical-rules` 2.8.0, portal resolves 2.3.0 |
| The divergence produced no test failure anywhere | `npm test` green in the portal, api suite green |
| The user-visible effect was real | provider sees "Recent imaging (within 90 days)…", nurse queue shows `IMAGING_PRIOR` for the same request |

---

## The four answers

**1. Does PD-9 actually surface, or does the learner not notice and move on?**

It does not surface on its own. In the ungoverned run it produced zero red builds, zero
failing tests and no alarm. It is visible only by doing something nobody would think to
do — comparing what the portal renders against what the api returned for the same
request — or by reading `evidence/TICKET-4471-queue-reasons.md`, which a nurse filed
weeks later.

So: **it needs the symptom, and the symptom is now planted.** The ticket and
`scripts/reason-parity.mjs` are what make the defect findable. Without them a learner
would finish rounds 1–2 believing the platform was healthy, which teaches nothing.

**2. Does PD-8 produce a genuine decision point, or just friction?**

A decision point, and a sharper one than expected. With the SME away, the question is
not "who reviews this" but "may this land at all". Nothing in the repository answers it:
no owner, no tier, no reviewer. The lead has to choose between blocking a mob for two
weeks, landing a clinical change unreviewed, or finding a substitute reviewer with no
basis for saying they are qualified. All three options are defensible and all three have
a cost. That is a decision, not friction.

**3. Is round 2 meaningfully harder than a two-mob collision, or the same lesson with
more repos?**

Harder, and different in kind. A two-mob collision is a *code* problem with a visible
signal — a conflict, a red build, something to resolve. Round 2's damage is entirely
invisible: a clinical change reaching half of production, unreviewed, with everything
green. The lesson is not "coordinate harder", it is "your controls do not exist and
nothing will tell you". That is not the collision lesson at higher volume.

**4. Could rounds 1–2 have been taught with one repo?**

**Largely yes.** This is the uncomfortable answer and it should be recorded plainly.

Everything that *bit* in round 1 was inside `priorauth-api`: both conflicts, the
duplicate migration, the incoherent enum. A single-repo fixture teaches all of it.
Round 2's ownership vacuum could also be staged in one repo with an unowned package —
the lesson is "no owner, no reviewer, no gate", and nothing about it requires a separate
artifact.

The one thing that genuinely needs a second consumer is the version-pin divergence, and
in an ungoverned run it makes no noise at all. So in rounds 1–2 the third repo carries
exactly one lesson, and that lesson is silent unless the fixture hands the learner a
support ticket.

Where the third repo does earn its cost is later: M09 (the boundary argument), M11
(a legacy service three mobs must touch), M15 (an unowned module's design as a readout
of the org chart), and round 4, where the version divergence becomes an incident.

### What follows from answer 4

The gate says a yes here means the third repo is not earning its build cost and the
correct move is the nine-module Track 9 inside Sprint Teams. Taken at face value, that
verdict applies to **rounds 1–2**, not to the whole course — but it does mean the
opening of the simulation is not evidence for the platform framing, and the course
should stop implying otherwise.

Three options, stated without preference:

1. **Move a multi-repo bite into round 2.** Have the round-2 brief require the lead to
   confirm the criteria change reached both consumers. The divergence becomes a decision
   point instead of silence, and the third repo earns its place in round 2.
2. **Accept that the third repo is load-bearing from round 4 onward**, and say so in M00
   and M21 rather than presenting three repos as necessary from the start.
3. **Take the gate literally** and cut back to a single-repo simulation for rounds 1–2,
   keeping the third repo for the modules that need it.

Option 1 is the cheapest change and the only one that makes the gate's answer come out
differently. Option 2 costs nothing but a paragraph of honesty. Option 3 discards work
that is already built and verified.

### What was done, 2026-07-26

**Options 1 and 2 were taken. Option 3 was not.**

Option 1 — `quarter/round-2.md` now carries a second decision: confirm the criteria
change reached every consumer, naming each consumer, the version it resolves, and how
you checked. The scoring note says plainly that closing the round without checking
zeroes the cross-repo dimension for the rest of the quarter. Round 2's modules under
test are now M04, M05 **and M09**, in the brief, the event deck and M21.

Option 2 — M00 and M02 now say where the third repository does and does not matter: that
nothing about it hurts in the first two rounds, that the damage in those rounds is real
and entirely silent, and that it starts costing visibly in M09, M11, M15 and round 4.
M21's graded moment for round 2 was rewritten to match.

What this does not do is change the answer to question 4 for a learner who plays rounds
1–2 with the governance already in place. It makes the third repository *findable* in
round 2 rather than silent. It does not make it *necessary* there. Anyone rebuilding
this fixture from scratch should still read question 4 as a real constraint on scope.

### One thing this gate cannot tell us

It was run after the course was authored, not before. That inverts its purpose: a gate
that cannot stop the build is a review. Had it run first, answer 4 would have been
available before twenty-odd sessions of authoring, which is exactly what the blueprint
designed it to prevent.
