'use client';

/**
 * ==========================================================================
 * Calibre-UI Design System — Button
 * The single interactive ACTION primitive for every clickable control.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `Button` is one of the 14 bespoke design-system primitives (AAP §0.3.3 /
 * §0.4.2) for the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * EVERY clickable action across all seven screens composes this component —
 * primary CTAs ("Read Now", "Save", "Convert Book", "Save & Restart"), outline
 * actions ("Convert Format", "Edit Metadata", "Send to Device"), destructive
 * actions ("Delete"), and the top-toolbar items ("Add Books" … "Prefs"). Screen
 * code must NEVER render a raw `<button>`; it always goes through this primitive
 * so the five variants stay visually consistent and 100% token-backed.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * This primitive renders a real, interactive `<button>` that binds an
 * `onClick` handler, so it is a Client Component (App Router components default
 * to Server Components, which cannot attach event handlers). The directive is
 * the very first line of the file, before any import.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, screen `2:2` = App 01)
 * --------------------------------------------------------------------------
 * Each variant reproduces a CONFIRMED Figma node (reconciled via
 * analyze_figma_node against the full-screen render of `2:2`):
 *   • primary   → `2:367` "Read Now"      — fill `--gradient-cta`
 *                 (linear-gradient(-45deg, #7B61FF 0%, #4838C8 100%)), radius
 *                 8px, NO border/shadow, label #F1F5FF, Inter 600/12px, h 38.
 *   • secondary → `2:369` "Convert Format" — bg white-6%, 1px white-9% border,
 *                 radius 8px, text #94A3B8, Inter 500/11px, h 32.
 *   • danger    → `2:375` "Delete"        — fill solid #2A1A1A (see BLITZY
 *                 [COLOR] flag), 1px danger-30% border, text #F87171,
 *                 Inter 500/11px, h 32.
 *   • toolbar   → `2:22` button (glyph `2:23` + label `2:24`) — fixed 84×38,
 *                 radius 7px, transparent idle, HORIZONTAL glyph(15px) + label
 *                 (Inter 400/9px, #64748B), 5px gap. Pattern verified against
 *                 sibling toolbar buttons `2:19` (Send) and `2:25` (View).
 *   • ghost     → `9:115` App 07 "+ Add ID" — quiet box, white-4% fill, 1px
 *                 white-7% border, radius 6px, text #64748B, Inter 500/11px,
 *                 h 28. The low-emphasis add affordance (see {@link VARIANT_CLASSES}).
 *
 * THREE FIGMA-DRIVEN REFINEMENTS (Figma precedence — CRITICAL Directive):
 *   1. The primary label color is `text-text-primary` (#F1F5FF, the exact
 *      `--color-text-primary` token), NOT `text-white` (#FFFFFF). Figma node
 *      2:368 confirms #F1F5FF "exactly … NOT pure #FFFFFF"; using the named
 *      token is both Figma-faithful and more token-compliant than a keyword.
 *   2. The toolbar layout is HORIZONTAL (glyph left of label), NOT a vertical
 *      stack. Figma 2:22 places the glyph at x=10 and the label at x=30 on the
 *      same row; the rendered toolbar confirms glyph-then-label horizontally.
 *   3. The toolbar label color is per-consumer via the `toolbarLabelTone` prop:
 *      the DEFAULT `'muted'` = `text-text-muted` (#64748B), the CONFIRMED Figma
 *      fill on App 01 node 2:24; the App 04 Editor toolbar (node `5:8`) opts
 *      into `'secondary'` = `text-text-secondary` (#94A3B8). Both are CONFIRMED
 *      Figma fills, so this single primitive serves App 01 (and the App 03
 *      ReaderToolbar) AND App 04 without regressing any of them — see the
 *      BLITZY [DESIGN_SYSTEM_GAP — RESOLVED] note on `toolbarLabelTone` below.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / radius / typography value resolves to an `@theme` token
 * declared in `src/app/globals.css`, consumed through a Tailwind v4 utility
 * (`bg-gradient-cta`, `rounded-control`, `text-button-primary`, `text-danger`,
 * `text-text-secondary`) or a CSS-variable arbitrary value
 * (`bg-[var(--border-white-06)]`, `ring-[var(--border-accent)]`). There are NO
 * raw hex / rgba color literals. Layout / icon dimensions ALSO resolve to named
 * `@theme` tokens — the button heights, the toolbar footprint, the glyph→label
 * gap, and the toolbar glyph size are consumed via arbitrary `var()` utilities
 * (`min-h-[var(--size-button-h)]`, `min-h-[var(--size-button-compact-h)]`,
 * `min-w-[var(--size-toolbar-button-w)]`, `gap-[var(--space-toolbar-button-gap)]`,
 * `text-[length:var(--size-toolbar-icon)]`). The only bare literals are the
 * allowed neutral keywords (`transparent`; `text-white` is intentionally avoided
 * in favor of the exact token) and Tailwind's standard spacing-scale utilities
 * (`px-4`, `gap-2`). The gradient is consumed only via the `bg-gradient-cta`
 * token utility, never an inline gradient string.
 *
 * BLITZY [COLOR] (danger fill): Figma node 2:375 confirms a SOLID dark-maroon
 * fill `#2A1A1A` (opacity 1), which is NOT part of the named `@theme` token set
 * and therefore cannot be hardcoded under the zero-hardcoded rule. It is
 * realized token-safely as `bg-danger/10` — a low-opacity wash of the danger
 * token (`--color-danger` #F87171) — per the file's authoring directive. If a
 * dedicated maroon token is ever added to `globals.css`, prefer it here.
 *
 * ICONS ARE GLYPHS, NOT ASSETS (AAP §0.3.4)
 * --------------------------------------------------------------------------
 * The `icon` prop accepts an emoji / unicode glyph (or any small node) passed
 * as text — e.g. ➕ 🔌 🔄 📧 ✏️ 📖 📰 ⚙️ 🔍. No image / SVG asset is created or
 * imported. The icon is rendered `aria-hidden` because the visible `label`
 * already supplies the button's accessible name.
 *
 * RENDERING MODEL
 * --------------------------------------------------------------------------
 * Stateless and hook-free: it derives a class string from the `variant` and
 * merges any caller `className` after the base so callers can extend or
 * override (e.g. add `w-full`). All remaining native button attributes
 * (`aria-*`, `data-*`, `id`, `style`, `title`, …) are forwarded via `...rest`.
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/library/
 * views.py` (the Qt library view whose action controls this models). Nothing is
 * imported or translated from the Python codebase.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import type { ButtonHTMLAttributes, JSX, ReactNode } from 'react';

/**
 * The five visual roles a {@link Button} can take, each mapped 1:1 to a
 * CONFIRMED Figma node (see the file header). `ghost` is the quiet, low-emphasis
 * add-affordance box added in the CP4 Figma-fidelity fix for App 07 "+ Add ID"
 * (`9:115`) — see {@link VARIANT_CLASSES}.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'toolbar' | 'ghost';

/**
 * Props for {@link Button}.
 *
 * Extends the native `<button>` attribute set (so `aria-*`, `data-*`, `id`,
 * `style`, `title`, `name`, etc. are all forwarded) EXCEPT `onClick`, which is
 * re-declared below with a simpler, argument-free signature suited to this
 * UI-only prototype's mock interactions.
 */
export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Visible button text. Becomes the button's accessible name. */
  label: string;
  /**
   * Visual role. Determines background, border, text color, radius, typography
   * scale, and size.
   * @default 'secondary'
   */
  variant?: ButtonVariant;
  /**
   * (TOOLBAR variant only) Selects the label text color, reconciling the two
   * CONFIRMED Figma toolbar-label fills so one primitive serves both toolbars:
   *   • `'muted'`     → `--color-text-muted` (#64748B) — the App 01 TopToolbar
   *     labels (Figma node `2:24`). This is the DEFAULT, so every existing
   *     toolbar consumer that omits the prop (TopToolbar `2:2`, ReaderToolbar
   *     `4:8`) renders byte-identically — no regression.
   *   • `'secondary'` → `--color-text-secondary` (#94A3B8) — the App 04 EPUB
   *     Editor toolbar labels (Figma node `5:8`), a higher-contrast tone the
   *     editor toolbar opts into.
   * Ignored for the non-toolbar variants (their label color is fixed by the
   * variant). See the BLITZY [DESIGN_SYSTEM_GAP — RESOLVED] note below and the
   * matching note in `EditorToolbar.tsx`.
   * @default 'muted'
   */
  toolbarLabelTone?: 'muted' | 'secondary';
  /**
   * Optional leading icon — an emoji / unicode glyph or small node (AAP icons
   * are TEXT glyphs, never asset files). Rendered before the label, and
   * `aria-hidden` because the `label` already names the control.
   */
  icon?: ReactNode;
  /**
   * When `true`, dims the button (`opacity-50`), shows a not-allowed cursor,
   * and suppresses `onClick` (both natively, via the `disabled` attribute, and
   * defensively, via the click guard).
   * @default false
   */
  disabled?: boolean;
  /** Click handler. Never fires while {@link ButtonProps.disabled} is `true`. */
  onClick?: () => void;
}

/**
 * Common, variant-invariant classes shared by every button.
 *
 * - Layout: a centered inline flex row so an optional icon and the label sit
 *   side by side (`gap` is supplied per-variant); `whitespace-nowrap` keeps the
 *   label on one line (toolbar buttons grow via `min-w` instead of wrapping).
 * - Motion: `motion-safe:transition` animates hover/focus changes only when the
 *   user has NOT requested reduced motion (UI6 / prefers-reduced-motion).
 * - Focus: a token-backed `:focus-visible` ring (the `--border-accent` token),
 *   shown for keyboard users only — never on mouse click (UI3).
 * - Disabled: dim + not-allowed cursor (paired with the native `disabled` attr).
 */
const BASE_CLASSES =
  'inline-flex items-center justify-center whitespace-nowrap select-none ' +
  'cursor-pointer motion-safe:transition ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)] ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Variant → container-class lookup. Centralizing the mapping keeps every value
 * token-backed (no inline conditional hex) and ties the map's key type to the
 * public {@link ButtonVariant}, so the map and the union can never drift apart.
 *
 * Token trace per variant (all values resolve to `globals.css` `@theme`):
 *   • primary   — `bg-gradient-cta` (--gradient-cta), `text-text-primary`
 *                 (#F1F5FF), `rounded-control` (8px), `text-button-primary`
 *                 (12px/600). Height 38px via `min-h-[var(--size-button-h)]`.
 *                 Subtle `hover:opacity-90` feedback (the gradient cannot be
 *                 hover-tinted via a color token).
 *   • secondary — `bg-[var(--border-white-06)]`, 1px `border-[var(--border-white-09)]`,
 *                 `text-text-secondary` (#94A3B8), `rounded-control`,
 *                 `text-button-secondary` (11px/500). Height ≈32px.
 *                 `hover:bg-[var(--border-white-09)]`.
 *   • danger    — `bg-danger/10` (see BLITZY [COLOR] flag in the file header —
 *                 token-safe stand-in for Figma's solid #2A1A1A), 1px
 *                 `border-danger/30`, `text-danger` (#F87171),
 *                 `rounded-control`, `text-button-secondary`. Height ≈32px.
 *                 `hover:bg-danger/20`.
 *   • toolbar   — transparent idle, container default `text-text-muted`
 *                 (#64748B) which the label inherits UNLESS `toolbarLabelTone`
 *                 overrides it on the label span (see that prop + the
 *                 `labelClassName` note), `rounded-toolbar` (7px), fixed 84×38
 *                 footprint via the named tokens
 *                 `min-w-[var(--size-toolbar-button-w)]` (84px) +
 *                 `min-h-[var(--size-button-h)]` (38px), with a
 *                 `gap-[var(--space-toolbar-button-gap)]` (5px) glyph→label gap.
 *                 `hover:bg-[var(--border-white-06)]`. The typography scale is
 *                 applied to the LABEL span (not the button) so the 15px glyph
 *                 (`--size-toolbar-icon`) is not shrunk to the 9px label size.
 *   • ghost     → App 07 "+ Add ID" `9:115` — the QUIET, low-emphasis add box.
 *                 `bg-[var(--border-white-04)]` (rgba 0.04 fill), 1px
 *                 `border-[var(--border-white-07)]`, `text-text-muted` (#64748B),
 *                 `rounded-control-sm` (6px), `text-button-secondary` (11px/500),
 *                 28px height via `min-h-[var(--size-button-quiet-h)]`, `px-3`.
 *                 `hover:bg-[var(--border-white-06)]` lifts it one step. Added in
 *                 the CP4 Figma-fidelity fix (finding §IdentifierRows L330): the
 *                 prior `secondary` treatment (white-6/white-9/8px/#94A3B8) was a
 *                 visibly heavier box than Figma's quiet neutral chip. The sibling
 *                 "+ Add format" stays `secondary` (its Figma is a PURPLE box, a
 *                 different reconciliation — see MetadataCoverColumn BLITZY [COLOR]).
 */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-cta text-text-primary rounded-control text-button-primary ' +
    'min-h-[var(--size-button-h)] px-4 gap-2 hover:opacity-90',
  secondary:
    'bg-[var(--border-white-06)] border border-[var(--border-white-09)] ' +
    'text-text-secondary rounded-control text-button-secondary ' +
    'min-h-[var(--size-button-compact-h)] px-4 gap-2 hover:bg-[var(--border-white-09)]',
  danger:
    'bg-danger/10 border border-danger/30 text-danger rounded-control ' +
    'text-button-secondary min-h-[var(--size-button-compact-h)] px-4 gap-2 hover:bg-danger/20',
  toolbar:
    'bg-transparent text-text-muted rounded-toolbar ' +
    'min-w-[var(--size-toolbar-button-w)] min-h-[var(--size-button-h)] ' +
    'gap-[var(--space-toolbar-button-gap)] hover:bg-[var(--border-white-06)]',
  ghost:
    'bg-[var(--border-white-04)] border border-[var(--border-white-07)] ' +
    'text-text-muted rounded-control-sm text-button-secondary ' +
    'min-h-[var(--size-button-quiet-h)] px-3 gap-2 hover:bg-[var(--border-white-06)]',
};

/**
 * Button — the bespoke design-system action primitive.
 *
 * Renders a single real `<button type="button">`. The class string is composed
 * as `BASE_CLASSES` + the selected variant's container classes + any caller
 * `className` (merged last so caller utilities win on conflicts). An optional
 * `icon` glyph is rendered before the `label`, horizontally, for ALL variants
 * (per Figma node 2:22). All remaining native attributes are spread via
 * `...rest`; the explicit `type` / `className` / `disabled` / `onClick` are
 * applied AFTER the spread so they always take effect.
 *
 * @param props - {@link ButtonProps}
 * @returns The rendered button element.
 */
export function Button({
  label,
  variant = 'secondary',
  toolbarLabelTone = 'muted',
  icon,
  disabled = false,
  onClick,
  className,
  ...rest
}: ButtonProps): JSX.Element {
  const isToolbar = variant === 'toolbar';

  // Compose token-backed classes; the caller className is appended last so its
  // utilities win on conflicts (Tailwind source order governs). Ternaries are
  // avoided here — `filter(Boolean)` drops a missing className before joining.
  const merged = [BASE_CLASSES, VARIANT_CLASSES[variant], className]
    .filter(Boolean)
    .join(' ');

  // Defensive click guard. The native `disabled` attribute already suppresses
  // click events, but short-circuiting here guarantees the handler can never
  // run while disabled (e.g. if a caller instead opts into an aria-disabled
  // pattern, or invokes behavior programmatically).
  const handleClick = (): void => {
    if (disabled) {
      return;
    }
    onClick?.();
  };

  // The toolbar glyph is sized to its Figma 15px via the named
  // `--size-toolbar-icon` token (a `length:` hint forces font-size, not color,
  // for the arbitrary `var()`); other variants let the icon inherit the button's
  // typography scale. `leading-none` keeps the glyph from adding stray vertical
  // line-box space.
  const iconClassName = isToolbar
    ? 'text-[length:var(--size-toolbar-icon)] leading-none'
    : 'leading-none';

  // The toolbar applies its 9px type scale to the LABEL (so the 15px glyph is
  // unaffected); other variants carry their type scale on the button itself, so
  // the label span needs no class and simply inherits.
  //
  // The label COLOR is the per-consumer `toolbarLabelTone`: the default
  // `'muted'` adds NO color class, so the label inherits the container's
  // `text-text-muted` (#64748B, App 01 `2:24`) — byte-identical to the prior
  // single-tone behavior; `'secondary'` sets `text-text-secondary` (#94A3B8,
  // App 04 `5:8`) DIRECTLY on the span, which wins over the inherited container
  // color for the label text only (the emoji glyph is color-immune, so it is
  // unaffected either way).
  //
  // BLITZY [A11Y]: both tones are CONFIRMED Figma fills, so neither screen is
  // silently altered (Figma precedence, UI3/UF3). On `--color-surface-1` the
  // default `'muted'` computes ~3.84:1 (below the WCAG AA 4.5:1 normal-text
  // minimum) and is retained EXACTLY because it is the authoritative `2:24`
  // value; the `'secondary'` tone the editor toolbar selects computes ~7.13:1
  // (passes AA) AND matches `5:8`, so it both honors Figma and clears AA.
  const labelClassName = isToolbar
    ? toolbarLabelTone === 'secondary'
      ? 'text-toolbar-label text-text-secondary'
      : 'text-toolbar-label'
    : undefined;

  return (
    <button
      {...rest}
      type="button"
      className={merged}
      disabled={disabled}
      onClick={handleClick}
    >
      {icon != null && (
        <span aria-hidden="true" className={iconClassName}>
          {icon}
        </span>
      )}
      <span className={labelClassName}>{label}</span>
    </button>
  );
}

export default Button;
