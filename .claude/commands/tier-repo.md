---
description: Propose blast-radius validation tiers across the three repos (M04 lab, Path A)
---

# /tier-repo

Propose a **blast-radius validation tier** for every package across `priorauth-api`, `priorauth-web`, and `priorauth-clinical-rules`, then generate CODEOWNERS.

First draft only — the learner critiques and corrects you.

| Tier | Scope | Validator |
|---|---|---|
| 0 | Cosmetic, test-only, docs | Agent + author |
| 1 | Service-internal logic, no external contract | Peer in mob |
| 2 | Public contract, cross-team surface, shared aggregate | Owning mob's validator |
| 3 | Clinical rule, threshold constant, PHI path, audit surface | Clinical SME + compliance. **No delegation.** |

## Procedure
1. Enumerate packages in all three repos.
2. Gather evidence before assigning: PHI fields, clinical criteria, the auto-approve threshold, audit writes, published contracts.
3. Assign a tier with a one-line justification citing evidence, not the package name.
4. Flag ambiguous cases rather than guessing — those are the interesting ones.
5. Write `governance/VALIDATION_TIERS.md` and generate `.github/CODEOWNERS`.
6. **`priorauth-clinical-rules` has no owner (PD-8).** Do not invent one. Report it as unassignable and say what that implies for every Tier 3 package inside it.

## Output
```markdown
| Repo | Package | Tier | Evidence | Confidence |
|---|---|---|---|---|
```

## Constraints
- Judge by what code **does**, not what it is named. A `util` package that formats member identifiers is Tier 3.
- Do not optimise for flow. If the evidence supports a slower tier, assign it and state the cost.
- Report confidence honestly. A low-confidence Tier 1 that should be Tier 3 is exactly the failure this lab teaches.
- Do not read `.solutions/`.
