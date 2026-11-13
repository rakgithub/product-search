# apps/server

Express 4 + TypeScript (strict, ESM / NodeNext) + zod. In-memory catalogue, no database. Port 3001.

## Definition of done

Run `pnpm verify:server` from the repo root (lint, prettier, tsc, tests with coverage floor, build).
Fix the cause; do not weaken thresholds, skip tests, or add `eslint-disable` without a comment saying why.

## Structure (request flows top to bottom)

- `routes/` - wire paths to controllers and attach `validateQuery(schema)`. No logic. Register in `routes/index.ts`.
- `controllers/` - thin: read validated input from `res.locals.query`, call a service, `res.json(...)`. No business logic.
- `services/` - pure business logic over data (`searchProducts(query, source = catalogue)`); no Express types.
- `schemas/` - zod schemas are the single source of truth for input AND response shapes; infer TS types from them.
- `openapi/` - every endpoint is registered in `openapi/document.ts` using the zod schemas. A new/changed route is not done until its OpenAPI entry is.
- `middleware/`, `errors/` - `AppError(statusCode, message, details?)` for expected failures; the central `errorHandler` formats them. Never send error responses ad hoc from controllers.
- `data/`, `types/`, `config/` - catalogue, shared types, env (`config/env.ts`).

## Conventions

- ESM with NodeNext: relative imports MUST end in `.js` (e.g. `../services/search.service.js`).
- `import type` for type-only imports (lint-enforced). No `console.log` (lint warns); only `src/index.ts` may log startup.
- Validate all external input (query, params, body) with zod via middleware; services receive already-parsed, typed values.
- Prefer small pure functions that take their data source as a parameter so tests can inject fixtures.
- Response shape changes are API contract changes: update the zod schema, OpenAPI doc, and the web types (`apps/web/src/features/*/types.ts`) together, and say so in the PR.
- No new dependencies without asking.

## Testing

- Vitest. Colocate `*.test.ts` next to the file.
- Services/schemas/middleware: plain unit tests with injected data.
- Routes: `supertest` against `createApp()` (no real port). Assert status, body shape, and error cases (400 for invalid input, 404 for unknown route).
- Every new route needs: happy path, each validation failure, and an OpenAPI doc assertion if it is documented.
- Coverage floor is in `vitest.config.ts` (80% lines/functions, 75% branches); new code should not lower it.
