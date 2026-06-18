'use client';

/**
 * ==========================================================================
 * Calibre-UI — PreferencesHeader
 * The App 06 Preferences screen Header (Figma node `8:8`) — FULL-WIDTH.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `PreferencesHeader` is the App 06 Preferences screen HEADER (Figma file
 * `JduUzjVHNhZivm5A0pAiCD`, page `0:1`, screen `8:2`, header node `8:8`,
 * ~1440×52) in the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * It renders a single horizontal bar with the "Preferences" screen title pinned
 * to the start edge and the two screen actions — "Restore Defaults" (secondary)
 * and "Save & Restart" (primary gradient) — pinned to the end edge.
 *
 * FULL-WIDTH HEADER — WHY THIS IS A SEPARATE COMPONENT (Figma fidelity)
 * --------------------------------------------------------------------------
 * Per Figma screen `8:2` (and AAP §0.3.1 Workflow 6 / §0.7.4), the App 06
 * Header (`8:8`, 1440×52) is a FULL-WIDTH bar that spans the ENTIRE screen
 * width ABOVE both the left CatNav (`8:15`, 240×816) and the right
 * SettingsPanel (`8:33`, 1200×816) — it is NOT scoped to the right settings
 * column. (Frame math: 32px window title bar + 52px header + 816px body row =
 * 900px; 240px nav + 1200px panel = 1440px.) The route (`app/preferences/
 * page.tsx`) therefore stacks THIS header as the first row of a vertical flex
 * column, with the nav+panel horizontal row beneath it. Extracting the header
 * into its own full-width component (rather than nesting it inside
 * {@link PreferencesPanel}) is what makes the title span the full width and the
 * CatNav begin BELOW the header — the exact Figma geometry.
 *
 * SCREEN-TITLE ID OWNERSHIP (cross-component `aria-labelledby`)
 * --------------------------------------------------------------------------
 * This header owns the screen's single `<h1>` ("Preferences") and therefore the
 * stable {@link SCREEN_TITLE_ID} that names it. {@link PreferencesPanel}'s
 * settings `<section>` references that same id via `aria-labelledby` by
 * importing this exported constant, so the settings region is accessibly named
 * by the screen title even though the title now lives in a sibling component.
 * The id is a module constant (NOT `useId()`-generated) because there is exactly
 * one Preferences header per page, so a fixed id can never collide and guarantees
 * identical server/client DOM (zero hydration mismatch).
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The header calls the `usePreferences` Context hook (for `restoreDefaults`) and
 * the `useRouter` hook, and binds `onClick` handlers to the two action buttons —
 * all of which require a Client Component (App Router components default to
 * Server Components, which cannot run hooks or bind event handlers). The
 * directive is the very first line, before any import. The component is
 * deterministic / SSR-safe: it reads only Context actions and binds handlers,
 * with NO `window`, `Math.random`, `Date.now`, `new Date()`, or `localStorage`
 * access and NO mount-time mutation, so server and client render identically and
 * the screen hydrates with zero console/hydration errors.
 *
 * UI-ONLY · IN-MEMORY · NO PERSISTENCE
 * --------------------------------------------------------------------------
 * "Restore Defaults" calls `restoreDefaults()` (resets the in-memory settings to
 * the seeded defaults). "Save & Restart" is a UI-only no-op that performs NO
 * persistence and NO real restart — it simply navigates back to the library
 * route `/` via the App Router (`router.push('/')`), satisfying the design's
 * call-to-action without any backend. A page reload resets every setting to the
 * defaults (AAP §0.8.2 — "no required localStorage").
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / RADIUS / TYPOGRAPHY value resolves to an `@theme` token from
 * `src/app/globals.css`, consumed via a Tailwind v4 utility (`text-dialog-
 * heading`, `text-text-primary`) or a CSS-variable arbitrary value
 * (`border-[var(--border-white-07)]`). The gradient/outline button fills come
 * entirely from the {@link Button} primitive; this file adds NO color literal.
 * The only bare values are LAYOUT / SPACING utilities and the `select-none`
 * transform — none of which carry color/radius/font-size token information.
 *
 * ACCESSIBILITY (UI3 — invisible, always applied; never conflicts with Figma)
 * --------------------------------------------------------------------------
 * • The bar is a semantic `<header>` landmark and the title is the screen's
 *   single `<h1>`, so assistive tech can navigate the page structure.
 * • Each action button derives its accessible name from its visible `label`
 *   (via the {@link Button} primitive's real, keyboard-operable `<button>`).
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/preferences/
 * main.py` — the Qt Preferences window host whose Restore-Defaults + Apply/Save
 * footer this header is the web analog of. Nothing is imported, translated, or
 * executed from the Python codebase.
 *
 * @see src/app/preferences/page.tsx — stacks this full-width header above nav+panel.
 * @see src/components/preferences/PreferencesPanel.tsx — the headerless settings panel.
 * @see src/components/preferences/PreferencesNav.tsx — the left category nav.
 * @see src/components/primitives/Button.tsx — the action-button primitive.
 * @see src/state/PreferencesProvider.tsx — the settings Context (`usePreferences`).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.1 / §0.7.4 — the App 06 Preferences header spec.
 */

import { useRouter } from 'next/navigation';

import { Button } from '@/components/primitives/Button';
import { usePreferences } from '@/state/PreferencesProvider';

/* --------------------------------------------------------------------------
 * Stable, deterministic element id (SSR-safe).
 *
 * A module constant — NOT `useId()`-generated — because there is exactly one
 * Preferences header per page, so a fixed id can never collide, and a static
 * value guarantees identical server/client DOM (zero hydration mismatch).
 * Exported so {@link PreferencesPanel} can reference it via `aria-labelledby`,
 * keeping the settings `<section>` named by THIS header's `<h1>`.
 * ------------------------------------------------------------------------ */

/** Names the screen `<h1>` ("Preferences"); shared with the settings section. */
export const SCREEN_TITLE_ID = 'preferences-screen-title';

/* --------------------------------------------------------------------------
 * Token-backed class strings (module scope so they are allocated once and the
 * token usage is auditable in one place). Every color/radius/typography value
 * resolves to an `@theme` token; only Tailwind-scale layout/spacing utilities
 * and the `select-none` transform are bare (they carry no token info).
 * ------------------------------------------------------------------------ */

/**
 * Header bar (Figma `8:8`, 52px tall, FULL-WIDTH). A horizontal row with the
 * title pinned to the start edge and the action buttons to the end edge
 * (`justify-between`), vertically centered, with a fixed `h-u52` (52px) height —
 * the design's exact bar height (border-box, so the 1px `border-b` is included)
 * — and `px-u32` (32px) inline padding; `items-center` vertically centers the
 * 38px primary button within the bar. `w-full` + `shrink-0` keep the header
 * spanning the full screen width and prevent it from compressing when the body
 * row below scrolls; the `border-b` hairline (the white-7% token) separates it
 * from the nav+settings body. `gap-u16` keeps the title clear of the buttons if
 * the window gets narrow.
 */
const HEADER_CLASSES =
  'flex h-u52 w-full shrink-0 items-center justify-between gap-u16 ' +
  'border-b border-[var(--border-white-07)] px-u32';

/**
 * Screen title "Preferences" (Figma `8:8`): the `text-dialog-heading` role
 * (Inter 600 / 20px) in the near-white primary token. `select-none` keeps the
 * heading from being drag-selected.
 */
const TITLE_CLASSES = 'select-none text-dialog-heading text-text-primary';

/**
 * Header action-button group: the two buttons in a row with a `gap-u12` (12px)
 * gutter, vertically centered. `shrink-0` keeps the buttons from being squeezed
 * by a long title in a narrow window.
 */
const HEADER_ACTIONS_CLASSES = 'flex shrink-0 items-center gap-u12';

/**
 * PreferencesHeader — the full-width App 06 Preferences screen header (`8:8`).
 *
 * Reads the App Router from `useRouter` and `restoreDefaults` from
 * {@link usePreferences}. Renders the "Preferences" `<h1>` (named by the
 * exported {@link SCREEN_TITLE_ID}) with the Restore Defaults
 * (→ `restoreDefaults`) and Save & Restart (→ `router.push('/')`) buttons.
 * Holds no local state; takes no props.
 *
 * @returns The rendered full-width Preferences header bar.
 */
export default function PreferencesHeader() {
  const router = useRouter();
  const { restoreDefaults } = usePreferences();

  return (
    <header className={HEADER_CLASSES}>
      <h1 id={SCREEN_TITLE_ID} className={TITLE_CLASSES}>
        Preferences
      </h1>

      <div className={HEADER_ACTIONS_CLASSES}>
        {/* Resets the in-memory settings to the seeded defaults (UI-only). */}
        <Button variant="secondary" label="Restore Defaults" onClick={restoreDefaults} />
        {/* UI-only: NO persistence and NO real restart — navigates back to the
            library route `/` via the App Router (no full page reload). */}
        <Button variant="primary" label="Save & Restart" onClick={() => router.push('/')} />
      </div>
    </header>
  );
}
