# priorauth-web

Provider portal and nurse review queue.

    src/portal/    provider-facing submission and status
    src/queue/     nurse review queue
    tokens-java/   display tokens exported for JVM consumers
    vendor/        locally vendored packages

    npm test                          unit tests
    node scripts/reason-parity.mjs    compare queue reasons against an API response
