# priorauth-clinical-rules — repository steering

Inherits platform steering (`governance/STEERING.canonical.md`).

## What this library is

Criteria evaluation, consumed by more than one service. It is published as a jar
and versioned; consumers upgrade when they choose to.

## Rules for changes here

- Criteria are immutable once published. Add a version, do not edit in place.
- No I/O in evaluation. Pure functions over plain data.
- A change to a criteria set ships with a criteria test (INV-6).
- Nothing in this library may depend on a service or on the web tier.

## Review

Every change here is clinically material. Ask who reviewed it clinically before
you merge.
