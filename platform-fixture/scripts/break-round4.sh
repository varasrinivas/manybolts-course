#!/usr/bin/env bash
# Fast-forward the fixture to round-4 state and inject the live break.
#
# You do not need to have played rounds 1 to 3. This applies the work three mobs
# landed, then introduces the production symptom M17 investigates.
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$here"
api=repos/priorauth-api

[ -d "$api/.git" ] || { echo "run ./scripts/setup.sh first" >&2; exit 1; }

echo "Fast-forwarding to round-4 state..."
git -C "$api" reset --quiet --hard fixture-baseline
git -C "$api" clean --quiet -fd

git -C "$api" apply ../../branches/appeals-r1.patch
git -C "$api" -c user.email=f@x -c user.name=fixture commit --quiet -am "UOW-41 appeal states (appeals, 6 weeks ago)"
git -C "$api" apply --3way ../../branches/gate-r2.patch 2>/dev/null || git -C "$api" apply ../../branches/gate-r2.patch
git -C "$api" -c user.email=f@x -c user.name=fixture commit --quiet -am "UOW-47 consume clinical-rules 2.8 (gate, 6 weeks ago)"
git -C "$api" apply ../../branches/appeals-r2.patch
git -C "$api" -c user.email=f@x -c user.name=fixture commit --quiet -am "UOW-43 appeal deadline reminders (appeals, 4 weeks ago)"

echo "Injecting the break..."
if ! git -C "$api" apply ../../quarter/round4-break.patch; then
  echo "" >&2
  echo "ERROR: quarter/round4-break.patch does not apply to this trunk." >&2
  echo "The service has changed since the patch was generated. Regenerate it before" >&2
  echo "running M17 or round 4 — see .solutions/PLANTED_DEFECTS.md." >&2
  exit 1
fi
git -C "$api" -c user.email=f@x -c user.name=fixture commit --quiet -am "UOW-49 threshold read simplification (gate, 6 weeks ago)"

cat <<'TXT'

02:40. Sev-2 raised by clinical operations.

  Determinations are being auto-approved that should have gone to nurse review.
  Volume of auto-approvals is up roughly 40% since the middle of last month.
  Nobody on the call wrote the code in the suspect path.

Provenance is in evidence/provenance-records.jsonl.
Start your clock. The time box is 60 minutes.
TXT
