'use client';

/**
 * ==========================================================================
 * Calibre-UI State — LibraryProvider
 * Central library-state Context (App 01 Library List · App 02 Cover Grid).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `LibraryProvider` is the central state hub for the two library screens of the
 * UI-only Calibre e-book-manager prototype (Next.js 15 App Router · React 19 ·
 * TypeScript 5 strict):
 *   • App 01 — Library List  (`/`,     Figma node `2:2`)
 *   • App 02 — Cover Grid     (`/grid`, Figma node `3:2`)
 * It owns the book catalog, the view mode (`list` / `grid`), the multi-selection,
 * the sidebar filters (section / tag / author), the current (detail) book, and
 * the sort state — and it derives the filtered/sorted list, the selected books,
 * the current book, the recently-added list, and the batch-mode flag from them.
 * It is seeded from `@/data/books` and typed from `@/types`.
 *
 * STATE PRESERVATION ACROSS `/` ↔ `/grid` (a defining correctness property)
 * --------------------------------------------------------------------------
 * Composition in `app/layout.tsx` is
 *   LibraryProvider → PreferencesProvider → ReaderProvider → ModalProvider →
 *   AppShell (AAP §0.6.2).
 * Because `LibraryProvider` wraps the ENTIRE routed tree (it sits above the
 * router outlet), `viewMode` and `selectedIds` AUTOMATICALLY PERSIST across the
 * List (`/`) ↔ Grid (`/grid`) navigation — this is the structural mechanism
 * behind the AAP's state-preservation gate. There is deliberately NO reset
 * logic on navigation and NO mount-time `useEffect` that clears them; route
 * changes leave both untouched. (Parity concept only: Calibre's
 * `PreserveViewState` / `current_id` in `views.py`.)
 *
 * 2-OR-MORE SELECTION → BATCH ACTIONS PANEL (the second correctness gate)
 * --------------------------------------------------------------------------
 * The derived flag `isBatchMode = selectedIds.length >= 2` drives App 02's right
 * panel: when `true`, the grid renders `BatchActionsPanel` (Figma `3:205`) in
 * place of the single-book `BookDetailPanel` (AAP §0.2.2, §0.6.2; Figma cards
 * `3:81` + `3:99` selected → batch panel). The two-selected batch state is
 * reached by user interaction (`toggleSelect`), NOT by the initial state (which
 * has exactly one book selected so App 01's detail panel is populated on load).
 *
 * UI-ONLY · IN-MEMORY · DETERMINISTIC / SSR-SAFE
 * --------------------------------------------------------------------------
 * State is in-memory React state only — there is NO backend, NO API, NO
 * database, and NO persistence (a reload resets to defaults). All initial state
 * is a deterministic constant derived from the static `books` array: render and
 * initialization use NO `Math.random`, `Date.now`, `new Date()`, `window`, or
 * `localStorage`, and NO mount-time `useEffect` mutates state. Sorting by `date`
 * uses ISO-8601 STRING comparison (`localeCompare`) — lexicographic order equals
 * chronological order for ISO dates — so no `Date` objects are constructed.
 * Derived arrays always copy before sorting (never mutate state arrays in
 * place). This determinism keeps the provider safe under React Server Components
 * hydration and satisfies the zero-console-errors gate.
 *
 * COMPOSITION & CONSUMERS
 * --------------------------------------------------------------------------
 * Mounted in `app/layout.tsx` as the OUTERMOST data provider (see above). It is
 * INDEPENDENT — it imports NO other provider. Consumed via the {@link useLibrary}
 * hook by `components/shell/Sidebar` and the `components/library/*` family
 * (BookListTable, BookListRow, ColumnHeader, StatusBar, BookDetailPanel,
 * CoverGrid, BookCard, SortFilterBar, BatchActionsPanel, RecentlyAddedList).
 *
 * SECTION-ID CONTRACT WITH `@/data/sidebar`
 * --------------------------------------------------------------------------
 * The section-filter ids handled here are kept in lockstep with the
 * `@/data/sidebar` `sidebarSections` ids — `all | reading-now | recently-added |
 * favorites | epub | mobi | pdf` — so clicking a sidebar section filters exactly
 * as its badge count implies (EPUB→10, MOBI→3, PDF→2, Favorites(rating≥5)→3,
 * Recently Added→6, Reading Now→3, All→15 in the current 15-book catalog).
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * --------------------------------------------------------------------------
 * The shape and behavior conceptually parallel Calibre's desktop client —
 * `src/calibre/gui2/library/views.py` (`selected_ids` set, `current_book` /
 * `current_id`, `PreserveViewState`, `sort_by_named_field`),
 * `alternate_views.py` (grid single- vs multi-select), and `models.py` (the
 * column model that suggests the sort fields). NO Python/Qt code is imported,
 * translated, or executed — the Calibre tree is a read-only conceptual reference.
 *
 * @see @/types — the `Book` contract and the `ViewMode` union consumed here.
 * @see @/data/books — the 15-book mock catalog that seeds this provider.
 * @see @/data/sidebar — the `sidebarSections` ids this filter switch mirrors.
 * @see src/calibre/gui2/library/views.py — Calibre `BooksView` (reference only).
 * @see src/calibre/gui2/library/alternate_views.py — Calibre `GridView` (reference only).
 * @see src/calibre/gui2/library/models.py — Calibre `BooksModel` columns (reference only).
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Book, ViewMode } from '@/types';
import { books as bookData } from '@/data/books';

/**
 * Sortable columns of the App 01 table / App 02 sort bar.
 *
 * Conceptual parity with Calibre's `BooksModel` column map (`models.py`): the
 * displayed columns are Title, Author(s), Date (Added), Rating, Format, and
 * Size — mapped here to the `Book` fields `title`, `author`, `date`, `rating`,
 * `format`, and `sizeBytes`.
 */
export type SortField = 'title' | 'author' | 'date' | 'rating' | 'format' | 'sizeBytes';

/** Sort direction — ascending or descending. */
export type SortOrder = 'asc' | 'desc';

/**
 * The value exposed by {@link LibraryContext} and returned by {@link useLibrary}.
 *
 * Groups (in order): the raw state, the derived selectors computed from it, and
 * the imperative actions that mutate it (view / filter / sort / selection /
 * current-book). All derived selectors are recomputed with `useMemo`; all
 * actions are stable `useCallback` identities.
 */
export interface LibraryContextValue {
  // ----- raw state -----
  /** The full mock catalog (exactly 15 books, seeded from `@/data/books`). */
  books: Book[];
  /** Library view mode — `'list'` (App 01) | `'grid'` (App 02). PERSISTS across routes. */
  viewMode: ViewMode;
  /** Ids of the currently-selected books (multi-selection). PERSISTS across routes. */
  selectedIds: string[];
  /** Active sidebar section id (default `'all'`; ids mirror `@/data/sidebar`). */
  activeSection: string;
  /** Active tag-browser filters (OR semantics across tags). */
  activeTags: string[];
  /** Active author filter, or `null` for no author filter. */
  activeAuthor: string | null;
  /** Id of the single book shown in the detail panel, or `null`. */
  currentBookId: string | null;
  /** The column the list/grid is sorted by. */
  sortField: SortField;
  /** The sort direction. */
  sortOrder: SortOrder;
  // ----- derived selectors -----
  /** Books after the section + tag + author filters, then sorted. */
  filteredBooks: Book[];
  /** The books whose id ∈ `selectedIds`. */
  selectedBooks: Book[];
  /** The book matching `currentBookId`, or `undefined` if none matches. */
  currentBook: Book | undefined;
  /** The 6 most-recently-added books by `date` (App 02 `RecentlyAddedList`). */
  recentlyAddedBooks: Book[];
  /** `true` when `selectedIds.length >= 2` → App 02 renders `BatchActionsPanel`. */
  isBatchMode: boolean;
  /** Convenience: `selectedIds.length`. */
  selectionCount: number;
  // ----- view actions -----
  /** Set the view mode explicitly. */
  setViewMode: (mode: ViewMode) => void;
  /** Toggle between `'list'` and `'grid'`. */
  toggleViewMode: () => void;
  // ----- filter actions -----
  /** Set the active sidebar section (e.g. `'all'`, `'epub'`, `'favorites'`). */
  setActiveSection: (id: string) => void;
  /** Add the tag to (or remove it from) the active tag filters. */
  toggleTag: (tag: string) => void;
  /** Set (or clear, with `null`) the active author filter. */
  setActiveAuthor: (author: string | null) => void;
  /** Reset section (`'all'`), tags (`[]`), and author (`null`) to defaults. */
  clearFilters: () => void;
  // ----- sort -----
  /** Set the sort field and (optionally) the order (defaults to `'asc'`). */
  setSort: (field: SortField, order?: SortOrder) => void;
  // ----- selection actions -----
  /** Single-select exactly one book (also sets it as the current/detail book). */
  selectOnly: (id: string) => void;
  /** Multi-select toggle for one book (grid); single remaining selection drives the detail panel. */
  toggleSelect: (id: string) => void;
  /** Clear the entire selection. */
  clearSelection: () => void;
  /** Whether the given book id is currently selected. */
  isSelected: (id: string) => boolean;
  /** Replace the entire selection with the given ids. */
  setSelectedIds: (ids: string[]) => void;
  // ----- current book -----
  /** Set (or clear, with `null`) the current/detail book. */
  setCurrentBookId: (id: string | null) => void;
  // ----- mutation actions (UI-only, in-memory) -----
  /**
   * Merge a partial patch into the book matching `id`, replacing the catalog
   * entry immutably so every derived selector (`filteredBooks`, `selectedBooks`,
   * `currentBook`, `recentlyAddedBooks`) reflows and all views re-render with the
   * edit. Drives the App 07 Metadata Editor Save/Apply workflow — purely
   * client-side React state, NO persistence/network/file I/O. The book's `id` is
   * always preserved so selection/current-book references never desync.
   */
  updateBook: (id: string, patch: Partial<Book>) => void;
}

/**
 * The library Context. Defaults to `null` so {@link useLibrary} can detect usage
 * outside a {@link LibraryProvider} and throw a descriptive error rather than
 * handing back a silently-`null` value.
 */
const LibraryContext = createContext<LibraryContextValue | null>(null);

/**
 * Pure, deterministic comparator for two books on a given field + order.
 *
 * Numeric fields (`rating`, `sizeBytes`) compare by subtraction; `date` compares
 * its ISO-8601 STRING with `localeCompare` (lexicographic order == chronological
 * order for ISO dates, so NO `Date` object is constructed — keeps it pure and
 * SSR-safe); all other fields (`title`, `author`, `format`) compare as strings.
 * The result is negated for descending order. Total and stable for equal inputs.
 */
function compareBooks(a: Book, b: Book, field: SortField, order: SortOrder): number {
  let cmp = 0;
  switch (field) {
    case 'rating':
    case 'sizeBytes':
      cmp = (a[field] as number) - (b[field] as number);
      break;
    case 'date':
      cmp = a.date.localeCompare(b.date); // ISO 8601 → lexicographic == chronological
      break;
    default: // title | author | format
      cmp = String(a[field] ?? '').localeCompare(String(b[field] ?? ''));
  }
  return order === 'asc' ? cmp : -cmp;
}

/**
 * Provides central library state (catalog, view mode, selection, filters, sort,
 * current book) to the subtree.
 *
 * All raw state is initialized to deterministic constants derived from the
 * static `books` array: `viewMode = 'list'`, `selectedIds = [books[0].id]`,
 * `activeSection = 'all'`, `activeTags = []`, `activeAuthor = null`,
 * `currentBookId = books[0].id`, `sortField = 'title'`, `sortOrder = 'asc'`.
 * Seeding the selection and the current book with the FIRST book means App 01's
 * detail panel shows a book on load (matching the Figma list's highlighted row +
 * populated detail panel) while the empty-catalog edge case (`books.length === 0`)
 * yields an empty selection and a `null` current book.
 *
 * Every action is memoized with {@link useCallback} (stable identities — they
 * only call state setters), every derived selector with {@link useMemo}, and the
 * exposed `value` with {@link useMemo}, so consumers re-render only when the data
 * they read actually changes. Renders nothing of its own beyond the Context
 * provider wrapping `children` — all library visuals live in `components/library/*`.
 */
export function LibraryProvider({ children }: { children: ReactNode }) {
  // ---------- raw state (deterministic defaults) ----------
  const [books, setBooks] = useState<Book[]>(bookData);
  const [viewMode, setViewModeState] = useState<ViewMode>('list');
  const [selectedIds, setSelectedIdsState] = useState<string[]>(() =>
    bookData.length > 0 ? [bookData[0].id] : [],
  );
  const [activeSection, setActiveSectionState] = useState<string>('all');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activeAuthor, setActiveAuthorState] = useState<string | null>(null);
  const [currentBookId, setCurrentBookIdState] = useState<string | null>(() =>
    bookData.length > 0 ? bookData[0].id : null,
  );
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // ---------- view actions ----------
  const setViewMode = useCallback((mode: ViewMode) => setViewModeState(mode), []);
  const toggleViewMode = useCallback(
    () => setViewModeState((prev) => (prev === 'list' ? 'grid' : 'list')),
    [],
  );

  // ---------- filter actions ----------
  const setActiveSection = useCallback((id: string) => setActiveSectionState(id), []);
  const toggleTag = useCallback((tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);
  const setActiveAuthor = useCallback(
    (author: string | null) => setActiveAuthorState(author),
    [],
  );
  const clearFilters = useCallback(() => {
    setActiveSectionState('all');
    setActiveTags([]);
    setActiveAuthorState(null);
  }, []);

  // ---------- sort ----------
  const setSort = useCallback((field: SortField, order: SortOrder = 'asc') => {
    setSortField(field);
    setSortOrder(order);
  }, []);

  // ---------- selection actions ----------
  const setSelectedIds = useCallback((ids: string[]) => setSelectedIdsState(ids), []);
  const clearSelection = useCallback(() => setSelectedIdsState([]), []);
  const selectOnly = useCallback((id: string) => {
    setSelectedIdsState([id]);
    setCurrentBookIdState(id);
  }, []);
  const toggleSelect = useCallback((id: string) => {
    setSelectedIdsState((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      // A single remaining selection drives the detail panel.
      if (next.length === 1) {
        setCurrentBookIdState(next[0]);
      }
      return next;
    });
  }, []);

  // ---------- current book ----------
  const setCurrentBookId = useCallback(
    (id: string | null) => setCurrentBookIdState(id),
    [],
  );

  // ---------- mutation actions (UI-only, in-memory) ----------
  // Immutably merge `patch` into the matching book. The original `id` is forced
  // back onto the merged record so a patch can never accidentally re-key a book
  // (which would desync `selectedIds` / `currentBookId`). Books that don't match
  // are returned by reference, so React only re-renders consumers of the edited
  // record. NO persistence — state is in-memory only (AAP §0.8.2).
  const updateBook = useCallback((id: string, patch: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch, id: b.id } : b)),
    );
  }, []);

  // ---------- derived selectors ----------
  const filteredBooks = useMemo<Book[]>(() => {
    let result = books;
    // Section filter — ids align with `@/data/sidebar` `sidebarSections`.
    switch (activeSection) {
      case 'favorites':
        result = result.filter((b) => b.rating >= 5);
        break;
      case 'recently-added':
        result = [...result]
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 6);
        break;
      case 'reading-now':
        // `Book` carries no "currently reading" flag, so this is a curated demo
        // subset of 3 (consistent with the sidebar's "Reading Now" count of 3).
        result = result.slice(0, 3);
        break;
      case 'epub':
        result = result.filter((b) => b.format === 'EPUB');
        break;
      case 'mobi':
        result = result.filter((b) => b.format === 'MOBI');
        break;
      case 'pdf':
        result = result.filter((b) => b.format === 'PDF');
        break;
      case 'all':
      default:
        break;
    }
    // Tag filter — OR semantics (a book matches if it carries ANY active tag).
    if (activeTags.length > 0) {
      result = result.filter((b) => activeTags.some((t) => b.tags.includes(t)));
    }
    // Author filter.
    if (activeAuthor !== null) {
      result = result.filter((b) => b.author === activeAuthor);
    }
    // Sort — copy first so the underlying state array is never mutated in place.
    return [...result].sort((a, b) => compareBooks(a, b, sortField, sortOrder));
  }, [books, activeSection, activeTags, activeAuthor, sortField, sortOrder]);

  const selectedBooks = useMemo<Book[]>(
    () => books.filter((b) => selectedIds.includes(b.id)),
    [books, selectedIds],
  );

  const currentBook = useMemo<Book | undefined>(
    () => books.find((b) => b.id === currentBookId),
    [books, currentBookId],
  );

  const recentlyAddedBooks = useMemo<Book[]>(
    () => [...books].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6),
    [books],
  );

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds],
  );

  // ---------- exposed value ----------
  const value = useMemo<LibraryContextValue>(
    () => ({
      books,
      viewMode,
      selectedIds,
      activeSection,
      activeTags,
      activeAuthor,
      currentBookId,
      sortField,
      sortOrder,
      filteredBooks,
      selectedBooks,
      currentBook,
      recentlyAddedBooks,
      isBatchMode: selectedIds.length >= 2,
      selectionCount: selectedIds.length,
      setViewMode,
      toggleViewMode,
      setActiveSection,
      toggleTag,
      setActiveAuthor,
      clearFilters,
      setSort,
      selectOnly,
      toggleSelect,
      clearSelection,
      isSelected,
      setSelectedIds,
      setCurrentBookId,
      updateBook,
    }),
    [
      books,
      viewMode,
      selectedIds,
      activeSection,
      activeTags,
      activeAuthor,
      currentBookId,
      sortField,
      sortOrder,
      filteredBooks,
      selectedBooks,
      currentBook,
      recentlyAddedBooks,
      setViewMode,
      toggleViewMode,
      setActiveSection,
      toggleTag,
      setActiveAuthor,
      clearFilters,
      setSort,
      selectOnly,
      toggleSelect,
      clearSelection,
      isSelected,
      setSelectedIds,
      setCurrentBookId,
      updateBook,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

/**
 * Access the central library state and actions.
 *
 * @returns the live {@link LibraryContextValue}.
 * @throws if called outside a {@link LibraryProvider} (the Context default is
 *   `null`), which surfaces a missing-provider mistake immediately instead of
 *   failing later with an opaque `null` access.
 */
export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (ctx === null) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return ctx;
}

