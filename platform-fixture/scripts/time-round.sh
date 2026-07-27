#!/usr/bin/env bash
# Capture a round of The Quarter.
#
#   ./scripts/time-round.sh 1 start
#   ./scripts/time-round.sh 1 end
#
# Writes records/quarter/round-N.json with the eight scored dimensions. The
# counted ones are filled in automatically; the judged ones are left for you.
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$here"
round="${1:?round number}"
action="${2:?start|end}"
mkdir -p records/quarter
f="records/quarter/round-${round}.json"

now() { date -u +%Y-%m-%dT%H:%M:%SZ; }

landed() { git -C repos/priorauth-api log --oneline trunk..HEAD 2>/dev/null | wc -l | tr -d ' '; }
flags() { grep -ro "FLAG_[A-Z_]*" repos/priorauth-api/src 2>/dev/null | wc -l | tr -d ' '; }
provenance() { wc -l < evidence/provenance-records.jsonl | tr -d ' '; }

case "$action" in
  start)
    cat > "$f" <<JSON
{
  "round": ${round},
  "startedAt": "$(now)",
  "start": { "boltsLanded": $(landed), "flags": $(flags), "provenanceRecords": $(provenance) }
}
JSON
    echo "round ${round} started — $f"
    ;;
  end)
    [ -f "$f" ] || { echo "no start record for round ${round}" >&2; exit 1; }
    python - "$f" <<PY
import json, subprocess, sys, datetime
p = sys.argv[1]
d = json.load(open(p))
def sh(cmd):
    try: return subprocess.run(cmd, shell=True, capture_output=True, text=True).stdout.strip()
    except Exception: return ""
d["endedAt"] = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
d["counted"] = {
  "boltsLanded": int(sh("git -C repos/priorauth-api log --oneline trunk..HEAD | wc -l") or 0),
  "flagsLive": int(sh('grep -ro "FLAG_[A-Z_]*" repos/priorauth-api/src | wc -l') or 0),
  "provenanceRecords": int(sh("wc -l < evidence/provenance-records.jsonl") or 0),
}
d["judged"] = {
  "validatorQueueHours": None,
  "contractBreakages": None,
  "crossRepoBreakages": None,
  "steeringDriftEvents": None,
  "evidenceCompletenessPct": None,
  "securityQueueDepth": None,
  "note": "fill these in from your round notes before scoring"
}
json.dump(d, open(p, "w"), indent=2)
print("round", d["round"], "recorded:", p)
PY
    ;;
  *) echo "usage: time-round.sh N start|end" >&2; exit 2 ;;
esac
