/**
 * `@/data/sidebar` — the Library left-sidebar facets, DERIVED from the catalog.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ──────────────────────────────────────────────────────────────────────────
 * Supplies the static content rendered by the Library sidebar (`shell/Sidebar`,
 * Figma node `2:36`) on both Library screens — the App01 list view (`2:2`) and
 * the App02 cover grid (`3:2`). It exposes three facet collections that also
 * seed the `LibraryProvider` filters:
 *
 *   • {@link sidebarSections} — the navigation rows (All Books, Reading Now,
 *     Recently Added, Favorites, and the three format buckets) each with a LIVE
 *     count and an emoji-glyph icon. The active row renders with a translucent
 *     purple fill in the component.
 *   • {@link tagFacets} — the tag browser: every distinct tag carried by the
 *     catalog with the number of books that use it, ordered most-used first.
 *   • {@link authorFacets} — the author filter: every distinct author with their
 *     book count, ordered alphabetically by name.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * COUNTS ARE DERIVED — A SINGLE SOURCE OF TRUTH (the key invariant)
 * ──────────────────────────────────────────────────────────────────────────
 * Every count here is COMPUTED by reducing over `@/data/books` rather than being
 * hardcoded, so the sidebar always agrees with what the user can actually see:
 * "All Books 15" matches the 15 grid cards and the App01 status bar, the EPUB/
 * MOBI/PDF tallies match the rows, and each tag/author count matches its books.
 * If the catalog ever changes, these facets follow automatically — the numbers
 * are genuinely "live", never a copy that can silently drift.
 *
 * The lone exception is "Reading Now": the {@link Book} contract carries no
 * "currently reading" flag, so that single count is a curated demo constant
 * (clearly marked below); every other count is derived from the catalog.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * UI-ONLY / MOCK DATA — DETERMINISTIC & SSR-SAFE
 * ──────────────────────────────────────────────────────────────────────────
 * Pure, synchronous derivation from in-memory data. There is NO backend, NO
 * database, NO API, and NO `fetch`. There is NO `Math.random`, NO `Date.now`,
 * and NO `new Date()`, and every sort uses an explicit, stable comparator — so
 * module evaluation yields byte-identical arrays on the server and the client,
 * preventing React hydration-mismatch console errors (the "zero console errors"
 * gate). All inputs sorted via `localeCompare` are ASCII, so the ordering is
 * locale-independent. The module carries no `'use client'` directive and exposes
 * only named exports (no default export); consumers import from `@/data/sidebar`.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ICONS ARE GLYPHS, NEVER ASSET FILES (AAP §0.3.4)
 * ──────────────────────────────────────────────────────────────────────────
 * Each section `icon` is a single emoji/unicode glyph rendered by the font, not
 * a bundled image. The format glyphs are chosen to echo the badge colors used
 * downstream (📗 green → EPUB, 📙 orange → MOBI, 📕 red → PDF); the actual badge
 * colors come from the `primitives/FormatBadge` tokens, not from here.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * ──────────────────────────────────────────────────────────────────────────
 * The shape of this data conceptually parallels Calibre's desktop client — the
 * library section/column model (`src/calibre/gui2/library/models.py`) and the
 * tag-browser facet tree whose nodes carry counts
 * (`src/calibre/gui2/tag_browser/model.py`, `COUNT_ROLE`) — but NO Python/Qt
 * code is imported, translated, or executed. Those modules are a read-only
 * conceptual reference for what the sidebar shows.
 *
 * @see ./books.ts — the catalog of record (the 15 {@link Book} objects).
 * @see ./../types/index.ts — the {@link SidebarSection}/{@link TagFacet}/{@link AuthorFacet} contracts (`@/types`).
 * @see src/calibre/gui2/library/models.py — Calibre `BooksModel` columns (reference only).
 * @see src/calibre/gui2/tag_browser/model.py — Calibre tag-browser counts (reference only).
 */

import type { SidebarSection, TagFacet, AuthorFacet } from '@/types';
import { books } from './books';

/**
 * Count the books in the catalog whose `format` equals `fmt`.
 *
 * `Book.format` is a plain `string` per the verbatim `Book` contract, so this
 * compares against the uppercase format strings the catalog uses
 * (`"EPUB"` / `"MOBI"` / `"PDF"`). Pure and deterministic.
 */
const byFormat = (fmt: string): number =>
  books.filter((book) => book.format === fmt).length;

/**
 * Navigation sections shown at the top of the Library sidebar, each with a live
 * count derived from the catalog (except the curated "Reading Now" demo count).
 *
 * Order is fixed and meaningful: the "All Books" total first, the curated and
 * recency views next, then the three format buckets. `icon` values are emoji
 * glyphs (never asset files — AAP §0.3.4); `id` values are stable keys used for
 * the active-section highlight and as React list keys.
 */
export const sidebarSections: SidebarSection[] = [
  /** Whole catalog — matches the 15 grid cards and the App01 status bar. */
  { id: 'all', icon: '📚', label: 'All Books', count: books.length },
  /**
   * Curated demo subset: the `Book` contract has no "currently reading" flag, so
   * this is a fixed demonstration count (NOT derived). Every other count below
   * is computed from the catalog.
   */
  { id: 'reading-now', icon: '📖', label: 'Reading Now', count: 3 },
  /**
   * Count of the recently-added view, capped at six. The actual six-book LIST
   * (App02 `RecentlyAddedList`) is derived where it is rendered; the sidebar
   * only needs the badge count here.
   */
  { id: 'recently-added', icon: '✨', label: 'Recently Added', count: Math.min(6, books.length) },
  /** Top-rated books — derived as those rated a full five stars. */
  { id: 'favorites', icon: '⭐', label: 'Favorites', count: books.filter((book) => book.rating >= 5).length },
  /** EPUB bucket — derived count of EPUB-format books. */
  { id: 'epub', icon: '📗', label: 'EPUB', count: byFormat('EPUB') },
  /** MOBI bucket — derived count of MOBI-format books. */
  { id: 'mobi', icon: '📙', label: 'MOBI', count: byFormat('MOBI') },
  /** PDF bucket — derived count of PDF-format books. */
  { id: 'pdf', icon: '📕', label: 'PDF', count: byFormat('PDF') },
];

/**
 * Tag-browser facets: every distinct tag in the catalog paired with the number
 * of books that carry it.
 *
 * Derived by tallying every `Book.tags` entry, then sorted by count DESCENDING
 * (most-used tags surface first) with ties broken by label ASCENDING. The
 * comparator is total and stable so server and client produce identical order.
 * `label` doubles as the React list key (per the `TagFacet` contract), so no
 * separate `id` is needed.
 */
export const tagFacets: TagFacet[] = Object.entries(
  books.reduce<Record<string, number>>((counts, book) => {
    for (const tag of book.tags) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
    return counts;
  }, {}),
)
  .map(([label, count]) => ({ label, count }))
  .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

/**
 * Author-filter facets: every distinct author paired with their book count.
 *
 * Derived by tallying `Book.author`, then sorted by name ASCENDING. In the
 * current catalog every author is unique, so each count is `1`; the reduction
 * still tallies properly should an author ever repeat. `name` doubles as the
 * React list key (per the `AuthorFacet` contract), so no separate `id` is needed.
 */
export const authorFacets: AuthorFacet[] = Object.entries(
  books.reduce<Record<string, number>>((counts, book) => {
    counts[book.author] = (counts[book.author] ?? 0) + 1;
    return counts;
  }, {}),
)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => a.name.localeCompare(b.name));
