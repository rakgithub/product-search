---
name: feature
description: Build a new feature or change in apps/web end to end - spec, plan (user approves), tests first, implement, verify, review, PR. Use for any non-trivial web feature request or issue.
---

# /feature

Input: an issue number/URL or a description of the feature. Follow the steps in order and do not skip the approval gate.

1. **Spec.** Restate the request as: user story, acceptance criteria (testable bullets), API contract (existing endpoint? new fields in `apps/server/src/schemas`?), and out-of-scope. If the API needs to change, say so - that is a separate decision.
2. **Plan.** Read `apps/web/CLAUDE.md`, then the nearest existing feature code. List files to create/change and the test plan. **Stop and ask the user to approve the plan before writing code.**
3. **Branch.** Create `feature/<short-slug>` from main (use a worktree if other work is in flight).
4. **Tests first.** Delegate to the `test-writer` subagent with the acceptance criteria. Confirm the new tests fail for the right reason.
5. **Implement.** Make the tests pass with the smallest change that follows the conventions. For UI, follow the `frontend-design` skill. Hooks will format and lint as you edit.
6. **Verify.** Run `pnpm verify:web` (lint, format, typecheck, coverage, build, e2e). Fix causes; never weaken checks. Repeat until green.
7. **Review.** Run the `code-reviewer` subagent on the diff and, if any UI changed, the `ui-reviewer` subagent. Fix blockers and should-fix items, then re-run `pnpm verify:web`.
8. **PR.** Commit in small logical commits, push, and open a PR: summary, acceptance criteria checklist, screenshots for UI changes, and the `pnpm verify:web` result. Then hand back to the user for merge - never merge yourself.
