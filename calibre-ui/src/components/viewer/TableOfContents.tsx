'use client';

/**
 * ==========================================================================
 * Calibre-UI — TableOfContents
 * The App 03 E-book Viewer Table-of-Contents (TOC) panel.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `TableOfContents` is the left chapter-navigation panel of the App 03 E-book
 * Viewer screen (Figma screen `4:2`, this node `4:23`) in the UI-only Calibre
 * e-book-manager prototype (Next.js 15 App Router · React 19 · TypeScript 5
 * strict · Tailwind CSS v4 CSS-first tokens). It lists the opened book's
 * chapters as a flat, scrollable list; the chapter currently being read is
 * highlighted in purple, and clicking any chapter jumps the reader to it.
 *
 * It reads ALL of its data and behavior from `ReaderProvider` via the
 * `useReader()` hook — the seeded 7-chapter list, the current chapter index,
 * and the `goToChapter` action. It owns NO local state and triggers NO side
 * effect other than the `goToChapter` navigation call: it is a pure render of
 * provider state. The reading surface to its right (`ReadingArea`) and the
 * reader tools panel are separate components; this file is the TOC column only.
 * The viewer page composes the three in a horizontal flex row.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The panel consumes a React Context (`useReader()`) and binds an `onClick`
 * handler per row, so it must be a Client Component (App Router components
 * default to Server Components, which cannot run hooks or bind handlers). The
 * directive is the very first line, before any import. The component is
 * SSR-safe: it renders deterministically from the provider's seeded state with
 * no `window`, `Math.random`, `Date.now`, `localStorage`, or mount-time
 * mutation, so the App Router hydrates it with zero hydration warnings.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reproduces node `4:23` (parent screen `4:2`). Every value below is the
 * authoritative AAP §0.3 design value, mapped 1:1 to an `@theme` token:
 *   • TOC surface        → `#13162E` = `--color-surface-2`   → GlassCard `surface="surface-2"`
 *   • Panel hairline     → white @ 7% (`--border-white-07`)  → GlassCard default `bordered`
 *   • Corner radius      → `--radius-card` (10px)            → GlassCard `rounded-card`
 *   • Header label       → "Contents", Inter 600 / 15px / 22px → `text-detail-title`
 *   • Header color       → `#F1F5FF` = `--color-text-primary`  → `text-text-primary`
 *   • Header divider     → white @ 7% bottom hairline (`--border-white-07`)
 *   • Inactive row       → `#94A3B8` = `--color-text-secondary`, Inter 400 / 12px (`text-body`)
 *   • Active (current) row→ "current chapter purple" (AAP §0.7.4): a translucent
 *                           accent fill `bg-accent/15` + `--color-accent-light`
 *                           (`#A78BFA`) label, on an 8px (`--radius-control`) shape
 *   • Width              → 220px in the 1440px design (see WIDTH note below)
 *
 * The default highlighted chapter is the provider's seeded `currentChapterIndex`
 * (`2` → "Chapter 2 — The Long Dark"), which is also the anchor for the viewer's
 * ~29% reading-progress bar (node `4:43`).
 *
 * WIDTH IS FLEXIBLE, NOT A FIXED 220px
 * --------------------------------------------------------------------------
 * The design panel is 220px wide, but a rigid fixed width would force
 * horizontal overflow as the viewport narrows. Instead the panel takes a flex
 * BASIS of 220px via the `--size-toc-basis` token
 * (`basis-[var(--size-toc-basis)]`) with a 192px min-width floor via
 * `--size-toc-min-w` (`min-w-[var(--size-toc-min-w)]`) and is allowed to
 * `shrink`, so the page's flex row keeps the reading area (`flex-1`) absorbing
 * the slack and the 1440→1280 baseline stays horizontal-overflow-free (AAP §0.9
 * "Responsive + clean console"). The basis/min-width VALUES resolve to `@theme`
 * tokens (R3), not hardcoded lengths.
 *
 * BLITZY [FIGMA-TOOL]: `analyze_figma_node(4:23)` was unavailable at build time
 * (persistent upstream service error). Values are sourced from the AAP §0.3
 * authoritative manifest and the reconciled active-nav pattern of the sibling
 * `PreferencesNav` (node `8:15`); runtime fidelity is verified via
 * `compare_screenshot_with_figma` against screen `4:2`.
 *
 * BLITZY [COMPONENT]: a left accent indicator bar on the active row is OMITTED.
 * AAP §0.7.4 specifies only "current chapter purple", and the closest reconciled
 * analog (`PreferencesNav` node `8:15`) confirms NO left bar, so adding one would
 * be a speculative element (DS2-d). The active row's purple fill + accent-light
 * label is the confirmed treatment.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / radius / border / typography value resolves to an `@theme`
 * token from `src/app/globals.css`, consumed via a Tailwind v4 utility
 * (`text-detail-title`, `text-body`, `text-text-primary`, `text-text-secondary`,
 * `text-accent-light`, `bg-accent/15`, `rounded-control`) or a CSS-variable
 * arbitrary value (`border-[var(--border-white-07)]`,
 * `border-[var(--border-white-06)]`, `ring-[var(--border-accent)]`). There are
 * NO raw hex / rgba / px color or radius literals. The only bare values are
 * Tailwind-scale layout/spacing utilities (`px-4`, `py-2`, `gap-0.5`, `h-full`,
 * …) and the panel-width flex lengths noted above, none of which carry
 * design-token color information.
 *
 * COMPOSITION: the design-system imports are the `GlassCard` surface primitive
 * and the `NavRowButton` row primitive (each chapter row composes NavRowButton
 * per R4 — never a raw `<button>`); the `<ul>`/`<li>` list scaffold is standard
 * semantic HTML. No third-party UI library is introduced (AAP §0.4 / prompt).
 *
 * ACCESSIBILITY (UI3 — invisible, always applied)
 * --------------------------------------------------------------------------
 * • The panel is a navigation landmark: `GlassCard` carries `role="navigation"`
 *   and is named by the visible heading via `aria-labelledby` (no desync).
 * • The chapter list is a real `<ul>`/`<li>`; every chapter is a real,
 *   keyboard-operable button via the `NavRowButton` primitive (which renders a
 *   `<button type="button">`, Space/Enter for free) — never a `div`-with-onClick.
 * • The current chapter's button carries `aria-current="true"` so assistive tech
 *   announces the reading position, not color alone (color is never the sole
 *   indicator).
 * • Long titles truncate to one line with an ellipsis and expose the full text
 *   via the native `title` tooltip — design-parity with Calibre's desktop TOC,
 *   whose delegate shows a tooltip only when an item is truncated
 *   (`src/calibre/gui2/viewer/toc.py`, reference only).
 * • A token-backed `:focus-visible` ring (`--border-accent`) is shown for
 *   keyboard users only (invisible at rest, DS2-e); color transitions run only
 *   under `motion-safe` (prefers-reduced-motion: no-preference).
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/viewer/toc.py`
 * (Calibre's Qt `TOCView` — a tree whose current node is emphasized in sync with
 * the reading position, with click-to-jump and truncation tooltips). Nothing is
 * imported or translated from the Python/Qt codebase; the parallel is conceptual.
 *
 * @see @/state/ReaderProvider — the `useReader` reading-state hook consumed here.
 * @see @/components/primitives/GlassCard — the glassmorphic surface primitive.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.1 / §0.3.2 / §0.7.4 — App 03 viewer + token manifest.
 * @see src/calibre/gui2/viewer/toc.py — Calibre viewer TOC (reference only).
 */

import { type JSX } from 'react';
import { useReader } from '@/state/ReaderProvider';
import { GlassCard } from '@/components/primitives/GlassCard';
import { NavRowButton } from '@/components/primitives/NavRowButton';

/**
 * Props for {@link TableOfContents}.
 *
 * No props are required — the panel sources everything from `useReader()`. The
 * optional `className` is merged onto the root `GlassCard` AFTER the component's
 * own layout classes, letting the viewer page tune the panel's placement within
 * its flex row without the component hard-coding page-level layout.
 */
export interface TableOfContentsProps {
  /** Optional extra classes merged onto the root surface for page layout. */
  className?: string;
}

/**
 * Join class fragments, dropping any falsy entries (`false` / `undefined` / '').
 * Mirrors the in-repo primitive convention (e.g. `GlassCard`, `PreferencesNav`)
 * for composing a base class string with conditional per-state classes.
 */
function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/* --------------------------------------------------------------------------
 * Token-backed class strings (module scope so they are allocated once).
 * Every value resolves to an `@theme` token; the only bare values are
 * Tailwind-scale layout/spacing utilities and the panel-width flex lengths,
 * which carry no design-token color information.
 * ------------------------------------------------------------------------ */

/**
 * Root surface layout passed to `GlassCard` (which supplies the `surface-2`
 * fill, the white@7% hairline, the `radius-card`, and the backdrop blur):
 * a full-height vertical flex column whose width is the design's 220px as a
 * flex BASIS (`basis-[var(--size-toc-basis)]`) with a 192px floor
 * (`min-w-[var(--size-toc-min-w)]`) and a
 * leading `shrink` so the sibling reading area absorbs all flex slack
 * (1440→1280 with zero horizontal overflow). `min-h-0` lets the inner list be
 * the scroll container; `overflow-hidden` clips the rounded corners.
 */
const ROOT =
  'flex h-full min-h-0 shrink basis-[var(--size-toc-basis)] min-w-[var(--size-toc-min-w)] flex-col overflow-hidden';

/**
 * Header band: never shrinks, a bottom white@7% hairline divider, and balanced
 * inset padding. Holds the section heading.
 */
const HEADER = 'shrink-0 border-b border-[var(--border-white-07)] px-4 py-3';

/** Section heading: Inter 600 / 15px / 22px (`text-detail-title`), near-white. */
const HEADING = 'truncate text-detail-title text-text-primary';

/**
 * Chapter `<ul>`: the flexible scroll region (`flex-1` + `min-h-0` +
 * `overflow-y-auto`) so the list scrolls when chapters exceed the panel height
 * while the header stays pinned. A small `gap-0.5` keeps adjacent active/hover
 * row fills from visually merging.
 */
const LIST = 'flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2';

/**
 * Per-context chapter-row classes layered onto the {@link NavRowButton}
 * primitive (R4). NavRowButton supplies the row SEMANTICS and the variant-
 * invariant base (`w-full text-left cursor-pointer select-none`, the token
 * `:focus-visible` ring, and the `motion-safe` color transition); this string
 * adds only the TOC-specific layout/type: a single-line truncating block
 * (`block truncate`) with an 8px corner radius (`rounded-control`) for the
 * active/hover fill shape, comfortable padding, and the 12px/400 body type
 * (`text-body`). The per-state class below adds color (+ the active fill).
 */
const ROW_BASE = 'block truncate rounded-control px-3 py-2 text-body';

/**
 * Active (current) chapter: the "current chapter purple" treatment (AAP §0.7.4)
 * — an accent@15% translucent fill with the accent-light (`#A78BFA`) label. The
 * font weight is unchanged from the inactive row so activation never reflows the
 * text (the emphasis is purely color + fill).
 */
const ROW_ACTIVE = 'bg-accent/15 text-accent-light';

/**
 * Inactive chapter: the secondary slate label that, on hover (Tailwind v4 gates
 * `hover:` behind `@media (hover: hover)`), brightens to the primary text color
 * over a subtle white@6% wash.
 */
const ROW_INACTIVE =
  'text-text-secondary hover:bg-[var(--border-white-06)] hover:text-text-primary';

/** Stable id linking the heading to the navigation landmark's accessible name. */
const HEADING_ID = 'viewer-toc-heading';

/**
 * TableOfContents — the App 03 E-book Viewer chapter-navigation panel.
 *
 * Renders the "Contents" heading above a scrollable list of the opened book's
 * chapters (sourced from `useReader()`). The chapter whose index equals the
 * provider's `currentChapterIndex` is highlighted in purple and marked
 * `aria-current="true"`; clicking any chapter calls `goToChapter(index)` to move
 * the reader there. Rows are keyed by each chapter's stable `id` (not the array
 * index), truncate long titles to one line, and expose the full title via a
 * native `title` tooltip.
 *
 * @param props - {@link TableOfContentsProps} (all optional).
 * @returns The rendered TOC navigation panel.
 */
export function TableOfContents({ className }: TableOfContentsProps = {}): JSX.Element {
  const { chapters, currentChapterIndex, goToChapter } = useReader();

  return (
    <GlassCard
      surface="surface-2"
      role="navigation"
      aria-labelledby={HEADING_ID}
      className={cx(ROOT, className)}
    >
      <div className={HEADER}>
        <h2 id={HEADING_ID} className={HEADING}>
          Contents
        </h2>
      </div>

      <ul className={LIST}>
        {chapters.map((chapter, index) => {
          const isActive = index === currentChapterIndex;
          return (
            <li key={chapter.id}>
              <NavRowButton
                active={isActive}
                onClick={() => goToChapter(index)}
                title={chapter.title}
                className={cx(ROW_BASE, isActive ? ROW_ACTIVE : ROW_INACTIVE)}
              >
                {chapter.title}
              </NavRowButton>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
