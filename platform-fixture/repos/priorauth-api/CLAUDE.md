# priorauth-api — repository steering

Inherits platform steering (`governance/STEERING.canonical.md`, INV-1 … INV-7).

## Stack

Java 17, Spring Boot, Flyway. Constructor injection. No field injection.

## This repository owns

`Determination` and `AuthStatus`. Nothing outside this repository writes either,
and nothing outside it adds values to the enum.

## Tests

Integration tests end in `IT` and live beside the service they exercise.
