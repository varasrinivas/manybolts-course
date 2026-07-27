# Planted defects — index

| ID | Where | Surfaces in |
|---|---|---|
| PD-1 | `branches/appeals-r1.patch` and `branches/gate-r1.patch` both add `src/main/resources/db/migration/V47__*.sql` | M08 |
| PD-2 | `repos/priorauth-clinical-rules/.../ClinicalCriteriaEvaluator.java` | M04 |
| PD-3 | `repos/priorauth-api/.../web/CriteriaThresholdController.java` | M12, M06 |
| PD-4 | `intents/*` plus the three round-1 patches, all touching `AuthStatus` | M14 |
| PD-5 | `repos/priorauth-clinical-rules/.../clinical/display/CriteriaDisplayFormatter.java` | M06 |
| PD-6 | `repos/priorauth-api/.../service/DeterminationService.java` + `AuditWindow.java` | M10 |
| PD-7 | `evidence/PROVENANCE_SCHEMA.v1.json` | M16, M17 |
| PD-8 | `repos/priorauth-clinical-rules/.github/` has no CODEOWNERS | M05, M15 |
| PD-9 | `repos/priorauth-web/package-lock.json` pins 2.3.0 | M09 |
| PD-10 | `branches/appeals-r2.patch` + `pipeline/sbom/sbom-appeals-r2.json` | M07 |
| PD-11 | `governance/mobs/appeals/CLAUDE.md` vs `governance/mobs/gate/CLAUDE.md` | M12, M13 |
| PD-12 | `repos/priorauth-api/.../service/EligibilityService.java` | M11 |

## Detail

**PD-1** — Both round-1 patches introduce a `V47__` migration and both also edit
`AuthStatus.java`, so the second patch conflicts before the duplicate filename is
even visible. After the learner resolves the enum conflict, two `V47__` files
exist. Renumbering makes the build pass; both migrations still alter
`determination` in an order nobody designed. The real fix is expand–contract.

**PD-2** — `ClinicalCriteriaEvaluator` has no PHI in its signature, no audit call
and pure-function tests. It decides whether a member's procedure is clinically
indicated and reads `AUTO_APPROVE_THRESHOLD`. Tier 3. A tiering agent proposes
Tier 1. Second instance: `ReasonText` shapes what a provider is told about a
denial.

**PD-3** — `CriteriaThresholdController.forMember` takes a `Member` and returns
the member id, with no `@PhiBoundary`. Root steering INV-3 requires it. No
steering file was edited: the class was copied from a controller that predates
the rule.

**PD-4** — Three units of work touch `AuthStatus`: appeals adds `APPEALED` and
`APPEAL_UPHELD`, gate adds `AUTO_APPROVED_CRITERIA`, portal adds `PENDING_REVIEW`
and a display helper. The portal one reads as presentation work in
`intents/INTENT_PORTAL.md` and never mentions the enum. Overlap rate 3/6 = 50% on
the template registry rows for round 1.

**PD-5** — `CriteriaDisplayFormatter` imports `com.meridiancare.web.tokens`,
published by `repos/priorauth-web/tokens-java`. Verify by compiling the library
alone: it fails. Four lines, a good reason, and the shared library can no longer
be built without the web repo.

**PD-6** — `DeterminationService` keeps the current request's audit batch window in
    a field (`currentAuditWindow`) "so the audit interceptor can read it without every
    call site threading it through". `DeterminationServiceIT`'s
    `concurrentDeterminationsKeepTheirOwnAuditWindow` decides eight requests in
    parallel, as intake does, and asserts each determination carries the window of its
    own request. When two decisions overlap, one overwrites the other's window.

    Measured with the real runner on two machines: **4 and 11 failures per 20
    `mvn verify` runs**. The intended fix (make the window a local, stamped from
    `request.getReceivedAt()`) gives **0 failures in 20**, checked. The rate is not
    stable and cannot be made stable — it is a thread race, so it moves with load;
    a sweep across pool sizes on one machine returned anywhere from 4 to 18 of 20.
    What the fixture guarantees, and what `flake-check.sh` asserts, is that it is
    intermittent: never zero, never all. Concurrency-dependent, never seeded: pin the
    pool to one thread and it is deterministic. Adding a retry hides a race that
    misfiles audit evidence under load, which is the evidence chain M16 depends on.

    **PD-7** — v1 records `approver` (who merged) and has no `validator_identity`,
no `validator_qualification`, no `tier_at_review`, no `steering_hash`, no gate
results. `evidence/provenance-records.jsonl` shows UOW-38 and UOW-40 as Tier 3
and unknown-tier changes approved by a login, which cannot answer auditor
question 1. Backfilling that field from git history fabricates a control.

**PD-8** — `repos/priorauth-clinical-rules/.github/` contains a pull request
template and no CODEOWNERS. `governance/OWNERSHIP.md` records the row as
unassigned. The most frequent committer is whoever needed a change most recently;
that is a symptom, not an owner.

**PD-9** — `repos/priorauth-web/package-lock.json` pins
`@meridiancare/clinical-rules` to 2.3.0, decided in
`docs/decisions/0009-pin-clinical-rules.md` during an incident by someone who has
left. The api consumes 2.7 and moves to 2.8 with `gate-r2`. 2.8 expands denial
reasons into sentences; the queue renders the 2.3 short codes. Symptom:
`node scripts/reason-parity.mjs` in the web repo exits 1 and prints both, and
`evidence/TICKET-4471-queue-reasons.md` is the nurse's report of it.

**PD-10** — `appeals-r2` adds `com.example.retry:retry-toolkit:3.0.1`, which
brings `org.apache.commons:commons-text:1.9` transitively. That version carries
CVE-2022-42889 in `pipeline/cve-db.json`. Nothing in the diff mentions it.
`node scripts/cve-scan.mjs pipeline/sbom/sbom-appeals-r2.json --fail-on critical`
finds it and exits 1; the baseline SBOM is clean.

**PD-11** — Appeals steering says failures are domain exceptions; Gate steering
says failures are values. Both are internally consistent. They meet in
`AppealReviewService.upholdOriginal`, which calls
`ThresholdService.thresholdFor` and reads `orNull()` without checking
`isFailure()`: a failed threshold lookup becomes 0.0, so the appeal upholds the
original on a comparison that always passes. Neither mob's tests see it. There is
also a superseded `copilot-instructions.md.old` in the appeals directory that
contradicts current steering on three points, including logging the member id.

**PD-12** — `EligibilityService`, 3,883 lines, no test file anywhere in the repo,
called by all three mobs' work. Counter-intuitive behaviours to be found by
characterization: COBRA at exactly day 61 returns ELIGIBLE (settlement branch,
`evaluateCobra`), a request within two days of the coverage-start anniversary
returns PENDING rather than a decision (`crossesPlanYear`), and
`determineEligibilityLegacy` disagrees with the main path on both. Employer
overrides are hard-coded string keys — there is no configuration file, which is
what an assistant will assume.
