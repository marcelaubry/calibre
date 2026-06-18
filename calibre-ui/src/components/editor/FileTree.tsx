'use client';

/**
 * ==========================================================================
 * Calibre-UI — FileTree (App 04 · Figma node `5:53`)
 * The Book/EPUB Editor's OEBPS file tree — left column of the editor body.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `FileTree` is the 200×788 left column (Figma node `5:53`) of the App 04
 * Book/EPUB Editor screen (`5:2`). It lists the EPUB's internal OEBPS files in a
 * folder/file hierarchy, shows each file's size right-aligned, highlights the
 * ACTIVE file with a translucent-purple fill, and lets the user click a file to
 * make it active. The active file drives the center `CodeEditor` view and the
 * right `PreviewPane` — all three panes read the same `activePath` from the
 * shared editor-workspace Context.
 *
 * It is part of the UI-only, mock-data Calibre prototype (Next.js 15 App Router ·
 * React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens). Clicking a
 * file mutates only in-memory active state — there is NO real file I/O, parsing,
 * or persistence.
 *
 * PRESENTATION OVER SHARED STATE
 * --------------------------------------------------------------------------
 * This component owns NO active-file truth. It reads `activePath` and calls
 * `setActiveFile(path)` from `useEditorWorkspace` (the co-located editor Context
 * hub in `FileTabs.tsx`), so it stays in perfect lockstep with `FileTabs`, the
 * code viewport, and the preview pane. Selecting a file here opens its tab and
 * activates it everywhere at once. `setActiveFile` is a no-op for folder/unknown
 * paths, so folders could never become active even if clicked.
 *
 * FLAT-BUT-PRE-ORDERED DATA
 * --------------------------------------------------------------------------
 * `editorFiles` (from `@/data/editorFiles`) is a FLAT array of exactly 10 entries
 * (4 folders + 6 files) already in pre-order — each folder immediately precedes
 * its children. Rendering the array in order with depth-based indentation
 * therefore reproduces the tree hierarchy WITHOUT building a nested structure.
 * Indentation depth = `path.split('/').length - 1`.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * It reads the `useEditorWorkspace` React Context hook and binds `onClick`
 * handlers, so it MUST be a Client Component (App Router components default to
 * Server Components, which can neither consume Context nor attach event
 * handlers). The directive is the very first line, before any import.
 *
 * DESIGN-PARITY REFERENCE (read-only, NEVER imported)
 * --------------------------------------------------------------------------
 * `src/calibre/gui2/tweak_book/file_list.py` — Calibre's editor file browser.
 * Parity insights reproduced VISUALLY (no code reuse): files render with their
 * size right-aligned (`human_readable` + `AlignRight`), long names are elided
 * (`elided_text` → CSS `truncate`), and content is grouped into folders.
 *
 * FIGMA TOKENS (file `JduUzjVHNhZivm5A0pAiCD`, node `5:53` in screen `5:2`)
 * --------------------------------------------------------------------------
 * Every COLOR resolves to an `@theme` token utility — there are NO hex/rgba
 * literals: `bg-surface-2` (#13162E column surface), the right hairline via
 * `border-[var(--border-white-07)]`, `bg-accent/10` + `text-text-primary` (the
 * active row), `text-text-secondary` (inactive rows and folders), and
 * `text-text-muted` (the "Files" header and the size column). Geometry resolves
 * to `@theme` tokens too: the fixed column width via `--size-filetree-w` (200px,
 * consumed as `w-[var(--size-filetree-w)]`), the staircase indent via a `calc()`
 * of `--space-filetree-indent-base` (8px) + depth × `--space-filetree-indent-step`
 * (12px), and the small label type via the `text-meta-label` / `text-meta-value`
 * role utilities. The interactive rows compose the `NavRowButton` primitive (R4),
 * never a raw `<button>`.
 *
 * @see ./FileTabs.tsx — `useEditorWorkspace` Context hub (shared active state).
 * @see ../../data/editorFiles.ts — the mock OEBPS file set rendered here.
 * @see ../../lib/format.ts — `formatFileSize` (shared size formatter).
 * @see ../../types/index.ts — the `EditorFile` contract (`@/types`).
 * @see src/calibre/gui2/tweak_book/file_list.py — Calibre file browser (reference only).
 */

import { type JSX } from 'react';

import type { EditorFile } from '@/types';
import { editorFiles } from '@/data/editorFiles';
import { formatFileSize } from '@/lib/format';
import { useEditorWorkspace } from '@/components/editor/FileTabs';
import { NavRowButton } from '@/components/primitives/NavRowButton';

/**
 * Tree depth of an OEBPS path, used to compute a row's indentation.
 *
 * `"META-INF"` → 0, `"OEBPS/text"` → 1, `"OEBPS/text/chapter-001.xhtml"` → 2.
 * The dataset is pre-ordered, so depth alone (not a nested model) is enough to
 * render the hierarchy correctly.
 */
function depthOf(path: string): number {
  return path.split('/').length - 1;
}

/**
 * Pick a deterministic emoji/unicode glyph for a file by its Shiki language id.
 *
 * Per the AAP, all icons in this prototype are emoji/unicode glyphs rendered as
 * text — there are NO asset files. Stylesheets get the palette glyph; every
 * markup/document file (xml, html, xhtml, opf, ncx) uses the generic document
 * glyph. The mapping is total (always returns a glyph) and deterministic.
 */
function glyphForLanguage(language: string): string {
  return language === 'css' ? '🎨' : '📄';
}

/** Props for a single {@link FileTreeNode} row. */
interface FileTreeNodeProps {
  /** The OEBPS entry (folder or file) rendered by this row. */
  file: EditorFile;
  /** Whether this row is the active file (drives the translucent-purple fill). */
  active: boolean;
  /** Activate a file by its path. Invoked only for file rows (folders are inert). */
  onSelect: (path: string) => void;
}

/**
 * A single indented row in the file tree.
 *
 * Folders are non-interactive (rendered `disabled`) because the prototype's tree
 * is fully expanded and deterministic — only files are clickable. The size
 * column is rendered for files only; folders carry `sizeBytes: 0` and show no
 * size, matching Calibre's file browser where only leaf files display a size.
 * Long names truncate (eliding) so the fixed-width column never overflows.
 */
function FileTreeNode({ file, active, onSelect }: FileTreeNodeProps): JSX.Element {
  const isFolder = file.kind === 'folder';

  // Staircase indent built from tokens (depth 0 → 8px, depth 1 → 20px, depth
  // 2 → 32px): a `calc()` of the base inline-start padding plus the per-depth
  // step, so the geometry lives in `@theme` (`--space-filetree-indent-base` /
  // `--space-filetree-indent-step`) rather than as hardcoded px. `depth` is a
  // unitless multiplier of the step token.
  const depth = depthOf(file.path);
  const paddingInlineStart = `calc(var(--space-filetree-indent-base) + ${depth} * var(--space-filetree-indent-step))`;

  // Compose the shared NavRowButton primitive (R4): it owns the row SEMANTICS —
  // a real, keyboard-operable `<button type="button">`, `aria-current` from
  // `active`, the disabled guard (so a folder row, rendered `disabled`, never
  // fires `onSelect`), the token-backed focus-visible ring, and `w-full
  // text-left cursor-pointer select-none`. This consumer supplies only the
  // per-context LAYOUT/typography/active-fill via `className` plus the indent
  // `style`, so the rendered row stays 1:1 with Figma node `5:53`.
  return (
    <NavRowButton
      active={active}
      disabled={isFolder}
      onClick={() => onSelect(file.path)}
      style={{ paddingInlineStart }}
      className={[
        'flex items-center gap-u8 rounded-control py-u4 pe-u8 text-xs',
        active ? 'bg-accent/10 text-text-primary' : 'text-text-secondary',
        isFolder ? 'font-medium' : 'hover:text-text-primary',
      ].join(' ')}
    >
      <span aria-hidden="true" className="shrink-0">
        {isFolder ? '📁' : glyphForLanguage(file.language)}
      </span>
      <span className="flex-1 truncate" title={file.name}>
        {file.name}
      </span>
      {!isFolder && (
        <span className="shrink-0 text-meta-label text-text-muted">
          {formatFileSize(file.sizeBytes)}
        </span>
      )}
    </NavRowButton>
  );
}

/**
 * The OEBPS file tree column (App 04, Figma `5:53`).
 *
 * Reads the shared editor workspace and renders the flat-but-pre-ordered
 * `editorFiles` array as an indented tree. A row is "active" only when it is a
 * file whose path matches the workspace `activePath`, guaranteeing exactly one
 * highlighted row that always mirrors the open tab and the code/preview panes.
 *
 * Layout: a fixed 200px, non-growing column (`flex-none`) that fills the editor
 * body height and scrolls vertically only. The neighbouring code view absorbs
 * all horizontal width changes from 1440px down to 1280px, so this column —
 * combined with `truncate` on long names — never causes horizontal overflow.
 */
export function FileTree(): JSX.Element {
  const { activePath, setActiveFile } = useEditorWorkspace();

  return (
    <nav
      aria-label="EPUB file tree"
      className="flex h-full w-[var(--size-filetree-w)] min-w-[var(--size-filetree-w)] flex-none flex-col gap-u2 overflow-y-auto border-r border-[var(--border-white-07)] bg-surface-2 p-u8"
    >
      <p className="px-u8 pb-u4 text-meta-value uppercase tracking-wide text-text-muted">
        Files
      </p>
      {editorFiles.map((file) => (
        <FileTreeNode
          key={file.path}
          file={file}
          active={file.kind === 'file' && file.path === activePath}
          onSelect={setActiveFile}
        />
      ))}
    </nav>
  );
}
