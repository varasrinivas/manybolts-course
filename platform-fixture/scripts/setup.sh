#!/usr/bin/env bash
# Prepare the three service repositories.
#
# The fixture ships the repositories inside repos/. This script turns each into a
# git repository with a trunk commit so branches, patches and resets behave the way
# the labs describe. Set MERIDIAN_REMOTE to clone from a host instead.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$here"

repos=(priorauth-api priorauth-web priorauth-clinical-rules)

echo "Preparing repositories in $here/repos"

for repo in "${repos[@]}"; do
  if [ -n "${MERIDIAN_REMOTE:-}" ] && [ ! -d "repos/$repo" ]; then
    echo "  cloning $repo from $MERIDIAN_REMOTE"
    git clone --quiet "$MERIDIAN_REMOTE/$repo" "repos/$repo"
  fi

  if [ ! -d "repos/$repo" ]; then
    echo "  ERROR: repos/$repo is missing and MERIDIAN_REMOTE is not set" >&2
    exit 1
  fi

  if [ -d "repos/$repo/.git" ]; then
    echo "  $repo already initialised"
    continue
  fi

  git -C "repos/$repo" init --quiet -b trunk
  git -C "repos/$repo" config user.email "you@example.com"
  git -C "repos/$repo" config user.name "$(git config --global user.name || echo 'Platform Lead')"
  git -C "repos/$repo" add -A
  git -C "repos/$repo" commit --quiet -m "trunk: fixture baseline"
  git -C "repos/$repo" tag fixture-baseline
  echo "  $repo initialised at trunk"
done

mkdir -p records

if command -v java >/dev/null 2>&1; then
  echo
  ./scripts/install-artifacts.sh
fi

echo
echo "Done. Next: ./scripts/verify-fixture.sh"
