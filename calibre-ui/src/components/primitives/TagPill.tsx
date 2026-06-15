'use client';

/**
 * ==========================================================================
 * Calibre-UI Design System — TagPill
 * The rounded translucent-purple tag chip (display + removable variants).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `TagPill` is one of the 14 bespoke design-system primitives (AAP §0.3.3 /
 * §0.4.2) for the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * It is the rounded translucent-purple "tag" chip used wherever a tag/genre is
 * shown:
 *   • App 01/02 — the LEFT SIDEBAR tag browser (Sci-Fi, Fantasy, Classic, …)
 *     and the per-row / per-card tag cells in the library table and grid info
 *     strips (DISPLAY form — no remove control).
 *   • App 07 — the Metadata Editor modal's "Tags" chip editor, where every tag
 *     is a REMOVABLE pill carrying a small "×" remove control (REMOVABLE form).
 * Screen code must NEVER hand-roll a tag chip; it always composes this
 * primitive so the pill shape, translucent-purple wash, accent-light label, and
 * remove affordance stay identical everywhere a tag appears.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The REMOVABLE form renders a real, interactive `<button>` that binds an
 * `onClick` → `onRemove` handler, so the component is a Client Component (App
 * Router components default to Server Components, which cannot attach event
 * handlers). Making the WHOLE component a client component (directive on the
 * very first line, before any import) avoids a server/client split — the
 * DISPLAY form holds no state and works perfectly inside a client component,
 * and its output is SSR-deterministic, so it hydrates without warnings.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node against App 01 sidebar (`2:36`, parent
 * screen `2:2`) and the App 07 Metadata Editor modal (`9:9`). The design uses
 * TWO visually-distinct tag treatments, which this primitive reconciles into a
 * SINGLE canonical, fully-token-backed look (see "ONE CANONICAL LOOK" below):
 *   • SIDEBAR display chips (`2:54`–`2:65`): radius 100px (full pill), height
 *     22px, a SOLID baked fill `#1D2148`, a 1px white-7% stroke, and an
 *     Inter Regular 10px `#94A3B8` (slate) label — NO count, NO icon.
 *   • METADATA removable pills (`9:82`/`9:86`/`9:90`/`9:94`/`9:98`): radius
 *     100px (full pill), height 22px, fill `rgba(123,97,255,0.18)` = the accent
 *     `#7B61FF` @ 18%, a 1px `rgba(123,97,255,0.3)` (accent @ 30%) stroke, an
 *     Inter Medium 500 10px `#A78BFA` (accent-light) label, 8px left inset, and
 *     a trailing "×" remove glyph (`#A78BFA`) in a 12×12 hit area.
 *
 * ONE CANONICAL LOOK (design-system reconciliation — AAP §0.3.3 / §0.4.5)
 * --------------------------------------------------------------------------
 * The AAP §0.3.3 component inventory defines TagPill as a single "rounded
 * translucent purple chip", the agent contract exposes NO style/variant prop
 * (only `removable`), and the zero-hardcoded rule (below) FORBIDS the sidebar's
 * baked literal `#1D2148` / `#94A3B8` hexes. This primitive therefore renders
 * the TOKEN-BACKED translucent-purple ACCENT treatment — the exact Figma values
 * of the METADATA pill — for BOTH forms, so every tag chip across the app reads
 * as the same accent-purple pill. Callers that need a bespoke per-context tint
 * use the `className` escape hatch (merged last, so it wins). The sidebar's
 * baked-hex divergence is intentionally canonicalized — see the BLITZY [COLOR]
 * flag below.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR resolves to an `@theme` token declared in `src/app/globals.css`,
 * consumed through a Tailwind v4 utility or a CSS-variable arbitrary value:
 *   • fill   → `bg-accent/20`   (`--color-accent` #7B61FF @ 20% — the metadata
 *              pill's Figma fill is 18%; 20% is the nearest clean step and is
 *              inside the AAP-specified `/15`–`/20` target range; the ≤2-point
 *              difference is imperceptible. Opacity-modifier pattern proven by
 *              the sibling `Button` primitive's `bg-danger/10` · `bg-danger/20`).
 *   • border → `border-accent/30` (`--color-accent` @ 30% — EXACTLY the Figma
 *              metadata stroke `rgba(123,97,255,0.3)`; preferred over the 60%
 *              `--border-accent` alias the prompt suggested, because Figma
 *              precedence pins 30%. Pattern proven by `Button`'s `border-danger/30`).
 *   • text   → `text-accent-light` (`--color-accent-light` #A78BFA) + the
 *              `text-meta-value` role token (10px / weight 500 = Inter Medium
 *              10px — matches the metadata label EXACTLY; both Figma forms use
 *              10px, so the prompt's tentative "12px in the metadata editor"
 *              is superseded by the confirmed 10px).
 *   • remove "×" hover → `hover:text-accent` (`--color-accent` #7B61FF).
 *   • focus ring → `ring-[var(--border-accent)]`.
 * There are NO raw hex / rgba color literals anywhere in this file. The vertical
 * inset resolves to the named `--space-chip-y` token via
 * `py-[var(--space-chip-y)]` (Figma's exact 5px inset; with `leading-none`, the
 * global `border-box`, and the 1px border this yields the 22px pill height:
 * 10 + 5 + 5 + 1 + 1 = 22); the remaining bare utilities are Tailwind's standard
 * spacing scale (`px-2`, `gap-0.5`) and permitted neutral keywords.
 *
 * BLITZY [COLOR]: the SIDEBAR display chips are authored in Figma with a SOLID
 * baked fill `#1D2148`, a white-7% stroke, and a slate `#94A3B8` label — none of
 * which are named `@theme` tokens and all of which the zero-hardcoded rule
 * forbids hardcoding. They are intentionally canonicalized to this primitive's
 * token-backed accent look (`bg-accent/20` + `border-accent/30` +
 * `text-accent-light`), which is chromatically a close translucent-purple
 * relative and is the single look AAP §0.3.3 specifies for the TagPill. If a
 * dedicated "sidebar chip" token set is ever added to `globals.css`, a
 * caller-side `className` override (or a future variant) can adopt it.
 *
 * BLITZY [TYPO/SPACING]: the same single-canonical-look reconciliation also
 * governs the label weight and horizontal padding. In Figma the SIDEBAR chips
 * use Inter Regular 400 with 7px horizontal padding (nodes 2:54–2:65), while the
 * METADATA pills use Inter Medium 500 with 8px left padding (nodes 9:82/9:83).
 * This primitive adopts the metadata pill's values — `text-meta-value`
 * (10px / weight 500) and `px-2` (8px) — because (a) the agent contract
 * explicitly mandates them ("use `font-medium`"; "Padding: small symmetric
 * (e.g. `px-2 …`)"; "ignore tiny asymmetric Figma auto-layout padding"), and
 * (b) they match the canonical metadata pill exactly. The resulting +1 weight
 * step and +1px horizontal padding versus the sidebar chips are deliberate,
 * accepted reconciliations of the single token-backed look — not divergences to
 * correct.
 *
 * BLITZY [GLYPH]: the Figma metadata pill renders its remove control as the
 * literal lowercase letter "x" (Inter Regular 8px). This primitive instead uses
 * the conventional remove glyph "×" (U+00D7 MULTIPLICATION SIGN), which the
 * agent contract mandates verbatim (its checklist and key-insight both write
 * "×"). Per AAP §0.3 scope/intent precedence the contract wins; "×" is a
 * unicode TEXT glyph (AAP §0.3.4 — NOT an asset file) and reads as a balanced,
 * centered remove affordance. Its color/size/placement still match Figma
 * (accent-light, ~label size, trailing the label).
 *
 * BLITZY [A11Y]: the remove control's hit target follows the Figma design
 * (~12px square — below the WCAG-AA 44×44px touch-target recommendation). Per
 * the CRITICAL Directive, visible sizing follows the design source exactly
 * rather than being silently enlarged; this flag marks it for designer review.
 * Invisible accessibility is fully applied regardless (real `<button>`,
 * `aria-label`, keyboard operability, `:focus-visible` ring, decorative glyph
 * `aria-hidden`).
 *
 * RENDERING MODEL
 * --------------------------------------------------------------------------
 * Stateless and hook-free. The chip is a `<span>` (a non-interactive, inline
 * container) holding the `label`; in the REMOVABLE form it also renders a real
 * `<button type="button">` whose `aria-label` is `Remove <label>` and whose
 * click invokes `onRemove`. The decorative "×" glyph is `aria-hidden` so a
 * screen reader announces the button's `aria-label`, not a stray "times" glyph.
 * The caller `className` is merged AFTER the base classes so caller utilities
 * win on conflicts (e.g. parent-supplied margins or a bespoke tint).
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/library/
 * views.py` (the Qt library view whose "tag browser" this chip is the web
 * analog of). Nothing is imported or translated from the Python codebase.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import type { JSX } from 'react';

/**
 * Props for {@link TagPill}.
 *
 * Exactly the AAP §0.3.3 contract — a label, an optional `removable` flag with
 * its remove callback, and an optional `className` for parent-supplied layout
 * or tint. There is deliberately NO style/variant prop: the primitive has a
 * single canonical look (see "ONE CANONICAL LOOK" in the file header).
 */
export interface TagPillProps {
  /** The tag text to display inside the chip (e.g. "Sci-Fi"). */
  label: string;
  /**
   * When `true`, renders a trailing "×" remove `<button>` that invokes
   * {@link TagPillProps.onRemove}. When falsey, renders the read-only display
   * chip with no remove control.
   * @default false
   */
  removable?: boolean;
  /**
   * Called when the user activates the remove control (click / keyboard). Only
   * wired up while {@link TagPillProps.removable} is `true`; safe to omit (the
   * handler is invoked optionally).
   */
  onRemove?: () => void;
  /**
   * Optional extra classes, merged AFTER the base classes so caller utilities
   * win on conflicts (e.g. parent-supplied margins, or a context-specific tint
   * override per the file header's "ONE CANONICAL LOOK" note).
   */
  className?: string;
}

/**
 * Base classes shared by BOTH forms — the canonical token-backed pill.
 *
 * - Shape/layout: `rounded-full` capsule; `inline-flex items-center` with a
 *   2px `gap-0.5` between the label and the remove control (matching the
 *   Figma metadata pill's ~2px label→"×" spacing); `align-middle` so the chip
 *   sits cleanly on the text baseline when used inline (e.g. a table tag cell);
 *   `whitespace-nowrap` so a tag never wraps inside the pill.
 * - Surface: `bg-accent/20` translucent-purple fill + 1px `border-accent/30`
 *   hairline (see the file header's ZERO-HARDCODED-TOKEN RULE for the exact
 *   Figma → token mapping).
 * - Spacing: `px-2` (8px) horizontal inset; `py-[var(--space-chip-y)]` vertical
 *   inset (the named 5px chip token) → 22px pill height with `leading-none` +
 *   the global border-box.
 * - Typography: `text-meta-value` (10px / Inter Medium 500) + `text-accent-light`
 *   (#A78BFA); `leading-none` keeps the line box tight so the height math holds.
 */
const CHIP_BASE_CLASSES =
  'inline-flex items-center gap-0.5 align-middle whitespace-nowrap ' +
  'rounded-full border border-accent/30 bg-accent/20 ' +
  'px-2 py-[var(--space-chip-y)] leading-none ' +
  'text-meta-value text-accent-light';

/**
 * Classes for the "×" remove `<button>` (REMOVABLE form only).
 *
 * A small inline-flex control that inherits the chip's 10px type scale (so the
 * glyph "matches the label" per the contract). Color is accent-light at rest
 * (matching the Figma "×" fill #A78BFA) and brightens to the full accent
 * (#7B61FF) on hover; the color transition is gated behind `motion-safe` so it
 * is suppressed for users who request reduced motion (UI6). `outline-none` +
 * a token-backed `:focus-visible` ring shows focus for keyboard users only
 * (UI3). `rounded-full` keeps that focus ring circular around the glyph, and
 * `leading-none` / `select-none` keep the glyph tight and non-selectable.
 */
const REMOVE_BUTTON_CLASSES =
  'inline-flex items-center justify-center rounded-full leading-none select-none ' +
  'cursor-pointer text-accent-light hover:text-accent motion-safe:transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)]';

/**
 * The remove glyph — U+00D7 MULTIPLICATION SIGN ("×"). Declared as an explicit
 * unicode escape so the exact codepoint is unambiguous and encoding-independent
 * (it is the balanced "×", NOT the lowercase letter "x", and NOT an asset). See
 * the BLITZY [GLYPH] flag in the file header.
 */
const REMOVE_GLYPH = '\u00D7';

/**
 * TagPill — the bespoke design-system tag-chip primitive.
 *
 * Renders a single rounded `<span>` chip containing the `label`. In the
 * `removable` form it additionally renders a trailing "×" `<button>` that
 * invokes {@link TagPillProps.onRemove}; the display form renders the label
 * alone (no remove control). All styling is token-backed (see the file header);
 * the caller `className` is merged AFTER the base classes so caller utilities
 * win on conflicts.
 *
 * @param props - {@link TagPillProps}
 * @returns The rendered tag-chip element.
 */
export function TagPill({
  label,
  removable = false,
  onRemove,
  className,
}: TagPillProps): JSX.Element {
  // Compose token-backed classes; the caller className is appended last so its
  // utilities win on conflicts (Tailwind source order governs). `filter(Boolean)`
  // drops an absent className before joining, keeping the array a clean string[].
  const merged = [CHIP_BASE_CLASSES, className].filter(Boolean).join(' ');

  // Remove handler. `onRemove` is optional, so it is invoked defensively; the
  // remove `<button>` only exists in the `removable` form, so this never fires
  // for a display chip.
  const handleRemove = (): void => {
    onRemove?.();
  };

  return (
    <span className={merged}>
      <span>{label}</span>
      {removable ? (
        <button
          type="button"
          className={REMOVE_BUTTON_CLASSES}
          aria-label={`Remove ${label}`}
          onClick={handleRemove}
        >
          {/* Decorative glyph: the button's `aria-label` is its accessible name,
              so the "×" is hidden from assistive tech to avoid a stray "times"
              announcement. */}
          <span aria-hidden="true">{REMOVE_GLYPH}</span>
        </button>
      ) : null}
    </span>
  );
}

export default TagPill;
