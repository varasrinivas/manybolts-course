# Round 2 — The SME goes on leave

**Modules under test:** M04, M05, M09

## Brief

- Four bolts in flight need clinical validation.
- The Thursday board still meets and still needs a clinical opinion.
- One of those four is the Gate mob's criteria change, which two services consume.

## The event

> Your clinical SME is out for two weeks, from today.

## What you have to decide

Decide what happens to Tier 3 work for two weeks, and write the decision down before you act.

Then, before you close the round: **confirm the criteria change reached every consumer of it.** Not that it landed — that it is live everywhere it is supposed to be. Name the consumers, name the version each one resolves, and record how you checked.

## Scoring note

Two ways to lose points here. Relabelling Tier 3 as Tier 2 to keep moving costs you in round 5, not now. And if you close this round without checking the consumers, the cross-repo breakage dimension scores zero for the rest of the quarter — the change is already half-live, and nothing will tell you.

## Running the round

    ./scripts/time-round.sh 2 start
    #   plan 15 min · run 20 min · event fires · respond 10 min
    ./scripts/time-round.sh 2 end

Write your response decision down **before** you act on it.
