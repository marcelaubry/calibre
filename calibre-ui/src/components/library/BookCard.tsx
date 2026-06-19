'use client';

/**
 * ==========================================================================
 * Calibre-UI — BookCard
 * One selectable cover card in the App 02 Cover Grid (Figma `3:2`).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `BookCard` renders a SINGLE book as a selectable cover card for the App 02
 * Cover Grid screen (`/grid`) of the UI-only Calibre e-book-manager prototype
 * (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind CSS v4
 * CSS-first tokens). The parent `CoverGrid` maps one `BookCard` over each
 * book in `LibraryProvider.filteredBooks`; this component owns the rendering
 * of a single card and its SELECTION interaction.
 *
 * It is a Client Component (`'use client'`) because it reads and mutates the
 * shared library selection through the {@link useLibrary} hook (a React
 * Context consumer must run on the client).
 *
 * SELECTION = HOW THE USER REACHES BATCH MODE
 * --------------------------------------------------------------------------
 * In the grid, a click (or Enter/Space) TOGGLES the card's membership in
 * `LibraryProvider.selectedIds` via `toggleSelect(book.id)`. This is the sole
 * path to batch mode: once two or more cards are selected, the provider's
 * derived `isBatchMode` (`selectedIds.length >= 2`) flips `true` and the grid
 * swaps its right panel from the single-book `BookDetailPanel` to the
 * `BatchActionsPanel`. When the toggle leaves exactly one book selected, the
 * provider also points `currentBookId` at it (so the detail panel re-populates).
 * All of that state logic lives in `LibraryProvider`; this card only calls
 * `toggleSelect` and reflects `isSelected`.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reproduces the App 02 grid card `3:81` (the selected "Dune"/Book0 exemplar;
 * the second selected exemplar is "Foundation"/Book2 `3:99`) and its children:
 *   • card `3:81`  → 182×256, fill `--color-card` (#181C3C), radius
 *     `--radius-card` (10px), default hairline `--border-white-07`.
 *   • cover `3:82` → the 182×192 top region (a SEPARATE sibling from the info
 *     strip), generated tint + Inter-Bold-white title overlay — rendered by the
 *     `BookCoverPlaceholder` primitive at its `md` preset.
 *   • info strip  → small card title (`--text-card-title`, Inter 600 11/15) over
 *     a full-metadata band (R6): author ↔ `FormatBadge` (`3:87`), `StarRating` ↔
 *     date-added, and a tags cluster (up to `MAX_VISIBLE_TAGS` chips + "+N") ↔
 *     formatted size — every value a `--text-meta-label` (Inter 400 10) role
 *     token, each row `min-w-0`-truncated so the narrow card never overflows.
 *   • selected    → a 2px `--border-accent` (rgba(123,97,255,0.6)) stroke PLUS
 *     a `CheckBadge` (`3:89`/`3:90`) inset in the top-right corner.
 *   • unselected  → the 1px `--border-white-07` hairline only, no badge.
 * (Card geometry/fills/selection were reconciled from the design-system
 * primitives' own analyze_figma_node specifications for these exact nodes and
 * are verified end-to-end against screen `3:2` via compare_screenshot_with_figma.)
 *
 * BLITZY [COMPONENT]: cover size is `md`, not the file directive's `lg`.
 *   The directive's Phase-3 example reads `size="lg"`, but the cited cover node
 *   `3:82` is the 182×192 grid-card cover, which the `BookCoverPlaceholder`
 *   contract maps to the `md` preset (top-corner-only radius, designed to sit
 *   FLUSH above the info strip). `lg` (196×264, all-corner radius) is the
 *   detail-panel cover `2:347` and would render the wrong dimensions and a
 *   rounded bottom edge inside a grid card. Per Figma precedence (the node id
 *   is authoritative over the prose), `md` is used; flagged for review.
 *
 * RESPONSIVE INTEGRITY (AAP §0.1 / §0.7.4 — 1440 → 1280, zero h-overflow)
 * --------------------------------------------------------------------------
 * The card is a `w-full` box (NOT fixed `182px` wide), so it fills whatever
 * column width the responsive `CoverGrid` assigns; its HEIGHT is content-driven
 * (cover 192px + info strip) rather than a hard `aspect-[182/256]` — see the
 * BLITZY [RESPONSIVE] note on {@link CARD_BASE} for the full rationale (the
 * fixed-px `md` cover primitive + a hard aspect ratio would collapse the info
 * strip at 1280). `min-w-0` + `overflow-hidden` make the card a fully shrinkable
 * grid item (an item whose `overflow` is not `visible` gets an automatic
 * `min-width: 0`), so the 5-column grid degrades cleanly from the 1440 baseline
 * to the 1280 minimum with ZERO horizontal page overflow, regardless of how the
 * grid sizes its tracks. The composed `BookCoverPlaceholder` renders at its
 * intrinsic `md` pixel size and is gracefully clipped by the card's
 * `overflow-hidden` when a track is narrower than the cover (the cover's title is
 * left/bottom-anchored, so it stays visible); because the fixed-px cover is
 * always ≥ the card width it fully covers the card with no empty gap, and the
 * cover:strip proportions (192:64 ≈ 75%:25%) match the Figma 182×256 split at
 * every width. The info strip absorbs any grid-stretch residual height via
 * `flex-1`.
 *
 * ZERO-HARDCODED-VALUES RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / radius / border / typography value resolves to an `@theme`
 * token declared in `src/app/globals.css`, consumed through a Tailwind v4
 * utility (`bg-card`, `rounded-card`, `text-card-title`, `text-meta-label`,
 * `text-text-primary`, `text-text-muted`) or a CSS-variable arbitrary value
 * (`ring-[color:var(--border-accent)]`, `ring-[color:var(--color-accent)]`,
 * `border-[color:var(--color-accent)]/40`). The surface fill, default border,
 * and corner radius are supplied by the `GlassCard` primitive. The only bare
 * literals are Tailwind's standard spacing/scale utilities (`px-3`, `py-2`,
 * `gap-2`, `gap-0.5`, `right-2`, `top-2`, `z-10`, `duration-200`, `ring-2`) and
 * layout keywords — none of which are design-token color/geometry literals. No
 * raw hex/rgba appears here.
 *
 * COMPOSITION (design-system primitives only — AAP §0.4.5 / §0.3.3)
 * --------------------------------------------------------------------------
 * The card is built EXCLUSIVELY from primitives — `GlassCard` (surface),
 * `BookCoverPlaceholder` (generated cover; NEVER real art), `FormatBadge`
 * (format chip), and `CheckBadge` (selection marker) — plus token-styled
 * `<div>`/`<span>` text. No raw interactive controls are introduced.
 *
 * ACCESSIBILITY (invisible — always applied; no visual impact)
 * --------------------------------------------------------------------------
 * The card surface is exposed as a toggle button: `role="button"`,
 * `tabIndex={0}`, `aria-pressed={selected}`, and a concise `aria-label`. It is
 * keyboard-operable (Enter and Space both toggle selection; Space's default
 * page scroll is suppressed). Focus is shown only for keyboard users via
 * `:focus-visible` (a token-colored ring); the default outline is removed in
 * favor of that ring. The decorative `CheckBadge` is `aria-hidden` internally,
 * so the selection state is announced once, by `aria-pressed`.
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/library/
 * alternate_views.py` (`CoverDelegate` — cover thumb + title band + selection/
 * marked emblems, grid multi-select). Nothing is imported or translated from
 * the Python codebase.
 *
 * @see @/state/LibraryProvider — `useLibrary`, `isSelected`, `toggleSelect`.
 * @see @/components/primitives/GlassCard — the card surface.
 * @see @/components/primitives/BookCoverPlaceholder — the generated cover.
 * @see @/components/primitives/FormatBadge — the format chip (`3:87`).
 * @see @/components/primitives/CheckBadge — the selection marker (`3:89`).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import { memo, type KeyboardEvent } from 'react';

import type { Book, FormatKind } from '@/types';
import { useLibrary } from '@/state/LibraryProvider';
import { GlassCard } from '@/components/primitives/GlassCard';
import { BookCoverPlaceholder } from '@/components/primitives/BookCoverPlaceholder';
import { FormatBadge } from '@/components/primitives/FormatBadge';
import { CheckBadge } from '@/components/primitives/CheckBadge';
import { StarRating } from '@/components/primitives/StarRating';
import { TagPill } from '@/components/primitives/TagPill';
import { formatDate, formatFileSize } from '@/lib/format';

/**
 * Props for {@link BookCard}.
 *
 * Intentionally minimal: the card derives ALL of its selection state and
 * behavior from the shared {@link useLibrary} Context, so the only input it
 * needs from the parent grid is the book to render.
 */
export interface BookCardProps {
  /** The book this card renders (drives the cover, title, author, and format). */
  book: Book;
}

/**
 * Base card classes (token-backed / standard-scale / layout only):
 *   • `relative` — positioning context for the absolutely-placed `CheckBadge`.
 *   • `flex w-full min-w-0 flex-col` — vertical stack (cover over info strip)
 *     that fills its grid column and may shrink to 0 (`min-w-0`).
 *   • `overflow-hidden` — clips the intrinsic-size cover to the card's rounded
 *     bounds AND makes the card a shrinkable grid item (no h-overflow at 1280).
 *   • `cursor-pointer` + `select-none` — it behaves and reads as a button.
 *   • `outline-none` — the default outline is replaced by the focus-visible
 *     ring below (a visible, token-colored keyboard focus indicator).
 *   • `motion-safe:transition …` — hover/selection transitions are gated behind
 *     `prefers-reduced-motion: no-preference` (UI6), 200ms ease-out.
 *
 * BLITZY [FIGMA] (CP4 finding §BookCard L187 / §CoverGrid L153): the card now has
 *   the EXACT Figma 182×256 footprint (node `3:81`). The HEIGHT is FIXED at the
 *   `--size-card-h` (256px) token — NOT content-driven and NOT a hard
 *   `aspect-[182/256]`. The fixed height composes cleanly with the primitive's
 *   `md` cover, which is now FLUID-WIDTH + a fixed 192px height (`--size-cover-md-h`,
 *   `shrink-0`): cover (192px) + info strip (`flex-1` → fills the remaining 64px) =
 *   exactly 256px. The card WIDTH is the grid column — exactly `--size-cover-md-w`
 *   (182px) at the 1440 baseline (the `CoverGrid` `minmax(0, var(--size-cover-md-w))`
 *   track), so the card is a pixel-exact 182×256 there.
 *
 *   Why FIXED height (not `aspect-ratio`): a hard `aspect-[182/256]` + the required
 *   `overflow-hidden` makes the flex `min-height: auto` resolve to 0 (CSS Sizing
 *   §4.1: auto-minimum is suppressed when `overflow` is not `visible`), so below
 *   1440 the card would LOCK to the ratio height, the 192px cover would dominate,
 *   and the info strip (title/author/FormatBadge — CONFIRMED in node `3:81`) would
 *   collapse and disappear. An EXPLICIT `h-[var(--size-card-h)]` has no such
 *   auto-minimum collapse: the height stays 256px at EVERY width while only the
 *   WIDTH narrows with the column (height-stable, so the strip keeps its full 64px
 *   and all CONFIRMED metadata stays visible). Zero horizontal overflow still holds
 *   (`w-full` + fluid cover + `overflow-hidden`), satisfying responsive 1440→1280.
 */
const CARD_BASE =
  'relative flex h-[var(--size-card-h)] w-full min-w-0 flex-col overflow-hidden ' +
  'cursor-pointer select-none outline-none ' +
  'motion-safe:transition motion-safe:duration-200 motion-safe:ease-out';

/**
 * SELECTED state: a 2px accent stroke in the exact Figma selection color
 * (`--border-accent` = rgba(123,97,255,0.6)). A `ring` (box-shadow) is used so
 * the stroke sits flush on the card edge WITHOUT a layout shift between states
 * (the `GlassCard` border-box dimensions are unchanged). Paired at runtime with
 * a `CheckBadge` in the top-right corner.
 */
const CARD_SELECTED = 'ring-2 ring-[color:var(--border-accent)]';

/**
 * UNSELECTED hover affordance: a subtle accent tint of the `GlassCard` hairline
 * (the `--color-accent` token at 40% opacity). Tailwind v4 gates the `hover`
 * variant behind `@media (hover: hover)`, so touch devices never get a sticky
 * hover. Applied only when NOT selected (the selected ring owns that state).
 */
const CARD_HOVER = 'hover:border-[color:var(--color-accent)]/40';

/**
 * Keyboard focus indicator: a token-colored ring shown ONLY for keyboard users
 * (`:focus-visible`, never on mouse press). Applied in both states; when the
 * card is also selected, this later focus-visible color simply takes over the
 * ring on focus.
 */
const CARD_FOCUS =
  'focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]';

/**
 * Info-strip container — the lower band beneath the cover (a separate sibling,
 * matching Figma `3:81`). `flex-1` lets it absorb any residual height when the
 * grid row stretches the card taller than its content (so the strip fills rather
 * than leaving a gap), while in the normal content-driven case it simply takes
 * its natural height. `min-h-0` is deliberately OMITTED: with the content-driven
 * card height (see {@link CARD_BASE}'s BLITZY [RESPONSIVE] note) the strip must
 * never be allowed to collapse below its content, so its automatic minimum size
 * is preserved. `overflow-hidden` bounds the clamped title/author text.
 */
const INFO_STRIP = 'flex flex-1 flex-col gap-u2 px-u12 py-u8 overflow-hidden';

/**
 * Info-strip card title: the small per-card title (`--text-card-title`, Inter
 * 600 11px/15px) in the primary text token, clamped to at most two lines with
 * long-word breaking so it never overflows the strip horizontally.
 */
const TITLE_CLASS = 'text-card-title text-text-primary line-clamp-2 break-words';

/** The author ↔ format row: author on the left, `FormatBadge` on the right. */
const META_ROW = 'flex items-center justify-between gap-u8 min-w-0';

/**
 * Author line: the secondary `--text-meta-label` (Inter 400 10px) in the muted
 * text token, single-line truncated (`truncate` + `min-w-0` so it can shrink
 * beside the non-shrinking badge).
 */
const AUTHOR_CLASS = 'text-meta-label text-text-muted truncate min-w-0';

/**
 * Maximum tag chips shown in a card's metadata band before the remainder
 * collapses into a muted "+N" indicator. The grid card is intentionally narrow
 * (~158px of content inside the 182px card), so a SINGLE chip + "+N" keeps the
 * tags row from overflowing its track — the same overflow strategy the PASSED
 * `BookListRow` uses (there with 2, here with 1 for the tighter card).
 */
const MAX_VISIBLE_TAGS = 1;

/**
 * A trailing muted meta VALUE (the formatted date and the formatted size).
 * `shrink-0` so the value is never clipped beside the left-hand content; the
 * `--text-meta-label` (Inter 400 10px) role token in the muted text token.
 */
const META_VALUE_CLASS = 'shrink-0 text-meta-label text-text-muted';

/**
 * The tags cluster inside the metadata band: hugs its chips (`flex gap-1`),
 * `min-w-0` + `overflow-hidden` so a long tag/chip is CLIPPED rather than forcing
 * horizontal overflow of the narrow card (mirrors the `BookListRow` tags cell).
 */
const TAGS_WRAP = 'flex min-w-0 items-center gap-u4 overflow-hidden';

/** The muted "+N" hidden-tag overflow indicator; `shrink-0` so it never clips. */
const TAG_OVERFLOW_CLASS = 'shrink-0 text-meta-label text-text-muted';

/**
 * BookCard — one selectable cover card for the App 02 Cover Grid.
 *
 * Renders the book's generated cover, a full-metadata info strip (title, author,
 * format, rating, date-added, tags, and size — R6), and — when selected — a 2px
 * accent stroke plus a `CheckBadge`. Clicking or pressing Enter/Space toggles the
 * book's membership in the shared selection (the route to batch mode). All
 * styling is token-backed and the card is fully keyboard accessible.
 *
 * @param props - {@link BookCardProps}
 * @returns The rendered selectable book card.
 */
function BookCardComponent({ book }: BookCardProps) {
  const { isSelected, toggleSelect } = useLibrary();
  const selected = isSelected(book.id);

  /** Toggle this book's selection (click path). */
  const handleClick = (): void => {
    toggleSelect(book.id);
  };

  /**
   * Keyboard activation: Enter and Space both toggle selection (matching the
   * native button contract for a `role="button"` element). Space's default
   * (page scroll) is prevented. `'Spacebar'` is the legacy key value some older
   * engines emit for the space key.
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      toggleSelect(book.id);
    }
  };

  // Compose the token-backed card classes: base + focus ring + (selected ring
  // OR unselected hover). Selected and unselected are mutually exclusive so the
  // selected ring is never diluted by the hover border change.
  const cardClassName = [
    CARD_BASE,
    CARD_FOCUS,
    selected ? CARD_SELECTED : CARD_HOVER,
  ].join(' ');

  // COMPREHENSIVE accessible name for the toggle button. The inner cover and the
  // entire info strip are `aria-hidden` (see the render), so this label is the
  // card's SOLE announcement — it therefore mirrors the key visible info (title,
  // author, format, rating) rather than the title alone. Selection state is
  // conveyed separately by `aria-pressed`. This resolves the QA "card
  // label-content-name mismatch" finding: with no exposed inner text, the card's
  // accessible name can no longer diverge from its (now hidden) visible content,
  // and WCAG 2.5.3 still holds because the name contains the visible title (so
  // voice control "click Dune" matches). Rating uses the raw 0–5 value (e.g.
  // "4.5") to read naturally; an empty author is guarded so we never emit " by ".
  const ratingText = `rated ${book.rating} of 5 stars`;
  const ariaLabel = book.author
    ? `${book.title} by ${book.author}, ${book.format}, ${ratingText}`
    : `${book.title}, ${book.format}, ${ratingText}`;

  // Tags band: show up to MAX_VISIBLE_TAGS chips, then collapse the rest into a
  // single muted "+N" indicator so the narrow card never overflows its track
  // (same overflow strategy as the PASSED BookListRow).
  const visibleTags = book.tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = book.tags.length - visibleTags.length;

  return (
    <GlassCard
      surface="card"
      bordered
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cardClassName}
    >
      {/* Cover area (Figma 3:82) — generated placeholder, NEVER real art. The
          `md` preset is FLUID-WIDTH with a fixed 192px height: it fills the card
          column EXACTLY (= the Figma 182px width at the 1440 baseline via the
          `CoverGrid` track) and shrinks WITH the card below 1440. `shrink-0`
          pins its 192px height (the main-axis size in this flex-COLUMN) so the
          cover never compresses — guaranteeing cover (192px) + info strip (64px)
          = the exact 256px card. The card's `overflow-hidden` clips it to the
          rounded card bounds. `decorative` removes the cover from the a11y tree
          (the card's own `aria-label` is the sole announcement) so its title
          overlay does not duplicate into the card's accessible name. */}
      <BookCoverPlaceholder book={book} size="md" className="shrink-0" decorative />

      {/* Info strip (lower band) — small title, then the full-metadata band:
          author ↔ format, rating ↔ date-added, and tags ↔ size (R6 — every
          surface a book appears on renders its full metadata). Each row uses the
          justified `META_ROW` layout with `min-w-0` truncation so the narrow card
          never forces horizontal overflow as the grid degrades 1440 → 1280.
          `aria-hidden`: the strip is the card's VISIBLE content but is removed
          from the a11y tree — the card's comprehensive `aria-label` already
          conveys this information, so exposing the strip's text would make the
          card's visible inner content diverge from its accessible name (the
          resolved QA `label-content-name-mismatch` finding). The full metadata
          remains visually present and is announced verbatim on the App 01 list
          rows and the detail/metadata panels, which are not nested controls. */}
      <div className={INFO_STRIP} aria-hidden="true">
        <span className={TITLE_CLASS}>{book.title}</span>

        {/* Author ↔ format. `Book.format` is a plain string per the verbatim
            contract; narrow it to the badge's `FormatKind` union at this boundary. */}
        <div className={META_ROW}>
          <span className={AUTHOR_CLASS}>{book.author}</span>
          <FormatBadge format={book.format as FormatKind} className="shrink-0" />
        </div>

        {/* Rating ↔ date-added. Amber display stars on the left; the formatted
            acquisition date on the right. Per AAP §0.3.3 the StarRating component
            has a SINGLE 14px spec (no compact card variant is documented), so the
            per-book card rating uses the 14px default — identical to the
            detail-panel (2:348) and list-row stars. (CP4 fidelity fix for the QA
            "card mini-star 12px vs detail-panel 14px" finding; the prior size={12}
            override was an uncited deviation from the AAP's stated size.) */}
        <div className={META_ROW}>
          <StarRating value={book.rating} size={14} />
          <span className={META_VALUE_CLASS}>{formatDate(book.date)}</span>
        </div>

        {/* Tags ↔ size. Up to MAX_VISIBLE_TAGS chips + a muted "+N" overflow on
            the left; the formatted file size on the right. */}
        <div className={META_ROW}>
          <div className={TAGS_WRAP}>
            {visibleTags.map((tag) => (
              <TagPill key={tag} label={tag} className="shrink-0" />
            ))}
            {hiddenTagCount > 0 ? (
              <span className={TAG_OVERFLOW_CLASS}>+{hiddenTagCount}</span>
            ) : null}
          </div>
          <span className={META_VALUE_CLASS}>{formatFileSize(book.sizeBytes)}</span>
        </div>
      </div>

      {/* Selection marker (Figma 3:89/3:90) — only on selected cards, inset in
          the top-right corner. Decorative (aria-hidden inside the primitive);
          the accessible selected state is `aria-pressed` on the card. */}
      {selected ? (
        <CheckBadge checked className="absolute right-u8 top-u8 z-10" />
      ) : null}
    </GlassCard>
  );
}

/**
 * BookCard — the `React.memo`-wrapped public component.
 *
 * The only prop, `book`, is a referentially-STABLE object from the static
 * `@/data/books` dataset, so the default shallow prop comparison makes a card
 * re-render only when its own selection state actually changes — when the grid
 * PAGE re-renders for reasons unrelated to this card's selection, memo skips the
 * 15 cards' work. (Selection toggles still re-render the cards that subscribe to
 * the changed library Context value, which is correct.) Combined with the
 * stable-reference {@link getCoverPalette} memo, this trims the redundant
 * synchronous render work behind the QA "/grid initial-render long task"
 * finding. The wrapped inner function is named so it keeps a clean React
 * DevTools display name.
 *
 * @see getCoverPalette in `@/lib/covers` — the companion stable-reference memo.
 */
export const BookCard = memo(BookCardComponent);

export default BookCard;
