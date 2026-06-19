/**
 * `/viewer` route — App 03 · E-book Viewer (Figma screen `4:2`, frame 1440x900).
 *
 * WHAT THIS FILE IS
 * -----------------
 * The App Router route-segment entry for the `/viewer` path. It renders the
 * distraction-free reading screen on the near-black viewer canvas, composed of
 * (top -> bottom):
 *
 *     +------------------------------------------------------------+
 *     | ReaderToolbar            (Figma 4:8 - 1440x44)             |  Back / A- A+ / theme
 *     +----------+------------------------------+------------------+
 *     | TOC      | ReadingArea                  | ReaderToolsPanel |  3-column body
 *     | (4:23)   | (4:43 - flexible center)     | (4:56)           |  (220 / 848 / 372)
 *     +----------+------------------------------+------------------+
 *     | ReaderNavStrip          (Figma 4:95 - 1440x44)            |  Previous / Next
 *     +------------------------------------------------------------+
 *
 * This page is deliberately THIN: it only ARRANGES five already-built client
 * components into the screen layout. It owns NO reading state and NO behavior --
 * all of that lives inside the components and the ReaderProvider /
 * PreferencesProvider contexts (mounted in `app/layout.tsx`, above `AppShell`).
 *
 * SERVER COMPONENT
 * ----------------
 * This file is a React Server Component, mirroring the established route-page
 * pattern (`app/page.tsx`, the `/` App 01 page). Unlike the five child
 * components -- which opt into the client runtime and subscribe to the reader
 * and preferences contexts internally -- this page does NOT opt into the client
 * bundle: it calls no hook, holds no state, and registers no event handler. A
 * Server Component is free to render Client Components as children, which keeps
 * the first paint server-rendered and free of hydration noise. The providers are
 * already in the tree (LibraryProvider -> PreferencesProvider -> ReaderProvider
 * -> ModalProvider -> AppShell -> {children}), so the children's context lookups
 * resolve on `/viewer` automatically; this page neither imports nor mounts any
 * provider.
 *
 * SHELL DIVISION OF LABOR (coordinate with `AppShell`)
 * ----------------------------------------------------
 * `/viewer` is NOT a library route. `AppShell` (which keys off the current
 * pathname) renders ONLY the global macOS `WindowTitleBar` (token
 * --color-title-bar, 1440x32) above this page and drops it into
 * `<main className="min-h-0 flex-1 overflow-auto">`. It does NOT render the
 * library `TopToolbar` or `Sidebar` here. Consequently THIS page is responsible
 * for the ENTIRE viewer body below the title bar -- including the viewer's OWN
 * `ReaderToolbar` (not the library toolbar) and `ReaderNavStrip`. The page root
 * therefore fills its parent (`h-full min-h-0`) and manages its own pinned-bars /
 * scrolling-columns regions; it must NOT add a second window title bar, a library
 * toolbar, or a sidebar.
 *
 * LAYOUT CONTRACT (load-bearing)
 * ------------------------------
 *   - Root  = `flex flex-col h-full min-h-0 w-full overflow-hidden` on the
 *     --color-viewer-bg canvas. `overflow-hidden` pins the toolbar and the nav
 *     strip so only the three columns scroll internally.
 *   - Middle row = `flex min-h-0 w-full flex-1`: `flex-1` absorbs the height
 *     between the two 44px bars; `min-h-0` is REQUIRED so the columns can scroll
 *     (`overflow-y-auto`, owned by the children) instead of forcing the page
 *     taller.
 *   - Column widths are NOT set here. The children self-size to reproduce the
 *     Figma 220 / 848 / 372 split: `TableOfContents` and `ReaderToolsPanel` use a
 *     flex-basis + a min-width floor + `shrink`; `ReadingArea` is `flex-1
 *     min-w-0` and absorbs the slack. This is what lets the 1440px baseline
 *     degrade to a 1280px minimum with ZERO horizontal overflow -- so the page
 *     introduces no fixed pixel widths of its own.
 *
 * STYLING / TOKEN FIDELITY
 * ------------------------
 * Zero hardcoded color/gradient/radius/shadow literals. The only color this file
 * references is the canvas background, via the `@theme` token --color-viewer-bg
 * (see `app/globals.css`). Everything else here is a Tailwind layout/spacing
 * primitive (`flex`, `flex-1`, `flex-col`, `min-h-0`, `min-w-0`, `w-full`,
 * `h-full`, `overflow-hidden`), which carries no design-token color information
 * and is permitted.
 *
 * UI-ONLY / NO CALIBRE COUPLING
 * -----------------------------
 * This is a UI-only, mock-data prototype: no backend, no API, no real EPUB
 * parsing, no data fetching, no persistence. The Calibre Python modules
 * `src/calibre/gui2/viewer/{ui,toc,toolbars}.py` are READ-ONLY design-parity
 * references ONLY (they confirm the TOC-left / reading-center / tools-right
 * arrangement and the Back / font-scale / color-scheme toolbar actions); they
 * are PyQt, a different stack, and are NEVER imported or translated here.
 */

import { ReaderToolbar } from '@/components/viewer/ReaderToolbar';
import { TableOfContents } from '@/components/viewer/TableOfContents';
import { ReadingArea } from '@/components/viewer/ReadingArea';
import { ReaderToolsPanel } from '@/components/viewer/ReaderToolsPanel';
import { ReaderNavStrip } from '@/components/viewer/ReaderNavStrip';

/**
 * `ViewerPage` -- the `/viewer` route entry (App 03 · Figma `4:2`).
 *
 * Composes the five viewer components into the reading-screen layout on the
 * --color-viewer-bg canvas. See the file-level doc comment for the full layout,
 * shell-division, and server-component contract. This component takes no props
 * and holds no state -- it is a pure structural composition.
 *
 * @returns The assembled E-book Viewer screen body (below `AppShell`'s global
 *          window title bar).
 */
export default function ViewerPage() {
  return (
    // Root: full-height vertical stack on the near-black viewer canvas. `h-full`
    // + `min-h-0` fill AppShell's `<main>` slot (viewport minus the 32px title
    // bar); `overflow-hidden` keeps the page itself from scrolling so the toolbar
    // and nav strip stay pinned and the three body columns scroll internally.
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[var(--color-viewer-bg)]">
      {/* Top reader toolbar (Figma 4:8 - 1440x44): Back-to-Library, A-/A+ font
          scale, and the viewer theme switch. Self-sized to a 44px bar. */}
      <ReaderToolbar />

      {/* 3-column reading body. `flex-1` absorbs the height between the two 44px
          bars; `min-h-0` lets the columns scroll internally instead of forcing
          the page taller. The three children self-size their widths to the Figma
          220 / 848 / 372 split -- no fixed pixel widths are set here. */}
      <div className="flex min-h-0 w-full flex-1">
        {/* Left -- Table of Contents (Figma 4:23 - ~220px, surface-2 token);
            current chapter highlighted with the accent color. */}
        <TableOfContents />

        {/* Center -- flexible reading surface (Figma 4:43 - reading-surface
            token) with the top progress bar, gradient divider, justified body,
            and highlighted passage. `flex-1 min-w-0` (inside the component)
            absorbs the slack. */}
        <ReadingArea />

        {/* Right -- reader tools (Figma 4:56 - ~372px): bookmarks, notes /
            highlights, and reading-progress stats. */}
        <ReaderToolsPanel />
      </div>

      {/* Bottom nav strip (Figma 4:95 - 1440x44): Previous / Next chapter
          stepping. Self-sized to a 44px bar. */}
      <ReaderNavStrip />
    </div>
  );
}
