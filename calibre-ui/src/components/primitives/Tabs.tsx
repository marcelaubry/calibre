'use client';

/**
 * ==========================================================================
 * Calibre-UI Design System — Tabs
 * The single horizontal TAB-STRIP primitive (active tab = purple underline).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `Tabs` is one of the 14 bespoke design-system primitives (AAP §0.3.3 /
 * §0.4.2) for the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * It is the ONE horizontal tab strip used wherever a row of selectable section
 * labels appears, most authoritatively:
 *   • EDITOR — the App 04 EPUB Editor open-file tabs (Figma node `5:29`, parent
 *     screen `5:2`): content.opf / ch01.html / ch14.html / styles.css / toc.ncx.
 *   • CONVERT — the App 05 Convert Books dialog option tabs (Figma screen
 *     `6:9`): Look & Feel / Heuristic Processing / Search & Replace / Table of
 *     Contents / Metadata / Output Options.
 * Screen code must NEVER hand-roll a tab row; it always composes this primitive
 * so the active-underline beat, typography, spacing, and the no-layout-shift
 * inactive state stay identical and 100% token-backed across every screen.
 *
 * This primitive is label-driven (its contract is a `string[]` of labels) and
 * carries an explicit `variant` (`'convert'` | `'editor'`) so each consumer gets
 * its EXACT CONFIRMED Figma tab state (CP4 Figma-fidelity fix per findings
 * §Tabs L238 / §FileTabs L82-105). Both variants share the 2px gradient
 * underline on the active tab; the `'editor'` variant additionally renders the
 * App04 active-tab CELL fill, CONTIGUOUS spacing, truncated labels, and (with
 * `closable`) the per-tab close affordance — so the consuming `FileTabs`
 * component no longer needs to layer those details on top.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * This primitive renders real, interactive `<button>` tabs that bind `onClick`
 * + `onKeyDown` handlers and uses the `useRef` hook for roving-focus management,
 * so it must be a Client Component (App Router components default to Server
 * Components, which cannot attach event handlers or run hooks). The directive is
 * the very first line of the file, before any import.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node against BOTH consumers — the Editor strip
 * (`5:29`, parent `5:2`) and the Convert option-tabs row (screen `6:9`, active
 * tab `6:26`, underline `6:28`, hairline `6:25`). CONFIRMED state delta:
 *
 *   | Property         | Editor 5:29              | Convert 6:9              |
 *   |------------------|--------------------------|--------------------------|
 *   | active label     | #F1F5FF, Inter 500       | #A78BFA, Inter 600       |
 *   | inactive label   | #64748B, Inter 400       | #64748B, Inter 400       |
 *   | label size       | 11px                     | 11px                     |
 *   | active underline | 2px gradient #7B61FF→#A78BFA, full-width, flush bottom | identical |
 *   | inactive underline | none (fixed-height, no shift) | none (fixed-height, no shift) |
 *   | inter-tab gap    | 0px (contiguous cells)   | 4px                      |
 *   | tab h-padding    | 16px left                | 10px L + 10px R          |
 *   | strip hairline   | white@6% (`5:30`)        | white@7% (`6:25`)        |
 *
 * CP4 Figma-fidelity resolution (per findings §Tabs L238 / §FileTabs L82-105):
 * rather than normalizing both screens into one look, the primitive now carries
 * a `variant` that reproduces each screen's CONFIRMED state EXACTLY:
 *   • active underline (both) = the 2px VERTICAL gradient #7B61FF→#A78BFA,
 *     rendered as an out-of-flow bottom child bar (`UNDERLINE_BAR`) via
 *     `bg-gradient-tab-underline` — see BLITZY [COLOR] (underline) below.
 *   • convert active label = `text-accent-light` (#A78BFA) Inter 600; 4px gap.
 *   • editor active label = `text-text-primary` (#F1F5FF) Inter 500 on a
 *     `bg-surface-1` (#10132A) cell; contiguous (gap-0); truncated labels; close.
 *   • inactive (both) = `text-text-muted` (#64748B) Inter 400, hover→secondary.
 *   • strip hairline = `border-b border-[var(--border-white-07)]`.
 *
 * BLITZY [COLOR] (active label): now per-variant via `TAB_ACTIVE` — convert uses
 * `text-accent-light` + `font-semibold` (#A78BFA / 600, `6:26`); editor uses
 * `text-text-primary` + `font-medium` (#F1F5FF / 500, `5:29`). Matches Figma
 * exactly (no longer normalized to a single value).
 *
 * BLITZY [COLOR] (underline): the CONFIRMED Figma underline (`5:34` / `6:28`) is
 * a 2px VERTICAL gradient `linear-gradient(0deg, #7B61FF 0% → #A78BFA 100%)`.
 * A CSS `border-bottom` cannot carry a gradient, so the primitive now renders it
 * as an absolutely-positioned 2px bottom child bar (`UNDERLINE_BAR`) painting the
 * `--gradient-tab-underline` token via the `bg-gradient-tab-underline` utility.
 * Being out of flow, it produces ZERO layout shift between active/inactive (no
 * reserved border rail needed). This replaces the prior flat-accent border
 * approximation — exact gradient fidelity per finding §Tabs L238.
 *
 * BLITZY [TYPOGRAPHY]: per-variant font WEIGHT now matches Figma exactly —
 * inactive `font-normal` (400), editor-active `font-medium` (500), convert-active
 * `font-semibold` (600). The 11px size is set token-only via
 * `text-[length:var(--text-button-secondary)]` so the weight is controlled
 * separately (no longer normalized to the token's bundled 500).
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / gradient value resolves to an `@theme` token from
 * `src/app/globals.css`, consumed via a Tailwind v4 utility (`text-text-primary`,
 * `text-text-muted`, `text-text-secondary`, `text-accent-light`, `bg-surface-1`,
 * `bg-gradient-tab-underline`) or a CSS-variable arbitrary value
 * (`text-[length:var(--text-button-secondary)]`, `border-[var(--border-white-07)]`,
 * `ring-[var(--border-accent)]`). There are NO raw hex / rgba color literals in
 * any className. The only bare literals are LAYOUT / geometry values that carry
 * no color information — the underline bar thickness (`h-0.5` = 2px), the strip
 * hairline width (`border-b`), the per-variant inter-tab gap (`gap-1` / `gap-0`),
 * the tab padding (`px-2.5` / `py-2.5` = 10px = Convert `6:9`), the standard
 * font-weight utilities (`font-normal`/`font-medium`/`font-semibold`), the
 * close-button VISIBLE size (`h-u16 w-u16` = the Figma 16×16 cell), and its
 * transparent pointer-target overlay (`after:[inset:-5px]` → ≈26×26 hit area;
 * see the CLOSE_BTN BLITZY [A11Y] note).
 *
 * RENDERING MODEL
 * --------------------------------------------------------------------------
 * A single `<div role="tablist">` lays the tabs out in a full-width flex row
 * (so the bottom hairline spans the full width while the tabs are left-aligned,
 * matching both screens). The caller `className` is merged onto this container
 * (callers own the strip's outer layout / width). Each tab is a real
 * `<button role="tab">`; the active tab swaps one class set (primary text +
 * accent bottom border) while every other tab keeps the muted text + a
 * `transparent` bottom border of the SAME `border-b-2` thickness — so selecting
 * a tab causes ZERO layout shift (THE key fidelity beat). Each tab uses
 * `-mb-px` so its 2px bottom border straddles the container's 1px hairline,
 * reproducing the Figma relationship where the underline sits on the hairline.
 *
 * ACCESSIBILITY (UI3 — invisible, always applied)
 * --------------------------------------------------------------------------
 * • Implements the WAI-ARIA Tabs pattern: `role="tablist"` (with
 *   `aria-orientation="horizontal"`) on the container and `role="tab"` +
 *   `aria-selected` on each button — a native `<button>` is focusable and
 *   activates on Space/Enter for free.
 * • Roving tabindex: the active tab is the single tab stop (`tabIndex=0`); the
 *   rest are `tabIndex=-1`. If `active` matches no tab, the first tab becomes
 *   the tab stop so the strip is always keyboard-reachable.
 * • Arrow-key navigation with automatic activation (the recommended pattern for
 *   cheap panels): ArrowLeft/ArrowRight wrap through the tabs and Home/End jump
 *   to the first/last; each moves focus AND fires `onSelect` for the focused
 *   tab. Selection is otherwise reported on click.
 * • A token-backed `:focus-visible` ring (`--border-accent`) is shown for
 *   keyboard users only — invisible at rest (DS2-e).
 * • Editor (closable) variant: each tab + its sibling close `<button>` share a
 *   PLAIN wrapper `<span>` (no role — a `role="presentation"` would be ignored
 *   due to the focusable descendants), so the tablist reasserts ownership of its
 *   `role="tab"` buttons through `aria-owns` (each tab carries a stable
 *   `useId`-derived id). To keep the tablist's ONLY owned children the tabs
 *   (`aria-required-children`: a tablist may not own a `button`), the close
 *   control is `aria-hidden` + `tabIndex=-1` — a decorative MOUSE affordance,
 *   removed from the accessibility tree and the tab order. KEYBOARD users close
 *   the focused tab with Delete/Backspace (the WAI-ARIA APG deletable-tabs
 *   pattern; see `handleKeyDown`). The close glyph's CLICK target is widened to
 *   ≈26×26 via a transparent `::after` overlay while its VISIBLE size stays the
 *   Figma 16×16 (see the CLOSE_BTN BLITZY [A11Y] note).
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/tweak_book/
 * file_list.py` (Editor open-file tabs) and `src/calibre/gui2/convert/` (the Qt
 * conversion option panels). Nothing is imported or translated from the Python
 * codebase.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import { useId, useRef, type JSX, type KeyboardEvent, type MouseEvent } from 'react';

/**
 * The two CONFIRMED Figma tab-strip treatments (CP4 Figma-fidelity fix per
 * findings §Tabs L238 / §FileTabs L82-105). Both share the 2px gradient
 * underline on the active tab; they differ in the per-screen active-tab details:
 *   • `'convert'` — App05 Convert option tabs (`6:26`/`6:28`): active label
 *     accent-light (#A78BFA) Inter 600; 4px inter-tab gap; no cell fill, no close.
 *   • `'editor'`  — App04 Editor open-file tabs (`5:29`/`5:34`): active label
 *     primary (#F1F5FF) Inter 500 on a surface-1 (#10132A) active CELL fill;
 *     CONTIGUOUS (no gap); per-tab close affordance (`closable`); truncated labels.
 */
export type TabsVariant = 'convert' | 'editor';

/**
 * Props for {@link Tabs}.
 *
 * The list of labels, the active label, and an optional change handler, plus the
 * CP4 Figma-fidelity extensions: an explicit per-screen `variant` and (editor
 * only) a `closable` per-tab close affordance with its `onClose` callback.
 */
export interface TabsProps {
  /**
   * The ordered tab labels, rendered left → right as the row of tabs. Each
   * label is also the tab's identity (the value passed to {@link TabsProps.onSelect}
   * and compared against {@link TabsProps.active}); labels are expected to be
   * unique, as tab names inherently are. An empty array renders an empty
   * (but valid) tablist.
   */
  tabs: string[];
  /**
   * The label of the currently-active tab. The matching tab renders the active
   * treatment (per-variant label + the 2px gradient underline) and is the single
   * keyboard tab stop; all others render inactive (muted text, no underline). If
   * the value matches no entry in {@link TabsProps.tabs}, no tab shows the
   * active treatment and the FIRST tab becomes the keyboard tab stop so the
   * strip stays reachable.
   */
  active: string;
  /**
   * Called with the label of the tab the user activated — on click, on
   * Space/Enter, and on arrow/Home/End navigation (automatic activation).
   * Optional so the strip can be rendered display-only.
   */
  onSelect?: (tab: string) => void;
  /**
   * Which CONFIRMED Figma treatment to paint (see {@link TabsVariant}).
   * @default 'convert'
   */
  variant?: TabsVariant;
  /**
   * `'editor'` variant only: when `true`, each tab renders a trailing close
   * affordance (a real sibling `<button>`) that invokes {@link TabsProps.onClose}.
   * Matches the App04 editor open-file tabs (`5:29`).
   * @default false
   */
  closable?: boolean;
  /**
   * Called with the label of the tab whose close affordance was activated. Only
   * wired up while {@link TabsProps.closable} is `true`.
   */
  onClose?: (tab: string) => void;
  /**
   * Extra classes merged onto the outer `<div role="tablist">` container —
   * callers own the strip's outer layout / width / spacing here (e.g.
   * `w-full`, `px-7`, a screen-specific surface). Merged AFTER the base classes
   * so caller utilities win on conflicts.
   */
  className?: string;
}

/**
 * Container (`role="tablist"`) classes.
 *
 * - `flex`: a block-level, full-width flex row so the bottom hairline spans the
 *   full container width while the tabs stay left-aligned (matches both the
 *   Editor strip and the Convert option-tabs row, where the hairline extends
 *   past the last tab as empty surface).
 * - `items-stretch`: every tab stretches to the row's height, so the active and
 *   inactive tabs are always the same height (reinforces zero layout shift).
 * - `gap-1`: the CONFIRMED 4px inter-tab gap (Convert `6:9`).
 * - `border-b border-[var(--border-white-07)]`: the strip hairline — the
 *   `--border-white-07` token (rgba(255,255,255,0.07)), CONFIRMED on Convert
 *   node `6:25`. The active tab's accent border seats onto this line via the
 *   per-tab `-mb-px`.
 */
const TABLIST_BASE = 'flex items-stretch border-b border-[var(--border-white-07)]';

/**
 * Per-variant inter-tab gap on the `role="tablist"` container:
 *   • convert → `gap-1` (the CONFIRMED 4px inter-tab gap, Convert `6:9`).
 *   • editor  → `gap-0` (CONTIGUOUS tabs, Editor `5:29`).
 */
const TABLIST_GAP: Record<TabsVariant, string> = {
  convert: 'gap-u4',
  editor: 'gap-0',
};

/**
 * Variant-invariant TAB classes — the `<button role="tab">` itself.
 *
 * - Box: `relative` (anchors the focus ring / future overlays) · `inline-flex
 *   items-center justify-center` (vertically centers the label) ·
 *   `whitespace-nowrap` (labels never wrap) · `select-none` · `cursor-pointer`.
 * - Spacing: `px-2.5 py-2.5` = the CONFIRMED 10px horizontal padding (Convert
 *   `6:9`) and a matching 10px vertical padding (~34px tab height).
 * - Underline (CP4 Figma-fidelity fix): the active tab's 2px underline is the
 *   CONFIRMED Figma vertical GRADIENT (`5:34`/`6:28`), rendered as an absolutely
 *   positioned bottom child bar (`UNDERLINE_BAR`) carrying the
 *   `bg-gradient-tab-underline` utility — NOT the prior flat `border-accent`.
 *   Because the bar is out of flow, selection causes ZERO layout shift with no
 *   reserved border rail needed; the bar seats on the container hairline.
 * - Type SIZE: `text-[length:var(--text-button-secondary)]` (11px) — size only,
 *   so the per-state font WEIGHT (set via the active/inactive classes) is the
 *   CONFIRMED Figma weight rather than the token's bundled 500 (resolves the
 *   "normalizes typography" half of finding §Tabs L238).
 * - Focus: a token-backed, inset `:focus-visible` ring (`--border-accent`),
 *   shown for keyboard users only (UI3) and invisible at rest (DS2-e); the
 *   default UA outline is removed.
 * - Motion: the text/bg color change animates only when motion is allowed
 *   (UI6 / prefers-reduced-motion).
 */
const TAB_BASE =
  'relative inline-flex items-center justify-center whitespace-nowrap ' +
  'select-none cursor-pointer px-u10 py-u10 text-[length:var(--text-button-secondary)] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset ' +
  'focus-visible:ring-[var(--border-accent)] ' +
  'motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out';

/**
 * ACTIVE tab classes PER VARIANT — the CONFIRMED Figma active-label color +
 * weight, plus (editor) the active CELL fill. The 2px gradient underline is
 * shared (rendered by `UNDERLINE_BAR`, see the render):
 *   • convert → accent-light label (`--color-accent-light` #A78BFA), Inter 600
 *     (`font-semibold`) — matches `6:26`.
 *   • editor  → primary label (`--color-text-primary` #F1F5FF), Inter 500
 *     (`font-medium`) on a surface-1 (`--color-surface-1` #10132A) cell fill —
 *     matches `5:29`.
 */
const TAB_ACTIVE: Record<TabsVariant, string> = {
  convert: 'text-accent-light font-semibold',
  editor: 'text-text-primary font-medium bg-surface-1',
};

/**
 * INACTIVE tab classes: muted slate label (`--color-text-muted`, #64748B) at the
 * CONFIRMED Inter 400 (`font-normal`) weight; no underline bar (no layout shift,
 * since the active bar is out of flow). On hover the label brightens to the
 * secondary slate token (`--color-text-secondary`, #94A3B8); Tailwind v4 gates
 * `hover:` behind `@media (hover: hover)`, so touch devices never get sticky hover.
 */
const TAB_INACTIVE = 'text-text-muted font-normal hover:text-text-secondary';

/**
 * The active-tab GRADIENT UNDERLINE — a 2px (`h-0.5`) absolutely-positioned bottom
 * child bar spanning the tab width (`inset-x-0 bottom-0`), painting the CONFIRMED
 * Figma vertical accent→accent-light ramp via the `bg-gradient-tab-underline`
 * utility (`--gradient-tab-underline`). `pointer-events-none` so it never
 * intercepts clicks; `aria-hidden` (decorative). Out of flow ⇒ zero layout shift.
 */
const UNDERLINE_BAR =
  'pointer-events-none absolute inset-x-0 bottom-0 h-u2 bg-gradient-tab-underline';

/**
 * `'editor'` variant label wrapper — truncates a long file name to an abbreviated
 * width (`max-w-32` = 8rem) with an ellipsis (`truncate`), matching the App04
 * editor tabs' abbreviated open-file labels (`5:29`). `block` is required for
 * `truncate` (text-overflow needs a block formatting context with a width).
 */
const EDITOR_LABEL = 'block max-w-u128 truncate';

/**
 * `'editor'` variant per-tab CLOSE affordance — a real sibling `<button>` (NOT
 * nested inside the `role="tab"` button, which would be invalid), absolutely
 * positioned at the tab's right edge and vertically centered. Token-backed muted
 * glyph that brightens on hover.
 *
 * It is a DECORATIVE, mouse-only affordance: `aria-hidden` + `tabIndex=-1` keep it
 * out of the accessibility tree and the tab order (so the tablist owns only its
 * `role="tab"` children — `aria-required-children` — with no `aria-hidden-focus`
 * conflict). Keyboard/AT users close the focused tab with Delete/Backspace (the
 * WAI-ARIA APG deletable-tabs pattern; see `handleKeyDown`). A mouse click still
 * fires `onClose` because pointer events dispatch on aria-hidden nodes. (Because
 * it is removed from the tab order it shows no `:focus-visible` ring in practice;
 * the ring utilities are retained as defensive styling only.)
 *
 * BLITZY [A11Y]: the VISIBLE control is the CONFIRMED Figma 16×16 (`h-u16 w-u16`)
 * "×" cell — its hover color, `rounded-control-sm`, and glyph all stay at that
 * exact Figma size (Figma precedence, UF3 — the rendered output is NOT silently
 * enlarged). To honour the 24×24 pointer-target recommendation (WCAG 2.5.8)
 * WITHOUT altering that visual, a transparent `::after` overlay
 * (`after:[inset:-5px]`) extends the CLICKABLE hit area to ≈26×26px around the
 * 16×16 glyph. The pseudo-element paints nothing (no background, no border), so
 * the target is larger only to the pointer, never to the eye. `relative` makes
 * the button the containing block for that overlay (it is already an `absolute`
 * positioned element, so the overlay anchors to its border box).
 */
const CLOSE_BTN =
  'absolute right-u6 top-1/2 -translate-y-1/2 inline-flex h-u16 w-u16 items-center justify-center ' +
  'rounded-control-sm leading-none select-none cursor-pointer ' +
  'text-text-muted hover:text-text-primary motion-safe:transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)] ' +
  "after:absolute after:content-[''] after:[inset:-5px]";

/**
 * Tabs — the bespoke design-system horizontal tab-strip primitive.
 *
 * Renders a `<div role="tablist">` of `<button role="tab">` children. The tab
 * whose label equals {@link TabsProps.active} gets the active treatment
 * (primary text + accent underline) and is the single keyboard tab stop; the
 * rest are muted with a transparent same-thickness underline (zero layout
 * shift). Activating a tab — by click, Space/Enter, or arrow/Home/End keyboard
 * navigation — fires {@link TabsProps.onSelect} with that tab's label. The
 * caller `className` is merged onto the container.
 *
 * @param props - {@link TabsProps}
 * @returns The rendered tab strip.
 */
export function Tabs({
  tabs,
  active,
  onSelect,
  variant = 'convert',
  closable = false,
  onClose,
  className,
}: TabsProps): JSX.Element {
  // One ref per tab button, used to move DOM focus during arrow/Home/End
  // navigation (roving tabindex). Kept in a stable array across renders.
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // A stable, SSR-safe base id for this strip instance. Each `role="tab"` button
  // derives a unique id from it (`${baseId}-tab-${index}`). In the editor variant
  // the tabs are wrapped (so they can sit beside their sibling close `<button>`),
  // so the tablist claims them explicitly through `aria-owns` — see the render.
  const baseId = useId();
  const tabId = (index: number): string => `${baseId}-tab-${index}`;

  // The index of the active tab. When `active` matches no label (`-1`), the
  // FIRST tab becomes the keyboard tab stop so the strip is always reachable;
  // `aria-selected` still resolves per-tab from the exact label match below.
  const activeIndex = tabs.indexOf(active);
  const focusableIndex = activeIndex >= 0 ? activeIndex : 0;

  // Focus the tab at `index` and report it through `onSelect` (automatic
  // activation). Bounds-guarded so out-of-range indices are inert.
  const selectIndex = (index: number): void => {
    if (index < 0 || index >= tabs.length) {
      return;
    }
    tabRefs.current[index]?.focus();
    onSelect?.(tabs[index]);
  };

  // WAI-ARIA horizontal-tablist key handling. Arrow keys wrap; Home/End jump to
  // the ends. `preventDefault` stops the arrow keys from also scrolling the page.
  // Editor (closable) variant only: Delete/Backspace on the focused tab closes it
  // — the WAI-ARIA APG "deletable tabs" mechanism. Because the visible "×" is a
  // decorative, aria-hidden mouse affordance (see the render), Delete/Backspace is
  // the KEYBOARD close path, so removing the close button from the tab order does
  // not strand keyboard users.
  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ): void => {
    const count = tabs.length;
    if (count === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        selectIndex((index + 1) % count);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        selectIndex((index - 1 + count) % count);
        break;
      case 'Home':
        event.preventDefault();
        selectIndex(0);
        break;
      case 'End':
        event.preventDefault();
        selectIndex(count - 1);
        break;
      case 'Delete':
      case 'Backspace':
        // Keyboard close for the editor (closable) variant. Move focus to a
        // SURVIVING neighbour first so it is never stranded on the tab that is
        // about to unmount: prefer the PREVIOUS tab (its key/index is unchanged by
        // the removal, so React keeps its DOM node and the focus sticks); fall
        // back to the next tab only when closing the first tab.
        if (variant === 'editor' && closable && onClose) {
          event.preventDefault();
          const neighbour = index > 0 ? index - 1 : index + 1;
          if (neighbour >= 0 && neighbour < count) {
            tabRefs.current[neighbour]?.focus();
          }
          onClose(tabs[index]);
        }
        break;
      default:
        break;
    }
  };

  // Close handler for the editor variant. `stopPropagation` keeps the click from
  // bubbling, and because the close button is a SIBLING of the tab button (not a
  // child), activating it never also selects the tab.
  const handleClose = (event: MouseEvent<HTMLButtonElement>, tab: string): void => {
    event.stopPropagation();
    onClose?.(tab);
  };

  // The caller className is appended last so its utilities win on conflicts
  // (Tailwind source order governs); `filter(Boolean)` drops a missing value.
  const containerClassName = [TABLIST_BASE, TABLIST_GAP[variant], className]
    .filter(Boolean)
    .join(' ');

  // Editor variant renders a per-tab close affordance (a real SIBLING <button>),
  // so each tab is wrapped together with its close button in a styling <span>.
  // That wrapper carries NO role: a `role="presentation"` on it would be IGNORED
  // whenever it has focusable descendants (here the tab AND the close button) per
  // the ARIA presentational-roles-conflict rule, leaving a generic element as the
  // tablist's direct child and breaking the required tablist→tab ownership
  // (`aria-required-children`). Instead the tablist claims its tabs EXPLICITLY
  // via `aria-owns` (see `ownsAttr`), so the `role="tab"` buttons remain its owned
  // children regardless of the DOM wrapper.
  const showClose = variant === 'editor' && closable;

  // When tabs are wrapped (editor/closable), reassert tablist→tab ownership via
  // `aria-owns` listing every tab id. When the bare `role="tab"` buttons are
  // already the tablist's direct DOM children (convert/display), `aria-owns` is
  // unnecessary and is omitted so assistive tech never double-counts the tabs.
  const ownsAttr = showClose
    ? tabs.map((_, index) => tabId(index)).join(' ')
    : undefined;

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      aria-owns={ownsAttr}
      className={containerClassName}
    >
      {tabs.map((tab, index) => {
        const isActive = tab === active;
        const tabClassName = [TAB_BASE, isActive ? TAB_ACTIVE[variant] : TAB_INACTIVE]
          .join(' ');

        // The tab button itself (identical structure across variants). On the
        // editor variant the label truncates; the active tab carries the gradient
        // underline bar. When closable, extra right padding (`pr-6`) reserves room
        // for the absolutely-positioned close button. `key` is omitted here and
        // applied to the outermost returned element below.
        const tabButton = (
          <button
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={tabId(index)}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={index === focusableIndex ? 0 : -1}
            className={showClose ? `${tabClassName} pr-u24` : tabClassName}
            onClick={() => onSelect?.(tab)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {variant === 'editor' ? <span className={EDITOR_LABEL}>{tab}</span> : tab}
            {/* Active-tab 2px gradient underline (decorative, out of flow). */}
            {isActive ? <span aria-hidden="true" className={UNDERLINE_BAR} /> : null}
          </button>
        );

        // Composite key guarantees uniqueness even if two labels collide,
        // avoiding React key-collision console warnings (zero-console gate).
        const key = `${tab}-${index}`;

        // Non-closable (convert / display): the bare `role="tab"` button is the
        // tablist's direct child. Closable (editor): wrap the tab + its sibling
        // close `<button>` in a PLAIN styling `<span>` (NO role). The close button
        // must be a SIBLING of the `role="tab"` (nested buttons are invalid HTML)
        // and is `aria-hidden` + `tabIndex=-1`, so the tablist's ONLY owned children
        // are the `role="tab"` buttons (`aria-required-children`); the tablist also
        // claims them explicitly via `aria-owns` (`ownsAttr`) so the relationship
        // holds regardless of the DOM wrapper. Keyboard close is Delete/Backspace on
        // the focused tab (handleKeyDown); the hidden "×" remains a mouse affordance.
        return showClose ? (
          <span key={key} className="relative inline-flex items-stretch">
            {tabButton}
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              aria-label={`Close ${tab}`}
              className={CLOSE_BTN}
              onClick={(event) => handleClose(event, tab)}
            >
              {/* Decorative "×" mouse affordance. It is `aria-hidden` + `tabIndex=-1`
                  so it is NOT an owned child of the `role="tablist"` (the tablist may
                  only own `role="tab"` children — `aria-required-children`) and is
                  removed from the tab order (no `aria-hidden-focus` violation).
                  KEYBOARD users close the focused tab with Delete/Backspace (see
                  handleKeyDown, the WAI-ARIA APG deletable-tabs pattern); MOUSE
                  users still click here (pointer events fire on aria-hidden nodes).
                  Its CLICK target is widened to ≈26×26 via the CLOSE_BTN `::after`
                  overlay while the VISIBLE glyph stays the Figma 16×16. */}
              <span aria-hidden="true">{'\u00D7'}</span>
            </button>
          </span>
        ) : (
          <button
            key={key}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={tabId(index)}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={index === focusableIndex ? 0 : -1}
            className={tabClassName}
            onClick={() => onSelect?.(tab)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {variant === 'editor' ? <span className={EDITOR_LABEL}>{tab}</span> : tab}
            {isActive ? <span aria-hidden="true" className={UNDERLINE_BAR} /> : null}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
