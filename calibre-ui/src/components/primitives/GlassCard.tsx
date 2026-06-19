/**
 * ==========================================================================
 * Calibre-UI Design System — GlassCard
 * The foundational glassmorphic SURFACE / PANEL primitive.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `GlassCard` is one of the 14 bespoke design-system primitives (AAP §0.3.3 /
 * §0.4.2) for the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * It is the single, reusable dark-navy glassmorphic surface that nearly every
 * screen composes — the sidebar panel, the cover-grid cards, the list/detail
 * panels, the viewer's TOC/tools panels, the settings panels, and the modal
 * bodies. Use this INSTEAD of a raw `<div>` whenever a filled surface is
 * needed, so the surface tone, hairline border, and corner radius stay
 * consistent across all seven screens.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * The component defaults reproduce the canonical rounded "card" surface
 * verified against the App 02 cover-grid card (`3:81` selected / `3:91`
 * unselected):
 *   • surface fill   → `color-card` token (state-invariant)  → `bg-card`
 *   • default border → `border-white-07` token (hairline)    → `border border-[var(--border-white-07)]`
 *   • corner radius  → `radius-card` token (state-invariant) → `rounded-card`
 *   • elevation      → none on cards (shadows belong to MODAL surfaces)
 * The flush full-bleed panel seen in the App 01 sidebar (`2:36`: fill
 * `surface-1` token, no radius, right-edge-only hairline) is NOT a different
 * primitive — it is this `GlassCard` with `surface="surface-1"` plus caller
 * className overrides (e.g. `rounded-none border-0`). The accent selection
 * border (the `border-accent` token on selected grid cards) is likewise a
 * CONSUMER state (e.g. `BookCard`), not a base-primitive concern.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / radius / shadow / border value below resolves to an `@theme`
 * token declared in `src/app/globals.css` and is consumed through a Tailwind v4
 * utility class (`bg-surface-1`, `bg-surface-2`, `bg-card`, `rounded-card`,
 * `shadow-convert`) or a CSS-variable arbitrary value
 * (`border-[var(--border-white-07)]`). There are NO raw color or dimension
 * literals in this file — the only bare literals permitted app-wide are `0`,
 * `none`, `auto`, `inherit`, `currentColor`, and `transparent` (none of which
 * are needed here).
 *
 * RENDERING MODEL
 * --------------------------------------------------------------------------
 * This is a PURE PRESENTATIONAL component: it holds no state, runs no hooks,
 * and binds no event handlers of its own. It therefore deliberately carries NO
 * `'use client'` directive and is safe to render inside React Server
 * Components (the default in the App Router). Any interactivity a caller needs
 * (e.g. `onClick`) is forwarded transparently via `...rest`.
 *
 * USAGE
 * --------------------------------------------------------------------------
 *   // Default rounded card (bg-card + border-white-07 hairline + radius-card):
 *   <GlassCard className="p-4">…</GlassCard>
 *
 *   // Lighter panel surface, no border, with extra layout classes:
 *   <GlassCard surface="surface-1" bordered={false} className="h-full p-3">…</GlassCard>
 *
 *   // Elevated modal-body surface (opts into the dialog elevation shadow):
 *   <GlassCard surface="surface-2" shadow className="p-6">…</GlassCard>
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/library/
 * views.py` (the Qt library panels/surfaces this card models). Nothing is
 * imported or translated from the Python codebase.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import type { HTMLAttributes, JSX, ReactNode } from 'react';

/**
 * Props for {@link GlassCard}.
 *
 * Extends the full set of native `<div>` attributes (`className`, `style`,
 * `id`, `onClick`, `role`, `aria-*`, `data-*`, …), all of which are forwarded
 * to the underlying element, so `GlassCard` is a drop-in replacement for a
 * surface `<div>`.
 */
export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Background surface tone, mapped 1:1 to an `@theme` color token:
   *   • `'surface-1'` → `bg-surface-1` — app chrome panels (e.g. sidebar).
   *   • `'surface-2'` → `bg-surface-2` — viewer / modal body surfaces.
   *   • `'card'`      → `bg-card` — content cards (the default).
   * @default 'card'
   */
  surface?: 'surface-1' | 'surface-2' | 'card';
  /**
   * When `true` (the default), renders the canonical hairline border using
   * the white-7% token (`border-[var(--border-white-07)]`). Pass `false` for
   * flush/borderless surfaces (e.g. nested panels, or the full-bleed sidebar
   * which supplies its own single-edge border via a caller className).
   * @default true
   */
  bordered?: boolean;
  /**
   * When `true`, applies the dialog elevation shadow (`shadow-convert`). Cards
   * have NO shadow in the design, so this defaults to `false`; enable it only
   * for elevated, modal-like floating surfaces.
   * @default false
   */
  shadow?: boolean;
  /** Surface contents. */
  children?: ReactNode;
}

/**
 * Maps each {@link GlassCardProps.surface} value to its Tailwind background
 * utility. Centralizing the mapping here keeps the surface tones token-backed
 * (no inline conditional hex) and the key type is derived from the public
 * prop, so the map and the interface can never silently drift apart.
 */
const SURFACE_BG: Record<NonNullable<GlassCardProps['surface']>, string> = {
  'surface-1': 'bg-surface-1',
  'surface-2': 'bg-surface-2',
  card: 'bg-card',
};

/**
 * The frosted-glass backdrop blur applied to every surface (AAP "glassmorphic
 * cards"). `backdrop-blur-sm` is a Tailwind v4 keyword utility that applies the
 * design's small frosted `backdrop-filter` blur — not a hardcoded literal.
 */
const GLASS_BLUR = 'backdrop-blur-sm';

/** The always-on corner-radius utility, backed by the `--radius-card` token. */
const CARD_RADIUS = 'rounded-card';

/** Default hairline border (the `border-white-07` token), when `bordered`. */
const CARD_BORDER = 'border border-[var(--border-white-07)]';

/** Dialog elevation shadow token utility, applied only when `shadow` is set. */
const CARD_SHADOW = 'shadow-convert';

/**
 * GlassCard — the bespoke glassmorphic surface primitive.
 *
 * Renders a single `<div>` whose base classes resolve entirely to design
 * tokens (surface background, corner radius, optional hairline border,
 * optional elevation shadow, and the frosted backdrop blur). Any caller
 * `className` is merged AFTER the base classes so callers can extend or
 * override freely (e.g. add padding, flex/grid layout, fixed dimensions, or
 * the flush-sidebar `rounded-none border-0` overrides). All remaining native
 * div attributes are spread onto the element via `...rest`.
 *
 * @param props - {@link GlassCardProps}
 * @returns The rendered surface element.
 */
export function GlassCard({
  surface = 'card',
  bordered = true,
  shadow = false,
  className,
  children,
  ...rest
}: GlassCardProps): JSX.Element {
  // Compose the token-backed base classes. Ternaries yield '' (not `false`) for
  // the disabled options so the array stays `string[]`; `filter(Boolean)` then
  // drops the empties before joining.
  const base = [
    SURFACE_BG[surface],
    CARD_RADIUS,
    GLASS_BLUR,
    bordered ? CARD_BORDER : '',
    shadow ? CARD_SHADOW : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Merge the caller className AFTER the base so caller utilities win on
  // conflicts (Tailwind's later-declared class / source order governs).
  const merged = [base, className].filter(Boolean).join(' ');

  return (
    <div className={merged} {...rest}>
      {children}
    </div>
  );
}

export default GlassCard;
