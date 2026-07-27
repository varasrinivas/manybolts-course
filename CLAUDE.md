# CLAUDE.md — Many Bolts, One Codebase

Authoring instructions for the standalone advanced course **"Many Bolts, One Codebase — AI-DLC beyond the pilot team."**

**Canonical spec:** `plans/BLUEPRINT_MANY_BOLTS_ONE_CODEBASE.md`. Read the relevant section at the start of every session. Never author from memory of an earlier session — sessions are `/clear`ed and you will not have it.

---

## The thesis

> A validation bottleneck is a shared resource. The moment a second mob touches the same codebase, AI-DLC stops being a method and becomes a queueing problem.

Every module derives from that sentence. Nothing new is invented — the course takes AI-DLC's own primitives (intent, unit of work, bolt, validation checkpoint) and asks what breaks when six of each run concurrently against one platform.

Where AWS's method has no answer, **say so plainly.** Do not paper over it. That honesty is the course's main asset with a senior audience and it is the first thing that gets edited out by an agent optimising for confident prose. Protect it.

---

## Audience

Staff engineers, architects, platform leads, engineering directors responsible for **several teams and one shared platform**. Senior, sceptical, short on time, and in the room with risk officers and executives.

Consequences:
- Do not explain what a pull request is.
- Do not pad. If a section can be a table, make it a table.
- Every claim that sounds like vendor copy needs a number or a named limit behind it.
- Assume they will be asked to defend anything they take from this course.

---

## Non-negotiable rules

1. **Cold start.** The course is self-contained across M00–M21. No dependency on Sprint Teams, the 76-Day Mandate, the conceptual AI-DLC course, or the 10x Toolkit — except as explicitly marked *optional* callbacks.
2. **Qualify every scale claim.** No module states an AI-DLC rule without saying whether it holds at multi-mob scale.
3. **Declare a contention class.** Every module carries `contentionClass: ['code'|'validator'|'infrastructure']`. M03 declares all three.
4. **Labs reference planted defects.** Every lab names at least one of PD-1…PD-12 or declares `pd:['PD-NONE']` with a justification in the lab body.
5. **Never fix the fixture.** Planted defects are curriculum. If a build fails and looks like a bug, check the PD table in the blueprint before changing anything. Do not read `platform-fixture/.solutions/`.
6. **Dual-path parity.** Path A (Claude Code) and Path B (GitHub Copilot) for every lab, or `engine:'ENGINE-AGNOSTIC'` with a stated reason. **M13 only** may use `engine:'ENGINE-COMPARATIVE'` — it is *about* engine difference.
7. **Honest-limit sections.** M05, M09, M11, M17, M19, M20 must each contain a `<div class="callout honest-limit">` stating where the practice fails or the argument stops. Not optional. Not softened.
8. **No per-team identifiers in M18 or M20.** Including in sample data inside visuals. Use role labels.
9. **The capstone is scored on more than speed.** Any lab or rubric that rewards throughput alone is wrong.

---

## Domain vocabulary

`AuthRequest`, `Member`, `Provider`, `ClinicalCriteria`, `Determination`, `AuthStatus`, `AUTO_APPROVE_THRESHOLD = 0.85`, nurse review queue.

**Two canonical teaching parallels — reach for these before inventing an analogy:**
- The **nurse review queue** is the intuition pump for the validation bottleneck. The learner already understands it from the domain; a queue of items awaiting scarce expert attention is exactly the problem the course is about.
- **`AUTO_APPROVE_THRESHOLD`** is the canonical delegation ladder. It is literally a confidence gate that routes work to a human expert only above a blast-radius threshold. Same shape, same math as the code-review tiering in M04.

**Do not** use the Lakeview Build analogy. That belongs to the conceptual 33-module course.

---

## The three repos

| Repo | Role | Contention character |
|---|---|---|
| `priorauth-api` | Spring Boot core service | Owns `Determination`; code-contention hotspot |
| `priorauth-web` | React portal + nurse queue UI | Shared component library, token drift |
| `priorauth-clinical-rules` | Shared Java library | **Consumed by all, owned by none** — the course's central discomfort |

The third repo is why this course exists separately. Keep it uncomfortable until M05 and M15 resolve it.

---

## Player conventions

- Single-file `course/index.html`. Never hand-edit between `MOD:` markers — use `tools/inject_module.py`.
- Module objects follow the shape documented above the MODS array.
- **Colors come from CSS variables only.** No hex literals in module HTML or SVG. `renderVisual()` reads tokens via `getComputedStyle`.
- Visuals are placeholders in body HTML: `<div data-viz="mb_key_name"></div>`, with a `case` added inside the `VISUALS:START`/`VISUALS:END` block.
- Visual key prefix is `mb_`.
- Interactive visuals attach behaviour via the module's optional `mount(host)` function, called after render. Do not use inline `onclick` in injected HTML.
- Progress is session-only. No localStorage — it does not work in this player's deployment target and never has.
- Quality floor: responsive to mobile, visible keyboard focus, `prefers-reduced-motion` respected. Already in the shell; don't regress it.

---

## Session loop

```
/clear
/plan-module M05      → plans/modules/M05_SPEC.md   (read it before continuing)
/build-module M05     → injects into MODS + renderVisual
/build-lab M05        → injects lab with Path A + Path B
/validate-module M05  → base checks + validate-manybolts.ps1
```

Then, before `/clear`:
```bash
python3 tools/validate.py
pwsh tools/validate-manybolts.ps1 -Module M05
```
Update `PROGRESS.md`. Commit with the module ID in the message.

**One module per session.** Two modules in one session produces a second module that quietly repeats the first.

---

## Build order

Not module order. See blueprint §13. Summary:

**Prototype gate (2 sessions) → fixture (2–3) → slots & kit (1) → Track 0 → Track 1 → Track 3 → Track 2 → Track 4 → Track 5 → run The Quarter → MS1–MS3.**

Track 3 precedes Track 2 because M14's unit-of-work registry feeds the M06 and M09 labs. M17 must follow M16 — it consumes the provenance chain.

---

## What does not belong here

- The Lakeview Build analogy.
- SAFe framing. Intent Sync is not PI Planning; blueprint §8 of the superseded addendum covers the honest differences.
- Any claim that AI-DLC as published solves multi-team coordination. It does not.
- Productivity claims beyond what DORA 2025 and METR actually support.
- Reassurance. The audience did not come for it.
