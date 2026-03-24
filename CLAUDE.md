# CLAUDE.md

## Project Snapshot

`mailing-api` is a small Express service for sending transactional emails through AWS SES. The public surface is intentionally narrow: one health endpoint and one mail-sending endpoint.

## Stack

- Node.js 20+
- Express
- AWS SES SDK
- Vitest + Supertest
- Fly.io deployment

## Important Paths

- `src/app.js` Express app bootstrap and middleware wiring
- `src/routes/` HTTP route definitions
- `src/controllers/` request handlers
- `src/services/` SES integration and mail sending logic
- `src/config/env.js` environment parsing and compatibility handling
- `tests/` API and service-level automated tests

## Commands

```bash
npm install
npm run dev
npm run test
npm run test:coverage
```

## Working Rules

- Preserve the `/mail/send` and `/health` contracts unless there is an explicit API versioning decision.
- Keep validation close to the request boundary.
- Do not hardcode credentials, origins, or environment-specific settings.
- If environment variable names change, update both the README and the compatibility lookup in `src/config/env.js`.
- Prefer additive changes over broad rewrites; this repo is small and benefits from clarity.

## Suggested Next Improvements

1. Add request examples to Swagger and link them from the README.
2. Add a smoke deployment check after Fly.io releases.
3. Split CI into test and badge-generation jobs if artifact handling becomes more complex.
