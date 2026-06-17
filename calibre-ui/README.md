# calibre-ui

A **standalone, UI-only desktop-web prototype** that reproduces the
[Calibre](https://calibre-ebook.com) e-book manager across **seven designed
screens** in a bespoke **dark-navy glassmorphic** design system. Every screen is
driven **entirely by hardcoded mock data** held in client-side React
state/Context — there is no server round-trip behind anything you see.

> **What this is — and explicitly is not.** This is a visual/interaction
> prototype only. It has **no backend, no API, no database, and no real
> file / EPUB / format-conversion logic** — all behavior is simulated against
> in-memory mock data. Book covers are **runtime-generated placeholders**
> (deterministically derived from each book's data); **no real, copyrighted
> cover art is ever embedded**. The app **does not import from, fork, or depend
> on the Calibre Python codebase** — Calibre is used purely as a
> visual/functional design reference for screen layout and behavior.

---

## Screens

The prototype renders **five routable screens** plus **two modal overlays**.
Every screen and modal is reachable through ordinary **in-app UI interaction**
(toolbar buttons, sidebar controls, card/row actions) — no manual URL entry is
required.

### Routes

| Route          | Screen                 | App  |
| -------------- | ---------------------- | ---- |
| `/`            | Library — List View    | App 01 |
| `/grid`        | Library — Cover Grid   | App 02 |
| `/viewer`      | E-book Viewer          | App 03 |
| `/editor`      | EPUB Editor            | App 04 |
| `/preferences` | Preferences            | App 06 |

### Modals (overlays, **not** routes)

| Modal            | App    | Notes                                                        |
| ---------------- | ------ | ------------------------------------------------------------ |
| Convert Books    | App 05 | Opens centered over the dimmed library; the route is unchanged. |
| Metadata Editor  | App 07 | Opens centered over the dimmed library; the route is unchanged. |

The Convert and Metadata dialogs are mounted as overlays over the library via a
modal provider; opening them does **not** change the current route.

---

## Tech stack

Exact patch versions are **pinned** in [`package.json`](./package.json) and the
committed [`package-lock.json`](./package-lock.json). The table below documents
the line each package tracks.

| Package                 | Line             | Role                                                            |
| ----------------------- | ---------------- | --------------------------------------------------------------- |
| `next`                  | **15.x** (App Router) | Routing, React Server Components, build, and `next start` server |
| `react`                 | **19.x**         | UI rendering library                                            |
| `react-dom`             | **19.x**         | React DOM renderer                                              |
| `typescript`            | **5.x**          | Static typing across the codebase                              |
| `tailwindcss`           | **v4** (CSS-first) | Utility CSS engine — **no `tailwind.config.js`** (see Design system) |
| `@tailwindcss/postcss`  | **v4**           | Tailwind v4 PostCSS plugin (a separate package in v4)          |
| `postcss`               | **8.x**          | CSS processing pipeline                                        |
| `shiki`                 | **4.x**          | Ahead-of-time syntax highlighting for the EPUB Editor (App 04) |
| `eslint`                | **9.x**          | Linting (flat config via `eslint-config-next`)                 |

### ⚠️ Intentional version pin: Next.js **15.x** (not 16.x)

The npm-current Next.js major is **16.x**, but this project **intentionally pins
the Next.js 15.x line** to satisfy a hard project requirement. **This is
deliberate — do not "fix" it by bumping to 16.x.** React 19 and Tailwind CSS v4
are paired against this 15.x baseline; the exact patch is locked in
`package.json` + `package-lock.json`.

---

## Prerequisites

- **Node.js ≥ 20** (developed and deployed on **Node 22**). The Node `>=20`
  floor is declared in `package.json`'s `engines` field and is required by
  Next.js 15, Tailwind CSS v4, and Shiki v4.
- **npm 9+** (npm ships with the supported Node versions).

---

## Getting started (local development)

All commands below are run from **inside the `calibre-ui/` directory**.

```bash
cd calibre-ui
npm install      # installs the pinned dependency tree from package-lock.json
npm run dev      # starts the Next.js dev server
```

The dev server runs at **`http://localhost:3000`**.

---

## Production build & start

```bash
npm run build      # next build — must complete cleanly with no errors
npm run start      # next start -p ${PORT:-3000}
```

The `start` script is defined as `next start -p ${PORT:-3000}`, so it **binds
`process.env.PORT`** and falls back to **port 3000** when `PORT` is not set.
This is exactly how a hosted platform's injected port (e.g. Railway) is honored
in production. To override the port locally:

```bash
PORT=8080 npm run start   # serves on http://localhost:8080
```

To lint the project:

```bash
npm run lint       # eslint .
```

---

## Project structure

```text
calibre-ui/
├─ public/                       # favicon / web manifest only — NO book cover art
├─ src/
│  ├─ app/                       # Next.js App Router
│  │  ├─ globals.css             # @import "tailwindcss"; + @theme {} design tokens
│  │  ├─ layout.tsx              # Root layout: Inter font, provider tree, AppShell
│  │  ├─ page.tsx                # /            Library List View (App 01)
│  │  ├─ grid/page.tsx           # /grid        Cover Grid View   (App 02)
│  │  ├─ viewer/page.tsx         # /viewer      E-book Viewer      (App 03)
│  │  ├─ editor/page.tsx         # /editor      EPUB Editor        (App 04)
│  │  └─ preferences/page.tsx    # /preferences Preferences        (App 06)
│  ├─ components/
│  │  ├─ shell/                  # WindowTitleBar, TopToolbar, Sidebar, AppShell
│  │  ├─ primitives/             # token-driven design-system primitives (Button, GlassCard, …)
│  │  ├─ library/                # App 01/02: list table, rows, cover grid, batch panel
│  │  ├─ viewer/                 # App 03: TOC, reading area, tools panel, nav strip
│  │  ├─ editor/                 # App 04: toolbar, file tabs, file tree, code view, preview
│  │  ├─ convert/                # App 05 modal: format row, option tabs, conversion log
│  │  ├─ metadata/               # App 07 modal: cover column, fields, tag editor, identifiers
│  │  └─ preferences/            # App 06: category nav, panel, toggle grid, swatches, slider
│  ├─ state/                     # React Context providers (all 'use client'):
│  │                             #   LibraryProvider, ModalProvider, ReaderProvider, PreferencesProvider
│  ├─ data/                      # mock data: books.ts (the 15 titles), chapters, editorFiles,
│  │                             #   sidebar, preferences
│  ├─ lib/                       # covers (placeholder generator), format (size/date/rating),
│  │                             #   highlight (cached Shiki singleton)
│  ├─ theme/                     # tokens.ts — TypeScript mirror of the @theme tokens
│  └─ types/                     # book.ts (the Book interface), index.ts (shared types)
├─ package.json                  # scripts: dev / build / start / lint; pinned dependencies
├─ next.config.ts                # output: "standalone" (self-host friendly)
├─ postcss.config.mjs            # registers @tailwindcss/postcss
├─ tsconfig.json                 # strict TypeScript; @/* path alias -> ./src/*
├─ eslint.config.mjs             # eslint-config-next (flat config)
├─ railway.json                  # builder: NIXPACKS; startCommand: npm run start
└─ .env.example                  # documents PORT and RAILWAY_TOKEN names only (no values)
```

The four Context providers are composed in `src/app/layout.tsx` and wrap the
routed page plus the modal mount points. `LibraryProvider` holds `viewMode` and
`selectedIds`, so view mode and selection are **preserved across `/` and
`/grid`** and selecting two or more books in the grid switches the right panel
to the batch-actions view.

---

## Design system

The UI is built on a **bespoke dark-navy / purple glassmorphic design system**
(not a third-party component library). It has two layers:

- **Token layer — CSS-first Tailwind v4.** All design tokens (colors, the
  `#7B61FF → #A78BFA` accent gradient, radii, shadows, white 6–10% borders, and
  the Inter type scale) are declared once in
  [`src/app/globals.css`](./src/app/globals.css) via `@import "tailwindcss";`
  and an `@theme {}` block. There is **no `tailwind.config.js`** — Tailwind v4 is
  configured in CSS. The same tokens are mirrored in
  [`src/theme/tokens.ts`](./src/theme/tokens.ts) for JavaScript-side use.
- **Primitive layer.** Reusable, token-driven primitives live in
  `src/components/primitives/*` (Button, GlassCard, ModalShell, StarRating,
  TagPill, FormatBadge, Toggle, Select, Tabs, Slider, InputField, ThemeSwatch,
  CheckBadge, BookCoverPlaceholder). Every screen composes from these primitives.

**Compliance rule:** **zero hardcoded CSS values** — every color, spacing,
radius, shadow, and typographic value resolves to an `@theme` token, and every
control is composed from a primitive rather than a raw HTML element.

The **Inter** typeface is loaded with `next/font/google` in `layout.tsx` and
bound into the font token so it applies globally.

---

## Deployment (Railway)

The app deploys as a **single Nixpacks service** on
[Railway](https://railway.app). Build and start behavior is declared in
[`railway.json`](./railway.json):

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

The `build.builder` is **`NIXPACKS`** and `deploy.startCommand` is
**`npm run start`** (which runs `next start -p ${PORT:-3000}`); the restart
policy retries on failure.

### 🚩 CRITICAL: set the service **Root Directory** to `calibre-ui/`

This repository's root is a **Python project** (the upstream Calibre source,
kept read-only). The Node app lives in the **`calibre-ui/` subdirectory**, so in
the Railway **service settings** you **must set the _Root Directory_ to
`calibre-ui/`**. This makes Railway build the Node app and ignore the
repository-root Python project.

> Root Directory is a **Railway dashboard / service setting** — it is **not** a
> field in `railway.json`. Setting it incorrectly (or leaving it at the repo
> root) will cause Railway to try to build the Python project instead of this app.

With the Root Directory set correctly, Railway:

1. Auto-detects the Node provider from `package.json`.
2. Runs `npm install` and then `npm run build` (`next build`).
3. Starts the server with `npm run start` (`next start -p ${PORT:-3000}`), which
   **binds Railway's injected `PORT`** automatically.

### Secrets

- **`RAILWAY_TOKEN` and any credentials are NEVER committed to source.** They are
  supplied only through **Railway's secure environment / CI** (the dashboard or a
  CI secret store).
- [`.env.example`](./.env.example) documents the variable **names** (`PORT`,
  `RAILWAY_TOKEN`) with **no values**. Copy it to `.env.local` for local
  overrides:

  ```bash
  cp .env.example .env.local
  ```

  `.env.local` is git-ignored and is for local development only.

---

## Constraints & non-goals

This prototype is intentionally bounded. The following are **out of scope**:

- **UI-only, mock-data architecture** — no backend, no API routes, no database.
- **No persistence** — state is in-memory React state only; nothing survives a
  full page reload (no database, no required `localStorage`).
- **No real functionality behind the UI** — no real file I/O, no real format
  conversion, no real EPUB parsing/editing, no real "send to device", no news
  fetching, and no search indexing. All such behavior is simulated.
- **No real cover art** — covers are generated placeholders only; real,
  copyrighted artwork is never embedded.
- **No Calibre coupling** — the app does not import from, fork, or build against
  the Calibre Python codebase; Calibre is a design reference only.
- **No additional screens or routes** — nothing beyond the five routes (`/`,
  `/grid`, `/viewer`, `/editor`, `/preferences`) plus the two modals (Convert,
  Metadata).
- **No secrets in source** — `RAILWAY_TOKEN` and any credentials are documented
  by name only and never committed.
