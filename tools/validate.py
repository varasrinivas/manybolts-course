#!/usr/bin/env python3
"""
validate.py — structural gates for the Many Bolts player.

Checks that don't depend on module prose (that's validate-manybolts.ps1):
  marker integrity, roster/MODS agreement, hex literals in module HTML,
  storage API usage, visual keys referenced vs defined, script extractability.

Usage: python3 tools/validate.py
Exit:  0 clean, 1 failures
"""
import re
import sys
from pathlib import Path

PLAYER = Path("course/index.html")
fails, warns = [], []


def fail(m):
    fails.append(m)


def warn(m):
    warns.append(m)


def main():
    if not PLAYER.exists():
        sys.exit("error: course/index.html not found (run from the kit root)")
    html = PLAYER.read_text(encoding="utf-8")

    m = re.search(r"<script>(.*)</script>", html, re.S)
    if not m:
        fail("script block not extractable")
        report()
        return
    js = m.group(1)

    # --- markers ---------------------------------------------------------
    opens = re.findall(r"/\* <!--\s*MOD:(M\d\d)\s*--> \*/", html)
    closes = re.findall(r"/\* <!--\s*/MOD:(M\d\d)\s*--> \*/", html)
    if len(opens) != len(closes):
        fail(f"marker mismatch: {len(opens)} open, {len(closes)} close")
    if len(set(opens)) != len(opens):
        fail("duplicate MOD markers")
    if sorted(opens) != sorted(closes):
        fail("open and close markers name different modules")

    # --- roster vs markers ----------------------------------------------
    roster = re.findall(r'\["(M\d\d)","', js)
    if sorted(roster) != sorted(opens):
        missing = set(roster) - set(opens)
        extra = set(opens) - set(roster)
        if missing:
            fail(f"roster entries with no marker: {sorted(missing)}")
        if extra:
            fail(f"markers with no roster entry: {sorted(extra)}")

    # --- built modules ---------------------------------------------------
    built = []
    for mid in opens:
        s = re.search(rf"/\* <!--\s*MOD:{mid}\s*--> \*/", html).end()
        e = re.search(rf"/\* <!--\s*/MOD:{mid}\s*--> \*/", html).start()
        block = html[s:e].strip()
        if not block:
            continue
        built.append(mid)
        if f"id:'{mid}'" not in block.replace(" ", "") and f'id:"{mid}"' not in block.replace(" ", ""):
            fail(f"{mid}: block does not declare id:'{mid}'")
        if "contentionClass" not in block:
            fail(f"{mid}: no contentionClass declared (rule 3)")
        # hex literals in module content
        for hexlit in re.findall(r"#[0-9a-fA-F]{3,8}\b", block):
            fail(f"{mid}: hex literal {hexlit} in module content — use CSS variables")
        if re.search(r"\b(localStorage|sessionStorage)\b", block):
            fail(f"{mid}: uses browser storage — not supported in this player")
        if re.search(r"\son(click|change|input|submit)=", block):
            warn(f"{mid}: inline event handler — attach behaviour in mount(host) instead")

    # --- visuals ---------------------------------------------------------
    referenced = set(re.findall(r'data-viz="([^"]+)"', html))
    vstart = js.find("/* VISUALS:START")
    vend = js.find("/* VISUALS:END")
    defined = set(re.findall(r"case '([^']+)'", js[vstart:vend])) if vstart != -1 < vend else set()
    for key in sorted(referenced - defined):
        fail(f"visual referenced but not defined: {key}")
    for key in sorted(defined - referenced):
        warn(f"visual defined but never referenced: {key}")
    for key in sorted(referenced | defined):
        if not key.startswith("mb_"):
            warn(f"visual key without mb_ prefix: {key}")

    print(f"  modules built: {len(built)}/{len(opens)}  ({', '.join(built) if built else 'none yet'})")
    print(f"  visuals: {len(defined)} defined, {len(referenced)} referenced")
    report()


def report():
    if warns:
        print(f"\nWARNINGS ({len(warns)})")
        for w in warns:
            print(f"  {w}")
    if fails:
        print(f"\nFAILURES ({len(fails)})")
        for f in fails:
            print(f"  {f}")
        print("\nFAIL")
        sys.exit(1)
    print("\nPASS")


if __name__ == "__main__":
    main()
