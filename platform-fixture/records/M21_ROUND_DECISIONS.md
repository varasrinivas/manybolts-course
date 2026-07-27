# The Quarter — response decisions

Written before acting, each round, as the rubric requires.

---

## Round 1 — baseline

**Decision.** Hold a 90-minute Intent Sync before any mob elaborates. One question only:
which aggregates and contract surfaces will your intent touch, named, not described.

**What it produced.** Three overlaps on `AuthStatus` — appeals and gate declared theirs;
portal's did not appear in its intent at all and was found by reading its in-flight
branch. Overlap rate 50%. Boundary contract: api owns the enum and its transitions,
portal derives display state and adds nothing. Migration versions assigned at the sync
(V47 appeals, V48 gate) rather than at commit time.

**Outcome.** Three bolts landed, no conflicts, no duplicate migration version, enum
unchanged in size. The same three patches landed ungoverned during the prototype gate
produced two conflicts, two `V47__` migrations on trunk, and an enum carrying
`AUTO_APPROVED` beside `AUTO_APPROVED_CRITERIA` and `IN_REVIEW` beside `PENDING_REVIEW`.
The sync cost 90 minutes and removed all of it.

---

## Round 2 — the SME goes on leave

**Decision, part one.** UOW-47 is Tier 3: it changes what a provider is told when a
request is denied. It waits. Two weeks of delay for one mob is the correct price; the
alternative is a clinical change reaching members with nobody accountable for it. Not
relabelled, not delegated, not landed behind a "temporary" exception.

**Decision, part two — the consumer check.** Ran it before closing the round, and it
found something that had nothing to do with this round's work:

| Consumer | Resolves | Published |
|---|---|---|
| `priorauth-api` | 2.7.0 | 2.8.0 |
| `priorauth-web` | **2.3.0** | 2.8.0 |

The portal is five minor versions behind, pinned during an incident in April 2024 by
someone who has left, with no review date. So the platform has been shipping two
different sets of denial reasons for months: providers see sentences, the nurse queue
shows raw rule codes. `TICKET-4471` was filed by a nurse three weeks ago, triaged as
low, and reassigned to a team who said nothing had changed on their side. Both are true
and neither found it.

**Actions.** Version-drift report added to the nightly job, failing when any consumer is
more than one minor behind. Consumer-driven contract test written against evaluation
*outcomes*, not payload shape — a shape test passes against 2.3 and proves nothing.
`TICKET-4471` reassigned with the cause attached. The pin stays until the SME returns:
unpinning is itself a Tier 3 change.

**What this round cost.** Nothing shipped. The most valuable thing found this quarter
was found by a check that takes four minutes and had never been run.

---

## Round 3 — a fourth mob onboards

**Decision.** They get three things on day one, all of which existed before they arrived:
generated steering (never a copy of another mob's file), a row in the registry before
their first elaboration, and the tier table with the clinical rule spelled out. Half a
day of platform time.

**On their first bolt touching the shared library.** It goes to the designated
maintainers, who as of round 2 exist: the SME plus one engineer from Gate, four hours a
week, in CODEOWNERS. Before that decision this bolt would have queued behind whoever
felt like reviewing it.

---

## Round 4 — Sev-2, six weeks cold

**Decision.** Mitigate before diagnosing. Force every determination in the affected
criteria path to nurse review — the queue takes the load, the wrong outcomes stop.
Then investigate with the provenance chain rather than with git archaeology.

**Recorded during the incident:** see `records/M17_POSTMORTEM.md`.

---

## Round 5 — compliance asks for evidence

**Decision.** Answer all five questions from the records that exist. Where a field
cannot be evidenced, say so and give the date it becomes answerable. No inference from
git history into an audit file.

**Result:** three of five answerable, two not. See `records/M16_EVIDENCE.md`.

---

## Round 6 — which mob is best

**Decision.** No ranking. Answer the question behind it: where the constraint is, what
it costs, what is being done. One page, written so it survives being repeated without
me in the room. See `records/M18_BOARD_ANSWER.md`.
