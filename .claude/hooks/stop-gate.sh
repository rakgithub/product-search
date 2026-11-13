#!/bin/bash
# Stop: if apps/web changed, run the fast checks; block finishing while they fail.
# (e2e is left to `pnpm verify:web` and CI - too slow for every turn.)
input=$(cat)
[ "$(echo "$input" | jq -r '.stop_hook_active // false')" = "true" ] && exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
git status --porcelain -- apps/web | grep -q . || exit 0
cd apps/web || exit 0
out=$( (pnpm lint && pnpm format:check && pnpm typecheck && pnpm test) 2>&1 ) || {
  echo "Web checks failed - fix before finishing:" >&2
  echo "$out" | tail -40 >&2
  exit 2
}
exit 0
