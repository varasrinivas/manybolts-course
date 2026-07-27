# Round branches

Each file is a patch against trunk of `repos/priorauth-api`.

    cd repos/priorauth-api
    git apply --check ../../branches/appeals-r1.patch    # dry run
    git apply ../../branches/appeals-r1.patch

| Patch | Mob | Unit of work |
|---|---|---|
| `appeals-r1.patch` | Appeals | UOW-41 — appeal states and endpoint |
| `gate-r1.patch` | Gate | UOW-48 — record the threshold used |
| `portal-r1.patch` | Portal | UOW-52 — provider status view |
| `gate-r2.patch` | Gate | UOW-47 — consume clinical-rules 2.8 |
| `appeals-r2.patch` | Appeals | UOW-43 — appeal deadline reminders |

Each round-1 patch applies cleanly to trunk on its own.
