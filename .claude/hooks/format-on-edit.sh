#!/bin/bash
# PostToolUse (Edit|Write): format + autofix lint on the edited apps/web file.
# Unfixable lint errors are reported back to the agent (exit 2).
f=$(jq -r '.tool_input.file_path // empty')
[[ "$f" == */apps/web/* ]] || exit 0
[[ "$f" =~ \.(ts|tsx|js|jsx|css|json|md|html)$ ]] || exit 0
[ -f "$f" ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}/apps/web" || exit 0
pnpm exec prettier --write "$f" >/dev/null 2>&1
if [[ "$f" =~ \.(ts|tsx|js|jsx)$ ]]; then
  out=$(pnpm exec eslint --fix "$f" 2>&1) || { echo "$out" >&2; exit 2; }
fi
exit 0
