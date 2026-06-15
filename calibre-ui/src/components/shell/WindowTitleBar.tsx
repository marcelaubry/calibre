/**
 * ==========================================================================
 * Calibre-UI Design System — WindowTitleBar
 * The persistent macOS-style window title bar shown at the TOP of EVERY screen.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `WindowTitleBar` is the thin horizontal "window chrome" strip that sits at
 * the very top of all seven screens of the UI-only Calibre e-book-manager
 * prototype (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind
 * CSS v4 CSS-first tokens). It reproduces a macOS title bar: three
 * "traffic-light" control dots on the left and a centered window title.
 *
 * It is part of the persistent application shell and is rendered by `AppShell`
 * (a sibling file, created last) on EVERY route, above all other chrome and
 * content. Because the bar is identical across screens, AppShell renders it
 * once; the optional `title` prop lets AppShell pass a per-route title if a
 * given screen's design shows a different string.
 *
 * UI-ONLY / MOCK — DECORATIVE, NO WINDOW MANAGEMENT
 * --------------------------------------------------------------------------
 * The three dots are PURELY DECORATIVE shapes. This is a web prototype, not a
 * native desktop window: clicking a dot does nothing — there is no close /
 * minimize / zoom behavior, no OS integration, and no backend. The macOS bar
 * is a pure visual affordance from the Figma design and has NO functional
 * Calibre equivalent. Accordingly the component binds NO event handlers.
 *
 * RENDERING MODEL — PRESENTATIONAL, NO `'use client'`
 * --------------------------------------------------------------------------
 * This component holds no state, runs no hooks, and binds no event handlers —
 * it renders fully static, deterministic markup. It therefore deliberately
 * carries NO `'use client'` directive and is safe inside React Server
 * Components (the App Router default). It is rendered inside the client
 * `AppShell`; a directive-less component with no server-only code is bundled
 * into the client graph without error, and its static output guarantees zero
 * console errors / hydration warnings on every route.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, screen `2:2` = App 01)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node against the full-screen render of `2:2`
 * (the bar is byte-identical across screens `3:2` / `4:2` / `5:2` / `8:2`).
 * The title bar is NOT a wrapper group — it is the first five absolutely-
 * positioned children of the screen frame:
 *   • `2:3` background RECTANGLE → 1440×32, solid `--color-title-bar` fill,
 *     no stroke / radius / shadow.
 *   • `2:4` red dot   → 11×11 circle, `--color-window-dot-red`.
 *   • `2:5` amber dot → 11×11 circle, `--color-window-dot-amber`.
 *   • `2:6` green dot → 11×11 circle, `--color-window-dot-green`.
 *     Dots: left→right RED → AMBER → GREEN; left inset 12px; uniform 6px
 *     edge-to-edge gap (17px pitch); vertically centered in the 32px bar.
 *   • `2:7` title TEXT → "calibre — My Library (836 books)", Inter Medium
 *     (500) / 11px, `--color-text-muted`, CENTER-aligned in a box whose
 *     center (x=720) equals the FULL-bar center (1440 / 2) → the title is
 *     truly centered across the ENTIRE bar width, not the leftover space to
 *     the right of the dots.
 * (Node-ID note: the AAP referenced the dots as `2:3`/`2:4`/`2:5`; the
 * reconciled structural tree shows `2:3` is the background rectangle and the
 * dots are `2:4`/`2:5`/`2:6`. The left→right colors and values are exactly as
 * the AAP expected — only the IDs were off by one.)
 *
 * DEFAULT TITLE (Figma precedence)
 * --------------------------------------------------------------------------
 * The implementation contract gave an EXAMPLE default ("Calibre — E-book
 * Management"); the MANDATORY Figma fidelity protocol instructs using the
 * exact string the design shows. App 01 (route `/`, the common home screen)
 * displays "calibre — My Library (836 books)", so that is the default here so
 * the rendered bar matches screen `2:2` pixel-for-pixel. AppShell may override
 * per-route via the `title` prop. The em dash is the exact U+2014 codepoint
 * (written as an explicit `\u2014` escape) with a normal space on each side.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR resolves to an `@theme` token declared in `src/app/globals.css`,
 * consumed via a CSS-variable arbitrary value (`bg-[var(--color-title-bar)]`,
 * `bg-[var(--color-window-dot-red)]`, …) or a generated token utility
 * (`text-window-title` for the 11px / weight-500 type role, `text-text-muted`
 * for the muted-slate color). There are NO raw hex / rgba color literals
 * anywhere in this file (not even in comments — colors are named by their
 * token). Confirmed Figma GEOMETRY also resolves to named `@theme` tokens — the
 * 11px traffic-light dots via `h-[var(--size-window-dot)] w-[var(--size-window-dot)]`
 * and the centered-title vertical nudge via `pt-[var(--space-window-title-nudge)]`.
 * The only remaining bare utilities are Tailwind's standard scale (`h-8` = the
 * 32px bar, `gap-1.5` = the 6px dot gap, `pl-3` = the 12px left inset) plus
 * layout keywords. No image / SVG asset is created or imported: the dots are CSS
 * circles (Figma Asset Inventory = 0).
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/ui.py`
 * (Calibre's PyQt `MainWindow`). That native Qt window uses the OS's own
 * window chrome and has no traffic-light bar; this strip is a Figma-only
 * visual affordance. Nothing is imported or translated from the Python
 * codebase.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.1 / §0.3.2 — workflow map & token manifest.
 */

import type { ReactNode } from 'react';

/**
 * Props for {@link WindowTitleBar}.
 *
 * Intentionally minimal: the bar is static window chrome, so its only inputs
 * are the centered title string and an optional `className` for parent-supplied
 * overrides (e.g. a sticky / elevation utility applied by `AppShell`).
 */
export interface WindowTitleBarProps {
  /**
   * Centered window title. Defaults to the App 01 design string
   * ("calibre — My Library (836 books)", Figma node `2:7`); `AppShell` may pass
   * a per-route title.
   */
  title?: string;
  /**
   * Optional extra classes, merged AFTER the base classes so caller utilities
   * win on conflicts.
   */
  className?: string;
}

/**
 * One traffic-light dot's identity → its token-backed background class.
 * Ordered left→right exactly as Figma (`2:4` red, `2:5` amber, `2:6` green).
 * `id` is a stable React key for the rendered list; the dots are decorative and
 * carry no accessible name (the cluster is `aria-hidden`).
 */
const DOTS: ReadonlyArray<{ id: string; colorClass: string }> = [
  { id: 'red', colorClass: 'bg-[var(--color-window-dot-red)]' },
  { id: 'amber', colorClass: 'bg-[var(--color-window-dot-amber)]' },
  { id: 'green', colorClass: 'bg-[var(--color-window-dot-green)]' },
];

/**
 * Bar container classes. `relative` establishes the positioning context for the
 * absolutely-centered title; `flex items-center` vertically centers the dot
 * cluster; `h-8` = the 32px height; `w-full` spans the viewport (responsive —
 * NEVER a fixed 1440px, so the bar degrades cleanly 1440→1280 with no
 * horizontal overflow); `pl-3` = the 12px left inset of the dot cluster; the
 * background is the `--color-title-bar` token.
 */
const BAR_CLASSES =
  'relative flex h-8 w-full items-center pl-3 bg-[var(--color-title-bar)]';

/**
 * Dot-cluster classes: a horizontal row, vertically centered, with the Figma
 * 6px edge-to-edge gap (`gap-1.5`). The whole cluster is `aria-hidden` (the
 * dots are decorative — see the file header).
 */
const DOT_CLUSTER_CLASSES = 'flex items-center gap-1.5';

/**
 * Per-dot base classes: an 11×11 px perfect circle via the named
 * `--size-window-dot` token (`h-[var(--size-window-dot)] w-[var(--size-window-dot)]`)
 * + `rounded-full`; `shrink-0` keeps each dot from compressing if the row is
 * ever space-constrained. The fill color is supplied per dot from {@link DOTS}.
 */
const DOT_BASE_CLASSES =
  'h-[var(--size-window-dot)] w-[var(--size-window-dot)] shrink-0 rounded-full';

/**
 * Title classes. `absolute inset-0` fills the bar's padding box (x = 0 → full
 * width, regardless of `pl-3`), and `flex items-center justify-center` centers
 * the title on both axes → TRUE full-bar HORIZONTAL centering (matching Figma's
 * box center x = 720 = 1440 / 2), independent of the dot-cluster width.
 * `text-window-title` applies the 11px / weight-500 type role; `text-text-muted`
 * applies the muted-slate color. `pointer-events-none` keeps the overlay from
 * intercepting interaction; `select-none` keeps the chrome text unselectable.
 *
 * VERTICAL nudge — `pt-[var(--space-window-title-nudge)]` (3px token): Figma node
 * `2:7` positions the title text box at y = 10 (height 16, TOP-aligned), so its
 * rendered glyph center sits at ≈ y17.4 — i.e. ~1.4px BELOW the 32px bar's
 * midline (y16), NOT on it. A pure `items-center` would center the glyph at y16
 * and read ~1.4px high vs the design. The 3px top inset shifts the flex-centering
 * band to y3→32 (center ≈ y17.5), reproducing Figma's exact vertical glyph
 * position while leaving horizontal centering (x = 720) untouched. The nudge is
 * supplied by the named `--space-window-title-nudge` token so no bare px literal
 * is used.
 */
const TITLE_CLASSES =
  'pointer-events-none absolute inset-0 flex select-none items-center ' +
  'justify-center pt-[var(--space-window-title-nudge)] text-window-title text-text-muted';

/**
 * The default centered title — the exact App 01 design string (Figma node
 * `2:7`). The separator is the U+2014 EM DASH, written as an explicit escape so
 * the precise codepoint is unambiguous and encoding-independent.
 */
const DEFAULT_TITLE = 'calibre \u2014 My Library (836 books)';

/**
 * WindowTitleBar — the persistent macOS-style window title bar.
 *
 * Renders a full-width, 32px-tall `<div>` strip with the dark `--color-title-bar`
 * background. Inside: a left, vertically-centered cluster of three decorative
 * traffic-light dots (red, amber, green — `aria-hidden`), and a title `<span>`
 * absolutely centered across the FULL bar width. The caller `className` is
 * merged AFTER the base classes so caller utilities win on conflicts.
 *
 * @param props - {@link WindowTitleBarProps}
 * @returns The rendered window title bar.
 */
export function WindowTitleBar({
  title = DEFAULT_TITLE,
  className,
}: WindowTitleBarProps): ReactNode {
  // Merge token-backed base classes with any caller className (appended last so
  // caller utilities win). `filter(Boolean)` drops an absent className before
  // joining, keeping the result a clean, space-separated class string.
  const merged = [BAR_CLASSES, className].filter(Boolean).join(' ');

  return (
    <div className={merged}>
      {/* Left cluster — three decorative macOS traffic-light dots (red → amber
          → green). Decorative only: marked aria-hidden so a screen reader does
          not announce stray circles, and bound to no handlers. */}
      <span className={DOT_CLUSTER_CLASSES} aria-hidden="true">
        {DOTS.map((dot) => (
          <span key={dot.id} className={`${DOT_BASE_CLASSES} ${dot.colorClass}`} />
        ))}
      </span>

      {/* Centered window title — truly centered across the full bar width via
          the absolute overlay (see TITLE_CLASSES). Rendered as a <span>, never
          a heading element. */}
      <span className={TITLE_CLASSES}>{title}</span>
    </div>
  );
}

export default WindowTitleBar;
