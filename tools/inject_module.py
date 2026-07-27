#!/usr/bin/env python3
"""
inject_module.py — incremental module injection for the Many Bolts player.

Replaces the content between a module's MOD markers, and optionally appends
renderVisual() cases inside the VISUALS:START / VISUALS:END block. Never
touches anything else in course/index.html.

Usage:
  python3 tools/inject_module.py --module M05 --file staged/M05.js
  python3 tools/inject_module.py --module M05 --file staged/M05.js --visuals staged/M05_visuals.js
  python3 tools/inject_module.py --module M05 --show
  python3 tools/inject_module.py --list
"""
import argparse
import re
import shutil
import sys
from pathlib import Path

PLAYER = Path("course/index.html")


def read_player(path: Path) -> str:
    if not path.exists():
        sys.exit(f"error: {path} not found (run from the kit root)")
    return path.read_text(encoding="utf-8")


def marker_span(html: str, mod_id: str):
    open_m = re.search(rf"/\* <!--\s*MOD:{mod_id}\s*--> \*/", html)
    close_m = re.search(rf"/\* <!--\s*/MOD:{mod_id}\s*--> \*/", html)
    if not open_m or not close_m:
        sys.exit(f"error: markers for {mod_id} not found")
    if close_m.start() < open_m.end():
        sys.exit(f"error: markers for {mod_id} are out of order")
    return open_m.end(), close_m.start()


def check_balance(js: str, mod_id: str):
    """Cheap structural check before we write anything."""
    pairs = {"{": "}", "[": "]", "(": ")"}
    stack = []
    in_str = None
    esc = False
    for ch in js:
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == in_str:
                in_str = None
            continue
        if ch in "\"'`":
            in_str = ch
        elif ch in pairs:
            stack.append(pairs[ch])
        elif ch in pairs.values():
            if not stack or stack.pop() != ch:
                sys.exit(f"error: unbalanced brackets in {mod_id} payload")
    if stack:
        sys.exit(f"error: unclosed brackets in {mod_id} payload")


def inject_visuals(html: str, cases: str) -> str:
    start = html.find("/* VISUALS:START")
    end = html.find("/* VISUALS:END")
    if start == -1 or end == -1:
        sys.exit("error: VISUALS:START / VISUALS:END block not found")
    line_end = html.find("*/", start) + 2
    existing = html[line_end:end]
    # skip cases already present
    new = []
    for block in re.split(r"(?=case ')", cases):
        if not block.strip():
            continue
        key = re.match(r"case '([^']+)'", block.strip())
        if key and f"case '{key.group(1)}'" in existing:
            print(f"  skip visual (already present): {key.group(1)}")
            continue
        new.append(block.rstrip())
    if not new:
        return html
    payload = "\n" + "\n".join(new) + "\n\n    "
    return html[:end] + payload + html[end:]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--module", help="module id, e.g. M05")
    ap.add_argument("--file", help="file containing the module object literal")
    ap.add_argument("--visuals", help="file containing renderVisual case blocks")
    ap.add_argument("--player", default=str(PLAYER))
    ap.add_argument("--show", action="store_true", help="print current content for --module")
    ap.add_argument("--list", action="store_true", help="list built vs empty slots")
    ap.add_argument("--no-backup", action="store_true")
    args = ap.parse_args()

    player = Path(args.player)
    html = read_player(player)

    if args.list:
        ids = sorted(set(re.findall(r"/\* <!--\s*MOD:(M\d\d)\s*--> \*/", html)))
        for mid in ids:
            s, e = marker_span(html, mid)
            built = "built" if html[s:e].strip() else "empty"
            print(f"  {mid}  {built}")
        return

    if not args.module:
        sys.exit("error: --module required")

    s, e = marker_span(html, args.module)

    if args.show:
        body = html[s:e].strip()
        print(body if body else f"({args.module} is empty)")
        return

    if not args.file:
        sys.exit("error: --file required")

    payload = Path(args.file).read_text(encoding="utf-8").strip()
    if not payload:
        sys.exit("error: payload is empty")
    check_balance(payload, args.module)
    if not payload.endswith(","):
        payload += ","

    if not args.no_backup:
        shutil.copy2(player, player.with_suffix(".html.bak"))

    was_built = bool(html[s:e].strip())
    html = html[:s] + "\n" + payload + "\n" + html[e:]
    print(f"  {'replaced' if was_built else 'injected'} {args.module} ({len(payload)} bytes)")

    if args.visuals:
        cases = Path(args.visuals).read_text(encoding="utf-8").strip()
        check_balance(cases, f"{args.module} visuals")
        before = html
        html = inject_visuals(html, cases)
        if html != before:
            keys = re.findall(r"case '([^']+)'", cases)
            print(f"  visuals added: {', '.join(keys)}")

    player.write_text(html, encoding="utf-8")

    # post-write sanity: script block must still be extractable
    m = re.search(r"<script>(.*)</script>", html, re.S)
    if not m:
        sys.exit("error: script block broken after injection — restore from .bak")
    print("  ok — now run: python3 tools/validate.py")


if __name__ == "__main__":
    main()
