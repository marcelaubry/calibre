'use client';

/**
 * ==========================================================================
 * Calibre-UI — ConvertOptionTabs
 * The option-category TAB STRIP of the App 05 "Convert Books" dialog (`6:9`).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ConvertOptionTabs` is 1 of the 5 composition components of the Convert Books
 * dialog (App 05, Figma screen node `6:9`) in the UI-only Calibre e-book-manager
 * prototype (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind
 * CSS v4 CSS-first `@theme` tokens). It renders the single horizontal row of
 * conversion option-category tabs that sits directly under the input → output
 * format-selection row and above the active option panel body:
 *
 *   Look & Feel · Heuristic Processing · Search & Replace · Table of Contents ·
 *   Metadata · Output Options
 *
 * The active tab is purple-underlined. This component is a THIN WRAPPER: its one
 * job is to lock the EXACT six labels in their EXACT order (the conversion
 * categories) and delegate every pixel of styling — the purple active underline,
 * the active/inactive label colors, the inter-tab spacing, and the white-7%
 * bottom hairline — to the shared `Tabs` primitive. The owner (`ConvertDialog`)
 * holds the `active` state and decides which option panel body to show below the
 * strip; this component only renders the strip and forwards the selection event.
 *
 * UI-ONLY / MOCK — NO REAL CONVERSION
 * --------------------------------------------------------------------------
 * This strip is purely presentational and fully CONTROLLED: it renders the
 * `active` label it is given and reports tab activation through `onSelect`. It
 * performs NO conversion, NO file I/O, and NO option persistence — switching a
 * tab is a pure view change owned by the parent dialog. Design-parity reference
 * ONLY (never imported or translated): `src/calibre/gui2/convert/single.py`,
 * whose Qt `Config` dialog assembles a list of option widgets — LookAndFeel,
 * Heuristics, SearchAndReplace, TOC, Metadata, PageSetup/StructureDetection and
 * the input/output panels. The AAP (§0.3.1 / §0.7.4 App05) normalizes those into
 * the six canonical tab labels reproduced here; no Python is reused.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * This component forwards an interactive selection callback (`onSelect`) into the
 * `Tabs` primitive, which renders real `<button role="tab">` controls with click
 * + keyboard handlers. App Router components default to Server Components (which
 * cannot bind event handlers), so the strip must be a Client Component. The
 * directive is the very first line of the file, before any import.
 *
 * COMPOSE FROM PRIMITIVES ONLY
 * --------------------------------------------------------------------------
 * The tab row is the bespoke `Tabs` primitive, imported from its CONCRETE module
 * path — there is NO `@/components/primitives` barrel in this repo. A raw
 * `<button>` tab row is never hand-rolled here, and the active-underline +
 * label-color treatment is produced BY `Tabs`, not by this wrapper.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, screen `6:9`)
 * --------------------------------------------------------------------------
 * Reconciled via `analyze_figma_node` against the strip's members — the six tab
 * frames `6:26` (active "Look & Feel"), `6:29`, `6:31`, `6:33`, `6:35`, `6:37`
 * (their labels `6:27`/`6:30`/`6:32`/`6:34`/`6:36`/`6:38`), the active underline
 * `6:28`, and the bottom hairlines `6:25`/`6:39` — all direct, absolutely-
 * positioned children of the `6:9` dialog frame (which has NO auto-layout, so
 * there is NO dedicated strip-container node; the wrapper/primitive synthesizes
 * the container). CONFIRMED values, all delivered by the `Tabs` primitive:
 *   • LABELS — exactly the six strings below, in this order; active = "Look &
 *     Feel" (the leftmost). Verbatim (ampersands + casing preserved).
 *   • TYPOGRAPHY — Inter 11px (`--text-button-secondary`); active Semi Bold 600,
 *     inactive Regular 400.
 *   • LABEL COLORS — CONFIRMED Convert active = the accent-light token
 *     (`--color-accent-light`, a light lavender), inactive = the muted-slate
 *     token (`--color-text-muted`). The shared `Tabs` primitive renders the
 *     AAP-normalized canonical active color `--color-text-primary` and inactive
 *     `--color-text-muted`; per this file's brief the active text resolves to
 *     `--color-text-primary` and is NOT hand-rolled here. The shared fidelity
 *     beat — the muted→bright contrast plus the purple underline — is preserved
 *     exactly.
 *   • ACTIVE UNDERLINE (`6:28`) — 2px, full active-tab width, flush to the tab
 *     bottom; CONFIRMED as the purple accent gradient (the `--color-accent` →
 *     `--color-accent-light` ramp). The primitive renders the `--color-accent`
 *     bottom border (a CSS border cannot be a gradient); the "purple underline"
 *     intent is preserved exactly.
 *   • INTER-TAB GAP 4px / PER-TAB PADDING 10px L+R / BOTTOM HAIRLINE white-7%
 *     (`--border-white-07`) — all produced inside the primitive.
 * These values are NOT re-declared here; this wrapper adds no styling of its own.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * This wrapper carries NO color, border, spacing, or radius classes — every
 * visual value resolves to an `@theme` token INSIDE the `Tabs` primitive
 * (`text-text-muted`, `text-text-primary`, `border-[var(--color-accent)]`,
 * `border-[var(--border-white-07)]`, `text-button-secondary`, `gap-1`,
 * `px-2.5`). There are ZERO raw hex / rgba color literals in this file. An
 * optional caller `className` is merged through onto the primitive's tablist
 * container, so callers own only the strip's outer layout/width — never its
 * colors.
 *
 * @see src/components/primitives/Tabs.tsx — the tab-strip primitive (styling).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.1 / §0.7.4 (App05) — the six conversion categories.
 */

import type { JSX } from 'react';

import { Tabs } from '@/components/primitives/Tabs';

/**
 * The six conversion option categories, in Calibre/AAP order (AAP §0.3.1 /
 * §0.7.4 App05). These labels are the authoritative, exact strings for the App
 * 05 Convert dialog option-tab strip — including the ampersands in "Look &
 * Feel" and "Search & Replace" and the exact casing — and MUST be rendered in
 * this exact left-to-right order. CONFIRMED 1:1 against Figma `6:9` (tab labels
 * `6:27` / `6:30` / `6:32` / `6:34` / `6:36` / `6:38`).
 *
 * Declared `as const` so each entry narrows to its string-literal type, backing
 * the {@link ConvertOptionTab} union below. When passed to the `Tabs` primitive
 * (whose `tabs` prop is `string[]`) it is spread into a fresh mutable array —
 * `[...CONVERT_OPTION_TABS]` — so the readonly tuple itself is never mutated.
 */
export const CONVERT_OPTION_TABS = [
  'Look & Feel',
  'Heuristic Processing',
  'Search & Replace',
  'Table of Contents',
  'Metadata',
  'Output Options',
] as const;

/**
 * A single conversion option-category label — the union of the six
 * {@link CONVERT_OPTION_TABS} string literals (e.g. `'Look & Feel'`). Lets the
 * owner `ConvertDialog` type its `active` panel-selection state precisely while
 * this component's props stay `string`-based to match the `Tabs` primitive's
 * label-driven contract.
 */
export type ConvertOptionTab = (typeof CONVERT_OPTION_TABS)[number];

/**
 * Props for {@link ConvertOptionTabs}.
 *
 * The strip is fully CONTROLLED — it renders whatever `active` label the owner
 * supplies and reports activation through `onSelect`. It holds no internal state
 * and applies no default to `active`; the owner (`ConvertDialog`) seeds the
 * initial selection (`'Look & Feel'`) and updates it on each `onSelect`.
 */
export interface ConvertOptionTabsProps {
  /**
   * The label of the currently-active option tab (the panel shown below the
   * strip). The matching tab renders the active treatment (bright label +
   * purple underline) inside the `Tabs` primitive. The owner seeds this with
   * `'Look & Feel'`. If the value matches no entry in {@link CONVERT_OPTION_TABS}
   * no tab shows active (the primitive keeps the strip keyboard-reachable).
   */
  active: string;
  /**
   * Called with the label of the tab the user activated — on click, Space/Enter,
   * or arrow/Home/End keyboard navigation (the `Tabs` primitive's automatic
   * activation). Optional so the strip can be rendered display-only. The owner
   * uses it to switch which option panel body is shown.
   */
  onSelect?: (tab: string) => void;
  /**
   * Extra classes merged onto the primitive's `<div role="tablist">` container,
   * letting the caller own the strip's OUTER layout / width / spacing (e.g.
   * `w-full`, a top margin) — never its colors. Forwarded verbatim to `Tabs`.
   */
  className?: string;
}

/**
 * ConvertOptionTabs — the App 05 Convert dialog option-category tab strip.
 *
 * Renders the shared `Tabs` primitive seeded with the exact six conversion
 * categories ({@link CONVERT_OPTION_TABS}), the caller-supplied `active` label,
 * and the caller's `onSelect` + `className`. All visual fidelity — the purple
 * active underline, the active/inactive label colors, the 11px Inter type, the
 * 4px inter-tab gap, the 10px tab padding, and the white-7% bottom hairline — is
 * delivered by `Tabs`; this wrapper contributes no styling of its own.
 *
 * `CONVERT_OPTION_TABS` is spread into a fresh mutable array so the readonly
 * tuple satisfies the primitive's `tabs: string[]` prop without being mutated.
 *
 * @param props - {@link ConvertOptionTabsProps}
 * @returns The rendered option-category tab strip.
 */
export function ConvertOptionTabs({
  active,
  onSelect,
  className,
}: ConvertOptionTabsProps): JSX.Element {
  return (
    <Tabs
      tabs={[...CONVERT_OPTION_TABS]}
      active={active}
      onSelect={onSelect}
      className={className}
    />
  );
}

export default ConvertOptionTabs;
