#!/usr/bin/env bash
# Put the fixture's own artifacts into your local Maven repository.
#
# pipeline/local-m2 is declared as a repository in both poms, but Maven treats a
# file:// repository as remote and refuses to read it with -o (offline). Copying
# the artifacts into ~/.m2/repository makes every build resolve them, online or
# off. Idempotent.
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$here"

dest="${MAVEN_LOCAL_REPO:-$HOME/.m2/repository}"
src="pipeline/local-m2/com/meridiancare"

[ -d "$src" ] || { echo "no artifacts at $src" >&2; exit 1; }
mkdir -p "$dest/com/meridiancare"
cp -R "$src/." "$dest/com/meridiancare/"

echo "installed into $dest/com/meridiancare:"
for d in "$dest"/com/meridiancare/*/*/; do
  echo "  $(basename "$(dirname "$d")"):$(basename "$d")"
done
