---
description: Inject a module's body and visuals into the player
argument-hint: <module-id>
---

# /build-module $ARGUMENTS

Write the module object and its `renderVisual` cases, then inject.

## Read first
`plans/modules/$ARGUMENTS_SPEC.md`, `CLAUDE.md`, and the current `course/index.html` MODS shape.

## Build
1. Compose the module object: `id, title, track, audience, contentionClass, duration, body, visuals`, plus `mount` if any visual is interactive.
2. `body` is HTML using the shell's classes: `h3`, `h4`, `p`, `ul`, `table`, `pre`, `blockquote`, `.callout`, `.callout.honest-limit`.
3. Visual placeholders in the body: `<div data-viz="mb_key"></div>`.
4. Write one `case` per key inside the `VISUALS:START` / `VISUALS:END` block, returning a `.viz` wrapper. **CSS variables only — no hex literals.**
5. Interactive visuals: markup and controls in the `case`, behaviour in the module's `mount(host)`. No inline handlers.
6. Inject: `python3 tools/inject_module.py --module $ARGUMENTS --file <staged.js>`.

## Do not
- Build the lab. That is `/build-lab`.
- Hand-edit between MOD markers.
- Use `localStorage` or `sessionStorage`. They do not work here.
- Soften an honest-limit section into a balanced-sounding caveat. State the limit.

## Verify before finishing
```bash
python3 tools/validate.py
node --check <(python3 -c "import re,sys;print(re.search(r'<script>(.*)</script>',open('course/index.html').read(),re.S).group(1))")
```
Report: module injected, visual keys added, any spec item you could not build and why.
