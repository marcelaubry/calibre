'use client';

/**
 * ==========================================================================
 * Calibre-UI — PreferencesPanel
 * The App 06 Preferences Settings Panel (8:33) — HEADERLESS.
 * ==========================================================================
 *
 * ARCHITECTURE NOTE (header ownership — full-width, hoisted out of this file)
 * --------------------------------------------------------------------------
 * Renders ONLY the App06 Settings Panel (`8:33`). Per Figma screen `8:2`, the
 * App06 Header (`8:8`, 1440×52) is a FULL-WIDTH bar that spans the entire screen
 * width ABOVE both the left CatNav (`8:15`) and this settings panel — it is NOT
 * scoped to this right column. The header therefore lives in its own full-width
 * component, {@link PreferencesHeader}, which the route (`app/preferences/
 * page.tsx`) stacks ABOVE the nav+panel horizontal row. This panel is
 * deliberately HEADERLESS to avoid duplicating that header and to let the CatNav
 * begin BELOW the full-width header (the exact Figma geometry).
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `PreferencesPanel` is the composite RIGHT-hand column of the App 06
 * Preferences screen (Figma screen `8:2`) in the UI-only Calibre e-book-manager
 * prototype (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind
 * CSS v4 CSS-first tokens). It renders the SETTINGS PANEL (Figma node `8:33`,
 * ~1200×816) — a vertical stack of four sections in AAP §0.7.4 order:
 *   (a) the Default Font row (a font-family dropdown + a font-size dropdown),
 *       authored here;
 *   (b) the 2×3 Reading-Behavior toggle grid — delegated to
 *       {@link ReadingBehaviorGrid};
 *   (c) the four Viewer-Theme swatches — delegated to {@link ViewerThemeSwatches};
 *       and
 *   (d) the Margins slider — delegated to {@link MarginsSlider}.
 * This file is the COMPOSITION container for the settings body: it owns the
 * section headings it is responsible for and the Default Font row, and it
 * arranges the three leaf section components. The screen header (title +
 * Restore Defaults + Save & Restart) is owned by the sibling
 * {@link PreferencesHeader}, NOT here. All settings live in `PreferencesProvider`
 * (React Context) — there is NO backend, NO persistence, and NO real restart.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The panel calls the `usePreferences` Context hook and binds `onChange`
 * handlers (the two font dropdowns), which require a Client Component — App
 * Router components default to Server Components, which cannot run hooks or bind
 * event handlers. The directive is the very first line, before any import. The
 * component is deterministic / SSR-safe: it reads only Context state and static
 * module-scope option lists, with NO `window`, `Math.random`, `Date.now`,
 * `new Date()`, or `localStorage` access and NO mount-time mutation, so server
 * and client render identically and the screen hydrates with zero
 * console/hydration errors.
 *
 * SECTION-HEADING OWNERSHIP (the one composition subtlety)
 * --------------------------------------------------------------------------
 * The three leaf sections differ in whether they render their own caption, so
 * this panel supplies a heading ONLY where the child does not, to avoid
 * duplicate headers (DS2-d, no hallucinated elements):
 *   • {@link ReadingBehaviorGrid} renders the GRID ONLY (no caption) → this
 *     panel renders the "Reading Behavior" section heading above it.
 *   • {@link ViewerThemeSwatches} renders its OWN "Viewer Color Themes" `<h2>`
 *     caption → this panel adds NO heading for that section.
 *   • {@link MarginsSlider} renders its OWN "Content margins" field `<label>` →
 *     this panel adds NO heading for that section.
 * The Default Font row is authored here, so this panel also renders its
 * "Default Font" heading. The two headings authored here reuse the exact
 * treatment of the `ViewerThemeSwatches` caption — `text-card-title uppercase
 * tracking-wide text-text-secondary` — so every section caption is visually
 * consistent across the panel.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * App 06 Preferences screen `8:2`; Settings Panel `8:33` (the full-width Header
 * `8:8` is owned by {@link PreferencesHeader}, not here). The scope and section
 * order are fixed by AAP §0.3.1 (Workflow 6) and §0.7.4 (Default Font row; 2×3
 * behavior grid; four theme swatches; margins slider — in that order). The
 * exact per-element values are reconciled from the AAP §0.3.2 token manifest
 * and the already-Figma-verified sibling components (`PreferencesNav` 8:15,
 * `ViewerThemeSwatches` 8:82–8:93, `MarginsSlider` 8:98–8:102), which were
 * authored with analyze_figma_node + compare_screenshot_with_figma against
 * screen `8:2`. Every value below maps 1:1 to an `@theme` token.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / RADIUS / TYPOGRAPHY value resolves to an `@theme` token from
 * `src/app/globals.css`, consumed via a Tailwind v4 utility (`bg-bg-app`,
 * `text-dialog-heading`, `text-text-primary`, `text-card-title`,
 * `text-text-secondary`) or a CSS-variable arbitrary value
 * (`border-[var(--border-white-07)]`). The dropdown surfaces come from the
 * {@link Select} primitive — this file adds NO color literal. The only bare
 * values are LAYOUT / SPACING utilities from the Tailwind scale (`flex`,
 * `flex-col`, `flex-1`, `min-w-0`, `min-h-0`, `h-full`, `items-center`,
 * `gap-3`, `gap-8`, `px-8`, `py-8`, `w-72`, `w-32`, `overflow-y-auto`) and the
 * `uppercase` / `tracking-wide` transforms — none of which carry
 * color/radius/font-size token information. There are NO raw hex / rgba color,
 * px-radius, or px-font literals anywhere in this file.
 *
 * RESPONSIVE INTEGRITY (AAP §0.7.4 — 1440 → 1280, zero horizontal overflow)
 * --------------------------------------------------------------------------
 * This panel is the FLEXIBLE right column of the App 06 two-column body: it
 * carries `flex-1 min-w-0` so it absorbs all width change while the sibling
 * `PreferencesNav` (`w-60 shrink-0`, 240px) stays fixed. The 1200px design
 * width is NEVER hardcoded. The settings content scrolls VERTICALLY
 * (`overflow-y-auto`) when it exceeds the viewport height — never horizontally —
 * so the layout degrades cleanly from the 1440px baseline to the 1280px minimum
 * with zero horizontal overflow. The font dropdowns and the leaf sections are
 * each fluid/min-width-safe within this column.
 *
 * UI-ONLY · IN-MEMORY · NO PERSISTENCE
 * --------------------------------------------------------------------------
 * The settings controls read/write the in-memory `PreferencesProvider` state
 * directly (UI-only mock — NO backend, NO persistence). The "Restore Defaults"
 * and "Save & Restart" actions live in the sibling {@link PreferencesHeader}; a
 * page reload resets every setting to the seeded defaults (AAP §0.8.2 — "no
 * required localStorage").
 *
 * ACCESSIBILITY (UI3 — invisible, always applied; never conflicts with Figma)
 * --------------------------------------------------------------------------
 * • The settings content is a `<section>` named by the screen `<h1>`
 *   ("Preferences", owned by {@link PreferencesHeader}) via `aria-labelledby`,
 *   importing the shared {@link SCREEN_TITLE_ID} so the cross-component
 *   reference stays in sync.
 * • The section captions authored here are real `<h2>` headings (one logical
 *   level below the screen `<h1>`), with stable, deterministic ids (SSR-safe —
 *   there is exactly one of each section per page).
 * • Each font dropdown gets an `aria-label` (its visual caption is the shared
 *   "Default Font" heading, so a per-control accessible name is supplied
 *   explicitly); the {@link Select} primitive renders a real, keyboard-operable
 *   `<select>`.
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/preferences/
 * look_feel.py` and `behavior.py` — the Qt preference controllers whose
 * font/behavior settings this screen is the web analog of. Nothing is imported,
 * translated, or executed from the Python codebase.
 *
 * @see src/components/preferences/PreferencesHeader.tsx — the full-width screen header (owns the title + actions + SCREEN_TITLE_ID).
 * @see src/components/preferences/ReadingBehaviorGrid.tsx — the 2×3 toggle grid.
 * @see src/components/preferences/ViewerThemeSwatches.tsx — the four theme swatches.
 * @see src/components/preferences/MarginsSlider.tsx — the margins slider section.
 * @see src/components/primitives/Select.tsx — the chevron dropdown primitive.
 * @see src/state/PreferencesProvider.tsx — the settings Context (`usePreferences`).
 * @see src/data/preferences.ts — the `fontOptions` family list.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.1 / §0.3.2 / §0.7.4 — Preferences screen + tokens.
 */

import { Select, type SelectOption } from '@/components/primitives/Select';
import { usePreferences } from '@/state/PreferencesProvider';
import { fontOptions } from '@/data/preferences';

import { SCREEN_TITLE_ID } from './PreferencesHeader';
import ReadingBehaviorGrid from './ReadingBehaviorGrid';
import ViewerThemeSwatches from './ViewerThemeSwatches';
import MarginsSlider from './MarginsSlider';

/* --------------------------------------------------------------------------
 * Module-scope dropdown option lists.
 *
 * Computed ONCE at module load (deterministic, SSR-safe — no randomness, no
 * time, no DOM), so they are stable across renders and require no `key` in JSX
 * (the `Select` primitive owns the `<option>` keys). Defining them here (rather
 * than inside the component) avoids re-allocating the arrays on every render.
 * ------------------------------------------------------------------------ */

/**
 * Font-SIZE choices for the Default Font row's size dropdown, in pixels.
 *
 * `@/data/preferences` intentionally ships only a font-FAMILY list
 * ({@link fontOptions}); the size scale is a presentation concern owned here. A
 * compact, readable 12–24px ladder covers the common reading sizes; the default
 * `preferences.fontSizePx` (16) is a member, so the dropdown always opens on a
 * valid selection. Each label carries the " px" unit; the `value` is the bare
 * number as a string (the controlled `Select` is value-typed `string`), which
 * the caller parses back with `Number(...)` before calling `setFontSize`.
 */
const FONT_SIZE_OPTIONS: SelectOption[] = [12, 14, 16, 18, 20, 22, 24].map((n) => ({
  label: `${n} px`,
  value: String(n),
}));

/**
 * Font-FAMILY choices for the Default Font row's family dropdown.
 *
 * Derived 1:1 from the shared {@link fontOptions} list (`@/data/preferences`),
 * normalized to the `{ label, value }` {@link SelectOption} shape the `Select`
 * primitive consumes. The default `preferences.fontFamily` (`'Georgia'`) is a
 * member of `fontOptions`, so the dropdown always opens on a valid selection.
 */
const FONT_FAMILY_OPTIONS: SelectOption[] = fontOptions.map((family) => ({
  label: family,
  value: family,
}));

/* --------------------------------------------------------------------------
 * Stable, deterministic element ids (SSR-safe).
 *
 * Module constants — NOT `useId()`-generated — because there is exactly one of
 * each on the Preferences page, so a fixed id can never collide, and a static
 * value guarantees identical server/client DOM (zero hydration mismatch). The
 * screen-title id ({@link SCREEN_TITLE_ID}) is owned by {@link PreferencesHeader}
 * (which renders the `<h1>`) and imported here so the settings `<section>` can
 * reference it via `aria-labelledby` across the component boundary.
 * ------------------------------------------------------------------------ */

/** The "Default Font" section `<h2>` id. */
const DEFAULT_FONT_HEADING_ID = 'preferences-default-font-heading';
/** The "Reading Behavior" section `<h2>` id (names the grid's group). */
const READING_BEHAVIOR_HEADING_ID = 'preferences-reading-behavior-heading';

/* --------------------------------------------------------------------------
 * Token-backed class strings (module scope so they are allocated once and the
 * token usage is auditable in one place). Every color/radius/typography value
 * resolves to an `@theme` token; only Tailwind-scale layout/spacing utilities
 * and case/letter-spacing transforms are bare (they carry no token info).
 * ------------------------------------------------------------------------ */

/**
 * Settings panel (Figma `8:33`) — the flexible, scrollable RIGHT column of the
 * App 06 two-column body row (the full-width header `8:8` sits ABOVE this row,
 * owned by {@link PreferencesHeader}). This headerless panel IS the settings
 * `<section>` directly:
 *   • `flex-1 min-w-0` absorbs all width change (the sibling `PreferencesNav`
 *     stays fixed at `w-60`), guaranteeing zero horizontal overflow from 1440px
 *     to 1280px (the 1200px design width is an emergent flex result, never a
 *     hard `w-[1200px]`);
 *   • `h-full min-h-0` fills the body-row height and lets the column shrink
 *     below its content so `overflow-y-auto` resolves against the available
 *     height (VERTICAL scroll only — never horizontal);
 *   • `flex-col` + `gap-8` (32px) gives the four sections their inter-section
 *     rhythm; `px-8` (32px) inline + `py-8` (32px) block padding frame them;
 *   • `bg-bg-app` is the dark-navy canvas (#0C0E1A) the controls/cards sit on.
 * Horizontal-overflow integrity is enforced purely by `min-w-0` + the children's
 * own min-width safety (NOT by an `overflow-x-hidden` guard, which `globals.css`
 * deliberately avoids app-wide so a real layout bug is surfaced, not masked).
 */
const SECTION_CLASSES =
  'flex h-full min-h-0 min-w-0 flex-1 flex-col gap-u32 overflow-y-auto bg-bg-app px-u32 py-u32';

/**
 * Section caption treatment, reused by the headings authored here so every
 * section caption matches the `ViewerThemeSwatches` "Viewer Color Themes"
 * header: the `text-card-title` role (Inter 600 / 11px) `uppercase` +
 * `tracking-wide`, in the secondary slate token, with `mb-3` (12px) rhythm down
 * to the section body. `select-none` avoids stray selection.
 */
const SECTION_HEADING_CLASSES =
  'mb-u12 select-none text-card-title uppercase tracking-wide text-text-secondary';

/**
 * The Default Font row: the two dropdowns side by side, vertically centered,
 * with a `gap-3` (12px) gutter and `flex-wrap` so the size dropdown drops below
 * the family dropdown rather than overflowing if the column gets very narrow.
 */
const DEFAULT_FONT_ROW_CLASSES = 'flex flex-wrap items-center gap-u12';

/**
 * Family dropdown width — `w-72` (18rem / 288px), the design's wide font-family
 * field (≈ the `Select` primitive's documented `w-[280px]` Preferences width),
 * sized on the wrapper per the `Select` contract (callers own the control
 * width). The dropdown's surface, border, radius, chevron, and typography are
 * all token-backed inside `Select`.
 */
const FAMILY_SELECT_CLASSES = 'w-u288';

/**
 * Size dropdown width — `w-32` (8rem / 128px), the compact font-size field
 * beside the family dropdown, sized on the wrapper per the `Select` contract.
 */
const SIZE_SELECT_CLASSES = 'w-u128';

/**
 * PreferencesPanel — the App 06 Preferences Settings Panel (`8:33`), headerless.
 *
 * Reads the live settings from {@link usePreferences}. Renders the four settings
 * sections (the full-width screen header is owned by the sibling
 * {@link PreferencesHeader}): the Default Font row (family + size dropdowns
 * bound to `setFontFamily` / `setFontSize`), the {@link ReadingBehaviorGrid},
 * the {@link ViewerThemeSwatches}, and the {@link MarginsSlider}. The settings
 * `<section>` is named by the screen `<h1>` via `aria-labelledby` using the
 * imported {@link SCREEN_TITLE_ID}. Holds no local state; takes no props.
 *
 * @returns The rendered headerless Preferences settings panel.
 */
export default function PreferencesPanel() {
  const { preferences, setFontFamily, setFontSize } = usePreferences();

  return (
    /* SETTINGS PANEL (Figma 8:33) — four sections in AAP §0.7.4 order. The
       screen `<h1>` ("Preferences") lives in the full-width PreferencesHeader;
       this section is named by it via `aria-labelledby={SCREEN_TITLE_ID}`. */
    <section aria-labelledby={SCREEN_TITLE_ID} className={SECTION_CLASSES}>
      {/* (1) Default Font — heading authored here + family/size dropdowns. */}
        <div>
          <h2 id={DEFAULT_FONT_HEADING_ID} className={SECTION_HEADING_CLASSES}>
            Default Font
          </h2>
          <div className={DEFAULT_FONT_ROW_CLASSES}>
            <Select
              value={preferences.fontFamily}
              options={FONT_FAMILY_OPTIONS}
              onChange={setFontFamily}
              aria-label="Default font family"
              className={FAMILY_SELECT_CLASSES}
            />
            <Select
              value={String(preferences.fontSizePx)}
              options={FONT_SIZE_OPTIONS}
              onChange={(nextValue) => setFontSize(Number(nextValue))}
              aria-label="Default font size"
              className={SIZE_SELECT_CLASSES}
            />
          </div>
        </div>

        {/* (2) Reading Behavior — heading authored here (the child grid renders
            no caption); the grid's `role="group"` is named by this heading. */}
        <div>
          <h2 id={READING_BEHAVIOR_HEADING_ID} className={SECTION_HEADING_CLASSES}>
            Reading Behavior
          </h2>
          <ReadingBehaviorGrid />
        </div>

        {/* (3) Viewer Color Themes — the child renders its OWN "Viewer Color
            Themes" caption, so no heading is added here (avoid duplication). */}
        <ViewerThemeSwatches />

      {/* (4) Margins — the child renders its OWN "Content margins" field
          label, so no heading is added here (avoid duplication). */}
      <MarginsSlider />
    </section>
  );
}
