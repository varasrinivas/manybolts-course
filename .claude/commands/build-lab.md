---
description: Inject a module's dual-path lab
argument-hint: <module-id>
---

# /build-lab $ARGUMENTS

Add the `lab` object to module `$ARGUMENTS`.

## Shape
```js
lab: {
  title: "Encode the SME out of the loop",
  pd: ["PD-8"],                 // or ["PD-NONE"] with justification in the body
  a: `...Path A (Claude Code) HTML...`,
  b: `...Path B (GitHub Copilot) HTML...`
  // engine: 'ENGINE-AGNOSTIC'    when the lab is genuinely engine-independent
  // engine: 'ENGINE-COMPARATIVE' M13 only
}
```

## Requirements
1. **Both paths reach the same deliverable.** Different commands, same artifact, same gate. If Path B cannot reach it, the lab is wrong — redesign it, don't excuse it.
2. **Name the graded moment.** Most labs in this course have an adversarial step where the agent is expected to get something wrong (over-delegate a tier, encode a judgement call, miss an overlap). Make it explicit in the lab body: what the agent will likely do, and what the learner must catch.
3. **Reference the fixture by real paths.** `platform-fixture/...`, real repo names, real class names.
4. **State the gate as an observable artifact**, not a feeling.
5. **Do not include solutions.** If a hint is needed, make it a hint, not the answer.

## Verify
Both panels render; tabs switch; PD chips appear; `pwsh tools/validate-manybolts.ps1 -Module $ARGUMENTS` passes rules 4 and 5.
