# Which team is performing best — the answer for the board pack

One page. Round 6.

---

**You asked which team is performing best. I am not going to give you that ranking, and
I want to be direct about why rather than appear evasive.**

The numbers that would produce a ranking are contention measures: how long a change waits
for a reviewer, how often work collides, how much rework a mob absorbs. Those are
properties of the platform, not of the teams. Whichever group owns the clinical hotspot
has the highest share of work that legally cannot be delegated, so ranking on cycle time
ranks module difficulty and calls it capability.

The second reason is more practical. The moment queue time is attributed to a named
group, it stops being reported honestly — the clock starts late, work is sliced smaller,
and a change gets classified one tier down to keep moving. Queue time is the earliest
warning we have that this programme is in trouble. I would rather keep the number true
than publish a table.

**What I can tell you, which I think is the question underneath yours:**

*Are we getting value?* Yes, and less than the pilot suggested. Generation is
substantially faster and that gain is real. At platform level most of it is currently
absorbed by waiting — a change is ready in hours and lands in days. The gap is the
subject of the work below, not a reason to stop.

*Where is the constraint?* One clinical reviewer, 0.6 FTE, of whose 24 nominal hours
about 8 are available for reviewing code. Everything else queues behind that. Tiering
moved most changes out of that queue this quarter; what remains is genuinely clinical and
cannot be delegated to anyone we currently employ.

*Is anyone in trouble?* Yes, and not in a way a ranking would show. The team carrying the
shared clinical library had no owner for it until this quarter, which cost us a defect
that reached half of production and went unnoticed for six weeks. That was a governance
gap, not a performance problem, and it is now fixed.

**What I am asking for.** Not tooling — we have enough. Six to eight hours a week of the
clinical specialist's time, protected, spent encoding recurring review decisions into
automated checks rather than reviewing changes one at a time. Two of last quarter's three
most repeated review comments have already been encoded; each one now costs zero
reviewer minutes per change, permanently. The third could not be encoded — it is a
clinical judgement call, and it stays with a human.

**What I will report in ninety days.** Mean hours a ready change waits for clinical
review, by tier, against today's baseline. If that number has not moved, the
reallocation did not work and I will say so.

---

*Prepared by the platform lead. The per-group numbers exist, each group sees its own, and
they are not published upward. If the board wants a single number for this programme, use
the queue-time figure above — it is the one that changes when we do something right.*
