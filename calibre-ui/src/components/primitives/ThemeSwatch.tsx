'use client';

/**
 * ==========================================================================
 * Calibre-UI Design System — ThemeSwatch
 * The "Aa" viewer-theme preview tile (Dark / Light / Sepia / High Contrast).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ThemeSwatch` is one of the 14 bespoke design-system primitives (AAP §0.3.3 /
 * §0.4.2) for the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * It is the single "Aa" preview card that represents one viewer reading theme:
 *   • App 06 — Preferences: the four "VIEWER COLOR THEMES" swatches (Dark /
 *     Light / Sepia / High Contrast), composed by `ViewerThemeSwatches`. The
 *     ACTIVE swatch carries a purple 2px border, a top-right check badge, and a
 *     purple, heavier theme label. (Figma screen `8:2`.)
 *   • App 03 — Viewer toolbar theme switch may reuse the same pattern.
 * Every swatch is rendered for every theme (data-state completeness, DS5-f /
 * FG4); the parent supplies which one is `active`.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The AAP §0.3.3 contract is fundamentally display-only (`theme` + `active`),
 * which would make this a Server Component. This file's contract, however, also
 * exposes the OPTIONAL `onSelect` callback so a swatch can be a real, selectable
 * control. When `onSelect` is supplied the tile renders as an interactive
 * `<button>` that binds an `onClick` handler — and App Router components default
 * to Server Components, which cannot bind event handlers. Per the agent brief
 * ("if provided, wrap in a button → REQUIRES 'use client'") and to match the
 * sibling interactive primitives `Toggle` / `Slider`, the directive is declared
 * as the very first line of the file. When `onSelect` is omitted the component
 * renders a non-interactive `<div>` (pure presentation), so the display-only
 * AAP contract is preserved unchanged.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node against the App 06 "VIEWER COLOR THEMES"
 * swatch row (parent screen `8:2`; SettingsPanel `8:33`; swatch frames `8:82`
 * Dark / `8:87` Light / `8:90` Sepia / `8:93` High Contrast). CONFIRMED values:
 *   • TILE → 154×98 px, corner radius 10px (= `--radius-card`), laid out as a
 *     row of four with a 16px gap; inside, a centered bold "Aa" sample sits in
 *     the upper area and the centered theme name sits near the bottom.
 *   • PER-THEME fill → "Aa" color:
 *       – Dark  (`8:82`) tile #0F1020 (= `--color-reading-surface`) → Aa #C8CAD8.
 *       – Light (`8:87`) tile #FFFEF8 (warm off-white)             → Aa #1A1A2A.
 *       – Sepia (`8:90`) tile #F5EDD8 (cream)                      → Aa #2A200A.
 *       – High Contrast (`8:93`) tile #000000                      → Aa #FFFFFF.
 *     "Aa" (`8:83/88/91/94`) = Inter Bold (700) 22px, centered.
 *   • ACTIVE (only Dark) → border rgba(123,97,255,0.7) 2px; an 18×18 circular
 *     check badge (`8:85`) filled with the accent gradient (#7B61FF→#A78BFA =
 *     `--gradient-accent`) holding a white "✓" (`8:86`), inset 6px from the top
 *     and right; the label "Dark" (`8:84`) = Inter Semi Bold (600) 10px #A78BFA
 *     (= `--color-accent-light`).
 *   • INACTIVE → border rgba(255,255,255,0.1) 1px; the label (`8:89/92/95`) =
 *     Inter Regular (400) 10px #64748B (= `--color-text-muted`).
 * Both ACTIVE and INACTIVE states are rendered for ALL four themes.
 *
 * BLITZY FLAGS (Figma-vs-token reconciliation; CRITICAL Precedence Directive —
 * implement Figma intent through the design-system token layer, flag deviations,
 * matching the house pattern set by the sibling `Slider` / `Toggle` / `Select`):
 *   • [COLOR] active border — Figma rgba(123,97,255,0.7) @2px; the design system
 *     exposes a SINGLE purple-border token `--border-accent` (rgba(123,97,255,
 *     0.6)). The 0.1-alpha difference is imperceptible on a 2px hairline, and the
 *     brief mandates `border-[var(--border-accent)]`, so the active border snaps
 *     to that token at the CONFIRMED 2px width.
 *   • [COLOR] inactive border — Figma rgba(255,255,255,0.1) @1px → the design
 *     system's inactive-hairline token `--border-white-09` (rgba(255,255,255,
 *     0.09)); the 0.01-alpha difference is imperceptible and this matches the
 *     sibling `CheckBadge`'s unchecked-ring convention (system consistency).
 *   • [COLOR] light tile fill — Figma #FFFEF8 (warm off-white) → the sanctioned
 *     `bg-white` keyword (nearest literal paper-white; no off-white token, and
 *     keyword paper/ink previews are explicitly permitted for swatch fills).
 *   • [COLOR] sepia tile fill — Figma #F5EDD8 → nearest cream token
 *     `--color-preview-cream` (#F5F0E8).
 *   • per-theme "Aa" ink — mapped EXACTLY (no deviation). The reading-theme
 *     body-ink colors recur across App 03 (viewer) and App 06 (these swatches),
 *     so per the AAP's own "appears 2+ times → named token" rule they are
 *     promoted to dedicated `@theme` tokens in `globals.css`:
 *     `--color-viewer-ink-dark` #C8CAD8 (`8:83`), `--color-viewer-ink-light`
 *     #1A1A2A (`8:88`), `--color-viewer-ink-sepia` #2A200A (`8:91`); the
 *     high-contrast ink is the exact `text-white` keyword #FFFFFF (`8:94`). This
 *     resolves the Figma-fidelity findings for the sepia (warm brown), dark
 *     (light-gray), and light (near-black) sample text while keeping every value
 *     token-backed (zero hardcoded hex).
 *   • [TYPOGRAPHY] "Aa" — Figma Inter Bold 22px; the type scale's largest role
 *     is `--text-dialog-heading` (20px). The size is consumed via the
 *     size-only `text-[length:var(--text-dialog-heading)]` arbitrary value and
 *     the weight is set explicitly with `font-bold` (700) — this avoids the role
 *     utility's own 600 weight fighting `font-bold` (same technique as
 *     `CheckBadge`). The 2px size delta is within DS4 typography tolerance.
 *   • [SIZE] check badge — the reused `CheckBadge` primitive is 20×20 px vs the
 *     Figma badge's 18×18; the 2px delta is accepted to keep the selection badge
 *     IDENTICAL everywhere (DRY) — it is the same design-system badge used on the
 *     App 02 grid cards.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR value resolves to an `@theme` token from `src/app/globals.css`,
 * consumed via a Tailwind v4 utility (`bg-reading-surface`, `bg-preview-cream`,
 * `text-viewer-ink-dark`, `text-viewer-ink-light`, `text-viewer-ink-sepia`,
 * `text-accent-light`, `text-text-muted`) or
 * a CSS-variable arbitrary value (`border-[var(--border-accent)]`,
 * `border-[var(--border-white-09)]`, `ring-[var(--border-accent)]`), plus the
 * design-sanctioned `bg-white` / `bg-black` / `text-white` keywords for the
 * literal paper-white / ink-black theme PREVIEWS (these are not arbitrary hex —
 * they represent the reading theme each tile previews, and the brief explicitly
 * permits them for the swatch fills). Typography SIZE values resolve to the
 * `--text-*` tokens via `text-[length:var(...)]`. There are NO raw hex / rgba
 * literals anywhere in this file. The only bare literals are LAYOUT / geometry
 * values that carry no color information — the tile footprint (`w-[154px]
 * h-[98px]`, the CONFIRMED Figma dimensions, overridable via `className`), the
 * standard-scale paddings (`pt-5` = 20px, `pb-2.5` = 10px) and the badge inset
 * (`top-1.5 right-1.5` = 6px) — all permitted layout per the design-system
 * convention (0, px lengths, and the standard spacing scale are layout).
 *
 * RENDERING MODEL
 * --------------------------------------------------------------------------
 * A single tile element (a `<button>` when `onSelect` is provided, otherwise a
 * `<div>`) is a `relative` flex column: the bold "Aa" sample at the top and the
 * theme-name label near the bottom (`justify-between` + top/bottom padding match
 * the Figma vertical rhythm). The tile fill and the "Aa" ink swap per theme; the
 * border swaps between the 2px accent ring (active) and the 1px white hairline
 * (inactive). When active, the reused `CheckBadge` is absolutely positioned in
 * the inset top-right corner. The caller `className` is merged LAST so callers
 * own the outer layout (e.g. a responsive width override).
 *
 * ACCESSIBILITY (UI3 — invisible, always applied)
 * --------------------------------------------------------------------------
 * • Interactive (with `onSelect`): renders a semantic `<button type="button">`
 *   that is focusable and activates on both Space and Enter for free. It exposes
 *   `aria-pressed={active}` to announce the selected state and an `aria-label`
 *   of "<Theme> theme" (which contains the visible label text, satisfying the
 *   "label in name" criterion). A token-backed `:focus-visible` ring
 *   (`--border-accent`) is shown for keyboard users only — invisible at rest.
 * • Display-only (no `onSelect`): renders a non-interactive `<div>`; the visible
 *   theme-name label conveys the theme, and selection semantics belong to the
 *   parent (the AAP display-only contract).
 * • The "Aa" sample is a decorative preview glyph, so it is marked `aria-hidden`
 *   to stop a screen reader announcing a stray "Aa"; the `CheckBadge` is itself
 *   `aria-hidden`. Any hover/border transition is gated behind `motion-safe:`
 *   so reduced-motion users see an instant state change (UI6).
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/preferences/
 * look_feel.py` (the Qt viewer look-and-feel preferences whose theme selection
 * this swatch row is the web analog of). Nothing is imported or translated from
 * the Python codebase.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see src/components/primitives/CheckBadge.tsx — the reused selection badge.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import type { JSX } from 'react';

import type { ViewerTheme } from '@/types';

import { CheckBadge } from './CheckBadge';

/**
 * Props for {@link ThemeSwatch} — the AAP §0.3.3 contract (`theme` + `active`)
 * extended with the optional `onSelect` interaction and a `className` escape
 * hatch. Intentionally a CLOSED interface (it does NOT spread native element
 * attributes): a swatch's only inputs are which theme it previews, whether it is
 * the active selection, an optional select handler, and outer-layout classes.
 */
export interface ThemeSwatchProps {
  /**
   * Which viewer reading theme this swatch previews. Drives the tile fill, the
   * "Aa" ink color, and the visible label. One of
   * `'dark' | 'light' | 'sepia' | 'high-contrast'`.
   */
  theme: ViewerTheme;
  /**
   * Whether this swatch is the currently-selected theme.
   *   • `true`  → 2px accent border + a top-right check badge + a purple,
   *     heavier label.
   *   • `false` → a 1px white hairline border, a muted regular label, no badge.
   */
  active: boolean;
  /**
   * Optional selection handler. When provided, the swatch renders as an
   * interactive `<button>` and calls `onSelect(theme)` on click/keyboard
   * activation. When omitted, the swatch is a non-interactive display-only tile
   * (the AAP contract) and the parent owns selection semantics.
   */
  onSelect?: (theme: ViewerTheme) => void;
  /**
   * Extra classes merged onto the tile LAST, so caller utilities win on
   * conflicts — typically used to override the outer width for responsive
   * layouts (e.g. `flex-1 min-w-0`) or to add row spacing.
   */
  className?: string;
}

/**
 * The sample glyph shown inside every swatch (Figma "Aa", nodes `8:83/88/91/94`)
 * — a fixed, theme-independent preview of body text. Declared once so all four
 * tiles render the identical sample.
 */
const SAMPLE_GLYPH = 'Aa';

/**
 * Per-theme preview configuration. For each {@link ViewerTheme}: the tile fill
 * utility, the "Aa" ink-color utility, and the verbatim Figma label. Every
 * value is a token-backed utility or a design-sanctioned paper/ink keyword (see
 * the ZERO-HARDCODED-TOKEN RULE and BLITZY FLAGS in the file header).
 */
const THEME_PREVIEW: Record<
  ViewerTheme,
  { readonly tileFill: string; readonly sampleColor: string; readonly label: string }
> = {
  // Dark: #0F1020 tile (= --color-reading-surface, EXACT) + soft light-gray "Aa"
  // ink (= --color-viewer-ink-dark #C8CAD8, EXACT — Figma node 8:83).
  dark: { tileFill: 'bg-reading-surface', sampleColor: 'text-viewer-ink-dark', label: 'Dark' },
  // Light: literal paper-white tile (Figma #FFFEF8 → bg-white keyword) + near-black
  // navy ink (= --color-viewer-ink-light #1A1A2A, EXACT — Figma node 8:88).
  light: { tileFill: 'bg-white', sampleColor: 'text-viewer-ink-light', label: 'Light' },
  // Sepia: cream tile (= --color-preview-cream, nearest token) + warm dark-brown ink
  // (= --color-viewer-ink-sepia #2A200A, EXACT — Figma node 8:91).
  sepia: { tileFill: 'bg-preview-cream', sampleColor: 'text-viewer-ink-sepia', label: 'Sepia' },
  // High Contrast: pure-black tile (bg-black keyword, EXACT) + pure-white "Aa"
  // (text-white keyword = #FFFFFF, EXACT — Figma node 8:94).
  'high-contrast': { tileFill: 'bg-black', sampleColor: 'text-white', label: 'High Contrast' },
};

/**
 * Variant-invariant TILE classes shared by both the interactive and display-only
 * renders. `relative` anchors the absolutely-positioned check badge; the flex
 * column places the "Aa" at the top and the label near the bottom
 * (`justify-between` + `pt-5`/`pb-2.5` reproduce the Figma vertical rhythm).
 * `w-[154px] h-[98px]` is the CONFIRMED Figma tile footprint (overridable via
 * `className`); `shrink-0` keeps it from collapsing inside a flex row;
 * `select-none` keeps the decorative sample from being text-selected.
 */
const TILE_BASE =
  'relative flex h-[98px] w-[154px] shrink-0 flex-col items-center justify-between ' +
  'rounded-card pt-5 pb-2.5 select-none';

/**
 * ACTIVE border: the 2px accent ring (`--border-accent`). Figma node `8:82` —
 * see the [COLOR] active-border flag in the file header.
 */
const TILE_ACTIVE_BORDER = 'border-2 border-[var(--border-accent)]';

/**
 * INACTIVE border: the 1px white-9% hairline (`--border-white-09`), matching the
 * design system's hairline convention (and the sibling `CheckBadge`'s unchecked
 * ring). See the [COLOR] inactive-border flag in the file header.
 */
const TILE_INACTIVE_BORDER = 'border border-[var(--border-white-09)]';

/**
 * Interactive-only affordances, applied to the `<button>` render: pointer
 * cursor, a token-backed keyboard-only `:focus-visible` ring (`--border-accent`,
 * the default UA outline removed), and a motion-safe color transition so the
 * border change on (de)selection animates only when motion is allowed (UI6).
 */
const TILE_INTERACTIVE =
  'cursor-pointer focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-[var(--border-accent)] ' +
  'motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out';

/**
 * The "Aa" sample typography: token-backed 20px size via the size-only arbitrary
 * value (`--text-dialog-heading`, the nearest type role to Figma's 22px),
 * `font-bold` (700) to match the Figma weight without the role's 600 fighting
 * it, and `leading-none` so the glyph adds no stray line-box height. The
 * per-theme ink color is appended in the component.
 */
const SAMPLE_BASE = 'text-[length:var(--text-dialog-heading)] font-bold leading-none';

/**
 * The theme-name label base: token-backed 10px size via the size-only arbitrary
 * value (`--text-meta-label`), centered, and kept on a single line. The weight +
 * color (active vs inactive) are appended in the component.
 */
const LABEL_BASE =
  'text-[length:var(--text-meta-label)] leading-none text-center whitespace-nowrap';

/**
 * ACTIVE label treatment: Inter Semi Bold (600) in the light-violet accent
 * (`--color-accent-light` #A78BFA). Figma node `8:84`.
 */
const LABEL_ACTIVE = 'font-semibold text-accent-light';

/**
 * INACTIVE label treatment: Inter Regular (400) in the muted slate
 * (`--color-text-muted` #64748B). Figma nodes `8:89/92/95`.
 */
const LABEL_INACTIVE = 'font-normal text-text-muted';

/**
 * Check-badge placement: absolutely positioned in the tile's top-right corner,
 * inset 6px from the top and right (`top-1.5 right-1.5`), matching Figma node
 * `8:85`. Merged into `CheckBadge`'s own `className` (which the badge appends
 * after its base classes, so this positioning wins).
 */
const BADGE_POSITION = 'absolute top-1.5 right-1.5';

/**
 * ThemeSwatch — the bespoke design-system viewer-theme preview tile primitive.
 *
 * Renders one "Aa" preview tile for the supplied {@link ThemeSwatchProps.theme}:
 * a per-theme fill + ink, the verbatim theme label, and — when
 * {@link ThemeSwatchProps.active} — a 2px accent border plus a top-right
 * {@link CheckBadge}. When {@link ThemeSwatchProps.onSelect} is provided the tile
 * is an interactive `<button>` (`aria-pressed`, keyboard-operable, focus ring)
 * that reports the theme on activation; otherwise it is a non-interactive
 * display-only `<div>`. The caller `className` is merged last so callers can own
 * the outer layout.
 *
 * @param props - {@link ThemeSwatchProps}
 * @returns The rendered theme swatch tile.
 */
export function ThemeSwatch({
  theme,
  active,
  onSelect,
  className,
}: ThemeSwatchProps): JSX.Element {
  const preview = THEME_PREVIEW[theme];

  // Compose token-backed class strings: invariant base + per-theme fill + the
  // active/inactive border + (when selectable) the interactive affordances +
  // the caller className (last so it wins on conflicts). `filter(Boolean)` drops
  // the empty interactive slot and an absent className before joining.
  const tileClassName = [
    TILE_BASE,
    preview.tileFill,
    active ? TILE_ACTIVE_BORDER : TILE_INACTIVE_BORDER,
    onSelect ? TILE_INTERACTIVE : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const sampleClassName = `${SAMPLE_BASE} ${preview.sampleColor}`;
  const labelClassName = `${LABEL_BASE} ${active ? LABEL_ACTIVE : LABEL_INACTIVE}`;

  // Shared inner content, identical for both the interactive and display-only
  // renders: the decorative "Aa" sample (hidden from AT), the visible theme
  // label, and — only when active — the reused selection check badge.
  const inner = (
    <>
      <span aria-hidden="true" className={sampleClassName}>
        {SAMPLE_GLYPH}
      </span>
      <span className={labelClassName}>{preview.label}</span>
      {active ? <CheckBadge checked className={BADGE_POSITION} /> : null}
    </>
  );

  // Interactive render: a real <button> that reports the theme on activation.
  if (onSelect) {
    const handleSelect = (): void => {
      onSelect(theme);
    };

    return (
      <button
        type="button"
        aria-pressed={active}
        aria-label={`${preview.label} theme`}
        onClick={handleSelect}
        className={tileClassName}
      >
        {inner}
      </button>
    );
  }

  // Display-only render: a non-interactive presentational tile.
  return <div className={tileClassName}>{inner}</div>;
}

export default ThemeSwatch;
