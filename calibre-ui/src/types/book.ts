/**
 * Book — the canonical, app-wide data contract for the Calibre-UI prototype.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * AUTHORITATIVE CONTRACT (AAP §0.1.2) — DO NOT ALTER
 * ──────────────────────────────────────────────────────────────────────────
 * This interface is the single most foundational type in the `calibre-ui/`
 * application. It is reproduced VERBATIM from the Agent Action Plan §0.1.2 and
 * is a hard, non-negotiable contract: no field may be added, removed, renamed,
 * meaningfully reordered, or re-typed. Every `src/` module — `data`, `lib`,
 * `state`, `components`, and `app` — consumes this type, either directly via
 * `@/types/book` or through the `@/types` barrel re-export.
 *
 * UI-ONLY / MOCK-DATA MODEL
 * `Book` models **in-memory, hardcoded mock data** held in React state for a
 * UI-only prototype. There is NO backend, NO database, NO API, and NO real
 * file I/O behind it — this is NOT a database/ORM schema. The fixed dataset of
 * 15 science-fiction titles that populates it lives in `@/data/books`.
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * The field set mirrors, for visual/structural parity only, the column model of
 * Calibre's desktop client: `src/calibre/gui2/library/models.py` (`BooksModel`).
 * NO Python/Qt code is imported, translated, executed, or otherwise reused; the
 * Calibre tree is a read-only conceptual reference. The conceptual mapping is:
 *
 *   Calibre `BooksModel` column                              →  Book field
 *   ───────────────────────────────────────────────────────────────────────
 *   title                                                    →  title
 *   authors                                                  →  author
 *   timestamp (a Date)                                       →  date  (ISO 8601 string)
 *   rating (validated by `allow_half_stars`, i.e. 0.5 steps) →  rating
 *   tags                                                     →  tags
 *   series (+ series_index)                                  →  series? (optional)
 *   formats                                                  →  format
 *   size                                                     →  sizeBytes
 *   comments                                                 →  synopsis
 *   id                                                       →  id
 *   identifiers                                              →  identifiers
 *
 * Calibre's additional columns (publisher, pubdate, languages, pages, …) are
 * DELIBERATELY NOT part of this contract — the prototype intentionally models a
 * focused 12-field subset.
 *
 * SCOPE
 * This module declares ONLY the `Book` interface. Cross-cutting types (e.g. the
 * `FormatKind = 'EPUB' | 'MOBI' | 'PDF'` union used by the FormatBadge
 * primitive, view modes, etc.) live in the `@/types` barrel (`index.ts`), NOT
 * here. This file is a pure, zero-dependency leaf: it performs no imports,
 * carries no client-component directive, declares no runtime values, and emits
 * no runtime JavaScript.
 *
 * @see Agent Action Plan §0.1.2 — the authoritative 12-field set.
 * @see src/calibre/gui2/library/models.py — Calibre `BooksModel` (reference only).
 */
export interface Book {
  /** Stable, unique identifier for the book (mock primary key, e.g. `"dune"`). */
  id: string;

  /** Display title of the book (e.g. `"Dune"`). */
  title: string;

  /**
   * Primary author rendered as a single display string (e.g. `"Frank Herbert"`).
   * Mirrors Calibre's `authors` column flattened to one display value.
   */
  author: string;

  /**
   * Optional series the book belongs to (e.g. `"The Expanse"`). Omitted entirely
   * for standalone titles — the `?` optional marker is part of the contract and
   * MUST be preserved.
   */
  series?: string;

  /**
   * Publication / date-added value as an **ISO 8601 string** (e.g.
   * `"1965-08-01"`). Intentionally a `string`, NOT a `Date` object and NOT a
   * numeric timestamp; `@/lib/format` formats it for display.
   */
  date: string;

  /**
   * Star rating as a **number** from 0 to 5 in 0.5 increments (half-stars
   * allowed — mirrors Calibre's `allow_half_stars`). Kept as `number`, never a
   * string or a union of numeric literals, per the verbatim contract.
   */
  rating: number;

  /** Free-form tags / categories applied to the book (e.g. `["Sci-Fi", "Classic"]`). */
  tags: string[];

  /**
   * Primary file format as a **plain `string`** (e.g. `"EPUB"`, `"MOBI"`,
   * `"PDF"`). This MUST remain `string` per the verbatim contract — the narrowed
   * `FormatKind = 'EPUB' | 'MOBI' | 'PDF'` union consumed by the FormatBadge
   * primitive lives in the `@/types` barrel, NOT on `Book.format`.
   */
  format: string;

  /**
   * File size in **raw bytes** as a `number`. `@/lib/format` converts it to a
   * human-readable size (KB/MB) for display.
   */
  sizeBytes: number;

  /**
   * Cover image source string. This is ALWAYS a **generated placeholder**
   * produced at runtime by `@/lib/covers` (a deterministic, color-tinted,
   * title-overlay image derived from the book's identity). It is NEVER real,
   * copyrighted cover art — embedding real cover art is expressly prohibited.
   */
  coverUrl: string;

  /**
   * External identifier map keyed by scheme, with string values
   * (e.g. `{ isbn: "978-0441013593", goodreads: "44767458" }`).
   */
  identifiers: Record<string, string>;

  /** Long-form description / blurb for the book (mirrors Calibre's `comments`). */
  synopsis: string;
}
