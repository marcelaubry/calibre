/**
 * ==========================================================================
 * Calibre-UI — `/editor` route entry (App 04 · Book/EPUB Editor · Figma `5:2`)
 * The screen-composition orchestrator for the EPUB Editor screen.
 * ==========================================================================
 *
 * WHAT THIS FILE IS
 * --------------------------------------------------------------------------
 * This is the Next.js 15 App Router page for the `/editor` route segment of the
 * UI-only, mock-data Calibre prototype (React 19 · TypeScript 5 strict · Tailwind
 * CSS v4 CSS-first tokens). It is a PURE COMPOSITION file: it assembles the five
 * sibling editor components in their Figma-confirmed structure and wires the
 * React-Server-Component (RSC) data flow. It implements NONE of their internals —
 * the toolbar, tab strip, file tree, code view, and preview are each owned by a
 * dedicated component under `@/components/editor/*`.
 *
 * UI-ONLY / MOCK: there is NO real EPUB parsing, NO real file editing, NO backend,
 * NO API call, and NO persistence. The Calibre Python modules
 * (`src/calibre/gui2/tweak_book/*`) are design-parity references only — they are
 * NEVER imported or translated.
 *
 * WHY THIS IS A SERVER COMPONENT (NO `'use client'` — load-bearing)
 * --------------------------------------------------------------------------
 * This page intentionally carries NO `'use client'` directive and is a regular
 * (non-`async`) function. It must remain a Server Component so the `<CodeEditor>`
 * elements it instantiates — each an `async` Server Component that runs Shiki
 * syntax highlighting on the server via the cached `@/lib/highlight` singleton —
 * are resolved server-side, shipping ZERO client highlighting JS. The page does
 * NOT itself `await` anything: all async work lives inside `CodeEditor`. Creating
 * a `<CodeEditor .../>` element does not execute it; React resolves it during
 * server rendering.
 *
 * THE SERVER-SLOTS / CLIENT-TOGGLE SEAM (the architectural crux)
 * --------------------------------------------------------------------------
 * The page pre-renders one server `<CodeEditor>` per file into a
 * `codeSlots: Record<filePath, ReactNode>` map (all slots live in the RSC
 * payload) and hands it to `<EditorCodeViewport>` — a CLIENT component (it lives
 * in the `'use client'` module `FileTabs.tsx`). Passing server-component elements
 * as props into a client component is the supported RSC pattern: the viewport
 * simply shows the slot whose key matches the active file. Consequently
 * tab/file switching is pure client state with ZERO server round-trips and ZERO
 * re-highlighting cost — satisfying the prototype's "zero console warnings / zero
 * console errors on tab switch" gate.
 *
 * `codeSlots` is keyed by `f.path` (the file's full OEBPS path), NOT `f.name`, so
 * the keys match the active-file key that `EditorWorkspaceProvider` /
 * `EditorCodeViewport` look up. Two files can share a `name` across folders, so
 * keying by `name` would break the lookup.
 *
 * APPSHELL COORDINATION & FULL-HEIGHT LAYOUT
 * --------------------------------------------------------------------------
 * `AppShell` (mounted by `app/layout.tsx`) strips the library chrome on
 * non-library routes: for `/editor` it renders ONLY the macOS `<WindowTitleBar />`
 * plus `<main className="min-h-0 flex-1 overflow-auto">{children}</main>`. There
 * is NO `TopToolbar` and NO `Sidebar` here — so THIS page renders the entire
 * editor screen body, and never re-renders the title bar/toolbar/sidebar.
 *
 * That `<main>` is a BLOCK-level box with a definite height (it is `flex-1`
 * inside AppShell's `h-screen` flex column). `EditorWorkspaceProvider` is a
 * context-only provider that emits no DOM wrapper, so this page supplies a single
 * full-height flex COLUMN wrapper — `flex h-full min-h-0 flex-col` — to bridge the
 * block `<main>` (definite height) into a definite-height flex column. Inside it
 * the regions stack vertically: `EditorToolbar` (fixed 44px, `flex-none`) →
 * `FileTabs` (fixed 36px, `flex-none`) → the content row (`flex-1 min-h-0`, fills
 * the remaining height). The content row is a flex ROW whose definite height lets
 * `FileTree`'s own `h-full` resolve. The fixed heights/widths of the toolbar,
 * tabs, tree, code view, and preview are owned by those components — never
 * duplicated here.
 *
 * RESPONSIVE (1440 → 1280, zero horizontal overflow)
 * --------------------------------------------------------------------------
 * The content row carries no fixed width. Its children degrade cleanly: the
 * `FileTree` holds its 200px (`flex-none`), the center `EditorCodeViewport`
 * (`flex-1 min-w-0`) absorbs/releases slack, and the `PreviewPane`
 * (`basis`/`shrink min-w-0`) can shrink — so the 1440px baseline reflows to a
 * 1280px minimum without horizontal overflow.
 *
 * DESIGN TOKENS
 * --------------------------------------------------------------------------
 * This page is purely structural and uses ONLY layout utilities (`flex`,
 * `flex-col`, `flex-1`, `min-h-0`, `h-full`). It carries no color/spacing/radius
 * literals — every colored surface lives in the child components, each of which
 * resolves its values to `@theme` tokens in `app/globals.css`.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, screen node `5:2`)
 * --------------------------------------------------------------------------
 * Screen frame 1440×900. Vertical order: WindowTitleBar (1440×32, AppShell) →
 * EditorToolbar `5:8` (1440×44) → FileTabs `5:29` (1440×36) → content row
 * (1440×788). Content row horizontal order: FileTree `5:53` (200×788) | CodeEditor
 * `5:74` (736×788) | PreviewPane `5:131` (504×788). Asset inventory = 0 (all icons
 * are emoji/unicode glyphs rendered via the Inter font; no downloadable assets).
 *
 * @see @/components/editor/FileTabs — `EditorWorkspaceProvider` / `FileTabs` /
 *   `EditorCodeViewport`; the editor's co-located client-state hub and the
 *   server-slot/client-toggle seam.
 * @see @/components/editor/CodeEditor — the async Server Component that runs Shiki.
 * @see @/components/shell/AppShell — strips library chrome on `/editor`.
 * @see src/calibre/gui2/tweak_book/ui.py — Calibre editor window (reference only).
 */

import { editorFiles } from '@/data/editorFiles';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { EditorWorkspaceProvider, FileTabs, EditorCodeViewport } from '@/components/editor/FileTabs';
import { FileTree } from '@/components/editor/FileTree';
import { PreviewPane } from '@/components/editor/PreviewPane';
import { EditorToolbar } from '@/components/editor/EditorToolbar';

/**
 * `EditorPage` — the `/editor` route's Server Component (App 04, Figma `5:2`).
 *
 * Builds the per-file `codeSlots` map of server-rendered `<CodeEditor>` elements
 * (Shiki highlighting runs server-side) and composes the editor screen:
 * `EditorToolbar` → `FileTabs` → the `FileTree | EditorCodeViewport | PreviewPane`
 * content row, all inside the `EditorWorkspaceProvider` so every pane shares one
 * active file. See the file-level doc comment for the full architecture.
 *
 * @returns The composed `/editor` screen body rendered into AppShell's `<main>`.
 */
export default function EditorPage() {
  // Only the openable documents become code slots; the 4 structural folder rows
  // (`kind: 'folder'`) are excluded, yielding the 6 real files.
  const fileEntries = editorFiles.filter((f) => f.kind === 'file');

  // One pre-rendered <CodeEditor> per file, keyed by the file's full path so the
  // key matches EditorWorkspaceProvider's active-file key. Each element is created
  // (not executed) here and resolved server-side; the client EditorCodeViewport
  // shows only the active file's slot — no client-side re-highlighting.
  const codeSlots = Object.fromEntries(
    fileEntries.map((f) => [f.path, <CodeEditor key={f.path} code={f.code} language={f.language} fileName={f.name} />]),
  );

  return (
    <EditorWorkspaceProvider>
      {/*
        Full-height flex COLUMN wrapper: bridges AppShell's block-level <main>
        (definite height) into a definite-height flex column so the fixed-height
        toolbar/tabs and the flex-1 content row stack and fill the screen.
      */}
      <div className="flex h-full min-h-0 flex-col">
        <EditorToolbar />
        <FileTabs />
        <div className="flex min-h-0 flex-1">
          <FileTree />
          <EditorCodeViewport codeSlots={codeSlots} />
          <PreviewPane />
        </div>
      </div>
    </EditorWorkspaceProvider>
  );
}
