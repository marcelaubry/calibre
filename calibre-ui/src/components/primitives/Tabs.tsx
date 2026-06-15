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
 * This primitive is intentionally MINIMAL and label-driven (its contract is a
 * `string[]` of labels). It deliberately does NOT render the Editor's per-tab
 * close "×" affordance or the Editor's active-tab cell background — those are
 * Editor-specific compositions the consuming `FileTabs` screen component layers
 * on top (via `className` / its own markup). The Convert option tabs need
 * neither, so the shared primitive carries neither.
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
 * The brief (AAP §0.3.3, "Tabs: active tab purple underline") normalizes these
 * two screens into ONE canonical, token-backed primitive — and explicitly wins
 * on scope/intent ("Precedence: AAP §0.3 wins"). The canonical resolution is:
 * active = `text-text-primary` + `border-b-2 border-[var(--color-accent)]`;
 * inactive = `text-text-muted` + `border-b-2 border-transparent`; inactive
 * hover brightens to `text-text-secondary`; `text-button-secondary` (11px)
 * typography; a `border-b border-[var(--border-white-07)]` strip hairline; a
 * 4px inter-tab gap with 10px horizontal padding (= Convert `6:9` exactly).
 *
 * BLITZY [COLOR] (active label): the CONFIRMED Convert active label is
 * `--color-accent-light` (#A78BFA, weight 600); the CONFIRMED Editor active
 * label is `--color-text-primary` (#F1F5FF, weight 500). Per the brief's
 * explicit directive this canonical primitive renders the Editor value
 * `text-text-primary`; a screen that needs the Convert accent-light active
 * label layers it via `className`. The SHARED, screen-agnostic fidelity beat —
 * the purple underline + muted→primary contrast — is preserved exactly.
 *
 * BLITZY [COLOR] (underline): the CONFIRMED Figma underline (`5:34` / `6:28`)
 * is a 2px VERTICAL gradient `linear-gradient(0deg, #7B61FF 0% → #A78BFA 100%)`
 * — #7B61FF is the bottom (0%) stop. A CSS `border-bottom` cannot be a gradient,
 * and the brief explicitly mandates the border technique
 * (`border-b-2 border-[var(--color-accent)]`); this primitive therefore renders
 * the flat accent `#7B61FF` (= the gradient's representative bottom stop). The
 * "purple underline" intent is preserved exactly. If gradient fidelity is ever
 * mandated, swap the active bottom border for a bottom child bar carrying the
 * `bg-gradient-accent` utility.
 *
 * BLITZY [TYPOGRAPHY]: CONFIRMED Figma weights are inactive 400 / active 500
 * (Editor) or 600 (Convert). This primitive applies a uniform `text-button-
 * secondary` (Inter 500 / 11px) to every tab; the active emphasis is carried by
 * the color change + the underline (the weight delta is sub-perceptible at 11px
 * and within token-snapping tolerance). The CONFIRMED 11px size matches both
 * screens exactly.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR value resolves to an `@theme` token from `src/app/globals.css`,
 * consumed via a Tailwind v4 utility (`text-text-primary`, `text-text-muted`,
 * `text-text-secondary`, `text-button-secondary`) or a CSS-variable arbitrary
 * value (`border-[var(--color-accent)]`, `border-[var(--border-white-07)]`,
 * `ring-[var(--border-accent)]`). There are NO raw hex / rgba color literals in
 * any className. The only bare literals are LAYOUT / geometry values that carry
 * no color information — the underline thickness (`border-b-2`), the strip
 * hairline width (`border-b`), the inter-tab gap (`gap-1` = 4px), the tab
 * padding (`px-2.5` / `py-2.5` = 10px = Convert `6:9`), the `-mb-px` that seats
 * the tab's bottom border onto the strip hairline, and the design-sanctioned
 * `border-transparent` keyword (a permitted literal) for the inactive underline.
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
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/tweak_book/
 * file_list.py` (Editor open-file tabs) and `src/calibre/gui2/convert/` (the Qt
 * conversion option panels). Nothing is imported or translated from the Python
 * codebase.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import { useRef, type JSX, type KeyboardEvent } from 'react';

/**
 * Props for {@link Tabs} — the exact AAP §0.3.3 contract.
 *
 * Intentionally a CLOSED interface (it does NOT extend the native `<div>` /
 * `<button>` attribute sets): a tab strip's inputs are the list of labels, the
 * currently-active label, an optional change handler, and an outer-container
 * `className`.
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
   * treatment (primary text + accent underline) and is the single keyboard tab
   * stop; all others render inactive (muted text + transparent underline). If
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
const TABLIST_BASE =
  'flex items-stretch gap-1 border-b border-[var(--border-white-07)]';

/**
 * Variant-invariant TAB classes — the `<button role="tab">` itself.
 *
 * - Box: `relative` (anchors the focus ring / future overlays) · `inline-flex
 *   items-center justify-center` (vertically centers the label) ·
 *   `whitespace-nowrap` (labels never wrap) · `select-none` · `cursor-pointer`.
 * - Spacing: `px-2.5 py-2.5` = the CONFIRMED 10px horizontal padding (Convert
 *   `6:9`) and a matching 10px vertical padding (~34px tab height).
 * - Underline rail: `border-b-2` reserves the 2px underline on EVERY tab; the
 *   per-state class only swaps its COLOR (accent vs transparent) → no layout
 *   shift on selection. `-mb-px` pulls the 2px border down onto the container's
 *   1px hairline so the active underline sits on the hairline (Figma `6:28`
 *   over `6:25`).
 * - Typography: `text-button-secondary` (Inter 500 / 11px) — the CONFIRMED 11px
 *   tab size for both screens.
 * - Focus: a token-backed, inset `:focus-visible` ring (`--border-accent`),
 *   shown for keyboard users only (UI3) and invisible at rest (DS2-e); the
 *   default UA outline is removed.
 * - Motion: the text/border color change animates only when motion is allowed
 *   (UI6 / prefers-reduced-motion).
 */
const TAB_BASE =
  'relative -mb-px inline-flex items-center justify-center whitespace-nowrap ' +
  'select-none cursor-pointer px-2.5 py-2.5 border-b-2 text-button-secondary ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset ' +
  'focus-visible:ring-[var(--border-accent)] ' +
  'motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out';

/**
 * ACTIVE tab classes: primary near-white label (`--color-text-primary`,
 * #F1F5FF) + the accent purple underline (`--color-accent`, #7B61FF) realized
 * as the 2px bottom border. See BLITZY [COLOR] in the file header for the
 * gradient-vs-flat and Editor-vs-Convert reconciliations.
 */
const TAB_ACTIVE = 'text-text-primary border-[var(--color-accent)]';

/**
 * INACTIVE tab classes: muted slate label (`--color-text-muted`, #64748B) + a
 * `transparent` bottom border of the SAME `border-b-2` thickness (no layout
 * shift). On hover the label brightens to the secondary slate token
 * (`--color-text-secondary`, #94A3B8); Tailwind v4 gates `hover:` behind
 * `@media (hover: hover)` by default, so touch devices never get sticky hover.
 */
const TAB_INACTIVE =
  'text-text-muted border-transparent hover:text-text-secondary';

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
  className,
}: TabsProps): JSX.Element {
  // One ref per tab button, used to move DOM focus during arrow/Home/End
  // navigation (roving tabindex). Kept in a stable array across renders.
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

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
      default:
        break;
    }
  };

  // The caller className is appended last so its utilities win on conflicts
  // (Tailwind source order governs); `filter(Boolean)` drops a missing value.
  const containerClassName = [TABLIST_BASE, className].filter(Boolean).join(' ');

  return (
    <div role="tablist" aria-orientation="horizontal" className={containerClassName}>
      {tabs.map((tab, index) => {
        const isActive = tab === active;
        const tabClassName = `${TAB_BASE} ${isActive ? TAB_ACTIVE : TAB_INACTIVE}`;

        return (
          <button
            // Composite key guarantees uniqueness even if two labels collide,
            // avoiding React key-collision console warnings (zero-console gate).
            key={`${tab}-${index}`}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={index === focusableIndex ? 0 : -1}
            className={tabClassName}
            onClick={() => onSelect?.(tab)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
