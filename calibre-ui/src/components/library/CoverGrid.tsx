'use client';

/**
 * ==========================================================================
 * Calibre-UI — CoverGrid
 * The responsive 5×3 cover grid of the App 02 Cover Grid view (Figma `3:2`).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `CoverGrid` is the scrollable center region of App 02 — Cover Grid
 * (`/grid`, Figma screen `3:2`, cards `3:81`…`3:197` laid out 5×3 for the 15
 * books) in the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first `@theme`
 * tokens). It renders a responsive CSS grid that maps one {@link BookCard}
 * over every book in `LibraryProvider.filteredBooks`, sitting between the
 * sidebar (left) and the detail/batch panel (right) of the App 02 shell.
 *
 * It is a Client Component (`'use client'`) because it reads the shared
 * library state through the {@link useLibrary} hook (a React Context consumer
 * must run on the client). It renders NO raw controls of its own — every cell
 * is a `BookCard`, which owns its cover, info strip, and selection behavior.
 *
 * SAME DATASET AS THE LIST → STATE/SELECTION PRESERVATION
 * --------------------------------------------------------------------------
 * The grid reads `filteredBooks` — the catalog AFTER the active section / tag /
 * author filters AND the active sort, all computed once inside
 * `LibraryProvider`. This component deliberately does NOT re-filter or re-sort:
 * it renders exactly the working set the App 01 List shows, so switching List
 * (`/`) ↔ Grid (`/grid`) preserves both the visible set and the multi-selection
 * (the provider wraps the entire routed tree, so `viewMode` and `selectedIds`
 * persist across the route change — AAP §0.2.2 / §0.6.2). Because each
 * `BookCard` toggles the shared selection on click, selecting two or more cards
 * here flips the provider's derived `isBatchMode` (`selectedIds.length >= 2`),
 * which the grid PAGE uses to swap its right panel from the single-book
 * `BookDetailPanel` to the `BatchActionsPanel`. That panel swap is owned by the
 * page, not this component — `CoverGrid` only renders the cards.
 *
 * RESPONSIVE GRID — ZERO HORIZONTAL OVERFLOW (AAP §0.1 / §0.7.4 / §0.9)
 * --------------------------------------------------------------------------
 * The card matrix is a fixed 5-column CSS grid (`grid-cols-5`) matching the
 * Figma 5×3 layout exactly. Responsiveness comes from the COLUMNS, not from
 * fixed-px widths: each track is `1fr` and each `BookCard` is `w-full`, so the
 * five columns simply share whatever width the center region has and shrink
 * together as the viewport narrows from the 1440 baseline to the 1280 minimum.
 * The grid wrapper is `w-full min-w-0` and the scroll container is
 * `min-w-0 overflow-x-hidden`, so the grid can never force the page wider than
 * its column (an item/grid whose `min-width` is 0 and whose overflow is clipped
 * cannot push horizontal page overflow). The center region is the only
 * vertically-scrolling area (`overflow-y-auto`); horizontal scrolling is
 * disabled outright (`overflow-x-hidden`). At the 1440 baseline the ~988px
 * center region yields ~178px-wide cards (≈ the Figma 182px card width); at
 * 1280 the cards shrink uniformly with zero horizontal overflow. (Cards are
 * gracefully ≤ the `BookCard` cover's intrinsic 182px across this range, so the
 * cover fully covers each card — see `BookCard`'s own [RESPONSIVE] note.)
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reproduces the App 02 card matrix on screen `3:2`: 15 cards (`3:81`…`3:197`),
 * each 182×256, laid out in 5 columns × 3 rows on the `--color-bg-app`
 * (#0C0E1A) canvas. The confirmed layout facts (5 columns, 3 rows, 182×256
 * cards on the app background) come from the AAP §0.3.1 / §0.3.3 reconciled
 * Figma analysis.
 *
 * BLITZY [FIGMA]: the inter-card gutter and the grid's outer padding are set
 *   from Tailwind's tokenized spacing scale (`gap-4` = 16px, `p-4` = 16px),
 *   chosen to fit the ~988px center region (5×182 + 4×16 gutters + 2×16 padding
 *   ≈ 988) and to keep each card ≤ the 182px cover width so covers fully cover.
 *   The exact Figma gutter could not be re-measured at build time because
 *   `analyze_figma_node` was returning an infrastructure error, so these two
 *   spacing values follow the AAP-confirmed 5×3 geometry + the tokenized scale
 *   rather than a freshly measured pixel value. The COLUMN COUNT (5), ROW
 *   COUNT (3), card size, and canvas color are AAP-confirmed and exact.
 *   Alternative: nudge to `gap-3.5`/`gap-5` if a later measurement differs.
 *
 * ZERO-HARDCODED-VALUES RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color value resolves to an `@theme` token via a Tailwind v4 utility
 * (`bg-bg-app`, `text-text-muted`, `text-body`). The only bare utilities are
 * Tailwind's standard layout / spacing scale (`grid`, `grid-cols-5`, `gap-4`,
 * `p-4`, `flex`, `items-center`, `justify-center`, `h-full`, `w-full`,
 * `min-w-0`, `flex-1`, `overflow-y-auto`, `overflow-x-hidden`, `text-center`)
 * and layout keywords — none of which carry design-token color/geometry
 * information. No raw hex / rgba / px literal appears here.
 *
 * COMPOSITION (design-system components only — AAP §0.4.5 / §0.3.3)
 * --------------------------------------------------------------------------
 * The grid is composed EXCLUSIVELY from {@link BookCard}; it introduces no raw
 * `<button>`, `<input>`, or other interactive control. The container chrome is
 * a plain token-styled `<section>` / `<div>` (the cards supply their own
 * `GlassCard` surface, so the container carries no card chrome of its own).
 *
 * ACCESSIBILITY (invisible — always applied; no visual impact)
 * --------------------------------------------------------------------------
 * The scroll region is a `<section>` landmark with an `aria-label`, so the grid
 * is reachable as a named region. Each `BookCard` is already an individually
 * focusable toggle button (`role="button"`, `aria-pressed`, `aria-label`, its
 * own `:focus-visible` ring and Enter/Space handlers), so the cards are mapped
 * DIRECTLY as the grid's children — no extra `role="list"`/`role="listitem"`
 * wrapper is added (a `list` whose items are `button`s would be a role
 * mismatch, and a wrapper layer would push `BookCard` out of the direct
 * grid-item position). The empty state is a readable sentence (never a bare
 * "null"/"undefined" — UI8) in the muted text token.
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * --------------------------------------------------------------------------
 * Conceptually mirrors Calibre's cover-grid (`src/calibre/gui2/library/
 * alternate_views.py` — `GridView` / `AlternateViews`: the cover-grid sizing
 * and the selection mirrored with the main view). NO Python/Qt code is
 * imported, translated, or executed — the Calibre tree is a read-only
 * conceptual reference.
 *
 * @see @/state/LibraryProvider — `useLibrary`, the `filteredBooks` selector.
 * @see ./BookCard — the single selectable cover card composed here.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.1 / §0.3.3 / §0.7.4 — App 02 grid spec & tokens.
 * @see src/calibre/gui2/library/alternate_views.py — Calibre `GridView` (reference only).
 */

import type { JSX } from 'react';

import { useLibrary } from '@/state/LibraryProvider';
import { BookCard } from './BookCard';

/**
 * Scroll-container classes for the grid's center region — all token-backed.
 *
 *   • `flex-1 min-w-0` — fill the horizontal space between the sidebar and the
 *     right panel inside the App 02 shell, and stay shrinkable (a flex child
 *     whose `min-width` is 0 never forces page overflow).
 *   • `overflow-y-auto overflow-x-hidden` — this is the ONLY vertically
 *     scrolling region of the screen; horizontal scrolling is disabled so the
 *     grid can never produce horizontal page overflow at 1440 OR 1280.
 *   • `bg-bg-app` — the `--color-bg-app` (#0C0E1A) canvas the cards sit on; the
 *     container itself carries NO card chrome (each `BookCard` is its own
 *     `GlassCard`).
 *   • `p-4` — token padding (16px) around the card matrix (see the file
 *     header's BLITZY [FIGMA] note on the spacing choice).
 */
const CONTAINER_CLASSES =
  'flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-bg-app p-4';

/**
 * Card-matrix classes — the fixed 5-column CSS grid.
 *
 *   • `grid grid-cols-5` — exactly five equal (`1fr`) columns, matching the
 *     Figma 5×3 layout. Fixed columns (not `auto-fill`) reproduce the design
 *     precisely; responsiveness comes from the `1fr` tracks + `w-full` cards.
 *   • `gap-4` — token gutter (16px) applied to BOTH row and column gaps.
 *   • `w-full min-w-0` — fill the container width and stay fully shrinkable so
 *     the tracks collapse cleanly toward 1280 with zero horizontal overflow.
 */
const GRID_CLASSES = 'grid grid-cols-5 gap-4 w-full min-w-0';

/**
 * Empty-state wrapper — centers the message both axes within the (definite-
 * height) scroll region. `h-full` resolves against the `flex-1` container's
 * height inside the App 02 column shell; if the height is indefinite in some
 * context it simply renders the message at the top with the container padding.
 */
const EMPTY_WRAPPER_CLASSES = 'flex h-full items-center justify-center';

/** Empty-state message styling — muted body text, centered (token-backed). */
const EMPTY_MESSAGE_CLASSES = 'text-text-muted text-body text-center';

/**
 * The message shown when `filteredBooks` is empty (e.g. a section/tag/author
 * filter combination matches nothing). A readable sentence — never a bare
 * "null"/"undefined" (UI8 defensive rendering).
 */
const EMPTY_MESSAGE = 'No books match the current filters.';

/**
 * Props for {@link CoverGrid}.
 *
 * Intentionally minimal — the grid reads its data from the shared
 * {@link useLibrary} Context. `className` lets the composing grid PAGE append
 * layout utilities onto the scroll container; it is merged AFTER the base
 * classes (additive — note that Tailwind v4 source order, not class-attribute
 * order, decides which utility wins when both set the same property).
 */
export interface CoverGridProps {
  /** Optional extra classes appended onto the scroll container (caller adds). */
  className?: string;
}

/**
 * CoverGrid — the App 02 Cover Grid card matrix.
 *
 * Renders the scrollable center region of `/grid`: a fixed 5-column grid of
 * {@link BookCard}s, one per book in `LibraryProvider.filteredBooks` (the same
 * filtered + sorted working set the List view shows). When the working set is
 * empty it renders a centered muted message instead. The grid neither
 * re-filters nor re-sorts (the provider already did) and renders no raw
 * controls — selection and batch-mode are driven by the cards + provider.
 *
 * @param props - {@link CoverGridProps}
 * @returns The rendered cover-grid center region.
 */
export function CoverGrid({ className }: CoverGridProps = {}): JSX.Element {
  const { filteredBooks } = useLibrary();

  // Merge the caller's optional classes after the base (additive — see props).
  const containerClassName = [CONTAINER_CLASSES, className]
    .filter(Boolean)
    .join(' ');

  // Defensive: `filteredBooks` is always an array (the provider guarantees it),
  // so this comparison is safe and never renders a falsy value as text (UI8).
  const isEmpty = filteredBooks.length === 0;

  return (
    <section className={containerClassName} aria-label="Book cover grid">
      {isEmpty ? (
        <div className={EMPTY_WRAPPER_CLASSES}>
          <p className={EMPTY_MESSAGE_CLASSES}>{EMPTY_MESSAGE}</p>
        </div>
      ) : (
        // Fixed 5-column card matrix. Each BookCard is a DIRECT grid child (it
        // already exposes itself as an accessible toggle button), so it lands
        // straight into a grid cell and fills the `1fr` track via its own
        // `w-full`. The `book.id` key is stable and unique per the Book contract.
        <div className={GRID_CLASSES}>
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
}

export default CoverGrid;
