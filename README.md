# Investro (fork)

Investro is a Next.js  financial dashboard focused on stock discovery, charts, market widgets and user watchlists. This fork has been adapted to support Indian markets (NSE/BSE) and includes features for searching, saving watchlists, and viewing market news and TradingView embeds.

This README summarizes project structure, setup, environment variables, how the Indian-market changes were applied, and where to look when widgets or data need adjustments.

---

## Key Features

- Dashboard with TradingView widgets (Market Overview, Heatmap, Market Quotes)
- Company pages with TradingView charts and related widgets
- Search with mixed data sources (ET Money / Finnhub / NSE) for Indian tickers
- Persistent user watchlist backed by MongoDB (add/remove stocks from search UI)
- Market news aggregated from Finnhub (company news + general news)
- Authentication using `better-auth` with MongoDB adapter
- Server-side actions for data fetching and watchlist management

## High-level Architecture

- Next.js (app router) — server components + client components
- React 19
- MongoDB + Mongoose for persistence (`database/mongoose.ts`, `database/models/*`)
- Authentication: `better-auth` with `better-auth/adapters/mongodb` (see `lib/better-auth/auth.ts`)
- Market data: Finnhub (primary), plus ET Money / NSE endpoints used for search/autocomplete
- UI: Tailwind + Radix primitives + custom components

## Important Files & Locations

- `app/` — Next.js app routes and pages
  - `app/(root)/page.tsx` — dashboard (widgets)
  - `app/watchlist/page.tsx` — watchlist page
- `components/` — UI components (SearchCommand, TradingViewWidgets, WatchlistTable, WatchlistNews, etc.)
- `hooks/` — `useTradingViewWidget.tsx`, `useDebounce.tsx`
- `lib/constants.tsx` — TradingView widget configs and popular symbols (change this to tweak widget behavior)
- `lib/actions/` — server actions for Finnhub, watchlist, users, and auth
  - `lib/actions/finnhub.actions.ts` — news, search and helper fetch functions
  - `lib/actions/watchlist.actions.ts` — add/remove/get watchlist (MongoDB)
- `lib/better-auth/auth.ts` — `better-auth` initialization and adapter
- `database/models/watchlist.model.ts` — mongoose model for watchlist items
## Background Jobs / Emailing (Inngest + Nodemailer)

### Inngest (async tasks / serverless functions)
- Purpose: Inngest is used to run background jobs and serverless-style functions asynchronously (for example, scheduled tasks, heavy processing, or offloading email generation). This project keeps Inngest client & functions under `lib/inngest/` (see `lib/inngest/client.ts` and `lib/inngest/functions/functions.ts`).
- How it works here:
  - The app triggers events via the Inngest client (e.g., `client.send()` or similar). Registered functions listen for those events and perform work (send emails, aggregate news, run scheduled jobs).
  - Using Inngest decouples long-running or retryable work from immediate HTTP requests and keeps the main request/response fast.
- Dev & deployment:
  - Local dev: run the Inngest worker or use the Inngest dev tooling (see Inngest docs). This lets you test event handlers locally.
  - Prod: functions can run in a serverless environment or any node runtime; make sure the Inngest client is configured with the correct account/credentials (check `lib/inngest/client.ts`).
- Useful links:
  - Inngest docs: https://inngest.com/docs
  - Pattern docs (event-driven): https://inngest.com/docs/guides

### Nodemailer (transactional email)
- Purpose: Nodemailer sends transactional emails (welcome emails, news digests, notifications). This project keeps mail logic in `lib/nodemailer/` (see `lib/nodemailer/index.ts` and `lib/nodemailer/templates.ts`).
- How it works here:
  - Email templates are defined in `templates.ts` and the sending logic is in `index.ts` which constructs messages and calls Nodemailer with SMTP credentials.
  - Inngest functions may call the Nodemailer helpers to send emails asynchronously (e.g., scheduled newsletters or triggered welcome emails).
- Required environment variables (examples present in `.env`):
  - `NODEMAILER_EMAIL` — the SMTP account email / from address
  - `NODEMAILER_PASSWORD` — the SMTP password (or app password)
  - You can also use other SMTP parameters (host, port, secure) if `index.ts` reads them — check the file for exact keys.
- Recommendations:
  - For reliability and deliverability in production, use a transactional email provider (SendGrid, Mailgun, Postmark, Amazon SES) and their SMTP/API credentials instead of a personal Gmail account.
  - Keep credentials secret; use a secrets manager for production.
  - Add retry/error handling for failed sends (Inngest handlers are a good place to retry).
- Useful links:
  - Nodemailer docs: https://nodemailer.com/about/
  - Transactional email providers:
    - SendGrid: https://sendgrid.com/docs/
    - Mailgun: https://documentation.mailgun.com/
    - Postmark: https://postmarkapp.com/developer

### Testing & Debugging tips
- To test email sending locally:
  - Use a test SMTP server (MailHog, Mailtrap) or a transactional provider's sandbox credentials.
  - Trigger the same code path the app uses (e.g., sign up a test user or call the Inngest function locally).
- To debug Inngest functions:
  - Run the Inngest worker locally and trigger the event from the app; inspect logs for function execution and errors.
  - Watch for auth/session context differences when moving work from request-time to background jobs (you may need to pass relevant data into the event payload).
  
## Environment Variables

The app requires several environment variables. Example names used in the repository:

- `MONGODB_URI` — MongoDB connection string
- `NEXT_PUBLIC_FINNHUB_API_KEY` — Finnhub API key (used server-side in actions)
- `BETTER_AUTH_SECRET` — secret used by `better-auth`
- `BETTER_AUTH_URL` — base URL for auth callbacks
- `NEXT_PUBLIC_API_URL` — optional
- `NODEMAILER_EMAIL` / `NODEMAILER_PASSWORD` — for outgoing emails

Put these in a `.env` file at project root (do NOT commit secrets). There is a `.env` present in the repo for development — replace those values with secure credentials for production.

## Setup & Local Development

1. Install dependencies

```bash
npm install