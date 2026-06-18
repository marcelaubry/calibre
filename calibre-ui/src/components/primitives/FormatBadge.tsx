/**
 * ==========================================================================
 * Calibre-UI Design System — FormatBadge
 * The small colored chip showing a book's e-book format (EPUB / MOBI / PDF).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `FormatBadge` is one of the 14 bespoke design-system primitives (AAP §0.3.3 /
 * §0.4.2) for the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * It is the tiny rounded chip that labels a book's file format with a
 * format-specific color treatment, shown wherever a format appears:
 *   • App 01 — the library table's "Format" column cell (per-row).
 *   • App 02 — the right end of each Cover-Grid card info strip (Figma node
 *     `3:87`, the canonical reference for this primitive).
 *   • App 01/02 — the right-hand book detail panel's metadata table.
 *   • App 07 — the Metadata Editor modal's per-format file list.
 * Screen code must NEVER hand-roll a format chip; it always composes this
 * primitive so the chip shape, color mapping, radius, and type stay identical
 * everywhere a format appears.
 *
 * `Book.format` IS A `string`, THIS PROP IS A `FormatKind`
 * --------------------------------------------------------------------------
 * Per the verbatim `Book` contract (AAP §0.1.2), `Book.format` is typed as a
 * plain `string` and is NEVER re-typed. This badge, however, accepts the
 * stricter three-way `FormatKind` union (`'EPUB' | 'MOBI' | 'PDF'`, declared in
 * `@/types`) so the format→style lookup is exhaustive and type-checked. Callers
 * bridge the two at the badge boundary — e.g. `<FormatBadge format={book.format
 * as FormatKind} />` — because the mock dataset only ever contains these three
 * formats. The cast lives at the call site, not here; this primitive's surface
 * stays strictly typed.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node against the badge frame `3:87` (the Dune
 * EPUB chip) inside App 02 (parent screen `3:2`), plus its MOBI (`3:97`) and PDF
 * (`3:105`) sibling variants. All 15 cover-grid badges share ONE template
 * (5 EPUB / 5 MOBI / 5 PDF); only the label and colors differ:
 *   • Frame: 40×16 px, corner radius 3 px (uniform), NO stroke, NO effects,
 *     opacity 1.
 *   • Label TEXT: Inter Medium (weight 500), 8 px, letter-spacing 0, literal
 *     UPPERCASE characters (text-transform none), vertically centered.
 *   • EPUB → text #4ADE80 on chip #1A2A1A · MOBI → (see BLITZY [COLOR]) on chip
 *     #1A1A2E · PDF → text #F87171 on chip #2A1A1A.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5) — THE TRAP THIS FILE AVOIDS
 * --------------------------------------------------------------------------
 * Every COLOR / RADIUS / TYPOGRAPHY value resolves to an `@theme` token declared
 * in `src/app/globals.css`, consumed through a Tailwind v4 utility:
 *   • text   → `text-format-epub` / `text-format-mobi` / `text-format-pdf`
 *              (`--color-format-epub` #4ADE80 · `--color-format-mobi` #FBBF24 ·
 *              `--color-format-pdf` #F87171).
 *   • fill   → `bg-[var(--color-format-epub-bg)]` / `…-mobi-bg` / `…-pdf-bg`
 *              (the CONFIRMED Figma opaque dark chip fills — see BLITZY [COLOR]).
 *   • size   → `w-[var(--size-format-badge-w)]` (40px) ·
 *              `h-[var(--size-format-badge-h)]` (16px) — the exact Figma frame.
 *   • radius → `rounded-badge` (`--radius-badge` = 3 px).
 *   • type   → `text-badge` (`--text-badge` = 8 px + companion
 *              `--text-badge--font-weight: 500` = Inter Medium, set in one
 *              utility; no separate `font-medium` is needed — matching how the
 *              sibling `Button` consumes `text-button-secondary`).
 * There are NO raw hex / rgba color literals anywhere in this file; every color
 * AND geometry value resolves to an `@theme` token. The only non-token literals
 * are layout/keyword utilities (`inline-flex`, `leading-none`, …), none of which
 * are design-token color/geometry values.
 *
 * BLITZY [COLOR]: chip background is now the CONFIRMED Figma OPAQUE dark fill.
 *   CP4 Figma-fidelity fix (per finding §FormatBadge L199-203): the prior
 *   10%-opacity wash (`bg-format-<kind>/10`) is replaced by dedicated opaque
 *   chip-fill tokens — EPUB `--color-format-epub-bg` #1A2A1A, MOBI
 *   `--color-format-mobi-bg` #1A1A2E, PDF `--color-format-pdf-bg` #2A1A1A — that
 *   reproduce the Figma SOLID, FULLY-OPAQUE, INDEPENDENT dark fills exactly while
 *   keeping the file 100% token-sourced (the new tokens live in globals.css and
 *   are mirrored in `tokens.ts`).
 *
 * BLITZY [COLOR]: MOBI label is the AAP semantic AMBER token, not Figma violet.
 *   The Figma file renders the MOBI label in violet `#A78BFA` (the accent-light
 *   value). The AAP token manifest (§0.3.2 `--color-format-mobi: #FBBF24`) and
 *   component inventory (§0.3.3 "mobi: amber #FBBF24") — reinforced by this
 *   file's explicit contract — canonicalize MOBI to the dedicated semantic
 *   `--color-format-mobi` AMBER token, completing the traffic-light scheme
 *   (EPUB green · MOBI amber · PDF red). Following the Figma-literal violet would
 *   orphan the purpose-built `--color-format-mobi` token and collide visually
 *   with the app's pervasive accent-light purple. Per AAP §0.3 scope/intent
 *   precedence (the AAP is the authoritative downstream spec), the amber token
 *   wins; flagged here for designer review. EPUB and PDF need no reconciliation
 *   (Figma and the AAP agree exactly).
 *
 * LAYOUT (CP4 Figma-fidelity fix — fixed 40×16 box)
 * --------------------------------------------------------------------------
 * The chip now reproduces the EXACT Figma `3:87` frame: a FIXED 40×16 px box
 * (`w-[var(--size-format-badge-w)]` + `h-[var(--size-format-badge-h)]`) with the
 * label centered geometrically (`inline-flex items-center justify-center`). This
 * supersedes the prior label-hugging treatment (small symmetric padding) flagged
 * by finding §FormatBadge L199-203: a fixed footprint makes every badge identical
 * in size and lets format chips align cleanly in the library "Format" column and
 * the card info strips. `leading-none` keeps the 8px label's line box tight; the
 * flex centering (not padding) places it inside the fixed 16px height.
 *
 * DATA-STATE COMPLETENESS (AAP §0.9 / UI9)
 * --------------------------------------------------------------------------
 * All THREE formats are fully styled, even though a given screen's mock data may
 * only surface a subset: the `FORMAT_CLASSES` lookup is a `Record<FormatKind,
 * string>`, so TypeScript guarantees every member of the union has a complete
 * color treatment and indexing is total (no missing-key fallthrough).
 *
 * RENDERING MODEL
 * --------------------------------------------------------------------------
 * PURE PRESENTATIONAL: no state, no hooks, no event handlers. It therefore
 * deliberately carries NO `'use client'` directive and is safe to render inside
 * React Server Components (the App Router default) — which is why the library
 * table rows, grid cards, detail panel, and metadata list can all compose it
 * regardless of their own client/server boundary. The chip is a `<span>` whose
 * visible text IS its accessible name (a screen reader announces "EPUB"), so no
 * ARIA is required and the badge is intentionally NOT `aria-hidden` (it conveys
 * real information, unlike the decorative `CheckBadge`). The caller `className`
 * is merged AFTER the base/format classes so caller utilities win on conflicts
 * (e.g. parent-supplied margins or positioning).
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/library/
 * delegates.py` (the Qt delegate that renders the library "Format" column as
 * plain comma-joined text). The colored chip is a net-new treatment from the
 * Figma redesign; nothing is imported or translated from the Python codebase.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see @/types — the `FormatKind` union consumed below.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import type { JSX } from 'react';

import type { FormatKind } from '@/types';

/**
 * Props for {@link FormatBadge}.
 *
 * Exactly the AAP §0.3.3 contract: the format to display, plus an optional
 * `className` for parent-supplied layout. There is deliberately no style/variant
 * prop — the `format` itself selects the variant via the {@link FORMAT_CLASSES}
 * lookup, and the primitive has a single canonical chip shape.
 */
export interface FormatBadgeProps {
  /**
   * The e-book format to label. One of the three-way {@link FormatKind} union
   * (`'EPUB' | 'MOBI' | 'PDF'`). NOTE: `Book.format` is a plain `string`; the
   * caller narrows it at the boundary (e.g. `book.format as FormatKind`) — see
   * the file header.
   */
  format: FormatKind;
  /**
   * Optional extra classes, merged AFTER the base + format classes so caller
   * utilities win on conflicts (typically parent-supplied margins/positioning).
   */
  className?: string;
}

/**
 * Base classes shared by every format variant — the canonical token-backed chip.
 *
 * - Shape/layout: `inline-flex items-center justify-center` centers the label on
 *   both axes inside the FIXED chip box. `align-middle` keeps the chip vertically
 *   centered on the surrounding text baseline when it sits inline (e.g. a table
 *   format cell or a card info strip next to the author line). `whitespace-nowrap`
 *   stops the short label from ever wrapping.
 * - Geometry (CP4 Figma-fidelity fix): the chip is the EXACT Figma `3:87` frame —
 *   a FIXED 40×16 px box via `w-[var(--size-format-badge-w)]` (40px) +
 *   `h-[var(--size-format-badge-h)]` (16px), with `rounded-badge`
 *   (`--radius-badge` = 3px). This replaces the prior label-hugging
 *   `px-1.5 py-1` treatment so every badge has identical footprint and aligns in
 *   a column. `leading-none` keeps the 8px label's line box tight inside the
 *   16px box (the flex centering does the vertical placement).
 * - Typography: `text-badge` (`--text-badge` = 8 px + companion font-weight 500
 *   = Inter Medium, in a single utility).
 *
 * Color is intentionally OMITTED here — it is supplied per-format by
 * {@link FORMAT_CLASSES} so each variant gets its own text color + opaque fill.
 */
const BADGE_BASE_CLASSES =
  'inline-flex items-center justify-center align-middle whitespace-nowrap ' +
  'w-[var(--size-format-badge-w)] h-[var(--size-format-badge-h)] ' +
  'rounded-badge leading-none text-badge';

/**
 * Per-format color treatment — an exhaustive `Record<FormatKind, string>` so the
 * compiler guarantees all three variants are styled (data-state completeness).
 *
 * Each entry pairs the format's text-color token utility with the CONFIRMED
 * Figma OPAQUE dark chip-fill token (CP4 Figma-fidelity fix — see the file
 * header's BLITZY [COLOR] flags):
 *   • EPUB → green  `text-format-epub` (#4ADE80) on `--color-format-epub-bg` #1A2A1A.
 *   • MOBI → amber  `text-format-mobi` (#FBBF24) on `--color-format-mobi-bg` #1A1A2E
 *            (AAP semantic amber token; Figma renders violet — see BLITZY [COLOR]).
 *   • PDF  → red    `text-format-pdf`  (#F87171) on `--color-format-pdf-bg` #2A1A1A.
 */
const FORMAT_CLASSES: Record<FormatKind, string> = {
  EPUB: 'text-format-epub bg-[var(--color-format-epub-bg)]',
  MOBI: 'text-format-mobi bg-[var(--color-format-mobi-bg)]',
  PDF: 'text-format-pdf bg-[var(--color-format-pdf-bg)]',
};

/**
 * FormatBadge — the bespoke design-system file-format chip primitive.
 *
 * Renders a single rounded `<span>` chip containing the uppercase `format` label
 * (e.g. "EPUB"), colored per the {@link FORMAT_CLASSES} lookup. All styling is
 * token-backed (see the file header); the caller `className` is merged AFTER the
 * base/format classes so caller utilities win on conflicts. Presentational and
 * Server-Component-safe (no `'use client'`).
 *
 * @param props - {@link FormatBadgeProps}
 * @returns The rendered format-chip element.
 */
export function FormatBadge({ format, className }: FormatBadgeProps): JSX.Element {
  // Compose token-backed classes: base chip + the selected format's color
  // treatment + any caller className (last so it wins on conflicts; Tailwind
  // source order governs). `filter(Boolean)` drops an absent className before
  // joining, keeping the array a clean `string[]`.
  const merged = [BADGE_BASE_CLASSES, FORMAT_CLASSES[format], className]
    .filter(Boolean)
    .join(' ');

  // The visible label IS the accessible name (a screen reader announces the
  // format), so the chip needs no ARIA and is NOT aria-hidden. The union
  // guarantees the label is already uppercase, matching the Figma "transform:
  // none" literal-caps text — no `uppercase` utility is applied.
  return <span className={merged}>{format}</span>;
}

export default FormatBadge;
