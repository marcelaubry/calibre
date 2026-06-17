'use client';

/**
 * ==========================================================================
 * Calibre-UI Design System — TopToolbar
 * The app-wide top toolbar + library search (App 01 List · App 02 Grid).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `TopToolbar` is the persistent horizontal action bar of the library screens
 * (App 01 — Library List `2:2`, App 02 — Cover Grid `3:2`) in the UI-only
 * Calibre e-book-manager prototype (Next.js 15 App Router · React 19 ·
 * TypeScript 5 strict · Tailwind CSS v4 CSS-first `@theme` tokens). It sits
 * directly below the `WindowTitleBar` and is rendered by `AppShell` ONLY on the
 * library routes (`/` and `/grid`). It is a single, non-wrapping row: a left
 * cluster of eight icon+label action buttons, a flexible spacer, and a search
 * field pinned to the right (Figma node `2:8`).
 *
 * THE APP'S PRIMARY NAVIGATION SURFACE (NAVIGATION INTEGRITY)
 * --------------------------------------------------------------------------
 * This toolbar is how the user reaches the rest of the app WITHOUT typing URLs.
 * Its navigational controls call `next/navigation`'s `router.push` to real
 * routes — "Edit Book" → `/editor`, "View" → `/grid`, "Prefs" → `/preferences`
 * — and "Convert" opens the Convert modal via `useModal().openConvert()` WITHOUT
 * changing the route (modals overlay the dimmed library; AAP §0.1.1 / §0.6.2).
 * Every route and the Convert modal is reachable through in-app interaction here
 * (NAVIGATION INTEGRITY: no manual URL entry assumed anywhere in the app).
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The component reads the live route via `useRouter()` + `usePathname()`,
 * subscribes to modal state via the `useModal()` Context hook, holds the
 * controlled search value in `useState`, and binds `onClick` handlers — all
 * client-only concerns (App Router components default to Server Components,
 * which cannot use hooks or bind handlers). The directive is the very first
 * line, before any import.
 *
 * UI-ONLY / MOCK — FOUR ACTIONS ARE DELIBERATELY INERT
 * --------------------------------------------------------------------------
 * This is a visual/functional prototype with NO backend, NO API, and NO real
 * I/O (AAP §0.8.2). Four toolbar actions have no in-scope destination screen or
 * modal — "Add Books", "Connect", "Send", and "Get News" — so they render and
 * are fully clickable but perform NO action (inert no-ops). They are NEVER wired
 * to routes that do not exist (which would 404 / emit console errors). The
 * search field is likewise controlled-but-inert: typing updates local state but
 * does not filter the library in this scope (no free-text search setter exists
 * on the library Context).
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, screen `2:2` = App 01)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node against node `2:8` (parent screen `2:2`):
 *   • Bar — 1440×48, full width, solid `--color-surface-1` fill, a single 1px
 *     bottom hairline, no radius. Realized as `h-12 w-full` with
 *     `items-center` (the 38px buttons / 32px search auto-center, leaving the
 *     Figma ~5px top/bottom inset) and `px-3.5` (the Figma ~14px side inset).
 *   • Eight buttons — fixed 84×38, radius 7, transparent at rest, a 15px emoji
 *     glyph LEFT of a 9px label, 4px inter-button gap (700px cluster). Rendered
 *     through the `Button` primitive's `variant="toolbar"`, which already
 *     encodes every one of those values; this file passes only `icon`, `label`,
 *     `onClick`, and the active `className` — it does NOT re-style the button.
 *   • Active state — CONFIRMED that on App 01 (route `/`) NO toolbar button is
 *     highlighted (all eight render identically). The active treatment is only
 *     shown when a button's route is the current route (e.g. "View" on `/grid`);
 *     see ACTIVE HIGHLIGHTING below.
 *   • Search field — 220×32, `--color-card` fill, white-09 border, ~radius-control,
 *     `--color-text-placeholder` placeholder. Rendered through the `InputField`
 *     primitive's `variant="search"`, which encodes all of those; this file
 *     passes the 🔍 glyph, the placeholder, an `aria-label`, and the width.
 *
 * TWO FIGMA RECONCILIATIONS (documented for traceability)
 * --------------------------------------------------------------------------
 *   1. LABELS — analyze_figma_node CONFIRMED two labels that differ from the
 *      authoring brief's example table: button #2 (🔌) reads "Connect" (not
 *      "Plugins") and button #7 (📰) reads "Get News" (not "News"). The Figma
 *      design is the authoritative visual spec and the mandatory
 *      compare_screenshot_with_figma gate compares text verbatim, so the
 *      Figma-confirmed wording is used. Their wiring is unchanged (both remain
 *      inert no-ops). The other six labels match the brief exactly.
 *   2. BOTTOM BORDER — the Figma render measures the hairline at ≈white-06, but
 *      the authoring brief explicitly specifies `--border-white-07` (the app's
 *      dominant hairline token, AAP §0.3.2). The 1% opacity difference is
 *      visually imperceptible, so the explicit `--border-white-07` is used for
 *      consistency with the rest of the shell.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR resolves to an `@theme` token from `src/app/globals.css`,
 * consumed via a CSS-variable arbitrary value (`bg-[var(--color-surface-1)]`,
 * `border-[var(--border-white-07)]`) or an opacity-modified token utility
 * (`bg-accent/10`, `text-text-primary`). There are NO raw hex / rgba color
 * literals. All button and search visuals (the 84×38 footprint, 7px radius,
 * glyph/label sizes, card fill, white-09 border, control radius, placeholder
 * color) live INSIDE the `Button` / `InputField` primitives and are not
 * re-specified here. The only bare utilities are Tailwind's standard layout /
 * spacing scale (`flex`, `h-12`, `w-full`, `items-center`, `px-3.5`, `gap-1`,
 * `flex-1`, `shrink-0`, `min-w-0`) plus the search width (`w-[220px]`, the exact
 * Figma field width and the `InputField` author's sanctioned sizing hook); none
 * of these carry color information.
 *
 * RESPONSIVE (1440 → 1280, zero horizontal overflow — AAP §0.9)
 * --------------------------------------------------------------------------
 * The bar is `w-full` (NEVER a fixed 1440px). The 700px button cluster is
 * `shrink-0` (the eight fixed buttons never compress); the `flex-1` spacer
 * absorbs the slack (≈492px at 1440px, ≈332px at 1280px — both positive, so the
 * search keeps its 220px width across the supported range); and the search
 * wrapper is `min-w-0` so it can still shrink in any narrower edge case. The bar
 * never overflows horizontally.
 *
 * ACCESSIBILITY
 * --------------------------------------------------------------------------
 * • The bar is a `role="toolbar"` group with an `aria-label`; each button is a
 *   semantic `<button>` (from the primitive) and is keyboard-operable via Tab.
 * • The active navigation button carries `aria-current="page"` (forwarded to the
 *   underlying `<button>`), so assistive tech announces the current screen.
 * • The search field is label-less in the design, so it is given an explicit
 *   `aria-label` (the `InputField` glyph is decorative / `aria-hidden`).
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * --------------------------------------------------------------------------
 * The eight actions map 1:1, conceptually, to Calibre's desktop toolbar action
 * plugins (`src/calibre/gui2/bars.py` `ToolBar`/`BarsManager`, and
 * `src/calibre/gui2/actions/{add,plugin_updates,convert,device,edit_metadata,
 * view,fetch_news,preferences}.py`). NO Python/Qt code is imported, translated,
 * or executed — only the visual toolbar and its in-app navigation/modal wiring
 * are reproduced.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see src/components/primitives/Button — the toolbar button primitive.
 * @see src/components/primitives/InputField — the search field primitive.
 * @see src/state/ModalProvider — the `useModal()` Convert/Metadata open-state.
 * @see Agent Action Plan §0.3.1 / §0.3.2 / §0.4.2 — toolbar spec, tokens, mapping.
 */

import { useState, type JSX } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/primitives/Button';
import { InputField } from '@/components/primitives/InputField';
import { useModal } from '@/state/ModalProvider';

/**
 * Props for {@link TopToolbar}.
 *
 * Intentionally minimal: the toolbar reads everything else it needs from the
 * router and the modal Context. `className` lets `AppShell` apply layout /
 * elevation utilities (e.g. a sticky modifier), merged AFTER the base classes so
 * caller utilities win on conflicts.
 */
export interface TopToolbarProps {
  /** Optional extra classes merged onto the bar container (caller wins). */
  className?: string;
}

/**
 * The kind of behavior a toolbar action performs when clicked:
 *   • `navigate` — push the App Router to {@link ToolbarAction.route}.
 *   • `convert`  — open the Convert modal (no route change).
 *   • `noop`     — inert (UI-only): no destination exists in this prototype.
 */
type ToolbarActionKind = 'navigate' | 'convert' | 'noop';

/**
 * One toolbar action's static configuration. The dynamic parts (the click
 * handler and the active flag) are derived at render time from the router /
 * pathname so this config can live at module scope as an immutable constant.
 */
interface ToolbarAction {
  /** Stable identity — used as the React list key. */
  id: string;
  /** Emoji / unicode glyph icon (a TEXT glyph, never an asset — AAP §0.3.4). */
  icon: string;
  /** Visible label, verbatim from Figma; also the button's accessible name. */
  label: string;
  /** What clicking the button does. */
  kind: ToolbarActionKind;
  /**
   * For `navigate` actions, the destination route (also the pathname that marks
   * this button active). `null` for `convert` / `noop` actions, which are never
   * route-active.
   */
  route: string | null;
}

/**
 * The eight toolbar actions, left → right, EXACTLY as Figma node `2:8` confirms
 * (glyphs, labels, and order). Wiring per the AAP §0.3.1 workflow map:
 *   • "Convert" opens the Convert modal (App 05) — no route change.
 *   • "Edit Book" / "View" / "Prefs" navigate to `/editor` / `/grid` /
 *     `/preferences` respectively.
 *   • "Add Books" / "Connect" / "Send" / "Get News" are inert no-ops — they have
 *     no in-scope destination screen or modal (UI-only prototype, AAP §0.8.2).
 *
 * ("Connect" and "Get News" are the Figma-confirmed labels — see the file
 * header's RECONCILIATION note.)
 */
const TOOLBAR_ACTIONS: readonly ToolbarAction[] = [
  { id: 'add', icon: '➕', label: 'Add Books', kind: 'noop', route: null },
  { id: 'connect', icon: '🔌', label: 'Connect', kind: 'noop', route: null },
  { id: 'convert', icon: '🔄', label: 'Convert', kind: 'convert', route: null },
  { id: 'send', icon: '📧', label: 'Send', kind: 'noop', route: null },
  { id: 'edit', icon: '✏️', label: 'Edit Book', kind: 'navigate', route: '/editor' },
  { id: 'view', icon: '📖', label: 'View', kind: 'navigate', route: '/grid' },
  { id: 'news', icon: '📰', label: 'Get News', kind: 'noop', route: null },
  { id: 'prefs', icon: '⚙️', label: 'Prefs', kind: 'navigate', route: '/preferences' },
];

/**
 * Bar container classes — all token-backed. `flex items-center` lays out and
 * vertically centers the row; `h-12` is the 48px bar height; `w-full` keeps it
 * responsive (never a fixed 1440px); `px-3.5` is the Figma ~14px side inset; the
 * `--color-surface-1` fill and the `--border-white-06` bottom hairline complete
 * the surface (the hairline token matches the Figma `2:8` bottom-edge stroke —
 * white at 6% over the surface, confirmed by the screen `2:2` visual comparison).
 * `min-w-0` allows the bar's own flex children to shrink cleanly.
 */
const BAR_CLASSES =
  'flex h-12 w-full min-w-0 items-center px-3.5 ' +
  'bg-[var(--color-surface-1)] border-b border-[var(--border-white-06)]';

/**
 * Active-button treatment, conveyed via the `Button`'s `className` (the toolbar
 * variant has no dedicated `active` prop). The treatment is a token-backed purple
 * accent ring (`ring-1 ring-inset ring-[var(--color-accent)]`) plus brighter
 * primary text (`text-text-primary`), both resolving to `@theme` tokens
 * (`--color-accent`, `--color-text-primary`).
 *
 * Why a ring rather than a background fill: the toolbar variant sets
 * `bg-transparent`, and Tailwind v4 emits `.bg-transparent` after a token bg
 * utility in source order, so a `bg-accent/10` fill passed via className would be
 * overridden and never paint (verified at runtime). A ring is drawn via
 * `box-shadow` — a property the toolbar variant does not set — so it is
 * guaranteed to render, adds zero layout shift (`ring-inset` keeps it within the
 * 84×38 box), and pairs the purple accent with the brighter label for a dual cue
 * (color is never the sole active indicator — UI3 — and `aria-current="page"`
 * carries the state to assistive tech). Purple borders are this design's active /
 * selected motif (e.g. selected grid cards), so the ring is design-consistent.
 *
 * Applied only to the navigation button whose `route` equals the current
 * pathname. Note: the Figma library frames (`2:2`, `3:2`) capture only the
 * resting toolbar; this active highlight is the AAP-mandated navigation-state
 * feedback (agent brief §3 / §7) for a state Figma does not depict.
 */
const ACTIVE_BUTTON_CLASSES = 'ring-1 ring-inset ring-[var(--color-accent)] text-text-primary';

/** The library search field's placeholder — verbatim Figma `2:35` (U+2026 ellipsis). */
const SEARCH_PLACEHOLDER = 'Search library\u2026';

/** Accessible name for the label-less search field (the design shows no visible label). */
const SEARCH_ARIA_LABEL = 'Search library';

/**
 * TopToolbar — the persistent library top toolbar + search.
 *
 * Renders a `role="toolbar"` bar containing the eight {@link TOOLBAR_ACTIONS}
 * (each through the `Button` `variant="toolbar"` primitive), a flexible spacer,
 * and the right-aligned search field (the `InputField` `variant="search"`
 * primitive). Navigation actions push the App Router; the Convert action opens
 * the Convert modal; the four inert actions do nothing. The button whose route
 * matches the current pathname is shown active. The caller `className` is merged
 * AFTER the base classes so caller utilities win on conflicts.
 *
 * @param props - {@link TopToolbarProps}
 * @returns The rendered top toolbar.
 */
export function TopToolbar({ className }: TopToolbarProps): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const { openConvert } = useModal();

  // Controlled, intentionally-inert search value. Typing updates local state but
  // does not filter the library in this scope (no free-text search setter exists
  // on the library Context). Keeping the input controlled (value + onChange)
  // avoids React's uncontrolled-input warning and guarantees zero console noise.
  const [search, setSearch] = useState('');

  // Merge token-backed base classes with any caller className (appended last so
  // caller utilities win). `filter(Boolean)` drops an absent className.
  const merged = [BAR_CLASSES, className].filter(Boolean).join(' ');

  return (
    <div className={merged} role="toolbar" aria-label="Library toolbar" aria-orientation="horizontal">
      {/* Left cluster — the eight fixed-width action buttons. `shrink-0` keeps
          them from compressing; `gap-1` is the Figma 4px inter-button gap. */}
      <div className="flex shrink-0 items-center gap-1">
        {TOOLBAR_ACTIONS.map((action) => {
          // A navigation action is "active" when its route is the current route.
          // Convert / no-op actions have a null route and are never active.
          const isActive = action.route !== null && pathname === action.route;

          // Resolve the click behavior from the action kind. No-op actions are
          // intentionally inert (Add Books / Connect / Send / Get News have no
          // in-scope destination — UI-only prototype).
          const handleClick = (): void => {
            if (action.kind === 'navigate' && action.route !== null) {
              router.push(action.route);
            } else if (action.kind === 'convert') {
              openConvert();
            }
          };

          return (
            <Button
              key={action.id}
              variant="toolbar"
              icon={action.icon}
              label={action.label}
              onClick={handleClick}
              className={isActive ? ACTIVE_BUTTON_CLASSES : undefined}
              aria-current={isActive ? 'page' : undefined}
            />
          );
        })}
      </div>

      {/* Flexible spacer — absorbs the slack between the button cluster and the
          search field so the search stays right-aligned and the bar never
          overflows (1440 → 1280). Decorative: hidden from assistive tech. */}
      <div className="flex-1" aria-hidden="true" />

      {/* Right-aligned library search. `variant="search"` carries every visual
          (card fill, white-09 border, control radius, placeholder color, 32px
          height, leading 🔍 glyph). The wrapper width is the exact Figma 220px;
          `min-w-0` lets it shrink in any narrow edge case. Controlled + inert.
          `name` is forwarded (via the primitive's `...rest`) onto the underlying
          `<input>` so the field is a properly-named form control — this silences
          Chrome's "a form field element should have an id or name attribute"
          best-practice advisory and keeps the console fully clean. */}
      <InputField
        variant="search"
        icon="🔍"
        name="library-search"
        value={search}
        onChange={setSearch}
        placeholder={SEARCH_PLACEHOLDER}
        aria-label={SEARCH_ARIA_LABEL}
        className="w-[220px] min-w-0"
      />
    </div>
  );
}

export default TopToolbar;
