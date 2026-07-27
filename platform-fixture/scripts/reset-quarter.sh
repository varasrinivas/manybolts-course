#!/usr/bin/env bash
# Return the fixture to trunk. Safe to run from a dirty tree, and idempotent.
#
#   ./scripts/reset-quarter.sh              repos back to trunk, records kept
#   ./scripts/reset-quarter.sh --records    also clear records/
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$here"

for repo in priorauth-api priorauth-web priorauth-clinical-rules; do
  if [ -d "repos/$repo/.git" ]; then
    git -C "repos/$repo" checkout --quiet trunk 2>/dev/null || true
    git -C "repos/$repo" reset --quiet --hard fixture-baseline
    git -C "repos/$repo" clean --quiet -fd
    for b in $(git -C "repos/$repo" branch --format='%(refname:short)' | grep -v '^trunk$' || true); do
      git -C "repos/$repo" branch -qD "$b" || true
    done
    echo "  $repo reset to trunk"
  else
    echo "  $repo has no git repository — run ./scripts/setup.sh"
  fi
done

if [ "${1:-}" = "--records" ]; then
  find records -type f ! -name '.gitkeep' -delete 2>/dev/null || true
  echo "  records/ cleared"
else
  echo "  records/ kept (pass --records to clear)"
fi

echo "Reset complete."
