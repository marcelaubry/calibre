'use client';

/**
 * ==========================================================================
 * Calibre-UI — RecentlyAddedList
 * The App 02 Cover-Grid right-column "Recently Added" list (Figma `3:2`,
 * the region BENEATH the batch-actions panel `3:205`).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `RecentlyAddedList` is the compact, scannable "Recently Added" list that sits
 * in the ~236px right-hand column of the App 02 Cover Grid screen (Figma screen
 * `3:2`), directly BELOW the batch-actions panel (`3:205`). In the UI-only
 * Calibre e-book-manager prototype (Next.js 15 App Router · React 19 ·
 * TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens) the right panel swaps
 * to the batch-actions variant once two or more grid cards are selected
 * (`isBatchMode`), and this list renders beneath it as a quick way to jump back
 * to a single, recently-added title (AAP §0.3.1 Workflow 1, §0.7.4 App 02).
 *
 * STATE — READS THE LIBRARY CONTEXT, OWNS NOTHING
 * --------------------------------------------------------------------------
 * Everything comes from {@link useLibrary} (`@/state/LibraryProvider`):
 *   • `recentlyAddedBooks` — the DERIVED selector: the 6 most-recently-added
 *     books, already sorted by `date` DESCENDING by the provider. This component
 *     renders that array VERBATIM — it never recomputes, re-sorts, or slices it
 *     (the single source of truth for "recent" ordering is the provider, mirroring
 *     Calibre's `sort_by_named_field('timestamp', …)` — reference only).
 *   • `selectOnly(id)` — single-selects exactly one book AND sets it as the
 *     current/detail book. Clicking a row calls it, which collapses the multi-
 *     selection to one (so `isBatchMode` becomes false and the right panel
 *     returns to the single-book detail view focused on the chosen title).
 * This component holds NO local state — it is a pure projection of library state
 * plus a thin click/keyboard handler that delegates straight to `selectOnly`.
 *
 * UI-ONLY · IN-MEMORY · SSR-SAFE (design-parity reference only)
 * --------------------------------------------------------------------------
 * There is NO backend, NO persistence, and NO real "recently added" query — the
 * list is a deterministic projection of the static catalog. Rendering uses no
 * `Math.random`, `Date.now`, or `new Date()` (dates are formatted by the pinned
 * `@/lib/format` formatter), so server and client output are byte-identical and
 * the zero-console-errors gate holds. The "recently added" / sorted-library
 * behavior conceptually parallels Calibre's `alternate_views.py` (grid view) and
 * `models.py` (the `timestamp` → "Date" column and its sort) — NO Python/Qt code
 * is imported, translated, or executed; the Calibre tree is a read-only reference.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Specified from AAP §0.3 (the authoritative design analysis: §0.3.1 Workflow 1
 * "a 'Recently Added' list beneath" the batch panel, §0.3.2 token manifest,
 * §0.3.4 asset inventory = 0 assets). Each entry is a COMPACT row: a small
 * generated cover thumbnail (the `BookCoverPlaceholder` `sm` 20×26 tile — never
 * real cover art, AAP §0.3.4/§0.9) beside a two-line text block (the title over
 * an author · date-added meta line), with hairline dividers between rows. The
 * region is a transparent sub-section within the right column (the surrounding
 * panel owns the surface fill); a quiet section heading marks its start.
 *
 * ZERO-HARDCODED-VALUES RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / BORDER / RADIUS / TYPOGRAPHY value below resolves to an `@theme`
 * token declared in `src/app/globals.css`, consumed through a Tailwind v4 role
 * utility (`text-body`, `text-card-title`, `text-meta-label`, `text-text-primary`,
 * `text-text-secondary`, `text-text-muted`, `bg-accent`) or a CSS-variable
 * arbitrary value (`border-[var(--border-white-07)]`, `ring-[var(--border-accent)]`).
 * There are NO raw hex / rgba / px color or radius literals; the only bare values
 * are layout/spacing utilities (flex, gap, padding, truncation) which carry no
 * design-token color information. The cover thumbnail's per-book tint lives
 * INSIDE `@/lib/covers` (intentionally outside the global token set) and is
 * applied solely by the `BookCoverPlaceholder` primitive — never here.
 *
 * COMPOSE-FROM-PRIMITIVES & ACCESSIBILITY
 * --------------------------------------------------------------------------
 * The cover is the `BookCoverPlaceholder` design-system primitive; structural
 * HTML (`<section>` / `<h3>` / `<ul role="list">` / `<li>` / a clickable
 * `role="button"` region) carries the layout. Each row is keyboard-operable
 * (`role="button"`, `tabIndex={0}`, an Enter/Space activator, and an
 * `aria-label` naming the target book), shows a faint accent hover wash and a
 * token-backed `:focus-visible` ring (both invisible at rest), and animates only
 * under `motion-safe`. Long titles/authors truncate (`min-w-0` + `truncate`) so
 * the list never forces horizontal overflow as the layout degrades 1440 → 1280.
 *
 * @see @/state/LibraryProvider — the library Context (`recentlyAddedBooks`, `selectOnly`).
 * @see @/components/primitives/BookCoverPlaceholder — the generated-cover primitive.
 * @see @/lib/format — the deterministic `formatDate` formatter.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see src/calibre/gui2/library/alternate_views.py — Calibre grid view (reference only).
 * @see src/calibre/gui2/library/models.py — Calibre `BooksModel` date/sort (reference only).
 */

import { useId, type JSX, type KeyboardEvent } from 'react';

import { useLibrary } from '@/state/LibraryProvider';
import { BookCoverPlaceholder } from '@/components/primitives/BookCoverPlaceholder';
import { formatDate } from '@/lib/format';

/**
 * Props for {@link RecentlyAddedList}.
 *
 * The component needs none of its own — it reads everything from the library
 * Context — but accepts an optional `className` passthrough so the consuming
 * grid right column can supply layout overrides (e.g. its own padding) without
 * the list having to assume the surrounding geometry.
 */
export interface RecentlyAddedListProps {
  /** Optional extra classes, merged AFTER the section's own (caller wins). */
  className?: string;
}

/**
 * The metadata separator — U+00B7 MIDDLE DOT ("·"), used to join a book's author
 * and date-added on the row's secondary line. A unicode glyph (NOT an asset, NOT
 * the letter "x"); purely decorative punctuation between two text fragments.
 */
const META_SEPARATOR = '\u00B7';

/**
 * Join class fragments, dropping any falsy entry. Mirrors the in-repo convention
 * (see `ReaderToolsPanel`, `GlassCard`) for composing a base class string with
 * an optional caller `className`.
 *
 * @param parts - class fragments (or falsy values to skip).
 * @returns the space-joined, non-empty class string.
 */
function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * Build an Enter/Space keyboard activator for a `role="button"` region, so the
 * clickable rows are operable by keyboard exactly like a native button. Space is
 * `preventDefault`-ed to suppress the default page scroll.
 *
 * @param handler - the action to run on Enter/Space.
 * @returns a React `onKeyDown` handler for a `<div>` row.
 */
function activateOnKey(handler: () => void): (event: KeyboardEvent<HTMLDivElement>) => void {
  return (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handler();
    }
  };
}

/* --------------------------------------------------------------------------
 * Token-backed class strings (module scope so they are allocated once). Every
 * color / border / radius / typography value resolves to an `@theme` token; only
 * layout/spacing utilities are bare. No fixed pixel width is used — the section
 * fills its column (`w-full`) and may shrink (`min-w-0`), so the App 02 right
 * column holds 1440 → 1280 with zero horizontal overflow.
 * ------------------------------------------------------------------------ */

/**
 * The section shell: a full-width, shrinkable vertical stack with a gap between
 * the heading and the list and token vertical padding. It is intentionally
 * TRANSPARENT (the surrounding right-column panel owns the surface fill) and
 * carries NO horizontal padding (the column owns that) so it nests flush.
 */
const SECTION = 'flex w-full min-w-0 flex-col gap-3 py-4';

/**
 * The section heading ("Recently Added"): the body type role (12px) in the
 * SECONDARY text token, so it reads as a quiet section label sitting back from
 * the brighter per-row titles. `px-2` aligns it with the row content inset.
 */
const HEADING = 'px-2 text-body text-text-secondary';

/** The list: a tight vertical stack; rows are separated by hairline dividers. */
const LIST = 'flex flex-col';

/**
 * A list item: a hairline BOTTOM divider (white-7% token) between rows, omitted
 * on the LAST row via `last:border-b-0`. The border lives on the `<li>` (the
 * SIBLINGS) — not the inner button — so `last:` (`:last-child`) correctly drops
 * only the final divider. `min-w-0` lets the inner content truncate.
 */
const LIST_ITEM = 'min-w-0 border-b border-[var(--border-white-07)] last:border-b-0';

/**
 * The clickable row region — a keyboard-operable `role="button"` filling its
 * `<li>`. Horizontal layout (cover + text), token padding/gap, a faint accent
 * hover wash and an INSET token focus-visible ring (so the ring never bleeds
 * onto the dividers or siblings). Hover/focus visuals are invisible at rest;
 * color transitions run only under `motion-safe`.
 */
const ROW =
  'flex w-full min-w-0 cursor-pointer items-center gap-2 px-2 py-2 text-left ' +
  'hover:bg-accent/5 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset ' +
  'focus-visible:ring-[var(--border-accent)] ' +
  'motion-safe:transition-colors';

/** The cover thumbnail never shrinks (keeps a stable leading column). */
const COVER = 'shrink-0';

/** The text column: fills the remaining width and lets its lines truncate. */
const TEXT_COL = 'flex min-w-0 flex-1 flex-col';

/** Row title: card-title type (11px/600) in the primary token, single-line truncate. */
const ROW_TITLE = 'block truncate text-card-title text-text-primary';

/** Row meta (author · date): meta-label type (10px) in the muted token, truncate. */
const ROW_META = 'block truncate text-meta-label text-text-muted';

/**
 * RecentlyAddedList — the App 02 Cover-Grid right-column "Recently Added" list.
 *
 * Renders the library Context's `recentlyAddedBooks` (the provider's 6
 * most-recently-added titles, already date-DESC sorted) as a compact, divided
 * list of clickable rows. Each row shows the generated `sm` cover thumbnail
 * beside the title and an "author · date-added" meta line; clicking (or pressing
 * Enter/Space on) a row calls `selectOnly(book.id)` to focus that single book
 * (collapsing any multi-selection and returning the right panel to the detail
 * view). The list is rendered verbatim from the provider — never recomputed or
 * re-sorted here — and every visual value resolves to an `@theme` token.
 *
 * When the catalog yields no recent books (a defensive edge case — the 15-book
 * mock catalog always supplies six) the component renders nothing rather than an
 * empty, orphaned section.
 *
 * @param props - {@link RecentlyAddedListProps}
 * @returns The rendered list section, or `null` when there are no recent books.
 */
export function RecentlyAddedList({ className }: RecentlyAddedListProps = {}): JSX.Element | null {
  const { recentlyAddedBooks, selectOnly } = useLibrary();
  // Stable, collision-free id linking the section to its heading for a11y.
  const headingId = useId();

  // Defensive empty-state guard: render nothing (no orphan heading) when the
  // provider supplies no recent books. The provider always returns up to six for
  // the populated mock catalog, so this is an edge case, not the normal path.
  if (recentlyAddedBooks.length === 0) {
    return null;
  }

  return (
    <section className={cx(SECTION, className)} aria-labelledby={headingId}>
      <h3 id={headingId} className={HEADING}>
        Recently Added
      </h3>

      <ul className={LIST} role="list">
        {recentlyAddedBooks.map((book) => {
          // Compose the secondary line from the author and the formatted
          // date-added, dropping any empty fragment so a missing value never
          // renders an orphan separator or the literal "undefined" (UI8).
          const metaLine = [book.author, formatDate(book.date)]
            .filter((part) => part.length > 0)
            .join(` ${META_SEPARATOR} `);

          // Single-select + focus the clicked book; shared by click and keyboard.
          const focusBook = () => selectOnly(book.id);

          return (
            <li key={book.id} className={LIST_ITEM}>
              <div
                className={ROW}
                role="button"
                tabIndex={0}
                aria-label={`Select ${book.title}`}
                onClick={focusBook}
                onKeyDown={activateOnKey(focusBook)}
              >
                <BookCoverPlaceholder book={book} size="sm" className={COVER} />

                <div className={TEXT_COL}>
                  <span className={ROW_TITLE}>{book.title}</span>
                  {metaLine.length > 0 ? <span className={ROW_META}>{metaLine}</span> : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default RecentlyAddedList;
