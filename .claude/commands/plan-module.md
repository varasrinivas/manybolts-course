---
description: Produce a full module spec from the blueprint before any authoring
argument-hint: <module-id>  e.g. M05
---

# /plan-module $ARGUMENTS

Produce `plans/modules/$ARGUMENTS_SPEC.md` from the blueprint. **Do not write module HTML in this command.**

## Read first
1. `plans/BLUEPRINT_MANY_BOLTS_ONE_CODEBASE.md` — §5 (map), §9 (this module's spec), §7 (fixture/PDs)
2. `CLAUDE.md` — all of it
3. `course/glossary.md` — what already exists
4. If the module is carried over from Track 9: `plans/COURSE_PLAN_ADDENDUM_T9_MANY_BOLTS.md` §3 for the original spec, then §6 for the delta to apply

## Produce, using `templates/MODULE_SPEC.template.md`

- Identity: id, title, track, audience tags, contentionClass, duration
- Learning objectives — 3–5, each testable
- Teaching spine — numbered sections with a one-line intent each. Name the *argument* of each section, not the topic.
- Visuals — one line per `mb_` key: what it shows, whether it is interactive, what the learner manipulates
- Lab — name, PD references, deliverable, the graded moment, Path A and Path B outlines
- Validation gate — what the learner must demonstrably produce
- Glossary terms introduced
- Honest-limit section, if this module is in the rule-7 list (M05, M09, M11, M17, M19, M20)

## Then stop

Print the spec path and a 5-line summary. Do not build. The author reads the spec before `/build-module` — that read is the cheapest place to catch drift, and skipping it costs a session.

## Quality bar
- Every objective must be checkable by looking at the learner's output, not by asking if they feel they understood.
- Every section of the spine must earn its place. If two sections make the same argument, merge them.
- If the blueprint's spec for this module already contains a graded moment or an adversarial step, carry it through verbatim. Those were designed deliberately.
