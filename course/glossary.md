# Glossary — Many Bolts, One Codebase

Seeded from the blueprint. `/build-module` adds terms; validator rule 7 warns on bolded terms missing here.

## The scaling problem
**contention class** — one of three ways concurrent mobs compete: *code*, *validator*, *infrastructure*.
**generation–validation throughput gap** — agents raised generation capacity; validation capacity did not move.
**concurrent bolt count** — how many bolts are in flight against one platform at once. The variable everything else scales against.

## The validation economy
**validation bottleneck** — the scarce human attention every bolt must pass through.
**queue time** — time a bolt spends waiting for a validator, as distinct from work time. Dominates at scale.
**validator utilisation** — fraction of a validator's capacity consumed. Queue time explodes past roughly 80%.
**delegation ladder** — routing changes to validators by blast radius rather than sending everything to the scarcest one.
**blast-radius tier** — Tier 0 cosmetic · Tier 1 service-internal · Tier 2 cross-team contract · Tier 3 clinical/PHI/audit, no delegation.
**review SLA** — a stated turnaround for validation. Only useful if measured against actual.
**capacity multiplier** — a change that raises validation throughput without adding validators.
**golden path** — a scaffold plus constraint set a mob starts from, with the invariants already satisfied.
**encode-vs-review break-even** — the point where SME hours spent encoding a rule beat SME hours spent reviewing against it.
**platform bottleneck anti-pattern** — a platform team that reviews changes has recreated the SME queue with extra steps.

## Trunk & integration
**merge queue** — serialised integration; "green on my branch" means nothing with six mobs.
**stacked change** — one unit of work per stack entry, landed in order.
**expand–contract** — schema evolution in phases so two mobs can land in either order.
**migration collision** — two mobs writing the same migration version on the same day.
**diff width** — how many files a change touches. Agent diffs are wide, so collisions rise.
**context boundary** — what the agent can actually see. Distinct from the repo boundary and the team boundary.
**version-pin no-op** — a shared-library change that silently does nothing in a consumer pinned to an older version.

## Coordination artifacts
**steering artifact** — CLAUDE.md, copilot-instructions.md, Kiro steering. Load-bearing architecture, not documentation.
**steering drift** — mob-local relaxation of a root invariant, propagating into the codebase unnoticed.
**additive-only precedence** — lower levels may add constraints, never remove them.
**canonical steering source** — one `STEERING.md`; per-engine files are generated, never hand-maintained in parallel.
**engine dialect** — systematic differences in what each engine generates: test verbosity, error idiom, comment density.
**architecture guardian** — owns root steering and fitness functions. Measured by constraints encoded, not PRs reviewed.
**unit-of-work registry** — in-repo record of which mob owns which UoW, which aggregates it touches, and its contract surfaces.
**boundary contract** — an explicit, tested surface between two mobs that must touch one aggregate.
**Intent Sync** — the scaled elaboration ritual AI-DLC does not define. Before parallel elaborations, not after.
**overlap rate as diagnostic** — registry overlap is a readout of org design, not just a scheduling problem.

## Architecture & security
**architecture entropy** — the accumulated cost of locally-optimal agent decisions.
**dialect drift** — five mobs, five idioms, one codebase, all individually defensible.
**fitness function** — an executable architectural constraint the agent must satisfy.
**constraint-time governance** — moving rules from review-time to generation-time.
**consumer-driven contract** — a test written by the consumer that fails when the provider breaks it.
**dependency surface** — the set of third-party code you now own. Agents grow it enthusiastically.
**SBOM per bolt** — bill of materials generated per unit of work, not per release.
**PHI-adjacent logging** — helpful agent-generated logging that ships protected health information.

## Operating & rollout
**deploy–release decoupling** — ship continuously behind flags; release on the business's cadence.
**flag debt** — flags created and never removed. Every flag needs an owner and an expiry at creation.
**provenance chain** — UoW → mob → engine → validator → tier → steering version → fitness gates. Audit evidence and incident tool.
**cold code** — code in production that no human on the call remembers writing.
**confabulated structure** — an agent describing code it has not read: a method that should exist, a tidier hierarchy than reality, a plausible config key that is absent.
**confabulation tell** — a sign the agent is asserting causation it hasn't evidenced.
**systemic postmortem** — "the agent wrote it" is not a cause. Tier misassignment, missing constraint, steering drift, boundary invisibility are.
**Conway acceleration** — agents scoped to a mob's context enforce the org chart faster and more literally than humans do.
**characterization test** — pins current behaviour so change becomes visible. The entry move for brownfield.
**second-team cliff** — the pilot succeeded on conditions, not method. Team two has none of them.
**conditions failure** — a rollout failure that looks like a method failure.
**comparison trap** — per-team metric rankings destroy the measurement they depend on.
**mechanical vs cultural control** — a constraint that runs every time, versus a norm people are expected to remember.
**the honest limit** — where a practice or argument stops working. Named explicitly in M05, M09, M11, M17, M19, M20.

## Domain and method vocabulary
**prior authorisation** — the payer-side decision that a procedure meets clinical criteria before it is paid for.
**nurse review queue** — where a request lands when confidence is below the auto-approve threshold. Many items, one class of scarce expert, a statutory deadline. The intuition pump for the whole course.
**intent** — a business outcome stated without a solution. Assumes one intent owner and no other intent in flight on the same aggregate.
**unit of work** — the smallest slice of an intent that can be elaborated, built, validated and landed whole. Sized by one mob, for one mob.
**bolt** — one pass of elaborate, generate, validate, land. At one mob it has the trunk and the reviewer effectively to itself.
**validation checkpoint** — the human decision that a generated change is safe enough to land. Modelled for one mob; no queue appears anywhere in the published method.
**Mob Elaboration** — the ritual turning an intent into units of work. Defined for a single mob; has no multi-mob form (see [[Intent Sync]]).
**Mob Construction** — the ritual where a single mob drives generation and reviews output together rather than asynchronously.
**Little's law** — work in progress equals throughput multiplied by cycle time. Add mobs without validation capacity and cycle time absorbs it.
**code contention** — concurrent mobs competing for files, aggregates, migrations, the trunk. Measured as rebases per landed bolt.
**validator contention** — concurrent mobs competing for the scarce human who must say yes. Measured as queue time over cycle time.
**infrastructure contention** — concurrent mobs competing for runners, environments, test data, seats. Measured as wait-for-resource per bolt.

## Operating vocabulary
**validator queue time** — hours a ready bolt waits before validation starts, by tier. The leading indicator of a stalling rollout.
**validator identity** — who made the safety judgement, as distinct from who approved the merge. The field auditors ask about first, and the one v1 provenance schemas omit.
**evidence completeness** — share of landed units of work whose provenance record has every required field populated, none inferred.
**security queue depth** — dependency and data-path reviews outstanding. Instrumented separately because it stays invisible until an audit.
**flag age** — how long a live flag has existed. The number that matters; count alone says nothing.
**quarantined test age** — how long a test has been out of the blocking suite. Past a few weeks it is deleted coverage.
**provenance-led investigation** — using the provenance chain as the index from production symptom to context, rather than as audit paperwork.
**designated maintainer** — a named person with real hours who reviews changes to a shared module nobody owns.
**platform lead** — the role the learner plays in The Quarter: governs contention, does not write the features.
**The Quarter** — the capstone simulation. Six rounds, three mobs, one platform, eight scored dimensions, and a rubric visible from round 1.
**ENGINE-AGNOSTIC** — a lab whose deliverable does not depend on which engine runs it, declared with a stated reason.
