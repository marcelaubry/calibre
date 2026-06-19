'use client';

/**
 * ==========================================================================
 * Calibre-UI — ReaderToolbar (App 03 · Figma node `4:8`)
 * The E-book Viewer's OWN dedicated top toolbar.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ReaderToolbar` is the App 03 E-book Viewer's dedicated action bar — the
 * full-width 1440×44 bar (Figma node `4:8`) that sits directly UNDER the macOS
 * window title bar (rendered by `AppShell`, NOT here) and ABOVE the reading
 * surface on the Viewer screen (`4:2`). It is part of the UI-only, mock-data
 * Calibre prototype (Next.js 15 App Router · React 19 · TypeScript 5 strict ·
 * Tailwind CSS v4 CSS-first `@theme` tokens).
 *
 * It exposes the viewer's three control groups (AAP §0.3.1 Workflow 2 / §0.7.4):
 *   • Back-to-Library — exits the immersive reader back to the Library List
 *     (`/`) via the App Router (the AAP `App03 → App01` "← Library" workflow).
 *   • Font scale A- / A+ — decreases / increases the reading body font scale by
 *     driving the shared `ReaderProvider` `fontScale` (init 1, clamped 0.8–1.6,
 *     step 0.1) that the `ReadingArea` consumes.
 *   • Theme switch — cycles the viewer color theme (Dark → Light → Sepia →
 *     High Contrast → Dark …), reading/writing the SINGLE source of truth
 *     `preferences.viewerTheme` on `PreferencesProvider`.
 *
 * It is DISTINCT from the app-wide shell `TopToolbar`: App 03 is a focused
 * reading mode entered via "Read Now" and exited via "Library". This toolbar
 * owns no state of its own — it reads/writes the shared reader + preferences
 * Contexts, and its only navigation side effect is the Back-to-Library push.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * It calls `useRouter()` (`next/navigation`) plus the `useReader()` /
 * `usePreferences()` Context hooks and binds `onClick` handlers, so it MUST be a
 * Client Component (App Router components default to Server Components, which can
 * neither use those hooks nor attach event handlers). The directive is the very
 * first line, before any import.
 *
 * THEME LIVES IN PREFERENCES, NOT THE READER
 * --------------------------------------------------------------------------
 * The viewer theme is owned by `PreferencesProvider` (`preferences.viewerTheme`
 * + `setViewerTheme`), NOT `ReaderProvider`. This toolbar therefore reads and
 * writes the theme ONLY through `usePreferences()`, so the App 06 Preferences
 * swatches and this in-viewer switch can never disagree. No local theme state is
 * kept — the rendered glyph/label always reflects `preferences.viewerTheme`.
 *
 * FIGMA SOURCE OF TRUTH + FALLBACK (file `JduUzjVHNhZivm5A0pAiCD`, node `4:8`/`4:2`)
 * --------------------------------------------------------------------------
 * The mandatory `analyze_figma_node(4:8)` reconciliation subagent was
 * UNAVAILABLE during this implementation session (it errored on every retry).
 * Per the precedence rules — the AAP §0.3 specification and this file's agent
 * brief "win on scope; [the] subagent reinforces exact values" — the values
 * below come from the AAP-authoritative manifest + the explicit agent brief,
 * corroborated by the two CONFIRMED sibling toolbars (`TopToolbar` node `2:8`
 * and `EditorToolbar` node `5:8`), exactly as `TopToolbar` did when its Figma
 * subagents were unreachable. Every value still resolves to a named `@theme`
 * token:
 *   • Bar `4:8` → 1440×44, solid fill `--color-surface-1` (#10132A) — the
 *     established toolbar surface (both sibling toolbars are CONFIRMED
 *     surface-1, and the agent brief names surface-1 as the likely bar fill);
 *     plus a 1px bottom hairline `--border-white-07` (the agent brief's explicit
 *     value and the app's dominant hairline, matching `TopToolbar`).
 *   • Back-to-Library → the `Button` `secondary` variant with a `←` (U+2190)
 *     glyph and the verbatim label "Library". The `secondary` variant's label
 *     color `--color-text-secondary` (#94A3B8) clears WCAG AA on `surface-1`, so
 *     the back-affordance avoids the toolbar-variant muted-label gap that
 *     `EditorToolbar` documents.
 *   • A- / A+ / theme → the `Button` `toolbar` variant (84×38 min, radius 7px,
 *     transparent at rest, a 15px glyph + a 9px label).
 *   • Glyphs are unicode TEXT (AAP §0.3.4 — there are NO icon asset files): the
 *     `←` back arrow, the `A−` (U+2212) / `A+` font controls, and the per-theme
 *     switch glyphs (🌙 ☀️ 📖 ◐), matching the emoji-glyph pattern the sibling
 *     toolbars already use.
 *
 * THEME SWITCH = SINGLE CYCLING BUTTON (Option A)
 * --------------------------------------------------------------------------
 * The agent brief offers either a single cycling button (Option A) or an inline
 * `ThemeSwatch` group (Option B). The `ThemeSwatch` tile is a FIXED 154×98px
 * preview — four of them cannot fit inside a 44px-tall bar (each tile is 98px
 * tall, more than twice the bar height) — so Option A is the only geometrically
 * valid choice and the brief names it "preferred for a 44px bar". One `toolbar`
 * `Button` cycles `['dark','light','sepia','high-contrast']` and its glyph +
 * label always reflect the current `preferences.viewerTheme`. (`ThemeSwatch` is
 * therefore intentionally NOT imported.)
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color resolves to an `@theme` token declared in `src/app/globals.css`:
 * the bar fill via the `bg-surface-1` utility and the hairline via the
 * `border-[var(--border-white-07)]` arbitrary-value utility; every button's
 * fill / border / text color / radius / typography lives INSIDE the `Button`
 * primitive's variants and is not re-specified here. The only bare literals are
 * Tailwind's standard layout scale (`h-11` = 44px, `w-full`, `px-3.5` ≈ 14px,
 * `gap-2`, `gap-1.5`, `ml-auto`, `flex-none`) and permitted keywords. There is
 * NO hex / rgba color literal anywhere in this file.
 *
 * RESPONSIVE (AAP — 1440 → 1280, zero horizontal overflow)
 * --------------------------------------------------------------------------
 * `w-full` spans the bar (never a fixed 1440px); `flex-none` keeps the 44px
 * height when the toolbar is stacked in the viewer's vertical column. The Back
 * button sits at the inline start and the `ml-auto` control cluster is pinned to
 * the inline end; the row holds only a handful of compact controls, so it never
 * approaches the bar width and there is no horizontal overflow at any supported
 * width (1440 down to 1280).
 *
 * ACCESSIBILITY (UI3 — invisible, always applied)
 * --------------------------------------------------------------------------
 * • The bar is a `role="toolbar"` group with an `aria-label`; each control is a
 *   semantic `<button>` (from the `Button` primitive), keyboard-operable via Tab
 *   and activated by Space/Enter, with a token-backed `:focus-visible` ring.
 * • Every glyph is `aria-hidden` (the `Button` primitive wraps the icon in an
 *   `aria-hidden` span), so each button's accessible name comes from its visible
 *   label; a `title` adds a human-readable tooltip/description ("Back to
 *   Library", "Decrease font size", "Increase font size", "Change viewer theme")
 *   WITHOUT breaking the WCAG 2.5.3 "label in name" criterion.
 *
 * DESIGN-PARITY REFERENCE ONLY (NO code reuse): `src/calibre/gui2/viewer/
 * toolbars.py` and `ui.py` model the real Calibre viewer toolbar (navigation,
 * font/zoom, and color-scheme switching synced to reader state). Nothing is
 * imported or translated from the Python codebase; only the visual bar and the
 * Back-to-Library navigation / font-scale / theme-switch wiring are reproduced.
 *
 * @see src/state/ReaderProvider.tsx — `useReader()`: the font-scale actions.
 * @see src/state/PreferencesProvider.tsx — `usePreferences()`: the viewer theme.
 * @see src/components/primitives/Button.tsx — the `Button` primitive consumed here.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see src/calibre/gui2/viewer/toolbars.py — Calibre viewer toolbar (reference only).
 */

import type { JSX } from 'react';
import { useRouter } from 'next/navigation';

import { useReader } from '@/state/ReaderProvider';
import { usePreferences } from '@/state/PreferencesProvider';
import { Button } from '@/components/primitives/Button';
import type { ViewerTheme } from '@/types';

/**
 * Cosmetic font-scale bounds, mirroring the clamp the shared `ReaderProvider`
 * enforces (its `MIN_FONT_SCALE` / `MAX_FONT_SCALE` are private to the
 * provider). These drive ONLY the disabled state of the A- / A+ buttons (so the
 * control visibly bottoms-out / tops-out at the limits); the provider remains
 * the authoritative clamp, so even if a value ever drifted the worst case is a
 * still-enabled button that simply no-ops at the bound. They carry no color
 * information (permitted numeric layout literals).
 */
const MIN_FONT_SCALE = 0.8;
const MAX_FONT_SCALE = 1.6;

/**
 * The viewer color themes in cycle order — identical to the order rendered by
 * the App 06 `ThemeSwatch` row and to the `ViewerTheme` union in `@/types`.
 * Clicking the theme switch advances to the next entry, wrapping around.
 */
const VIEWER_THEMES: readonly ViewerTheme[] = ['dark', 'light', 'sepia', 'high-contrast'];

/**
 * Per-theme presentation for the cycling theme switch: the unicode glyph shown
 * as the button icon and the verbatim label. Glyphs are TEXT (AAP §0.3.4 — no
 * asset files) and follow the emoji-glyph convention the sibling toolbars use.
 * The rendered glyph + label always reflect the CURRENT `preferences.viewerTheme`
 * (DS2-e — the resting state shows the current value, not a hover/other state).
 */
const THEME_META: Record<ViewerTheme, { readonly glyph: string; readonly label: string }> = {
  dark: { glyph: '🌙', label: 'Dark' },
  light: { glyph: '☀️', label: 'Light' },
  sepia: { glyph: '📖', label: 'Sepia' },
  'high-contrast': { glyph: '◐', label: 'High Contrast' },
};

/**
 * Bar container classes — all token-backed. `flex items-center` lays out and
 * vertically centers the row; `h-11` is the 44px bar height (Figma `4:8`);
 * `w-full` keeps it responsive (never a fixed 1440px); `flex-none` preserves the
 * height inside the viewer's vertical column; `px-3.5` is the ~14px side inset;
 * `gap-2` spaces the bar's direct children. The `--color-surface-1` fill and the
 * `--border-white-07` bottom hairline complete the surface (see the file header
 * for the Figma-fallback sourcing of both tokens).
 */
const BAR_CLASSES =
  'flex h-u44 w-full flex-none items-center gap-u8 px-u14 ' +
  'bg-surface-1 border-b border-[var(--border-white-07)]';

/**
 * Props for {@link ReaderToolbar}. Intentionally minimal: the toolbar reads
 * everything it needs from the router and the reader/preferences Contexts.
 * `className` lets a caller (e.g. `AppShell` or the viewer page) apply layout /
 * elevation utilities, merged AFTER the base classes so caller utilities win on
 * conflicts.
 */
export interface ReaderToolbarProps {
  /** Optional extra classes merged onto the bar container (caller wins). */
  className?: string;
}

/**
 * ReaderToolbar — the App 03 E-book Viewer's own top action bar (Figma `4:8`).
 *
 * Renders a full-width 44px `role="toolbar"` bar: a Back-to-Library button at
 * the inline start, then an inline-end cluster of the A- / A+ font-scale
 * controls and a single cycling viewer-theme switch. Back navigates to the
 * Library List (`/`) via the App Router; A- / A+ drive the shared
 * `ReaderProvider` font scale; the theme switch advances `preferences.viewerTheme`
 * on `PreferencesProvider`. The component holds no state of its own — every value
 * it renders is derived from the shared Contexts.
 *
 * @param props - {@link ReaderToolbarProps}
 * @returns The rendered viewer toolbar.
 */
export function ReaderToolbar({ className }: ReaderToolbarProps): JSX.Element {
  const router = useRouter();
  const { increaseFontScale, decreaseFontScale, fontScale } = useReader();
  const { preferences, setViewerTheme } = usePreferences();

  // Current theme presentation (glyph + label) — always derived from the single
  // source of truth (`preferences.viewerTheme`), never a local copy.
  const currentTheme = preferences.viewerTheme;
  const themeMeta = THEME_META[currentTheme];

  // Advance to the next theme in VIEWER_THEMES, wrapping around. `indexOf` would
  // return -1 only for an impossible off-union value; the `+ 1` then yields index
  // 0 (Dark), so the switch always lands on a valid theme.
  const cycleTheme = (): void => {
    const nextIndex = (VIEWER_THEMES.indexOf(currentTheme) + 1) % VIEWER_THEMES.length;
    setViewerTheme(VIEWER_THEMES[nextIndex]);
  };

  // Merge the caller className last so its utilities win on conflicts.
  const barClassName = [BAR_CLASSES, className].filter(Boolean).join(' ');

  return (
    <header role="toolbar" aria-label="Reader toolbar" className={barClassName}>
      {/* Inline-start: exit the reader back to the Library List (`/`). */}
      <Button
        variant="secondary"
        label="Library"
        icon="←"
        title="Back to Library"
        onClick={() => router.push('/')}
      />

      {/* Inline-end cluster: font scale + viewer theme. `ml-auto` pins it to the
          bar's trailing edge while the Back button stays at the inline start. */}
      <div className="ml-auto flex items-center gap-u6">
        <Button
          variant="toolbar"
          label="A−"
          title="Decrease font size"
          onClick={() => decreaseFontScale()}
          disabled={fontScale <= MIN_FONT_SCALE}
        />
        <Button
          variant="toolbar"
          label="A+"
          title="Increase font size"
          onClick={() => increaseFontScale()}
          disabled={fontScale >= MAX_FONT_SCALE}
        />
        <Button
          variant="toolbar"
          label={themeMeta.label}
          icon={themeMeta.glyph}
          title="Change viewer theme"
          onClick={cycleTheme}
        />
      </div>
    </header>
  );
}
