/**
 * ==========================================================================
 * Calibre-UI — `/` route · App 01 Library List View (Figma screen `2:2`)
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * The home route (`/`) of the UI-only Calibre e-book-manager prototype
 * (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind CSS v4
 * CSS-first `@theme` tokens). It renders App 01 — Library List View (Figma
 * file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`, screen `2:2`, 1440×900 baseline):
 * the application's primary launch screen, a sortable book TABLE plus a
 * single-book DETAIL PANEL, driven entirely by the in-memory mock catalog in
 * `LibraryProvider` (the 15-book science-fiction dataset).
 *
 * SHELL DIVISION OF LABOR (AAP §0.2.2 / §0.6.2) — THIS PAGE IS CENTER + RIGHT
 * --------------------------------------------------------------------------
 * `AppShell` (mounted once in `app/layout.tsx`, above the router outlet) owns
 * the persistent window chrome: the macOS `WindowTitleBar` on every route and,
 * for the two library routes (`/` and `/grid`), the `TopToolbar` and the left
 * 216 px `Sidebar` (sections/counts, tag chips, author filter). It renders the
 * routed page into a `<main className="min-w-0 flex-1 overflow-auto">` slot to
 * the RIGHT of that sidebar.
 *
 * Therefore this page deliberately renders ONLY the CENTER + RIGHT region of
 * App 01 — it must NOT render the title bar, toolbar, or sidebar (AppShell
 * already supplies them; duplicating them would produce a double chrome):
 *   • CENTER — the sortable book list `BookListTable` (Figma `2:73`, ~988 px)
 *     with its sticky column header + rows, and the `StatusBar` (live book
 *     count + mock pagination) pinned beneath it.
 *   • RIGHT  — the single-book `BookDetailPanel` (Figma `2:345`, 236 px): the
 *     generated cover, title/author, star rating, the metadata table, the
 *     "Read Now" gradient CTA, and the Convert / Edit Metadata / Send / Delete
 *     actions.
 * Together with AppShell's 216 px sidebar these reconstruct the Figma
 * three-column shell: 216 (sidebar) + 988 (list) + 236 (detail) = 1440.
 *
 * SERVER COMPONENT (deliberate — no `'use client'`)
 * --------------------------------------------------------------------------
 * This page composes three CLIENT components (`BookListTable`, `StatusBar`,
 * `BookDetailPanel`), each of which carries its OWN `'use client'` boundary and
 * reads the shared state via `useLibrary()` / `useModal()` itself. The page
 * itself calls no hook and binds no handler, so it stays a Server Component (a
 * Server Component may freely render Client Components). This keeps root-level
 * client JS minimal and yields a clean, hydration-noise-free first paint —
 * satisfying the zero-console-errors gate.
 *
 * STATE & SELECTION (via `LibraryProvider` only — no local data)
 * --------------------------------------------------------------------------
 * There is NO data, selection, sort, or filter state in this file. The catalog,
 * the current selection, the active sidebar filters, and the sort all live in
 * `LibraryProvider` (mounted in `layout.tsx`) and are consumed INSIDE the child
 * components. On load the provider's deterministic defaults select the first
 * book (`selectedIds = [books[0].id]`, `currentBookId = books[0].id`), so the
 * detail panel shows a populated book immediately — matching the Figma list's
 * highlighted first row + populated detail panel.
 *
 * RESPONSIVE STRATEGY (1440 → 1280, ZERO horizontal overflow — AAP §0.7.4)
 * --------------------------------------------------------------------------
 * The page is a flex ROW. The CENTER column is `flex-1 min-w-0`: it GROWS to
 * fill the space between AppShell's fixed 216 px sidebar and this page's fixed
 * 236 px detail panel (so the ~988 px width is an emergent flex result, never a
 * hard `w-[988px]`), and `min-w-0` lets it shrink BELOW its content width so the
 * table's `minmax(0,…fr)` cell tracks reflow instead of forcing a horizontal
 * scrollbar. The `min-w-0 flex-1` pairing on the center is the single
 * load-bearing trick behind the no-overflow gate. The detail panel holds its
 * 236 px (it is `shrink-0` internally — see below); at the 1280 px floor the
 * center still has ≥ 828 px (1280 − 216 − 236), so nothing overflows.
 *
 * WHY `<BookDetailPanel />` IS RENDERED DIRECTLY (no extra `<aside>` wrapper)
 * --------------------------------------------------------------------------
 * `BookDetailPanel` is ALREADY the self-contained right column: its root
 * `GlassCard` is sized with `shrink-0 basis-[var(--size-detail-panel-w)]
 * min-w-[var(--size-detail-panel-w)]` (the 236 px `--size-detail-panel-w`
 * token), fills the height with `h-full`, and draws the single white-7% LEFT
 * hairline (`border-l border-[var(--border-white-07)]`) that separates it from
 * the table. Wrapping it in an additional `<aside className="w-[236px] shrink-0
 * border-l …">` would (a) draw a SECOND left border (a visible 2 px / offset
 * seam) and (b) demote the panel from a flex item to a block child, silently
 * nullifying its `flex-basis` / `shrink-0` sizing. Rendering it as a DIRECT flex
 * child of this row is what lets its intended flex sizing and its single token
 * border take effect exactly as designed (the panel must stay a flex item).
 *
 * ZERO-HARDCODED-VALUE RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * This page carries NO design-token literals (no color / radius / typography /
 * border values) — every surface tone, border, and type style is owned inside
 * the three composed components, which resolve them to `@theme` tokens. The only
 * classes here are Tailwind's standard LAYOUT/flex utilities (`flex`, `flex-1`,
 * `flex-col`, `min-w-0`, `min-h-0`, `h-full`, `w-full`) — none of which carry
 * design-token (color/spacing/radius/typography) information, so they are not a
 * token-fidelity violation.
 *
 * NAVIGATION INTEGRITY
 * --------------------------------------------------------------------------
 * This page triggers no route changes of its own. The library route navigation
 * (View → `/grid`, Edit Book → `/editor`, Prefs → `/preferences`, Convert →
 * modal) lives in AppShell's `TopToolbar`/`Sidebar`; the detail panel's
 * "Read Now" (→ `/viewer`) and "Convert Format" / "Edit Metadata" (→ modal
 * overlays via `useModal()`) are wired INSIDE `BookDetailPanel`. No URL is ever
 * entered manually.
 *
 * UI-ONLY · NO CALIBRE COUPLING
 * --------------------------------------------------------------------------
 * No backend, no API, no real file I/O, no EPUB parsing — purely presentational
 * over mock data. The upstream Calibre Python modules
 * (`src/calibre/gui2/library/views.py`, `models.py`,
 * `src/calibre/gui2/book_details.py`) are a DESIGN-PARITY reference ONLY (a
 * sortable, multi-select column table with a book-detail panel); nothing is
 * imported, translated, or executed from the Python codebase.
 *
 * @see @/components/library/BookListTable — the sortable, sticky-header table (center).
 * @see @/components/library/StatusBar — the live count + mock pagination band (center bottom).
 * @see @/components/library/BookDetailPanel — the single-book detail column (right).
 * @see @/state/LibraryProvider — supplies the catalog, selection, filters, and sort.
 * @see @/components/shell/AppShell — supplies the title bar, toolbar, and sidebar.
 * @see Agent Action Plan §0.3.1 / §0.7.4 — the App 01 Library List specification.
 */

import { BookListTable } from '@/components/library/BookListTable';
import { StatusBar } from '@/components/library/StatusBar';
import { BookDetailPanel } from '@/components/library/BookDetailPanel';

/**
 * LibraryListPage — the `/` route (App 01 Library List View).
 *
 * Arranges the CENTER + RIGHT region of App 01 as a single flex row that fills
 * AppShell's content slot:
 *   • a flexible CENTER column (`flex-1 min-w-0`) stacking the `BookListTable`
 *     (which grows to fill the height and scrolls internally) above the
 *     `StatusBar` (pinned to the bottom), and
 *   • the fixed-width RIGHT `BookDetailPanel` rendered as a direct flex child
 *     (it is self-contained: `shrink-0`, 236 px, with its own left hairline).
 *
 * The row is `h-full min-h-0` so the two columns fill the available height and
 * scroll their own content rather than growing the page, and `w-full` so the
 * row spans the content slot. All data, selection, sort, and interactivity are
 * owned by the child Client Components + `LibraryProvider`; this Server
 * Component only lays them out.
 *
 * @returns The App 01 Library List screen's center + right region.
 */
export default function LibraryListPage() {
  return (
    <div className="flex h-full min-h-0 w-full">
      {/*
        CENTER — the sortable book table above the status bar. `flex-1 min-w-0`
        makes this column absorb all responsive slack between AppShell's 216 px
        sidebar and the 236 px detail panel and shrink below its content width
        (the no-horizontal-overflow guarantee from 1440 → 1280). `flex-col`
        stacks the table (which grows + scrolls internally) over the bottom
        `StatusBar`. The surface fill, borders, and typography are owned inside
        the two components (both `bg-surface-1`).
      */}
      <section className="flex min-w-0 flex-1 flex-col">
        <BookListTable />
        <StatusBar />
      </section>

      {/*
        RIGHT — the single-book detail panel. Rendered DIRECTLY (no wrapper) so
        its own flex sizing (`shrink-0`, 236 px `--size-detail-panel-w` basis +
        min-width) and its single left hairline (`border-l border-white-07`)
        take effect as designed; wrapping it would double the border and nullify
        its flex-basis. It holds its width while the center column flexes.
      */}
      <BookDetailPanel />
    </div>
  );
}
