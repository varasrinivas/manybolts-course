#!/usr/bin/env bash
# Run the DeterminationServiceIT assertion N times and report the failure count.
#
# PD-6 is a race, so the rate moves with machine load — anywhere from a few in
# twenty to most of twenty. What has to hold is that it is INTERMITTENT: neither
# always green (nothing to find) nor always red (not a flake, just broken).
# Used by M10.
#
#   ./scripts/flake-check.sh              20 runs via javac, no Maven needed (seconds)
#   ./scripts/flake-check.sh 20 --maven   20 real `mvn verify` runs (a few minutes)
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$here"
runs="${1:-20}"
mode="${2:-javac}"

# Find Maven: MAVEN_HOME, M2_HOME, PATH, then the usual install locations.
find_mvn() {
  if [ -n "${MAVEN_HOME:-}" ] && [ -x "$MAVEN_HOME/bin/mvn" ]; then echo "$MAVEN_HOME/bin/mvn"; return 0; fi
  if [ -n "${M2_HOME:-}" ] && [ -x "$M2_HOME/bin/mvn" ]; then echo "$M2_HOME/bin/mvn"; return 0; fi
  if command -v mvn >/dev/null 2>&1; then command -v mvn; return 0; fi
  for base in "/c/Program Files/Maven" /c/Program\ Files/apache-maven* /c/apache-maven* \
              /c/tools/apache-maven* /d/softwares/apache-maven* /d/apache-maven* \
              /opt/maven /usr/local/maven "$HOME/Downloads/apache-maven"* "$HOME/apache-maven"*; do
    for cand in $base; do
      [ -x "$cand/bin/mvn" ] && { echo "$cand/bin/mvn"; return 0; }
    done
  done
  return 1
}

if [ "$mode" = "--maven" ]; then
  MVN="$(find_mvn || true)"
  [ -n "$MVN" ] || { echo "maven not found — set MAVEN_HOME, or drop --maven for the javac path" >&2; exit 2; }
  echo "runner: $MVN verify  (the real thing, roughly 6 seconds per run)"
  fails=0
  for i in $(seq 1 "$runs"); do
    if (cd repos/priorauth-api && "$MVN" -B -o -q verify) >/dev/null 2>&1; then
      printf '.'
    else
      printf 'F'; fails=$((fails + 1))
    fi
  done
  echo
  echo "runs=$runs failures=$fails"
  if [ "$fails" -eq 0 ]; then
    echo "PD-6 NEVER fired in $runs runs — the race is not reachable here; investigate before teaching M10"
    exit 1
  elif [ "$fails" -eq "$runs" ]; then
    echo "PD-6 fired on EVERY run — that is broken, not flaky; investigate before teaching M10"
    exit 1
  else
    echo "PD-6 intermittent: $fails of $runs. Rate moves with load; the lesson is the intermittency."
  fi
  exit 0
fi

out="$(mktemp -d)"
javac -nowarn -d "$out" $(find repos/priorauth-web/tokens-java/src/main/java \
                               repos/priorauth-clinical-rules/src/main/java \
                               repos/priorauth-api/src/main/java -name '*.java')
javac -nowarn -d "$out" -cp "$out" scripts/selfcheck/FlakeProbe.java
java -cp "$out" FlakeProbe "$runs"
