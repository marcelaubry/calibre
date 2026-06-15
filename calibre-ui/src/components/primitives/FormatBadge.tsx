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
 *   • fill   → `bg-format-epub/10` / `bg-format-mobi/10` / `bg-format-pdf/10`
 *              (a 10%-opacity wash of the SAME format token — see BLITZY [COLOR]).
 *   • radius → `rounded-badge` (`--radius-badge` = 3 px).
 *   • type   → `text-badge` (`--text-badge` = 8 px + companion
 *              `--text-badge--font-weight: 500` = Inter Medium, set in one
 *              utility; no separate `font-medium` is needed — matching how the
 *              sibling `Button` consumes `text-button-secondary`).
 * There are NO raw hex / rgba color literals anywhere in this file. The only
 * non-token literals are Tailwind's standard spacing-scale utilities (`px-1.5`,
 * `py-1`) and layout/keyword utilities (`inline-flex`, `leading-none`, …), none
 * of which are design-token color/geometry values.
 *
 * BLITZY [COLOR]: chip background is a token wash, NOT the Figma opaque dark.
 *   The Figma chips use SOLID, FULLY-OPAQUE, INDEPENDENT dark fills — EPUB
 *   `#1A2A1A`, MOBI `#1A1A2E`, PDF `#2A1A1A` — that are NOT named `@theme`
 *   tokens and that the zero-hardcoded rule forbids hardcoding. Each is realized
 *   token-safely as a 10%-opacity wash of its OWN format color (`bg-format-<kind>/10`)
 *   so the chip stays 100% token-sourced while preserving the design intent: a
 *   subtle dark fill tinted toward the format's hue. This mirrors the sibling
 *   `Button` primitive, which maps the IDENTICAL `#2A1A1A` danger fill to
 *   `bg-danger/10`. The wash is alpha-composited over the surface behind it
 *   (vs. the Figma opaque cousin), an accepted, imperceptible reconciliation of
 *   the single token-backed look; flagged here for designer review.
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
 * LAYOUT RECONCILIATION (design-system centering rule)
 * --------------------------------------------------------------------------
 * Figma seats the label at a fixed 4 px left / 3 px top offset inside a FIXED
 * 40×16 px box (so the label is left-aligned with a variable residual right
 * gap). Per the design-system centering rule — and this file's explicit contract
 * ("small symmetric padding … visually center the label; do not apply literal
 * asymmetric Figma auto-layout padding") — this primitive instead HUGS its label
 * with small symmetric padding and centers it geometrically (`inline-flex
 * items-center justify-center`). The fixed-width/left-aligned Figma geometry is
 * an auto-layout artifact, not design intent (the same reconciliation the
 * sibling `CheckBadge` makes for its glyph). The 16 px Figma chip height is
 * preserved exactly: `leading-none` (8 px line box) + `py-1` (4 px top+bottom) =
 * 16 px under the global `border-box`.
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
 *   both axes (the design-system centering rule; see the file header's LAYOUT
 *   RECONCILIATION). `align-middle` keeps the chip vertically centered on the
 *   surrounding text baseline when it sits inline (e.g. a table format cell or a
 *   card info strip next to the author line). `whitespace-nowrap` stops the
 *   short label from ever wrapping.
 * - Geometry: `rounded-badge` (`--radius-badge` = 3 px). `px-1.5` (6 px) gives a
 *   small symmetric horizontal inset (the chip hugs its label); `py-1` (4 px)
 *   plus `leading-none` (an 8 px line box for the 8 px label) yields the exact
 *   16 px Figma chip height under the global `border-box`.
 * - Typography: `text-badge` (`--text-badge` = 8 px + companion font-weight 500
 *   = Inter Medium, in a single utility); `leading-none` keeps the line box
 *   tight so the height math holds (the badge role declares no line-height
 *   companion, so `leading-none` is free to set it).
 *
 * Color is intentionally OMITTED here — it is supplied per-format by
 * {@link FORMAT_CLASSES} so each variant gets its own text color + chip wash.
 */
const BADGE_BASE_CLASSES =
  'inline-flex items-center justify-center align-middle whitespace-nowrap ' +
  'rounded-badge px-1.5 py-1 leading-none text-badge';

/**
 * Per-format color treatment — an exhaustive `Record<FormatKind, string>` so the
 * compiler guarantees all three variants are styled (data-state completeness).
 *
 * Each entry pairs the format's text-color token utility with a 10%-opacity wash
 * of the SAME token for the chip fill (the token-safe stand-in for the Figma
 * opaque dark — see the file header's BLITZY [COLOR] flags):
 *   • EPUB → green  `text-format-epub` (#4ADE80) on `bg-format-epub/10`.
 *   • MOBI → amber  `text-format-mobi` (#FBBF24) on `bg-format-mobi/10`
 *            (AAP semantic token; Figma renders violet — see BLITZY [COLOR]).
 *   • PDF  → red    `text-format-pdf`  (#F87171) on `bg-format-pdf/10`.
 */
const FORMAT_CLASSES: Record<FormatKind, string> = {
  EPUB: 'text-format-epub bg-format-epub/10',
  MOBI: 'text-format-mobi bg-format-mobi/10',
  PDF: 'text-format-pdf bg-format-pdf/10',
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
