# Calibre UI Prototype

A standalone, UI-only desktop-web prototype that reproduces the Calibre e-book
manager across five routed screens and two modal overlays, rendered in a bespoke
dark-navy glassmorphic design system. It is driven entirely by hardcoded mock data
held in client-side React state.

> This application is a **visual/functional prototype only**. There is no backend,
> no database, no API layer, and no real file, EPUB, or format-conversion logic.
> It does **not** integrate with, fork, or depend on the upstream `kovidgoyal/calibre`
> Python codebase at the repository root — that tree is a read-only reference for
> screen layout and behavior.

## Tech stack (pinned)

| Package | Version |
|---|---|
| next | 15.5.19 |
| react / react-dom | 19.2.7 |
| shiki | 4.2.0 |
| typescript | 5.9.3 |
| tailwindcss / @tailwindcss/postcss | 4.3.1 |
| postcss | 8.5.15 |
| eslint | 9.39.4 |
| eslint-config-next | 15.5.19 |

> **Next.js is intentionally pinned to the 15.x line** (latest 15.5.x) even though a
> newer major exists on npm, per the project specification.

## Prerequisites

- **Node.js >= 20** (developed and verified against Node 20.20.2 with npm 11.x).
  Tailwind CSS v4 and Shiki v4 both require Node 20+.

## Local development

```bash
npm install        # install pinned dependencies (uses package-lock.json)
npm run dev        # start the dev server on http://localhost:3000
npm run build      # production build
npm run start      # serve the production build (binds $PORT, defaults to 3000)
npm run lint       # ESLint (next/core-web-vitals + next/typescript)
```

## Configuration

- **Tailwind v4 is CSS-first**: there is no `tailwind.config.js`. Tokens are declared
  in `src/app/globals.css` via `@import "tailwindcss";` and an `@theme {}` block, and
  the PostCSS plugin is registered in `postcss.config.mjs` (`@tailwindcss/postcss`).
- **TypeScript** is strict, with the `@/*` path alias mapping to `src/*` (`tsconfig.json`).
- **next.config.ts** sets `output: "standalone"` for self-hosting.

## Environment variables

Copy `.env.example` to `.env.local` for local overrides. Variables:

- `PORT` — the production server port. Injected by Railway in production; the start
  script binds it via `next start -p ${PORT:-3000}` (defaults to `3000` locally).
- `RAILWAY_TOKEN` — Railway deploy token. **Never commit a real value**; provide it
  only through Railway's secure environment / CI.

## Deployment (Railway + Nixpacks)

This app deploys as a **single Nixpacks service**. Because the repository root is a
Python project, the Railway service **Root Directory must be set to `calibre-ui/`** so
that the Node app — not the Python tree — is built.

- Builder: `NIXPACKS` (see `railway.json`).
- Start command: `npm run start`, which runs `next start -p ${PORT:-3000}` and honors
  the `PORT` value Railway injects.

Railway auto-detects the Node provider from `package.json` and runs the `start` script.
