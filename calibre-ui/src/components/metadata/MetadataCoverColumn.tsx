'use client';

/**
 * ==========================================================================
 * Calibre-UI — MetadataCoverColumn
 * The LEFT column of the App 07 Metadata Editor modal (cover + formats).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `MetadataCoverColumn` is the left-hand column of the Metadata Editor modal
 * (App 07, Figma screen node `9:9`, 860×800) in the UI-only Calibre e-book
 * manager prototype (Next.js 15 App Router · React 19 · TypeScript 5 strict ·
 * Tailwind CSS v4 CSS-first tokens). Reading top-to-bottom it renders, all
 * against the modal surface (no distinct panel fill):
 *   1. the large generated book cover (Figma node `9:21`, 178×238);
 *   2. the three cover-action buttons — Change Cover / Download / Generate;
 *   3. a hairline divider;
 *   4. the editable star Rating (Figma node `9:31`, 20px amber stars);
 *   5. a hairline divider;
 *   6. the "Available formats" list — one row per format (chip + file size +
 *      a destructive remove control); and
 *   7. the "+ Add format" button.
 * The sibling `MetadataFields` renders the RIGHT column; the parent
 * `MetadataDialog` lays the two out as a flex row (this column is fixed-width
 * and `shrink-0`; the right column is `w-full` and absorbs the remaining
 * space — see RESPONSIVE below).
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * This column composes interactive Client-Component primitives (`Button`,
 * `StarRating`) that bind event handlers, and it forwards user intent up to
 * the parent via callbacks. App Router components default to Server Components
 * (which cannot attach handlers), so the directive is the very FIRST line of
 * the file, before any import.
 *
 * CONTROLLED / UI-ONLY MOCK (AAP §0.1.2 / §0.8.2 / §0.9, hard rules)
 * --------------------------------------------------------------------------
 * The component holds NO persistent state of its own — it is fully CONTROLLED.
 * The single source of truth for `rating` and `formats` lives in the parent
 * `MetadataDialog` (the `rating` value is SHARED with the right column, so both
 * stay in lock-step), and every mutation is reported upward:
 *   • `onRatingChange(value)` — a new 0–5 (0.5-increment) rating.
 *   • `onRemoveFormat(format)` — remove one format row.
 *   • `onAddFormat()`          — append a (mock) format row.
 * The Change Cover / Download / Generate buttons are deliberate NO-OPS: this
 * is a visual prototype with NO real cover download, generation, file I/O,
 * conversion, network, or persistence. They exist to reproduce the design.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, screen `9:9` left column)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node against the App 07 render. CONFIRMED:
 *   • Column 220px wide (`w-55` = 55×4px), ~21px side padding (`px-5` ≈ 20px,
 *     within ±1px), ~17px top (`pt-4` = 16px), top-aligned, NO panel fill
 *     (inherits the modal `--color-surface-2`).
 *   • Cover `9:21` 178×238 (≈3:4), radius ~10px, centered — rendered via the
 *     `BookCoverPlaceholder` primitive at an explicit `{ width, height }`
 *     (the named `lg` preset is 196×264, which would overflow the 178px
 *     content box; the AAP sanctions an explicit size matching the Figma cover).
 *   • Cover-action buttons — "Change Cover" full-width, then "Download" +
 *     "Generate" as an even two-up row (each `flex-1`), all `secondary`.
 *   • Rating label "Rating" above 20px amber stars. The label is rendered
 *     UPPERCASE ("RATING") via the shared `text-meta-label uppercase` treatment
 *     so it matches every other App 07 section label (see SECTION_LABEL_CLASSES).
 *   • "Available formats" label above the format rows, then "+ Add format". The
 *     label is likewise rendered UPPERCASE ("AVAILABLE FORMATS") to match the
 *     modal-wide field-label case.
 *
 * BLITZY [COLOR]: Figma tints each format ROW with the format hue (green/red/
 *   violet washes) and renders the format NAME as plain colored text. Per the
 *   AAP's explicit mandate to compose the `FormatBadge` primitive for every
 *   format mark (DS1 — design-system composition outranks literal fidelity),
 *   each row instead uses a neutral `--color-card` fill + the canonical
 *   `FormatBadge` chip as the single color source. (As a consequence MOBI reads
 *   amber `--color-format-mobi`, the AAP semantic token, where Figma shows
 *   violet — the same reconciliation the badge primitive documents.) Flagged
 *   for designer review.
 *
 * BLITZY [COLOR]: Figma styles "+ Add format" with a purple wash/border and
 *   violet text. The AAP + design system mandate the `secondary` Button variant
 *   (neutral) for this affordance, so it is rendered `secondary`; the purple
 *   treatment delta is flagged for designer review rather than overriding the
 *   primitive's token-backed variant.
 *
 * ZERO-HARDCODED-VALUES RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / radius / border / typography value resolves to an `@theme`
 * token from `globals.css`, consumed via a Tailwind v4 utility (`bg-card`,
 * `text-text-muted`, `text-meta-label`, `rounded-control`) or a CSS-variable
 * arbitrary value (`border-[var(--border-white-09)]`,
 * `bg-[var(--border-white-07)]` — the codebase's documented convention for the
 * white-border tokens). Spacing uses the Tailwind theme scale (`px-5`, `mt-5`,
 * `gap-2.5`, `w-55`). The cover's pixel `{ width, height }` and the star `size`
 * are PROP values passed to primitives (which apply them via inline `style`),
 * not CSS literals in this file — the AAP explicitly permits both. The only
 * bare keywords are the permitted neutrals.
 *
 * ACCESSIBILITY
 * --------------------------------------------------------------------------
 * • Section labels are non-interactive `<span>`s (NOT headings — `<h1>`–`<h6>`
 *   are forbidden in screen code), styled muted per the sibling convention.
 * • The format list is a semantic `<ul>`/`<li>`; each row has a stable
 *   `entry.format` key (no array-index keys → no reorder/hydration warnings).
 * • Each remove control is a `Button` whose visible glyph is the multiplication
 *   "✕"; a descriptive `aria-label` ("Remove EPUB format") supplies the
 *   accessible name so a screen reader announces intent, not a bare glyph.
 * • Icons are unicode glyphs rendered as text (AAP §0.3.4, 0 binary assets) —
 *   no image/SVG import.
 *
 * RESPONSIVE (AAP §0.9 — holds 1440→1280 with zero horizontal overflow)
 * --------------------------------------------------------------------------
 * The column is `w-55 shrink-0`: it never collapses, and the parent's right
 * column (`w-full`) absorbs the remaining width. Because the modal itself is a
 * fixed 860px centered card (well under 1280px), the two-column body never
 * reflows or overflows. The two-up Download/Generate buttons are `flex-1
 * min-w-0` so they split evenly and can shrink their content box rather than
 * forcing overflow.
 *
 * Design-parity reference only (NO code reuse / NO import from Python):
 *   • `src/calibre/gui2/metadata/basic_widgets.py` — `Cover`/`ImageView`
 *     (~L1182, the Browse/Download/Generate cover actions), `FormatsManager`
 *     (~L920, the per-format rows with size + add/remove), and `RatingEdit`
 *     (~L1472, the 0–5 half-star rating).
 *   • `src/calibre/gui2/metadata/single.py` / `single_download.py` — the
 *     single-book metadata dialog and the download/generate cover flow.
 *
 * @see src/components/primitives/BookCoverPlaceholder.tsx — generated cover.
 * @see src/components/primitives/Button.tsx — action primitive (variants).
 * @see src/components/primitives/StarRating.tsx — editable amber rating.
 * @see src/components/primitives/FormatBadge.tsx — format chip.
 * @see src/lib/format.ts — `formatFileSize` (binary file-size formatter).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3 / §0.4 — token & component manifests, App 07.
 */

import type { JSX } from 'react';

import { BookCoverPlaceholder } from '@/components/primitives/BookCoverPlaceholder';
import { Button } from '@/components/primitives/Button';
import { StarRating } from '@/components/primitives/StarRating';
import { FormatBadge } from '@/components/primitives/FormatBadge';
import { formatFileSize } from '@/lib/format';
import type { Book, FormatKind } from '@/types';

/**
 * One row of the "Available formats" list: a format kind plus its (mock) byte
 * size. Seeded by the parent from the target book's `format` + `sizeBytes`, and
 * extended by `onAddFormat`. Exported so the parent `MetadataDialog` can type
 * the form state it owns and threads back through {@link MetadataCoverColumnProps.formats}.
 */
export interface FormatEntry {
  /** The format kind — drives both the `FormatBadge` chip and the row key. */
  format: FormatKind;
  /** The format's size in bytes; rendered via `formatFileSize` (e.g. "2.3 MB"). */
  sizeBytes: number;
}

/**
 * Props for {@link MetadataCoverColumn}. The component is fully CONTROLLED — it
 * stores nothing; the parent `MetadataDialog` owns all state and supplies the
 * callbacks below.
 */
export interface MetadataCoverColumnProps {
  /** The resolved target book — drives the generated cover placeholder. */
  book: Book;
  /**
   * The current rating (0–5, in 0.5 increments). This is the SINGLE source of
   * truth shared with the right column, so editing it here keeps both columns
   * in sync.
   */
  rating: number;
  /** Called with the newly chosen rating when the user edits the stars. */
  onRatingChange: (value: number) => void;
  /** The format rows to render, seeded/owned by the parent. */
  formats: FormatEntry[];
  /** Remove the given format row (UI-only — mutates parent state). */
  onRemoveFormat: (format: FormatKind) => void;
  /** Append a (mock) format row (UI-only — mutates parent state). */
  onAddFormat: () => void;
}

/**
 * Explicit Figma pixel dimensions for the large cover (node `9:21`, 178×238).
 * Passed to `BookCoverPlaceholder` as a bespoke `{ width, height }` size — the
 * named `lg` preset (196×264) would overflow the 178px content box. Declared at
 * module scope so the same object identity is reused across renders.
 */
const COVER_SIZE = { width: 178, height: 238 } as const;

/**
 * Star glyph size (px) for the editable rating — Figma node `9:31` renders the
 * Metadata Editor stars at 20px (vs the 14px detail-panel default).
 */
const RATING_STAR_SIZE = 20;

/**
 * The "✕" remove glyph (U+2715 MULTIPLICATION X). Declared as an explicit
 * unicode escape so the exact codepoint is unambiguous and encoding-independent.
 * Rendered as the visible label of each destructive remove `Button`; the row's
 * accessible name comes from a descriptive `aria-label`, not this glyph.
 */
const REMOVE_GLYPH = '\u2715';

/**
 * Section-label classes (e.g. "Rating", "Available formats"): the muted text
 * token at the 10px/400 meta-label scale, rendered UPPERCASE. This is the
 * EXACT label treatment every other Metadata Editor section uses —
 * `MetadataFields` (right-column field labels AND its "Rating" read-back
 * label), `TagChipEditor` ("Tags"), and `IdentifierRows` ("Identifiers") all
 * declare `text-text-muted text-meta-label uppercase select-none`. The App 07
 * modal therefore presents a single, consistent field-label case throughout
 * (e.g. the right column's "RATING"/"LANGUAGE" read these labels uppercase), so
 * the left column's "RATING" and "AVAILABLE FORMATS" labels match rather than
 * standing out in sentence case. `uppercase` is a text-transform utility only
 * (it carries NO color/size token), and `select-none` keeps the decorative
 * label from being text-selected — both matching the sibling convention.
 */
const SECTION_LABEL_CLASSES = 'text-text-muted text-meta-label uppercase select-none';

/**
 * A single hairline divider: a 1px-tall, full-width rule filled with the
 * `--border-white-07` token (the codebase's documented arbitrary-`var()` form
 * for white-border tokens). Purely decorative, so `aria-hidden`.
 */
const DIVIDER_CLASSES = 'h-px w-full bg-[var(--border-white-07)]';

/**
 * One "Available formats" row: a token-backed elevated card whose height is
 * driven by the inner controls (no vertical padding), with the format chip on
 * the inline-start, the size text pushed to the end (`ml-auto`), and the remove
 * button last. `border`/`bg-card`/`rounded-control` are all token-backed.
 */
const FORMAT_ROW_CLASSES =
  'flex items-center gap-2 rounded-control border border-[var(--border-white-09)] ' +
  'bg-card px-2.5';

/** Size-text classes for a format row — muted, meta-label scale, pushed to end. */
const FORMAT_SIZE_CLASSES = 'ml-auto text-text-muted text-meta-label';

/**
 * Stable no-op for the cover-action buttons. This is a UI-only prototype with
 * NO real cover download / generation / file I/O, so Change Cover / Download /
 * Generate intentionally do nothing. A single module-level reference keeps the
 * handler identity stable across renders (no needless prop churn).
 */
const noop = (): void => {};

/**
 * MetadataCoverColumn — the left column of the App 07 Metadata Editor modal.
 *
 * Renders, top-to-bottom: the large generated cover, the three cover-action
 * buttons, a divider, the editable Rating, a divider, the "Available formats"
 * list, and "+ Add format". Fully controlled — `rating`/`formats` come from the
 * parent and every mutation is reported via the callback props. All styling is
 * token-backed; all controls compose design-system primitives.
 *
 * @param props - {@link MetadataCoverColumnProps}
 * @returns The rendered left column.
 */
export function MetadataCoverColumn({
  book,
  rating,
  onRatingChange,
  formats,
  onRemoveFormat,
  onAddFormat,
}: MetadataCoverColumnProps): JSX.Element {
  return (
    <div className="flex w-55 shrink-0 flex-col px-5 pt-4">
      {/* (1) Large generated cover — centered; never real cover art (AAP §0.9). */}
      <BookCoverPlaceholder book={book} size={COVER_SIZE} className="mx-auto" />

      {/* (2) Cover-action buttons — Change Cover full-width, then a Download /
          Generate two-up row. All `secondary`; all UI-only no-ops. The intra-
          cluster gap is 8px (gap-2) so Change Cover → the Download/Generate row
          matches the row's own 8px sibling gap (Figma ~8.5px), giving the whole
          button cluster a uniform tight rhythm. */}
      <div className="mt-2.5 flex flex-col gap-2">
        <Button label="Change Cover" variant="secondary" className="w-full" onClick={noop} />
        <div className="flex gap-2">
          <Button label="Download" variant="secondary" className="min-w-0 flex-1" onClick={noop} />
          <Button label="Generate" variant="secondary" className="min-w-0 flex-1" onClick={noop} />
        </div>
      </div>

      {/* Divider */}
      <div className={`mt-3 ${DIVIDER_CLASSES}`} aria-hidden="true" />

      {/* (3) Editable star rating — `rating` is the shared source of truth. */}
      <div className="mt-5 flex flex-col gap-2.5">
        <span className={SECTION_LABEL_CLASSES}>Rating</span>
        <StarRating
          value={rating}
          editable
          onChange={onRatingChange}
          size={RATING_STAR_SIZE}
          className="self-start"
        />
      </div>

      {/* Divider */}
      <div className={`mt-4 ${DIVIDER_CLASSES}`} aria-hidden="true" />

      {/* (4) Available formats — one row per format: chip + size + remove. */}
      <div className="mt-5 flex flex-col gap-2.5">
        <span className={SECTION_LABEL_CLASSES}>Available formats</span>
        <ul className="flex list-none flex-col gap-2">
          {formats.map((entry) => (
            <li key={entry.format} className={FORMAT_ROW_CLASSES}>
              <FormatBadge format={entry.format} />
              <span className={FORMAT_SIZE_CLASSES}>{formatFileSize(entry.sizeBytes)}</span>
              <Button
                label={REMOVE_GLYPH}
                variant="danger"
                className="shrink-0"
                aria-label={`Remove ${entry.format} format`}
                onClick={() => onRemoveFormat(entry.format)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* (5) Add a (mock) format row. */}
      <Button
        label="+ Add format"
        variant="secondary"
        className="mt-2 w-full"
        onClick={onAddFormat}
      />
    </div>
  );
}

export default MetadataCoverColumn;
