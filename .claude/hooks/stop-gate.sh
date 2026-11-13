#!/bin/bash
# Stop: for each app with changes, run its fast checks; block finishing while they fail.
# (web e2e is left to `pnpm verify:web` and CI - too slow for every turn.)
input=$(cat)
[ "$(echo "$input" | jq -r '.stop_hook_active // false')" = "true" ] && exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
fail=""
for app in web server; do
  git status --porcelain -- "apps/$app" | grep -q . || continue
  out=$( (cd "apps/$app" && pnpm lint && pnpm format:check && pnpm typecheck && pnpm test) 2>&1 ) \
    || fail+="--- apps/$app checks failed ---"$'\n'"$(echo "$out" | tail -40)"$'\n'
done
if [ -n "$fail" ]; then
  echo "Checks failed - fix before finishing:" >&2
  echo "$fail" >&2
  exit 2
fi
exit 0
