/**
 * ==========================================================================
 * Calibre-UI Design System — BookCoverPlaceholder
 * The GENERATED placeholder book-cover primitive (NEVER real cover art).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `BookCoverPlaceholder` is one of the 14 bespoke design-system primitives
 * (AAP §0.3.3 / §0.4.2) for the UI-only Calibre e-book-manager prototype
 * (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind CSS v4
 * CSS-first tokens). It renders a book's cover EVERYWHERE a cover appears:
 *   • App 01 — the library table's small per-row cover thumb (the `sm` size).
 *   • App 02 — the cover-grid card cover area (Figma node `3:82`, the `md` size).
 *   • App 01 — the right detail-panel cover (Figma node `2:347`, the `lg` size).
 *   • App 07 — the Metadata Editor modal's large cover (the `lg` size).
 * Screen code must NEVER hand-roll a cover or embed an image — it always
 * composes this primitive so the tint, title overlay, radius, and proportions
 * stay identical (and provably non-infringing) everywhere a cover appears.
 *
 * CRITICAL RULE — NEVER REAL COVER ART (AAP §0.1.2 / §0.8.2 / §0.9, hard rule)
 * --------------------------------------------------------------------------
 * Every cover this component renders is a DETERMINISTIC, GENERATED placeholder.
 * It embeds NO external image URL, performs NO `fetch`, and references NO real
 * or copyrighted artwork. The visual is a tinted gradient (the tint comes from
 * `@/lib/covers`) with the title overlaid in Inter Bold white. There are ZERO
 * image/SVG asset files in the design (AAP §0.3.4) — covers are produced in code.
 *
 * RENDERING MODEL — DOM overlay (chosen for live-Inter fidelity)
 * --------------------------------------------------------------------------
 * Two approaches are sanctioned by the design (both source ALL visuals from
 * `@/lib/covers`): (a) a real DOM cover — a tinted `<div>` with an overlaid
 * `<span>` title that uses the live Inter webfont; or (b) an `<img>` whose
 * `src` is `generateCoverDataUri(book)` (a self-contained SVG data-URI). This
 * primitive implements (a), the DOM overlay, because an `<img>`-referenced SVG
 * cannot reach the page's Inter webfont (it falls back to `system-ui`), whereas
 * a DOM `<span>` renders crisp Inter Bold. Consequently this component imports
 * ONLY `getCoverPalette` (it needs the palette, not the data-URI);
 * `generateCoverDataUri` is intentionally NOT imported — importing it unused
 * would trip `eslint`'s no-unused rule, and layering it under the DOM title
 * would double the title. It remains the helper for the `<img>` path and for
 * `Book.coverUrl` (already seeded from it in `@/data/books`).
 *
 * This is a PURE PRESENTATIONAL component: no state, no hooks, no event
 * handlers, and — because `getCoverPalette` is a pure, deterministic function —
 * byte-identical output on the server and the client. It therefore carries NO
 * `'use client'` directive (safe inside React Server Components) and hydrates
 * with zero mismatch warnings, even across List ↔ Grid navigation.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node against the detail cover `2:347` (parent
 * `2:2`), the grid-card cover `3:82` (parent `3:2`), and the per-row table
 * thumbnails on screen `2:2`. CONFIRMED per-context geometry:
 *   • `sm` table thumb  → 20×26 px (aspect 0.769), corner radius ~3px, FLAT
 *     per-book tint, NO title overlay (a plain tinted tile).
 *   • `md` grid cover   → 182×192 px (aspect 0.948 — the top region of the
 *     182×256 card; the info strip is a SEPARATE sibling), radius ~8px, FLAT
 *     per-book tint, title Inter 700 14px/18px #FFFFFF, LEFT-aligned near the
 *     BOTTOM (~15px left inset, baseline ~28.5px above the cover bottom), single
 *     line, no author overlay.
 *   • `lg` detail cover → 196×264 px (aspect 0.742 ≈ 3:4), radius ~10px, FLAT
 *     per-book tint. (On node `2:347` the title/author are SEPARATE siblings
 *     rendered below the cover, not on it.)
 * Selection decorations (the 2px purple card border and the violet check badge)
 * are CARD-LEVEL state owned by `BookCard`/`CheckBadge`, NOT this primitive.
 *
 * BLITZY [DESIGN]: tint is a subtle GRADIENT, not the Figma flat fill.
 *   The Figma render shows each cover as a FLAT solid tint. Per the design
 *   system (AAP §0.3.2 gradient tokens, the prompt's recommended approach, and
 *   `@/lib/covers`, whose `getCoverPalette` returns a `bg`→`bgAccent` PAIR and
 *   whose `generateCoverDataUri` emits a TL→BR gradient), the generated-cover
 *   look is a subtle diagonal gradient. This primitive renders
 *   `linear-gradient(135deg, palette.bg, palette.bgAccent)` (same TL→BR
 *   direction as the helper). The stops are a close same-family pair, so it
 *   reads as the base tint; flagged for designer review.
 *
 * BLITZY [DESIGN]: title overlay placement & visibility.
 *   The primitive renders the AAP §0.3.3/§0.3.4-mandated Inter-Bold-white title
 *   overlay, positioned LEFT + BOTTOM to match the one context where Figma shows
 *   an on-cover title (the `md` grid card, node `3:82`) — NOT centered. It is
 *   single-line with ellipsis truncation (Figma confirms titles render on one
 *   line). The title is HIDDEN below `SHOW_TITLE_MIN_WIDTH` so the tiny `sm`
 *   table thumb stays a plain tinted tile (matching Figma `2:2`) instead of
 *   showing an illegible/overflowing 14px title. The author line is omitted
 *   (Figma shows no author on the cover; the prompt makes it optional).
 *
 * ZERO-HARDCODED-VALUES RULE (AAP §0.4.5) + TOKEN BOUNDARY
 * --------------------------------------------------------------------------
 * • Tints: obtained EXCLUSIVELY from `getCoverPalette` and applied via inline
 *   `style` (the cover-tint literals such as `#1C1442`/`#2A1028` live INSIDE
 *   `@/lib/covers` by design — they are intentionally excluded from the global
 *   `@theme` token set, so this component must NEVER hardcode them). The only
 *   bare values in the gradient string are the CSS keyword `linear-gradient`
 *   and the angle `135deg`, both permitted non-color literals.
 * • Corner radius: a NAMED token utility per size — `rounded-badge` (3px, sm),
 *   `rounded-t-control` (8px top-only, md), `rounded-card` (10px, lg) — matching
 *   the CONFIRMED Figma per-context radii exactly (see {@link RADIUS_BY_PRESET}).
 * • Title color: the `--color-text-primary` token via the `text-text-primary`
 *   utility (= `palette.text` = #F1F5FF by construction).
 *   BLITZY [COLOR]: Figma node `3:82` renders the cover title in pure #FFFFFF;
 *   the design-system `@theme` set has NO pure-white color token, so per DS4
 *   token-snapping #FFFFFF resolves to the nearest token `--color-text-primary`
 *   (#F1F5FF) — the lightest text token and the color the file directive
 *   mandates. The delta (rgb 255,255,255 → 241,245,255) is visually
 *   imperceptible; flagged for designer review. Using raw #FFFFFF would violate
 *   the zero-hardcoded-token rule, so the token is used deliberately.
 * • Title type: the `text-cover-title` role utility (Inter 700 14px/18px in one
 *   utility — its companion `--text-cover-title--font-weight: 700` supplies the
 *   bold, so no separate `font-bold` is needed).
 * • Dimensions: CONFIRMED Figma pixel sizes applied via inline `style`
 *   (non-color geometry literals — the same sanctioned mechanism `StarRating`
 *   uses for `style={{ fontSize: size }}`); spacing insets use Tailwind's
 *   standard scale (`px-4`, `pb-6`). No raw hex/rgba color literal appears here.
 *
 * USAGE
 * --------------------------------------------------------------------------
 *   <BookCoverPlaceholder book={book} size="lg" />            // detail / metadata
 *   <BookCoverPlaceholder book={book} size="md" />            // grid card
 *   <BookCoverPlaceholder book={book} size="sm" />            // table row thumb
 *   <BookCoverPlaceholder book={book} size={{ width: 96, height: 130 }} />
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/library/
 * delegates.py` (the Qt delegate `paint()` that draws a scaled cover pixmap
 * into a cell) and `alternate_views.py` (`CoverDelegate`, the cover-grid view
 * with optional cover title). Nothing is imported or translated from Python.
 *
 * @see src/lib/covers.ts — the deterministic palette / data-URI generator.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.3.4 / §0.4.2 — token, component,
 *      and asset manifests (generated-placeholder-cover policy).
 */

import type { JSX } from 'react';

import type { Book } from '@/types';
import { getCoverPalette, type CoverPalette } from '@/lib/covers';

/**
 * The named cover-size presets. Each maps to a CONFIRMED Figma pixel geometry
 * for the context in which the cover appears (see the file header's FIGMA
 * SOURCE OF TRUTH). Callers may also pass an explicit `{ width, height }`.
 */
export type CoverSize = 'sm' | 'md' | 'lg';

/**
 * Props for {@link BookCoverPlaceholder}.
 *
 * Exactly the AAP §0.3.3 contract — the book to render, an optional size
 * (preset name or explicit pixel dimensions), and an optional `className` for
 * parent-supplied layout/positioning. There is deliberately no `onClick` or
 * other native attribute: the cover is presentational, and any interactivity
 * (e.g. selecting a grid card) is owned by the composing parent (`BookCard`).
 */
export interface BookCoverPlaceholderProps {
  /** The book whose generated cover to render (drives the tint and title). */
  book: Book;
  /**
   * Cover size. A named preset (`'sm'` 20×26 table thumb, `'md'` 182×192 grid
   * card, `'lg'` 196×264 detail/metadata) OR explicit `{ width, height }` pixel
   * dimensions for a bespoke context.
   * @default 'lg'
   */
  size?: CoverSize | { width: number; height: number };
  /**
   * Optional extra classes, merged AFTER the base/radius classes so caller
   * utilities win on conflicts (typically parent-supplied margins/positioning).
   */
  className?: string;
}

/** Resolved pixel dimensions for a cover. */
interface CoverDimensions {
  width: number;
  height: number;
}

/**
 * CONFIRMED Figma pixel geometry per named preset (measured on the authoritative
 * renders of screens `2:2` and `3:2`):
 *   • `sm` 20×26  — per-row table cover thumb (screen `2:2`, center table).
 *   • `md` 182×192 — grid-card cover AREA (node `3:82`; the card is 182×256, the
 *     info strip below is a separate sibling).
 *   • `lg` 196×264 — detail-panel / metadata cover (node `2:347`).
 */
const SIZE_PRESETS: Record<CoverSize, CoverDimensions> = {
  sm: { width: 20, height: 26 },
  md: { width: 182, height: 192 },
  lg: { width: 196, height: 264 },
};

/**
 * CONFIRMED Figma per-context corner radius, mapped 1:1 to the named radius
 * tokens (no approximation):
 *   • `sm` ~3px, ALL four corners → `rounded-badge` (standalone table thumb).
 *   • `md` ~8px, TOP corners ONLY → `rounded-t-control` (bottom squared).
 *   • `lg` ~10px, ALL four corners → `rounded-card` (standalone detail cover).
 *
 * BLITZY [RADIUS]: `md` rounds the TOP corners only (square bottom) to match
 *   Figma node `3:82`, where the grid-card cover area is the TOP region of the
 *   182×256 card and its bottom edge sits FLUSH against the info-strip sibling
 *   (owned by `BookCard`) — so the cover's bottom corners read as squared. The
 *   radius VALUE/token is the same (`--radius-control` 8px); only the corner SET
 *   differs by context. `sm`/`lg` are used standalone (no strip below), so they
 *   round all four corners exactly as Figma nodes (the 20×26 thumb and the
 *   196×264 detail cover `2:347`) show.
 */
const RADIUS_BY_PRESET: Record<CoverSize, string> = {
  sm: 'rounded-badge',
  md: 'rounded-t-control',
  lg: 'rounded-card',
};

/** Radius token for bespoke `{ width, height }` sizes — the canonical card radius. */
const CUSTOM_RADIUS_CLASS = 'rounded-card';

/**
 * Minimum cover width (px) at which the title overlay is shown. Below this the
 * cover renders as a plain tinted tile (matching Figma's `sm` 20×26 table thumb,
 * which carries no title) — a 14px title cannot render legibly in so small a box.
 */
const SHOW_TITLE_MIN_WIDTH = 100;

/**
 * Base container classes (token-backed / standard-scale only), applied at EVERY
 * size:
 *   • `relative` — establishes a positioning/stacking context.
 *   • `flex flex-col justify-end` — seats the (optional) single title child at
 *     the BOTTOM (matching Figma's bottom-anchored grid-card title).
 *   • `overflow-hidden` — clips the gradient to the rounded corners and bounds
 *     the title's ellipsis truncation.
 *   • `select-none` — the title is a decorative part of the "image", not
 *     selectable copy.
 *
 * NOTE: the title INSET ({@link TITLE_INSET}) is deliberately NOT part of this
 * base. It is applied ONLY when the title is shown, so a title-less tile (the
 * `sm` 20×26 thumb, or a small custom size) keeps its EXACT specified pixel
 * dimensions instead of being widened by horizontal padding larger than the
 * tile itself (a 32px `px-4` inset would otherwise balloon a 20px-wide thumb).
 */
const CONTAINER_BASE =
  'relative flex flex-col justify-end overflow-hidden select-none';

/**
 * Title inset, applied to the container ONLY when the title is shown:
 *   • `px-4` — ~16px horizontal inset (Figma's ~15px left edge, within the ±1px
 *     spacing tolerance; standard Tailwind scale, not a design literal).
 *   • `pb-6` — ~24px bottom inset, approximating Figma's ~28.5px title baseline
 *     above the cover bottom.
 */
const TITLE_INSET = 'px-4 pb-6';

/**
 * Title overlay classes: full content width with single-line ellipsis
 * truncation (`block w-full truncate`), the `text-cover-title` role (Inter 700
 * 14px/18px), and the `text-text-primary` token color (#F1F5FF, = `palette.text`).
 * Left alignment is the default (LTR), matching the Figma grid-card title.
 */
const TITLE_CLASSES = 'block w-full truncate text-cover-title text-text-primary';

/**
 * Resolve a `size` prop into concrete pixel dimensions plus the radius-token
 * utility to apply. Preset names map to {@link SIZE_PRESETS} / {@link
 * RADIUS_BY_PRESET}; explicit `{ width, height }` objects pass through with the
 * canonical card radius.
 *
 * @param size - a preset name or explicit `{ width, height }`.
 * @returns the resolved `{ dimensions, radiusClass }`.
 */
function resolveSize(
  size: CoverSize | { width: number; height: number },
): { dimensions: CoverDimensions; radiusClass: string } {
  if (typeof size === 'object') {
    return {
      dimensions: { width: size.width, height: size.height },
      radiusClass: CUSTOM_RADIUS_CLASS,
    };
  }
  return { dimensions: SIZE_PRESETS[size], radiusClass: RADIUS_BY_PRESET[size] };
}

/**
 * BookCoverPlaceholder — the bespoke design-system generated-cover primitive.
 *
 * Renders a single `<div>` whose background is a deterministic diagonal gradient
 * derived from the book's {@link getCoverPalette palette} (NEVER real art), at
 * the CONFIRMED Figma dimensions for the chosen `size`, with the per-context
 * radius token and (for sufficiently large covers) the book title overlaid in
 * Inter Bold white at the bottom-left. The whole element is exposed to assistive
 * tech as a single labelled image (`role="img"` + `aria-label`), and the visible
 * title is `aria-hidden` to avoid a duplicate announcement. The caller
 * `className` is merged AFTER the base/radius classes so caller utilities win.
 *
 * @param props - {@link BookCoverPlaceholderProps}
 * @returns The rendered generated-cover element.
 */
export function BookCoverPlaceholder({
  book,
  size = 'lg',
  className,
}: BookCoverPlaceholderProps): JSX.Element {
  // Deterministic per-book tint set (pure, SSR-safe) — the ONLY source of cover
  // color. `palette.bg`/`palette.bgAccent` form the gradient; `palette.text`
  // equals the `--color-text-primary` token applied to the title via utility.
  const palette: CoverPalette = getCoverPalette(book);

  const { dimensions, radiusClass } = resolveSize(size);

  // Show the title only when the cover is wide enough to render it legibly; the
  // tiny `sm` thumb stays a plain tinted tile (matches Figma — see file header).
  const showTitle = dimensions.width >= SHOW_TITLE_MIN_WIDTH;

  // Merge base + per-size radius token + (only when a title is shown) the title
  // inset + caller className (caller LAST → wins on conflicts; Tailwind source
  // order governs). The inset is gated on `showTitle` so a title-less tile keeps
  // its exact pixel dimensions. `filter(Boolean)` drops the empty/absent entries
  // before joining, keeping the array a clean `string[]`.
  const containerClassName = [
    CONTAINER_BASE,
    radiusClass,
    showTitle ? TITLE_INSET : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Accessible name conveys the book even when the title is visually hidden
  // (the `sm` thumb). Guard against an empty author so we never render a
  // trailing " by ".
  const accessibleLabel = book.author
    ? `Cover of ${book.title} by ${book.author}`
    : `Cover of ${book.title}`;

  return (
    <div
      role="img"
      aria-label={accessibleLabel}
      className={containerClassName}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        // Tint comes ONLY from the helper palette; `linear-gradient`/`135deg`
        // are permitted CSS keyword/value literals (TL→BR, matching covers.ts).
        backgroundImage: `linear-gradient(135deg, ${palette.bg}, ${palette.bgAccent})`,
      }}
    >
      {showTitle ? (
        <span className={TITLE_CLASSES} aria-hidden="true">
          {book.title}
        </span>
      ) : null}
    </div>
  );
}

export default BookCoverPlaceholder;
