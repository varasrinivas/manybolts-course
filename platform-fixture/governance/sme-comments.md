# Recurring clinical review comments

Comments the clinical SME has made on more than three bolts in the last quarter.
Collected for the M05 lab.

---

**Comment 1** — made on 7 bolts

> Any endpoint returning a determination must include the criteria version that
> produced it. Without it I cannot tell, six months later, which rule set was in
> force when the decision was made.

---

**Comment 2** — made on 5 bolts

> Member identifiers must never appear in logs, including in exception messages.
> I keep finding them in catch blocks where somebody wanted the failure to be
> debuggable.

---

**Comment 3** — made on 4 bolts

> If the member has an active appeal and a new request arrives for the same
> procedure, use clinical judgement about whether this is a duplicate submission or
> a change in the member's condition. I look at the interval, the documentation, and
> whether anything in the record changed. Sometimes 20 days apart is a new episode
> and sometimes 90 days apart is the same one being resubmitted.
