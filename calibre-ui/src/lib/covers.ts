/**
 * covers — deterministic, generated placeholder book-cover art for the
 * Calibre-UI prototype.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * WHAT THIS FILE IS
 * ──────────────────────────────────────────────────────────────────────────
 * A pure, zero-side-effect module that turns a {@link Book}'s identity into a
 * self-contained, tinted SVG cover with a typographic title overlay, returned
 * as a `data:image/svg+xml,…` URI. The result is the value used for
 * `Book.coverUrl` (seeded in `@/data/books`) and the tint palette consumed by
 * the `primitives/BookCoverPlaceholder` component, the App01 library-table
 * cover thumb, the App01 detail-panel cover (Figma node 2:347), the App02
 * cover-grid cards (Figma node 3:82), and the App07 metadata-modal cover.
 *
 * Consumed via the `@/lib/covers` path alias (`tsconfig.json` → `"@/*":
 * ["./src/*"]`):
 *   import { generateCoverDataUri, getCoverPalette } from '@/lib/covers';
 *
 * ──────────────────────────────────────────────────────────────────────────
 * HARD CONSTRAINTS (AAP §0.1.2 / §0.8.2 / §0.9 — non-negotiable)
 * ──────────────────────────────────────────────────────────────────────────
 * • NEVER REAL COVER ART. The output is 100% generated — a tinted gradient
 *   rectangle with an overlaid title (and author) in Inter Bold white. This
 *   module embeds NO external image URLs, performs NO fetching, and references
 *   NO real or copyrighted artwork. Embedding real cover art is expressly
 *   prohibited; every cover the app shows originates here.
 * • DETERMINISTIC — same input ⇒ byte-identical output. A given book ALWAYS
 *   yields the identical palette and the identical data-URI on every call, on
 *   every render, on the server and on the client. This keeps covers stable
 *   across renders and across List ↔ Grid navigation and prevents React
 *   hydration-mismatch console errors (the "zero console errors" gate).
 *   Accordingly there is NO `Math.random()`, NO `Date.now()`, and NO
 *   time/locale/environment-dependent value anywhere in this module; palette
 *   selection is driven by a PURE hash of the book's `id`/`title`.
 * • PURE / SSR-SAFE. These are pure functions with no I/O, no file system, no
 *   network, and no DOM dependency (no `document`, `window`, `canvas`). Cover
 *   markup is generated as a plain string, so the helpers run unchanged inside
 *   React Server Components. This module carries NO `'use client'` directive.
 * • EXACT-TOKEN FIDELITY — ZERO COLOR LITERALS IN THIS FILE. Every color emitted
 *   is a named import from `@/theme/tokens`: the gradient stops come from the
 *   sanctioned `coverTints` palette and the title overlay uses
 *   `colors.textPrimary`. This module declares NO bare color literal of its own;
 *   the only bare literals used are non-color values (coordinates, opacity,
 *   font sizes, and the font-family stack).
 *
 * ──────────────────────────────────────────────────────────────────────────
 * TOKEN BOUNDARY (theme contract)
 * ──────────────────────────────────────────────────────────────────────────
 * The sibling `@/theme/tokens` module is the single home for every color value
 * in the app. It excludes per-book cover tints from the CSS-side `@theme` token
 * set (generated-cover art is data, never application chrome), but it DOES own
 * those tints as the sanctioned, generated-cover-only `coverTints` data export.
 * This file therefore imports `coverTints` (the deep indigo / deep plum / navy /
 * steel-navy / accent-indigo / deep-forest pairs) plus `colors.textPrimary`
 * (`#F1F5FF`, the title color) and `colors.accentIndigo` (`#4838C8`, the Pair-5
 * base, referenced from within the palette) — and declares no palette of its
 * own. See {@link coverTints} in `@/theme/tokens` for the authoritative,
 * per-pair enumeration and the rationale for keeping these out of `@theme`.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE (+ a DELIBERATE deviation)
 * ──────────────────────────────────────────────────────────────────────────
 * The behavior mirrors, for visual parity only, Calibre's desktop cover
 * generation (`src/calibre/ebooks/covers.py`) and its library cover-thumbnail
 * painting (`src/calibre/gui2/library/delegates.py`). NO Python/Qt code is
 * imported, translated, or executed — the Calibre tree is a read-only
 * conceptual reference.
 *
 *   DELIBERATE DEVIATION: `covers.py` chooses a color theme RANDOMLY —
 *   `color_theme = random.choice(load_color_themes(prefs))` (≈ line 608). This
 *   module intentionally does the OPPOSITE: it selects the palette via a PURE,
 *   deterministic hash of the book's identity. Randomness would destabilize
 *   the UI across navigation and trip React hydration errors, so determinism
 *   is required here and the Python randomness is NOT reproduced.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * FIGMA GROUNDING
 * ──────────────────────────────────────────────────────────────────────────
 * Tints match the design's confirmed dark, low-saturation book-cover palette
 * (Figma file JduUzjVHNhZivm5A0pAiCD; cover nodes 2:347 = #2A1028 deep plum,
 * and the Dune thumbnail = #1C1442 deep indigo — both reproduced verbatim
 * below). The title overlay mirrors the `text-cover-title` role — Inter, Bold
 * (700), white `#F1F5FF` (= `colors.textPrimary`) — per AAP §0.3.4 ("covers …
 * with the title overlaid in Inter Bold white") and the App02 grid-card cover
 * style (node 3:82).
 *
 * @see src/calibre/ebooks/covers.py — Calibre cover generation (reference only;
 *      its `random.choice` is deliberately NOT reproduced).
 * @see src/calibre/gui2/library/delegates.py — Calibre cover-thumbnail painting
 *      (reference only).
 * @see Agent Action Plan §0.3.4 — generated-placeholder cover policy.
 */

import type { Book } from '@/types';
import { colors, coverTints } from '@/theme/tokens';

// ───────────────────────────────────────────────────────────────────────────
// Public types
// ───────────────────────────────────────────────────────────────────────────

/**
 * A resolved cover color set for one book — the two gradient stops plus the
 * title-overlay color. All three are valid CSS/SVG color strings.
 */
export interface CoverPalette {
  /** Base tint — the top-left stop of the diagonal gradient. */
  bg: string;
  /** Accent tint — the bottom-right stop of the diagonal gradient. */
  bgAccent: string;
  /** Title-overlay color, always readable on the dark tint (`colors.textPrimary`). */
  text: string;
}

// ───────────────────────────────────────────────────────────────────────────
// Local cover-tint palette (sanctioned literals — see TOKEN BOUNDARY above)
// ───────────────────────────────────────────────────────────────────────────

/**
 * Cover-tint palette — navy / indigo / plum / forest tones matching the Figma
 * book-cover style (nodes 2:347, 3:82). Each entry is a same-family pair: a dark
 * `bg` base tint and a slightly brighter `bgAccent` for the subtle diagonal
 * gradient.
 *
 * SOURCED FROM THE TOKEN MODULE — ZERO COLOR LITERALS HERE. The sanctioned,
 * generated-cover-only palette is defined ONCE in `@/theme/tokens`
 * ({@link coverTints}) and imported here, so this file declares NO bare color
 * literal of its own. This keeps `@/theme/tokens` the single home for every
 * color value in the app and satisfies the "no hardcoded color literals" rule
 * (AAP §0.4.5 / §0.9) while honoring the generated-cover-art exception
 * (AAP §0.3.4 / §0.4.4): the tints are never used for application chrome, only
 * for placeholder cover art, and are intentionally kept out of the CSS `@theme`
 * set. See {@link coverTints} in `@/theme/tokens` for the full per-pair
 * enumeration (Pair 1 deep indigo `#1C1442` Dune … Pair 5 `colors.accentIndigo`
 * … Pair 6 deep forest) and rationale. The title overlay color is the
 * `colors.textPrimary` token; every remaining bare literal in this file is
 * non-color (geometry / opacity / font size / font-family stack).
 */
const COVER_PALETTE: ReadonlyArray<{ bg: string; bgAccent: string }> = coverTints;

// ───────────────────────────────────────────────────────────────────────────
// Title-overlay layout constants (Figma `text-cover-title`: Inter 700 14px/18px)
// ───────────────────────────────────────────────────────────────────────────

/**
 * SVG font stack for the overlay. Literal (not the `--font-inter` CSS variable)
 * because a data-URI SVG is a standalone document where CSS custom properties
 * do not resolve; Inter is loaded globally so inline-rendered SVG uses it, and
 * `system-ui`/`sans-serif` are safe fallbacks for the `<img src>` case.
 */
const FONT_STACK = 'Inter, system-ui, sans-serif';

/** Title overlay — Inter Bold (AAP §0.3.4 "title overlaid in Inter Bold white"). */
const TITLE_FONT_WEIGHT = 700;
/** Title font size at the intrinsic 180px-wide cover (scales via the SVG viewBox). */
const TITLE_FONT_SIZE = 16;
/** Title line height in px (≈1.2 of the font size), used to space wrapped lines. */
const TITLE_LINE_HEIGHT = 19;
/** Vertical center (as a fraction of cover height) the title block is centered on. */
const TITLE_CENTER_RATIO = 0.42;
/** Greedy word-wrap character budget per title line at the 180px intrinsic width. */
const TITLE_MAX_CHARS_PER_LINE = 14;
/** Hard cap on wrapped title lines; overflow is truncated with an ellipsis. */
const TITLE_MAX_LINES = 3;

/** Author overlay — smaller, lighter, near the bottom of the cover. */
const AUTHOR_FONT_WEIGHT = 400;
/** Author font size in px at the intrinsic cover width. */
const AUTHOR_FONT_SIZE = 10;
/** Author opacity (de-emphasized relative to the title). */
const AUTHOR_OPACITY = 0.75;
/** Author baseline as a fraction of cover height (near the bottom edge). */
const AUTHOR_BASELINE_RATIO = 0.92;

// ───────────────────────────────────────────────────────────────────────────
// Private pure helpers
// ───────────────────────────────────────────────────────────────────────────

/**
 * Deterministic djb2 string hash → unsigned 32-bit integer.
 *
 * Pure and dependency-free: the same string always produces the same number on
 * every JS engine, server or client. Used to pick a stable palette index from
 * a book's identity. (This is the deterministic replacement for Calibre's
 * `random.choice` — see the DELIBERATE DEVIATION note in the file header.)
 *
 * @param input - any string (here, a book's `${id}::${title}` identity key).
 * @returns an unsigned 32-bit integer hash.
 */
function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    // hash * 33 + charCode, kept in the unsigned 32-bit range via `>>> 0`.
    hash = ((hash << 5) + hash + input.charCodeAt(i)) >>> 0;
  }
  return hash >>> 0;
}

/**
 * XML/entity-escape text for safe, well-formed inlining into SVG markup.
 *
 * Escapes the five XML-significant characters so that titles/authors containing
 * `&`, `<`, `>`, `"`, or `'` (e.g. "Ender's Game") cannot break the generated
 * SVG. `&` is escaped first so already-escaped entities are not double-escaped.
 *
 * @param value - raw text to escape.
 * @returns the entity-escaped, SVG-safe string.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Deterministically wrap a (raw, un-escaped) title into at most
 * {@link TITLE_MAX_LINES} lines by greedily packing whole words up to a fixed
 * character budget ({@link TITLE_MAX_CHARS_PER_LINE}). No measurement APIs are
 * used (canvas/DOM are unavailable in Server Components), so wrapping relies
 * solely on character counts and is therefore identical on server and client.
 *
 * If the title needs more than the allowed number of lines, the result is
 * truncated to that many lines and a single-character ellipsis ("…") is
 * appended to the final retained line.
 *
 * Wrapping operates on the RAW title (so the visual character budget reflects
 * what the reader sees); each returned line is escaped separately by the
 * caller before being emitted into the SVG.
 *
 * @param raw - the raw (un-escaped) title text.
 * @param maxCharsPerLine - soft per-line character budget.
 * @param maxLines - hard cap on the number of lines.
 * @returns an ordered array of 0–`maxLines` line strings.
 */
function wrapTitle(
  raw: string,
  maxCharsPerLine: number = TITLE_MAX_CHARS_PER_LINE,
  maxLines: number = TITLE_MAX_LINES,
): string[] {
  const words = raw.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [];
  }

  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (current.length === 0) {
      // Start a new line. A word longer than the budget still occupies its own
      // line on its own (words are never split mid-character).
      current = word;
    } else if (current.length + 1 + word.length <= maxCharsPerLine) {
      // The word fits on the current line (with a joining space).
      current = `${current} ${word}`;
    } else {
      // The word overflows: flush the current line and begin a new one.
      lines.push(current);
      current = word;
    }
  }
  if (current.length > 0) {
    lines.push(current);
  }

  if (lines.length <= maxLines) {
    return lines;
  }

  // Overflow: keep the first `maxLines` lines and ellipsize the last one,
  // trimming it if necessary so the line plus the ellipsis stays within budget.
  const truncated = lines.slice(0, maxLines);
  let last = truncated[maxLines - 1];
  if (last.length >= maxCharsPerLine) {
    last = last.slice(0, Math.max(0, maxCharsPerLine - 1)).trimEnd();
  }
  truncated[maxLines - 1] = `${last}…`;
  return truncated;
}

// ───────────────────────────────────────────────────────────────────────────
// Public API
// ───────────────────────────────────────────────────────────────────────────

/**
 * Resolve the deterministic {@link CoverPalette} for a book.
 *
 * The palette is stable for the life of the dataset: it is keyed on
 * `${id}::${title}` (so it stays stable even if two books share a title) and
 * selected via {@link hashString} modulo the palette length. The title color
 * is always `colors.textPrimary` for guaranteed legibility on the dark tint.
 *
 * Accepts any object exposing at least `id` and `title` (a full {@link Book}
 * satisfies this), so callers that only have a book's identity can still get a
 * matching palette.
 *
 * PERFORMANCE — MEMOIZED, STABLE-REFERENCE RESULT (perf gate)
 * --------------------------------------------------------------------------
 * The palette is a PURE function of the book's identity key, so its result is
 * cached in a module-level {@link PALETTE_CACHE} keyed on `${id}::${title}`.
 * This serves two ends: (1) repeated calls — the same cover is resolved by the
 * list thumb, the grid card, the detail panel, and across List↔Grid navigations
 * — skip the (already cheap) hash + object allocation; and (2), more importantly,
 * every call for a given book returns the SAME FROZEN object REFERENCE, so the
 * `style` object passed to `BookCoverPlaceholder` is referentially stable and
 * downstream `React.memo` reconciliation is never defeated by a fresh object on
 * each render. The cache is sound because the function is deterministic and the
 * dataset is static for the app's lifetime; entries are `Object.freeze`d so a
 * shared reference can never be mutated by a consumer. This is the proportionate
 * resolution of the QA "/grid initial-render long task" finding (it removes
 * per-render recompute/allocation on the warm path) — see also `BookCard`'s
 * `React.memo` wrapper and the `CoverGrid` notes.
 *
 * @param book - an object with at least `id` and `title`.
 * @returns the deterministic, FROZEN `{ bg, bgAccent, text }` palette for the
 *          book (a stable reference — do not mutate).
 */
const PALETTE_CACHE = new Map<string, CoverPalette>();

export function getCoverPalette(book: Pick<Book, 'id' | 'title'>): CoverPalette {
  const key = `${book.id}::${book.title}`;

  // Return the cached, frozen palette if this book was already resolved (stable
  // reference across every call — see the PERFORMANCE note above).
  const cached = PALETTE_CACHE.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const index = hashString(key) % COVER_PALETTE.length;
  const entry = COVER_PALETTE[index];
  // Freeze so the shared, cached reference can never be mutated by a consumer.
  const palette: CoverPalette = Object.freeze({
    bg: entry.bg,
    bgAccent: entry.bgAccent,
    text: colors.textPrimary,
  });
  PALETTE_CACHE.set(key, palette);
  return palette;
}

/**
 * Generate a deterministic placeholder cover as a URL-encoded SVG data URI.
 *
 * The cover is a diagonal gradient of the book's resolved tint
 * ({@link getCoverPalette}) with the title overlaid in Inter Bold white,
 * wrapped onto up to {@link TITLE_MAX_LINES} centered lines, and the author (if
 * present) overlaid in a smaller, lighter weight near the bottom. The returned
 * string is suitable as `Book.coverUrl`, an `<img src>`, or a CSS
 * `background-image`.
 *
 * The data URI uses `encodeURIComponent` (NOT base64) so the payload stays
 * human-readable/debuggable and avoids `btoa` Unicode pitfalls. The output is
 * fully deterministic — the same book (and the same `width`/`height`) always
 * yields a byte-identical string — and contains NO real cover art.
 *
 * @param book - the book to render a cover for.
 * @param width - intrinsic SVG width in px (default 180). Display size scales
 *                via the SVG `viewBox`, so this is the intrinsic, not rendered, size.
 * @param height - intrinsic SVG height in px (default 260).
 * @returns a `data:image/svg+xml,…` URI string.
 */
export function generateCoverDataUri(book: Book, width = 180, height = 260): string {
  const palette = getCoverPalette(book);
  const centerX = width / 2;

  // Wrap on the raw title for an accurate visual budget, then escape per line.
  const titleLines = wrapTitle(book.title);
  const titleBlockTop =
    height * TITLE_CENTER_RATIO - ((titleLines.length - 1) * TITLE_LINE_HEIGHT) / 2;
  const titleTspans = titleLines
    .map((line, i) => {
      const y = Math.round(titleBlockTop + i * TITLE_LINE_HEIGHT);
      return `<tspan x="${centerX}" y="${y}">${escapeXml(line)}</tspan>`;
    })
    .join('');
  const titleEl = titleTspans
    ? `<text fill="${palette.text}" font-family="${FONT_STACK}" ` +
      `font-weight="${TITLE_FONT_WEIGHT}" font-size="${TITLE_FONT_SIZE}" ` +
      `text-anchor="middle">${titleTspans}</text>`
    : '';

  // Optional author line near the bottom of the cover.
  const author = (book.author ?? '').trim();
  const authorEl = author
    ? `<text x="${centerX}" y="${Math.round(height * AUTHOR_BASELINE_RATIO)}" ` +
      `fill="${palette.text}" font-family="${FONT_STACK}" ` +
      `font-weight="${AUTHOR_FONT_WEIGHT}" font-size="${AUTHOR_FONT_SIZE}" ` +
      `opacity="${AUTHOR_OPACITY}" text-anchor="middle">${escapeXml(author)}</text>`
    : '';

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${palette.bg}"/>` +
    `<stop offset="1" stop-color="${palette.bgAccent}"/>` +
    `</linearGradient></defs>` +
    `<rect width="${width}" height="${height}" fill="url(#g)"/>` +
    titleEl +
    authorEl +
    `</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
