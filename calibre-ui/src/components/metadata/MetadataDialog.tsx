'use client';

/**
 * ==========================================================================
 * Calibre-UI — MetadataDialog
 * The App 07 Metadata Editor MODAL — root composer (Figma screen `9:9`).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `MetadataDialog` is the ROOT COMPOSER of the App 07 Metadata Editor modal
 * (Figma screen node `9:9`, 860×800; scrim `9:8` = rgba(0,0,0,0.55)) in the
 * UI-only Calibre e-book-manager prototype (Next.js 15 App Router · React 19 ·
 * TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens). It is the LAST
 * metadata component to be built because it COMPOSES the four sibling metadata
 * components and the `ModalShell` scaffold, OWNS all local form state, and
 * distributes controlled props to its children:
 *   • header strip   — the book-name subtitle + ← → prev/next step arrows;
 *   • left column    — `MetadataCoverColumn` (cover, cover actions, editable
 *                      rating, format list, "+ Add format");
 *   • right column   — `MetadataFields` (the editable field grid) with
 *                      `TagChipEditor` then `IdentifierRows` injected as its
 *                      `children` (preserving the Figma order fields → Tags →
 *                      Identifiers → Synopsis); and
 *   • footer         — Cancel · Apply · Save.
 *
 * ROUTE-INDEPENDENT OVERLAY (the defining correctness property)
 * --------------------------------------------------------------------------
 * This is a centered overlay rendered over the dimmed library — it is NOT a
 * route. It is opened/closed STRICTLY through `ModalProvider` open-state
 * (`useModal`); it NEVER imports `next/navigation`, NEVER calls `router.push`,
 * and NEVER touches `window.location`. Toggling it produces zero route changes
 * (the App Router stays on `/` or `/grid`) and zero console errors. It is
 * mounted by `AppShell` through `ModalShell`/`ModalProvider`; it does NOT mount
 * itself into any route and contains NO `page.tsx` logic. (The macOS window
 * title bar belongs to `AppShell`, not this modal.)
 *
 * UI-ONLY / MOCK — IN-MEMORY COMMIT, NO DURABLE PERSISTENCE (AAP §0.1.2 · §0.9)
 * --------------------------------------------------------------------------
 * There is no backend, no database, no API, and no real file I/O. Save and Apply
 * DO commit the user's edits — but ONLY into the in-memory shared library state
 * via `LibraryProvider`'s `updateBook(id, patch)` mutation, so the edited title /
 * author / rating / tags / series / date / format / identifiers / synopsis
 * immediately reflect in the library list row, the grid card, and the detail
 * panel (realizing the App 07 workflow, AAP §0.3.1 Workflow 5). This is NOT
 * durable persistence: nothing is written to `localStorage`, a database, or the
 * network, so a full reload resets everything (consistent with the
 * in-memory-only rule, AAP §0.8.2). **Save commits then closes; Apply commits and
 * keeps the modal open; Cancel closes WITHOUT committing** (in-progress edits are
 * discarded). Because the edited form state lives in the keyed INNER content but
 * the Apply/Save buttons live in the OUTER footer, the commit is bridged through
 * a ref (see the STATE ARCHITECTURE note below).
 *
 * STATE ARCHITECTURE — OPEN GATING + KEYED INNER CONTENT (no `useEffect` sync)
 * --------------------------------------------------------------------------
 * The file is a thin OUTER component ({@link MetadataDialog}, exported) plus a
 * KEYED INNER content component ({@link MetadataDialogContent}, NOT exported):
 *   • The outer reads `useModal()` and `useLibrary()`, derives `open`
 *     (`openModal === 'metadata'`) and resolves the target `book`
 *     (`targetBookId` → `currentBook` → `books[0]`), and always renders
 *     `ModalShell` (which returns `null` while closed, so this is safe).
 *   • The inner holds ALL local form state via `useState`, seeded from the
 *     `book` props AT MOUNT. Switching the target book (via the ← → step arrows,
 *     which call `openMetadata(prev/next id)`) changes the `key={book.id}` on the
 *     inner content, REMOUNTING it so every field re-seeds cleanly from the new
 *     book. This avoids a `useEffect` state-sync (and the uncontrolled→controlled
 *     warnings such sync invites) entirely — the remount IS the re-seed.
 *   • COMMIT-VIA-REF: the Apply/Save buttons live in the OUTER footer but the
 *     edited state lives in the INNER content, so the inner registers a
 *     `buildPatch()` getter (a closure over its freshest edited fields) into a
 *     ref owned by the outer (`registerBuildPatch`), clearing it on unmount. The
 *     outer's `commit()` reads that getter and writes the resulting
 *     `Partial<Book>` patch back through `updateBook`. This keeps the footer
 *     handler identities stable while always committing the inner's latest edits,
 *     and survives ← → stepping (the ref is re-registered by the remounted inner).
 *
 * `ModalShell` CONTRACT (geometry/scrim/shadow DELEGATED — never re-implemented)
 * --------------------------------------------------------------------------
 * With `variant="metadata"` the shell renders the centered 860×800 card
 * (`--color-surface-2`, 1px `--border-white-10`, `--radius-dialog`,
 * `--shadow-metadata`) over `--scrim-metadata`, a header band (the `title` +
 * the × close), a scrollable body (`children`), and an optional `footer` band
 * with a top hairline. ESC and backdrop-click call `onClose`; inner clicks stop
 * propagation; focus is trapped and restored. This component passes its content
 * and footer THROUGH the shell and re-implements NONE of that chrome — it only
 * adds the content-specific book-name subtitle + step arrows (Figma nodes
 * `9:13`/`9:14`/`9:16`, which the shell explicitly leaves to the consumer).
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / RADIUS / SHADOW / BORDER / TYPOGRAPHY value resolves to an
 * `@theme` token from `src/app/globals.css` — most via the shell and the four
 * sibling components, and the small amount of chrome this file owns (the header
 * strip + the two-column body wrapper) via Tailwind v4 token utilities
 * (`bg-surface-2`, `text-detail-title`, `text-text-secondary`) or the codebase's
 * canonical CSS-variable arbitrary value (`border-[var(--border-white-07)]`).
 * There are NO raw hex / rgba color literals. The only bare utilities are
 * LAYOUT values that carry no color information — Tailwind's standard spacing /
 * flex scale (`flex`, `items-start`, `gap-2`, `px-5`, `py-3`, `pe-5`, `pb-5`,
 * `pt-4`, `min-w-0`, `flex-1`, `shrink-0`, `truncate`) and the `z-10` / `sticky`
 * positioning keywords — all permitted.
 *
 * ICONS ARE GLYPHS, NOT ASSETS (AAP §0.3.4 — 0 binary assets)
 * --------------------------------------------------------------------------
 * The ← (prev) and → (next) step arrows are unicode glyphs rendered as `Button`
 * labels via the Inter font; the × close glyph lives inside `ModalShell`. No
 * image / SVG asset is created or imported.
 *
 * RESPONSIVE (AAP §0.9 — holds 1440→1280 with zero horizontal overflow)
 * --------------------------------------------------------------------------
 * The body is a two-column flex row whose right (fields) column is
 * `min-w-0 flex-1` so it shrinks rather than forcing overflow, and whose left
 * (cover) column is the sibling's fixed `w-55 shrink-0`. Because the modal is a
 * fixed 860px centered card (far below the 1280px floor) the body never reflows,
 * and the shell's scrollable body absorbs any vertical overflow.
 *
 * Design-parity reference only (NO code reuse / NO import from Python):
 * `src/calibre/gui2/metadata/single.py` — `MetadataSingleDialogBase` (the
 * single-book metadata dialog shell, its Next/Previous book stepping, and its
 * Ok/Cancel — here Save/Apply/Cancel — button box). Nothing is imported or
 * translated from the Python codebase; it informs structure/behavior only.
 *
 * @see src/components/primitives/ModalShell.tsx — the dialog scaffold (delegated chrome).
 * @see src/components/primitives/Button.tsx — the action primitive (footer + arrows).
 * @see src/components/metadata/MetadataCoverColumn.tsx — the left column.
 * @see src/components/metadata/MetadataFields.tsx — the right field grid.
 * @see src/components/metadata/TagChipEditor.tsx — the Tags chip editor (injected child).
 * @see src/components/metadata/IdentifierRows.tsx — the Identifiers editor (injected child).
 * @see src/state/ModalProvider.tsx — `useModal` (open-state; never navigates).
 * @see src/state/LibraryProvider.tsx — `useLibrary` (books + `updateBook` commit).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3 (App 07) / §0.4.2 — component & token mapping.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';

import { ModalShell } from '@/components/primitives/ModalShell';
import { Button } from '@/components/primitives/Button';
import {
  MetadataCoverColumn,
  type FormatEntry,
} from '@/components/metadata/MetadataCoverColumn';
import { MetadataFields } from '@/components/metadata/MetadataFields';
import { TagChipEditor } from '@/components/metadata/TagChipEditor';
import {
  IdentifierRows,
  type IdentifierRow,
} from '@/components/metadata/IdentifierRows';
import { useModal } from '@/state/ModalProvider';
import { useLibrary } from '@/state/LibraryProvider';
import type { Book, FormatKind } from '@/types';

/* ==========================================================================
 * Module-scope constants & helpers (stable identities; no per-render churn).
 * ======================================================================== */

/**
 * The canonical three-format ordering used by {@link MetadataDialogContent}'s
 * `addFormat` handler. "+ Add format" appends the FIRST format not already
 * present (so the `FormatEntry.format` value — used by `MetadataCoverColumn` as
 * each row's React key — stays unique and never collides). Declared `readonly`
 * at module scope so the same array identity is reused across renders.
 */
const FORMAT_SEQUENCE: readonly FormatKind[] = ['EPUB', 'MOBI', 'PDF'];

/**
 * Mock byte size assigned to a newly-added (UI-only) format row. There is no
 * real file behind it; this is a plausible ~1.5 MB placeholder rendered through
 * the cover column's `formatFileSize` helper as e.g. "1.4 MB".
 */
const MOCK_ADDED_FORMAT_SIZE = 1_500_000;

/** The ← (prev) step-arrow glyph — U+2190 LEFTWARDS ARROW (Inter, not an asset). */
const PREV_GLYPH = '\u2190';
/** The → (next) step-arrow glyph — U+2192 RIGHTWARDS ARROW (Inter, not an asset). */
const NEXT_GLYPH = '\u2192';

/**
 * Leading-article matcher for {@link deriveSort} — captures a leading "The",
 * "A", or "An" (case-insensitive) and the remainder of the string.
 */
const LEADING_ARTICLE = /^(the|a|an)\s+(.*)$/i;

/**
 * Derive a "sort-as" key from a display string (mock-only fields Title Sort /
 * Author Sort, which are NOT part of the `Book` contract — see the state seeding
 * in {@link MetadataDialogContent}).
 *
 * Mirrors the canonical library "sort name" transform: a leading article
 * ("The"/"A"/"An") is moved to the end after a comma — e.g. `"The Martian"` →
 * `"Martian, The"`, `"A Fire Upon the Deep"` → `"Fire Upon the Deep, A"` — and
 * any input without a leading article is returned trimmed and unchanged (e.g.
 * `"Frank Herbert"` → `"Frank Herbert"`). This is a pure, deterministic,
 * SSR-safe string function (no `Date`/`Math.random`/`window`), so seeding state
 * with it never risks a hydration mismatch. `@/lib/format` is intentionally NOT
 * a dependency of this file, so this small helper is defined locally.
 *
 * @param value - the display string (a title or an author name).
 * @returns the derived sort-as key.
 */
function deriveSort(value: string): string {
  const trimmed = value.trim();
  const match = LEADING_ARTICLE.exec(trimmed);
  if (match !== null) {
    // match[2] = remainder, match[1] = the original-cased article.
    return `${match[2]}, ${match[1]}`;
  }
  return trimmed;
}

/**
 * Generate a stable, unique id for a freshly-added identifier row.
 *
 * Used ONLY inside the "+ Add ID" event handler (never during render or initial
 * state), so its non-determinism is irrelevant to SSR/hydration — the server
 * never executes it. Prefers the Web Crypto `randomUUID()` when available and
 * falls back to a timestamp+random composite for older runtimes. The returned
 * id is consumed solely as a React list key by `IdentifierRows`.
 *
 * @returns a unique row id string.
 */
function makeIdentifierId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ==========================================================================
 * Token-backed class constants (zero hardcoded color/radius/typography values;
 * only layout / positioning utilities appear as bare literals).
 * ======================================================================== */

/**
 * The content header strip rendered at the TOP of the shell's scrollable body:
 * the book-name subtitle (left) + the ← → step arrows (right). It is `sticky
 * top-0` within the scroll container with the modal's own `bg-surface-2` fill
 * (so content scrolling beneath it is masked) and a 1px `--border-white-07`
 * bottom hairline — reproducing the modal's banded chrome rhythm so the
 * subtitle + arrows read as part of the fixed header rather than scrolling body
 * content. `z-10` keeps it above the scrolling fields. (`ModalShell` owns the
 * true top header band with the "Edit Metadata" title and the × close.)
 */
const HEADER_STRIP_CLASSES =
  'sticky top-0 z-10 flex items-center gap-4 ' +
  'bg-surface-2 border-b border-[var(--border-white-07)] px-5 py-3';

/**
 * The book-name subtitle: the `text-detail-title` role (Inter 600 / 15px) in the
 * secondary text token, clearly subordinate to the shell's 20px primary heading.
 * `min-w-0 flex-1 truncate` lets a long book title ellipsize instead of pushing
 * the step arrows off the strip.
 */
const SUBTITLE_CLASSES =
  'min-w-0 flex-1 truncate text-detail-title text-text-secondary';

/** The step-arrow cluster — a right-aligned, non-shrinking row of two glyph buttons. */
const STEP_ARROWS_CLASSES = 'flex shrink-0 items-center gap-2';

/**
 * The two-column body: the fixed cover column (left) beside the fluid field grid
 * (right), top-aligned. No left padding — the `MetadataCoverColumn`'s own `px-5`
 * supplies the 20px left inset; `pe-5` gives the fields a matching right inset
 * and `pb-5` the bottom inset. `gap-2` separates the columns (the cover column's
 * internal right padding supplies the remainder of the gutter). The exact gutter
 * is fine-tuned against `compare_screenshot_with_figma`.
 */
const BODY_CLASSES = 'flex items-start gap-2 pe-5 pb-5';

/**
 * The right (fields) column wrapper: `min-w-0 flex-1` so it absorbs the
 * remaining width and can shrink below its content's intrinsic width (the
 * critical 1440→1280 overflow guard), with `pt-4` matching the cover column's
 * 16px top inset so both columns top-align.
 */
const FIELDS_COLUMN_CLASSES = 'min-w-0 flex-1 pt-4';

/* ==========================================================================
 * Inner content — MetadataDialogContent (NOT exported).
 * Owns ALL local form state, seeded from `book` at mount. The outer component
 * remounts it via `key={book.id}` whenever the target book changes, so every
 * field re-seeds from the new book WITHOUT a `useEffect` state-sync.
 * ======================================================================== */

/** Props for {@link MetadataDialogContent}. */
interface MetadataDialogContentProps {
  /**
   * The fully-resolved target book whose metadata is being edited. Guaranteed
   * non-null by the outer component (which renders this content only when a book
   * resolves) and used both to seed local state and as the live source for the
   * header subtitle and the cover column.
   */
  readonly book: Book;
  /**
   * The full library list — used to compute the previous/next book ids for the
   * ← → step arrows (wrap-around). Read-only here; never mutated.
   */
  readonly books: Book[];
  /**
   * Steps the modal to another book WITHOUT changing the route — bound to
   * `ModalProvider`'s `openMetadata(bookId)`. Re-targeting the modal updates
   * `targetBookId`, which flips the outer component's `key={book.id}` and
   * remounts this content so the form re-seeds from the newly-targeted book.
   */
  readonly onStep: (bookId: string) => void;
  /**
   * Registers (or, with `null`, clears) this content's `buildPatch()` getter
   * into the OUTER component's ref so the footer's Apply/Save can read the
   * freshest edited fields and commit them via `updateBook`. The inner calls
   * this on mount/whenever `buildPatch` changes and clears it on unmount — see
   * the COMMIT-VIA-REF note in the file header.
   */
  readonly registerBuildPatch: (build: (() => Partial<Book>) | null) => void;
}

/**
 * The scrollable inner content of the metadata modal: the sticky header strip
 * (book-name subtitle + ← → step arrows), the two-column body (cover column +
 * field grid with Tags/Identifiers injected), all backed by local form state.
 *
 * All state is seeded ONCE at mount from `book`; the parent's `key={book.id}`
 * remount handles re-seeding on book change (no state-sync `useEffect`).
 * Array/derived fields use lazy `useState` initializers so the seed work runs
 * only on mount. (A separate `useEffect` registers the commit getter with the
 * outer footer — see the COMMIT-VIA-REF note — but never syncs form state.)
 *
 * @param props - {@link MetadataDialogContentProps}.
 * @returns the metadata modal's header + two-column body.
 */
function MetadataDialogContent({
  book,
  books,
  onStep,
  registerBuildPatch,
}: MetadataDialogContentProps): JSX.Element {
  /* ------------------------------------------------------------------ *
   * Scalar fields. Fields that exist on the `Book` contract seed from it
   * directly; mock-only fields (Title Sort, Author Sort, Series Index,
   * Publisher, Language) seed from a derived value or a plausible default,
   * since the prototype's data model does not carry them.
   * ------------------------------------------------------------------ */
  const [title, setTitle] = useState<string>(book.title);
  const [author, setAuthor] = useState<string>(book.author);
  // Mock-only "sort-as" fields, derived deterministically from title/author.
  const [titleSort, setTitleSort] = useState<string>(() => deriveSort(book.title));
  const [authorSort, setAuthorSort] = useState<string>(() => deriveSort(book.author));
  const [series, setSeries] = useState<string>(book.series ?? '');
  const [seriesIndex, setSeriesIndex] = useState<string>('1'); // mock-only field
  const [publisher, setPublisher] = useState<string>('Tor Books'); // mock-only placeholder
  // `publicationDate` maps to the `Book.date` ISO-8601 string directly.
  const [publicationDate, setPublicationDate] = useState<string>(book.date);
  const [language, setLanguage] = useState<string>('English'); // mock-only field
  // `rating` is the SINGLE source of truth shared by the cover column's editable
  // StarRating and the right column's rating read-back.
  const [rating, setRating] = useState<number>(book.rating);
  const [synopsis, setSynopsis] = useState<string>(book.synopsis);

  /* ------------------------------------------------------------------ *
   * Collection fields (lazy initializers — seed work runs once at mount).
   * ------------------------------------------------------------------ */
  const [tags, setTags] = useState<string[]>(() => [...book.tags]);
  const [formats, setFormats] = useState<FormatEntry[]>(() => [
    // `Book.format` is a plain string in the data model but is constrained to the
    // FormatKind union by the dataset (EPUB/MOBI/PDF), so the cast is safe.
    { format: book.format as FormatKind, sizeBytes: book.sizeBytes },
  ]);
  const [identifiers, setIdentifiers] = useState<IdentifierRow[]>(() =>
    Object.entries(book.identifiers).map(([key, value], index) => ({
      id: `${book.id}-id-${index}`,
      key,
      value,
    })),
  );

  /* ------------------------------------------------------------------ *
   * Tag handlers — add (case-insensitive de-dup) / remove.
   * ------------------------------------------------------------------ */
  const addTag = (tag: string): void => {
    setTags((prev) =>
      prev.some((existing) => existing.toLowerCase() === tag.toLowerCase())
        ? prev
        : [...prev, tag],
    );
  };
  const removeTag = (tag: string): void => {
    setTags((prev) => prev.filter((existing) => existing !== tag));
  };

  /* ------------------------------------------------------------------ *
   * Identifier handlers — edit key/value by id, remove by id, append blank.
   * ------------------------------------------------------------------ */
  const changeIdKey = (id: string, key: string): void => {
    setIdentifiers((prev) =>
      prev.map((row) => (row.id === id ? { ...row, key } : row)),
    );
  };
  const changeIdValue = (id: string, value: string): void => {
    setIdentifiers((prev) =>
      prev.map((row) => (row.id === id ? { ...row, value } : row)),
    );
  };
  const removeIdRow = (id: string): void => {
    setIdentifiers((prev) => prev.filter((row) => row.id !== id));
  };
  const addIdRow = (): void => {
    setIdentifiers((prev) => [
      ...prev,
      { id: makeIdentifierId(), key: '', value: '' },
    ]);
  };

  /* ------------------------------------------------------------------ *
   * Format handlers — remove by format; add the next unused FormatKind
   * (UI-only; keeps each `FormatEntry.format` unique for stable keys).
   * ------------------------------------------------------------------ */
  const removeFormat = (format: FormatKind): void => {
    setFormats((prev) => prev.filter((entry) => entry.format !== format));
  };
  const addFormat = (): void => {
    setFormats((prev) => {
      const present = new Set<FormatKind>(prev.map((entry) => entry.format));
      const next = FORMAT_SEQUENCE.find((candidate) => !present.has(candidate));
      if (next === undefined) {
        return prev; // all formats already present — nothing to add.
      }
      return [...prev, { format: next, sizeBytes: MOCK_ADDED_FORMAT_SIZE }];
    });
  };

  /* ------------------------------------------------------------------ *
   * Commit bridge — build a `Partial<Book>` patch from the CURRENT edited
   * fields and register it with the outer footer (Apply/Save). Only fields that
   * exist on the `Book` contract are included; the mock-only fields (Title Sort,
   * Author Sort, Series Index, Publisher, Language) are intentionally NOT
   * committed. `series` collapses an empty string back to `undefined` (the
   * optional contract marker). The format list's PRIMARY entry maps to the
   * single `Book.format` / `Book.sizeBytes` (falling back to the book's existing
   * values if the list was emptied), and the identifier rows fold back into the
   * `Record<string,string>` map, dropping rows with a blank key.
   * ------------------------------------------------------------------ */
  const buildPatch = useCallback((): Partial<Book> => {
    const trimmedSeries = series.trim();
    const primaryFormat = formats[0];
    return {
      title: title.trim(),
      author: author.trim(),
      series: trimmedSeries === '' ? undefined : trimmedSeries,
      date: publicationDate,
      rating,
      tags: [...tags],
      format: primaryFormat?.format ?? book.format,
      sizeBytes: primaryFormat?.sizeBytes ?? book.sizeBytes,
      identifiers: Object.fromEntries(
        identifiers
          .filter((row) => row.key.trim() !== '')
          .map((row) => [row.key.trim(), row.value]),
      ),
      synopsis,
    };
  }, [
    title,
    author,
    series,
    publicationDate,
    rating,
    tags,
    formats,
    identifiers,
    synopsis,
    book.format,
    book.sizeBytes,
  ]);

  // Register the latest `buildPatch` getter with the outer component (and clear
  // it on unmount). Runs whenever `buildPatch` changes — i.e. whenever any edited
  // field changes — so the footer always commits the freshest edits.
  useEffect(() => {
    registerBuildPatch(buildPatch);
    return () => registerBuildPatch(null);
  }, [registerBuildPatch, buildPatch]);

  /* ------------------------------------------------------------------ *
   * Prev/next stepping — wrap-around relative to the book's index in `books`.
   * ------------------------------------------------------------------ */
  const count = books.length;
  const foundIndex = books.findIndex((candidate) => candidate.id === book.id);
  const currentIndex = foundIndex >= 0 ? foundIndex : 0;
  const prevId = count > 0 ? books[(currentIndex - 1 + count) % count].id : book.id;
  const nextId = count > 0 ? books[(currentIndex + 1) % count].id : book.id;

  return (
    <>
      {/* Header strip: book-name subtitle (left) + ← → step arrows (right). */}
      <div className={HEADER_STRIP_CLASSES}>
        <span className={SUBTITLE_CLASSES}>{book.title}</span>
        <div className={STEP_ARROWS_CLASSES}>
          <Button
            label={PREV_GLYPH}
            variant="secondary"
            aria-label="Previous book"
            onClick={() => onStep(prevId)}
          />
          <Button
            label={NEXT_GLYPH}
            variant="secondary"
            aria-label="Next book"
            onClick={() => onStep(nextId)}
          />
        </div>
      </div>

      {/* Two-column body: cover column (left) + field grid (right). */}
      <div className={BODY_CLASSES}>
        <MetadataCoverColumn
          book={book}
          rating={rating}
          onRatingChange={setRating}
          formats={formats}
          onRemoveFormat={removeFormat}
          onAddFormat={addFormat}
        />
        <div className={FIELDS_COLUMN_CLASSES}>
          <MetadataFields
            title={title}
            onTitleChange={setTitle}
            author={author}
            onAuthorChange={setAuthor}
            titleSort={titleSort}
            onTitleSortChange={setTitleSort}
            authorSort={authorSort}
            onAuthorSortChange={setAuthorSort}
            series={series}
            onSeriesChange={setSeries}
            seriesIndex={seriesIndex}
            onSeriesIndexChange={setSeriesIndex}
            publisher={publisher}
            onPublisherChange={setPublisher}
            publicationDate={publicationDate}
            onPublicationDateChange={setPublicationDate}
            language={language}
            onLanguageChange={setLanguage}
            rating={rating}
            onRatingChange={setRating}
            synopsis={synopsis}
            onSynopsisChange={setSynopsis}
          >
            {/* Injected as MetadataFields' children, in Figma order:
                fields → Tags → Identifiers → Synopsis. */}
            <TagChipEditor
              tags={tags}
              onAddTag={addTag}
              onRemoveTag={removeTag}
            />
            <IdentifierRows
              rows={identifiers}
              onChangeKey={changeIdKey}
              onChangeValue={changeIdValue}
              onRemoveRow={removeIdRow}
              onAddRow={addIdRow}
            />
          </MetadataFields>
        </div>
      </div>
    </>
  );
}

/* ==========================================================================
 * Outer composer — MetadataDialog (exported).
 * Reads open-state + library, resolves the target book, and wires the shell.
 * ======================================================================== */

/**
 * The App 07 Metadata Editor modal.
 *
 * Subscribes to `ModalProvider` (open-state) and `LibraryProvider` (books),
 * derives whether the metadata modal is open (`openModal === 'metadata'`),
 * resolves the target book (`targetBookId` → `currentBook` → `books[0]`), and
 * renders `ModalShell` with the Cancel · Apply · Save footer and the keyed
 * {@link MetadataDialogContent}. `ModalShell` returns `null` while closed, so it
 * is always rendered unconditionally and gated purely by its `open` prop.
 *
 * Navigation note: this component performs NO routing — open and close flow
 * exclusively through `useModal()`. The ← → arrows re-target the modal via
 * `openMetadata(id)` (still no route change), and Cancel/Save/×/ESC/backdrop all
 * resolve to `close()`.
 *
 * @returns the metadata modal (or, when closed, the shell's `null`).
 */
export function MetadataDialog(): JSX.Element {
  const { openModal, targetBookId, close, openMetadata } = useModal();
  const { books, currentBook, updateBook } = useLibrary();

  // Open strictly when the metadata modal is the active overlay.
  const open = openModal === 'metadata';

  // Resolve the target book: explicit target → library's current → first book.
  // May still be undefined if the library is somehow empty; guarded below.
  const book = books.find((candidate) => candidate.id === targetBookId)
    ?? currentBook
    ?? books[0];

  // Commit-via-ref bridge: the edited form state lives in the keyed INNER
  // content, but the Apply/Save buttons live here in the OUTER footer. The inner
  // registers a `buildPatch()` getter into this ref (and clears it on unmount);
  // `commit()` reads the latest getter and writes the patch back into the shared
  // library via `updateBook`. `registerBuildPatch` is identity-stable (empty deps)
  // so the inner's registration effect only re-runs when the edited state changes.
  const buildPatchRef = useRef<(() => Partial<Book>) | null>(null);
  const registerBuildPatch = useCallback(
    (build: (() => Partial<Book>) | null): void => {
      buildPatchRef.current = build;
    },
    [],
  );

  // Commit the inner's current edits to the target book in the shared (in-memory)
  // library. A guarded no-op when there is no resolvable book or the inner has
  // not registered its getter yet.
  const commit = useCallback((): void => {
    const build = buildPatchRef.current;
    if (build === null || book === undefined) {
      return;
    }
    updateBook(book.id, build());
  }, [updateBook, book]);

  // Save commits then closes; Apply (wired below) commits and stays open.
  const handleSave = useCallback((): void => {
    commit();
    close();
  }, [commit, close]);

  // Footer: Cancel (dismiss WITHOUT committing — edits discarded) · Apply (commit,
  // stay open) · Save (commit, then dismiss). The shell's footer band is
  // right-aligned with a gap, so these render as a trailing button cluster. Save
  // is `variant="primary"` (the accent gradient CTA); Cancel/Apply are secondary.
  const footer = (
    <>
      <Button label="Cancel" variant="secondary" onClick={close} />
      <Button label="Apply" variant="secondary" onClick={commit} />
      <Button label="Save" variant="primary" onClick={handleSave} />
    </>
  );

  return (
    <ModalShell
      open={open && Boolean(book)}
      title="Edit Metadata"
      variant="metadata"
      onClose={close}
      footer={footer}
    >
      {book ? (
        <MetadataDialogContent
          // Remount on book change so all local form state re-seeds cleanly.
          key={book.id}
          book={book}
          books={books}
          onStep={openMetadata}
          registerBuildPatch={registerBuildPatch}
        />
      ) : null}
    </ModalShell>
  );
}

export default MetadataDialog;
