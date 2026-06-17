'use client';

/**
 * ==========================================================================
 * Calibre-UI — ReaderNavStrip
 * The App 03 E-book Viewer bottom chapter-navigation strip (Figma node `4:95`).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ReaderNavStrip` is the persistent bottom bar of the E-book Viewer screen
 * (App 03 — Figma node `4:2`, strip node `4:95`) in the UI-only Calibre
 * e-book-manager prototype (Next.js 15 App Router · React 19 · TypeScript 5
 * strict · Tailwind CSS v4 CSS-first `@theme` tokens). It is a single, full-
 * width horizontal bar pinned beneath the reading row, carrying exactly two
 * controls: a "← Previous" button at the left edge and a "Next →" button at the
 * right edge (AAP §0.3.1 Workflow 2 — "NavStrip (`4:95`, 1440×44) with
 * ← Previous / Next →"). Clicking them STEPS the reader one chapter at a time
 * (AAP §0.7.4 — "the bottom nav strip steps chapters"); the change is reflected
 * live in the ReadingArea body and the Table-of-Contents current row, because
 * all three read the same `currentChapterIndex` from `ReaderProvider`.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The strip subscribes to reader state via the `useReader()` Context hook and
 * binds `onClick` handlers to the chapter-stepping actions — both client-only
 * concerns (App Router components default to Server Components, which cannot use
 * hooks or attach event handlers). The directive is the very first line of the
 * file, before any import.
 *
 * STATE — READ-THROUGH, NO LOCAL STATE
 * --------------------------------------------------------------------------
 * Everything comes from `ReaderProvider` via {@link useReader}; the strip holds
 * NO state of its own. It calls `prevChapter()` / `nextChapter()`, which the
 * provider CLAMPS to the valid `[0, chapters.length - 1]` range — so a click at
 * either end is a safe no-op (zero console errors). The strip's ONLY side effect
 * is invoking those two provider actions (UI-only; no I/O, no navigation, no
 * other mutation).
 *
 * FIGMA SOURCE OF TRUTH — `4:95` (parent screen `4:2`)
 * --------------------------------------------------------------------------
 * The Figma reconciliation subagent (`analyze_figma_node`) was UNAVAILABLE
 * during this implementation session, so per the precedence rules the
 * AAP-authoritative description governs (a reachable Figma would override only
 * the values it confirms). The AAP fixes the strip as a 1440×44 bottom bar with
 * the two edge controls "← Previous" and "Next →"; this file reproduces that
 * exactly and is re-verified at runtime against screen `4:2` via
 * `compare_screenshot_with_figma`.
 *   • Bar — full width, 44px tall (`w-full h-11`), a surface fill, and a single
 *     1px TOP hairline separating it from the reading row above.
 *   • Controls — the `←` / `→` are unicode TEXT glyphs rendered via Inter, NEVER
 *     asset files (AAP §0.3.4 — Asset Inventory = 0). The arrow leads the label
 *     on "Previous" and trails it on "Next".
 *   • No center label — the AAP lists only the two edge controls for `4:95`, so
 *     none is rendered (no hallucinated elements; AAP §0.3 / the file brief win
 *     on scope).
 *
 * BLITZY [COLOR] (bar fill): the exact surface token (`--color-surface-1`
 * #10132A vs `--color-surface-2` #13162E) could not be subagent-confirmed.
 * `--color-surface-1` is used — it is the file brief's primary suggestion and
 * the app-wide chrome surface (the shell `TopToolbar` uses the same token), and
 * both candidates sit one step apart within the same dark-navy family. Swap to
 * `--color-surface-2` if a reachable Figma later confirms it.
 *
 * NEXT-BUTTON TRAILING GLYPH (design-fidelity refinement)
 * --------------------------------------------------------------------------
 * The `Button` primitive renders its optional `icon` to the LEFT of the label
 * only (it has no trailing-icon slot). To honor the design's "Next →" (arrow to
 * the RIGHT of the label) while composing ONLY from the primitive (no raw
 * `<button>`, no third-party control), the `→` is carried inside the Next
 * button's visible `label` ("Next →"), and an explicit `aria-label="Next"`
 * (forwarded onto the underlying `<button>` via the primitive's `...rest`) keeps
 * the accessible name clean. "Previous" instead uses the primitive's `icon` prop
 * for its leading `←`, which the primitive renders `aria-hidden`, so its
 * accessible name is simply "Previous".
 *
 * DISABLED-AT-BOUNDS (graceful end-of-book affordance)
 * --------------------------------------------------------------------------
 * "Previous" is `disabled` on the first chapter and "Next" on the last, via the
 * primitive's native `disabled` prop (which dims the control, sets a not-allowed
 * cursor, and suppresses the click). This is purely an affordance — the provider
 * clamps regardless — and it is INVISIBLE at the seeded reading position (chapter
 * index 2 of 7, the 29% the viewer shows), so it never alters the resting frame
 * the design depicts; it only engages once the reader actually reaches an end.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / BORDER value resolves to an `@theme` token from
 * `src/app/globals.css`, consumed via a CSS-variable arbitrary value
 * (`bg-[var(--color-surface-1)]`, `border-[var(--border-white-07)]`). The two
 * controls' fills, borders, radius, text color, and typography all live INSIDE
 * the `Button` `variant="secondary"` primitive and are not re-specified here.
 * The only bare utilities are Tailwind's standard layout / spacing scale
 * (`flex`, `h-11`, `w-full`, `min-w-0`, `items-center`, `justify-between`,
 * `px-4`) — none carry color information.
 *
 * RESPONSIVE (1440 → 1280, zero horizontal overflow — AAP §0.9)
 * --------------------------------------------------------------------------
 * The bar is `w-full` (NEVER a fixed 1440px). `justify-between` pins the two
 * compact buttons to the left and right edges with ample slack between them
 * across the supported range, and `min-w-0` lets the row shrink cleanly in any
 * narrow edge case, so the strip never triggers horizontal scrolling.
 *
 * ACCESSIBILITY
 * --------------------------------------------------------------------------
 * • The strip is a semantic `<nav>` landmark with an explicit `aria-label`
 *   (distinguishing it from the app's other navigation regions).
 * • Both controls are real, keyboard-operable `<button>`s (from the primitive),
 *   reachable via Tab and activatable via Enter/Space; the primitive supplies a
 *   token-backed `:focus-visible` ring.
 * • The directional glyphs are decorative: the `←` is `aria-hidden` (the
 *   primitive hides the `icon`), and the `→` baked into the Next label is
 *   superseded by `aria-label="Next"`, so screen readers announce clean
 *   "Previous" / "Next" names.
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * --------------------------------------------------------------------------
 * Calibre's desktop viewer toolbar (`src/calibre/gui2/viewer/toolbars.py`)
 * models `previous` / `next` page-turn actions synced to reader state; this
 * prototype maps that concept to chapter stepping. NO Python/Qt code is
 * imported, translated, or executed — the parallel is conceptual only.
 *
 * @see src/state/ReaderProvider — the `useReader()` reader Context (state + actions).
 * @see src/components/primitives/Button — the action primitive these controls use.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.1 (Workflow 2) / §0.3.2 / §0.7.4 — strip spec, tokens, App 03.
 * @see src/calibre/gui2/viewer/toolbars.py — Calibre viewer prev/next actions (reference only).
 */

import type { JSX } from 'react';
import { useReader } from '@/state/ReaderProvider';
import { Button } from '@/components/primitives/Button';

/**
 * Leading glyph for the "Previous" control — a LEFTWARDS ARROW (U+2190).
 * A unicode TEXT character rendered via Inter, never an asset file (AAP §0.3.4).
 */
const PREV_GLYPH = '\u2190'; // ←

/**
 * Trailing glyph for the "Next" control — a RIGHTWARDS ARROW (U+2192). Baked
 * into the Next label (the `Button` primitive has no trailing-icon slot); a
 * unicode TEXT character rendered via Inter, never an asset file (AAP §0.3.4).
 */
const NEXT_GLYPH = '\u2192'; // →

/**
 * Bar container classes — all color/border values are `@theme` tokens.
 *
 * - `flex items-center justify-between` lays the two controls out on one row and
 *   pins them to the left / right edges (no center child — AAP `4:95`).
 * - `h-11` is the Figma 44px bar height; `w-full` keeps it responsive (never a
 *   fixed 1440px); `min-w-0` lets the row shrink cleanly (no horizontal overflow
 *   1440 → 1280); `px-4` is the comfortable 16px horizontal inset.
 * - `bg-[var(--color-surface-1)]` is the surface fill (see the BLITZY [COLOR]
 *   note in the file header); `border-t border-[var(--border-white-07)]` is the
 *   1px top hairline that separates the strip from the reading row above.
 */
const BAR_CLASSES =
  'flex h-11 w-full min-w-0 items-center justify-between px-4 ' +
  'bg-[var(--color-surface-1)] border-t border-[var(--border-white-07)]';

/**
 * Props for {@link ReaderNavStrip}.
 *
 * Intentionally minimal: the strip reads everything it needs from the reader
 * Context. `className` lets the viewer page / `AppShell` apply layout utilities
 * (e.g. a sticky / self-stretch modifier), merged AFTER the base classes so
 * caller utilities win on conflicts.
 */
export interface ReaderNavStripProps {
  /** Optional extra classes merged onto the bar container (caller wins). */
  className?: string;
}

/**
 * ReaderNavStrip — the E-book Viewer bottom chapter-navigation strip.
 *
 * Renders a semantic `<nav>` bar with a "← Previous" button at the left edge and
 * a "Next →" button at the right edge. Both compose the `Button`
 * `variant="secondary"` primitive and call the reader Context's
 * `prevChapter()` / `nextChapter()` actions, which clamp at the chapter bounds.
 * Each control is `disabled` at its respective end as a graceful affordance. The
 * caller `className` is merged AFTER the base classes so caller utilities win.
 *
 * @param props - {@link ReaderNavStripProps}
 * @returns The rendered bottom navigation strip.
 */
export function ReaderNavStrip({ className }: ReaderNavStripProps): JSX.Element {
  const { prevChapter, nextChapter, currentChapterIndex, chapters } = useReader();

  // Bound flags drive the graceful disabled affordance. The provider clamps
  // regardless, so these only change the control's appearance (and suppress a
  // dead click) at the very first / last chapter — invisible at the seeded
  // reading position, so the resting frame the design depicts is unchanged.
  const isFirstChapter = currentChapterIndex <= 0;
  const isLastChapter = currentChapterIndex >= chapters.length - 1;

  // Merge token-backed base classes with any caller className (appended last so
  // caller utilities win). `filter(Boolean)` drops an absent className.
  const merged = [BAR_CLASSES, className].filter(Boolean).join(' ');

  return (
    <nav className={merged} aria-label="Reader chapter navigation">
      {/* Left edge — step to the previous chapter. The `←` leads the label via
          the primitive's `icon` slot (rendered aria-hidden), so the accessible
          name is simply "Previous". Disabled on the first chapter. */}
      <Button
        variant="secondary"
        icon={PREV_GLYPH}
        label="Previous"
        onClick={() => prevChapter()}
        disabled={isFirstChapter}
      />

      {/* Right edge — step to the next chapter. The `→` TRAILS the label, so it
          is baked into the visible label ("Next →") because the primitive has no
          trailing-icon slot; `aria-label="Next"` keeps the accessible name clean.
          Disabled on the last chapter. */}
      <Button
        variant="secondary"
        label={`Next ${NEXT_GLYPH}`}
        aria-label="Next"
        onClick={() => nextChapter()}
        disabled={isLastChapter}
      />
    </nav>
  );
}
