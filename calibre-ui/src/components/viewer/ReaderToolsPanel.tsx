'use client';

/**
 * ==========================================================================
 * Calibre-UI — ReaderToolsPanel
 * The App 03 E-book Viewer RIGHT-HAND tools panel (Figma node `4:56`).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ReaderToolsPanel` is the ~372px right column of the E-book Viewer screen
 * (Figma screen `4:2`, this node `4:56`) in the UI-only Calibre e-book-manager
 * prototype (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind
 * CSS v4 CSS-first tokens). It stacks THREE sections, top → bottom:
 *   (a) Bookmarks            — a navigable, removable list + an "Add" action.
 *   (b) Highlights           — the reader's highlighted passages + notes.
 *   (c) Reading Progress     — percent-complete, chapter position, word count.
 * The reading surface to its left is `ReadingArea` (`4:43`, flex-1) and the
 * table-of-contents to the far left is `TableOfContents` (`4:23`); this panel is
 * the third flex child of the viewer page row.
 *
 * STATE — READS THE READER CONTEXT, OWNS NOTHING
 * --------------------------------------------------------------------------
 * All data and actions come from {@link useReader} (`@/state/ReaderProvider`):
 * `bookmarks`, `highlights`, `chapters`, `currentChapterIndex`, `currentChapter`,
 * `progressPercent`, and the imperative `goToChapter` / `addBookmark` /
 * `removeBookmark` / `addHighlight` / `removeHighlight`. This component holds NO
 * local state of its own — it is a pure projection of reader state plus thin
 * click/keyboard handlers that delegate straight to those actions.
 *
 * UI-ONLY · IN-MEMORY · NO PERSISTENCE (design-parity reference only)
 * --------------------------------------------------------------------------
 * Calibre's desktop viewer PERSISTS annotations to a cache / the EPUB / the
 * library DB (`src/calibre/gui2/viewer/annotations.py`, an `AnnotationsSaveWorker`
 * thread). This prototype deliberately implements NONE of that: there is NO
 * persistence, NO export/import, and NO "save" affordance. Bookmarks and
 * highlights live ONLY in `ReaderProvider` React state and reset on reload. The
 * panel's only side effects are the in-memory add/remove/navigate actions above.
 * The Bookmarks (navigable + removable list) and Highlights (passage + optional
 * note, navigable + removable) structures mirror Calibre's `bookmarks.py` /
 * `highlights.py` CONCEPTUALLY — no Python/Qt code is imported or translated.
 *
 * SEPARATE CLICK TARGETS (why there is no `stopPropagation`)
 * --------------------------------------------------------------------------
 * Each row supports two distinct interactions: clicking the row NAVIGATES to its
 * chapter, and clicking the trailing "×" REMOVES it. The `Button` primitive's
 * `onClick` is argument-free (`() => void`), so it cannot call
 * `event.stopPropagation()`. Rather than fight that, the remove `Button` is a
 * SIBLING of the navigable region (both are children of a non-interactive
 * `<li>`), not a descendant of it. A click on remove therefore bubbles to the
 * `<li>` (which has no handler) and never reaches the navigate handler — the two
 * targets are physically separate, so no propagation guard is needed.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Specified from AAP §0.3.1 (Workflow 2), §0.3.2 (token manifest) and §0.7.4
 * (App 03): a 372px tools panel carrying bookmarks, notes/highlights and
 * reading-progress stats, flanking the `#0F1020` reading surface. The panel
 * surface is `--color-surface-2` (#13162E), matching the symmetric TOC panel
 * (`4:23`, confirmed `#13162E`), separated from the reading area by a white-7%
 * left hairline. Exact pixel paddings are realized with Tailwind layout
 * utilities; every COLOR / BORDER / RADIUS / TYPOGRAPHY value resolves to an
 * `@theme` token (see ZERO-HARDCODED rule). The progress headline reads 29% at
 * rest (chapter index 2 of 7), exactly as the design's top progress bar shows.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / border / radius / typography value below resolves to an `@theme`
 * token declared in `src/app/globals.css`, consumed through a Tailwind v4 utility
 * (`bg-surface-2`, `text-text-primary`, `text-text-secondary`, `text-text-muted`,
 * `text-accent`, `bg-accent/10`, `border-accent`, `rounded-control`,
 * `rounded-e-control`, `text-detail-title`, `text-body`, `text-meta-label`,
 * `text-meta-value`, `text-dialog-heading`) or a CSS-variable arbitrary value
 * (`border-[var(--border-white-07)]`, `ring-[var(--border-accent)]`). There are
 * NO raw hex / rgba / px color or radius literals. The only bare values are
 * layout/spacing utilities (widths, flex, grid, padding, gap) which carry no
 * design-token color information; the panel WIDTH uses a min-width + flex-basis
 * pattern (never a fixed `w-[372px]`) so the viewer row degrades from 1440 → 1280
 * with zero horizontal overflow while `ReadingArea` (flex-1) absorbs the slack.
 *
 * COMPOSE-FROM-PRIMITIVES (AAP §0.4.2 / §0.4.5)
 * --------------------------------------------------------------------------
 * All controls are built from the design-system primitives — `GlassCard` (the
 * panel surface), `Button` (the two "Add" actions and every "×" remove), and
 * `TagPill` (the per-row chapter label). Structural/semantic HTML
 * (`<section>` / `<h3>` / `<ul>` / `<li>` / `<p>` / a clickable
 * `role="button"` region) carries the layout; no raw `<button>` is hand-rolled
 * for an action, and no third-party UI library is used.
 *
 * ACCESSIBILITY (UI3 — invisible, always applied)
 * --------------------------------------------------------------------------
 * • Each section is a labelled region (`<section aria-labelledby>` → `<h3>`).
 * • Each navigable row is a keyboard-operable `role="button"` with `tabIndex={0}`
 *   and an Enter/Space `onKeyDown` activator, plus an `aria-label` naming the
 *   navigation target.
 * • Every remove `Button` carries an explicit `aria-label` (e.g. "Remove
 *   bookmark …") so the decorative "×" glyph is not its accessible name.
 * • A token-backed `:focus-visible` ring (`--border-accent`) is shown for
 *   keyboard users only; hover/focus background is invisible at rest, and color
 *   transitions run only under `motion-safe` (prefers-reduced-motion).
 *
 * @see @/state/ReaderProvider — the reader Context (state + actions + types).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see src/calibre/gui2/viewer/bookmarks.py — Calibre viewer bookmarks (reference only).
 * @see src/calibre/gui2/viewer/highlights.py — Calibre viewer highlights (reference only).
 * @see src/calibre/gui2/viewer/annotations.py — Calibre annotation persistence we OMIT (reference only).
 */

import { type JSX, type KeyboardEvent } from 'react';
import { useReader } from '@/state/ReaderProvider';
import type { Bookmark, Highlight } from '@/state/ReaderProvider';
import { GlassCard } from '@/components/primitives/GlassCard';
import { Button } from '@/components/primitives/Button';
import { TagPill } from '@/components/primitives/TagPill';

/**
 * Props for {@link ReaderToolsPanel}. The panel needs none of its own — it reads
 * everything from the reader Context — but accepts an optional `className`
 * passthrough so the viewer page can supply layout overrides if needed.
 */
export interface ReaderToolsPanelProps {
  /** Optional extra classes, merged after the panel's own (caller wins). */
  className?: string;
}

/**
 * The remove glyph — U+00D7 MULTIPLICATION SIGN ("×"), the balanced remove
 * affordance (NOT the lowercase letter "x", and NOT an asset). It is the visible
 * text of each remove `Button`; the button's accessible name comes from its
 * explicit `aria-label`, so the glyph is purely decorative.
 */
const REMOVE_GLYPH = '\u00D7';

/**
 * Join class fragments, dropping any falsy entry. Mirrors the in-repo convention
 * (see `PreferencesNav`, `GlassCard`) for composing a base class string with an
 * optional caller `className`.
 */
function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * Build an Enter/Space keyboard activator for a `role="button"` region, so the
 * clickable rows are operable by keyboard exactly like a native button. Space is
 * `preventDefault`-ed to suppress the default page scroll.
 *
 * @param handler - the action to run on Enter/Space.
 * @returns a React `onKeyDown` handler.
 */
function activateOnKey(handler: () => void): (event: KeyboardEvent<HTMLDivElement>) => void {
  return (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handler();
    }
  };
}

/* --------------------------------------------------------------------------
 * Token-backed class strings (module scope so they are allocated once). Every
 * value resolves to an `@theme` token; only layout/spacing utilities are bare.
 * ------------------------------------------------------------------------ */

/**
 * The panel surface: full-height, vertical-scrolling flex column on the
 * `surface-2` tone (set via the `GlassCard surface` prop, not here). The WIDTH
 * uses min-width + flex-basis (≈372px) and is allowed to shrink — never a fixed
 * width — so the viewer row holds 1440 → 1280 without horizontal overflow
 * while `ReadingArea` (flex-1) absorbs the difference. Both lengths resolve to
 * `@theme` tokens (R3): the 320px floor via `--size-reader-tools-min-w` and the
 * 372px basis via `--size-reader-tools-basis`. A single white-7% LEFT hairline
 * separates it from the reading surface.
 */
const PANEL_CONTAINER =
  'flex h-full min-w-[var(--size-reader-tools-min-w)] shrink basis-[var(--size-reader-tools-basis)] flex-col overflow-y-auto ' +
  'border-l border-[var(--border-white-07)] px-u16';

/** A section: vertical stack with an inter-element gap and top/bottom padding. */
const SECTION = 'flex flex-col gap-u12 py-u16';
/** Sections 2 & 3 add a white-7% top hairline divider above their padding. */
const SECTION_DIVIDED = SECTION + ' border-t border-[var(--border-white-07)]';

/** Header row: heading on the left, the "Add" action on the right. */
const SECTION_HEADER_ROW = 'flex items-center justify-between gap-u8';
/** Section heading: Inter 600 / 15px (the panel-title role token), primary text. */
const SECTION_HEADING = 'text-detail-title text-text-primary';

/** Bookmark list: a tight vertical stack. */
const LIST = 'flex flex-col gap-u4';
/** Highlight list: a slightly looser stack (rows are multi-line). */
const LIST_LOOSE = 'flex flex-col gap-u8';

/** Empty-state hint: body type in the muted token. */
const EMPTY_HINT = 'py-u4 text-body text-text-muted';

/** Bookmark row: navigable region + sibling remove button on one line. */
const ROW = 'flex items-center gap-u4';
/** Highlight row: navigable region + sibling remove button, top-aligned. */
const ROW_TOP = 'flex items-start gap-u4';

/**
 * The navigable region of a bookmark row — a keyboard-operable `role="button"`.
 * Fills the row (`flex-1`, `min-w-0` so its title can truncate), shows a faint
 * accent hover wash and a token-backed focus-visible ring, and rounds with the
 * control radius. Hover/focus visuals are invisible at rest (DS2-e).
 */
const ROW_NAV =
  'flex min-w-0 flex-1 cursor-pointer items-center gap-u8 rounded-control px-u8 py-u8 ' +
  'text-left hover:bg-accent/10 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)] ' +
  'motion-safe:transition-colors';

/** The navigable region of a highlight row — like `ROW_NAV` but a column stack. */
const ROW_NAV_COL =
  'flex min-w-0 flex-1 cursor-pointer flex-col gap-u4 rounded-control px-u8 py-u8 ' +
  'text-left hover:bg-accent/10 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)] ' +
  'motion-safe:transition-colors';

/** Bookmark title: fills its row, truncates if long, body type / primary text. */
const BOOKMARK_TITLE = 'min-w-0 flex-1 truncate text-body text-text-primary';

/** The remove `Button` never shrinks (keeps a stable hit target on the right). */
const REMOVE_BTN = 'shrink-0';

/**
 * The highlighted-passage block: a left accent bar (`border-accent`) + a faint
 * accent wash + end-rounded corners, so it reads as a highlight without any
 * hardcoded color.
 */
const HIGHLIGHT_QUOTE = 'rounded-e-control border-l-2 border-accent bg-accent/10 px-u8 py-u4';
/** The quoted passage text: body type, primary color, wraps on long words. */
const HIGHLIGHT_TEXT = 'text-body text-text-primary break-words';
/** The optional note beneath a highlight: smaller, secondary color, wraps. */
const HIGHLIGHT_NOTE = 'text-meta-value text-text-secondary break-words';

/** Progress headline row: the big percent value beside its "complete" label. */
const PROGRESS_HEADLINE = 'flex items-baseline gap-u8';
/** The headline percent value: dialog-heading scale (20/600) in the accent color. */
const PROGRESS_PERCENT = 'text-dialog-heading text-accent';
/** The two-up stats grid beneath the headline. */
const PROGRESS_GRID = 'grid grid-cols-2 gap-u12';
/** A single stat block: a muted label stacked above its value. */
const STAT_BLOCK = 'flex flex-col gap-u2';
/** Stat label: Inter 400 / 10px, muted. */
const META_LABEL = 'text-meta-label text-text-muted';
/** Stat value: Inter 500 / 10px, primary. */
const META_VALUE = 'text-meta-value text-text-primary';

/**
 * ReaderToolsPanel — the App 03 viewer right-hand tools panel.
 *
 * Renders three labelled sections — Bookmarks, Highlights, and Reading Progress
 * — entirely from {@link useReader} state. Bookmark and highlight rows navigate
 * to their chapter on click/Enter/Space and expose a sibling "×" remove button;
 * the progress section derives its stats inline from the reader state. The whole
 * panel is a single `GlassCard` surface composed only from design-system
 * primitives, with every visual value resolving to an `@theme` token.
 *
 * @param props - {@link ReaderToolsPanelProps}
 * @returns The rendered tools panel.
 */
export function ReaderToolsPanel({ className }: ReaderToolsPanelProps): JSX.Element {
  const {
    bookmarks,
    highlights,
    chapters,
    currentChapterIndex,
    currentChapter,
    progressPercent,
    goToChapter,
    addBookmark,
    removeBookmark,
    addHighlight,
    removeHighlight,
  } = useReader();

  // Derived display values for the Reading Progress section, computed inline
  // from reader state (no `@/lib/format` dependency — simple expressions only).
  const totalChapters = chapters.length;
  const chapterPosition = `${currentChapterIndex + 1} of ${totalChapters}`;
  const wordCount = currentChapter?.wordCount ?? 0;
  const currentChapterTitle = currentChapter?.title ?? 'current chapter';

  return (
    <GlassCard
      surface="surface-2"
      bordered={false}
      aria-label="Reader tools"
      className={cx(PANEL_CONTAINER, className)}
    >
      {/* ── (a) Bookmarks ─────────────────────────────────────────────────── */}
      <section className={SECTION} aria-labelledby="reader-tools-bookmarks-heading">
        <div className={SECTION_HEADER_ROW}>
          <h3 id="reader-tools-bookmarks-heading" className={SECTION_HEADING}>
            Bookmarks
          </h3>
          {/* No args → the provider defaults the title to the current chapter
              and uses `currentChapterIndex`. */}
          <Button variant="secondary" icon="+" label="Add" onClick={() => addBookmark()} />
        </div>

        {bookmarks.length === 0 ? (
          <p className={EMPTY_HINT}>No bookmarks yet</p>
        ) : (
          <ul className={LIST}>
            {bookmarks.map((bookmark: Bookmark) => (
              <li key={bookmark.id} className={ROW}>
                <div
                  role="button"
                  tabIndex={0}
                  className={ROW_NAV}
                  aria-label={`Go to bookmark ${bookmark.title}`}
                  onClick={() => goToChapter(bookmark.chapterIndex)}
                  onKeyDown={activateOnKey(() => goToChapter(bookmark.chapterIndex))}
                >
                  <span className={BOOKMARK_TITLE}>{bookmark.title}</span>
                  <TagPill label={`Ch ${bookmark.chapterIndex + 1}`} className="shrink-0" />
                </div>
                {/* Sibling of the navigable region → its click never bubbles
                    through the navigate handler (no stopPropagation needed). */}
                <Button
                  variant="danger"
                  label={REMOVE_GLYPH}
                  aria-label={`Remove bookmark ${bookmark.title}`}
                  className={REMOVE_BTN}
                  onClick={() => removeBookmark(bookmark.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── (b) Highlights ────────────────────────────────────────────────── */}
      <section className={SECTION_DIVIDED} aria-labelledby="reader-tools-highlights-heading">
        <div className={SECTION_HEADER_ROW}>
          <h3 id="reader-tools-highlights-heading" className={SECTION_HEADING}>
            Highlights
          </h3>
          {/* UI-only mock: there is no real text selection, so "Add" inserts a
              highlight for the current chapter. */}
          <Button
            variant="secondary"
            icon="+"
            label="Add"
            onClick={() =>
              addHighlight({
                text: `Highlighted passage — ${currentChapterTitle}`,
                chapterIndex: currentChapterIndex,
              })
            }
          />
        </div>

        {highlights.length === 0 ? (
          <p className={EMPTY_HINT}>No highlights yet</p>
        ) : (
          <ul className={LIST_LOOSE}>
            {highlights.map((highlight: Highlight) => (
              <li key={highlight.id} className={ROW_TOP}>
                <div
                  role="button"
                  tabIndex={0}
                  className={ROW_NAV_COL}
                  aria-label={`Go to highlight in ${
                    chapters[highlight.chapterIndex]?.title ??
                    `chapter ${highlight.chapterIndex + 1}`
                  }`}
                  onClick={() => goToChapter(highlight.chapterIndex)}
                  onKeyDown={activateOnKey(() => goToChapter(highlight.chapterIndex))}
                >
                  <div className={HIGHLIGHT_QUOTE}>
                    <p className={HIGHLIGHT_TEXT}>{highlight.text}</p>
                    {highlight.note ? <p className={HIGHLIGHT_NOTE}>{highlight.note}</p> : null}
                  </div>
                  <TagPill label={`Ch ${highlight.chapterIndex + 1}`} className="shrink-0 self-start" />
                </div>
                <Button
                  variant="danger"
                  label={REMOVE_GLYPH}
                  aria-label="Remove highlight"
                  className={REMOVE_BTN}
                  onClick={() => removeHighlight(highlight.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── (c) Reading Progress ──────────────────────────────────────────── */}
      <section className={SECTION_DIVIDED} aria-labelledby="reader-tools-progress-heading">
        <h3 id="reader-tools-progress-heading" className={SECTION_HEADING}>
          Reading Progress
        </h3>

        <div className={PROGRESS_HEADLINE}>
          <span className={PROGRESS_PERCENT}>{progressPercent}%</span>
          <span className={META_LABEL}>complete</span>
        </div>

        <dl className={PROGRESS_GRID}>
          <div className={STAT_BLOCK}>
            <dt className={META_LABEL}>Chapter</dt>
            <dd className={META_VALUE}>{chapterPosition}</dd>
          </div>
          <div className={STAT_BLOCK}>
            <dt className={META_LABEL}>Words</dt>
            <dd className={META_VALUE}>{wordCount}</dd>
          </div>
        </dl>
      </section>
    </GlassCard>
  );
}

