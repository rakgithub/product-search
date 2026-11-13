# product-search

pnpm monorepo: `apps/web` (React 18 + Vite + TypeScript) and `apps/server` (Express + zod, port 3001).
Work in `apps/web` unless the task says otherwise; see `apps/web/CLAUDE.md`.

## Commands (run from repo root)

- `pnpm dev` - web (5173) and API (3001) together
- `pnpm verify:web` - the definition of done for web changes (see below)
- `pnpm test:server`, `pnpm typecheck`, `pnpm build`

## Rules

- Do not add dependencies without asking.
- Do not edit `pnpm-lock.yaml` by hand; use `pnpm add`.
- Never commit `dist`, `coverage`, `test-results`.
- `.agents/skills` is managed by `skills-lock.json`; `.claude/skills/*` are symlinks into it. Do not edit skills in place.
