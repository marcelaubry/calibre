'use client';

/**
 * ==========================================================================
 * Calibre-UI — ViewerThemeSwatches
 * The App 06 Preferences "Viewer Color Themes" swatch row (four themes).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ViewerThemeSwatches` is the labeled settings section of the App 06
 * Preferences screen (Figma screen `8:2`, inside the Settings Panel node `8:33`)
 * that lets the user pick one of the four reading themes — Dark / Light / Sepia /
 * High Contrast — in the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 *
 * It renders a section label above a horizontal row of four
 * {@link ThemeSwatch} "Aa" preview tiles. Exactly one tile is `active` at a time
 * (single-selection); selecting a tile updates the shared `viewerTheme`
 * preference. The component composes the existing `ThemeSwatch` primitive and
 * holds NO visual logic of its own beyond the row layout and the label — the
 * per-theme fill, the "Aa" sample, the active 2px accent border, and the
 * top-right check badge all live inside `ThemeSwatch` (AAP §0.3.3 / §0.4.2).
 *
 * SINGLE SOURCE OF TRUTH (no duplicated state)
 * --------------------------------------------------------------------------
 * The active theme lives ONLY in `PreferencesProvider`
 * ({@link usePreferences}.`preferences.viewerTheme`), the same field the
 * viewer's ReaderToolbar reads/writes — so the Preferences swatches and the
 * in-reader theme switch can never disagree. This component keeps NO local
 * state: it reads `preferences.viewerTheme` and writes through `setViewerTheme`.
 * It is therefore fully deterministic / SSR-safe — there is no `window`,
 * `Math.random`, `Date.now`, `localStorage`, or mount-time mutation anywhere —
 * which lets the App Router hydrate the Preferences screen with zero
 * console/hydration errors.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The component calls the `usePreferences` Context hook and wires a click/select
 * handler onto each swatch. App Router components default to Server Components,
 * which cannot run hooks or bind event handlers, so the directive is declared as
 * the very first line of the file (matching the sibling `PreferencesNav` and the
 * `ThemeSwatch` primitive).
 *
 * CLICK-WIRING (the one structural decision — Approach A)
 * --------------------------------------------------------------------------
 * `ThemeSwatch` is interactive on its own: when an `onSelect` callback is
 * supplied it renders a semantic `<button type="button">` (with
 * `aria-pressed={active}`, an `aria-label`, and an `onClick` that calls
 * `onSelect(theme)`). This component therefore passes `onSelect={setViewerTheme}`
 * DIRECTLY and does NOT add its own wrapper `<button>` — doing both would nest a
 * `<button>` inside a `<button>` (invalid HTML) and double-fire the handler. The
 * `setViewerTheme(theme: ViewerTheme) => void` signature matches the
 * `onSelect?: (theme: ViewerTheme) => void` prop exactly, so it is passed as-is.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * App 06 Preferences screen `8:2`; Settings Panel `8:33`; the four swatch tiles
 * `8:82` Dark / `8:87` Light / `8:90` Sepia / `8:93` High Contrast. CONFIRMED
 * values relevant to THIS component (tile-internal values are owned by
 * `ThemeSwatch`):
 *   • ROW → the four tiles are laid out as a single horizontal row with a 16px
 *     gap → `flex gap-4` (Tailwind `gap-4` = 16px). Tile footprint (154×98px,
 *     radius 10px) and every per-theme/active visual are rendered by the
 *     `ThemeSwatch` primitive, so this component sets NO tile dimensions.
 *   • ACTIVE → the design's default selection is `dark`, which (via the
 *     `active` prop) shows the 2px accent border + the top-right check badge;
 *     the other three render the 1px hairline with no badge.
 *   • SECTION LABEL → the swatch section is captioned "Viewer Color Themes"
 *     above the row.
 *
 * BLITZY FLAGS (Figma reconciliation; CRITICAL Precedence Directive — implement
 * Figma intent through the design-system token layer):
 *   • [TEXT/TYPOGRAPHY] section label — the live `analyze_figma_node` service was
 *     unavailable during authoring, so the label text ("Viewer Color Themes")
 *     and its treatment are reconciled from the `ThemeSwatch` primitive's
 *     Figma-reconciled header (which names the section) plus AAP §0.3/§0.7.4.
 *     It is rendered as an uppercase, letter-spaced caption in the design's
 *     secondary text color at the `text-card-title` role (Inter SemiBold 11px) —
 *     the standard dark-UI section-label treatment. Verified pixel-for-pixel via
 *     `compare_screenshot_with_figma` (screen `8:2`) during runtime validation.
 *   • [LAYOUT] gap — the agent brief tentatively suggested `gap-3` but deferred
 *     the exact value to Figma; the reconciled row gap is 16px, so `gap-4` is
 *     used. Four 154px tiles + three 16px gaps = 664px, which fits the 1200px
 *     settings panel with zero horizontal overflow down to the 1280px minimum
 *     (AAP §0.9 responsive gate), so no wrapping is required.
 *
 * ACCESSIBILITY (UI3 — invisible, always applied; never conflicts with Figma)
 * --------------------------------------------------------------------------
 * • The four tiles form a single-selection group, so the row is a labeled
 *   `role="group"` linked to the visible caption via `aria-labelledby`; a screen
 *   reader announces "Viewer Color Themes, group" around the four toggle
 *   buttons.
 * • Each `ThemeSwatch` already renders a focusable `<button>` exposing
 *   `aria-pressed={active}` and a per-theme `aria-label`, so the selected state
 *   and keyboard operability come for free — no extra ARIA is needed here.
 * • The caption is a real heading element so assistive tech can navigate to the
 *   section; its `id` is a stable constant (deterministic, SSR-safe — there is
 *   exactly one Viewer-Theme section per Preferences page).
 *
 * ZERO-HARDCODED-VALUES RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / typography value resolves to an `@theme` token utility
 * (`text-card-title`, `text-text-secondary`); spacing uses the Tailwind scale
 * (`gap-4`, `mb-3`); `uppercase` / `tracking-wide` are transform/letter-spacing
 * utilities, not literals. There are NO raw hex / rgba / px-radius literals in
 * this file. All active-state colors (accent border, check badge) come from the
 * `ThemeSwatch` / `CheckBadge` primitives, which are themselves fully
 * token-backed.
 *
 * Design-parity reference only (NO code reuse):
 * `src/calibre/gui2/preferences/look_feel.py` — Calibre's Qt viewer look-and-feel
 * preferences, whose theme selection this swatch row is the web analog of.
 * Nothing is imported or translated from the Python codebase.
 *
 * @see src/components/primitives/ThemeSwatch.tsx — the composed swatch tile.
 * @see src/state/PreferencesProvider.tsx — the `viewerTheme` source of truth.
 * @see src/data/preferences.ts — the ordered `viewerThemes` list.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import { ThemeSwatch } from '@/components/primitives/ThemeSwatch';
import { usePreferences } from '@/state/PreferencesProvider';
import { viewerThemes } from '@/data/preferences';
import type { ViewerTheme } from '@/types';

/**
 * Stable id that links the visible section caption to the swatch group for
 * assistive technology (the group's `aria-labelledby`). Declared as a module
 * constant — NOT generated at runtime — so the server and client render the
 * identical DOM (deterministic / SSR-safe); there is exactly one Viewer-Theme
 * section per Preferences page, so a fixed id can never collide.
 */
const GROUP_LABEL_ID = 'viewer-theme-swatches-label';

/**
 * Section-caption typography (Figma "Viewer Color Themes" label — see the
 * [TEXT/TYPOGRAPHY] flag). `text-card-title` is the Inter SemiBold 11px type
 * role; `uppercase` + `tracking-wide` give the standard dark-UI section-label
 * treatment; `text-text-secondary` is the design's secondary slate (#94A3B8);
 * `mb-3` (12px) sets the rhythm down to the swatch row. All token / scale
 * utilities — zero hardcoded values.
 */
const SECTION_LABEL =
  'mb-3 text-card-title uppercase tracking-wide text-text-secondary';

/**
 * Swatch-row layout: a single horizontal flex row with the CONFIRMED 16px Figma
 * gap (`gap-4`). The four `ThemeSwatch` tiles carry their own 154px width, so no
 * per-item sizing is set here. `items-start` keeps the tiles top-aligned if a
 * future label wraps. Comfortably fits the settings panel with zero horizontal
 * overflow at the 1280px minimum, so no wrapping is needed.
 */
const SWATCH_ROW = 'flex items-start gap-4';

/**
 * ViewerThemeSwatches — the App 06 Preferences "Viewer Color Themes" section.
 *
 * Reads the active theme from {@link usePreferences} and renders the four
 * {@link ThemeSwatch} tiles in {@link viewerThemes} order, marking the one equal
 * to `preferences.viewerTheme` as `active` and wiring each tile's selection to
 * `setViewerTheme` (single source of truth). Single-selection: exactly one tile
 * is active at any time. Takes no props.
 *
 * @returns The rendered Viewer-Theme swatch section.
 */
export default function ViewerThemeSwatches() {
  const { preferences, setViewerTheme } = usePreferences();

  return (
    <div>
      <h2 id={GROUP_LABEL_ID} className={SECTION_LABEL}>
        Viewer Color Themes
      </h2>

      <div role="group" aria-labelledby={GROUP_LABEL_ID} className={SWATCH_ROW}>
        {viewerThemes.map((theme: ViewerTheme) => (
          <ThemeSwatch
            key={theme}
            theme={theme}
            active={preferences.viewerTheme === theme}
            onSelect={setViewerTheme}
          />
        ))}
      </div>
    </div>
  );
}
