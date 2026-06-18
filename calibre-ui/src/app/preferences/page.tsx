/**
 * ==========================================================================
 * Calibre-UI — `/preferences` route · App 06 Preferences (Figma screen `8:2`)
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * The `/preferences` route of the UI-only Calibre e-book-manager prototype
 * (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind CSS v4
 * CSS-first `@theme` tokens). It renders App 06 — Preferences (Figma file
 * `JduUzjVHNhZivm5A0pAiCD`, page `0:1`, screen `8:2`, 1440×900 baseline): the
 * application's full-window settings screen, a two-column body of a left
 * category navigation beside a wide settings panel. It is a FULL-WINDOW route
 * (NOT a modal — Convert `6:9` and Metadata `9:9` are the only modals).
 *
 * THIS PAGE IS A THIN COMPOSITION CONTAINER
 * --------------------------------------------------------------------------
 * Its sole responsibility is to lay out two already-built, self-contained
 * Client Components SIDE BY SIDE in a single flex ROW:
 *   • LEFT  — {@link PreferencesNav} (Figma `8:15`, the ~240 px "CatNav"): the
 *     eight preference categories (Interface · Reading [expanded] · Conversion ·
 *     Library · Sharing & Sending · Plugins · Security · Performance) plus the
 *     "Filter preferences…" field. It sizes ITSELF with `w-60 shrink-0`.
 *   • RIGHT — {@link PreferencesPanel} (Figma `8:8` Header + `8:33` SettingsPanel):
 *     the "Preferences" title with the "Restore Defaults" / "Save & Restart"
 *     actions, plus the Default-Font row, the 2×3 Reading-Behavior toggle grid,
 *     the four Viewer-Theme swatches, and the Margins slider. It sizes ITSELF
 *     with `flex-1 min-w-0`.
 * The page imposes NO widths, passes NO props, holds NO state, and renders NO
 * header or chrome of its own — every visual decision lives inside the two
 * children (and the design-system primitives + `@theme` tokens they consume).
 *
 * SHELL DIVISION OF LABOR (AAP §0.2.2 / §0.6.2) — THIS PAGE IS THE SCREEN BODY
 * --------------------------------------------------------------------------
 * `AppShell` (mounted once in `app/layout.tsx`, above the router outlet)
 * branches on `usePathname()`. `/preferences` is a NON-library route, so the
 * shell renders ONLY the global macOS `WindowTitleBar` and then drops the routed
 * page into a full-screen `<main className="min-h-0 flex-1 overflow-auto">`
 * slot — deliberately WITHOUT the `TopToolbar` or the left `Sidebar` (those are
 * library-route chrome). THIS page IS that `{children}`, so it must render the
 * ENTIRE screen body below the title bar. Hence the root fills the host `<main>`
 * with `flex h-full min-h-0 w-full`. The page therefore must NOT render a
 * `WindowTitleBar`, toolbar, or sidebar — `AppShell` already supplies the title
 * bar, and the toolbar/sidebar are intentionally absent on this route (Figma:
 * chrome present on `2:2`/`3:2`; absent on `8:2`). Duplicating any of them would
 * produce a double-chrome defect.
 *
 * HEADER OWNERSHIP (no duplicate header)
 * --------------------------------------------------------------------------
 * The App 06 Header (Figma `8:8` — the "Preferences" title plus the
 * "Restore Defaults" secondary button and the "Save & Restart" primary gradient
 * button) is rendered INSIDE {@link PreferencesPanel}, together with the settings
 * content (`8:33`). This page therefore renders NO header of its own — doing so
 * would duplicate it. The "Restore Defaults" and "Save & Restart" actions are
 * wired inside the panel (via `usePreferences().restoreDefaults()` and
 * `useRouter().push('/')`); they are NOT wired here. (Figma `8:2` depicts the
 * header as a full-width bar above the two columns; our confirmed component
 * contract keeps it panel-owned to prevent duplication — see AAP / agent brief.)
 *
 * DEFAULT EXPORTS → DEFAULT IMPORTS (build-critical)
 * --------------------------------------------------------------------------
 * Both children are `export default function` declarations
 * (`PreferencesNav` / `PreferencesPanel`), so they MUST be imported as DEFAULTS.
 * There is no barrel for `@/components/*`; the direct module paths below are
 * used, and the `@/*` alias resolves to `./src/*` (tsconfig `paths`). A named
 * import (`import { PreferencesNav }`) would resolve to `undefined` and break the
 * build, so the default form is intentional and load-bearing.
 *
 * SERVER COMPONENT (deliberate — no `'use client'`)
 * --------------------------------------------------------------------------
 * This page composes two CLIENT components, each of which carries its OWN
 * `'use client'` boundary and reads the shared settings via `usePreferences()`
 * itself. The page calls no hook and binds no handler, so it stays a Server
 * Component (a Server Component may freely render Client Components). This
 * mirrors the sibling Server-Component routes (`/`, `/viewer`, `/editor`), keeps
 * root-level client JS minimal, and yields a clean, hydration-noise-free first
 * paint — satisfying the zero-console-errors gate. There is no "hooks in a
 * Server Component" hazard because this file uses none.
 *
 * STATE & PROVIDERS (global — never mounted here)
 * --------------------------------------------------------------------------
 * `PreferencesProvider` (exposing `usePreferences()`) is composed in
 * `app/layout.tsx`, ABOVE `AppShell`, so the settings state lives once at the
 * root and the panel's controls read/write it directly. This page mounts NO
 * provider and calls `usePreferences()` nowhere — only the children do. The
 * prototype is UI-only / mock: settings are in-memory React state with NO
 * backend, NO API, NO persistence (a reload resets to the seeded defaults).
 *
 * RESPONSIVE STRATEGY (1440 → 1280, ZERO horizontal overflow — AAP §0.7.4)
 * --------------------------------------------------------------------------
 * The page is a flex ROW. `PreferencesNav` holds its fixed 240 px (`w-60
 * shrink-0`); `PreferencesPanel` is the flexible column (`flex-1 min-w-0`) that
 * absorbs ALL width change and shrinks BELOW its content width, so the 1200 px
 * design width is an emergent flex result (never a hard `w-[1200px]`). The page
 * root contributes the `min-h-0` (so the children's internal `overflow-auto`
 * resolves against the available height rather than growing the page) and
 * `min-w-0` discipline that, together with the panel's own `min-w-0`, guarantees
 * no horizontal scrollbar appears between the 1440 px baseline and the 1280 px
 * minimum (1280 − 240 = 1040 px still remains for the panel).
 *
 * ZERO-HARDCODED-VALUE RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * This page carries NO design-token literals (no color / gradient / radius /
 * typography / border values). It does not even set a background — the dark-navy
 * canvas (`--color-bg-app` = #0C0E1A) is painted on `<body>` by `globals.css`
 * and inherited here. The only classes are Tailwind's standard LAYOUT/flex
 * utilities (`flex`, `h-full`, `min-h-0`, `w-full`), none of which carry
 * design-token information; every surface tone, border, and type style is owned
 * inside the two composed components, which resolve them to `@theme` tokens.
 *
 * NAVIGATION INTEGRITY
 * --------------------------------------------------------------------------
 * The route is reached via in-app UI (no manual URL entry): the Library
 * `TopToolbar`'s "Prefs" control (Figma `2:31`) calls `router.push('/preferences')`.
 * This page triggers no route changes of its own; "Save & Restart" navigates
 * back to `/` from inside `PreferencesPanel`.
 *
 * UI-ONLY · NO CALIBRE COUPLING
 * --------------------------------------------------------------------------
 * No backend, no API, no real file I/O, no persistence — purely presentational
 * over in-memory mock settings. The upstream Calibre Python modules
 * (`src/calibre/gui2/preferences/main.py` — the Qt Preferences window host with
 * its category browser, active settings page, and Restore-Defaults footer; and
 * `look_feel.py` — one settings page) are a DESIGN-PARITY reference ONLY;
 * nothing is imported, translated, or executed from the Python codebase.
 *
 * @see @/components/preferences/PreferencesNav — left category nav (Figma `8:15`).
 * @see @/components/preferences/PreferencesPanel — header + settings panel (`8:8` + `8:33`).
 * @see @/components/shell/AppShell — supplies the window title bar; its `<main>` hosts this page.
 * @see @/state/PreferencesProvider — the global settings Context (`usePreferences`).
 * @see Agent Action Plan §0.3.1 / §0.7.4 — the App 06 Preferences screen specification.
 */

import PreferencesNav from '@/components/preferences/PreferencesNav';
import PreferencesPanel from '@/components/preferences/PreferencesPanel';

/**
 * PreferencesPage — the `/preferences` route (App 06 Preferences).
 *
 * Arranges App 06 as a single flex ROW that fills `AppShell`'s full-screen
 * `<main>` content slot below the window title bar:
 *   • the fixed-width LEFT `PreferencesNav` (it is self-contained: `w-60
 *     shrink-0`, 240 px), and
 *   • the flexible RIGHT `PreferencesPanel` (self-contained: `flex-1 min-w-0`,
 *     rendering the screen header + the settings sections).
 *
 * The row is `h-full min-h-0` so the two columns fill the available height and
 * scroll their OWN content (via each child's internal `overflow-auto`) rather
 * than growing the page, and `w-full` so the row spans the content slot. All
 * data, state, and interactivity are owned by the child Client Components +
 * `PreferencesProvider`; this Server Component only lays them out.
 *
 * Next.js requires a route `page.tsx` to default-export its page component.
 *
 * @returns The App 06 Preferences screen body (category nav + settings panel).
 */
export default function PreferencesPage() {
  return (
    <div className="flex h-full min-h-0 w-full">
      {/*
        LEFT — the category navigation ("CatNav", Figma `8:15`). Rendered
        DIRECTLY (no wrapper) so its own flex sizing takes effect: it is
        `w-60 shrink-0` (a fixed 240 px that never compresses), letting the
        sibling panel absorb all responsive slack. It owns its surface fill,
        right hairline, and the active-category translucent-purple highlight.
      */}
      <PreferencesNav />

      {/*
        RIGHT — the screen header + settings panel (Figma `8:8` + `8:33`).
        Rendered DIRECTLY so its `flex-1 min-w-0` sizing takes effect: it grows
        to fill the space beside the 240 px nav and shrinks below its content
        width (the no-horizontal-overflow guarantee from 1440 → 1280). It owns
        the "Preferences" header (title + Restore Defaults + Save & Restart),
        the Default-Font row, the toggle grid, the theme swatches, and the
        margins slider — so this page renders no header of its own.
      */}
      <PreferencesPanel />
    </div>
  );
}
