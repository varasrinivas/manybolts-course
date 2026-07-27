#!/usr/bin/env python3
"""
sync_glossary.py — inline course/glossary.md into the player.

The player is opened as a local file, so it cannot fetch() the markdown at
runtime. glossary.md stays the single source of truth; this script regenerates
the GLOSSARY array between the GLOSSARY:START / GLOSSARY:END markers in
course/index.html. Run it after editing glossary.md.

Usage: python3 tools/sync_glossary.py [--check]
Exit:  0 in sync (or written), 1 if --check and the player is stale
"""
import json
import re
import sys
from pathlib import Path

PLAYER = Path("course/index.html")
GLOSSARY = Path("course/glossary.md")


def parse(md: str):
    """[(section, [(term, definition), ...]), ...] from the markdown."""
    sections, current = [], None
    for line in md.splitlines():
        h = re.match(r"##\s+(.*)", line)
        if h:
            current = (h.group(1).strip(), [])
            sections.append(current)
            continue
        m = re.match(r"\*\*(.+?)\*\*\s+—\s+(.*)", line.strip())
        if m and current is not None:
            term, defn = m.group(1).strip(), m.group(2).strip()
            defn = re.sub(r"\[\[([^\]]+)\]\]", r"\1", defn)
            defn = re.sub(r"`([^`]+)`", r"<code>\1</code>", defn)
            defn = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", defn)
            defn = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", defn)
            current[1].append((term, defn))
    return [s for s in sections if s[1]]


def build(sections) -> str:
    rows = [{"section": name, "terms": [{"t": t, "d": d} for t, d in terms]}
            for name, terms in sections]
    return "const GLOSSARY = " + json.dumps(rows, ensure_ascii=False, indent=1) + ";"


def main():
    if not PLAYER.exists() or not GLOSSARY.exists():
        sys.exit("error: run from the kit root")
    payload = build(parse(GLOSSARY.read_text(encoding="utf-8")))
    html = PLAYER.read_text(encoding="utf-8")
    m = re.search(r"(/\* GLOSSARY:START \*/)(.*?)(/\* GLOSSARY:END \*/)", html, re.S)
    if not m:
        sys.exit("error: GLOSSARY:START / GLOSSARY:END markers not found in the player")
    current = m.group(2).strip()
    if "--check" in sys.argv:
        if current != payload:
            print("  glossary out of sync — run: python3 tools/sync_glossary.py")
            sys.exit(1)
        print("  glossary in sync")
        return
    html = html[:m.start(2)] + "\n" + payload + "\n" + html[m.end(2):]
    PLAYER.write_text(html, encoding="utf-8")
    terms = sum(len(s["terms"]) for s in json.loads(payload[len("const GLOSSARY = "):-1]))
    print(f"  glossary synced: {terms} terms in {payload.count('section')} sections")


if __name__ == "__main__":
    main()
