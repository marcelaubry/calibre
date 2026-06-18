'use client';

/**
 * ==========================================================================
 * Calibre-UI — ColumnHeader
 * The sticky, sortable column-header row for the App 01 Library List table.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ColumnHeader` renders the single sticky header row that sits atop the App 01
 * Library List table (Figma screen `2:2`, the header band within the BookList
 * container `2:73`) of the UI-only Calibre e-book-manager prototype (Next.js 15
 * App Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first
 * `@theme` tokens). It lays out seven column labels — Title, Author, Date Added,
 * Rating, Tags, Format, Size — in a CSS grid whose track template is the SHARED
 * LIST GRID CONTRACT (below) so the header cells line up exactly with the data
 * cells rendered by `BookListRow`.
 *
 * CLICK-TO-SORT (the header's one behavior)
 * --------------------------------------------------------------------------
 * Six of the seven columns are sortable; Tags is not (a book carries many tags,
 * so there is no single tag sort key). Each sortable header cell is a real,
 * keyboard-operable control: clicking it — or pressing Enter / Space — sorts the
 * library by that column through the library Context's `setSort`. The currently
 * sorted column is emphasized (brighter, slightly heavier label) and shows a
 * direction glyph (`▲` ascending, `▼` descending); re-clicking it toggles order.
 *
 * BLITZY [BEHAVIOR] — the order toggle is computed HERE, not in the provider
 * --------------------------------------------------------------------------
 * The library provider's `setSort(field, order = 'asc')` does NOT self-toggle:
 * called with only a field it always resets the order to `'asc'`. To deliver the
 * required "re-click toggles asc/desc" behavior (and parity with Calibre's
 * `HeaderView` / `reverse_sort`), this component computes the next order itself
 * and passes it explicitly — `setSort(field, nextOrder)` — which is fully within
 * the provider's published `(field, order?)` contract and therefore needs NO
 * change to the dependency. A click on a NEW column sorts ascending; re-clicking
 * the ACTIVE column flips ascending ⇄ descending.
 *
 * SHARED LIST GRID CONTRACT (MUST stay byte-identical with `BookListRow`)
 * --------------------------------------------------------------------------
 * The header and every data row are independent CSS grids; they only line up
 * because all THREE of these layout values are identical in both files:
 *   1. grid-template-columns — the {@link GRID_TEMPLATE} arbitrary-value class
 *      `minmax(0,3fr) minmax(0,2fr) minmax(0,1.2fr) minmax(0,1.2fr)
 *       minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr)`
 *      (Title 3 · Author 2 · Date 1.2 · Rating 1.2 · Tags 1.5 · Format 1 ·
 *      Size 1; ≈ 988px at the 1440 baseline). Every track is `minmax(0, …fr)`
 *      so columns shrink and content truncates rather than overflowing — the
 *      1440 → 1280 "zero horizontal overflow" gate (AAP §0.9).
 *   2. column gap — `gap-x-3` (12px).
 *   3. container horizontal padding — `px-4` (16px).
 * `BookListRow` reproduces this exact trio so the Title label sits over the row's
 * Title cell, the centered Rating label over the row's stars, and so on. The
 * Title column intentionally reserves the row's cover-thumbnail space; the
 * header's "Title" label aligns to the column's LEFT edge (the conventional
 * table-header treatment), not to the post-thumbnail text.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR resolves to an `@theme` token from `src/app/globals.css`, consumed
 * via a generated utility (`bg-surface-1`, `text-text-primary`,
 * `text-text-muted`, `text-text-secondary`, `text-accent`, `text-meta-label`,
 * `text-meta-value`) or a CSS-variable arbitrary value
 * (`border-[var(--border-white-07)]`, `ring-[var(--border-accent)]`,
 * `rounded-[var(--radius-badge)]`). There are NO raw hex / rgba color literals.
 * The only bare values are layout / geometry on Tailwind's standard scale
 * (`grid`, `h-9`, `px-4`, `gap-x-3`, `gap-1`, `min-w-0`, `truncate`, and the
 * `fr`/`minmax` track list) — none of which carry color information.
 *
 * STYLING (Figma `2:73`, reconciled with the AAP §0.3.2 token manifest)
 * --------------------------------------------------------------------------
 *   • Sticky: `sticky top-0 z-10` — the header stays pinned while rows scroll
 *     under it (Calibre uses a sticky custom `HeaderView`).
 *   • Surface: `bg-surface-1` (#10132A) — an opaque chrome surface that masks the
 *     rows scrolling beneath and matches the toolbar above; a single
 *     `border-b border-[var(--border-white-07)]` hairline divides it from the
 *     body.
 *   • Labels: Inter, 10px. The sorted column is brighter + heavier
 *     (`text-meta-value`, 10px/500 + `text-text-primary`, parity with Calibre's
 *     bold header emphasis); every other label is muted (`text-meta-label`,
 *     10px/400 + `text-text-muted`).
 *   • Direction glyph: `text-accent` (#7B61FF), decorative (`aria-hidden`) — the
 *     sort state is conveyed to assistive tech by `aria-sort` instead.
 *
 * ACCESSIBILITY (UI3 — invisible, always applied)
 * --------------------------------------------------------------------------
 * • Root is `role="row"`; each cell is `role="columnheader"`. Sortable cells are
 *   keyboard-operable (`tabIndex={0}`, Enter / Space activate, Space's default
 *   page scroll is prevented) and expose the live sort state via
 *   `aria-sort="ascending|descending|none"`. The non-sortable Tags cell is inert
 *   (no tab stop, no `aria-sort`, no pointer cursor, no glyph).
 * • A token-backed `:focus-visible` ring (`--border-accent`) is shown for
 *   keyboard users only — invisible at rest (DS2-e); the UA outline is removed.
 * • Sort direction is never conveyed by color alone (UI3): the `▲`/`▼` glyph and
 *   `aria-sort` accompany the label-color change.
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/library/
 * views.py` (`HeaderView` sort indicators + bold current-column emphasis +
 * click-to-sort / `reverse_sort`) and `models.py` (the column field map). Nothing
 * is imported or translated from the Python codebase.
 *
 * @see src/state/LibraryProvider — the `useLibrary()` sort state + `setSort`.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3 / §0.7.4 — App 01 list spec & token manifest.
 */

import { type JSX, type KeyboardEvent } from 'react';
import { useLibrary, type SortField } from '@/state/LibraryProvider';

/**
 * Props for {@link ColumnHeader}.
 *
 * The header reads all of its dynamic state (the active sort field/order and the
 * `setSort` action) from the library Context, so its only prop is an optional
 * `className` the consumer (`BookListTable`) uses to merge layout / elevation
 * utilities onto the header container (merged AFTER the base classes so caller
 * utilities win on conflicts).
 */
export interface ColumnHeaderProps {
  /** Extra classes merged onto the header `role="row"` container (caller wins). */
  className?: string;
}

/**
 * One column's static definition.
 *
 * `key` is the {@link SortField} the column sorts by, or `null` for the
 * non-sortable Tags column. `align` controls the cell's horizontal alignment —
 * `'center'` for the compact metadata columns (Date Added, Rating, Format, Size)
 * and the default `'start'` for the textual columns (Title, Author, Tags).
 */
interface ColumnDef {
  /** The sort field, or `null` when the column is not sortable (Tags). */
  key: SortField | null;
  /** The visible header label (verbatim) — also the cell's accessible name. */
  label: string;
  /** Horizontal alignment of the cell content. Defaults to `'start'`. */
  align?: 'start' | 'center';
}

/**
 * The seven columns, left → right, in the EXACT order `BookListRow` renders its
 * cells. Tags (`key: null`) is the only non-sortable column. Keep this list and
 * the {@link GRID_TEMPLATE} track count (7) in lockstep with `BookListRow`.
 *
 * Field parity with Calibre's `BooksModel` columns (`models.py`, reference only):
 * Title→`title`, Author→`author`, Date Added→`date`, Rating→`rating`,
 * Format→`format`, Size→`sizeBytes`.
 */
const COLUMNS: readonly ColumnDef[] = [
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'date', label: 'Date Added', align: 'center' },
  { key: 'rating', label: 'Rating', align: 'center' },
  { key: null, label: 'Tags' },
  { key: 'format', label: 'Format', align: 'center' },
  { key: 'sizeBytes', label: 'Size', align: 'center' },
];

/**
 * The SHARED grid-template-columns class — the single source of column geometry
 * for the App 01 list. `BookListRow` MUST use this identical track list (plus the
 * same `gap-x-3` + `px-4`) so header cells align with row cells. Tailwind v4
 * arbitrary value: `_` encodes the spaces between tracks. Every track is
 * `minmax(0, …fr)` so a column can shrink below its content width (content
 * truncates) — guaranteeing zero horizontal overflow from 1440 down to 1280.
 *
 * Proportions: Title 3 · Author 2 · Date Added 1.2 · Rating 1.2 · Tags 1.5 ·
 * Format 1 · Size 1 (total 10.9fr ≈ the 988px table width at the 1440 baseline).
 */
const GRID_TEMPLATE =
  'grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]';

/**
 * Header container (`role="row"`) classes — all token-backed.
 *
 * `sticky top-0 z-10` pins the header while rows scroll; `grid` +
 * {@link GRID_TEMPLATE} lays out the seven columns; `items-center` vertically
 * centers the labels in the `h-9` (36px) band; `gap-x-3` (12px) + `px-4` (16px)
 * are the shared column gap and side inset; `bg-surface-1` is the opaque chrome
 * surface; the `border-b border-[var(--border-white-07)]` hairline divides the
 * header from the body; `select-none` keeps repeated header clicks from
 * selecting the label text.
 */
const CONTAINER_BASE =
  'sticky top-0 z-10 grid items-center h-9 gap-x-3 px-4 select-none ' +
  'bg-surface-1 border-b border-[var(--border-white-07)] ' +
  GRID_TEMPLATE;

/**
 * Classes common to EVERY header cell — a flex box that lays the label (and the
 * optional direction glyph) on one line. `min-w-0` lets the label truncate
 * instead of forcing the track wider (overflow safety); `gap-1` (4px) separates
 * the label from the glyph; `h-full` fills the header band height.
 */
const CELL_BASE = 'flex items-center min-w-0 gap-1 h-full';

/**
 * Extra classes for a SORTABLE cell: a pointer cursor, the keyboard
 * `:focus-visible` ring (token-backed, inset, shown for keyboard users only),
 * soft `--radius-badge` corners on that ring, and a motion-safe color
 * transition. No color / size here — those come from the state class below.
 */
const CELL_SORTABLE =
  'cursor-pointer rounded-[var(--radius-badge)] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset ' +
  'focus-visible:ring-[var(--border-accent)] ' +
  'motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out';

/**
 * The ACTIVE (currently sorted) sortable cell: a brighter primary label one step
 * heavier (`text-meta-value` = 10px/500) for the Calibre bold-header emphasis.
 * No `hover:` change — the active column stays primary on hover.
 */
const CELL_ACTIVE = 'text-meta-value text-text-primary';

/**
 * An INACTIVE sortable cell: the muted 10px/400 label (`text-meta-label`) that
 * brightens to the secondary slate on hover (Tailwind v4 gates `hover:` behind
 * `@media (hover: hover)`, so touch devices get no sticky hover).
 */
const CELL_INACTIVE = 'text-meta-label text-text-muted hover:text-text-secondary';

/**
 * The non-sortable Tags cell: a plain muted 10px/400 label — no pointer, no
 * hover, no focus ring, no direction glyph.
 */
const CELL_STATIC = 'text-meta-label text-text-muted';

/**
 * Per-alignment classes for a cell's flex row + its text. Center-aligned for the
 * compact metadata columns; start-aligned (left) for the textual columns.
 */
const ALIGN_CLASS: Record<'start' | 'center', string> = {
  start: 'justify-start text-left',
  center: 'justify-center text-center',
};

/**
 * ColumnHeader — the sticky, sortable header row of the App 01 Library List.
 *
 * Reads the active `sortField` / `sortOrder` and the `setSort` action from the
 * library Context and renders the seven {@link COLUMNS} as a CSS grid that
 * mirrors `BookListRow`'s track layout. Sortable cells are keyboard-operable
 * controls that sort the library and toggle the order on re-click; the sorted
 * column shows a `▲`/`▼` glyph and a brighter, slightly heavier label. The
 * non-sortable Tags cell is inert.
 *
 * @param props - {@link ColumnHeaderProps}
 * @returns The rendered sticky header row.
 */
export function ColumnHeader({ className }: ColumnHeaderProps): JSX.Element {
  const { sortField, sortOrder, setSort } = useLibrary();

  /**
   * Sort by `field`, computing the next order so re-clicking the ACTIVE column
   * toggles ascending ⇄ descending (the provider's `setSort` does not self-
   * toggle — see the file header's BLITZY [BEHAVIOR] note). A click on any other
   * column starts at `'asc'`.
   */
  const handleSort = (field: SortField): void => {
    const nextOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSort(field, nextOrder);
  };

  /**
   * Activate the sort on Enter or Space, preventing Space's default page scroll.
   * (`' '` is the modern key value; `'Spacebar'` covers legacy engines.)
   */
  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    field: SortField,
  ): void => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      handleSort(field);
    }
  };

  // Caller className is appended last so its utilities win on conflicts (Tailwind
  // source order governs); `filter(Boolean)` drops a missing value.
  const containerClassName = [CONTAINER_BASE, className].filter(Boolean).join(' ');

  return (
    <div role="row" className={containerClassName}>
      {COLUMNS.map((col) => {
        const field = col.key;
        const align = col.align ?? 'start';
        const alignClass = ALIGN_CLASS[align];

        // ----- Non-sortable Tags column: a plain, inert label. -----
        if (field === null) {
          return (
            <div
              key={col.label}
              role="columnheader"
              className={`${CELL_BASE} ${CELL_STATIC} ${alignClass}`}
            >
              <span className="truncate">{col.label}</span>
            </div>
          );
        }

        // ----- Sortable column: keyboard-operable, aria-sort, direction glyph. -----
        const isActive = sortField === field;
        const ariaSort: 'ascending' | 'descending' | 'none' = isActive
          ? sortOrder === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none';
        const stateClass = isActive ? CELL_ACTIVE : CELL_INACTIVE;
        const indicator = sortOrder === 'asc' ? '▲' : '▼';

        return (
          <div
            key={col.label}
            role="columnheader"
            aria-sort={ariaSort}
            tabIndex={0}
            onClick={() => handleSort(field)}
            onKeyDown={(event) => handleKeyDown(event, field)}
            className={`${CELL_BASE} ${CELL_SORTABLE} ${stateClass} ${alignClass}`}
          >
            <span className="truncate">{col.label}</span>
            {isActive ? (
              <span aria-hidden="true" className="shrink-0 text-accent">
                {indicator}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default ColumnHeader;

