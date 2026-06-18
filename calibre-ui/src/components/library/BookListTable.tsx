'use client';

/**
 * ==========================================================================
 * Calibre-UI Library — BookListTable
 * The scrollable, sortable book table at the center of App 01 (Library List).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `BookListTable` is the centerpiece of the App 01 Library List screen (Figma
 * file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`, screen `2:2`, BookList container
 * node `2:73`, ~988×820 baseline) of the UI-only Calibre e-book-manager
 * prototype (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind
 * CSS v4 CSS-first `@theme` tokens). It is the assembled "table": a single
 * sticky `ColumnHeader` row pinned above a vertically-scrolling list of
 * `BookListRow`s — one row per book in the library's filtered, sorted view.
 *
 * It is a thin COMPOSITION layer. All cell content, typography, selection
 * behavior, and click-to-sort live in the two child components; this file owns
 * only the table's container chrome (surface + scroll region + sticky header
 * mechanics), the data fan-out, and the empty state. It renders NO raw controls
 * of its own (no `<button>` / `<input>` / `<table>`), composing exclusively
 * from `ColumnHeader` + `BookListRow` (which in turn compose the design-system
 * primitives).
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The table reads the shared library state through the `useLibrary` Context hook
 * (App Router components default to Server Components, which cannot call React
 * Context hooks), so the `'use client'` directive is the first line of the file.
 * Its render is deterministic (no `Math.random` / `Date.now` / `window`), so it
 * hydrates without warnings and satisfies the zero-console-errors gate.
 *
 * DATA FLOW — `filteredBooks` IS THE SINGLE SOURCE OF ROWS
 * --------------------------------------------------------------------------
 * The rows are driven entirely by `useLibrary().filteredBooks`, the provider's
 * memoized selector that has ALREADY applied the active sidebar filters
 * (section / tag / author) AND the current sort (`sortField` / `sortOrder`).
 * This component does NOT re-filter or re-sort — it simply maps `filteredBooks`
 * to rows. Because the SAME `filteredBooks` selector backs both the List (`/`)
 * and the Grid (`/grid`), the two views always show the identical set, and
 * selecting/sorting/filtering persists across the `/` ↔ `/grid` navigation
 * (the provider sits above the router outlet — AAP §0.6.2). When the sidebar
 * filters or the header sort change, `filteredBooks` recomputes and this table
 * re-renders live.
 *
 * GRID ALIGNMENT — THE SHARED `LIST_GRID_TEMPLATE` CONTRACT (CRITICAL)
 * --------------------------------------------------------------------------
 * The header and every data row are INDEPENDENT CSS grids; their cells line up
 * only because `ColumnHeader` and `BookListRow` apply the byte-identical
 * `grid-template-columns` track list — the single, exported `LIST_GRID_TEMPLATE`
 * constant defined in `./BookListRow` and imported by `./ColumnHeader` — plus
 * the identical column gap (`gap-x-3`) and horizontal inset (`px-3`). This
 * `BookListTable` deliberately does NOT redeclare or apply that template: it is
 * a vertical STACK (sticky header + scrolling rows), not a grid itself, so the
 * alignment is owned end-to-end by the two children. Keeping the template in one
 * place (`BookListRow`, consumed by `ColumnHeader`) — rather than duplicating it
 * here — is what guarantees the three files can never drift, and it preserves
 * the dependency direction (`BookListTable` → {`ColumnHeader`, `BookListRow`})
 * without an import cycle. Every track is `minmax(0, …fr)`, so the table reflows
 * from the 1440 px baseline down to the 1280 px minimum with ZERO horizontal
 * overflow (AAP §0.9) — reinforced here by `overflow-x-hidden`.
 *
 * STICKY HEADER + SCROLLING BODY
 * --------------------------------------------------------------------------
 * The `role="table"` container IS the scroll viewport (`overflow-y-auto`), and
 * `ColumnHeader` is rendered as its DIRECT child carrying `sticky top-0 z-10`
 * (from `ColumnHeader` itself). Because the header's containing block is the
 * scroll container's content box (which spans every row), the header stays
 * pinned across the ENTIRE scroll while the rows scroll beneath it. The rows are
 * wrapped in a `role="rowgroup"` (the `<tbody>` equivalent) so the ARIA table
 * tree is well-formed. The header is intentionally NOT wrapped in its own
 * rowgroup: a short wrapper would become the sticky element's containing block
 * and clip it after ~36 px of scroll.
 *
 * RESPONSIVE LAYOUT (1440 → 1280, zero horizontal overflow)
 * --------------------------------------------------------------------------
 * The table is the flexible CENTER column of the App 01 three-column shell
 * (216 px `Sidebar` · this table · 236 px `BookDetailPanel`). It is sized with
 * `flex-1 min-w-0` — never a hard `w-[988px]` — so it absorbs the 160 px delta
 * as the window narrows from 1440 to 1280 while the fixed side columns hold
 * their widths. `min-w-0` lets it shrink below its content width so the
 * `minmax(0, …fr)` cell tracks (and their truncating content) never force a
 * horizontal scrollbar. It fills the available height with `h-full` + `min-h-0`
 * so the body scrolls internally instead of pushing the page taller.
 *
 * ZERO-HARDCODED-VALUES RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / typography value resolves to an `@theme` token from
 * `src/app/globals.css` — `bg-surface-1` (the #10132A list surface that matches
 * the sticky header and the toolbar above), `text-text-muted` (#64748B), and
 * `text-body` (Inter 12px/400). The only bare values are layout / geometry on
 * Tailwind's standard scale (`flex-1`, `min-w-0`, `min-h-0`, `h-full`,
 * `overflow-y-auto`, `overflow-x-hidden`, `px-4`, `py-16`, `text-center`) — none
 * of which carry design-token / color information.
 *
 * ACCESSIBILITY (UI3 — invisible, always applied)
 * --------------------------------------------------------------------------
 * The container is `role="table"` with an `aria-label`; the header is a
 * `role="row"` of `role="columnheader"` cells (from `ColumnHeader`); the data
 * rows are grouped in a `role="rowgroup"`. The empty state is announced as a
 * single full-width `role="cell"` (`aria-colspan`) inside its own `role="row"`,
 * keeping the table tree valid even with no data.
 *
 * Design-parity reference only (NO code reuse): Calibre's
 * `src/calibre/gui2/library/views.py` (`BooksView` — a table with a sticky
 * `HeaderView`, a selection model, and named-field sort) and `models.py`
 * (`BooksModel` — the filtered/sorted row source). Nothing is imported,
 * translated, or executed from the Python codebase.
 *
 * @see @/state/LibraryProvider — `useLibrary` (`filteredBooks` selector).
 * @see ./ColumnHeader — the sticky, sortable header row.
 * @see ./BookListRow — one rendered book row + the exported `LIST_GRID_TEMPLATE`.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3 / §0.7.4 — App 01 list spec & token manifest.
 */

import type { JSX } from 'react';

import { useLibrary } from '@/state/LibraryProvider';
import { ColumnHeader } from './ColumnHeader';
import { BookListRow } from './BookListRow';

/**
 * Number of columns in the App 01 list (Title · Author · Date Added · Rating ·
 * Tags · Format · Size). Used only by the empty-state cell's `aria-colspan` so
 * the placeholder message is announced as spanning the full table width. Kept in
 * lockstep with the column count rendered by `ColumnHeader` / `BookListRow`.
 */
const LIST_COLUMN_COUNT = 7;

/**
 * The `role="table"` container — which is ALSO the vertical scroll viewport.
 *
 * - `flex-1 min-w-0` — grow to fill the center of the App 01 flex-row shell
 *   between the fixed-width sidebar and detail panel, and allow shrinking below
 *   content width (the overflow-safety floor that lets the `minmax(0, …fr)` cell
 *   tracks reflow from 1440 → 1280 without a horizontal scrollbar).
 * - `h-full min-h-0` — fill the available vertical space and allow the flex item
 *   to be constrained to it, so the body scrolls internally rather than growing
 *   the page.
 * - `overflow-y-auto` — the scroll mechanism the sticky `ColumnHeader` pins
 *   against; `overflow-x-hidden` — the belt-and-suspenders guarantee of ZERO
 *   horizontal overflow across the 1440 → 1280 range.
 * - `bg-surface-1` — the #10132A list surface, continuous with the sticky header
 *   (also `bg-surface-1`) and the toolbar above it.
 */
const TABLE_CONTAINER_CLASSES =
  'flex-1 min-w-0 h-full min-h-0 overflow-y-auto overflow-x-hidden bg-surface-1';

/**
 * The empty-state cell classes — a centered, muted placeholder message.
 *
 * `px-4 py-16 text-center` is generous standard-scale padding with centered text
 * (reads as a centered empty state); `text-body` is the Inter 12px/400 role and
 * `text-text-muted` is the #64748B muted token.
 */
const EMPTY_MESSAGE_CLASSES = 'px-4 py-16 text-center text-body text-text-muted';

/**
 * The placeholder text shown when the active filters match no books. Verbatim,
 * presentational copy (no real search/data behind it — the prototype is
 * UI-only).
 */
const EMPTY_MESSAGE = 'No books match the current filters.';

/**
 * Props for {@link BookListTable}.
 *
 * The table reads all of its data from the library Context, so its only prop is
 * an optional `className` the host page (the App 01 route) may merge onto the
 * container to tweak layout/elevation — appended AFTER the base classes so the
 * caller's utilities win on conflicts. The defaults are fully self-sufficient:
 * the table renders correctly with no props.
 */
export interface BookListTableProps {
  /** Extra classes merged onto the `role="table"` container (caller wins). */
  className?: string;
}

/**
 * BookListTable — the assembled, scrollable, sortable App 01 library table.
 *
 * Renders the sticky {@link ColumnHeader} above a `role="rowgroup"` of
 * {@link BookListRow}s, one per book in `useLibrary().filteredBooks` (already
 * filtered + sorted by the provider). When the filters match no books, a single
 * centered, muted placeholder row is shown in place of the rows. The container
 * is the scroll viewport, so the header stays pinned while the body scrolls, and
 * it flexes to fill the center of the three-column shell with zero horizontal
 * overflow from 1440 px down to 1280 px.
 *
 * @param props - {@link BookListTableProps}
 * @returns The rendered library table.
 */
export function BookListTable({ className }: BookListTableProps = {}): JSX.Element {
  // `filteredBooks` already reflects the active sidebar filters AND the current
  // sort — the provider computes it. Do NOT re-sort or re-filter here.
  const { filteredBooks } = useLibrary();
  const isEmpty = filteredBooks.length === 0;

  // Caller className is appended last so its utilities win on conflicts (Tailwind
  // source order governs); `filter(Boolean)` drops a missing value.
  const containerClassName = [TABLE_CONTAINER_CLASSES, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div role="table" aria-label="Library books" className={containerClassName}>
      {/* Sticky header — a DIRECT child of the scroll container so its
          `sticky top-0` (declared inside ColumnHeader) pins across the whole
          scroll. It shares the exported LIST_GRID_TEMPLATE with every row, so
          the header cells align exactly over the data cells beneath. */}
      <ColumnHeader />

      {/* Data rows (the <tbody> equivalent). One row per filtered/sorted book;
          re-renders live whenever `filteredBooks` changes. */}
      <div role="rowgroup">
        {isEmpty ? (
          <div role="row">
            <div
              role="cell"
              aria-colspan={LIST_COLUMN_COUNT}
              className={EMPTY_MESSAGE_CLASSES}
            >
              {EMPTY_MESSAGE}
            </div>
          </div>
        ) : (
          filteredBooks.map((book) => <BookListRow key={book.id} book={book} />)
        )}
      </div>
    </div>
  );
}

export default BookListTable;
