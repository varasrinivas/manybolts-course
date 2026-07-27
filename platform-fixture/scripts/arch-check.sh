#!/usr/bin/env bash
# Layer-direction check without a dependency resolver. Defaults to the rule M06
# asks for: nothing in ..clinical.. may depend on ..web.. or ..portal..
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$here"
out="$(mktemp -d)"
javac -nowarn -d "$out" scripts/selfcheck/ArchCheck.java
java -cp "$out" ArchCheck "${1:-repos/priorauth-clinical-rules/src/main/java}" \
    "${2:-clinical}" "${3:-web}" "${4:-portal}"
