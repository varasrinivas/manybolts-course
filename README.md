# Many Bolts, One Codebase — authoring kit

Claude Code kit for the standalone advanced course **"Many Bolts, One Codebase — AI-DLC beyond the pilot team"** (22 modules, 6 tracks).

## Layout

```
CLAUDE.md                       project instructions - read every session
PROGRESS.md                     phase + module tracker, open decisions
plans/
  BLUEPRINT_MANY_BOLTS_ONE_CODEBASE.md    canonical spec
  modules/                                per-module specs from /plan-module
course/
  index.html                    single-file player, all 22 modules built
  glossary.md                   seeded from the blueprint
templates/MODULE_SPEC.template.md
platform-fixture/               the three repos, PD-1..PD-12, branches, quarter harness
  scripts/setup.sh              prepare repos; then verify-fixture.sh
  .solutions/                   defect index — exclude from the learner bundle
staged/
  M00.js ... M21.js             per-module sources; re-inject after editing
  M00_visuals.js ...            renderVisual case blocks per module
tools/
  inject_module.py              incremental injection - never hand-edit MOD blocks
  validate.py                   structural gates
  validate-manybolts.ps1        content rules 1-8 (reads UTF-8)
  sync_glossary.py              inline glossary.md into the player; --check for drift
  build_learner_bundle.py       emit the student tree; the kit itself never ships
.claude/commands/
  prototype-gate  build-fixture  build-quarter  tier-repo
  plan-module  build-module  build-lab  validate-module
```

## Course content

| What | Where |
|---|---|
| The course itself — 22 modules, single file, no build step | [`course/index.html`](course/index.html) |
| Glossary (inlined into the player by `sync_glossary.py`) | [`course/glossary.md`](course/glossary.md) |
| Canonical spec — every module derives from this | [`plans/BLUEPRINT_MANY_BOLTS_ONE_CODEBASE.md`](plans/BLUEPRINT_MANY_BOLTS_ONE_CODEBASE.md) |
| Prototype gate result — the go/no-go that authorised the build | [`plans/PROTOTYPE_GATE_RESULT.md`](plans/PROTOTYPE_GATE_RESULT.md) |
| Per-module specs from `/plan-module` | [`plans/modules/`](plans/modules/) |
| Platform fixture — three repos, PD-1…PD-12, branches, quarter harness | [`platform-fixture/README.md`](platform-fixture/README.md) |
| Module sources — edit these, then re-inject | [`staged/`](staged/) |
| Authoring + validation tooling | [`tools/`](tools/) |
| Slash commands driving the session loop | [`.claude/commands/`](.claude/commands/) |
| Phase and module tracker, open decisions | [`PROGRESS.md`](PROGRESS.md) |
| Authoring instructions — read every session | [`CLAUDE.md`](CLAUDE.md) |

### Modules by track

Each module has a body source and a `renderVisual` case block in `staged/`. Track boundaries are blueprint §4.

| Track | Modules |
|---|---|
| 0 — Orientation & the scaling problem | [M00](staged/M00.js) · [M01](staged/M01.js) · [M02](staged/M02.js) · [M03](staged/M03.js) |
| 1 — The validation economy *(the spine)* | [M04](staged/M04.js) · [M05](staged/M05.js) · [M06](staged/M06.js) · [M07](staged/M07.js) |
| 2 — Trunk & integration mechanics | [M08](staged/M08.js) · [M09](staged/M09.js) · [M10](staged/M10.js) · [M11](staged/M11.js) |
| 3 — Coordination artifacts | [M12](staged/M12.js) · [M13](staged/M13.js) · [M14](staged/M14.js) · [M15](staged/M15.js) |
| 4 — Operating the platform | [M16](staged/M16.js) · [M17](staged/M17.js) · [M18](staged/M18.js) |
| 5 — Rolling it out | [M19](staged/M19.js) · [M20](staged/M20.js) · [M21 capstone](staged/M21.js) |

## Current state

All 22 modules are authored and injected into `course/index.html` (open it directly in a browser — no build step). Both validators pass with zero warnings. `platform-fixture/` is built and verified (`./scripts/verify-fixture.sh` reports GREEN), so the labs are runnable: three repos, twelve planted defects, five branch patches and the capstone harness. `staged/` holds the per-module sources; edit those and re-inject rather than touching the player between `MOD:` markers.

## After cloning

`course/index.html` opens directly in a browser — no build step, nothing to install.

The fixture ships as plain files; the three repos under `platform-fixture/repos/` are not git repositories until you initialise them:

```bash
cd platform-fixture
./scripts/setup.sh            # inits each repo at trunk, tags fixture-baseline
./scripts/verify-fixture.sh   # expect GREEN
```

The labs depend on `trunk` and the `fixture-baseline` tag existing, so run `setup.sh` before any lab that touches the repos.

## Start here

```bash
# 1. Prototype gate FIRST - it can tell you not to build this course
/prototype-gate

# 2. Only if the gate passes
/build-fixture
/build-quarter

# 3. Then the normal loop, one module per session
/clear
/plan-module M04     # read the spec it produces before continuing
/build-module M04
/build-lab M04
/validate-module M04
```

Before every `/clear`:
```bash
python3 tools/validate.py
pwsh tools/validate-manybolts.ps1 -Module M04
python3 tools/sync_glossary.py --check      # after editing course/glossary.md
```

## Injection

```bash
python3 tools/inject_module.py --list                  # built vs empty slots
python3 tools/inject_module.py --module M04 --show
python3 tools/inject_module.py --module M04 --file staged/M04.js --visuals staged/M04_visuals.js
```
Writes `course/index.html.bak` before each change. Verified end to end on an empty shell.

## The rules that matter

- **Cold start** — self-contained across M00–M21.
- **Rule 8, honest limits** — M05, M09, M11, M17, M19, M20 each state where the practice or argument stops. First thing an agent deletes; protect it.
- **Never fix the fixture** — PD-1…PD-12 are curriculum.
- **CSS variables only** — no hex literals in module content; `validate.py` fails on them.
- **No browser storage** — progress is session-only, by design.

## Build order

Not module order: prototype → fixture → slots → Track 0 → Track 1 → **Track 3** → Track 2 → Track 4 → Track 5 → run The Quarter → MS1–MS3. Track 3 precedes Track 2 because M14's registry feeds the M06 and M09 labs; M17 follows M16 because it consumes the provenance chain.

Roughly 31 sessions.

## Shipping to students

This repository is the authoring kit and is not what a learner receives. The bundle is generated, so the two cannot drift:

```bash
python3 tools/build_learner_bundle.py --zip        # dist/manybolts-course-labs[.zip]
```

It carries `course/index.html`, the fixture, `LICENSE`, `.gitattributes` and a student README. It leaves behind the blueprint, module specs, `staged/`, `tools/`, `PROGRESS.md`, `CLAUDE.md` — and `platform-fixture/records/`, which holds worked answers: the audit reply, the postmortem, the scored retro. The build fails rather than emits if any of those appear.

`.solutions/` is excluded by default. That is a judgement call, not a settled fact — M00, M21 and `break-round4.sh` all point learners at it, while the layout note above calls it "exclude from the learner bundle". Pass `--solutions include` if the intent is a deferred key the learner holds and opens when the module says so.

Students need neither GitHub nor a network: nothing in the course pushes, fetches or clones, and `setup.sh` initialises the three repos locally.

## Licence

Proprietary — copyright (c) 2026 Vara Srinivas, all rights reserved. Read it, study it, run the labs yourself. Redistributing it, adapting it, or teaching from it needs written permission. See [LICENSE](LICENSE).
