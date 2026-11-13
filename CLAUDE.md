# product-search

pnpm monorepo: `apps/web` (React 18 + Vite + TypeScript) and `apps/server` (Express + zod, port 3001).
Each app has its own conventions: `apps/web/CLAUDE.md` and `apps/server/CLAUDE.md`. Read the one for the app you are changing.

## Commands (run from repo root)

- `pnpm dev` - web (5173) and API (3001) together
- `pnpm verify:web` / `pnpm verify:server` - the definition of done per app; `pnpm verify` runs both
- `pnpm test:server`, `pnpm typecheck`, `pnpm build`

## Rules

- Do not add dependencies without asking.
- Do not edit `pnpm-lock.yaml` by hand; use `pnpm add`.
- Never commit `dist`, `coverage`, `test-results`.
- `.agents/skills` is managed by `skills-lock.json`; `.claude/skills/*` are symlinks into it. Do not edit skills in place.
