# 0009 — Pin @meridiancare/clinical-rules to 2.3.0

Date: 2024-04-17
Status: accepted

## Context

During INC-2024-0417 a minor release of the clinical rules package changed the
shape of the reason list and the queue rendered blank rows for four hours.

## Decision

Pin the dependency to an exact version, `2.3.0`, and upgrade deliberately after
checking the reason payload.

## Consequences

Upgrades become a decision rather than a default. Someone has to remember to make
that decision.

*Author has since left the organisation. No review date was set.*
