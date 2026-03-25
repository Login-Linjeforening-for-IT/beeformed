# BeeFormed

BeeFormed is a web-based form system (“skjemasystem”) with:

- A Next.js frontend for creating/editing forms, sharing public links, and viewing submissions
- A Fastify API for forms, fields, permissions, and submissions
- Postgres for persistent storage and an email queue (SMTP with retries)

## What you can do

1. Log in via Authentik (OAuth2).
2. Create and manage forms (including field definitions and publication window).
3. Share a public form link: `GET /f/:slug`
4. Let users submit forms (anonymous submissions supported).
5. Enforce `limit` + `waitlist` and optionally block multiple submissions per user.
6. Receive confirmation emails for registered/waitlisted submissions (with QR code attachment for the submission).
7. Scan submissions using QR codes in the admin UI and mark them as scanned.

## Architecture

- Frontend: `frontend/` (Next.js)
- API: `api/` (Fastify + Postgres)
- Database schema: `db/init.sql`

Docker Compose runs three services:

- `beeformed` (frontend)
- `beeformed_api` (API)
- `beeformed_database` (Postgres 18)

## Local / Docker setup

### 1) Environment variables

Docker Compose expects a root `.env` file (used by both services).

The API validates the required variables at startup (`api/src/utils/sql.ts`) and the frontend reads them from `frontend/constants.ts`.

Create a root `.env` including at least:

- `AUTH_URL`
- `DB`, `DB_USER`, `DB_HOST`, `DB_PASSWORD`, `DB_PORT`
- `FRONTEND_URL`

Email (SMTP) is enabled by default. Either configure:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM`, `SMTP_NAME`, `SMTP_USER`, `SMTP_PASSWORD`

Or disable all email sending/queue processing:

- `DISABLE_SMTP=true`

The frontend also expects:

- `AUTH_CLIENT_ID`, `AUTH_CLIENT_SECRET`
- (optional but recommended) `API_URL`

```bash
# .env (repo root)
AUTH_URL=...
AUTH_CLIENT_ID=...
AUTH_CLIENT_SECRET=...
DB=...
DB_USER=...
DB_HOST=beeformed_database
DB_PASSWORD=...
DB_PORT=5432
FRONTEND_URL=http://localhost:8700
API_URL=http://localhost:8701/api
DISABLE_SMTP=true # or SMTP_* vars
```

### 2) Start with Docker Compose

From the repo root:

```bash
docker compose up --build
```

Then:

- Frontend: `http://localhost:8700`
- API: `http://localhost:8701/api`

## Database schema

Defined in `db/init.sql`.

## Email confirmations

On submission-related events, the API sends templated emails via SMTP (`nodemailer`).
If SMTP fails, emails are queued in `email_queue` for retry; disable all sending/queueing with `DISABLE_SMTP=true`.

