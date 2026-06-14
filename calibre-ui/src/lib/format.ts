/**
 * format — pure, deterministic display formatters for the Calibre-UI prototype.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * WHAT THIS FILE IS
 * ──────────────────────────────────────────────────────────────────────────
 * A zero-dependency leaf module of pure display formatters that turn raw
 * `Book` field values into human-readable display strings / structures. These
 * helpers are consumed app-wide — by the library list table (App 01), the book
 * detail panel, the cover-grid cards (App 02), the metadata modal (App 07), and
 * anywhere a size, date, or rating is surfaced — via the `@/lib/format` path
 * alias (`tsconfig.json` → `"@/*": ["./src/*"]`).
 *
 * The three primary formatters map 1:1 to the raw `Book` fields they format:
 *   • `sizeBytes: number`            → `formatFileSize`  → e.g. "1.5 MB"
 *   • `date: string` (ISO 8601)      → `formatDate`      → e.g. "Aug 1, 1965"
 *   • `rating: number` (0–5, ½ step) → `getStarFill`     → length-5 fill array
 * A small `formatRating` convenience returns the numeric rating label ("4.5").
 *
 * ──────────────────────────────────────────────────────────────────────────
 * HARD CONSTRAINTS
 * ──────────────────────────────────────────────────────────────────────────
 * • PURE / PRIMITIVES IN → PRIMITIVES OUT. Every function takes plain
 *   primitives (`number` / `string`) and returns a `string` or a small array.
 *   No side effects, no I/O, no network, no file access, no global mutation.
 * • ZERO IMPORTS. This is a pure leaf with no dependencies — it imports nothing
 *   (not React, not third-party packages, not `@/types`, not `@/theme`). The
 *   relevant `Book` field types are simply `number` / `string`, so the helpers
 *   operate on primitives directly. This keeps the module trivially
 *   tree-shakeable and testable.
 * • NO `'use client'` DIRECTIVE. These are framework-agnostic pure functions,
 *   safe to call from both Server and Client Components.
 * • SSR / HYDRATION DETERMINISM (correctness gate). Output MUST be identical on
 *   the server and the client for the same input, or React raises
 *   hydration-mismatch console errors (violating the "zero console errors"
 *   gate). Accordingly, `formatDate` pins a fixed locale (`'en-US'`) and a
 *   fixed `timeZone: 'UTC'` in a module-level `Intl.DateTimeFormat`; it never
 *   relies on the ambient machine locale/timezone. No `Math.random()`, no
 *   `Date.now()`, and no `new Date()` without an explicit input string appears
 *   anywhere in this module.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * ──────────────────────────────────────────────────────────────────────────
 * The display behavior mirrors, for visual/structural parity only, Calibre's
 * desktop client library model: `src/calibre/gui2/library/models.py`
 * (`BooksModel`). There, the "Size" column renders via `human_readable(size)`
 * (guarding non-numbers to 0), the "Date" column renders via
 * `strftime('%d %b %Y', …)`, and ratings are validated with `allow_half_stars`
 * (i.e. 0.5 steps). NO Python/Qt code is imported, translated, or executed; the
 * Calibre tree is a read-only conceptual reference. Only the *display behavior*
 * is reproduced here in idiomatic TypeScript (the prototype uses US date
 * ordering — "Aug 1, 1965" — rather than Calibre's day-first format).
 *
 * @see src/calibre/gui2/library/models.py — Calibre `BooksModel` (reference only).
 */

/**
 * Format a raw byte count into a compact, human-readable size string.
 *
 * Uses binary (1024) steps with B / KB / MB / GB / TB labels to match
 * Calibre's library "Size" column convention. The result carries one decimal
 * place while the scaled value is below 10 (e.g. `"1.5 MB"`) and a whole number
 * at or above 10 (e.g. `"12 MB"`), keeping compact columns tidy. Sub-1024
 * counts render as whole bytes (`"512 B"`). Non-finite or negative input is
 * defensively coerced to `"0 B"` (never throws). Fully deterministic.
 *
 * @param bytes - Raw file size in bytes (e.g. `Book.sizeBytes`).
 * @returns A display size string such as `"512 B"`, `"725 KB"`, or `"1.5 MB"`.
 *
 * @example
 * formatFileSize(1536000); // "1.5 MB"
 * formatFileSize(1073741824); // "1 GB"
 */
export function formatFileSize(bytes: number): string {
  // Defensive guard: NaN, Infinity, -Infinity, and negative sizes collapse to
  // a stable, sortable zero rather than producing "NaN B" in the UI.
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '0 B';
  }

  // Below one kibibyte we report whole bytes with no scaling.
  if (bytes < 1024) {
    return `${Math.round(bytes)} B`;
  }

  const units = ['KB', 'MB', 'GB', 'TB'] as const;
  let value = bytes / 1024;
  let unitIndex = 0;

  // Step up through the unit ladder until the value is below 1024 or we have
  // reached the largest supported unit (TB).
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  // One decimal place when the scaled value is small (< 10) for precision
  // (e.g. "1.5 MB"); a whole number otherwise to keep columns compact
  // (e.g. "12 MB").
  const rounded = value < 10 ? Math.round(value * 10) / 10 : Math.round(value);

  return `${rounded} ${units[unitIndex]}`;
}

/**
 * Module-level singleton date formatter.
 *
 * Created exactly once at module scope and reused on every `formatDate` call —
 * constructing an `Intl.DateTimeFormat` is comparatively expensive, so a cached
 * instance avoids per-call cost. The fixed `'en-US'` locale and explicit
 * `timeZone: 'UTC'` are the SSR/hydration determinism guarantee: server and
 * client always produce byte-identical output for the same input.
 */
const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

/**
 * Format an ISO-8601 date string into a human-readable display date.
 *
 * Converts a value like `"1965-08-01"` into `"Aug 1, 1965"`. Date-only ISO
 * strings are interpreted as UTC midnight by the runtime, and the formatter is
 * pinned to UTC, so the rendered day never drifts across timezones. If the
 * input cannot be parsed into a valid date, the original string is returned
 * unchanged (defensive; never throws). Deterministic across server and client.
 *
 * @param iso - An ISO-8601 date string (e.g. `Book.date`, `"1965-08-01"`).
 * @returns A display date such as `"Aug 1, 1965"`, or the original input if
 *          it is not a parseable date.
 *
 * @example
 * formatDate('1984-06-08'); // "Jun 8, 1984"
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);

  // Guard unparseable input: return the raw string rather than "Invalid Date".
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return DATE_FORMATTER.format(date);
}

/**
 * The fill state of a single star in a 5-star rating control.
 *
 * Exported so consumers (notably the `StarRating` primitive) can type their
 * props and internal state against the exact same union this module emits.
 */
export type StarFill = 'full' | 'half' | 'empty';

/**
 * Convert a 0–5 rating (in 0.5 increments) into a fixed length-5 array of star
 * fill states, consumed by the `StarRating` primitive to render amber
 * (`#F59E0B`, surfaced via the `--color-star` token in that primitive) full,
 * half, and empty stars.
 *
 * Out-of-range input is clamped to `[0, 5]` and non-finite input (e.g. `NaN`)
 * is treated as `0`, so the function ALWAYS returns exactly five elements for
 * any numeric input. Deterministic; no side effects.
 *
 * @param rating - A rating from 0 to 5, ideally in 0.5 steps (`Book.rating`).
 * @returns A length-5 array of `StarFill` values, index 0 = first star.
 *
 * @example
 * getStarFill(4.5); // ['full','full','full','full','half']
 * getStarFill(3);   // ['full','full','full','empty','empty']
 */
export function getStarFill(rating: number): StarFill[] {
  // Clamp into [0, 5]; coerce non-finite values (NaN/Infinity) to 0 so the
  // length-5 invariant and determinism hold for any input.
  const clamped = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));

  const stars: StarFill[] = [];
  for (let position = 1; position <= 5; position += 1) {
    if (clamped >= position) {
      stars.push('full');
    } else if (clamped >= position - 0.5) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }

  return stars;
}

/**
 * Format a 0–5 rating as a one-decimal numeric label (e.g. `"4.5"`).
 *
 * A small convenience for places that show the rating value as text alongside
 * the stars (e.g. the metadata editor and detail panel). Input is clamped to
 * `[0, 5]` and non-finite values are treated as `0`, then rendered with a
 * single decimal place for a consistent, deterministic label across all
 * half-step values (`"0.0"` … `"5.0"`).
 *
 * @param rating - A rating from 0 to 5, ideally in 0.5 steps (`Book.rating`).
 * @returns The rating as a fixed one-decimal string (e.g. `"4.5"`, `"3.0"`).
 *
 * @example
 * formatRating(4.5); // "4.5"
 * formatRating(3);   // "3.0"
 */
export function formatRating(rating: number): string {
  const clamped = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));
  return clamped.toFixed(1);
}
