# Intent — Gate

**Outcome:** the auto-approval threshold is set per criteria set rather than once for
the whole platform, and every determination records which threshold produced it.

**Why now:** one global 0.85 is too permissive for some procedures and too strict for
others. Clinical has asked for this twice.

**In scope**
- Each criteria set carries its own auto-approval threshold.
- The determination records the threshold that was applied and the criteria set version.
- Denial reasons are useful to a provider without a phone call.

**Out of scope**
- Changing the criteria themselves.
- Any change to who reviews what.

**Known constraints**
- Threshold values are clinical decisions. Every value needs clinical sign-off.
- The library is consumed by more than one service.

**Mob:** Gate · **Primary repo:** priorauth-clinical-rules, then priorauth-api
