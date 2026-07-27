# Unit-of-work registry — platform scope

Written at Intent Sync, round 1, before any bolt ran. Aggregates are named types.

| UoW | Mob | Repo | Aggregates touched | Contract surfaces | Status |
|---|---|---|---|---|---|
| UOW-41 | appeals | api | `AuthStatus`, `Determination` | `POST /determinations/{id}/appeal`, `determination` table | in bolt |
| UOW-42 | appeals | api | `Determination` | none | elaborated |
| UOW-47 | gate | clinical-rules | `ClinicalCriteria`, `Thresholds` | `clinical-rules` jar version | elaborated |
| UOW-48 | gate | api | `Determination`, `AuthStatus` | `determination` table | in bolt |
| UOW-52 | portal | web, **api** | `AuthStatus` (adds a value) | `GET /determinations/{id}` rendering | in bolt |
| UOW-53 | portal | web | none | none | elaborated |

## Overlaps found at Intent Sync

| Aggregate | Mobs | How it was found |
|---|---|---|
| `AuthStatus` | appeals, gate, portal | **All three.** Appeals and Gate declared it. Portal did not — its intent describes a status view and never mentions the enum. Found by reading `branches/portal-r1.patch`, which adds `PENDING_REVIEW` to the shared type |
| `Determination` | appeals, gate | Both declared it |

**Overlap rate: 3 of 6 units of work = 50%.** Well above the 20% that M15 says should be
read as an org-design signal rather than a scheduling problem.

## Decisions

1. **`AuthStatus` transitions are owned by `priorauth-api`.** Boundary contract: the enum
   and its transition table live in api. Appeals may add transitions. Gate writes only
   through the existing transition API. **Portal derives display state and adds nothing
   to the enum** — `PENDING_REVIEW` is rejected; the portal groups `IN_REVIEW` for
   display instead. One consumer-driven contract test per party, all three running in
   api's pipeline.
2. **Landing order: Appeals, then Gate, then Portal.** Not because Appeals is more
   important — because their migration is additive and the other two can rebase onto it
   more cheaply than the reverse.
3. **Migration versions assigned at sync, not at commit:** Appeals takes `V47`, Gate
   takes `V48`. This is the cheapest possible fix for the collision class and it costs
   one line of coordination.
4. **UOW-47 is Tier 3** (criteria set + threshold). It needs the clinical SME and it is
   the only item in the window that does.
