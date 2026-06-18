'use client';

/**
 * ==========================================================================
 * Calibre-UI — BatchActionsPanel
 * App 02 Cover-Grid RIGHT panel, batch-actions variant (Figma `3:205`).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `BatchActionsPanel` is the right-hand panel rendered on the App 02 Cover-Grid
 * screen (`/grid`, Figma screen `3:2`) WHEN TWO OR MORE books are selected. In
 * that state it REPLACES the single-book `BookDetailPanel` (Figma detail panel
 * `2:345`) with the batch-actions variant (Figma node `3:205`): a selection
 * summary, a preview of the selected covers, and a stack of bulk actions that
 * operate over the whole selection. It is part of the UI-only Calibre e-book
 * manager prototype (Next.js 15 App Router · React 19 · TypeScript 5 strict ·
 * Tailwind CSS v4 CSS-first tokens).
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The panel subscribes to React Context via the {@link useLibrary} and
 * {@link useModal} hooks, so it is a Client Component (App Router components
 * default to Server Components, which cannot call hooks). The directive is the
 * very first line of the file, before any import.
 *
 * BATCH-MODE GATE (the defining behavior)
 * --------------------------------------------------------------------------
 * `LibraryProvider` derives `isBatchMode = selectedIds.length >= 2`. The grid
 * page chooses between this panel and `BookDetailPanel` by that flag, but this
 * component ALSO self-guards: when `!isBatchMode` it renders `null`. The guard
 * is defensive (it cannot visually conflict with the page's own choice) and
 * keeps the component correct if ever mounted directly — clearing the selection
 * down to one book makes it disappear and the single-book detail panel reappear.
 *
 * UI-ONLY · MOCK · NON-DESTRUCTIVE
 * --------------------------------------------------------------------------
 * There is NO backend, API, database, or real file I/O. "Convert" and "Edit
 * Metadata" open the corresponding modal OVERLAYS (App 05 / App 07) over the
 * dimmed library WITHOUT changing the route — they are driven purely through
 * {@link useModal}. "Delete" is an intentional MOCK no-op: it must never mutate
 * the in-memory dataset (deleting books is out of scope for this UI-only
 * prototype). "Clear Selection" is a real, safe action that clears `selectedIds`
 * (dropping back below the batch threshold), which is what flips the page back
 * to the single-book `BookDetailPanel`.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, node `3:205` / `3:2`)
 * --------------------------------------------------------------------------
 * The structure reproduces the reconciled spec for node `3:205`: a `surface-2`
 * glassmorphic panel carrying a "{N} books selected" heading, a wrapped preview
 * of the selected covers (capped, with a "+N" overflow chip), and a vertical
 * stack of bulk-action buttons — Convert (primary `gradient-cta`), Edit Metadata
 * (secondary outline), Delete (danger), and Clear Selection (secondary). Covers
 * are GENERATED placeholders (never real art); icons are font glyphs — there are
 * ZERO asset files (AAP §0.3.4).
 *
 * ZERO-HARDCODED-VALUES RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / gradient / radius / typography value resolves to an `@theme`
 * token declared in `src/app/globals.css`, consumed through a Tailwind v4
 * utility (`bg-surface-2`, `text-text-primary`, `text-text-muted`,
 * `text-detail-title`, `text-body`, `text-meta-value`, `rounded-badge`) or a
 * CSS-variable arbitrary value (`border-[var(--border-white-09)]`). The danger
 * and primary-gradient treatments come entirely from the `Button` primitive's
 * variants. The only bare literals are layout/spacing utilities on Tailwind's
 * standard scale (`flex`, `gap-2`, `gap-5`, `p-4`, `w-full`, `overflow-y-auto`)
 * and the panel-width FLEX LENGTHS in `rem` (`basis-[14.75rem]`,
 * `min-w-[14.75rem]` ≈ the 236px design width) — none of which carry design-token
 * color/radius/type information, matching the convention used by the sibling
 * `ReaderToolsPanel` / `TableOfContents` side panels.
 *
 * RESPONSIVE WIDTH (1440 → 1280, zero horizontal overflow)
 * --------------------------------------------------------------------------
 * The panel mirrors the `BookDetailPanel` ~236px baseline but expresses it as a
 * min-width + flex-basis (`min-w-[14.75rem] basis-[14.75rem]`) and `shrink-0`,
 * NEVER a hard `w-[236px]`. The grid page's CENTER column (`flex-1 min-w-0`,
 * owned by the page) absorbs the 1440 → 1280 difference, so the right panel keeps
 * its width while the row never overflows horizontally.
 *
 * COMPOSITION — PRIMITIVES ONLY
 * --------------------------------------------------------------------------
 * Built exclusively from the design-system primitives `GlassCard` (the surface),
 * `Button` (every action), and `BookCoverPlaceholder` (the cover preview). There
 * are NO raw `<button>` / control elements. State comes from `useLibrary`
 * (`selectedBooks`, `selectionCount`, `isBatchMode`, `clearSelection`) and
 * `useModal` (`openConvert`, `openMetadata`).
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * --------------------------------------------------------------------------
 * The multi-selection aggregate-action concept conceptually parallels Calibre's
 * desktop client — the action set in `src/calibre/gui2/book_details.py` applied
 * to a multi-row selection, and the selection model in
 * `src/calibre/gui2/library/views.py`. NO Python/Qt code is imported, translated,
 * or executed; the Calibre tree is a read-only conceptual reference.
 *
 * @see @/state/LibraryProvider — `useLibrary` (selection state + `clearSelection`).
 * @see @/state/ModalProvider — `useModal` (`openConvert` / `openMetadata`).
 * @see @/components/primitives/GlassCard — the glassmorphic surface primitive.
 * @see @/components/primitives/Button — the action primitive (primary/secondary/danger).
 * @see @/components/primitives/BookCoverPlaceholder — the generated-cover primitive.
 * @see src/calibre/gui2/book_details.py — Calibre book actions (reference only).
 * @see src/calibre/gui2/library/views.py — Calibre selection model (reference only).
 */

import type { JSX } from 'react';

import { useLibrary } from '@/state/LibraryProvider';
import { useModal } from '@/state/ModalProvider';
import { GlassCard } from '@/components/primitives/GlassCard';
import { Button } from '@/components/primitives/Button';
import { BookCoverPlaceholder } from '@/components/primitives/BookCoverPlaceholder';

/**
 * Tiny class-name joiner: keeps truthy parts and space-joins them. Mirrors the
 * helper used by the sibling side panels (`ReaderToolsPanel`) so the caller
 * `className` can be merged after the component's own classes without pulling in
 * a dependency outside the allowed set.
 *
 * @param parts - class fragments; `false` / `undefined` entries are dropped.
 * @returns the merged class string.
 */
function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * Maximum number of selected-book covers shown in the preview row before the
 * remainder collapses into a single "+N" overflow chip. Six tiles fit the
 * ~236px panel width on one or two wrapped rows while keeping the preview
 * compact (AAP / agent brief: "show up to 4–6 with a +N indicator").
 */
const PREVIEW_CAP = 6;

/* --------------------------------------------------------------------------
 * Token-backed class strings (module scope so they are allocated once). Every
 * value resolves to an `@theme` token; only layout/spacing utilities and the
 * rem-based panel-width flex lengths are bare (see the file header's
 * ZERO-HARDCODED-VALUES note).
 * ------------------------------------------------------------------------ */

/**
 * The panel surface layout, passed to `GlassCard` (which supplies the
 * `surface-2` background, the white-7% hairline border, and the `radius-card`
 * corners). A full-height, vertical-scrolling flex column whose width is the
 * design's ~236px expressed as a flex BASIS + min-width (`basis-[14.75rem]
 * min-w-[14.75rem]`) with `shrink-0` — never a fixed `w-[236px]` — so the grid
 * row holds 1440 → 1280 without horizontal overflow while the center grid
 * (`flex-1`, owned by the page) absorbs the slack. `gap-5` separates the three
 * sections; `p-4` is the inner padding.
 */
const PANEL_CONTAINER =
  'flex h-full shrink-0 basis-[14.75rem] min-w-[14.75rem] flex-col gap-5 ' +
  'overflow-y-auto p-4';

/** Header block: heading stacked above its muted subtitle. */
const HEADER = 'flex flex-col gap-1';
/** Selection-count heading: the panel-title role (Inter 600 / 15px), primary text. */
const HEADING = 'text-detail-title text-text-primary';
/** Muted helper subtitle beneath the count: body type (Inter 400 / 12px), muted. */
const SUBTITLE = 'text-body text-text-muted';

/** Selection-preview section: a label stacked above the wrapped cover row. */
const PREVIEW_SECTION = 'flex flex-col gap-2';
/**
 * Cover preview row: wraps the small cover tiles + the "+N" chip, vertically
 * centered with a token-scale gap. `overflow-hidden` clips any tile bleed
 * (agent brief) and bounds the wrapped rows.
 */
const PREVIEW_ROW = 'flex flex-wrap items-center gap-2 overflow-hidden';
/**
 * The "+N" overflow chip: a hairline-bordered pill (white-9% border, badge
 * radius) carrying the remaining-count in the meta-value type role (Inter 500 /
 * 10px) and the muted text token — so it reads as "more" without any hardcoded
 * color. `self-stretch` matches the chip height to the adjacent cover tiles.
 */
const PREVIEW_MORE =
  'inline-flex items-center justify-center self-stretch rounded-badge ' +
  'border border-[var(--border-white-09)] px-2 ' +
  'text-meta-value text-text-muted';

/** Bulk-actions group: a vertical stack with a token-scale gap. */
const ACTIONS = 'flex flex-col gap-2';
/** Every action button fills the narrow panel width (full-width block button). */
const ACTION_BTN = 'w-full';

/**
 * Props for {@link BatchActionsPanel}.
 *
 * The panel reads all of its data from Context, so the only prop is an optional
 * `className` (merged AFTER the component's own classes) that lets the grid page
 * supply layout/positioning overrides for the right-column slot — matching the
 * sibling side-panel convention.
 */
export interface BatchActionsPanelProps {
  /** Optional extra classes merged onto the root surface (caller wins on conflicts). */
  className?: string;
}

/**
 * BatchActionsPanel — the App 02 Cover-Grid batch-actions right panel.
 *
 * Renders (top → bottom) a "{N} books selected" header, a capped preview of the
 * selected covers with a "+N" overflow chip, and a vertical stack of bulk
 * actions (Convert · Edit Metadata · Delete · Clear Selection), composed only
 * from design-system primitives with every visual value resolving to an
 * `@theme` token. Returns `null` unless the library is in batch mode
 * (`selectedIds.length >= 2`).
 *
 * @param props - {@link BatchActionsPanelProps}
 * @returns The rendered batch-actions panel, or `null` when not in batch mode.
 */
export function BatchActionsPanel({
  className,
}: BatchActionsPanelProps): JSX.Element | null {
  const { selectedBooks, selectionCount, isBatchMode, clearSelection } = useLibrary();
  const { openConvert, openMetadata } = useModal();

  // Self-guard: the batch panel exists only for a 2-or-more selection. Below the
  // threshold the grid page shows the single-book detail panel instead; bailing
  // out here keeps the component correct even if mounted directly.
  if (!isBatchMode) {
    return null;
  }

  // Cover preview: show up to PREVIEW_CAP tiles, collapsing the rest into a
  // single "+N" chip. `remaining` counts against the full `selectionCount` (not
  // just the resolved `selectedBooks`), so the chip stays accurate even in the
  // unlikely event a selected id has no matching book in the catalog.
  const previewBooks = selectedBooks.slice(0, PREVIEW_CAP);
  const remaining = selectionCount - previewBooks.length;

  return (
    <GlassCard
      surface="surface-2"
      bordered
      aria-label="Batch actions"
      className={cx(PANEL_CONTAINER, className)}
    >
      {/* ── Header: selection count + muted helper subtitle ─────────────────── */}
      <div className={HEADER}>
        <h2 className={HEADING}>{selectionCount} books selected</h2>
        <p className={SUBTITLE}>Actions apply to all selected books.</p>
      </div>

      {/* ── Selection preview: capped cover tiles + "+N" overflow chip ──────── */}
      <section className={PREVIEW_SECTION} aria-label="Selected books">
        <div className={PREVIEW_ROW}>
          {previewBooks.map((book) => (
            <BookCoverPlaceholder key={book.id} book={book} size="sm" />
          ))}
          {remaining > 0 ? (
            <span className={PREVIEW_MORE} aria-label={`${remaining} more selected`}>
              +{remaining}
            </span>
          ) : null}
        </div>
      </section>

      {/* ── Bulk actions: operate over the whole selection ──────────────────── */}
      <div className={ACTIONS} role="group" aria-label="Bulk actions">
        {/* Convert (bulk): opens the Convert modal overlay; passing no bookId is
            fine — the modal acts on the current selection. Route is unchanged. */}
        <Button
          variant="primary"
          label="Convert"
          className={ACTION_BTN}
          onClick={() => openConvert()}
        />
        {/* Edit Metadata (bulk): opens the Metadata modal overlay. */}
        <Button
          variant="secondary"
          label="Edit Metadata"
          className={ACTION_BTN}
          onClick={() => openMetadata()}
        />
        {/* Delete: intentional MOCK no-op — UI-only, never mutates the dataset. */}
        <Button
          variant="danger"
          label="Delete"
          className={ACTION_BTN}
          onClick={() => {}}
        />
        {/* Clear Selection: real, safe action — empties the selection so the page
            drops back below the batch threshold and the detail panel reappears. */}
        <Button
          variant="secondary"
          label="Clear Selection"
          className={ACTION_BTN}
          onClick={() => clearSelection()}
        />
      </div>
    </GlassCard>
  );
}

export default BatchActionsPanel;
