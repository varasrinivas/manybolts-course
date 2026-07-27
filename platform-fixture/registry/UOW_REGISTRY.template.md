# Unit-of-work registry — platform scope

One row per unit of work, across all three repositories. Written at Intent Sync,
before the bolt. Aggregates and contract surfaces are **named**, never described.

| UoW | Mob | Repo | Aggregates touched | Contract surfaces | Status |
|---|---|---|---|---|---|
| UOW-41 | appeals | api | | | elaborated |
| UOW-42 | appeals | api | | | elaborated |
| UOW-47 | gate | clinical-rules | | | elaborated |
| UOW-48 | gate | api | | | elaborated |
| UOW-52 | portal | web | | | elaborated |
| UOW-53 | portal | web, api | | | elaborated |

## Rules

1. Aggregates are type names (`AuthStatus`, `Determination`), not phrases.
2. Contract surfaces are endpoints, published payloads, or artifact versions.
3. A row with no contract surface still needs the aggregate column filled in.
4. Overlap rate = units of work sharing an aggregate with another mob's, over total.
