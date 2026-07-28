#!/usr/bin/env python3
"""
build_learner_bundle.py — emit the student tree from the authoring kit.

The kit is the source of truth and stays private. This regenerates the learner
bundle from it so the two cannot drift: the player, the fixture, the licence,
and a student README. Everything that would spoil a lab or expose the authoring
material is left behind — see EXCLUDED below.

The bundle needs no network and no GitHub. Nothing in the course pushes, fetches
or clones; setup.sh initialises the three repos locally.

Usage: python3 tools/build_learner_bundle.py [--out DIR] [--force] [--zip]
                                             [--solutions include|exclude]
Exit:  0 built and verified, 1 refused or a post-build check failed
"""
import argparse
import shutil
import stat
import sys
import zipfile
from pathlib import Path

OUT_DEFAULT = Path("dist/manybolts-course-labs")

# Copied verbatim. Anything not named here or under FIXTURE stays in the kit.
FILES = [
    Path("course/index.html"),   # self-contained; glossary.md is inlined by sync_glossary.py
    Path("LICENSE"),
    Path(".gitattributes"),      # keeps patches applying if the bundle is pushed as a repo
]
FIXTURE = Path("platform-fixture")

# Pruned anywhere under the fixture.
EXCLUDED_DIRS = {
    ".git",           # the three repos are shipped inert; setup.sh inits them
    "target",         # maven output
    "node_modules",
    "__pycache__",
    "records",        # worked answers: the audit reply, the postmortem, the scored retro
}
EXCLUDED_SUFFIXES = {".bak", ".pyc"}

# Learner-facing text points at .solutions/ (M00, M21, break-round4.sh) but the kit
# README calls it "exclude from the learner bundle". Excluded by default; the flag
# exists because that contradiction is the author's to settle, not this script's.
SOLUTIONS = FIXTURE / ".solutions"

# Written into the bundle so publishing it after a verify run does not commit build output.
BUNDLE_GITIGNORE = """\
# build output from the fixture repos
target/
node_modules/

*.bak
"""

STUDENT_README = """\
# Many Bolts, One Codebase — labs

An advanced course on running AI-DLC across several teams and one shared platform.

## The course

Open `course/index.html` in a browser. That is the whole player — 22 modules, no
build step, no server, no install. Progress is session-only by design, so finish a
module before closing the tab.

## The labs

The labs run against a fixture of three repositories: a Spring Boot service, a React
portal, and a Java library consumed by both. Prepare it once:

```bash
cd platform-fixture
bash ./scripts/setup.sh            # inits each repo at trunk, tags fixture-baseline
bash ./scripts/verify-fixture.sh   # expect GREEN
```

`setup.sh` needs git. The build checks additionally need a JDK and Maven; without
them `verify-fixture.sh` skips the packaging lines and still reports GREEN.

Nothing here talks to the network. You never push, and you need no GitHub account.

## Before you touch anything

**The repositories contain twelve planted defects, and they are curriculum.** A
duplicate migration, an unowned library, a version pin that silently discards
another mob's work. When a lab says something is broken, it is broken deliberately.

Do not fix what you were not asked to fix. If a build fails and looks like a bug,
it is probably the lab.

## Resetting

The capstone changes the repositories. To get back to a known state:

```bash
bash ./scripts/reset-quarter.sh    # back to fixture-baseline, extra branches dropped
```

## Licence

Proprietary — see [LICENSE](LICENSE). Yours to study and run. Redistributing it,
adapting it, or teaching from it needs written permission.
"""


def copy_tree(src: Path, dst: Path, keep_solutions: bool) -> int:
    """Copy src into dst, pruning EXCLUDED_*. Returns files written."""
    n = 0
    for path in sorted(src.rglob("*")):
        rel = path.relative_to(src)
        if any(part in EXCLUDED_DIRS for part in rel.parts):
            continue
        if not keep_solutions and (src / rel).is_relative_to(SOLUTIONS):
            continue
        if path.is_dir():
            continue
        if path.suffix in EXCLUDED_SUFFIXES:
            continue
        target = dst / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, target)
        n += 1
    return n


def executable(rel: Path) -> bool:
    """Scripts the learner runs. Windows loses the bit; the zip carries it."""
    return rel.suffix == ".sh" or rel.name == "mvnw"


def verify(out: Path, keep_solutions: bool) -> list[str]:
    """Post-build checks. Cheaper to fail here than in front of a class."""
    problems = []
    present = {p.relative_to(out).as_posix() for p in out.rglob("*") if p.is_file()}

    for required in [
        "course/index.html",
        "LICENSE",
        "README.md",
        "platform-fixture/scripts/setup.sh",
        "platform-fixture/scripts/verify-fixture.sh",
        "platform-fixture/scripts/reset-quarter.sh",
        "platform-fixture/repos/priorauth-api/pom.xml",
        "platform-fixture/repos/priorauth-web/package.json",
        "platform-fixture/repos/priorauth-clinical-rules/pom.xml",
        "platform-fixture/branches/gate-r1.patch",
        "platform-fixture/quarter/RUBRIC.md",
    ]:
        if required not in present:
            problems.append(f"missing: {required}")

    for spoiler in sorted(p for p in present if p.startswith("platform-fixture/records/")):
        problems.append(f"worked answer leaked: {spoiler}")
    if not keep_solutions:
        for spoiler in sorted(p for p in present if p.startswith("platform-fixture/.solutions/")):
            problems.append(f"answer key leaked: {spoiler}")

    for authoring in ("plans/", "staged/", "tools/", ".claude/", "CLAUDE.md", "PROGRESS.md"):
        for leak in sorted(p for p in present if p.startswith(authoring)):
            problems.append(f"authoring material leaked: {leak}")

    for repo in ("priorauth-api", "priorauth-web", "priorauth-clinical-rules"):
        if not any(p.startswith(f"platform-fixture/repos/{repo}/.git/") for p in present):
            continue
        problems.append(f"{repo}/.git copied — the bundle must ship inert")

    return problems


def write_zip(out: Path, dest: Path) -> int:
    n = 0
    with zipfile.ZipFile(dest, "w", zipfile.ZIP_DEFLATED) as z:
        for path in sorted(out.rglob("*")):
            if not path.is_file():
                continue
            rel = path.relative_to(out)
            info = zipfile.ZipInfo(f"{out.name}/{rel.as_posix()}")
            mode = 0o755 if executable(rel) else 0o644
            info.external_attr = (stat.S_IFREG | mode) << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, path.read_bytes())
            n += 1
    return n


def main() -> int:
    ap = argparse.ArgumentParser(description="Emit the learner bundle from the kit.")
    ap.add_argument("--out", type=Path, default=OUT_DEFAULT, help=f"default {OUT_DEFAULT}")
    ap.add_argument("--force", action="store_true", help="replace an existing bundle")
    ap.add_argument("--zip", action="store_true", help="also write <out>.zip")
    ap.add_argument("--solutions", choices=("include", "exclude"), default="exclude",
                    help="ship .solutions/ (default: exclude)")
    args = ap.parse_args()

    if not (Path("course/index.html").exists() and FIXTURE.is_dir()):
        print("run me from the kit root", file=sys.stderr)
        return 1

    out = args.out
    if out.exists():
        if not args.force:
            print(f"{out} exists - pass --force to replace it", file=sys.stderr)
            return 1
        shutil.rmtree(out)
    out.mkdir(parents=True)

    keep_solutions = args.solutions == "include"

    n = 0
    for rel in FILES:
        (out / rel).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(rel, out / rel)
        n += 1
    n += copy_tree(FIXTURE, out / FIXTURE, keep_solutions)
    (out / "README.md").write_text(STUDENT_README, encoding="utf-8", newline="\n")
    (out / ".gitignore").write_text(BUNDLE_GITIGNORE, encoding="utf-8", newline="\n")
    n += 2

    problems = verify(out, keep_solutions)
    if problems:
        print(f"FAILED - {out}", file=sys.stderr)
        for p in problems:
            print(f"  {p}", file=sys.stderr)
        return 1

    print(f"{out} - {n} files")
    print(f"  .solutions/    {'included' if keep_solutions else 'excluded'}")
    print(f"  records/       excluded (worked answers)")
    print(f"  authoring      excluded (plans, staged, tools, .claude, CLAUDE.md, PROGRESS.md)")
    if args.zip:
        dest = out.with_suffix(".zip")
        print(f"{dest} - {write_zip(out, dest)} files, scripts marked executable")
    if not keep_solutions:
        print("\nnote: M00, M21 and break-round4.sh refer learners to .solutions/,")
        print("      which this bundle does not carry. --solutions include ships it.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
