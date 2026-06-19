'use client';

/**
 * ==========================================================================
 * Calibre-UI Library — BookListRow
 * A single row of the App 01 Library List table (Figma screen 2:2 · BookList
 * node 2:73 · cover thumb 2:347 · rating 2:348).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `BookListRow` renders ONE book as a 7-column row of the App 01 library list
 * table for the UI-only Calibre e-book-manager prototype (Next.js 15 App Router
 * · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens). The
 * seven columns, left -> right, mirror the `ColumnHeader` order and Calibre's
 * `BooksModel` column map exactly:
 *
 *   Title · Author · Date Added · Rating · Tags · Format · Size
 *
 * It is composed EXCLUSIVELY from design-system primitives —
 * `BookCoverPlaceholder` (the generated cover thumb), `StarRating` (the amber
 * rating), `TagPill` (the tag chips), and `FormatBadge` (the format chip) — plus
 * the pure `@/lib/format` display helpers. It renders NO raw `<button>` /
 * `<input>` controls and embeds NO real cover art (covers are generated
 * placeholders per AAP §0.9).
 *
 * WHY 'use client'
 * --------------------------------------------------------------------------
 * The row reads the shared library state through the `useLibrary` Context hook
 * and binds `onClick` / `onKeyDown` handlers (App Router components default to
 * Server Components, which can do neither), so the whole component is a Client
 * Component. Its render is deterministic (no `Math.random` / `Date.now`), so it
 * hydrates without warnings.
 *
 * SELECTION BEHAVIOR (parity with Calibre's list view)
 * --------------------------------------------------------------------------
 * In the LIST view a plain click selects exactly one book and makes it the
 * current/detail book via `selectOnly(book.id)` — which sets `selectedIds=[id]`
 * AND `currentBookId=id`, driving the right-hand `BookDetailPanel`. This mirrors
 * Calibre's single current-row semantics (`views.py` `currentRowChanged` ->
 * `on_current_row_change`); the multi-select tiles live in the Grid's `BookCard`,
 * not here. Reference only — no Python is imported, translated, or executed.
 *
 * GRID ALIGNMENT (shared template — see {@link LIST_GRID_TEMPLATE})
 * --------------------------------------------------------------------------
 * The row is itself a CSS grid whose `grid-template-columns` is the exported
 * {@link LIST_GRID_TEMPLATE}. `ColumnHeader` (and the `BookListTable` wrapper)
 * MUST apply the IDENTICAL template (import this constant) so every cell aligns
 * under its header. The template is all-fractional (`minmax(0, …fr)`) so the
 * 1440 px baseline reflows to the 1280 px minimum with ZERO horizontal overflow —
 * no fixed-px track can push the table wider than its container.
 *
 * ZERO-HARDCODED-VALUES RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / size / radius / typography value resolves to an `@theme` token
 * from `src/app/globals.css` (e.g. `text-text-primary`, `text-text-secondary`,
 * `text-text-muted`, `text-body`, `text-meta-label`, `bg-accent/10`,
 * `border-[var(--border-white-07)]`, `bg-[var(--border-accent)]`). The only
 * non-token literals are the permitted keywords (`transparent` etc.), Tailwind's
 * standard spacing/width scale utilities (`px-3`, `gap-x-3`, `w-0.5`,
 * `font-medium`), and the layout-only `grid-template-columns` track ratios
 * (`fr` / `minmax`), which carry no design-token information.
 *
 * @see @/types — the `Book` contract and the `FormatKind` union.
 * @see @/state/LibraryProvider — `useLibrary` (selection + current book).
 * @see @/components/primitives — StarRating · TagPill · FormatBadge · BookCoverPlaceholder.
 * @see @/lib/format — `formatFileSize` / `formatDate`.
 * @see src/calibre/gui2/library/{views,models,delegates}.py — parity reference ONLY.
 * @see Agent Action Plan §0.3 / §0.7.4 — the authoritative row design spec.
 */

import type { JSX, KeyboardEvent } from 'react';

import type { Book, FormatKind } from '@/types';
import { useLibrary } from '@/state/LibraryProvider';
import { StarRating } from '@/components/primitives/StarRating';
import { TagPill } from '@/components/primitives/TagPill';
import { FormatBadge } from '@/components/primitives/FormatBadge';
import { BookCoverPlaceholder } from '@/components/primitives/BookCoverPlaceholder';
import { formatFileSize, formatDate } from '@/lib/format';

/**
 * The shared 7-column grid template for the App 01 Library List table.
 *
 * Column order (MUST stay in lockstep with `ColumnHeader`):
 *   Title · Author · Date Added · Rating · Tags · Format · Size
 *
 * Both `ColumnHeader` and every `BookListRow` apply THIS exact string as their
 * `grid-template-columns` so cells align perfectly under their headers — import
 * this constant rather than re-declaring it, so the two can never drift.
 *
 * All tracks are `minmax(0, …fr)` (purely fractional, no fixed px): the `0`
 * lower bound lets every track shrink with the viewport, and the `fr` upper
 * bound distributes the remaining width by ratio, so the 1440 px baseline
 * degrades to the 1280 px minimum with ZERO horizontal overflow. Cell content
 * truncates (text) or clips (fixed-size chips) INSIDE its track rather than
 * widening it. The ratios start from the AAP's recommended proportions and are
 * tuned so the common case of two tag pills fits without clipping: the date and
 * rating tracks (whose content — a formatted date and five 14 px stars — has a
 * near-fixed intrinsic width) are trimmed to fund a wider Tags track
 * (Title 2.05 : Author 1.5 : Date 1.1 : Rating 0.9 : Tags 2.1 : Format 0.65 : Size 0.78).
 * Date gets a slightly wider track than its label needs at 1440 so the full
 * "Mon DD, YYYY" still fits at the 1280 px minimum without dropping the year.
 *
 * Companion conventions `ColumnHeader` should match for pixel-exact alignment:
 * the row horizontal inset `px-3` and the inter-column gap `gap-x-3`.
 */
export const LIST_GRID_TEMPLATE =
  'minmax(0, 2.05fr) minmax(0, 1.5fr) minmax(0, 1.1fr) minmax(0, 0.9fr) ' +
  'minmax(0, 2.1fr) minmax(0, 0.65fr) minmax(0, 0.78fr)';

/**
 * Maximum number of tag chips rendered inline in the Tags cell before the
 * remainder is collapsed into a muted "+N" overflow indicator. This keeps the
 * cell from overflowing its track — the dataset carries up to three tags per
 * book, so without a cap a 3-tag row could push past its column at 1280 px.
 */
const MAX_VISIBLE_TAGS = 2;

/**
 * Base row classes (applied to every row, in both states).
 *
 * - `group relative` — positioning context for the absolutely-positioned active
 *   accent bar (a child that adds NO layout width, so rows stay perfectly
 *   aligned with the header whether active or not).
 * - `grid items-center gap-x-3 px-3 py-2.5` — the 7-column grid (the template is
 *   set inline from {@link LIST_GRID_TEMPLATE}), vertically-centered cells, a
 *   token-scale inter-column gap, a row horizontal inset, and ~10px vertical
 *   padding -> a comfortable ~46px row height expressed via PADDING (never a
 *   fixed, overflow-prone height).
 * - `text-body` — the 12px / Inter-400 baseline every cell inherits (cells
 *   override color on their own element, and the title overrides weight on its
 *   own element, so no same-element font utilities ever conflict).
 * - `border-b border-[var(--border-white-07)]` — the 1px bottom hairline divider
 *   (rgba(255,255,255,0.07)).
 * - `cursor-pointer transition-colors` — pointer affordance + smooth state tint.
 * - `outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)]`
 *   — a keyboard-only focus ring (the row is `tabIndex={0}`), shown for keyboard
 *   users via `:focus-visible` and never on mouse click (UI3). Always applied
 *   (invisible accessibility — no visual impact at rest).
 */
const ROW_BASE_CLASSES =
  'group relative grid items-center gap-x-u12 px-u12 py-u10 text-body ' +
  'border-b border-[var(--border-white-07)] cursor-pointer transition-colors ' +
  'outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)]';

/**
 * Extra classes when the row is highlighted (the current/selected book): a
 * translucent accent wash (`bg-accent/10` = the `--color-accent` token at 10%).
 * The purple left indicator is a SEPARATE absolutely-positioned child (rendered
 * below) so it adds no layout width and never shifts the cells.
 */
const ROW_ACTIVE_CLASSES = 'bg-accent/10';

/**
 * Extra classes when the row is NOT highlighted: a subtle accent tint on hover
 * only (`hover:bg-accent/5` = the `--color-accent` token at 5%). The tint is a
 * low-cost color change with no sticky-hover pitfall, and the row already
 * exposes distinct keyboard-focus and selection states.
 */
const ROW_INACTIVE_CLASSES = 'hover:bg-accent/5';

/**
 * Shared per-cell base — `min-w-0` lets each grid track shrink below its content
 * width so single-line text cells can truncate (a grid item's default
 * `min-width: auto` would otherwise force the track wider and break the
 * zero-overflow guarantee).
 */
const CELL_BASE = 'min-w-0';

/** Props for {@link BookListRow}. */
export interface BookListRowProps {
  /** The book this row renders (one of the 15-title mock catalog). */
  book: Book;
}

/**
 * BookListRow — one row of the App 01 library-list table.
 *
 * Renders the seven cells (Title · Author · Date Added · Rating · Tags · Format
 * · Size) for `book`, composed from the design-system primitives and the
 * `@/lib/format` helpers, inside a 7-column CSS grid that shares
 * {@link LIST_GRID_TEMPLATE} with `ColumnHeader`. A plain click (or Enter /
 * Space when focused) selects the book as the single current/detail book via
 * `selectOnly`; the current/selected row is highlighted with a translucent
 * accent wash and a purple left indicator.
 *
 * @param props - {@link BookListRowProps}
 * @returns The rendered table row.
 */
export function BookListRow({ book }: BookListRowProps): JSX.Element {
  const { currentBookId, isSelected, selectOnly } = useLibrary();

  // `active`  -> this row is the current (detail-panel) book.
  // `selected` -> this row is part of the selection.
  // In the List view `selectOnly` keeps them in lockstep, so `highlighted`
  // equals either; combining them keeps the highlight correct even if a
  // selection were ever to exist without a matching current book.
  const active = currentBookId === book.id;
  const selected = isSelected(book.id);
  const highlighted = active || selected;

  const rowClassName = [
    ROW_BASE_CLASSES,
    highlighted ? ROW_ACTIVE_CLASSES : ROW_INACTIVE_CLASSES,
  ].join(' ');

  // Tags cell: render up to MAX_VISIBLE_TAGS chips, then collapse the rest into
  // a single muted "+N" indicator so the cell never overflows its track.
  const visibleTags = book.tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = book.tags.length - visibleTags.length;

  /**
   * Keyboard activation for the focusable `role="row"`: Enter or Space selects
   * this book as the current/detail book, mirroring a click. `preventDefault`
   * stops Space from scrolling the page (and is a harmless no-op for Enter).
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectOnly(book.id);
    }
  };

  return (
    <div
      role="row"
      tabIndex={0}
      aria-selected={active}
      className={rowClassName}
      style={{ gridTemplateColumns: LIST_GRID_TEMPLATE }}
      onClick={() => selectOnly(book.id)}
      onKeyDown={handleKeyDown}
    >
      {/* Active/selected left accent indicator — absolutely positioned so it adds
          ZERO layout width and never shifts the cells out of alignment with the
          header. Color is rgba(123,97,255,0.6) via the `--border-accent` token
          (the same accent stroke used for selected grid cards). Decorative, so
          `aria-hidden`; `pointer-events-none` keeps it click-through. */}
      {highlighted ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 start-0 w-u2 bg-[var(--border-accent)]"
        />
      ) : null}

      {/* 1) Title — generated cover thumb (node 2:347) + the title, with an
          optional muted series subtitle. The cover keeps its exact 20×26 px size
          (`shrink-0`); the text wrapper takes the remaining width (`flex-1
          min-w-0`) so the title truncates at the cell edge. */}
      <div role="gridcell" className={`${CELL_BASE} flex items-center gap-u10`}>
        <BookCoverPlaceholder book={book} size="sm" className="shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-text-primary">{book.title}</div>
          {book.series ? (
            <div className="truncate text-meta-label text-text-muted">
              {book.series}
            </div>
          ) : null}
        </div>
      </div>

      {/* 2) Author. */}
      <div role="gridcell" className={`${CELL_BASE} truncate text-text-secondary`}>
        {book.author}
      </div>

      {/* 3) Date Added — center-aligned (Calibre center-aligns the timestamp
          column; parity with `models.py` `alignment_map`). */}
      <div
        role="gridcell"
        className={`${CELL_BASE} truncate text-center text-text-muted`}
      >
        {formatDate(book.date)}
      </div>

      {/* 4) Rating — amber display stars (node 2:348). `overflow-hidden` is a
          safety net so the fixed-width glyphs clip rather than widen the track
          at the very narrowest viewport; at 1280–1440 px they fit with room. */}
      <div
        role="gridcell"
        className={`${CELL_BASE} flex items-center overflow-hidden`}
      >
        <StarRating value={book.rating} />
      </div>

      {/* 5) Tags — up to MAX_VISIBLE_TAGS chips + a muted "+N" overflow count. */}
      <div
        role="gridcell"
        className={`${CELL_BASE} flex items-center gap-u4 overflow-hidden`}
      >
        {visibleTags.map((tag) => (
          <TagPill key={tag} label={tag} className="shrink-0" />
        ))}
        {hiddenTagCount > 0 ? (
          <span className="shrink-0 text-meta-label text-text-muted">
            +{hiddenTagCount}
          </span>
        ) : null}
      </div>

      {/* 6) Format — colored chip. `Book.format` is a plain `string`; it is
          narrowed to `FormatKind` at this single boundary (the mock dataset only
          ever contains EPUB / MOBI / PDF). */}
      <div
        role="gridcell"
        className={`${CELL_BASE} flex items-center overflow-hidden`}
      >
        <FormatBadge format={book.format as FormatKind} />
      </div>

      {/* 7) Size — center-aligned, muted. */}
      <div
        role="gridcell"
        className={`${CELL_BASE} truncate text-center text-text-muted`}
      >
        {formatFileSize(book.sizeBytes)}
      </div>
    </div>
  );
}

export default BookListRow;
