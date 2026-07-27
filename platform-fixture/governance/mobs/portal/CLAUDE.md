# Portal mob — steering

Inherits platform steering (INV-1 … INV-7). Local conventions below.

## Components

Presentational components take data, not services. Queue rendering reads reasons from
the clinical rules package so the queue and the portal agree.

## Tests

Render tests over the queue table. Snapshot tests are not used.

## Review

Peer review inside the mob. Payload shape changes go to the API's owning validator.
