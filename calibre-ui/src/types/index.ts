/**
 * `@/types` — the public types barrel for the Calibre-UI prototype.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ──────────────────────────────────────────────────────────────────────────
 * This module is the single public entry point of the foundational `@/types`
 * package. It does exactly two things:
 *
 *   1. Re-exports the canonical {@link Book} contract from the sibling `./book`
 *      module, so consumers may write `import type { Book } from '@/types'` in
 *      addition to the more specific `import type { Book } from '@/types/book'`.
 *      Both import specifiers resolve to the same, unaltered interface.
 *
 *   2. Declares the shared, cross-cutting types consumed across the `data`,
 *      `state`, `components`, `lib`, and `app` layers — view modes, the modal
 *      registry, the format/theme unions, and the in-memory shapes for reader
 *      chapters, editor files, sidebar facets, and application preferences.
 *
 * The tsconfig path alias is `@/*` → `./src/*`, so this file resolves as
 * `@/types`.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * UI-ONLY / MOCK-DATA MODEL
 * ──────────────────────────────────────────────────────────────────────────
 * Every type here models **in-memory, hardcoded mock data** held in React
 * state/Context for a UI-only prototype. There is NO backend, NO database, NO
 * API, and NO real file I/O — none of these are persistence/ORM schemas. The
 * concrete mock datasets that satisfy these contracts live under `@/data/*`.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * TYPE-ONLY MODULE (hard constraints)
 * ──────────────────────────────────────────────────────────────────────────
 * This file contains ONLY type declarations and a single type-only re-export.
 * It declares no runtime values, no functions, no constants, and intentionally
 * uses NO `enum` (which would emit runtime JavaScript). String-literal union
 * `type` aliases are used in place of enums. The file carries no `'use client'`
 * directive and imports nothing at runtime; its only cross-module reference is
 * the type-only re-export from `./book`. Consequently it compiles to nothing
 * (zero emitted JS), which keeps it safe to import from both Server and Client
 * Components. The type-only `export type { … } from` form is required because
 * the project compiles under strict TypeScript with `isolatedModules` enabled.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * CONSUMER MAP (where each type is used)
 * ──────────────────────────────────────────────────────────────────────────
 *   Book              → every layer (re-exported, unchanged, from `./book`)
 *   ViewMode          → LibraryProvider (List `/` ↔ Grid `/grid`)
 *   FormatKind        → primitives/FormatBadge + format-filtering helpers
 *   ModalKind         → ModalProvider (Convert App05 / Metadata App07)
 *   ViewerTheme       → PreferencesProvider, primitives/ThemeSwatch
 *   Chapter           → data/chapters, ReaderProvider, viewer/* (App03)
 *   EditorFile        → data/editorFiles, editor/* (App04)
 *   SidebarSection    → data/sidebar, shell/Sidebar (App01/App02)
 *   TagFacet          → data/sidebar, shell/Sidebar tag browser
 *   AuthorFacet       → data/sidebar, shell/Sidebar author filter
 *   PreferencesState  → PreferencesProvider, data/preferences, preferences/*
 *   Identifier        → metadata/IdentifierRows (App07)
 *   Bookmark          → ReaderProvider, viewer/ReaderToolsPanel (App03)
 *   Highlight         → ReaderProvider, viewer/ReaderToolsPanel (App03)
 *
 * ──────────────────────────────────────────────────────────────────────────
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * ──────────────────────────────────────────────────────────────────────────
 * The data-model-adjacent types conceptually parallel Calibre's desktop client
 * (`src/calibre/gui2/library/models.py` — `BooksModel` columns, and the viewer/
 * editor concepts), but NO Python/Qt code is imported, translated, or executed.
 * `Chapter` and `EditorFile` are novel UI-prototype types derived from the
 * Agent Action Plan §0.3.1 (viewer/editor workflows) and §0.7.4.
 *
 * @see ./book — the authoritative, verbatim `Book` contract (AAP §0.1.2).
 * @see src/calibre/gui2/library/models.py — Calibre `BooksModel` (reference only).
 */

// ───────────────────────────────────────────────────────────────────────────
// 1) Barrel re-export
// ───────────────────────────────────────────────────────────────────────────

/**
 * Re-export the canonical `Book` contract so it is reachable via the barrel.
 *
 * This is a TYPE-ONLY re-export (required under `isolatedModules`): it is fully
 * erased at compile time and adds no runtime code. The `Book` interface is NOT
 * shadowed, redefined, or re-typed here — it is surfaced exactly as declared in
 * `./book`. In particular, `Book.format` remains a plain `string` (see the
 * `FormatKind` note below).
 */
export type { Book } from './book';

// ───────────────────────────────────────────────────────────────────────────
// 2) Cross-cutting string-literal union types
// ───────────────────────────────────────────────────────────────────────────

/**
 * Library view mode.
 *
 * Owned by `LibraryProvider` and preserved across the List route (`/`) and the
 * Grid route (`/grid`) so that switching views never resets the user's place.
 */
export type ViewMode = 'list' | 'grid';

/**
 * Narrowed, three-way book-format union used by the `FormatBadge` primitive
 * (variants `epub` / `mobi` / `pdf`) and by format-filtering helpers.
 *
 * IMPORTANT — this is a SEPARATE convenience type, NOT the type of
 * `Book.format`. Per the verbatim `Book` contract (AAP §0.1.2), `Book.format`
 * stays a plain `string`; it is never re-typed to `FormatKind` anywhere. Map a
 * `Book.format` string onto a `FormatKind` at the badge/filter boundary (e.g.
 * by uppercasing and validating) rather than by changing the `Book` contract.
 */
export type FormatKind = 'EPUB' | 'MOBI' | 'PDF';

/**
 * Which modal overlay is currently open, or `null` when none is open.
 *
 * Owned by `ModalProvider`. The two overlays are the Convert Books dialog
 * (App05) and the Metadata Editor (App07). Modals render over the library and
 * do NOT change the active route.
 */
export type ModalKind = 'convert' | 'metadata' | null;

/**
 * Viewer color theme — the four swatches offered in Preferences (App06) and the
 * variant set rendered by the `primitives/ThemeSwatch` component.
 */
export type ViewerTheme = 'dark' | 'light' | 'sepia' | 'high-contrast';

// ───────────────────────────────────────────────────────────────────────────
// 3) Cross-cutting object/interface types
// ───────────────────────────────────────────────────────────────────────────

/**
 * A single reader chapter.
 *
 * Seeded by `data/chapters`; consumed by `ReaderProvider` and the viewer
 * components (App03). Chapters drive the table of contents, the rendered
 * reading area, and the reading-progress statistics.
 */
export interface Chapter {
  /** Stable, unique chapter identifier (mock key, e.g. `"ch-01"`). */
  id: string;
  /** Chapter title shown in the table of contents (App03, node 4:23). */
  title: string;
  /** Pre-rendered HTML shown in the reading area (justified 15px/26px body). */
  htmlContent: string;
  /** Word count feeding the reading-progress stats in the reader tools panel. */
  wordCount: number;
}

/**
 * An EPUB/OEBPS node for the editor.
 *
 * Seeded by `data/editorFiles`; consumed by the editor components (App04). Each
 * node is either a `folder` (a structural grouping in the file tree) or a
 * `file` (an openable, syntax-highlighted document).
 */
export interface EditorFile {
  /** Full OEBPS path, e.g. `"OEBPS/text/chapter1.xhtml"`. */
  path: string;
  /** Display name shown in the file tree and on the open-file tab. */
  name: string;
  /**
   * Shiki language id used by `lib/highlight` and the `CodeEditor` view, e.g.
   * `"html"`, `"xml"`, or `"css"`. Folders may use an empty string.
   */
  language: string;
  /** File contents rendered in the syntax-highlighted code view. */
  code: string;
  /** Raw size in bytes, displayed beside the node in the file tree. */
  sizeBytes: number;
  /** Tree-node kind — a structural folder or an openable file. */
  kind: 'folder' | 'file';
}

/**
 * A sidebar navigation section with a live count.
 *
 * Seeded by `data/sidebar`; consumed by `shell/Sidebar` (App01/App02). The
 * active section renders with a translucent purple fill.
 */
export interface SidebarSection {
  /** Stable, unique section identifier (mock key, e.g. `"all-books"`). */
  id: string;
  /**
   * Emoji/unicode glyph rendered as the section icon. Per AAP §0.3.4 all icons
   * are font glyphs, NOT asset files.
   */
  icon: string;
  /** Human-readable section label (e.g. `"All Books"`). */
  label: string;
  /** Live count of books in the section, shown beside the label. */
  count: number;
}

/**
 * A sidebar tag-browser facet — a tag label and how many books carry it.
 * Seeded by `data/sidebar`; consumed by the `shell/Sidebar` tag browser.
 */
export interface TagFacet {
  /** Tag label (e.g. `"Sci-Fi"`); also serves as a stable React list key. */
  label: string;
  /** Number of books carrying this tag. */
  count: number;
}

/**
 * A sidebar author-filter facet — an author name and their book count.
 * Seeded by `data/sidebar`; consumed by the `shell/Sidebar` author filter.
 */
export interface AuthorFacet {
  /** Author name (e.g. `"Frank Herbert"`); also a stable React list key. */
  name: string;
  /** Number of books by this author. */
  count: number;
}

/**
 * Application preferences state.
 *
 * Owned by `PreferencesProvider`; defaults seeded by `data/preferences`; edited
 * by the `preferences/*` panels (App06 — the Default Font row, the 2×3
 * Reading-Behavior toggle grid, the four Viewer-Theme swatches, and the Margins
 * slider).
 */
export interface PreferencesState {
  /** Default reading font family, selected from the Default Font dropdown. */
  fontFamily: string;
  /** Default reading font size, in pixels. */
  fontSizePx: number;
  /**
   * Boolean values for the 2×3 Reading-Behavior toggle grid, keyed by toggle
   * id. A `Record` (rather than fixed fields) keeps the grid data-driven so the
   * preferences panel can render whatever toggles `data/preferences` defines.
   */
  readingBehavior: Record<string, boolean>;
  /** The currently active viewer theme swatch. */
  viewerTheme: ViewerTheme;
  /** Margins slider value, in pixels (the purple-filled track). */
  marginsPx: number;
}

// ───────────────────────────────────────────────────────────────────────────
// 4) Minimal supporting helper types (AAP-grounded, type-only)
// ───────────────────────────────────────────────────────────────────────────

/**
 * A single external-identifier pair (scheme + value).
 *
 * `Book.identifiers` remains the canonical `Record<string, string>` map; this
 * pair shape is a convenience for the Metadata Editor's editable Identifier
 * rows (App07 — "+ Add ID"), where each row needs an explicit key/value couple
 * to render and edit. Convert between the two with `Object.entries` /
 * `Object.fromEntries` at the component boundary.
 */
export interface Identifier {
  /** Identifier scheme/namespace, e.g. `"isbn"` or `"goodreads"`. */
  scheme: string;
  /** The identifier value, e.g. `"978-0441013593"`. */
  value: string;
}

/**
 * A reader bookmark.
 *
 * Owned by `ReaderProvider` and listed in the viewer's reader-tools panel
 * (App03, node 4:56). Points at a position within a specific chapter.
 */
export interface Bookmark {
  /** Stable, unique bookmark identifier. */
  id: string;
  /** Id of the {@link Chapter} the bookmark lives in. */
  chapterId: string;
  /** Short display label (e.g. a chapter title or text snippet). */
  label: string;
  /** Normalized reading position within the book, from 0 to 1. */
  progress: number;
}

/**
 * A reader highlight / note.
 *
 * Owned by `ReaderProvider` and listed in the viewer's reader-tools panel
 * (App03, node 4:56) alongside bookmarks and reading-progress stats.
 */
export interface Highlight {
  /** Stable, unique highlight identifier. */
  id: string;
  /** Id of the {@link Chapter} the highlight belongs to. */
  chapterId: string;
  /** The highlighted passage text. */
  text: string;
  /** Optional free-form annotation attached to the highlight. */
  note?: string;
  /** Optional highlight color (a theme token reference). */
  color?: string;
}
