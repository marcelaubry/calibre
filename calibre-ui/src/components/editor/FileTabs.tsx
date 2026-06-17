'use client';

/**
 * ==========================================================================
 * Calibre-UI — FileTabs + Editor Workspace Context (App 04 · Figma `5:29`)
 * The open-file tab strip AND the single source of editor client state.
 * ==========================================================================
 *
 * WHAT THIS MODULE IS
 * --------------------------------------------------------------------------
 * This is the CENTRAL client-state hub for the App 04 Book/EPUB Editor screen
 * (screen node `5:2`) of the UI-only, mock-data Calibre prototype (Next.js 15
 * App Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first
 * tokens). It exports FOUR runtime symbols + ONE type:
 *
 *   1. `EditorWorkspaceProvider` — a React Context Provider holding the editor's
 *      shared client state: the full OEBPS file list, the open tabs
 *      (`openPaths`), and the ACTIVE file (`activePath`).
 *   2. `useEditorWorkspace`       — the hook consumers read/update state through.
 *   3. `FileTabs`                 — the 1440×36 open-file tab strip (Figma node
 *      `5:29`): one tab per open file, active tab = purple underline. Built ON
 *      the shared `Tabs` primitive (never hand-rolled tab markup).
 *   4. `EditorCodeViewport`       — a client wrapper that receives the page's
 *      pre-rendered, server-highlighted `<CodeEditor>` nodes (a `codeSlots`
 *      map) and renders the ACTIVE file's slot in the center column.
 *   + `EditorWorkspaceValue`      — the exported shape of the context value.
 *
 * WHY A CO-LOCATED "LIGHT" CONTEXT (and not a `@/state` provider)
 * --------------------------------------------------------------------------
 * The four GLOBAL providers composed in `app/layout.tsx` are Library /
 * Preferences / Reader / Modal — there is intentionally NO editor provider in
 * `@/state`. Editor file-selection is screen-local state that only the App 04
 * sub-tree needs, so it lives as a small, co-located context HERE (the AAP
 * `components/editor/*` folder spec permits this). `FileTree.tsx` and
 * `PreviewPane.tsx` (siblings) consume `useEditorWorkspace` from THIS module so
 * the tab strip, the file tree, the code viewport, and the preview pane all
 * share one `activePath`. Keeping it here (rather than inventing a new file)
 * honors the strict editor file scope while giving every editor pane a single
 * source of truth.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * This module owns interactive client state — it calls `useState` and creates a
 * React Context, and `FileTabs` binds an `onSelect` handler. App Router
 * components default to Server Components (which cannot run state hooks or
 * attach event handlers), so the `'use client'` directive is the very first
 * line, before any import.
 *
 * THE SERVER-SLOT / CLIENT-TOGGLE SEAM (the architectural crux)
 * --------------------------------------------------------------------------
 * Shiki syntax highlighting runs ON THE SERVER inside `<CodeEditor>` (an async
 * Server Component), so the browser ships ZERO client highlighting JS. The
 * `/editor` page pre-renders one `<CodeEditor>` per file into a
 * `codeSlots: Record<path, ReactNode>` map (all slots live in the RSC payload)
 * and hands it to `EditorCodeViewport`. Switching files is then purely
 * client-side — `EditorCodeViewport` just shows `codeSlots[activePath]`, with no
 * server round-trip and no client Shiki. `EditorCodeViewport` is the seam
 * between the server-rendered highlight slots and the client-side active toggle.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, node `5:29` in `5:2`)
 * --------------------------------------------------------------------------
 * Reconciled via `analyze_figma_node(5:29)` against the full-screen render of
 * `5:2`. CONFIRMED strip spec → the resolutions baked into `FileTabs` below:
 *   • Strip: full-width 1440 × ~36px (`h-9 w-full`), seated directly under the
 *     editor toolbar and above the 3-column content row.
 *   • Background: the strip carries its OWN surface fill `#13162E` (surface-2)
 *     — distinct from the toolbar (`#10132A`) and the content row (`#0A0B18`).
 *     The `FileTabs` wrapper therefore sets `bg-surface-2`.
 *   • Bottom hairline: `#21243A` ≈ white@7% over surface-2 = the
 *     `--border-white-07` token — which is EXACTLY the hairline the shared
 *     `Tabs` primitive already draws on its tablist. It is rendered ONCE, by the
 *     primitive; the wrapper deliberately does NOT add its own `border-b` (that
 *     would DOUBLE the hairline). The Tabs tablist is a block-level flex row, so
 *     its bottom border already spans the full strip width.
 *   • Open tabs: the resting frame shows `content.opf` (ACTIVE, leftmost) plus
 *     four more files. `EditorWorkspaceProvider` seeds exactly this set/order
 *     (mapped onto the real `editorFiles` paths) with `content.opf` active.
 *   • Active indicator: purple underline + bright label — both rendered by the
 *     `Tabs` primitive (active = `text-text-primary` + `border-b-2
 *     border-[var(--color-accent)]`; inactive = `text-text-muted`).
 *
 * BLITZY [COMPONENT] / [A11Y] — flagged Figma deltas NOT expressible here
 * --------------------------------------------------------------------------
 * The shared `Tabs` primitive's public contract is a `string[]` of labels; it
 * deliberately normalizes the Editor and Convert tab strips into ONE canonical
 * style. The following CONFIRMED Figma `5:29` details are therefore NOT
 * rendered by this screen component, because expressing them would require
 * either raw per-tab markup (forbidden — the strip MUST compose the primitive,
 * never hand-rolled `<button>`/`<div>` tabs) or editing the `Tabs` primitive
 * (out of scope here, and it would regress the Convert-dialog option tabs that
 * share it). They are flagged for the primitive owner; the shared fidelity beat
 * (purple underline + muted→primary label contrast + surface + hairline) is
 * preserved exactly:
 *   • per-tab close "×" affordance (`#3A4060`) — not rendered (no primitive
 *     slot). NOTE: the workspace API still exposes `closeFile`, consumed
 *     programmatically and by future close affordances.
 *   • active-tab cell fill `#10132A` (surface-1) — not rendered (the primitive
 *     signals "active" via the underline + `#F1F5FF` label, the AAP-normalized
 *     beat).
 *   • contiguous tabs / 16px left pad vs the primitive's 4px gap + 10px pad;
 *     and the flat `#7B61FF` underline vs the Figma `#7B61FF→#A78BFA` gradient
 *     (the primitive's own documented BLITZY [COLOR] reconciliation).
 *   • tab LABEL text comes from each file's `name` in the `@/data/editorFiles`
 *     DATA module (e.g. `chapter-001.xhtml`), which the Figma mock abbreviates
 *     (`ch01.html`); the data module is a dependency, not editable here.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR value resolves to an `@theme` token utility: `bg-surface-2`
 * (strip surface), `bg-code-bg` (code column surface), `text-text-muted`
 * (empty-state text), plus the accent underline + hairline supplied by the
 * `Tabs` primitive (`--color-accent`, `--border-white-07`). There are NO raw
 * hex/rgba color literals in this file. The only bare literals are LAYOUT /
 * geometry utilities that carry no color information (`flex`, `h-9` ≈ 36px,
 * `w-full`, `flex-none`, `items-stretch`, `overflow-x-auto`, `min-w-full`,
 * `min-w-0`, `flex-1`, `flex-col`, `items-center`, `justify-center`,
 * `text-sm`).
 *
 * DETERMINISTIC, SSR/HYDRATION-SAFE STATE (AAP hard constraint)
 * --------------------------------------------------------------------------
 * The Provider's initial `openPaths` / `activePath` are derived purely from the
 * STATIC `editorFiles` import — NO `Math.random`, NO `Date.now`, NO `window`.
 * The server and client therefore compute byte-identical initial state, so the
 * `/editor` route hydrates with zero console warnings.
 *
 * UI-ONLY / MOCK
 * --------------------------------------------------------------------------
 * No file I/O of any kind — "open / close / switch" only mutate in-memory React
 * state. Nothing is read from or written to disk.
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * --------------------------------------------------------------------------
 * The open-editors / current-editor model parallels Calibre's desktop editor
 * (`src/calibre/gui2/tweak_book/boss.py` — `edit_file` / `close_editor`; and
 * `ui.py`'s `Central` `QTabWidget`: add-tab-by-name, set-current, remove-tab →
 * fall back to a neighbor when emptied). NO Python/Qt code is imported,
 * translated, or executed — only the conceptual structure is reproduced.
 *
 * @see ../primitives/Tabs.tsx — the shared tab-strip primitive (`Tabs`).
 * @see ../../data/editorFiles.ts — the mock OEBPS file set seeding this state.
 * @see ../../types/index.ts — the `EditorFile` contract (`@/types`).
 * @see ./CodeEditor.tsx — the server component whose nodes fill `codeSlots`.
 * @see src/calibre/gui2/tweak_book/boss.py — Calibre editor boss (reference only).
 * @see src/calibre/gui2/tweak_book/ui.py — Calibre editor window (reference only).
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
} from 'react';

import type { EditorFile } from '@/types';
import { editorFiles } from '@/data/editorFiles';
import { Tabs } from '@/components/primitives/Tabs';

/**
 * The shape of the editor-workspace context value — the shared client state of
 * the App 04 editor screen, exposed to every editor pane through
 * {@link useEditorWorkspace}.
 */
export interface EditorWorkspaceValue {
  /** All entries (folders + files) from the OEBPS tree, in declaration order. */
  files: EditorFile[];
  /** File-kind entries only (`kind === 'file'`) — the openable documents. */
  fileEntries: EditorFile[];
  /** Paths of the files currently open as tabs, in tab order (left → right). */
  openPaths: string[];
  /**
   * Path of the active file — the one shown in the code viewport and the
   * preview pane — or `null` when no file is open.
   */
  activePath: string | null;
  /** The active {@link EditorFile} object (derived from `activePath`), or `null`. */
  activeFile: EditorFile | null;
  /**
   * Open (if not already open) AND activate a file by its path. Folder paths
   * and unknown paths are ignored (no-op), so callers may pass any tree node.
   */
  setActiveFile: (path: string) => void;
  /**
   * Close a tab by its path. If the closed tab was active, the right-most
   * remaining tab becomes active; closing the last tab sets `activePath` to
   * `null`.
   */
  closeFile: (path: string) => void;
}

/**
 * The editor-workspace React Context. `null` is the "no provider" sentinel that
 * {@link useEditorWorkspace} guards against — it is never a valid value when a
 * provider is mounted.
 */
const EditorWorkspaceContext = createContext<EditorWorkspaceValue | null>(null);

/**
 * The deterministic, Figma-`5:29`-matched set of files open at first render,
 * in left→right tab order. The resting Editor frame shows `content.opf` active
 * and leftmost, followed by the two chapters, the stylesheet, and the NCX —
 * mapped here onto the real `@/data/editorFiles` paths. Any path not present in
 * the dataset is filtered out at runtime, and an empty result falls back to the
 * first few file entries, so the strip is always populated and SSR-stable.
 */
const PREFERRED_OPEN_PATHS: readonly string[] = [
  'OEBPS/content.opf',
  'OEBPS/text/chapter-001.xhtml',
  'OEBPS/text/chapter-002.xhtml',
  'OEBPS/styles/stylesheet.css',
  'OEBPS/toc.ncx',
];

/**
 * How many file entries to open as a fallback when none of
 * {@link PREFERRED_OPEN_PATHS} resolve against the dataset (mirrors the Figma
 * resting frame's five open tabs).
 */
const FALLBACK_OPEN_COUNT = 5;

/**
 * `EditorWorkspaceProvider` — owns and supplies the editor's shared client
 * state (file list, open tabs, active file) to its descendant editor panes.
 *
 * Initial `openPaths` / `activePath` are derived deterministically from the
 * static `editorFiles` import (no randomness, no time, no `window`), so the
 * server and client render identical initial state and the `/editor` route
 * hydrates cleanly.
 *
 * @param props.children - The editor sub-tree (toolbar, tabs, tree, viewport,
 *   preview) that consumes the workspace via {@link useEditorWorkspace}.
 * @returns The provider element wrapping `children`.
 */
export function EditorWorkspaceProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  // The full, static OEBPS node list (stable module reference → stable memos).
  const files = editorFiles;

  // Only the openable documents (folders are structural-only and never tabbed).
  const fileEntries = useMemo(
    () => files.filter((f) => f.kind === 'file'),
    [files],
  );

  // Deterministic initial open tabs: the Figma-ordered preferred paths that
  // actually exist in the dataset, else the first few file entries. No random
  // / time inputs → byte-identical on server and client (hydration-safe).
  const initialOpen = useMemo(() => {
    const preferred = PREFERRED_OPEN_PATHS.filter((p) =>
      fileEntries.some((f) => f.path === p),
    );
    return preferred.length > 0
      ? [...preferred]
      : fileEntries.slice(0, FALLBACK_OPEN_COUNT).map((f) => f.path);
  }, [fileEntries]);

  const [openPaths, setOpenPaths] = useState<string[]>(initialOpen);
  const [activePath, setActivePath] = useState<string | null>(
    initialOpen[0] ?? fileEntries[0]?.path ?? null,
  );

  // Open (if needed) AND activate a file by path. Folders / unknown paths are
  // ignored so the tree can pass any node without guarding first.
  const setActiveFile = useCallback(
    (path: string) => {
      const target = fileEntries.find((f) => f.path === path);
      if (!target) {
        return; // ignore folders / unknown paths
      }
      setOpenPaths((prev) => (prev.includes(path) ? prev : [...prev, path]));
      setActivePath(path);
    },
    [fileEntries],
  );

  // Close a tab by path; if it was the active tab, activate the right-most
  // remaining tab (or `null` when the last tab is closed).
  const closeFile = useCallback((path: string) => {
    setOpenPaths((prev) => {
      const next = prev.filter((p) => p !== path);
      setActivePath((cur) =>
        cur === path ? (next[next.length - 1] ?? null) : cur,
      );
      return next;
    });
  }, []);

  // The active EditorFile object, derived from `activePath` (or null).
  const activeFile = useMemo(
    () => fileEntries.find((f) => f.path === activePath) ?? null,
    [fileEntries, activePath],
  );

  // Single memoized value object so consumers only re-render on real changes.
  const value = useMemo<EditorWorkspaceValue>(
    () => ({
      files,
      fileEntries,
      openPaths,
      activePath,
      activeFile,
      setActiveFile,
      closeFile,
    }),
    [
      files,
      fileEntries,
      openPaths,
      activePath,
      activeFile,
      setActiveFile,
      closeFile,
    ],
  );

  return (
    <EditorWorkspaceContext.Provider value={value}>
      {children}
    </EditorWorkspaceContext.Provider>
  );
}

/**
 * `useEditorWorkspace` — read/update the editor workspace from any descendant
 * of an {@link EditorWorkspaceProvider}.
 *
 * @throws {Error} If called outside an `EditorWorkspaceProvider` (the context
 *   is `null`), to fail fast with a clear message instead of crashing on a
 *   missing value later.
 * @returns The current {@link EditorWorkspaceValue}.
 */
export function useEditorWorkspace(): EditorWorkspaceValue {
  const ctx = useContext(EditorWorkspaceContext);
  if (ctx === null) {
    throw new Error(
      'useEditorWorkspace must be used within an EditorWorkspaceProvider',
    );
  }
  return ctx;
}

/**
 * `FileTabs` — the App 04 open-file tab strip (Figma node `5:29`, 1440×36).
 *
 * Renders one tab per OPEN file by composing the shared `Tabs` primitive (never
 * hand-rolled tab markup): the primitive draws the active purple underline, the
 * muted→primary label contrast, and the white@7% bottom hairline. This wrapper
 * adds only the Figma-confirmed surface (`bg-surface-2`), the 36px height
 * (`h-9`), full width (`w-full`), and horizontal-scroll safety
 * (`overflow-x-auto`) so the page never overflows down to 1280px even if many
 * files are open.
 *
 * Tab identity is the file `path` (stable), but the tab LABEL is the file
 * `name`; the `@/data/editorFiles` names are unique, so label↔path mapping is
 * unambiguous. Selecting a tab activates its file via `setActiveFile(path)`.
 *
 * The wrapper intentionally carries NO `border-b`: the bottom hairline is
 * supplied once by the `Tabs` primitive's tablist (a block-level flex row whose
 * border spans the full strip width). Adding a wrapper border would double it.
 * See the file header's BLITZY [COMPONENT] notes for the close-"×" /
 * active-cell-fill / gap / gradient deltas that the shared primitive normalizes
 * away.
 *
 * @returns The rendered tab strip.
 */
export function FileTabs(): JSX.Element {
  const { openPaths, fileEntries, activeFile, setActiveFile } =
    useEditorWorkspace();

  // Resolve open paths to their EditorFile objects (drop any that no longer
  // exist), preserving tab order. The type guard narrows away `undefined`.
  const openFiles = openPaths
    .map((p) => fileEntries.find((f) => f.path === p))
    .filter((f): f is EditorFile => Boolean(f));

  // The primitive is label-driven; file names are unique, so the label is the
  // file name and we map the selected label back to its path.
  const tabLabels = openFiles.map((f) => f.name);

  const handleSelect = (label: string): void => {
    const file = openFiles.find((f) => f.name === label);
    if (file) {
      setActiveFile(file.path);
    }
  };

  return (
    <div className="flex h-9 w-full flex-none items-stretch overflow-x-auto bg-surface-2">
      <Tabs
        tabs={tabLabels}
        active={activeFile?.name ?? tabLabels[0] ?? ''}
        onSelect={handleSelect}
        className="min-w-full"
      />
    </div>
  );
}

/**
 * `EditorCodeViewport` — the center "code view" column of the App 04 editor.
 *
 * The `/editor` page pre-renders one server-highlighted `<CodeEditor>` per file
 * (Shiki runs on the server) into a `codeSlots: Record<path, ReactNode>` map and
 * passes it here. This client component simply shows the slot for the ACTIVE
 * file — so switching files is instant and client-only (every slot is already
 * in the RSC payload; no server round-trip, no client Shiki). It is the seam
 * between the server-rendered highlight slots and the client active toggle.
 *
 * Layout: `flex-1 min-w-0` makes the column take the remaining width and shrink
 * cleanly at 1280px (the `<CodeEditor>` inside scrolls long lines horizontally);
 * `bg-code-bg` (`#0A0B18`) matches the Figma code surface. When no file is
 * active, a token-styled empty state is shown.
 *
 * @param props.codeSlots - Map of file path → pre-rendered `<CodeEditor>` node.
 * @returns The active file's code slot, or a token-styled empty state.
 */
export function EditorCodeViewport({
  codeSlots,
}: {
  codeSlots: Record<string, ReactNode>;
}): JSX.Element {
  const { activePath } = useEditorWorkspace();
  const slot = activePath ? codeSlots[activePath] : null;

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-code-bg">
      {slot ?? (
        <div className="flex flex-1 items-center justify-center text-text-muted text-sm">
          Select a file to view its source
        </div>
      )}
    </div>
  );
}

/**
 * INTEGRATION CONTRACT for the `/editor` page (composed by the app/page agent).
 * --------------------------------------------------------------------------
 * The page is an `async` Server Component: it pre-renders one server
 * `<CodeEditor>` per file into a `codeSlots` map (Shiki runs server-side) and
 * passes that map to the client `<EditorCodeViewport>`. `FileTabs`, `FileTree`,
 * and `PreviewPane` all read the shared active file from `useEditorWorkspace`,
 * so they must render INSIDE the `<EditorWorkspaceProvider>`.
 *
 * ```tsx
 * // app/editor/page.tsx (async server component, app agent)
 * import { editorFiles } from '@/data/editorFiles';
 * import { CodeEditor } from '@/components/editor/CodeEditor';
 * import {
 *   EditorWorkspaceProvider,
 *   FileTabs,
 *   EditorCodeViewport,
 * } from '@/components/editor/FileTabs';
 * import { FileTree } from '@/components/editor/FileTree';
 * import { PreviewPane } from '@/components/editor/PreviewPane';
 * import { EditorToolbar } from '@/components/editor/EditorToolbar';
 *
 * export default function EditorPage() {
 *   const fileEntries = editorFiles.filter((f) => f.kind === 'file');
 *   const codeSlots = Object.fromEntries(
 *     fileEntries.map((f) => [
 *       f.path,
 *       <CodeEditor key={f.path} code={f.code} language={f.language} fileName={f.name} />,
 *     ]),
 *   );
 *   return (
 *     <EditorWorkspaceProvider>
 *       <EditorToolbar />
 *       <FileTabs />
 *       <div className="flex min-h-0 flex-1">
 *         <FileTree />
 *         <EditorCodeViewport codeSlots={codeSlots} />
 *         <PreviewPane />
 *       </div>
 *     </EditorWorkspaceProvider>
 *   );
 * }
 * ```
 */

