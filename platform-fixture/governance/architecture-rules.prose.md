# Architecture rules, as written down in 2024

These live in prose. Some of them have executable counterparts; most do not. Turning
the rest into checks is the work.

1. The clinical library must not depend on anything above it. It is consumed by the
   services; it does not consume them.
2. Determination status is owned by the API. The portal renders it and does not
   derive its own.
3. Anything reading the auto-approval threshold is clinically material.
4. Logging is for engineers. Member data is not for engineers.
5. Cross-service contracts are versioned, and a consumer's expectations are tested
   in the provider's pipeline.
6. Migrations are additive first. Two mobs must be able to land in either order.
