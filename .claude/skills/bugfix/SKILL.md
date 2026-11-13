---
name: bugfix
description: Fix a bug in apps/web and/or apps/server by first reproducing it with a failing test, then the minimal fix, verify and PR. Use for bug reports or regressions.
---

# /bugfix

Input: an issue number/URL or a bug description (steps, expected, actual).

1. **Reproduce.** Find the cause area by reading code and, if it is visual or behavioural, reproducing it in the browser (`.claude/launch.json` configs). For API bugs, reproduce with a request against the server (curl or supertest) and decide which app owns the bug. Write down the root cause hypothesis. If you cannot reproduce it, stop and ask the user for more detail.
2. **Failing test.** Delegate to the `test-writer` subagent: one test at the lowest level that exposes the bug (unit or supertest before e2e), in the app that owns the bug. Confirm it fails with the symptom from the report.
3. **Fix.** Smallest change that fixes the root cause, not the symptom. No drive-by refactors.
4. **Verify.** The new test passes, then run the verify command for each touched app (`pnpm verify:server`, `pnpm verify:web`) until green.
5. **Review.** Run the `code-reviewer` subagent (and `ui-reviewer` for visual bugs). Fix findings.
6. **PR.** Branch `fix/<short-slug>`; PR description: root cause, why the test proves it, how verified. Hand back for merge - never merge yourself.
