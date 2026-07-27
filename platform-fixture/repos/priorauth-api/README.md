# priorauth-api

Core prior authorisation service. Owns `Determination` and `AuthStatus` — it is the
only writer of either.

    com.meridiancare.priorauth.domain      AuthRequest, Member, Provider, Determination
    com.meridiancare.priorauth.service     DeterminationService, EligibilityService
    com.meridiancare.priorauth.web         controllers and response payloads
    com.meridiancare.priorauth.audit       audit + provenance writers

    ./mvnw verify        full build and tests
