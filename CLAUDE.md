# Finance Tracker — notes for Claude

A personal finance app: React SPA (also packaged as an Android/iOS app via Capacitor) talking to an Express REST API backed by PostgreSQL.

## Layout

```
backend/                 Express 5 API, CommonJS, plain JavaScript
  src/app.js             entry: CORS allowlist, routes, error handler (PORT, default 5000)
  src/config/db.js       pg Pool (DATABASE_URL or DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD)
  src/config/migrate.js  runs migrations/*.sql in order
  src/routes/*.js        one router per resource, mounted under /api/<resource>
  src/controllers/*.js   request handlers + SQL (no ORM)
  src/middleware/auth.js JWT check (Authorization: Bearer <token>)
  migrations/NNN_*.sql   numbered, append-only SQL migrations
frontend/                React 19 + Vite + Tailwind 4, ES modules, .jsx (no TypeScript)
  src/api/*.js           axios wrappers; api/axios.js adds the token and handles 401
  src/pages/, src/components/  page/component .jsx with a sibling .css file
  src/context/AuthContext.jsx  auth state (token + user in localStorage)
  android/, ios/         Capacitor native projects
.github/workflows/       android.yml / ios.yml build the mobile apps
docs/                    ERD, report PDF, DB backup, screenshots
```

## Commands

| Where | Command | Purpose |
|---|---|---|
| backend | `npm run dev` | API with nodemon |
| backend | `npm run migrate` | apply SQL migrations |
| frontend | `npm run dev` | Vite dev server on :5173 (`VITE_API_URL` points to the API) |
| frontend | `npm run lint` | ESLint — run after frontend changes |
| frontend | `npm run build` | production build — run before finishing frontend work |
| frontend | `npm run apk` | build a debug Android APK |

There is no test suite yet. When adding tests, use Vitest + React Testing Library on the frontend and Vitest/Jest + supertest on the backend (see the `tdd-workflow` and `react-testing` skills).

## Conventions

- Keep the existing style: plain JS (no TypeScript), CommonJS in the backend, ES modules in the frontend, 4-space indentation.
- SQL: always use parameterized queries (`$1, $2`), never string interpolation. Multi-step writes that touch balances go in `BEGIN/COMMIT` with `ROLLBACK` on error.
- Every query on user data must filter by `req.user` id: users must never see other users' rows.
- Schema changes go in a new `migrations/NNN_description.sql`; never edit an applied migration.
- New API endpoint = route in `src/routes/`, handler in `src/controllers/`, client wrapper in `frontend/src/api/`.
- Secrets live in `.env` files and are never committed.
- UI text may be in Russian or English; match the surrounding screen.

## Tooling in `.claude/`

See `.claude/README.md` for the full catalog of agents, skills and rules installed for this project, and when to use each one.
