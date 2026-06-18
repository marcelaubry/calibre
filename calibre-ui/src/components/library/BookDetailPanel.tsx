'use client';

/**
 * ==========================================================================
 * Calibre-UI Library — BookDetailPanel
 * The right-hand single-book detail panel for App 01 (Library List `/`).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `BookDetailPanel` is the rightmost column of the App 01 Library List screen
 * (Figma screen `2:2`, detail-panel node `2:345`, ~236×820 baseline). It shows
 * the LibraryProvider's current (detail) book — its generated cover, title,
 * author, optional series, star rating, a compact metadata table (format, size,
 * date added, series, identifiers, tags), the synopsis, and the primary action
 * group (Read Now · Convert Format · Edit Metadata · Send to Device · Delete).
 *
 * It is a UI-ONLY, mock prototype surface (Next.js 15 App Router · React 19 ·
 * TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens): there is NO backend,
 * NO file I/O, and NO real conversion/sending/deleting. "Read Now" navigates to
 * the viewer route; "Convert Format" / "Edit Metadata" open route-independent
 * modal overlays via {@link useModal}; "Send to Device" / "Delete" are mock
 * no-ops (the dataset is never destructively mutated).
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The panel consumes React Context hooks (`useLibrary`, `useModal`) and the
 * App Router navigation hook (`useRouter`), and binds `onClick` handlers — all
 * of which require a Client Component. The directive is the first line.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`, screen `2:2`)
 * --------------------------------------------------------------------------
 * Detail panel node `2:345`. CONFIRMED descendants reproduced here:
 *   • cover `2:347`     → `BookCoverPlaceholder size="lg"` (196×264, radius 10,
 *     generated placeholder tint — NEVER real cover art, per the prompt).
 *   • rating `2:348`    → `StarRating` (amber `--color-star`, 14 px glyphs).
 *   • Read Now `2:367`  → `Button variant="primary"` (`--gradient-cta`).
 *   • Convert Format `2:369` / Edit Metadata `2:371` → `Button variant="secondary"`.
 *   • Delete `2:375`    → `Button variant="danger"`.
 * Title/author/series and the metadata table reproduce the panel's text blocks
 * with the `--text-detail-title` / `--text-body` / `--text-meta-label` /
 * `--text-meta-value` typography roles.
 *
 * ZERO-HARDCODED-VALUE RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / gradient / radius / typography value resolves to an `@theme`
 * token, consumed via a token utility (`text-detail-title`, `text-text-primary`,
 * `text-meta-label`, `text-star`) or a CSS-variable arbitrary value
 * (`border-[var(--border-white-07)]`). The only bare literals are the permitted
 * neutral keywords and Tailwind's standard spacing-scale utilities (`px-4`,
 * `gap-5`, `basis-[14.75rem]`). The panel is composed EXCLUSIVELY from the
 * bespoke design-system primitives — `GlassCard`, `Button`, `StarRating`,
 * `TagPill`, `FormatBadge`, `BookCoverPlaceholder` — never a raw control.
 *
 * RESPONSIVE WIDTH (1440 → 1280, zero horizontal overflow)
 * --------------------------------------------------------------------------
 * The panel is a flex child sized by `shrink-0 basis-[14.75rem]` (236 px) with a
 * matching `min-w-[14.75rem]` floor — never a hard `w-[236px]` — so the center
 * book table (a sibling `flex-1 min-w-0`) absorbs the 160 px difference as the
 * window narrows from 1440 to 1280. With `box-sizing: border-box`, the 236 px
 * width minus the 1 px left hairline minus the 32 px `px-4` padding leaves
 * 203 px of content — enough to seat the fixed 196 px `lg` cover with ~20 px of
 * symmetric breathing room (matching the Figma 40 px horizontal whitespace) and
 * NO clipping. The panel scrolls vertically (`overflow-y-auto`) when its content
 * exceeds the available height.
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * --------------------------------------------------------------------------
 * The composition mirrors Calibre's desktop client `book_details.py`
 * (`CoverView` cover + `BookInfo` metadata HTML + the read / convert / edit-
 * metadata / send-to-device / remove context actions) and the current-book
 * selection in `views.py`. NO Python/Qt code is imported, translated, or
 * executed — the Calibre tree is a read-only conceptual reference.
 *
 * @see @/state/LibraryProvider — supplies `currentBook` (the selected book).
 * @see @/state/ModalProvider — `openConvert` / `openMetadata` overlay actions.
 * @see @/lib/format — `formatFileSize` / `formatDate` display formatters.
 * @see src/calibre/gui2/book_details.py — Calibre `BookInfo` (reference only).
 * @see src/calibre/gui2/library/views.py — Calibre `BooksView` (reference only).
 */

import { useRouter } from 'next/navigation';

import { useLibrary } from '@/state/LibraryProvider';
import { useModal } from '@/state/ModalProvider';
import { GlassCard } from '@/components/primitives/GlassCard';
import { Button } from '@/components/primitives/Button';
import { StarRating } from '@/components/primitives/StarRating';
import { TagPill } from '@/components/primitives/TagPill';
import { FormatBadge } from '@/components/primitives/FormatBadge';
import { BookCoverPlaceholder } from '@/components/primitives/BookCoverPlaceholder';
import { formatFileSize, formatDate } from '@/lib/format';
import type { FormatKind } from '@/types';

/**
 * Shared no-op for the UI-only mock actions (Send to Device / Delete) and the
 * "editable-looking" rating's `onChange`. A `() => void` is assignable to the
 * rating's `(value: number) => void` callback, so one constant serves both.
 * Declared at module scope to keep a stable identity across renders. Mirrors the
 * `noop` convention used elsewhere in the codebase (e.g. `MetadataCoverColumn`).
 */
const noop = (): void => {};

/**
 * Root surface layout (the full, populated panel). The WIDTH uses the
 * min-width + flex-basis pattern (≈236 px, the Figma `2:345` width) and is
 * pinned with `shrink-0` so the cover never clips; the sibling book table
 * (`flex-1 min-w-0`) absorbs all responsive slack. A single white-7% LEFT
 * hairline separates the panel from the table. `overflow-y-auto` lets the panel
 * scroll when content exceeds the height; `gap-5` spaces the major sections.
 * (`surface-2` tone is set via the `GlassCard surface` prop, not here.)
 */
const PANEL_CONTAINER =
  'flex h-full shrink-0 basis-[14.75rem] min-w-[14.75rem] flex-col gap-5 ' +
  'overflow-y-auto border-l border-[var(--border-white-07)] px-4 py-4';

/**
 * Empty-state layout: identical width/height/scroll/hairline to
 * {@link PANEL_CONTAINER} (so the three-column row never reflows when there is
 * no current book) but centers its single muted prompt on both axes.
 */
const EMPTY_CONTAINER =
  'flex h-full shrink-0 basis-[14.75rem] min-w-[14.75rem] items-center ' +
  'justify-center overflow-y-auto border-l border-[var(--border-white-07)] px-4 py-4';

/** A metadata row: label on the left, value on the right, on a single line. */
const META_ROW = 'flex items-center justify-between gap-2';

/** A stacked metadata block (label above a multi-line / wrapping value). */
const META_BLOCK = 'flex flex-col gap-1';

/** Metadata label typography (Inter 400 10 px, muted) — `text-meta-label`. */
const META_LABEL = 'text-meta-label text-text-muted';

/** Metadata value typography (Inter 500 10 px, secondary) — `text-meta-value`. */
const META_VALUE = 'text-meta-value text-text-secondary';

/**
 * BookDetailPanel — the App 01 right-hand single-book detail panel.
 *
 * Reads `currentBook` from {@link useLibrary}. When no book is selected (the
 * empty-catalog / cleared-selection edge case) it renders a muted prompt;
 * otherwise it renders the full panel for the current book. All visuals are
 * token-backed and composed only from design-system primitives.
 *
 * @returns The rendered detail panel (or its empty state).
 */
export function BookDetailPanel() {
  const router = useRouter();
  const { currentBook } = useLibrary();
  const { openConvert, openMetadata } = useModal();

  // Empty state — no current book (no selection or an empty catalog). Keep the
  // exact panel footprint so the surrounding three-column layout never shifts.
  if (!currentBook) {
    return (
      <GlassCard
        surface="surface-2"
        bordered={false}
        aria-label="Book details"
        className={EMPTY_CONTAINER}
      >
        <p className="text-body text-text-muted">Select a book to see details.</p>
      </GlassCard>
    );
  }

  // Narrow `Book.format` (a plain `string`) to the `FormatKind` union the
  // FormatBadge primitive expects. The catalog always stores uppercase
  // EPUB/MOBI/PDF; `.toUpperCase()` makes the narrowing robust to casing.
  const formatKind = currentBook.format.toUpperCase() as FormatKind;

  // `Book.identifiers` is a `Record<string, string>`; render each scheme/value
  // pair as a "key: value" line (AAP §0.3 detail-panel metadata).
  const identifierEntries = Object.entries(currentBook.identifiers);

  return (
    <GlassCard
      surface="surface-2"
      bordered={false}
      aria-label={`Details for ${currentBook.title}`}
      className={PANEL_CONTAINER}
    >
      {/* ── Cover (Figma 2:347) — generated placeholder, centered ─────────── */}
      <div className="flex justify-center">
        <BookCoverPlaceholder book={currentBook} size="lg" />
      </div>

      {/* ── Title · author · optional series ──────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <h2 className="text-detail-title text-text-primary">{currentBook.title}</h2>
        <p className="text-body text-text-secondary">{currentBook.author}</p>
        {currentBook.series ? (
          <p className="text-meta-label text-text-muted">{currentBook.series}</p>
        ) : null}
      </div>

      {/* ── Rating (Figma 2:348) — editable-looking; persistence is owned by
           the Metadata modal, so `onChange` is a UI-only no-op here. ──────── */}
      <StarRating value={currentBook.rating} editable onChange={noop} />

      {/* ── Metadata table ────────────────────────────────────────────────── */}
      <dl className="flex flex-col gap-2.5">
        <div className={META_ROW}>
          <dt className={META_LABEL}>Format</dt>
          <dd>
            <FormatBadge format={formatKind} />
          </dd>
        </div>

        <div className={META_ROW}>
          <dt className={META_LABEL}>Size</dt>
          <dd className={META_VALUE}>{formatFileSize(currentBook.sizeBytes)}</dd>
        </div>

        <div className={META_ROW}>
          <dt className={META_LABEL}>Date Added</dt>
          <dd className={META_VALUE}>{formatDate(currentBook.date)}</dd>
        </div>

        {currentBook.series ? (
          <div className={META_ROW}>
            <dt className={META_LABEL}>Series</dt>
            <dd className={`${META_VALUE} text-end`}>{currentBook.series}</dd>
          </div>
        ) : null}

        {identifierEntries.length > 0 ? (
          <div className={META_BLOCK}>
            <dt className={META_LABEL}>Identifiers</dt>
            <dd className="flex flex-col gap-0.5">
              {identifierEntries.map(([scheme, value]) => (
                <span key={scheme} className={`${META_VALUE} break-words`}>
                  {scheme}: {value}
                </span>
              ))}
            </dd>
          </div>
        ) : null}

        {currentBook.tags.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <dt className={META_LABEL}>Tags</dt>
            <dd className="flex flex-wrap gap-1.5">
              {currentBook.tags.map((tag) => (
                <TagPill key={tag} label={tag} />
              ))}
            </dd>
          </div>
        ) : null}
      </dl>

      {/* ── Synopsis ──────────────────────────────────────────────────────── */}
      {currentBook.synopsis ? (
        <div className="flex flex-col gap-1.5">
          <span className={META_LABEL}>Synopsis</span>
          <p className="text-body text-text-secondary break-words">
            {currentBook.synopsis}
          </p>
        </div>
      ) : null}

      {/* ── Actions — Read Now emphasized at the top of the group ─────────── */}
      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          label="Read Now"
          className="w-full"
          onClick={() => router.push('/viewer')}
        />
        <Button
          variant="secondary"
          label="Convert Format"
          className="w-full"
          onClick={() => openConvert(currentBook.id)}
        />
        <Button
          variant="secondary"
          label="Edit Metadata"
          className="w-full"
          onClick={() => openMetadata(currentBook.id)}
        />
        <Button
          variant="secondary"
          label="Send to Device"
          className="w-full"
          onClick={noop}
        />
        <Button variant="danger" label="Delete" className="w-full" onClick={noop} />
      </div>
    </GlassCard>
  );
}

export default BookDetailPanel;
