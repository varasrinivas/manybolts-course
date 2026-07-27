# Prior Auth platform fixture

Three repositories, one platform, three mobs with work in flight.

    repos/priorauth-api               Spring Boot core service
    repos/priorauth-web               provider portal and nurse review queue
    repos/priorauth-clinical-rules    shared criteria library

## The three intents

**Appeals** — *Members can appeal a denied determination.*
A member whose request was denied can ask for it to be looked at again, and can see
where the appeal has got to.

**Gate** — *The auto-approval threshold becomes criteria-specific.*
One threshold for every procedure is too blunt. Each criteria set should carry its
own, and a determination should record which one was applied.

**Portal** — *Providers submit and track requests themselves.*
Submission without a phone call, and a status view accurate enough that providers
stop calling to ask.

## Getting started

    ./scripts/setup.sh            prepare the three repositories
    ./scripts/verify-fixture.sh   check the fixture builds

Everything else you need is in the module you are working through.
