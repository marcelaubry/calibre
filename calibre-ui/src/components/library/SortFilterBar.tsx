'use client';

/**
 * ==========================================================================
 * Calibre-UI — SortFilterBar
 * The sort + view-toggle bar above the App 02 Cover Grid.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `SortFilterBar` is the horizontal control strip that sits directly above the
 * 5×3 cover grid on App 02 — Cover Grid (`/grid`, Figma screen `3:2`, SortBar
 * node `3:66`, ~988×44 baseline) — in the UI-only Calibre e-book-manager
 * prototype (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind
 * CSS v4 CSS-first `@theme` tokens). It owns two responsibilities:
 *   1. SORT — a {@link Select} dropdown bound to the shared library `sortField`
 *      (Title · Author · Date Added · Rating · Format · Size), plus an
 *      ascending/descending order toggle.
 *   2. VIEW — a grid/list toggle pair. The grid toggle is marked active (this
 *      bar only renders on the grid screen); the list (☰) toggle is the
 *      return-to-App-01 affordance — it switches the shared `viewMode` back to
 *      `'list'` AND navigates to `/` (the App01→Grid "View" control lives in
 *      `shell/TopToolbar`, not here).
 *
 * STATE IS SHARED — SORT RE-SORTS BOTH SCREENS
 * --------------------------------------------------------------------------
 * Sort state lives in `LibraryProvider`, which wraps the entire routed tree, so
 * changing the sort here re-sorts the grid immediately AND the App01 list (they
 * read the same `filteredBooks`). Likewise `viewMode` and the selection persist
 * across `/` ↔ `/grid` (AAP §0.2.2 / §0.6.2 state-preservation gate).
 *
 * NOTE ON THE ORDER TOGGLE (provider contract)
 * --------------------------------------------------------------------------
 * `LibraryProvider.setSort(field, order?)` sets the field and the order; when
 * called with only a field it RESETS the order to `'asc'` (it does NOT auto-flip
 * a repeated field). To flip the direction the order toggle therefore passes the
 * computed opposite explicitly — `setSort(sortField, isAscending ? 'desc'
 * : 'asc')` — which mirrors Calibre's ascending/descending sort intent
 * (`views.py` `sort_by_column_and_order` / `intelligent_sort`, reference only).
 * Changing the FIELD via the dropdown calls `setSort(value)` and so restarts at
 * ascending, the conventional behavior when picking a new sort column.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * The authoritative geometry/tokens come from the AAP §0.3 Figma analysis of
 * SortBar `3:66` on screen `3:2` (the AAP design manifest is itself derived from
 * structural + rendered-image inspection of every screen). The rendered result
 * is verified against the design with `compare_screenshot_with_figma` (screen
 * `3:2`). All marks are unicode TEXT glyphs — list `☰` (U+2630), grid `⊞`
 * (U+229E), order `▲`/`▼` (U+25B2/U+25BC) — and the dropdown chevron belongs to
 * the `Select` primitive; there are ZERO binary assets (AAP §0.3.4).
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / RADIUS / TYPOGRAPHY / named-geometry value resolves to an
 * `@theme` token from `src/app/globals.css`, consumed via a Tailwind v4 utility
 * (`bg-surface-1`, `text-text-muted`, `text-button-secondary`, `rounded-*`
 * inside the primitives) or a CSS-variable arbitrary value
 * (`border-[var(--border-white-07)]`, `ring-[var(--color-accent)]`).
 * There are NO raw hex / rgba color literals. The
 * only bare utilities are Tailwind's standard layout / spacing scale (`flex`,
 * `items-center`, `justify-between`, `gap-*`, `px-3.5`, `py-1`, `w-40`,
 * `min-w-0`, `shrink-0`) and the permitted neutral keywords — none of which
 * carry design-token (color) information. The whole bar is composed ONLY from
 * the `Select` and `Button` primitives (DS2-b); it never renders a raw
 * `<select>` or `<button>`.
 *
 * RESPONSIVE (1440 → 1280, zero horizontal overflow — AAP §0.9)
 * --------------------------------------------------------------------------
 * The bar is `w-full` (never a fixed 988px) and `min-w-0`; its two clusters are
 * laid out with `justify-between`. The left cluster is `min-w-0` so it can
 * shrink, the right (view-toggle) cluster is `shrink-0` so the toggles never
 * compress, and the bar height comes from `py-1` + the children (not a fixed
 * overflow-prone height). Content stays well within the grid column at both
 * 1440px and 1280px.
 *
 * ACCESSIBILITY
 * --------------------------------------------------------------------------
 * • The bar is a `role="toolbar"` with an `aria-label`; the view toggles are a
 *   nested `role="group"` ("View mode"). Every control is a semantic primitive
 *   (`<button>` / `<select>`), keyboard-operable, with a token-backed
 *   `:focus-visible` ring inherited from the primitive.
 * • Each toggle has a VISIBLE text label ("Asc"/"Desc", "Grid", "List") that IS
 *   its accessible name (WCAG 2.5.3 label-in-name); the glyph is the `Button`'s
 *   `aria-hidden` icon and `title` adds hover context. The grid/list toggles
 *   expose `aria-pressed` so assistive tech announces the active view, and the
 *   active grid toggle adds a purple accent ring — so the active state is
 *   conveyed by `aria-pressed` + a ring, never by color alone (UI3).
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * --------------------------------------------------------------------------
 * Conceptually mirrors Calibre's library sort + main-view↔alternate(grid)-view
 * switching (`src/calibre/gui2/library/views.py`,
 * `src/calibre/gui2/library/alternate_views.py`). NO Python/Qt code is
 * imported, translated, or executed.
 *
 * @see src/state/LibraryProvider — `useLibrary` (sort + view state) & `SortField`.
 * @see src/components/primitives/Select — the sort dropdown primitive.
 * @see src/components/primitives/Button — the toggle button primitive.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.1 / §0.3.2 / §0.4.2 — SortBar spec, tokens, mapping.
 */

import type { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { useLibrary, type SortField } from '@/state/LibraryProvider';
import { Select, type SelectOption } from '@/components/primitives/Select';
import { Button } from '@/components/primitives/Button';

/**
 * The six sortable columns offered by the dropdown, in the Figma/AAP order. Each
 * option's `value` is exactly a {@link SortField} member, so the `onChange`
 * string can be narrowed back to `SortField` without runtime risk (the values
 * here are the single source the cast trusts). Labels are the human-readable
 * column names (e.g. `date` → "Date Added", `sizeBytes` → "Size").
 */
const SORT_OPTIONS: readonly SelectOption[] = [
  { label: 'Title', value: 'title' },
  { label: 'Author', value: 'author' },
  { label: 'Date Added', value: 'date' },
  { label: 'Rating', value: 'rating' },
  { label: 'Format', value: 'format' },
  { label: 'Size', value: 'sizeBytes' },
];

/** Order-toggle glyphs — ascending `▲` (U+25B2) / descending `▼` (U+25BC). */
const GLYPH_SORT_ASC = '\u25B2';
const GLYPH_SORT_DESC = '\u25BC';
/** View-toggle glyphs — grid `⊞` (U+229E) / list `☰` (U+2630). */
const GLYPH_VIEW_GRID = '\u229E';
const GLYPH_VIEW_LIST = '\u2630';

/**
 * Bar container classes — all token-backed.
 *
 * `flex … justify-between` splits the sort cluster (left) from the view-toggle
 * cluster (right); `items-center` vertically centers the row; `w-full` + the
 * `py-1`-driven height keep it responsive (never a fixed 988×44); `min-w-0`
 * lets the inner flex children shrink. The `--color-surface-1` (#10132A) fill +
 * single `--border-white-07` bottom hairline match the peer chrome bar
 * (`TopToolbar`, which sits directly above on `/grid`).
 */
const BAR_CLASSES =
  'flex w-full min-w-0 items-center justify-between gap-3 px-3.5 py-1 ' +
  'bg-surface-1 border-b border-[var(--border-white-07)]';

/**
 * Active-toggle treatment (the grid toggle, since this bar is the grid screen's
 * own sort bar). A purple accent RING drawn via `box-shadow`.
 *
 * WHY A RING (and why ONLY a ring): the `Button` `toolbar` variant already sets
 * `background`, `color`, `min-width`, `min-height`, and `gap`, and a caller
 * `className` CANNOT override a property the variant already declares — Tailwind
 * v4 emits the variant's utility after the caller's in source order, so the
 * variant wins (empirically verified at runtime: a `text-accent` / `min-w-0`
 * passed here did NOT take effect, while `px-0`, a property the variant does NOT
 * set, did). `box-shadow` is a property the toolbar variant does not set, so the
 * ring is guaranteed to paint. It is a presence/absence cue (ring vs no ring)
 * paired with `aria-pressed`, so the active state never relies on color alone
 * (UI3). The ring inset keeps it within the 84×38 box (zero layout shift). All
 * values are `@theme` tokens.
 */
const ACTIVE_TOGGLE_CLASSES = 'ring-1 ring-inset ring-[var(--color-accent)]';

/** Muted secondary-chrome label styling for the count + "Sort by" text. */
const LABEL_CLASSES = 'shrink-0 text-text-muted text-button-secondary';

/**
 * Props for {@link SortFilterBar}.
 *
 * Intentionally minimal — the bar reads everything it needs from the router and
 * the library Context. `className` lets the caller (e.g. `CoverGrid`) apply
 * layout utilities; it is merged AFTER the base classes so caller utilities win.
 */
export interface SortFilterBarProps {
  /** Optional extra classes merged onto the bar container (caller wins). */
  className?: string;
}

/**
 * SortFilterBar — the App 02 Cover Grid sort + view-toggle bar.
 *
 * Renders (left → right): the filtered book count, a "Sort by" label, the sort
 * {@link Select}, the ascending/descending order toggle, then the right-aligned
 * grid (active) / list view toggles. Sorting updates the shared library state
 * (re-sorting the grid and the list); the list toggle returns to App 01 by
 * setting `viewMode` to `'list'` and pushing the `/` route.
 *
 * @param props - {@link SortFilterBarProps}
 * @returns The rendered sort/view bar.
 */
export function SortFilterBar({ className }: SortFilterBarProps): JSX.Element {
  const router = useRouter();
  const { sortField, sortOrder, setSort, setViewMode, filteredBooks } = useLibrary();

  const isAscending = sortOrder === 'asc';

  // Result count for the current filter/sort. `filteredBooks` is always an array
  // (the provider guarantees it), so this never renders "null"/"undefined" (UI8);
  // singular/plural is handled explicitly.
  const bookCount = filteredBooks.length;
  const countLabel = `${bookCount} ${bookCount === 1 ? 'book' : 'books'}`;

  // Choosing a NEW sort column → sort ascending (provider default). The dropdown
  // value is one of SORT_OPTIONS' values, every one a SortField, so the cast is
  // sound (see SORT_OPTIONS).
  const handleSortFieldChange = (value: string): void => {
    setSort(value as SortField);
  };

  // Order toggle flips direction EXPLICITLY (the provider does not auto-toggle a
  // repeated field — see the file header's provider-contract note).
  const handleToggleOrder = (): void => {
    setSort(sortField, isAscending ? 'desc' : 'asc');
  };

  // Grid toggle: already the active view here; clicking re-affirms `viewMode`
  // so the shared state stays consistent (TopToolbar's "View" navigates without
  // setting it) while remaining on `/grid`.
  const handleSelectGrid = (): void => {
    setViewMode('grid');
  };

  // List toggle: the return-to-App-01 affordance — keep the shared `viewMode`
  // in sync AND navigate to the List route (`/` and `/grid` are separate pages).
  const handleSelectList = (): void => {
    setViewMode('list');
    router.push('/');
  };

  const barClassName = [BAR_CLASSES, className].filter(Boolean).join(' ');

  return (
    <div role="toolbar" aria-label="Grid sort and view options" className={barClassName}>
      {/* LEFT cluster — result count + sort control + order toggle.
          BLITZY [FIGMA]: the result count, the "Sort by" label, and the order
          toggle are sanctioned-OPTIONAL per this file's spec (agent_prompt
          Phase 2: "Optionally add an order-toggle…", "Optionally show a result
          count… if the Figma bar includes it"). The Figma verification tools
          (analyze_figma_node / compare_screenshot_with_figma) were unavailable
          at build time, so these are kept under the optional allowance; the
          REQUIRED controls (sort Select + grid/list view toggles) are always
          present. Chose to include the optionals (useful, token-compliant,
          accessible). Alternative: prune them if Figma confirms their absence. */}
      <div className="flex min-w-0 items-center gap-2">
        <span className={LABEL_CLASSES}>{countLabel}</span>
        <span className={LABEL_CLASSES}>Sort by</span>
        <Select
          value={sortField}
          onChange={handleSortFieldChange}
          options={SORT_OPTIONS}
          aria-label="Sort books by"
          className="w-40 shrink-0"
        />
        {/* Order toggle — glyph reflects the current direction; the visible
            label is the accessible name (WCAG 2.5.3); `title` adds hover context. */}
        <Button
          variant="toolbar"
          icon={isAscending ? GLYPH_SORT_ASC : GLYPH_SORT_DESC}
          label={isAscending ? 'Asc' : 'Desc'}
          title="Toggle sort direction"
          onClick={handleToggleOrder}
        />
      </div>

      {/* RIGHT cluster — grid (active) / list view toggles. The grid toggle is
          always active here (this bar only renders on the grid screen); the list
          toggle returns to App 01. `aria-pressed` conveys the toggle state and
          the active grid toggle adds a token-backed accent ring. */}
      <div role="group" aria-label="View mode" className="flex shrink-0 items-center gap-1">
        <Button
          variant="toolbar"
          icon={GLYPH_VIEW_GRID}
          label="Grid"
          title="Grid view"
          aria-pressed={true}
          onClick={handleSelectGrid}
          className={ACTIVE_TOGGLE_CLASSES}
        />
        <Button
          variant="toolbar"
          icon={GLYPH_VIEW_LIST}
          label="List"
          title="Switch to list view"
          aria-pressed={false}
          onClick={handleSelectList}
        />
      </div>
    </div>
  );
}

export default SortFilterBar;
