'use client';

/**
 * AppShell — the persistent application chrome for the Calibre-UI prototype.
 *
 * `AppShell` is the top-level wrapper rendered around EVERY routed page. It owns
 * the window-level chrome and the modal mount points; the routed page itself
 * (`{children}`) owns the screen-specific content (the library table/grid + its
 * detail panel, the reader surface, the editor panes, the preferences panels).
 *
 * It renders, in order:
 *   1. {@link WindowTitleBar} — the macOS traffic-light window bar, on EVERY route.
 *   2. CONDITIONALLY, {@link TopToolbar} + {@link Sidebar} — only on the LIBRARY
 *      routes (`/` and `/grid`). The viewer (`/viewer`), editor (`/editor`), and
 *      preferences (`/preferences`) routes are full-screen layouts that supply
 *      their OWN toolbars (ReaderToolbar / EditorToolbar+FileTabs / Preferences
 *      header+nav) inside their route pages, so the standard chrome is omitted
 *      there. (Figma: chrome present on `2:2`/`3:2`; absent on `4:2`/`5:2`/`8:2`.)
 *   3. The routed page content (`{children}`) in the content slot.
 *   4. The modal overlays {@link ConvertDialog} + {@link MetadataDialog} — mounted
 *      UNCONDITIONALLY. Each dialog self-gates its visibility via `useModal()` and
 *      renders nothing while its modal kind is closed, so mounting both always is
 *      correct and cost-free. The dialogs overlay the current screen via a fixed
 *      scrim and NEVER change the route.
 *
 * Provider ownership (CRITICAL): `AppShell` does NOT mount any Context provider.
 * Per the application architecture (AAP §0.6.2), `app/layout.tsx` composes the
 * full provider tree AROUND `AppShell`:
 *
 *     LibraryProvider → PreferencesProvider → ReaderProvider → ModalProvider
 *         → AppShell → {children}
 *
 * `AppShell` therefore ASSUMES it is rendered inside all four providers, so the
 * `useLibrary()` / `useModal()` / `useReader()` / `usePreferences()` hooks called
 * by `TopToolbar`, `Sidebar`, `ConvertDialog`, and `MetadataDialog` resolve their
 * context correctly. Do NOT import or render any `*Provider` here.
 *
 * Export contract (DEFINED here for the downstream `app/layout.tsx` agent):
 *   import { AppShell } from '@/components/shell/AppShell';
 *   <AppShell>{children}</AppShell>
 * `AppShell` is a NAMED export consumed via its direct module path — there is no
 * barrel `index.ts` in `components/shell/` (consistent with every component
 * folder; only `@/types` has a barrel).
 *
 * Design-parity reference ONLY (the Python sources are NEVER imported or
 * translated — this is a net-new, UI-only React prototype): the window-wraps-a-
 * central-view metaphor mirrors Calibre's `src/calibre/gui2/ui.py` (the main GUI
 * window), `src/calibre/gui2/layout.py` (the window's toolbar / search / panel
 * regions), and `src/calibre/gui2/library/views.py` (the central library view the
 * window wraps). Only the layout metaphor is reproduced, per the Figma design.
 *
 * Styling rule: every CSS value resolves to an `@theme` design token (see
 * `app/globals.css`); the only token this file references directly is
 * `--color-bg-app` for the root background. No hardcoded color/spacing literals.
 *
 * This is a UI-only / mock prototype: no backend, no real I/O. Navigation is
 * driven by `next/navigation`; modal visibility by `useModal()` (inside the
 * dialogs). `AppShell` itself never navigates and never reads modal state — it
 * only composes the chrome whose controls perform those actions.
 */

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { WindowTitleBar } from '@/components/shell/WindowTitleBar';
import { TopToolbar } from '@/components/shell/TopToolbar';
import { Sidebar } from '@/components/shell/Sidebar';
import { ConvertDialog } from '@/components/convert/ConvertDialog';
import { MetadataDialog } from '@/components/metadata/MetadataDialog';

/**
 * The two routes that render the standard library chrome (top toolbar + left
 * sidebar). Every other route is a full-screen layout whose route page supplies
 * its own toolbar, so it receives only the window title bar from `AppShell`.
 *
 * Kept as a single source of truth so the branch in {@link AppShell} reads
 * declaratively and stays trivial to extend should another library-style route
 * ever be added (none are planned — AAP §0.8 caps the prototype at five routes).
 */
const LIBRARY_ROUTES: readonly string[] = ['/', '/grid'];

/**
 * Props for {@link AppShell}.
 *
 * @property children - The routed page element rendered in the content slot.
 */
interface AppShellProps {
  /** The routed page (App Router `{children}`) rendered in the content slot. */
  children: ReactNode;
}

/**
 * Renders the persistent window chrome around the routed page plus the always-
 * mounted modal overlays. See the file-level doc comment for the full contract.
 *
 * @param props - {@link AppShellProps}; `children` is the routed page.
 * @returns The application shell wrapping `children`.
 */
export function AppShell({ children }: AppShellProps) {
  // `usePathname()` (App Router) returns the current path string. The standard
  // toolbar + sidebar chrome belongs to the library routes only; all other
  // routes are full-screen and bring their own toolbars. A non-matching or empty
  // path falls through to the full-screen branch (a safe, chrome-light default).
  const pathname = usePathname();
  const isLibraryRoute = LIBRARY_ROUTES.includes(pathname);

  return (
    // Root: full-viewport vertical stack. `overflow-hidden` clips the window so
    // the internal regions scroll (never the page), and the app background token
    // is the base fill behind every screen. Height/width of the title bar,
    // toolbar, and sidebar are owned by those components — `AppShell` only
    // provides the flex context, so the content row absorbs the remaining height.
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-bg-app)]">
      {/* macOS-style window title bar — rendered identically on EVERY route. */}
      <WindowTitleBar />

      {isLibraryRoute ? (
        // Library routes (`/`, `/grid`): standard chrome = top toolbar above a
        // row of [fixed-width sidebar | flexible content]. The sidebar holds its
        // 216px width (`shrink-0`); the content takes the slack via
        // `flex-1 min-w-0`, keeping the 1440px baseline overflow-free down to
        // 1280px. `min-h-0` lets the row (and the sidebar's `h-full`) size to the
        // space left below the title bar + toolbar rather than overflowing.
        <>
          <TopToolbar />
          <div className="flex min-h-0 flex-1">
            <Sidebar />
            <main className="min-w-0 flex-1 overflow-auto">{children}</main>
          </div>
        </>
      ) : (
        // Full-screen routes (`/viewer`, `/editor`, `/preferences`): no standard
        // toolbar/sidebar — the route page renders its own chrome. The content
        // fills all space below the title bar and scrolls internally.
        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      )}

      {/*
        Modal overlays — mounted ONCE, UNCONDITIONALLY, regardless of route.
        Each dialog subscribes to `useModal()` internally and renders its
        `ModalShell` only when its kind is open (`ModalShell` returns `null`
        while closed). They overlay the current screen via a fixed-position scrim
        and never change the URL, so `AppShell` needs no modal state of its own.
      */}
      <ConvertDialog />
      <MetadataDialog />
    </div>
  );
}

export default AppShell;
