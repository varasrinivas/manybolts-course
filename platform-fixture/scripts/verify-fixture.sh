#!/usr/bin/env bash
# Check the fixture is in a state the labs can run against.
#
# Uses Maven when it is available. When it is not, falls back to javac, which
# checks the same sources without resolving dependencies from a registry.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$here"
fail=0
note() { printf '  %-46s %s\n' "$1" "$2"; }

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
MVN="$(find_mvn || true)"

echo "Prior Auth fixture check"
echo "------------------------------------------------------------------"

# 1. repositories present and initialised -------------------------------
for repo in priorauth-api priorauth-web priorauth-clinical-rules; do
  if [ -d "repos/$repo" ]; then
    if [ -d "repos/$repo/.git" ]; then note "$repo" "present, git initialised"
    else note "$repo" "present, NOT initialised — run ./scripts/setup.sh"; fail=1; fi
  else
    note "$repo" "MISSING"; fail=1
  fi
done

# 2. java build ----------------------------------------------------------
out="$(mktemp -d)"
if [ -n "$MVN" ]; then
  note "build tool" "maven ($MVN)"
  (cd repos/priorauth-clinical-rules && "$MVN" -q -o package -DskipTests) >/dev/null 2>&1 \
    && note "clinical-rules package" "ok" || { note "clinical-rules package" "FAILED"; fail=1; }
  (cd repos/priorauth-api && "$MVN" -q -o package -DskipTests) >/dev/null 2>&1 \
    && note "priorauth-api package" "ok" || { note "priorauth-api package" "FAILED"; fail=1; }
else
  note "build tool" "javac fallback (no maven found; set MAVEN_HOME to use it)"
  srcs=$(find repos/priorauth-web/tokens-java/src/main/java \
              repos/priorauth-clinical-rules/src/main/java \
              repos/priorauth-api/src/main/java -name '*.java')
  if javac -nowarn -d "$out" $srcs 2>"$out/javac.log"; then
    note "all java sources compile" "ok ($(echo "$srcs" | wc -l | tr -d ' ') files)"
  else
    note "all java sources compile" "FAILED — see $out/javac.log"; fail=1
  fi
fi

# 3. the web check -------------------------------------------------------
if command -v node >/dev/null 2>&1; then
  resolved=$(node -e "const l=require('./repos/priorauth-web/package-lock.json');console.log(l.packages['node_modules/@meridiancare/clinical-rules'].version)")
  note "web resolves clinical-rules" "$resolved"
else
  note "node" "not on PATH — web checks skipped"
fi

# 4. round-1 patches still apply to trunk --------------------------------
if [ -d repos/priorauth-api/.git ]; then
  for p in appeals-r1 gate-r1 portal-r1 gate-r2 appeals-r2; do
    if git -C repos/priorauth-api apply --check "../../branches/$p.patch" 2>/dev/null; then
      note "branch $p applies to trunk" "ok"
    else
      note "branch $p applies to trunk" "FAILED (is the tree dirty? ./scripts/reset-quarter.sh)"; fail=1
    fi
  done
  # The round-4 break is a patch against the same service the labs edit, so it goes
  # stale silently. M17 and round 4 both start with it.
  if git -C repos/priorauth-api apply --check "../../quarter/round4-break.patch" 2>/dev/null; then
    note "quarter/round4-break applies to trunk" "ok"
  else
    note "quarter/round4-break applies to trunk" "FAILED — M17 and round 4 cannot start"; fail=1
  fi
fi

# 5. fixture content the labs read --------------------------------------
for f in intents/INTENT_APPEALS.md governance/sme-comments.md \
         governance/STEERING.canonical.md registry/UOW_REGISTRY.template.md \
         evidence/auditor-questions.md evidence/PROVENANCE_SCHEMA.v1.json \
         pipeline/cve-db.json quarter/RUBRIC.md; do
  [ -f "$f" ] && note "$f" "present" || { note "$f" "MISSING"; fail=1; }
done

echo "------------------------------------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "GREEN — the fixture is ready. Start at M00."
else
  echo "RED — see the failures above."
fi
exit "$fail"
