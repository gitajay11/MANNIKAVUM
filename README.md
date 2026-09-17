# mannikavum

A short interactive apology — humour first, then sincerity, then her choice.
Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4,
Framer Motion, Prisma 6 and PostgreSQL (Neon).

## Flow

`/` → Landing → Investigation report → Sincere apology → "Things I should have
done" cards → Sorry meter → Her choice → (optional message) → Final screen →
Tamil verse → "SORRY 3000 TIMES ABI💚" zoom → done.

Nothing is recorded until she explicitly taps a response button.

## What is stored

One row per visit, only after she chooses a response:

| column          | meaning                                            |
| --------------- | -------------------------------------------------- |
| `id`            | cuid                                               |
| `session_id`    | random UUID generated in her browser (sessionStorage) |
| `response_type` | `ACCEPTED` · `NEED_TIME` · `DONT_KNOW` · `DECLINE` · `NO_RESPONSE_NEEDED` |
| `message`       | optional text she typed (max 2000 chars), or null  |
| `created_at`    | timestamp                                          |

No IP, location, user-agent, device fingerprint, or anything else.

## Setup

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET
npx prisma db push
npm run dev
```

- `/` — the apology.
- `/admin` — private dashboard (password from `ADMIN_PASSWORD`). Shows total,
  latest, per-type counts, filters, a timeline and the full history.

## Security notes

- Admin session = HS256 JWT in an `HttpOnly`, `SameSite=Lax` cookie
  (`Secure` in production), 12h expiry. `/admin/*` is gated in `src/proxy.ts`
  and re-checked inside the page.
- Password comparison is constant-time. Login attempts are rate-limited.
- Every payload is validated with zod (`.strict()` — unknown fields rejected).
- Messages are sanitised server-side (control chars stripped, length capped)
  and rendered as text, never HTML.
- Submissions are rate-limited per anonymous session id (not IP) and the DB
  has a unique constraint on `session_id`, so a session cannot submit twice.
  A message can only be attached once and never overwritten.
- Secrets only live in `.env` / Vercel environment variables.

## Deploy (Vercel)

1. Push this repo to GitHub and import it in Vercel.
2. Add environment variables: `DATABASE_URL`, `ADMIN_PASSWORD`,
   `ADMIN_SESSION_SECRET` (32+ chars; generate with
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
3. Deploy. The schema is already pushed to the Neon database; for a fresh
   database run `npx prisma db push` once with that `DATABASE_URL`.

Before sharing the link, change `ADMIN_PASSWORD` from the placeholder.

## Scripts

```bash
npm run dev      # local dev server
npm run build    # production build (runs type checking)
npm run lint     # eslint
npx tsc --noEmit # type check only
```
