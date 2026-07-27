# Gate mob — steering

Inherits platform steering (INV-1 … INV-7). Local conventions below.

## Error handling

Failures are **values, not exceptions**. Return `Result.failure(code)`; reserve
exceptions for programming errors. This keeps threshold evaluation total and makes
the failure path testable without try/catch.

## Tests

Table-driven where the input space is small. Every threshold value change gets a
criteria test.

## Review

Anything touching a threshold constant or a criteria set is clinical review, no
exceptions.
