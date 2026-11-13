# apps/web

React 18 + Vite + TypeScript (strict). Vitest + Testing Library for unit tests, Playwright for e2e.

## Definition of done

Run `pnpm verify:web` from the repo root (lint, prettier, tsc, unit tests with coverage floor, build, e2e).
All steps must pass. Fix the cause; do not weaken thresholds, skip tests, or add `eslint-disable` without a comment saying why.

## Structure

Feature-first under `src/features/<feature>/`:

- `components/<Name>/<Name>.tsx` + `<Name>.module.css` + `<Name>.test.tsx` (one folder per component)
- `hooks/`, `api/`, `utils/` (pure functions), `types.ts`, `index.ts` (public exports only)
- Shared code in `src/lib/`; global styles in `src/styles/global.css`; test fixtures in `src/test/fixtures.ts`.
- Other features import from a feature's `index.ts`, never its internals.

## Conventions

- Named exports, function components, no default exports (except config files).
- Styling: CSS Modules only. No inline styles, no CSS-in-JS, no UI library.
- Network: call the API only through `lib/apiClient` (`apiGet`) from a feature's `api/` module; base path is `/api`, proxied to :3001 by Vite. Pass an `AbortSignal` for cancellable requests.
- Server data shapes live in `apps/server/src/schemas`; mirror them in the feature's `types.ts`.
- Use `import type` for type-only imports (lint-enforced).
- Accessibility is lint-enforced (jsx-a11y): labelled inputs, real buttons, semantic landmarks.
- UI must handle loading, error, and empty states.

## Testing

- Every component, hook, api module and util gets a colocated `*.test.ts(x)`.
- Query by role/label/text (`getByRole`, `getByLabelText`); never by test id or class name.
- Use `userEvent`, not `fireEvent`. Reuse `src/test/fixtures.ts`; mock `fetch`/the api module at the boundary.
- e2e (`e2e/*.spec.ts`) runs against the real API and Vite server; add one only for a user-visible flow. Use role-based locators and web-first assertions (`await expect(...)`), no fixed sleeps.
- Coverage floor is in `vite.config.ts` (80% lines/functions, 75% branches); new code should not lower it.

## UI work

For new or restyled UI, follow the `frontend-design` skill, then check it in the browser: start the `web` + `server` launch configs and look at the page at desktop and mobile widths.
