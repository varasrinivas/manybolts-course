# Round 4 — Sev-2, six weeks cold

**Modules under test:** M17, M16

## Brief

- The suspect change landed six weeks ago.
- Three mobs have shipped on top of it.
- Nobody on the call has read the code.

## The event

> Determinations are auto-approving below the threshold.

## What you have to decide

Run `./scripts/break-round4.sh` and work the incident inside 60 minutes.

## Scoring note

The provenance record for the suspect unit of work names an approver, not a validator. That gap costs you time, and the minutes are the point — write down how many.

## Running the round

    ./scripts/time-round.sh 4 start
    #   plan 15 min · run 20 min · event fires · respond 10 min
    ./scripts/time-round.sh 4 end

Write your response decision down **before** you act on it.
