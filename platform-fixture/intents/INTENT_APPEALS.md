# Intent — Appeals

**Outcome:** a member whose request was denied can appeal it, and can see the state
of that appeal without calling us.

**Why now:** appeals arrive by phone and fax and are tracked in a spreadsheet. The
regulator asked for turnaround evidence in the last audit and we assembled it by hand.

**In scope**
- A member (or their provider) can lodge an appeal against a denied determination.
- The appeal has a visible state and a decision deadline of its own.
- An appeal decision is auditable: who, when, on what evidence.

**Out of scope**
- Changing how the original determination was made.
- Automated appeal outcomes. Every appeal is decided by a human.

**Known constraints**
- Appeal turnaround is 30 calendar days, statutory.
- The determination record is owned by priorauth-api and is the only source of truth
  for status.

**Mob:** Appeals · **Primary repo:** priorauth-api
