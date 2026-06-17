'use client';

/**
 * ==========================================================================
 * Calibre-UI State — ReaderProvider
 * UI-only E-book Viewer state Context (App 03 — Figma node `4:2`).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ReaderProvider` is the React Context provider that owns the reading state of
 * the E-book Viewer screen in the UI-only Calibre e-book-manager prototype
 * (Next.js 15 App Router · React 19 · TypeScript 5 strict). It models, against
 * hardcoded mock data, everything the viewer screen needs:
 *   1. the current CHAPTER INDEX — the Table-of-Contents selection (node `4:23`);
 *   2. the derived reading PROGRESS percent — the top purple progress bar that
 *      reads 29% in the design (node `4:43`);
 *   3. the viewer FONT SCALE — driven by the ReaderToolbar A-/A+ control
 *      (node `4:8`); and
 *   4. the reader's BOOKMARKS and HIGHLIGHTS/notes — the ReaderTools panel
 *      (node `4:56`).
 * Chapters are seeded from `@/data/chapters`; the `Chapter` shape comes from
 * `@/types`. Consumed by `components/viewer/*` (TableOfContents, ReadingArea,
 * ReaderToolbar, ReaderToolsPanel, ReaderNavStrip) via the {@link useReader}
 * hook.
 *
 * DETERMINISTIC / SSR-SAFE (the defining correctness property)
 * --------------------------------------------------------------------------
 * Initial state is IDENTICAL on the server and the client so the App Router can
 * hydrate the viewer with zero console/hydration errors:
 *   • `currentChapterIndex` initializes to the constant {@link
 *     INITIAL_CHAPTER_INDEX} (`2`). With the 7-chapter mock dataset this derives
 *     to `Math.round((2 / 7) * 100) === 29` — exactly the 29% the design shows
 *     (node `4:43`). The percentage is DERIVED in `useMemo`, never stored.
 *   • The seeded {@link INITIAL_BOOKMARKS} / {@link INITIAL_HIGHLIGHTS} use FIXED
 *     hardcoded ISO-8601 `createdAt` strings — never `new Date()` / `Date.now()`
 *     in the seed (a per-render timestamp would differ between server and client
 *     and trip hydration).
 * There is NO `Math.random()`, NO `window` / `document` access during render,
 * and NO mount-time `useEffect` that mutates state.
 *
 *   Allowed exception: runtime mutations triggered by a user CLICK
 *   ({@link ReaderContextValue.addBookmark} / {@link
 *   ReaderContextValue.addHighlight}) MAY use `crypto.randomUUID()` and
 *   `new Date().toISOString()`. Those run only on the client AFTER an
 *   interaction, so they never affect the server-rendered initial markup. Such
 *   calls live inside the action callbacks ONLY — never in an initializer.
 *
 * UI-ONLY · IN-MEMORY · NO PERSISTENCE
 * --------------------------------------------------------------------------
 * All state is in-memory React state — there is NO backend, NO API, NO database,
 * NO localStorage, and NO real EPUB parsing. A reload resets everything to the
 * deterministic seed. The seeded bookmarks/highlights are mock demo data.
 *
 * LOCALLY-OWNED `Bookmark` / `Highlight` TYPES (intentional)
 * --------------------------------------------------------------------------
 * This provider is the OWNER of the {@link Bookmark} and {@link Highlight}
 * shapes used by the viewer, so it DEFINES and EXPORTS them here. Downstream
 * viewer components import them from `@/state/ReaderProvider` (NOT from
 * `@/types`). Only the `Chapter` contract is imported from `@/types`. This
 * provider's reader model is INDEX-based (`chapterIndex: number`, matching the
 * index-driven TOC/NavStrip navigation) and carries a `createdAt` timestamp for
 * the ReaderTools list, which is why these locally-owned shapes are authoritative
 * for the viewer rather than any same-named type declared elsewhere.
 *
 * THEME IS NOT OWNED HERE
 * --------------------------------------------------------------------------
 * The ReaderToolbar's theme switch (node `4:8`) reads/writes `viewerTheme` via
 * `PreferencesProvider` (`usePreferences()`), which is the single source of
 * truth for theme. This provider deliberately exposes NO `theme` field.
 *
 * COMPOSITION & CONSUMERS
 * --------------------------------------------------------------------------
 * Mounted in `app/layout.tsx` in the provider stack:
 *   LibraryProvider → PreferencesProvider → ReaderProvider → ModalProvider →
 *   AppShell (AAP §0.6.2). It is INDEPENDENT — it imports no other provider.
 * Read by the `components/viewer/*` components through {@link useReader}.
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * --------------------------------------------------------------------------
 * The bookmark/highlight/TOC concepts conceptually parallel Calibre's desktop
 * viewer — `src/calibre/gui2/viewer/bookmarks.py` (its bookmark dicts use
 * `title`, `pos`, `timestamp`) and `src/calibre/gui2/viewer/toc.py` (TOC items
 * expose `.title`; `title_for_current_node`). NO Python/Qt code is imported,
 * translated, or executed — the parallel is conceptual only.
 *
 * @see @/types — the `Chapter` contract consumed here.
 * @see @/data/chapters — the seeded 7-chapter mock dataset.
 * @see src/calibre/gui2/viewer/bookmarks.py — Calibre viewer bookmarks (reference only).
 * @see src/calibre/gui2/viewer/toc.py — Calibre viewer TOC (reference only).
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Chapter } from '@/types';
import { chapters as chapterData } from '@/data/chapters';

// ───────────────────────────────────────────────────────────────────────────
// Locally-owned reader types (this provider is their owner; see header note)
// ───────────────────────────────────────────────────────────────────────────

/**
 * A reader bookmark, listed in the viewer's ReaderTools panel (node `4:56`).
 *
 * Owned by `ReaderProvider`. Design-parity (reference only) with Calibre's
 * `viewer/bookmarks.py`, whose bookmark dicts carry `{title, pos, timestamp}`;
 * here the mock "position" is the target `chapterIndex`.
 */
export interface Bookmark {
  /** Stable, unique bookmark identifier. */
  id: string;
  /** Short display label (e.g. a chapter title or text snippet). */
  title: string;
  /** Which chapter the bookmark points to (mock reading "position"). */
  chapterIndex: number;
  /** Creation timestamp, ISO-8601. Fixed in the seed; live for user adds. */
  createdAt: string;
}

/**
 * A reader highlight / note, listed in the viewer's ReaderTools panel
 * (node `4:56`) alongside bookmarks and reading-progress stats.
 *
 * Owned by `ReaderProvider`. Design-parity (reference only) with Calibre's
 * highlight model (`highlighted_text` / `notes` / `timestamp` / `uuid`).
 */
export interface Highlight {
  /** Stable, unique highlight identifier. */
  id: string;
  /** Which chapter the highlighted passage belongs to. */
  chapterIndex: number;
  /** The highlighted passage text (original prototype prose — copyright-safe). */
  text: string;
  /** Optional free-form annotation attached to the highlight. */
  note?: string;
  /** Creation timestamp, ISO-8601. Fixed in the seed; live for user adds. */
  createdAt: string;
}

// ───────────────────────────────────────────────────────────────────────────
// Context value contract
// ───────────────────────────────────────────────────────────────────────────

/**
 * The value exposed by the reader Context and returned by {@link useReader}.
 *
 * Holds the viewer's reading state plus the imperative actions that mutate it.
 * `progressPercent` and `currentChapter` are DERIVED (never stored) so they can
 * never drift out of sync with `currentChapterIndex`.
 */
export interface ReaderContextValue {
  /** The full ordered chapter list (seeded, immutable for the session). */
  chapters: Chapter[];
  /** Index of the chapter currently being read (always a valid index). */
  currentChapterIndex: number;
  /** The current {@link Chapter}, or `undefined` if there are no chapters. */
  currentChapter: Chapter | undefined;
  /**
   * Reading progress percent (0–100), DERIVED from the chapter index. With the
   * 7-chapter dataset, index 2 yields `Math.round((2 / 7) * 100) === 29` to
   * match the viewer's top progress bar (Figma node `4:43`).
   */
  progressPercent: number;
  /** Viewer font scale for the A-/A+ control (Figma node `4:8`). `1` = 100%. */
  fontScale: number;
  /** The reader's bookmarks (seeded with deterministic mock data). */
  bookmarks: Bookmark[];
  /** The reader's highlights/notes (seeded with deterministic mock data). */
  highlights: Highlight[];
  /** Jump to a chapter (clamped to a valid index). TOC click + NavStrip. */
  goToChapter: (index: number) => void;
  /** Advance one chapter (clamped at the last chapter). */
  nextChapter: () => void;
  /** Go back one chapter (clamped at the first chapter). */
  prevChapter: () => void;
  /** A+ — increase the reading font scale (step 0.1, clamped to the max). */
  increaseFontScale: () => void;
  /** A- — decrease the reading font scale (step 0.1, clamped to the min). */
  decreaseFontScale: () => void;
  /** Add a bookmark (defaults to the current chapter when unspecified). */
  addBookmark: (bookmark?: Partial<Pick<Bookmark, 'title' | 'chapterIndex'>>) => void;
  /** Remove a bookmark by id. */
  removeBookmark: (id: string) => void;
  /** Add a highlight/note for a chapter. */
  addHighlight: (highlight: Pick<Highlight, 'text' | 'chapterIndex'> & { note?: string }) => void;
  /** Remove a highlight by id. */
  removeHighlight: (id: string) => void;
}

// ───────────────────────────────────────────────────────────────────────────
// Deterministic constants & seeds (SSR-safe — fixed values only)
// ───────────────────────────────────────────────────────────────────────────

/**
 * Initial chapter index. The single load-bearing constant: with the 7-chapter
 * mock dataset it derives to 29% progress, matching Figma node `4:43`. It is a
 * fixed constant (never random/time-based) so server and client agree.
 */
const INITIAL_CHAPTER_INDEX = 2;

/** Lower bound for the viewer font scale (A- floor). */
const MIN_FONT_SCALE = 0.8;
/** Upper bound for the viewer font scale (A+ cap). */
const MAX_FONT_SCALE = 1.6;
/** Per-click font-scale increment for the A-/A+ control. */
const FONT_SCALE_STEP = 0.1;

/**
 * Deterministic mock bookmarks. The `createdAt` values are FIXED ISO-8601
 * strings (never `new Date()`) so the initial render is hydration-safe. Labels
 * reference the seeded chapter titles from `@/data/chapters`.
 */
const INITIAL_BOOKMARKS: Bookmark[] = [
  { id: 'bm-1', title: 'Prologue — The Signal', chapterIndex: 0, createdAt: '2024-06-01T10:15:00.000Z' },
  { id: 'bm-2', title: 'The Long Dark', chapterIndex: 2, createdAt: '2024-06-02T19:40:00.000Z' },
];

/**
 * Deterministic mock highlights. The `createdAt` values are FIXED ISO-8601
 * strings (hydration-safe). The highlighted `text` is ORIGINAL prototype prose
 * drawn from `@/data/chapters` (no copyrighted text).
 */
const INITIAL_HIGHLIGHTS: Highlight[] = [
  {
    id: 'hl-1',
    chapterIndex: 2,
    text: 'a thin thread of sound threading through the dark between the stars',
    note: 'Great opening image',
    createdAt: '2024-06-02T20:05:00.000Z',
  },
];

/**
 * The reader Context. Defaults to `null` so {@link useReader} can detect usage
 * outside a {@link ReaderProvider} and throw a descriptive error rather than
 * returning a silently-undefined value.
 */
const ReaderContext = createContext<ReaderContextValue | null>(null);

/**
 * Clamp `index` into the valid `[0, length - 1]` range; returns `0` for an empty
 * list. Pure and deterministic — safe to call during render.
 */
function clampIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return Math.max(0, Math.min(length - 1, index));
}

// ───────────────────────────────────────────────────────────────────────────
// Provider
// ───────────────────────────────────────────────────────────────────────────

/**
 * Provides E-book Viewer reading state to the subtree.
 *
 * State is initialized to deterministic constants/seeds for SSR-safe hydration:
 * the chapter list is seeded from `@/data/chapters`, the current index from the
 * fixed {@link INITIAL_CHAPTER_INDEX} (clamped defensively against the dataset
 * length), the font scale to `1`, and the bookmarks/highlights from the fixed
 * seeds. Action callbacks are memoized with {@link useCallback}, and the exposed
 * value is memoized with {@link useMemo} (deriving `progressPercent` and
 * `currentChapter`) so consumers re-render only when reading state changes.
 * Renders nothing of its own beyond the Context provider wrapping `children`;
 * all viewer visuals live in `components/viewer/*`.
 */
export function ReaderProvider({ children }: { children: ReactNode }) {
  // `chapters` is seeded once and never mutated for the session (no setter).
  const [chapters] = useState<Chapter[]>(chapterData);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(() =>
    clampIndex(INITIAL_CHAPTER_INDEX, chapterData.length),
  );
  const [fontScale, setFontScale] = useState<number>(1);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(INITIAL_BOOKMARKS);
  const [highlights, setHighlights] = useState<Highlight[]>(INITIAL_HIGHLIGHTS);

  // ── Chapter navigation (always clamped to a valid index) ──────────────────

  const goToChapter = useCallback(
    (index: number) => {
      // Absolute jump — does not depend on the previous index.
      setCurrentChapterIndex(clampIndex(index, chapters.length));
    },
    [chapters.length],
  );

  const nextChapter = useCallback(() => {
    setCurrentChapterIndex((prev) => clampIndex(prev + 1, chapters.length));
  }, [chapters.length]);

  const prevChapter = useCallback(() => {
    setCurrentChapterIndex((prev) => clampIndex(prev - 1, chapters.length));
  }, [chapters.length]);

  // ── Font scale (A-/A+) — stepped and clamped, kept on a clean 0.1 grid ─────

  const increaseFontScale = useCallback(() => {
    setFontScale((prev) => Math.min(MAX_FONT_SCALE, Math.round((prev + FONT_SCALE_STEP) * 10) / 10));
  }, []);

  const decreaseFontScale = useCallback(() => {
    setFontScale((prev) => Math.max(MIN_FONT_SCALE, Math.round((prev - FONT_SCALE_STEP) * 10) / 10));
  }, []);

  // ── Bookmarks ─────────────────────────────────────────────────────────────

  const addBookmark = useCallback(
    (bookmark?: Partial<Pick<Bookmark, 'title' | 'chapterIndex'>>) => {
      setBookmarks((prev) => {
        const chapterIndex = bookmark?.chapterIndex ?? currentChapterIndex;
        const title =
          bookmark?.title ?? chapters[chapterIndex]?.title ?? `Chapter ${chapterIndex + 1}`;
        const next: Bookmark = {
          // Client-only, post-interaction — never runs during SSR/hydration.
          id: crypto.randomUUID(),
          title,
          chapterIndex,
          createdAt: new Date().toISOString(),
        };
        return [...prev, next];
      });
    },
    [chapters, currentChapterIndex],
  );

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // ── Highlights / notes ─────────────────────────────────────────────────────

  const addHighlight = useCallback(
    (highlight: Pick<Highlight, 'text' | 'chapterIndex'> & { note?: string }) => {
      setHighlights((prev) => [
        ...prev,
        // Client-only, post-interaction — never runs during SSR/hydration.
        { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...highlight },
      ]);
    },
    [],
  );

  const removeHighlight = useCallback((id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  }, []);

  // ── Derived, memoized context value ────────────────────────────────────────

  const value = useMemo<ReaderContextValue>(() => {
    // Derive progress from the index so it can never drift; 2 of 7 ⇒ 29%.
    const progressPercent =
      chapters.length > 0 ? Math.round((currentChapterIndex / chapters.length) * 100) : 0;
    return {
      chapters,
      currentChapterIndex,
      currentChapter: chapters[currentChapterIndex],
      progressPercent,
      fontScale,
      bookmarks,
      highlights,
      goToChapter,
      nextChapter,
      prevChapter,
      increaseFontScale,
      decreaseFontScale,
      addBookmark,
      removeBookmark,
      addHighlight,
      removeHighlight,
    };
  }, [
    chapters,
    currentChapterIndex,
    fontScale,
    bookmarks,
    highlights,
    goToChapter,
    nextChapter,
    prevChapter,
    increaseFontScale,
    decreaseFontScale,
    addBookmark,
    removeBookmark,
    addHighlight,
    removeHighlight,
  ]);

  return <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>;
}

// ───────────────────────────────────────────────────────────────────────────
// Hook
// ───────────────────────────────────────────────────────────────────────────

/**
 * Access the E-book Viewer reading state and actions.
 *
 * @returns the live {@link ReaderContextValue}.
 * @throws if called outside a {@link ReaderProvider} (the Context default is
 *   `null`), surfacing a missing-provider mistake immediately instead of failing
 *   later with an opaque `undefined` access.
 */
export function useReader(): ReaderContextValue {
  const ctx = useContext(ReaderContext);
  if (ctx === null) {
    throw new Error('useReader must be used within a ReaderProvider');
  }
  return ctx;
}

