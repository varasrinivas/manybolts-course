# Appeals mob — steering

Inherits platform steering (INV-1 … INV-7). Local conventions below.

## Error handling

Failures are **domain exceptions**. Throw `AppealException` with a reason code; do
not return null and do not return a status object. Callers are expected to let the
exception propagate to the boundary handler.

## Tests

One behaviour per test. Name tests for the behaviour under appeal rules.

## Review

Peer review inside the mob for service-internal work. Anything touching
`Determination` goes to the owning validator.
