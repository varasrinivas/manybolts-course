# Platform steering — canonical source

The only file a human edits. Per-engine files are generated from it.

## Root invariants

- **INV-1** No protected health information in logs, exception messages, or traces.
- **INV-2** Every state change to `Determination` writes an audit record before the
  response is returned.
- **INV-3** Every handler whose parameters or return type carry a member identifier
  is annotated `@PhiBoundary`.
- **INV-4** Criteria evaluation happens only through the shared evaluator. No service
  reimplements it.
- **INV-5** `AuthStatus` transitions are made through the transition API. Nothing
  outside priorauth-api adds values to the enum.
- **INV-6** A change to a criteria set ships with a criteria test.
- **INV-7** Schema changes are additive first: expand, migrate, contract.

## Conventions

- Java 17, constructor injection, no field injection.
- Tests name the behaviour, not the method.

> Lower levels may add constraints. They may never remove or weaken one from above.
