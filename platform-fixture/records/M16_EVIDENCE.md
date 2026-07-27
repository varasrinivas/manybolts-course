# Answers to the January audit questions

Round 5. Answered from the records that exist. Where a field cannot be evidenced it is
recorded as unknown, with the date it becomes answerable. Nothing here is inferred from
commit history.

---

**1. On 14 January a change was made to the auto-approval threshold path. Who approved
it, and were they qualified to approve a clinical change?**

**We cannot evidence this.** Our provenance schema records `approver` — the account that
merged the change — and not the person who judged it safe. For UOW-40 that value is
`r.okafor`, and we cannot tell you from any record whether a clinician reviewed it or
whether the merge was procedural. The same gap applies to UOW-49, the change behind the
16 June incident, where the tier was recorded as service-internal.

Provenance v2 adds `validator_identity`, `validator_qualification` and `tier_at_review`
as required fields. It is in flight; from the date it lands, this question is answerable
in seconds. Everything before that date remains unknown and we will not reconstruct it.

*Citation: `evidence/provenance-records.jsonl`, `evidence/PROVENANCE_SCHEMA.v1.json`.*

---

**2. For determinations issued between 8 and 16 January, which version of the criteria
set was in force?**

**Answerable.** Every `Determination` carries `criteria_set_version`, written at decision
time and stored on the row. For the period in question all determinations were issued
against criteria set `2026.1`.

One qualification we are volunteering: the *library* version that computed the
determination is not the same fact as the criteria set version, and until this quarter
our two consumers resolved different library versions. Determinations were correct; the
denial text shown to the nurse queue was six months stale. That is
`TICKET-4471`, now closed with cause.

*Citation: `determination` table, `criteria_set_version`; `records/M21_ROUND_DECISIONS.md` round 2.*

---

**3. Which automated checks ran against the 14 January change before it reached
production, and did any fail and get overridden?**

**We cannot evidence this.** v1 records no gate results. We know from the pipeline
configuration which checks existed on that date, but not which ran for that change nor
what they returned. We cannot rule out an override, and we will not assert that none
occurred.

v2 records `gates_passed[]` with per-gate results, and the merge queue refuses a landing
whose record is incomplete. Answerable from the date it lands.

---

**4. Where a change was produced with assistance from a generative tool, is that
recorded, and can you identify every such change in the period?**

**Partially, and not usefully.** The `engine` field exists in v1 and every record in the
period holds the value `unrecorded`. So we can tell you the field was never populated,
which is an honest answer and not a useful one. We cannot identify which changes were
assisted.

v2 makes engine and version required at land time, populated by the pipeline rather than
by a person.

---

**5. Can you show that no protected health information reached application logs in the
period?**

**Answerable, with a stated boundary.** A fitness test asserts that no log statement or
exception path references a member identifier or a `@PhiField` accessor. It runs on every
change; it has been green for the period, and it has caught two real violations since it
was introduced.

The boundary: it proves that no *code path we compiled* logs those fields. It does not
prove that no PHI reached logs by another route — a third-party library logging a request
body, for example. We have no evidence of that and no control that would detect it, and
we would rather say so than let the green test carry more weight than it earns.

*Citation: `PhiLoggingFitnessTest`, pipeline results for the period.*

---

## Summary for the file

| Question | Answer |
|---|---|
| 1 — who validated | **Unknown.** Schema gap, remediation in flight |
| 2 — criteria version | Answered |
| 3 — gate results | **Unknown.** Schema gap, remediation in flight |
| 4 — tool assistance | Field exists, never populated. Effectively unknown |
| 5 — PHI in logs | Answered, with the limit of the control stated |

Two of five answerable today. That number is our evidence completeness for this period,
and we are reporting it rather than being asked for it.
