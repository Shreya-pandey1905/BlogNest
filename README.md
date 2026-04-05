# BlogNest

Full-stack blogging platform: Next.js (App Router + API routes), MongoDB with Mongoose, Tailwind CSS, and JWT-based auth.

## Tech stack

- Next.js (App Router + API routes)
- MongoDB + Mongoose
- Tailwind CSS
- JWT authentication (HTTP-only cookie + Bearer token for API clients)

## Features

- Registration, login, logout; first registered user becomes admin
- Email verification and password reset via OTP (when email env is configured)
- Roles: admin and user; users can create and manage their own posts
- Categories, tags, cover images, search, comments, likes, view counts
- Admin dashboard and public blog

## Project structure

- `app/` — pages and `app/api/*` route handlers
- `frontend/components/` — shared UI
- `backend/lib/` — database, auth, mailer
- `backend/models/` — Mongoose models
- `backend/utils/` — shared constants
- `mobile/` — Expo/React Native client (optional; separate app)

## Environment variables

Secret and machine-specific values live in **`.env.local`** at the **repository root** (same folder as `package.json`).

**Do not commit env files.** This repo’s `.gitignore` ignores `.env*` so files like `.env.local` stay off GitHub and out of Vercel logs when configured correctly.

Create the file locally:

```bash
# Windows (PowerShell)
New-Item -Path .env.local -ItemType File

# macOS / Linux
touch .env.local
```

Add only what you need:

### Required (app will error without these)

| Variable | Purpose |
| -------- | ------- |
| `MONGODB_URI` | MongoDB connection string. |
| `JWT_SECRET` | Secret used to sign and verify JWTs. **Must be a non-empty string** (e.g. a long random value). An empty or missing value breaks login and any authenticated API usage. |

### Required for email (registration OTP, verification, password reset, contact form)

If these are missing, flows that send mail will fail when the server tries to send.

| Variable | Purpose |
| -------- | ------- |
| `EMAIL_SERVICE` | Nodemailer service name (e.g. `Gmail`). |
| `EMAIL_USER` | SMTP account user (often the same address you send from). |
| `EMAIL_PASS` | SMTP password or app password for that account. |
| `EMAIL_FROM` | Address shown as the sender (e.g. `BlogNest <you@example.com>`). |

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

- Set the same variables in your host (e.g. Vercel **Environment Variables**), not only in `.env.local`.
- Use a strong, unique `JWT_SECRET` and a managed MongoDB instance.
- Serve the site over HTTPS so secure cookies work as intended.

## API overview

- `POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me`
- `GET` / `POST /api/posts` · `GET` / `PUT` / `DELETE /api/posts/:id`
- `POST /api/posts/:id/comments` · `DELETE /api/comments/:id`
- `POST /api/upload` · `POST /api/contact`
