'use client';

/**
 * `/grid` route entry — App 02: Library Cover Grid View (Figma screen `3:2`).
 *
 * The alternate library view: a 5-column × 3-row cover grid with multi-select
 * and a batch-actions right panel. This is a deliberately THIN client page — a
 * pure composition layer whose ONLY logic is reading `isBatchMode` from the
 * library context to choose the right-hand panel. Everything else (grid
 * responsiveness, multi-select, sort, the `☰` return-to-list navigation, and
 * every exact Figma pixel/color value) lives inside the child components.
 *
 * Layout (the chrome around it is owned by `AppShell`, NOT this page):
 *   ┌ CENTER (flex-1, min-w-0) ───────────────┐ ┌ RIGHT (236px, shrink-0) ─┐
 *   │  <SortFilterBar/>  (sort/view bar, 3:66) │ │  isBatchMode             │
 *   │  <CoverGrid/>      (5×3 cards, 3:81–197) │ │   ? <BatchActionsPanel/> │
 *   │                                          │ │   : <BookDetailPanel/>   │
 *   │                                          │ │  <RecentlyAddedList/>    │
 *   └──────────────────────────────────────────┘ └──────────────────────────┘
 *
 * Why this is a Client Component (`'use client'` on line 1): the page calls the
 * `useLibrary()` React Context hook to read `isBatchMode`. App Router files are
 * Server Components by default, and a Server Component calling `useContext`
 * throws — hence the explicit client boundary. (This is the deliberate
 * difference from the sibling `/` route page, which composes client children
 * without itself calling a hook and so stays a Server Component.)
 *
 * State sharing / correctness gate: `/grid` shares ALL state with `/` through
 * `LibraryProvider`, which is mounted ONCE in the root `app/layout.tsx` above
 * the routed outlet. Because the provider lives above the route, `viewMode` and
 * `selectedIds` AUTOMATICALLY PERSIST when the user navigates List (`/`) ↔ Grid
 * (`/grid`) — a core AAP validation gate. This page therefore introduces NO
 * local/duplicate state and NO resetting logic; it only READS `isBatchMode`
 * (derived in the provider as `selectedIds.length >= 2`).
 *
 * Batch-panel swap (CRITICAL): `{isBatchMode ? <BatchActionsPanel/> :
 * <BookDetailPanel/>}`. `BatchActionsPanel` self-guards (returns `null` below
 * the 2-selection threshold), but `BookDetailPanel` does NOT, so the ternary is
 * required to avoid rendering both. Selecting a 2nd card flips `isBatchMode`
 * true and swaps the single-book detail panel for the batch-actions panel
 * (Figma: cards `3:81` + `3:99` selected → batch panel `3:205`).
 *
 * Chrome ownership: `/grid` is a library route, so the root `AppShell` already
 * renders the macOS `WindowTitleBar`, the `TopToolbar`, AND the left `Sidebar`,
 * then places THIS page inside its `<main className="min-w-0 flex-1
 * overflow-auto">` content slot. This page renders the CENTER + RIGHT regions
 * ONLY — it must NEVER render any window chrome, or it would be doubled.
 *
 * UI-only / mock: no backend, no API, no data fetching, no real file/EPUB
 * logic. The page composes presentational components fed by `LibraryProvider`.
 *
 * Design-parity reference ONLY (never imported, forked, or translated): the
 * cover-grid + multi-select semantics mirror Calibre's
 * `src/calibre/gui2/library/alternate_views.py` `GridView` — a `QListView` with
 * `setWrapping(True)` + `setFlow(LeftToRight)` + `setUniformItemSizes(True)`
 * (the wrapping uniform 5-column grid) and `setSelectionMode(ExtendedSelection)`
 * (multi-select). Conceptual parity only; this is a net-new React prototype.
 *
 * Token fidelity: every CSS value resolves to a Tailwind v4 `@theme` token from
 * `app/globals.css`. The fixed right-panel width is the named
 * `--size-detail-panel-w` token (236px, Figma `2:345` — the SAME token the App 01
 * `BookDetailPanel` sizes itself with, so List ↔ Grid feel consistent), consumed
 * as `w-[var(--size-detail-panel-w)]` (NO hardcoded `w-[236px]` literal — R3 /
 * AAP §0.4.5); the left hairline uses the `border-line-07` token (the
 * white-7%-opacity line from the AAP §0.3.2 manifest). No color/rgba/radius
 * literals appear anywhere in this file.
 */

import { useLibrary } from '@/state/LibraryProvider';
import { SortFilterBar } from '@/components/library/SortFilterBar';
import { CoverGrid } from '@/components/library/CoverGrid';
import { BatchActionsPanel } from '@/components/library/BatchActionsPanel';
import { BookDetailPanel } from '@/components/library/BookDetailPanel';
import { RecentlyAddedList } from '@/components/library/RecentlyAddedList';

/**
 * App 02 — Library Cover Grid View (`/grid`).
 *
 * Reads only `isBatchMode` from the library context and renders the two-region
 * (CENTER + RIGHT) layout. App Router page contract: a default-exported React
 * component taking no props.
 *
 * @returns The `/grid` screen composition (sort bar + cover grid on the left;
 *   the selection-driven detail/batch panel + Recently Added list on the right).
 */
export default function GridPage() {
  // The single piece of page-level logic: `isBatchMode` (= `selectedIds.length
  // >= 2`, derived in `LibraryProvider`) selects the right-hand panel below.
  const { isBatchMode } = useLibrary();

  return (
    // Root fills the `AppShell` `<main>` content slot. `min-h-0` lets the inner
    // scroll regions (`CoverGrid`, the right `<aside>`) size correctly; `flex`
    // lays out the CENTER column (left) and the fixed-width RIGHT panel (right).
    <div className="flex h-full min-h-0 w-full">
      {/* CENTER: the sort/view bar above the scrollable 5×3 cover grid. */}
      {/* `flex-1` absorbs all width not taken by the right panel; `min-w-0` is */}
      {/* load-bearing — it lets this flex child shrink below its content width */}
      {/* so the page stays overflow-free at the 1280px minimum viewport. */}
      <section className="flex min-w-0 flex-1 flex-col">
        <SortFilterBar />
        <CoverGrid />
      </section>

      {/* RIGHT: the detail panel that switches on selection, with the Recently */}
      {/* Added list beneath. Width is the `--size-detail-panel-w` token (236px, */}
      {/* Figma `2:345` — the SAME token the App 01 `BookDetailPanel` sizes itself */}
      {/* with, so List ↔ Grid feel identical) + `shrink-0` so the center column, */}
      {/* not this panel, absorbs the slack. No hardcoded width literal (R3 / AAP */}
      {/* §0.4.5): the value resolves to the named `@theme` token. */}
      {/* `border-l border-line-07` is the white-7% divider; it lives on the */}
      {/* aside (not the panels) so the hairline is consistent across BOTH the */}
      {/* batch and single-book states (BatchActionsPanel carries no own border). */}
      <aside className="flex w-[var(--size-detail-panel-w)] shrink-0 flex-col overflow-y-auto border-l border-line-07">
        {/* Selecting 2+ cards flips `isBatchMode` → swap the single-book detail */}
        {/* panel for the batch-actions panel. The ternary is required because */}
        {/* `BookDetailPanel` does not self-guard on batch mode (only */}
        {/* `BatchActionsPanel` returns null below the threshold). */}
        {/* */}
        {/* Block shim (`shrink-0`, no surface of its own): both panels are */}
        {/* self-contained right columns whose `basis-[14.75rem]` + `h-full` are */}
        {/* sized for a flex-ROW (where the basis is their WIDTH). Dropping them */}
        {/* straight into this flex-COLUMN would turn that basis into a fixed */}
        {/* 236px HEIGHT and clip their content. As a block child the basis is */}
        {/* inert and `h-full` resolves to the shim's content height, so each */}
        {/* panel sizes to its content and the aside scrolls as one column with */}
        {/* the Recently Added list beneath it. */}
        <div className="shrink-0">
          {isBatchMode ? <BatchActionsPanel /> : <BookDetailPanel />}
        </div>
        <RecentlyAddedList />
      </aside>
    </div>
  );
}
