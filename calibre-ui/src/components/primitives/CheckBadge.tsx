/**
 * ==========================================================================
 * Calibre-UI Design System — CheckBadge
 * The small circular "selected" indicator (multi-select / active marker).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `CheckBadge` is one of the 14 bespoke design-system primitives (AAP §0.3.3 /
 * §0.4.2) for the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * It is the small gradient-filled check disc that signals SELECTION state:
 *   • App 02 — Cover Grid: it sits in the inset top-right corner of every
 *     SELECTED book card (the visual signal for multi-select), composed by
 *     `BookCard`.
 *   • App 06 — Preferences: it marks the ACTIVE viewer-theme swatch, composed
 *     by `ThemeSwatch`.
 * Both callers render `<CheckBadge checked />`, so this primitive keeps the
 * check disc identical everywhere it appears.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reproduces the CONFIRMED "Check" container `3:89` and its `✓` glyph child
 * `3:90` (reconciled via analyze_figma_node against the full-screen render of
 * App 02 `3:2`, where the Dune and Foundation cards are selected):
 *   • container `3:89` → 20×20 px, fill `--gradient-accent`
 *     (linear-gradient(-45deg, #7B61FF 0% → #A78BFA 100%); lighter #A78BFA
 *     toward the top-left, #7B61FF toward the bottom-right), radius 10px on a
 *     20px box = a PERFECT CIRCLE, NO stroke, no shadow, opacity 1.
 *   • glyph `3:90` → the character "✓" (U+2713 CHECK MARK — NOT the heavy
 *     U+2714, the emoji U+2705, nor the ballot U+2611), Inter Bold (700), 11px,
 *     pure #FFFFFF, centered.
 * Figma seats the glyph with a 4px top offset on a 16px text box to achieve
 * optical centering; per the design-system centering rule this primitive
 * instead centers the glyph geometrically with `flex items-center
 * justify-center` (the asymmetric Figma auto-layout offset is an artifact, not
 * intent — the rendered image confirms a centered ✓).
 *
 * NOTE — the accent gradient, NOT the CTA gradient: the disc uses
 * `--gradient-accent` (ends in the lighter `--color-accent-light` #A78BFA),
 * which is distinct from the primary-button `--gradient-cta` (ends in the
 * darker `--color-accent-indigo` #4838C8). Using the wrong gradient is the
 * single easiest mistake here, so it is called out explicitly.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / radius / size value resolves to an `@theme` token declared in
 * `src/app/globals.css`, consumed through a Tailwind v4 utility (`rounded-full`
 * keyword for the circle) or a CSS-variable arbitrary value
 * (`bg-[image:var(--gradient-accent)]` for the fill,
 * `border-[var(--border-white-09)]` for the unchecked ring,
 * `text-[length:var(--text-window-title)]` for the 11px glyph size). The 11px
 * `--text-window-title` token supplies ONLY the font-size here — its companion
 * weight (500) is intentionally bypassed in favor of `font-bold` (700) to match
 * the Figma "Inter Bold" glyph, which is why the size is read via `var()` rather
 * than the bare `text-window-title` utility (that utility would also force
 * weight 500 and fight `font-bold`). There are NO raw hex / rgba literals; the
 * only bare literals are the permitted `transparent` keyword and the
 * design-sanctioned `text-white` keyword for the pure-#FFFFFF glyph.
 *
 * RENDERING MODEL
 * --------------------------------------------------------------------------
 * This is a PURE PRESENTATIONAL component: it holds no state, runs no hooks,
 * and binds no event handlers. It therefore deliberately carries NO
 * `'use client'` directive and is safe to render inside React Server Components
 * (the App Router default) — which is exactly why both `BookCard` (App 02) and
 * `ThemeSwatch` (App 06) can compose it freely regardless of their own
 * client/server boundary.
 *
 * The badge is DECORATIVE: the authoritative selection semantics live on the
 * parent control (e.g. `aria-selected` / `aria-checked` on the card or swatch),
 * so the badge is marked `aria-hidden` to stop a screen reader announcing a
 * stray "check mark" glyph. This is invisible accessibility (no visual impact)
 * and never conflicts with the Figma design.
 *
 * UNCHECKED STATE (documented design choice)
 * --------------------------------------------------------------------------
 * The Figma design only ever renders the badge on SELECTED items (unselected
 * cards/swatches simply omit it). To make this primitive STATE-COMPLETE rather
 * than coupling its existence to a caller condition, `checked={false}` renders a
 * graceful, subtle OUTLINE RING (same 20×20 circle, transparent fill, 1px
 * white-9% hairline) instead of returning `null`. Callers that only want the
 * badge to appear while selected may simply mount it conditionally
 * (`{selected && <CheckBadge checked />}`) and never see the ring — the choice
 * is intentionally left to the parent.
 *
 * USAGE
 * --------------------------------------------------------------------------
 *   // Selected grid card — absolutely positioned in the cover's top-right:
 *   <CheckBadge checked className="absolute top-2 right-2" />
 *
 *   // Active viewer-theme swatch marker:
 *   <CheckBadge checked />
 *
 *   // State-complete usage (renders the subtle outline ring when not active):
 *   <CheckBadge checked={isActive} />
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/library/
 * alternate_views.py` (the Qt cover-grid multi-select view — `get_selected_ids`,
 * `handle_selection_click`, `render_emblem` — whose selected-cover emblem this
 * badge is the web analog of). Nothing is imported or translated from the
 * Python codebase.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import type { JSX } from 'react';

/**
 * Props for {@link CheckBadge}.
 *
 * Intentionally minimal (exactly the AAP §0.3.3 contract): the badge is a tiny,
 * fully presentational marker, so it deliberately does NOT extend the native
 * element attribute set — its only inputs are the selection state and an
 * optional `className` for parent-supplied positioning.
 */
export interface CheckBadgeProps {
  /**
   * Selection state.
   *   • `true`  → filled accent-gradient disc with a centered white "✓".
   *   • `false` → a subtle outline ring (see "Unchecked state" in the file
   *     header for why this renders a ring rather than `null`).
   */
  checked: boolean;
  /**
   * Optional extra classes, merged AFTER the base classes so caller utilities
   * win on conflicts. Typically used by the parent to POSITION the badge (e.g.
   * `absolute top-2 right-2` over a cover card).
   */
  className?: string;
}

/**
 * Base classes shared by both states: a 20×20 px (`h-5 w-5` = 1.25rem),
 * perfectly-round (`rounded-full`), centered inline-flex box so the glyph is
 * geometrically centered (per the design-system centering rule). `select-none`
 * keeps the decorative glyph from being text-selected.
 */
const BASE_CLASSES =
  'inline-flex h-u20 w-u20 items-center justify-center rounded-full select-none';

/**
 * Checked fill: the ACCENT gradient (`--gradient-accent`), applied as a
 * `background-image` via the arbitrary-value utility. Figma node `3:89` has NO
 * stroke in the selected state, so this state adds the fill ONLY (no border).
 */
const CHECKED_CLASSES = 'bg-[image:var(--gradient-accent)]';

/**
 * Unchecked ring: a transparent disc with a 1px white-9% hairline
 * (`--border-white-09`), matching the design system's hairline convention.
 * `transparent` is one of the few literals the zero-hardcoded rule permits.
 */
const UNCHECKED_CLASSES = 'border border-[var(--border-white-09)] bg-transparent';

/**
 * The "✓" glyph typography: pure white (`text-white`, the sanctioned keyword
 * for Figma's #FFFFFF), Inter Bold (`font-bold` = 700 — overriding the 500 that
 * the `--text-window-title` role otherwise carries), token-backed 11px size
 * (`text-[length:var(--text-window-title)]`), and `leading-none` so the glyph
 * adds no stray vertical line-box height that would fight the flex centering.
 */
const GLYPH_CLASSES =
  'text-white font-bold leading-none text-[length:var(--text-window-title)]';

/**
 * The check character — U+2713 CHECK MARK (Figma glyph `3:90`). Declared as an
 * explicit unicode escape so the exact codepoint is unambiguous and encoding
 * independent (it is NOT U+2714 heavy check, U+2705 emoji, or U+2611 ballot).
 */
const CHECK_GLYPH = '\u2713';

/**
 * CheckBadge — the bespoke design-system selection check badge primitive.
 *
 * Renders a single 20×20 px circular `<span>`. When `checked`, the circle is
 * filled with the accent gradient and contains a centered white bold "✓";
 * otherwise it renders a subtle white-9% outline ring (state-complete, see the
 * file header). The caller `className` is merged AFTER the base/state classes
 * (so caller positioning/overrides win), and the whole badge is `aria-hidden`
 * because the parent control owns the accessible selection semantics.
 *
 * @param props - {@link CheckBadgeProps}
 * @returns The rendered badge element.
 */
export function CheckBadge({ checked, className }: CheckBadgeProps): JSX.Element {
  // Compose token-backed classes: base + the active state's classes + any
  // caller className (last so it wins on conflicts). `filter(Boolean)` drops an
  // absent className before joining, keeping the array a clean `string[]`.
  const merged = [
    BASE_CLASSES,
    checked ? CHECKED_CLASSES : UNCHECKED_CLASSES,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={merged} aria-hidden="true">
      {checked ? <span className={GLYPH_CLASSES}>{CHECK_GLYPH}</span> : null}
    </span>
  );
}

export default CheckBadge;
