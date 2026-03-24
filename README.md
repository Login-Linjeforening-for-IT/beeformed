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

## Frontend routes (user-facing URLs)

- `GET /`  
  Login page (redirects to `/profile` if already authenticated)
- `GET /profile`  
  Account summary + shortcuts (create form / my forms / submissions)
- `GET /forms` (and `/forms/shared`)  
  Paginated list of your forms / shared forms
- `GET /forms/create`  
  Form editor entry point (field builder + settings via nested routes)
- `GET /form/:id/*`  
  Form editor tabs:
  - `/fields`
  - `/settings`
  - `/permissions`
  - `/submissions`
  - `/all-submissions`
- `GET /f/:slug`  
  Public “fill in the form” page (only works if published and within the time window, with creator/submitted override)
- `GET /submissions/:id` (or `/submissions`)  
  Submission details for the logged-in user, or a table of your submissions
- `GET /qr/:id`  
  QR scanner page (the `:id` is the *form id*)
- `GET /submissions/qr/:id`  
  Generates a QR code for the *submission id*

## Authentication and authorization

### Authentication

- The API expects `Authorization: Bearer <token>`.
- Tokens are verified by calling Authentik’s userinfo endpoint (`AUTH_URL`).
- The frontend stores the token in a cookie named `access_token`.

### Admin privilege (“QueenBee”)

Some operations additionally require the user to be in the `QueenBee` group:

- Creating a form (`POST /api/forms`)
- Deleting a form (`DELETE /api/forms/:id`)
- Duplicating a form (`POST /api/forms/:id/duplicate`)

### Form-level permissions

For operations that involve reading a form’s data (fields, submissions, permissions), the API checks access using `form_permissions`:

- Direct user permission (`form_permissions.user_id = user_id`)
- Group permission (`form_permissions."group" = ANY(user_groups)`)
- Form ownership (`forms.user_id = user_id`)

## Fastify API

Base path: `http://<host>:8701/api`

Endpoints (including request/response examples) can be discovered from the running server:
- `GET /api/` prints registered routes
- `GET /api/ping` → `{ "message": "pong" }`

Quick endpoint overview (exact payloads are implemented in `api/src/handlers/*` + `api/src/queries/*`):
- Users: `POST/GET/DELETE /api/users`
- Forms: `POST /api/forms` (auth + `QueenBee`), `GET /api/forms`, `GET /api/forms/shared`, `GET /api/forms/:id/public`, `GET/PUT/DELETE /api/forms/:id`, `POST /api/forms/:id/duplicate` (auth + `QueenBee`), `GET /api/forms/:id/live`
- Fields: `GET /api/forms/:id/fields`, `PATCH /api/forms/:id/fields`
- Permissions: `GET/POST /api/forms/:id/permissions`, `DELETE /api/forms/:formId/permissions/:id`
- Submissions: `GET /api/forms/:id/submissions`, `POST /api/forms/:id/submissions`, `GET /api/submissions`, `GET/DELETE /api/submissions/:id`, `POST /api/submissions/:id/scan`

## Database schema

Defined in `db/init.sql`.

## Email confirmations

On submission-related events, the API sends templated emails via SMTP (`nodemailer`).
If SMTP fails, emails are queued in `email_queue` for retry; disable all sending/queueing with `DISABLE_SMTP=true`.

