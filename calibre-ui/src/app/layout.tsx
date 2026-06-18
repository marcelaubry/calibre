/**
 * ==========================================================================
 * Calibre-UI — App Router ROOT layout (`src/app/layout.tsx`)
 * ==========================================================================
 *
 * THE single root layout for the UI-only Calibre e-book-manager prototype
 * (Next.js 15 App Router · React 19 · TypeScript 5 · Tailwind CSS v4). It wraps
 * EVERY route in the app — `/` (Library List), `/grid` (Cover Grid),
 * `/viewer` (E-book Viewer), `/editor` (EPUB Editor), and `/preferences`
 * (Preferences) — and is rendered once, above the router outlet, by Next.js.
 *
 * RESPONSIBILITIES (and nothing more):
 *   1. Load the Inter typeface via `next/font/google`, exposing the CSS variable
 *      `--font-inter` on `<html>`. This is the ONLY mechanism that loads Inter —
 *      no CSS `@import`, no `<link>`. The variable name MUST be exactly
 *      `--font-inter` because `globals.css` binds `--font-sans:
 *      var(--font-inter), …` and `@/theme/tokens.ts` references the same
 *      variable; a mismatch silently falls back to system fonts.
 *   2. Import the authoritative global stylesheet `./globals.css` — exactly once,
 *      here. It declares the full `@theme` design-token manifest and the base
 *      styles that paint the dark-navy canvas (`--color-bg-app` = #0C0E1A),
 *      primary text (`--color-text-primary` = #F1F5FF), and the body font
 *      (`font-family: var(--font-sans)`), so `<body>` needs no extra classes.
 *   3. Render the document skeleton (`<html>` / `<body>`) and export static page
 *      `metadata` (Next injects `<head>`; this file never writes `<head>`).
 *   4. Compose the Context provider tree and the persistent application shell
 *      around `{children}`, in the EXACT order mandated by the architecture
 *      (AAP §0.6.2):
 *
 *        LibraryProvider → PreferencesProvider → ReaderProvider → ModalProvider
 *            → AppShell → {children}
 *
 *      Mounting all four providers HERE — above the router outlet — is precisely
 *      what makes their state (e.g. `LibraryProvider.viewMode` / `selectedIds`)
 *      PERSIST across navigation (notably `/` ↔ `/grid`), which is a core
 *      correctness requirement. Providers must NOT be moved into individual pages.
 *
 * SERVER COMPONENT (deliberate): this file carries NO `'use client'` directive
 * and uses NO React hooks. App Router components are Server Components by
 * default, and a Server Component may freely render Client Components as
 * children. Each provider and `AppShell` declares its OWN `'use client'`
 * boundary, so the client interactivity lives there while the root stays
 * server-rendered — yielding a clean first paint, minimal root-level client JS,
 * and zero hydration noise. Accordingly, the layout renders only deterministic
 * content (no `Date.now()`, `Math.random()`, etc.) to avoid hydration mismatch.
 *
 * UI-ONLY: there is no backend, no API call, no injected environment value, and
 * no coupling to the upstream Calibre Python codebase — this is a net-new visual
 * prototype driven entirely by in-memory mock data inside the providers.
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

// The authoritative global stylesheet — imported EXACTLY ONCE, here. It pulls in
// Tailwind v4, declares the `@theme` token manifest, and applies the base body
// background/text/font from those tokens.
import './globals.css';

// Context providers — each is its own Client Component (`'use client'`), imported
// via the `@/*` alias (tsconfig maps `@/*` → `./src/*`). Order matters: see the
// nesting in `RootLayout` below (AAP §0.6.2).
import { LibraryProvider } from '@/state/LibraryProvider';
import { PreferencesProvider } from '@/state/PreferencesProvider';
import { ReaderProvider } from '@/state/ReaderProvider';
import { ModalProvider } from '@/state/ModalProvider';

// The persistent application shell (window chrome + per-route toolbar/sidebar +
// modal mount points). A NAMED export per its own module contract. `AppShell`
// assumes it renders INSIDE all four providers (it does not mount any itself).
import { AppShell } from '@/components/shell/AppShell';

/**
 * Inter — the single app-wide typeface. `next/font/google` self-hosts the font
 * at build time (no runtime request to Google) and emits a CSS variable.
 *
 * - `subsets: ['latin']`  — load only the Latin glyph subset (smallest payload
 *   sufficient for this English-language prototype).
 * - `variable: '--font-inter'` — the EXACT variable name `globals.css` /
 *   `tokens.ts` expect; applied to `<html>` below so it is in scope document-wide.
 * - `display: 'swap'` — show fallback text immediately, then swap to Inter once
 *   loaded (avoids invisible-text FOIT; no layout-shift warnings).
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * Static page metadata. Next.js reads this export and injects the corresponding
 * `<head>` tags. Kept minimal and fully deterministic (no nondeterministic
 * values) so the server-rendered markup is stable. The favicon is auto-wired by
 * Next.js from `app/`/`public/` and is intentionally NOT declared here.
 */
export const metadata: Metadata = {
  title: 'Calibre — Modern Library',
  description:
    'A modern UI redesign prototype of the Calibre e-book manager (UI-only).',
};

/**
 * Viewport descriptor (split out of `metadata` in modern Next.js). A trivially
 * correct, fully deterministic default that ensures sensible scaling. The design
 * targets a fixed 1440×900 desktop baseline; this neither constrains nor distorts
 * that layout.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

/**
 * RootLayout — the App Router root layout component (default export, required by
 * Next.js). Renders the document skeleton and wraps the routed page (`children`)
 * in the provider tree and the application shell.
 *
 * `className={inter.variable}` on `<html>` puts `--font-inter` in scope for the
 * whole document; `globals.css` base styles then resolve `--font-sans` to Inter
 * and paint the body background/text from the design tokens, so `<body>` carries
 * no extra classes.
 *
 * @param props.children - The routed page rendered into `AppShell`'s content slot.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <LibraryProvider>
          <PreferencesProvider>
            <ReaderProvider>
              <ModalProvider>
                <AppShell>{children}</AppShell>
              </ModalProvider>
            </ReaderProvider>
          </PreferencesProvider>
        </LibraryProvider>
      </body>
    </html>
  );
}
