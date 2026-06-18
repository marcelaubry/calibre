'use client';

/**
 * ==========================================================================
 * Calibre-UI Shell — Sidebar
 * The persistent LEFT library sidebar (sections + tags + authors).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `Sidebar` is the left facet panel of the two library screens of the UI-only
 * Calibre e-book-manager prototype (Next.js 15 App Router · React 19 ·
 * TypeScript 5 strict · Tailwind CSS v4 CSS-first `@theme` tokens):
 *   • App 01 — Library List  (`/`,     Figma node `2:2`)
 *   • App 02 — Cover Grid     (`/grid`, Figma node `3:2`)
 * It renders a single vertical panel (Figma node `2:36`) with three labeled
 * groups, top → bottom:
 *   1. SECTIONS — navigation rows (All Books, Reading Now, Recently Added,
 *      Favorites, EPUB, MOBI, PDF) each with an emoji glyph and a live count.
 *   2. TAGS — a flex-wrapping tag-chip browser (every genre/tag in the catalog).
 *   3. AUTHORS — an author-filter list (each author with a book count).
 * It is part of the persistent shell and is rendered by `AppShell` ONLY on the
 * library routes (`/` and `/grid`).
 *
 * UI-ONLY / MOCK — FILTER STATE ONLY
 * --------------------------------------------------------------------------
 * This is a visual/functional prototype with NO backend, NO API, NO database,
 * and NO persistence (AAP §0.8.2). Clicking a section, a tag, or an author does
 * exactly one thing: it updates the in-memory library FILTER state through the
 * `useLibrary()` Context hook (`setActiveSection` / `toggleTag` /
 * `setActiveAuthor`). There is NO query, NO network call, and nothing is saved
 * across reloads. The facet DATA itself (sections, tags, authors — all with
 * counts) is imported wholesale from `@/data/sidebar`; this component only
 * renders it and wires the clicks to the filter setters.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The panel consumes the `useLibrary()` Context hook and binds an `onClick`
 * handler on every interactive row and chip — both client-only concerns (App
 * Router components default to Server Components, which cannot use hooks or
 * attach event handlers). The directive is the very first line, before any
 * import.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, screen `2:2` = App 01)
 * --------------------------------------------------------------------------
 * Sidebar node `2:36`, reconciled against the AAP §0.3.1 / §0.3.2 / §0.3.3
 * manifests and the already-reconciled values captured by the dependency
 * primitives:
 *   • Panel — fill `--color-surface-1`, NO corner radius, a single RIGHT-EDGE
 *     hairline `--border-white-07` (the exact reconciled values the `GlassCard`
 *     author recorded for this node). Width 216px (AAP §0.3.1).
 *   • Section row — emoji glyph + label + count; the ACTIVE row carries a
 *     translucent purple fill (AAP §0.3.3 `SidebarSectionItem`).
 *   • Tag chip — the rounded translucent-purple `TagPill` primitive, LABEL ONLY
 *     (no count, no icon — the reconciled chip spec the `TagPill` author
 *     recorded for nodes `2:54`–`2:65`).
 *
 * BLITZY [FIGMA]: `analyze_figma_node` for node `2:36` was unavailable during
 * this implementation session (the subagent errored on every attempt), so per
 * the precedence rules the AAP §0.3 manifests govern, reinforced by the
 * already-reconciled sidebar values the `GlassCard`/`TagPill` authors recorded
 * for this exact node. The group heading wording ("Library" / "Tags" /
 * "Authors") and the active-fill opacity (`bg-accent/15`, inside the AAP §0.2
 * brief's sanctioned `/10`–`/15` range) are the conservative AAP-derived
 * choices; a future Figma pass may refine the exact strings/opacity.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / radius value resolves to an `@theme` token from
 * `src/app/globals.css`, consumed via a token utility (`text-text-secondary`,
 * `text-meta-label`, `bg-accent/15`, `rounded-control`, `rounded-full`) or a
 * CSS-variable arbitrary value (`bg-[var(--color-surface-1)]`,
 * `border-[var(--border-white-07)]`, `hover:bg-[var(--border-white-06)]`,
 * `ring-[var(--border-accent)]`, `ring-[var(--color-accent)]`). There are NO
 * raw hex / rgba color literals. The active state is a token + numeric opacity
 * modifier (`bg-accent/15`), which is compliant (the base color is the
 * `--color-accent` token; `/15` is a numeric opacity, not a color literal). The
 * remaining bare utilities are Tailwind's standard layout / spacing scale
 * (`flex`, `gap-5`, `px-3`, `py-2`, `w-5`, `truncate`, `flex-wrap`) plus the
 * panel width, which resolves to the named `--size-sidebar-w` token
 * (`w-[var(--size-sidebar-w)]` = 216px, the exact Figma width — mirrored in
 * `src/theme/tokens.ts` as `sizes.sidebarW`, the same tokenized sizing hook the
 * sibling `TopToolbar` search field uses); none of these carry color information.
 *
 * RESPONSIVE (1440 → 1280, zero horizontal overflow — AAP §0.9)
 * --------------------------------------------------------------------------
 * The panel is `w-[var(--size-sidebar-w)] shrink-0` — it holds its 216px width
 * and never compresses;
 * the surrounding `AppShell` row gives the center content `flex-1 min-w-0` so
 * the center (not the sidebar) absorbs the slack. Long author names truncate
 * (`truncate` + `min-w-0`) and tag chips `flex-wrap`, so nothing ever forces
 * horizontal overflow. Long lists scroll vertically (`overflow-y-auto`) instead
 * of breaking the 820px design height.
 *
 * COMPOSITION & ACCESSIBILITY (R4 — native semantics)
 * --------------------------------------------------------------------------
 * Composes design-system primitives rather than hand-rolled controls. The
 * clickable SECTION and AUTHOR rows are the shared `NavRowButton` primitive
 * (which renders a real `<button type="button">` with free Enter/Space
 * activation, a token-backed inset `:focus-visible` ring, and a `motion-safe`
 * color transition); each supplies only its per-row layout/active-fill via
 * `className`. The TAG chips are NATIVE `<button type="button">` elements (the
 * full-width `NavRowButton` is unsuitable for an inline, content-hugging chip),
 * with their default button chrome neutralized so only the `TagPill` primitive
 * paints. Every control carries `aria-pressed` to announce its toggle state to
 * assistive tech — these are FILTER toggles, so `aria-pressed` (not
 * `aria-current`) is the correct semantic, which is why the rows pass
 * `aria-pressed` rather than the primitive's `active` prop. There are NO
 * `div role="button"` controls and NO `onKeyDown` shims — keyboard operability
 * comes natively from the underlying buttons. The root is an `<aside>` landmark;
 * group items are real `<ul>`/`<li>` lists; emoji glyphs are `aria-hidden`
 * (decorative — the visible label is the control's accessible name). Color is
 * never the sole active cue (the label brightens AND, for tags, a ring appears;
 * `aria-pressed` carries the state to assistive tech).
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * --------------------------------------------------------------------------
 * The panel is the web analog of Calibre's desktop Tag Browser — the facet tree
 * that groups the library by category and shows per-category counts
 * (`src/calibre/gui2/tag_browser/ui.py` `TagBrowserMixin`,
 * `src/calibre/gui2/tag_browser/model.py` `COUNT_ROLE`). NO Python/Qt code is
 * imported, translated, or executed; those modules are a read-only conceptual
 * reference for what the sidebar SHOWS, not how it is built.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see src/state/LibraryProvider — the `useLibrary()` filter state + setters.
 * @see src/data/sidebar — the section/tag/author facet data (with counts).
 * @see src/components/primitives/TagPill — the tag-chip primitive.
 * @see Agent Action Plan §0.3.1 / §0.3.2 / §0.3.3 — sidebar spec, tokens, components.
 * @see src/calibre/gui2/tag_browser/ui.py — Calibre Tag Browser (reference only).
 */

import type { JSX } from 'react';
import { useLibrary } from '@/state/LibraryProvider';
import { NavRowButton } from '@/components/primitives/NavRowButton';
import { TagPill } from '@/components/primitives/TagPill';
import { sidebarSections, tagFacets, authorFacets } from '@/data/sidebar';
import type { SidebarSection, TagFacet, AuthorFacet } from '@/types';

/**
 * Props for {@link Sidebar}.
 *
 * Intentionally minimal: the sidebar reads everything else it needs (the active
 * filters and their setters) from the `useLibrary()` Context. `className` lets
 * `AppShell` apply layout utilities, merged AFTER the base classes so caller
 * utilities win on conflicts.
 */
export interface SidebarProps {
  /** Optional extra classes merged onto the panel container (caller wins). */
  className?: string;
}

/**
 * Root `<aside>` panel classes — all token-backed.
 *
 * `w-[var(--size-sidebar-w)] shrink-0` holds the exact Figma panel width (216px,
 * the `--size-sidebar-w` token) without compressing
 * (the center content absorbs slack via `flex-1 min-w-0` in `AppShell`);
 * `h-full` fills the available shell row (NOT a hardcoded 820px); `flex-col
 * gap-5` stacks the three groups; `overflow-y-auto` lets long tag/author lists
 * scroll rather than break the height; `px-3 py-4` is the panel inset. The
 * `--color-surface-1` fill and the single RIGHT-edge `--border-white-07`
 * hairline (no radius) are the reconciled Figma values for node `2:36`.
 */
const ASIDE_CLASSES =
  'flex h-full w-[var(--size-sidebar-w)] shrink-0 flex-col gap-5 overflow-y-auto px-3 py-4 ' +
  'bg-[var(--color-surface-1)] border-r border-[var(--border-white-07)]';

/**
 * Group-heading classes — a small, uppercase, muted label rendered as a `<p>`
 * (NOT an `<h*>`, per the composition rule). `text-meta-label` is the Inter
 * 400 / 10px role token; `tracking-wider` is the standard letter-spacing scale;
 * `text-text-muted` is the muted color token; `select-none` keeps the static
 * label non-selectable.
 */
const HEADING_CLASSES =
  'px-2 pb-2 text-meta-label uppercase tracking-wider text-text-muted select-none';

/**
 * Per-context LAYOUT classes for a SECTION / AUTHOR row, merged onto the
 * {@link NavRowButton} primitive that supplies the row SEMANTICS.
 *
 * A flex row (icon/name + flexible label + trailing count) with the
 * `rounded-control` (8px) corner token, `px-2 py-2` inset, and `min-w-0` so the
 * label can truncate instead of forcing overflow. The variant-invariant button
 * semantics — `w-full text-left`, `cursor-pointer select-none`, the token-backed
 * `:focus-visible` ring (`--border-accent`), and the `motion-safe` color
 * transition — are owned by `NavRowButton` (R4), so they are intentionally
 * absent here to avoid duplicating the primitive's base (a future change to the
 * primitive then governs every row uniformly).
 */
const ROW_BASE_CLASSES = 'flex items-center gap-2 rounded-control px-2 py-2 min-w-0';

/**
 * ACTIVE row treatment — the translucent purple fill (the `--color-accent`
 * token at 15% opacity, inside the AAP-sanctioned `/10`–`/15` range) plus the
 * brighter primary-text token. Applied when the row's section/author is the
 * active filter.
 */
const ROW_ACTIVE_CLASSES = 'bg-accent/15 text-text-primary';

/**
 * INACTIVE row treatment — transparent fill with the secondary-text token and a
 * subtle white-6% hover wash (the dominant app hover token), so a resting row is
 * quiet and only reveals interactivity on hover.
 */
const ROW_INACTIVE_CLASSES = 'text-text-secondary hover:bg-[var(--border-white-06)]';

/**
 * Section/author emoji-glyph icon column. A fixed `w-5` (20px) centered column
 * so every label aligns regardless of glyph width; `shrink-0` keeps it from
 * compressing. The glyph inherits the row's `--color`/font-size and is
 * `aria-hidden` at the call site (decorative — the label names the control).
 */
const ICON_CLASSES = 'w-5 shrink-0 text-center';

/**
 * Row label — `flex-1` to fill the space between icon and count, `truncate`
 * (+ `min-w-0`) to ellipsize long names rather than overflow, and the
 * `text-body` (Inter 400 / 12px) role token. Color is inherited from the row
 * (primary when active, secondary otherwise).
 */
const LABEL_CLASSES = 'min-w-0 flex-1 truncate text-body';

/**
 * Trailing count — the `text-meta-value` (Inter 500 / 10px) role token in the
 * muted color token, `shrink-0` so the number is never clipped. Kept muted even
 * on active rows so the label stays the primary cue (visual hierarchy).
 */
const COUNT_CLASSES = 'shrink-0 text-meta-value text-text-muted';

/**
 * Clickable wrapper around each {@link TagPill} — a NATIVE `<button type="button">`
 * (R4: native semantics over a `div role="button"`), with its default button
 * chrome neutralized so ONLY the pill renders: `appearance-none border-0
 * bg-transparent p-0` strip the user-agent button look, leaving the pill's own
 * translucent-purple surface intact. `inline-flex` hugs the pill (the full-width
 * `NavRowButton` is unsuitable for an inline chip); `rounded-full` matches the
 * pill so the `:focus-visible` ring is capsule-shaped; `cursor-pointer
 * select-none` signal interactivity. Enter/Space activation and the button role
 * now come natively from the element (no `onKeyDown` helper needed).
 */
const TAG_WRAP_CLASSES =
  'inline-flex rounded-full cursor-pointer select-none appearance-none border-0 bg-transparent p-0 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)]';

/**
 * ACTIVE tag treatment, passed to {@link TagPill} via its `className` escape
 * hatch. A 2px accent-colored ring is used DELIBERATELY (rather than a stronger
 * background fill): the pill's base already paints `bg-accent/20`, and stacking
 * a second `bg-accent/NN` utility would rely on Tailwind source-order to win,
 * which is fragile. A `ring-*` utility sets `box-shadow` — a property the pill
 * base never sets — so the active ring ALWAYS renders, giving a reliable,
 * token-backed selected cue with zero layout shift.
 */
const TAG_ACTIVE_CLASSES = 'ring-2 ring-[var(--color-accent)]';

/**
 * Sidebar — the persistent left library facet panel (sections + tags + authors).
 *
 * Renders an `<aside>` landmark containing three groups. Each group maps its
 * static facet data from `@/data/sidebar` and wires every click (and the
 * equivalent Enter/Space keypress) to the matching `useLibrary()` filter setter:
 * sections → `setActiveSection`, tags → `toggleTag`, authors → `setActiveAuthor`
 * (a second click on the active author clears it). The active section/tag/author
 * is highlighted from the live `useLibrary()` state. All styling is token-backed
 * (see the file header); the caller `className` is merged AFTER the base classes
 * so caller utilities win on conflicts.
 *
 * @param props - {@link SidebarProps}
 * @returns The rendered sidebar panel.
 */
export function Sidebar({ className }: SidebarProps): JSX.Element {
  const {
    activeSection,
    setActiveSection,
    activeTags,
    toggleTag,
    activeAuthor,
    setActiveAuthor,
  } = useLibrary();

  // Merge the token-backed base classes with any caller className (appended last
  // so caller utilities win). `filter(Boolean)` drops an absent className.
  const merged = [ASIDE_CLASSES, className].filter(Boolean).join(' ');

  return (
    <aside className={merged} aria-label="Library filters and navigation">
      {/* ---- Group 1: Sections (navigation rows with live counts) ---- */}
      <div>
        <p className={HEADING_CLASSES}>Library</p>
        <ul className="flex flex-col gap-0.5">
          {sidebarSections.map((section: SidebarSection) => {
            const isActive = activeSection === section.id;
            const activate = (): void => setActiveSection(section.id);
            return (
              <li key={section.id}>
                <NavRowButton
                  aria-pressed={isActive}
                  onClick={activate}
                  className={`${ROW_BASE_CLASSES} ${isActive ? ROW_ACTIVE_CLASSES : ROW_INACTIVE_CLASSES}`}
                >
                  <span className={ICON_CLASSES} aria-hidden="true">
                    {section.icon}
                  </span>
                  <span className={LABEL_CLASSES}>{section.label}</span>
                  <span className={COUNT_CLASSES}>{section.count}</span>
                </NavRowButton>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---- Group 2: Tags (flex-wrapping chip browser, label only) ---- */}
      <div>
        <p className={HEADING_CLASSES}>Tags</p>
        <ul className="flex flex-wrap gap-1.5 px-2">
          {tagFacets.map((tag: TagFacet) => {
            const isActive = activeTags.includes(tag.label);
            const activate = (): void => toggleTag(tag.label);
            return (
              <li key={tag.label}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={activate}
                  className={TAG_WRAP_CLASSES}
                >
                  <TagPill
                    label={tag.label}
                    className={isActive ? TAG_ACTIVE_CLASSES : undefined}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---- Group 3: Authors (author-filter rows with counts) ---- */}
      <div>
        <p className={HEADING_CLASSES}>Authors</p>
        <ul className="flex flex-col gap-0.5">
          {authorFacets.map((author: AuthorFacet) => {
            const isActive = activeAuthor === author.name;
            // Toggle: clicking the active author clears the filter (null).
            const activate = (): void =>
              setActiveAuthor(isActive ? null : author.name);
            return (
              <li key={author.name}>
                <NavRowButton
                  aria-pressed={isActive}
                  onClick={activate}
                  className={`${ROW_BASE_CLASSES} ${isActive ? ROW_ACTIVE_CLASSES : ROW_INACTIVE_CLASSES}`}
                >
                  <span className={LABEL_CLASSES}>{author.name}</span>
                  <span className={COUNT_CLASSES}>{author.count}</span>
                </NavRowButton>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
