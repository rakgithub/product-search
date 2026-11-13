#!/bin/bash
# PostToolUse (Edit|Write): format + autofix lint on the edited file in apps/web or apps/server.
# Unfixable lint errors are reported back to the agent (exit 2).
f=$(jq -r '.tool_input.file_path // empty')
case "$f" in
  */apps/web/*) app=web ;;
  */apps/server/*) app=server ;;
  *) exit 0 ;;
esac
[[ "$f" =~ \.(ts|tsx|js|jsx|css|json|md|html)$ ]] || exit 0
[ -f "$f" ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}/apps/$app" || exit 0
pnpm exec prettier --write "$f" >/dev/null 2>&1
if [[ "$f" =~ \.(ts|tsx|js|jsx)$ ]]; then
  out=$(pnpm exec eslint --fix "$f" 2>&1) || { echo "$out" >&2; exit 2; }
fi
exit 0
