# priorauth-api — assistant instructions

Generated from governance/STEERING.canonical.md. Do not edit by hand.

- Java 17, constructor injection, no field injection.
- No PHI in logs, exception messages or traces (INV-1).
- Audit before responding on any determination state change (INV-2).
- Handlers carrying a member identifier are annotated @PhiBoundary (INV-3).
- Criteria evaluation goes through the shared evaluator (INV-4).
- AuthStatus transitions go through the transition API (INV-5).
