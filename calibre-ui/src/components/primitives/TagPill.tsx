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
 *     is a REMOVABLE pill carrying a small "x" remove control (REMOVABLE form).
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
 * TWO visually-distinct tag treatments, which this primitive now paints
 * FAITHFULLY via an explicit `variant` prop (see "TWO CONFIRMED VARIANTS" below):
 *   • SIDEBAR display chips (`2:54`–`2:65`): radius 100px (full pill), height
 *     22px, a SOLID baked fill `#1D2148`, a 1px white-7% stroke, and an
 *     Inter Regular 10px `#94A3B8` (slate) label — NO count, NO icon.
 *   • METADATA removable pills (`9:82`/`9:86`/`9:90`/`9:94`/`9:98`): radius
 *     100px (full pill), height 22px, fill `rgba(123,97,255,0.18)` = the accent
 *     `#7B61FF` @ 18%, a 1px `rgba(123,97,255,0.3)` (accent @ 30%) stroke, an
 *     Inter Medium 500 10px `#A78BFA` (accent-light) label, 8px left inset, and
 *     a trailing "x" remove glyph (`#A78BFA`) in a 12×12 hit area.
 *
 * TWO CONFIRMED VARIANTS (CP4 Figma-fidelity fix — AAP §0.3.3 / §0.4.5)
 * --------------------------------------------------------------------------
 * The chip exposes an explicit `variant` prop — `'sidebar'` and `'metadata'` —
 * each reproducing its CONFIRMED Figma treatment EXACTLY (see {@link
 * TagPillVariant}). This supersedes the primitive's former "one canonical accent
 * look for both contexts", which CP4 finding §TagPill L199-203 flagged as a
 * fidelity gap: the sidebar tag browser must render the SOLID dark `#1D2148`
 * chip, not the metadata accent wash. Both treatments are 100% token-backed —
 * the sidebar's previously-"unhardcodeable" `#1D2148` fill is now the named
 * `--color-tag-sidebar-bg` token (added to globals.css + mirrored in tokens.ts),
 * and its slate label is the existing `--color-text-secondary` (#94A3B8). The
 * `'metadata'` variant is the DEFAULT, so non-sidebar display tag cells (library
 * table/grid/detail) keep their established accent look with no regression.
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
 *   • remove "x" hover → `hover:text-accent` (`--color-accent` #7B61FF).
 *   • sidebar variant → `bg-[var(--color-tag-sidebar-bg)]` (#1D2148) +
 *              `border-[var(--border-white-07)]` + `text-text-secondary` (#94A3B8).
 *   • focus ring → `ring-[var(--border-accent)]`.
 * There are NO raw hex / rgba color literals anywhere in this file. The vertical
 * inset resolves to the named `--space-chip-y` token via
 * `py-[var(--space-chip-y)]` (Figma's exact 5px inset; with `leading-none`, the
 * global `border-box`, and the 1px border this yields the 22px pill height:
 * 10 + 5 + 5 + 1 + 1 = 22); the remaining bare utilities are Tailwind's standard
 * spacing scale (`px-2`, `gap-0.5`) and permitted neutral keywords.
 *
 * BLITZY [COLOR]: the SIDEBAR chips now render their CONFIRMED Figma treatment —
 * the solid `--color-tag-sidebar-bg` (#1D2148) fill, a 1px white-7 stroke, and a
 * slate `text-text-secondary` (#94A3B8) label — via the `sidebar` variant. The
 * METADATA pills keep the accent wash (`bg-accent/20` + `border-accent/30` +
 * `text-accent-light`) via the `metadata` variant. Both are fully token-backed.
 *
 * BLITZY [TYPO]: per-variant label typography now matches Figma — the `sidebar`
 * variant uses Inter Regular 10px (`text-meta-label`), the `metadata` variant
 * uses Inter Medium 10px (`text-meta-value`). The shared 8px (`px-2`) horizontal
 * inset is retained for both (the ≤1px delta versus the sidebar's 7px Figma inset
 * is imperceptible and keeps a single base spacing).
 *
 * BLITZY [GLYPH]: the remove control is now the CONFIRMED Figma lowercase letter
 * "x" (`REMOVE_GLYPH`), matching the metadata pill source (`9:82`…). It replaces
 * the U+00D7 MULTIPLICATION SIGN the primitive previously used (CP4 fix per
 * finding §TagPill L199-203). Its color/size/placement match Figma (accent-light,
 * ~label size, trailing the label).
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
 * click invokes `onRemove`. The decorative "x" glyph is `aria-hidden` so a
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
 * The two CONFIRMED Figma visual variants of the tag chip (see the file header's
 * FIGMA SOURCE OF TRUTH). They are deliberately distinct, NOT reconciled into one
 * look (CP4 Figma-fidelity fix per finding §TagPill L199-203):
 *   • `'sidebar'`  — App01/02 left tag browser (`2:36`): a SOLID baked dark fill
 *     (`--color-tag-sidebar-bg` #1D2148), a 1px white-7 stroke, and a slate
 *     `text-text-secondary` (#94A3B8) Inter Regular 10px (`text-meta-label`) label.
 *   • `'metadata'` — App07 Metadata modal Tags editor (`9:9`): the translucent
 *     accent wash (`bg-accent/20`), a 1px accent/30 stroke, and an accent-light
 *     (#A78BFA) Inter Medium 10px (`text-meta-value`) label. This is the DEFAULT
 *     so library table/grid/detail tag cells keep their established accent look.
 */
export type TagPillVariant = 'sidebar' | 'metadata';

/**
 * Props for {@link TagPill}.
 *
 * The AAP §0.3.3 contract — a label, an optional `removable` flag with its
 * remove callback, an optional `className` — extended for CP4 Figma fidelity with
 * an explicit `variant` and an interactive (whole-chip clickable) form
 * (`onClick` / `active`). A pill is EITHER read-only display, OR removable
 * (metadata), OR clickable (sidebar filter) — these forms are mutually exclusive.
 */
export interface TagPillProps {
  /** The tag text to display inside the chip (e.g. "Sci-Fi"). */
  label: string;
  /**
   * Which CONFIRMED Figma visual treatment to paint (see {@link TagPillVariant}).
   * @default 'metadata'
   */
  variant?: TagPillVariant;
  /**
   * When `true`, renders a trailing "x" remove `<button>` that invokes
   * {@link TagPillProps.onRemove}. When falsey, renders the read-only display
   * chip with no remove control. Used by the App07 metadata Tags editor.
   * Mutually exclusive with {@link TagPillProps.onClick}.
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
   * When provided (and NOT `removable`), the WHOLE chip becomes a real
   * interactive `<button type="button">` that invokes this handler on click /
   * Enter / Space. Used by the App01/02 sidebar tag-filter browser so tag
   * interactions are primitive-backed (no raw native `<button>` wrapper — CP4
   * R4 composition fix per finding §Sidebar L324). Mutually exclusive with
   * {@link TagPillProps.removable}.
   */
  onClick?: () => void;
  /**
   * Interactive (clickable) form only: the toggle/selected state. Drives both the
   * `aria-pressed` attribute (announced to assistive tech) and the visible active
   * ring. Ignored unless {@link TagPillProps.onClick} is provided.
   * @default false
   */
  active?: boolean;
  /**
   * Optional extra classes, merged AFTER the base + variant classes so caller
   * utilities win on conflicts (e.g. parent-supplied margins).
   */
  className?: string;
}

/**
 * Variant-INVARIANT base classes — shape, layout, and spacing shared by every
 * pill. Color, border, and typography are supplied per-variant by
 * {@link VARIANT_CLASSES}.
 *
 * - Shape/layout: `rounded-full` capsule; `inline-flex items-center` with a
 *   2px `gap-0.5` between the label and the remove control (matching the
 *   Figma metadata pill's ~2px label→"x" spacing); `align-middle` so the chip
 *   sits cleanly on the text baseline when used inline (e.g. a table tag cell);
 *   `whitespace-nowrap` so a tag never wraps inside the pill.
 * - Spacing: `px-2` (8px) horizontal inset; `py-[var(--space-chip-y)]` vertical
 *   inset (the named 5px chip token) → 22px pill height with `leading-none` +
 *   the global border-box.
 */
const CHIP_BASE_CLASSES =
  'inline-flex items-center gap-0.5 align-middle whitespace-nowrap ' +
  'rounded-full px-2 py-[var(--space-chip-y)] leading-none';

/**
 * Per-variant surface + typography — an exhaustive `Record<TagPillVariant,
 * string>` so the compiler guarantees both CONFIRMED Figma treatments are styled
 * (see {@link TagPillVariant} and the file header's FIGMA SOURCE OF TRUTH). Every
 * value resolves to an `@theme` token (zero hex literals):
 *   • sidebar  → solid `--color-tag-sidebar-bg` (#1D2148) fill + 1px white-7
 *     stroke + slate `text-text-secondary` + Inter Regular 10px `text-meta-label`.
 *   • metadata → `bg-accent/20` wash + 1px `border-accent/30` + accent-light label
 *     + Inter Medium 10px `text-meta-value`.
 */
const VARIANT_CLASSES: Record<TagPillVariant, string> = {
  sidebar:
    'border border-[var(--border-white-07)] bg-[var(--color-tag-sidebar-bg)] ' +
    'text-text-secondary text-meta-label',
  metadata: 'border border-accent/30 bg-accent/20 text-accent-light text-meta-value',
};

/**
 * Interactive-form classes (clickable whole-chip `<button>`, sidebar filter).
 * `cursor-pointer select-none` signal interactivity; `appearance-none` neutralizes
 * any residual UA button chrome so only the pill surface paints; a token-backed
 * `:focus-visible` ring shows focus for keyboard users only (UI3); the color
 * transition is gated behind `motion-safe` (UI6). Enter/Space activation comes
 * natively from the `<button>` element.
 */
const INTERACTIVE_CLASSES =
  'cursor-pointer select-none appearance-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)] ' +
  'motion-safe:transition-colors';

/**
 * ACTIVE (selected) treatment for the interactive form — a 2px accent ring
 * (`box-shadow`, so zero layout shift and no reliance on background source-order).
 * Paired with `aria-pressed` so the selected state reaches assistive tech.
 * Token-backed; absorbed from the sidebar's former `TAG_ACTIVE_CLASSES`.
 */
const ACTIVE_CLASSES = 'ring-2 ring-[var(--color-accent)]';

/**
 * Classes for the "x" remove `<button>` (REMOVABLE form only).
 *
 * A small inline-flex control that inherits the chip's 10px type scale (so the
 * glyph "matches the label" per the contract). Color is accent-light at rest
 * (matching the Figma "x" fill #A78BFA) and brightens to the full accent
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
 * The remove glyph — the lowercase ASCII letter "x". CP4 Figma-fidelity fix (per
 * finding §TagPill L199-203): the Figma metadata removable pills (`9:82`/`9:86`/
 * `9:90`/`9:94`/`9:98`) draw a lowercase "x", NOT the U+00D7 MULTIPLICATION SIGN
 * the chip previously used. The glyph is decorative (`aria-hidden`); the remove
 * button's `aria-label` ("Remove <label>") is its accessible name.
 */
const REMOVE_GLYPH = 'x';

/**
 * TagPill — the bespoke design-system tag-chip primitive.
 *
 * Renders a single rounded `<span>` chip containing the `label`. In the
 * `removable` form it additionally renders a trailing "x" `<button>` that
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
  variant = 'metadata',
  removable = false,
  onRemove,
  onClick,
  active = false,
  className,
}: TagPillProps): JSX.Element {
  // The interactive (whole-chip clickable) form is enabled when an `onClick` is
  // supplied AND the chip is NOT removable (a removable chip already nests an
  // inner remove `<button>`, and a button cannot be nested inside a button).
  const interactive = onClick != null && !removable;

  // Compose token-backed classes: variant-invariant base + the variant's surface
  // + (interactive ⇒ button affordances + active ring) + the caller className
  // (last so it wins on conflicts). `filter(Boolean)` drops absent entries.
  const merged = [
    CHIP_BASE_CLASSES,
    VARIANT_CLASSES[variant],
    interactive ? INTERACTIVE_CLASSES : '',
    interactive && active ? ACTIVE_CLASSES : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Remove handler. `onRemove` is optional, so it is invoked defensively; the
  // remove `<button>` only exists in the `removable` form, so this never fires
  // for a display or interactive chip.
  const handleRemove = (): void => {
    onRemove?.();
  };

  // INTERACTIVE FORM (sidebar tag filter): the WHOLE chip is a real `<button>`
  // carrying `aria-pressed` for its toggle state — primitive-backed, no raw
  // wrapper element (CP4 R4 composition fix).
  if (interactive) {
    return (
      <button
        type="button"
        className={merged}
        aria-pressed={active}
        onClick={onClick}
      >
        {label}
      </button>
    );
  }

  // DISPLAY / REMOVABLE FORM: a non-interactive `<span>` container holding the
  // label, plus (in the removable form) a trailing remove `<button>`.
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
              so the "x" is hidden from assistive tech to avoid a stray
              announcement. */}
          <span aria-hidden="true">{REMOVE_GLYPH}</span>
        </button>
      ) : null}
    </span>
  );
}

export default TagPill;
