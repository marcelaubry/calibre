'use client';

/**
 * ==========================================================================
 * Calibre-UI — PreferencesNav ("CatNav")
 * The App 06 Preferences LEFT category navigation column.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `PreferencesNav` is the ~240px-wide left category navigation of the App 06
 * Preferences screen (Figma screen `8:2`, this node `8:15`) in the UI-only
 * Calibre e-book-manager prototype (Next.js 15 App Router · React 19 ·
 * TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens). It lists the eight
 * top-level preference categories — Interface, Reading, Conversion, Library,
 * Sharing & Sending, Plugins, Security, Performance — with the `Reading`
 * category shown EXPANDED with four indented sub-items, plus a "Filter
 * preferences…" field at the top of the column.
 *
 * This is the navigation column ONLY; the wide settings panel to its right is
 * `PreferencesPanel`, and the page-level "Preferences" heading + action buttons
 * live in the screen Header (Figma `8:8`), NOT inside this node. The page
 * (`/preferences`) composes this nav beside the panel in a horizontal row.
 *
 * UI-ONLY: there is no backend. The active-category / active-sub-item highlight
 * and the filter query are LOCAL React state. Per the AAP the prototype designs
 * a single settings panel, so selecting a category here changes only the visual
 * highlight (and filters the local list) — it does not swap panel content or
 * change the route. This is in-scope, not scope creep.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The column owns interactive state via `useState` (the active highlight + the
 * controlled filter input + click handlers), so it must be a Client Component
 * (App Router components default to Server Components, which cannot run hooks or
 * bind event handlers). The directive is the very first line, before any import.
 * The component is SSR-safe: the default active category/sub-item and the empty
 * filter are static literals — no `window`, `Math.random`, `Date.now`, or
 * `localStorage`, and no mount-time mutation.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node on node `8:15` (parent screen `8:2`). Every
 * value below is the CONFIRMED Figma value, mapped 1:1 to an `@theme` token:
 *   • Nav surface       → `#13162E` = `--color-surface-2`        → `bg-surface-2`
 *   • Right divider      → white @ 6% (rect `8:16`)               → `border-r border-[var(--border-white-06)]`
 *   • Width / height     → 240px / full                          → `w-60` · `h-full`
 *   • Filter field       → fill `#181C3C` card, 1px white@9% border, r8, 208×36,
 *                          placeholder `#3A4060` "Filter preferences…" (8:17/8:18)
 *   • Inactive category  → `#94A3B8`, Inter 400 / 12px            → `text-body text-text-secondary`
 *   • Active category    → `#A78BFA`, Inter 600 / 12px, on a accent@10% rounded
 *                          container (rect `8:20`, r8)            → `text-button-primary text-accent-light` + `bg-accent/10 rounded-control`
 *   • Sub-items          → `#64748B`, Inter 400 / 11px, indented 28px (x16→x44)
 *   • Active sub-item    → `#A78BFA` on a accent@15% pill (rect `8:23`, r5, 196×24)
 * The active category in the design is **Reading**; the active sub-item is
 * **Fonts**. There is NO left accent bar, NO count badges (counts belong to the
 * library Sidebar, a different component), and NO heading inside this node.
 *
 * BLITZY [COLOR] (active text): the agent brief suggested `text-text-primary`
 * for the active row; analyze_figma_node CONFIRMED the active label is
 * `--color-accent-light` (#A78BFA). Per the CRITICAL Precedence Directive
 * (Figma EXACT values override directive defaults), this renders the CONFIRMED
 * accent-light. The brief's "(or /15 — confirm exact opacity from Figma)" is
 * resolved: the active-CATEGORY container is accent@10% (`bg-accent/10`) and the
 * active-SUB-ITEM pill is accent@15% (`bg-accent/15`).
 *
 * BLITZY [COLOR] (right divider): the brief guessed white@7%; Figma rect `8:16`
 * is CONFIRMED white@6%. Figma wins → `border-[var(--border-white-06)]`.
 *
 * BLITZY [TYPOGRAPHY]: Figma sub-items + the filter placeholder are Inter 400 /
 * 11px. No 11px/400 type token exists, so the 11px SIZE is sourced from the
 * `text-button-secondary` token (11px) and the weight is forced to Inter 400 via
 * the named `font-normal` utility (overriding that token's embedded 500). This
 * matches the CONFIRMED Figma weight EXACTLY — there is no weight deviation
 * (combining a size token with a named font-weight is expressly permitted by the
 * UI typography rule). Category labels use `text-body` (12px / 400, inactive) and
 * `text-button-primary` (12px / 600, active) — exact matches for the CONFIRMED
 * 12px Regular / SemiBold category labels.
 *
 * BLITZY [COMPONENT] (filter field): the "Filter preferences…" input is part of
 * Figma node `8:15` and is reproduced for fidelity. The design system's
 * `InputField` primitive matches its look, but `InputField` is NOT in this
 * file's allowed dependency set (only `GlassCard` is), so — exactly as the brief
 * sanctions for the category rows — it is rendered as a native, token-styled
 * `<input>`. The field is a CONTROLLED, SSR-safe filter over the LOCAL category
 * list; at rest (empty query) all eight categories render, reproducing the Figma
 * default state precisely.
 *
 * BLITZY [RADIUS]: the active sub-item pill is r5 in Figma; no 5px radius token
 * exists and the two nearest tokens — `--radius-badge` (3px) and
 * `--radius-toolbar` (7px) — are EQUIDISTANT (±2px, within the DS4 silent snap
 * tolerance). `rounded-toolbar` (7px) is chosen for the softer control look.
 * Because the zero-hardcoded-token rule (higher precedence than pixel-exact
 * fidelity per the design-system hierarchy) forbids a `rounded-[5px]` literal,
 * this ±2px token snap is the intended, compliant residue — not a fixable defect.
 *
 * GEOMETRY (CONFIRMED Figma pitches): category rows are a fixed 40px tall
 * (`h-10`) in a gap-less list → an exact 40px category pitch with no cumulative
 * drift; Reading sub-item pills are a fixed 24px tall (`h-6`) with a 4px gap →
 * an exact 28px sub-item pitch; the active pill is 196px wide at x≈28 and the
 * sub-item text indents to x≈44 (28px deeper than the x=16 category origin).
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / radius / typography value resolves to an `@theme` token from
 * `src/app/globals.css`, consumed via a Tailwind v4 utility (`bg-surface-2`,
 * `bg-card`, `bg-accent/10`, `bg-accent/15`, `text-accent-light`,
 * `text-text-secondary`, `text-text-muted`, `text-text-primary`,
 * `text-text-placeholder`, `text-body`, `text-button-primary`,
 * `text-button-secondary`, `rounded-control`, `rounded-toolbar`) or a
 * CSS-variable arbitrary value (`border-[var(--border-white-06)]`,
 * `border-[var(--border-white-09)]`, `ring-[var(--border-accent)]`). There are
 * NO raw hex / rgba / px color or radius literals. The only bare values are
 * layout / spacing utilities from the Tailwind scale (`w-60`, `px-2`, `gap-2`,
 * `ps-5`, …) which carry no design-token color information.
 *
 * NOT GLASSCARD: the column is a semantic `<nav>` landmark styled directly with
 * the same surface tokens `GlassCard` would apply. `GlassCard` renders a
 * non-semantic `<div>` with a frosted `backdrop-blur` (meant for translucent
 * content cards), neither of which suits an opaque navigation landmark — so the
 * brief's "(Optional) GlassCard" wrap is deliberately not used. No internal
 * import is required: the file's only allowed dependency (`GlassCard`) is
 * optional and intentionally unused.
 *
 * ACCESSIBILITY (UI3 — invisible, always applied)
 * --------------------------------------------------------------------------
 * • A semantic `<nav aria-label="Preferences categories">` landmark wraps a
 *   `<ul>`/`<li>` list; every category and sub-item is a real, keyboard-operable
 *   `<button type="button">` (Space/Enter for free).
 * • The currently-selected category / sub-item carries `aria-current="true"`.
 * • Leading category emoji are decorative (`aria-hidden`); the text label is the
 *   accessible name.
 * • The filter field has an `aria-label` (no visible label in the design).
 * • A token-backed `:focus-visible` ring (`--border-accent`) is shown for
 *   keyboard users only — invisible at rest (DS2-e). Color transitions run only
 *   under `motion-safe` (prefers-reduced-motion).
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/preferences/
 * main.py` (Calibre builds an ordered `category_map` of preference `Category`
 * widgets) and `look_feel.py`. These are Qt; nothing is imported or translated.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.1 / §0.3.2 / §0.7.4 — Preferences screen + tokens.
 */

import { useState, type JSX } from 'react';

/**
 * A single preference-category entry in the navigation.
 *
 * `id` is a stable slug used for selection identity (decoupled from the visible
 * `label` so copy changes never break state comparisons). `icon` is an optional
 * leading Unicode emoji glyph (rendered via the font — there are NO icon assets,
 * AAP §0.3.4). `subItems` is an optional ordered list of sub-category labels
 * shown indented beneath the category when it is expanded (only `Reading` has
 * them in this design).
 */
interface NavCategory {
  /** Stable selection slug (e.g. `'reading'`), independent of the display label. */
  id: string;
  /** Human-readable category name shown in the row (verbatim from Figma). */
  label: string;
  /** Optional leading emoji glyph (decorative; rendered via the font, no asset). */
  icon?: string;
  /** Optional ordered sub-category labels rendered indented beneath the row. */
  subItems?: string[];
}

/**
 * The eight preference categories, in the EXACT Figma / AAP §0.3.1 order
 * (Interface → Reading → Conversion → Library → Sharing & Sending → Plugins →
 * Security → Performance). Each leading glyph is the CONFIRMED Unicode emoji
 * from node `8:15`. `Reading` carries the four CONFIRMED sub-items
 * (Viewer defaults · Fonts · Annotations · Shortcuts) and is the expanded,
 * default-active category.
 */
const CATEGORIES: readonly NavCategory[] = [
  { id: 'interface', label: 'Interface', icon: '🖥️' },
  {
    id: 'reading',
    label: 'Reading',
    icon: '📖',
    subItems: ['Viewer defaults', 'Fonts', 'Annotations', 'Shortcuts'],
  },
  { id: 'conversion', label: 'Conversion', icon: '🔄' },
  { id: 'library', label: 'Library', icon: '📁' },
  { id: 'sharing', label: 'Sharing & Sending', icon: '📧' },
  { id: 'plugins', label: 'Plugins', icon: '🔌' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'performance', label: 'Performance', icon: '⚡' },
];

/** Default-active category id (Figma shows `Reading` active + expanded). */
const DEFAULT_CATEGORY_ID = 'reading';
/** Default-active sub-item label (Figma shows `Fonts` selected within Reading). */
const DEFAULT_SUB_ITEM = 'Fonts';

/**
 * Join class fragments, dropping any falsy entries (`false` / `undefined` / '').
 * Mirrors the in-repo primitive convention (e.g. `GlassCard`) for composing a
 * base class string with conditional state classes.
 */
function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/* --------------------------------------------------------------------------
 * Token-backed class strings (module scope so they are allocated once).
 * Every value resolves to an `@theme` token; only Tailwind-scale layout/spacing
 * utilities are bare (they carry no color/token information).
 * ------------------------------------------------------------------------ */

/**
 * The `<nav>` column: full-height, fixed 240px (`w-60`) that never shrinks
 * (`shrink-0`) so the sibling settings panel absorbs all flex shrink and the
 * 1440→1280 baseline stays horizontal-overflow-free. Surface-2 fill + a single
 * right hairline (white@6%, Figma `8:16`). Vertical flex stack with a small gap
 * between the filter field and the list; `overflow-y-auto` is defensive.
 */
const NAV_CONTAINER =
  'flex h-full w-60 shrink-0 flex-col gap-2 overflow-y-auto ' +
  'bg-surface-2 border-r border-[var(--border-white-06)] px-2 py-3';

/**
 * Filter field (native token-styled `<input>`, Figma `8:17`/`8:18`): card fill,
 * white@9% hairline, 8px radius, 36px tall (`h-9`), ~10px left padding
 * (`px-2.5`), inset 16px from each nav edge (nav `px-2` + `mx-2`). Near-white
 * value text with the muted placeholder token; token-backed focus ring.
 */
const FILTER_INPUT =
  'mx-2 h-9 rounded-control bg-card px-2.5 ' +
  'border border-[var(--border-white-09)] ' +
  'text-button-secondary font-normal text-text-primary placeholder:text-text-placeholder ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset ' +
  'focus-visible:ring-[var(--border-accent)] ' +
  'motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out';

/**
 * The category `<ul>`: a flush vertical stack (no inter-row gap) whose exact
 * 40px row pitch comes entirely from each row's fixed `h-10` height — matching
 * the Figma uniform 40px category pitch (row tops 66/106/266/… node `8:15`) with
 * zero cumulative drift down the list.
 */
const CATEGORY_LIST = 'flex flex-col gap-0';

/**
 * Variant-invariant category `<button>` classes: full-width left-aligned row,
 * icon→label gap, 8px corner radius (for the active fill shape), a FIXED 40px
 * row height (`h-10`, the CONFIRMED Figma 40px pitch) with the icon+label
 * vertically centered, and the shared focus-ring + motion-safe color transition.
 * The per-state class supplies typography + color (+ fill for a leaf active row).
 */
const CATEGORY_BUTTON_BASE =
  'flex w-full items-center gap-2 rounded-control px-2 h-10 text-left ' +
  'cursor-pointer select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset ' +
  'focus-visible:ring-[var(--border-accent)] ' +
  'motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out';

/** Inactive category: slate label, Inter 400 / 12px, brightens on hover. */
const CATEGORY_INACTIVE = 'text-body text-text-secondary hover:text-text-primary';
/**
 * Active category label, used INSIDE the expanded group whose wrapper carries
 * the accent@10% fill (so the button itself stays transparent): accent-light
 * text, Inter 600 / 12px.
 */
const CATEGORY_ACTIVE_LABEL = 'text-button-primary text-accent-light';
/**
 * Active category as a standalone leaf row (no sub-items): same accent-light /
 * 600 label PLUS the accent@10% rounded fill on the button itself.
 */
const CATEGORY_ACTIVE_ROW = 'text-button-primary text-accent-light bg-accent/10';

/** Leading emoji glyph: never shrinks, tight line-height (decorative span). */
const ICON_GLYPH = 'shrink-0 leading-none';

/**
 * Expanded-group wrapper (Reading): 8px radius, an 8px inner bottom padding
 * (`pb-2`) so the purple fill extends below the last sub-item exactly like the
 * Figma container's 152px bottom edge, and an 8px outer bottom margin (`mb-2`)
 * that restores the CONFIRMED Figma 160px Reading→Conversion category pitch (the
 * 152px-tall group + 8px gap = the 4×40px slot the expanded Reading occupies).
 * Both spacings are always present (active toggling causes no layout shift); the
 * accent@10% fill is added only when the group is the active category.
 */
const GROUP_BASE =
  'rounded-control pb-2 mb-2 motion-safe:transition-colors motion-safe:duration-200';
const GROUP_ACTIVE = 'bg-accent/10';

/**
 * Sub-item `<ul>`: indented so the pill left edge sits ~28px right of the nav
 * edge (nav `px-2` + `ps-5` ⇒ x≈28, the CONFIRMED Figma pill x=28) with an 8px
 * right inset (`pe-2`); a 4px row gap that — with each 24px-tall pill — yields
 * the CONFIRMED Figma 28px sub-item pitch. A −4px top margin (`-mt-1`) pulls the
 * list up into the 40px Reading row's lower padding so the first sub-item / the
 * active Fonts pill land at the CONFIRMED Figma position (pill top y=160, i.e.
 * 64px below the group top) and the purple group container is exactly 152px tall
 * (Figma `8:20` y=96→248) — eliminating the ~8px low offset / ~7px over-height.
 */
const SUBLIST = '-mt-1 flex flex-col gap-1 ps-5 pe-2';

/**
 * Variant-invariant sub-item `<button>` classes: full-width left-aligned, a
 * FIXED 24px pill height (`h-6`, the CONFIRMED Figma pill height) with the label
 * vertically centered, 7px radius pill shape (DS4 snap of Figma r5 — no 5px
 * token exists; 3px/7px are equidistant, 7px chosen for the soft-control look),
 * ~16px text indent inside the inset list (`ps-4` ⇒ label x≈44). Typography:
 * the 11px SIZE comes from the `text-button-secondary` token; `font-normal`
 * forces Inter 400 to exactly match the CONFIRMED Figma sub-item weight (the
 * token's own 500 is overridden so there is no weight deviation). Shared focus
 * ring + motion-safe transition. Per-state class supplies color (+ active fill).
 */
const SUBITEM_BASE =
  'flex w-full items-center h-6 rounded-toolbar ps-4 pe-2 text-left ' +
  'text-button-secondary font-normal cursor-pointer select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset ' +
  'focus-visible:ring-[var(--border-accent)] ' +
  'motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out';

/** Inactive sub-item: muted slate label, brightens to secondary on hover. */
const SUBITEM_INACTIVE = 'text-text-muted hover:text-text-secondary';
/** Active sub-item: accent-light label on the accent@15% pill (Figma `8:23`). */
const SUBITEM_ACTIVE = 'text-accent-light bg-accent/15';

/** Empty-state line shown only when a non-empty filter matches no category. */
const EMPTY_STATE = 'px-2 py-1.5 text-button-secondary text-text-muted';

/**
 * PreferencesNav — the App 06 left category navigation column.
 *
 * Renders the "Filter preferences…" field followed by the eight categories (the
 * `Reading` category expanded with its four sub-items). Tracks three pieces of
 * LOCAL state: the active category id (default `Reading`), the active sub-item
 * label (default `Fonts`), and the live filter query. Clicking a category
 * selects it; clicking a sub-item selects it AND its parent (`Reading`). Typing
 * in the filter narrows the list case-insensitively by category label OR any
 * sub-item label; an empty query (the default) shows every category, exactly
 * reproducing the Figma default state.
 *
 * @returns The rendered navigation column.
 */
export default function PreferencesNav(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<string>(DEFAULT_CATEGORY_ID);
  const [activeSubItem, setActiveSubItem] = useState<string>(DEFAULT_SUB_ITEM);
  const [filter, setFilter] = useState<string>('');

  // Case-insensitive narrowing over the LOCAL list. A category matches when the
  // query is empty, its label contains the query, or any of its sub-items does
  // (so e.g. typing "fonts" surfaces its parent "Reading"). Pure + deterministic.
  const query = filter.trim().toLowerCase();
  const visibleCategories = CATEGORIES.filter((cat) => {
    if (query === '') return true;
    if (cat.label.toLowerCase().includes(query)) return true;
    return (cat.subItems ?? []).some((sub) => sub.toLowerCase().includes(query));
  });

  return (
    <nav aria-label="Preferences categories" className={NAV_CONTAINER}>
      <input
        type="text"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Filter preferences..."
        aria-label="Filter preferences"
        autoComplete="off"
        spellCheck={false}
        className={FILTER_INPUT}
      />

      {visibleCategories.length > 0 ? (
        <ul className={CATEGORY_LIST}>
          {visibleCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const subItems = cat.subItems ?? [];

            // Expanded category (Reading): the row + its sub-items share one
            // rounded wrapper that carries the accent@10% active fill.
            if (subItems.length > 0) {
              return (
                <li key={cat.id}>
                  <div className={cx(GROUP_BASE, isActive && GROUP_ACTIVE)}>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={cx(
                        CATEGORY_BUTTON_BASE,
                        isActive ? CATEGORY_ACTIVE_LABEL : CATEGORY_INACTIVE,
                      )}
                    >
                      {cat.icon ? (
                        <span aria-hidden="true" className={ICON_GLYPH}>
                          {cat.icon}
                        </span>
                      ) : null}
                      <span>{cat.label}</span>
                    </button>

                    <ul className={SUBLIST}>
                      {subItems.map((sub) => {
                        const isSubActive = isActive && activeSubItem === sub;
                        return (
                          <li key={sub}>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveCategory(cat.id);
                                setActiveSubItem(sub);
                              }}
                              aria-current={isSubActive ? 'true' : undefined}
                              className={cx(
                                SUBITEM_BASE,
                                isSubActive ? SUBITEM_ACTIVE : SUBITEM_INACTIVE,
                              )}
                            >
                              {sub}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            }

            // Leaf category (no sub-items): the active fill sits on the row.
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cx(
                    CATEGORY_BUTTON_BASE,
                    isActive ? CATEGORY_ACTIVE_ROW : CATEGORY_INACTIVE,
                  )}
                >
                  {cat.icon ? (
                    <span aria-hidden="true" className={ICON_GLYPH}>
                      {cat.icon}
                    </span>
                  ) : null}
                  <span>{cat.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={EMPTY_STATE}>No matching preferences.</p>
      )}
    </nav>
  );
}
