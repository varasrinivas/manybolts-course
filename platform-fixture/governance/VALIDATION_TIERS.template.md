# Validation tiers

| Tier | Scope | Validator |
|---|---|---|
| 0 | Cosmetic, test-only, docs | Agent + author |
| 1 | Service-internal logic, no external contract | Peer in mob |
| 2 | Public contract, cross-team surface, shared aggregate | Owning mob's validator |
| 3 | Clinical rule, threshold constant, PHI path, audit surface | Clinical SME + compliance. No delegation |

| Repo | Package | Tier | Evidence | Confidence |
|---|---|---|---|---|
| | | | | |

## Rules

- Tier by what the code **does**, not by what it is named or what it imports.
- Evidence is a fact about the code: a PHI field, a threshold read, an audit write,
  a published contract. "It is in the util package" is not evidence.
- If Tier 3 demand exceeds available specialist hours, reduce Tier 3 arrivals or
  encode the rule. Never relabel the risk.
