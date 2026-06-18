'use client';

/**
 * ==========================================================================
 * Calibre-UI Library — StatusBar
 * The bottom status / pagination band of App 01 (Library List view).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `StatusBar` is the thin horizontal band pinned to the BOTTOM of the central
 * book-list area on App 01 — Library List (Figma file `JduUzjVHNhZivm5A0pAiCD`,
 * screen `2:2`). It is part of the UI-only Calibre e-book-manager prototype
 * (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind CSS v4
 * CSS-first tokens). It shows the live book count on the LEFT and a mock
 * pagination control cluster on the RIGHT (a "Page 1 of 1" indicator flanked
 * by previous / next chevrons).
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * This component reads central library state through the {@link useLibrary}
 * Context hook (`useContext` under the hood). App Router components default to
 * Server Components, and calling `useContext` in a Server Component throws —
 * so the `'use client'` directive is the very first line of the file, before
 * any import. (The original folder spec listed `StatusBar` without the
 * directive; consuming the Context makes it mandatory.)
 *
 * DATA SOURCE — LIVE, FILTER-AWARE COUNT (no `bookCount` field on the Context)
 * --------------------------------------------------------------------------
 * The Context exposes the raw catalog (`books`) and the section/tag/author-
 * filtered, sorted view (`filteredBooks`) — there is deliberately NO
 * `bookCount` field on `useLibrary()` (a static `bookCount` const exists in
 * `@/data/books`, but it cannot reflect filtering). The bar therefore derives
 * its numbers LIVE from the Context:
 *   • total = `books.length`         (the full catalog — exactly 15)
 *   • shown = `filteredBooks.length` (after the active sidebar filters)
 * When no filter is active the two are equal and the bar reads e.g. "15 books";
 * once a sidebar filter narrows the list it reads e.g. "10 of 15 books", and it
 * re-renders automatically whenever the filtered count changes. This mirrors,
 * for design parity ONLY, Calibre's desktop `count_changed_signal` / `counts()`
 * (`src/calibre/gui2/library/models.py` — `Counts(library_total, total, …)`,
 * where `total` is the post-search-restriction count). NO Python/Qt code is
 * imported, translated, or executed — the Calibre tree is a read-only reference.
 *
 * PAGINATION IS MOCK / VISUAL ONLY (UI-only mandate)
 * --------------------------------------------------------------------------
 * There is no real paging over the 15 in-memory books and no data fetching —
 * the prototype is presentational. The indicator is a fixed "Page 1 of 1" and
 * the previous / next chevrons are rendered through the `Button` primitive in
 * the permanently-`disabled` state (there is exactly one page, so neither
 * direction is navigable). Disabling — rather than wiring no-op handlers —
 * makes the single-page reality honest and self-evident, and means no click
 * handler can ever fire.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / typography value resolves to an `@theme` token from
 * `src/app/globals.css`, consumed via a Tailwind v4 utility (`bg-surface-1`,
 * `text-text-muted`, `text-body`) or a CSS-variable arbitrary value
 * (`border-[var(--border-white-07)]`). The remaining classes are Tailwind's
 * standard layout / spacing-scale utilities (`flex`, `justify-between`,
 * `px-4`, `py-2`, `gap-3`) — there are NO raw hex / rgba color literals and no
 * fixed-px height (the modest bar height comes from token-scale padding, which
 * keeps the layout overflow-safe). The chevrons are unicode glyphs (`‹` / `›`),
 * never image / SVG assets (AAP §0.3.4 — Asset Inventory = 0).
 *
 * RESPONSIVE INTEGRITY (1440 → 1280, zero horizontal overflow)
 * --------------------------------------------------------------------------
 * The bar is a full-width flex row: the count cell is `min-w-0 truncate` so a
 * long label ellipsizes instead of pushing the row wider, while the pagination
 * cluster is `shrink-0` so its controls keep their size. Together they
 * guarantee no horizontal scroll from the 1440px baseline down to 1280px.
 *
 * ACCESSIBILITY (invisible — no visual impact)
 * --------------------------------------------------------------------------
 * The count lives in a `role="status"` live region so assistive tech announces
 * filter-driven count changes politely; the pagination cluster is a labeled
 * `<nav aria-label="Library pagination">` landmark; and each chevron `Button`
 * carries an `aria-label` ("Previous page" / "Next page") so its accessible
 * name is descriptive even though its visible content is a glyph.
 *
 * @see @/state/LibraryProvider — the `useLibrary` hook and `LibraryContextValue`.
 * @see @/components/primitives/Button — the action primitive used for chevrons.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see src/calibre/gui2/library/models.py — Calibre `counts()` (reference only).
 */

import type { JSX } from 'react';
import { useLibrary } from '@/state/LibraryProvider';
import { Button } from '@/components/primitives/Button';

/**
 * Props for {@link StatusBar}.
 *
 * The component is fully self-sufficient — it sources its counts from the
 * library Context — so the only prop is an optional `className` that a parent
 * layout (e.g. the book-list container) can pass to position the bar (the value
 * is appended after the bar's own classes so caller utilities win on conflict).
 */
export interface StatusBarProps {
  /** Optional extra classes merged onto the bar's root element. */
  className?: string;
}

/**
 * Mock pagination geometry. The prototype holds all 15 books in memory on a
 * single page, so these are fixed constants (UI-only — no real paging exists).
 */
const CURRENT_PAGE = 1;
const TOTAL_PAGES = 1;

/**
 * StatusBar — the bottom book-count + mock-pagination band of App 01.
 *
 * Renders a full-width flex row: a live, filter-aware count on the left (in a
 * `role="status"` live region) and a labeled pagination `<nav>` on the right
 * (a "Page {n} of {m}" indicator between two permanently-disabled chevron
 * buttons). Holds no state and binds no handlers — it is a pure projection of
 * `useLibrary()` Context plus the mock page constants.
 *
 * @param props - {@link StatusBarProps}
 * @returns The rendered status bar element.
 */
export function StatusBar({ className }: StatusBarProps): JSX.Element {
  const { books, filteredBooks } = useLibrary();

  // Derive the live counts from Context (there is no `bookCount` on the hook).
  const total = books.length;
  const shown = filteredBooks.length;

  // Grammatical noun for the full catalog size ("1 book" vs "0/2+ books").
  const noun = total === 1 ? 'book' : 'books';

  // "15 books" when unfiltered (shown === total); "10 of 15 books" when an
  // active sidebar filter has narrowed the visible set.
  const countLabel =
    shown === total ? `${total} ${noun}` : `${shown} of ${total} ${noun}`;

  // Compose the root classes; the caller `className` is appended last so its
  // utilities win on conflict (`filter(Boolean)` drops a missing className).
  const rootClassName = [
    'flex w-full min-w-0 items-center justify-between gap-3',
    'px-4 py-2 bg-surface-1 border-t border-[var(--border-white-07)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName}>
      {/* LEFT — live, filter-aware book count (announced politely on change). */}
      <span
        role="status"
        aria-live="polite"
        className="min-w-0 truncate text-body text-text-muted"
      >
        {countLabel}
      </span>

      {/* RIGHT — mock pagination cluster (single page → chevrons disabled). */}
      <nav
        aria-label="Library pagination"
        className="flex shrink-0 items-center gap-2"
      >
        <Button
          label="‹"
          variant="secondary"
          aria-label="Previous page"
          disabled
        />
        <span className="whitespace-nowrap text-body text-text-muted">
          {`Page ${CURRENT_PAGE} of ${TOTAL_PAGES}`}
        </span>
        <Button
          label="›"
          variant="secondary"
          aria-label="Next page"
          disabled
        />
      </nav>
    </div>
  );
}

export default StatusBar;
