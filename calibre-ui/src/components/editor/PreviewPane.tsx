'use client';

/**
 * ==========================================================================
 * Calibre-UI — PreviewPane (App 04 · Figma node `5:131`)
 * The Book/EPUB Editor's cream "live preview" — right column of screen `5:2`.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `PreviewPane` is the RIGHT column of the App 04 Book/EPUB Editor screen
 * (`5:2`) — the 504×788 CREAM live preview (Figma node `5:131`, background
 * `#F5F0E8` = `--color-preview-cream`). It renders the ACTIVE editor file's
 * rendered HTML the way it would appear in a reader: dark serif, justified
 * body text on a warm cream page. Part of the UI-only, mock-data Calibre
 * prototype (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind
 * CSS v4 CSS-first tokens).
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The pane reads the shared editor state (`useEditorWorkspace`) to learn which
 * file is active and calls the `useMemo` hook. App Router components default to
 * Server Components (which cannot run state hooks or read client Context), so
 * the `'use client'` directive is the very first line, before any import.
 *
 * SHARED-STATE CONSUMPTION (single source of truth — no duplicated state)
 * --------------------------------------------------------------------------
 * The active file is owned by `EditorWorkspaceProvider` in
 * `@/components/editor/FileTabs`. This pane does NOT duplicate that state — it
 * subscribes via `useEditorWorkspace()` and reads `activeFile` (plus
 * `fileEntries` for the fallback). So the tab strip, the file tree, the code
 * viewport, and this preview always agree on the active file, in lockstep, at
 * zero extra state cost.
 *
 * STRUCTURED RENDERING (NO raw-HTML injection, NO console errors)
 * --------------------------------------------------------------------------
 * The mock chapter files in `@/data/editorFiles` are FULL XHTML documents whose
 * `code` (shown verbatim in the Shiki code view) carries a `<head>` with
 * `<link rel="stylesheet" type="text/css" href="../styles/stylesheet.css">`
 * (plus `<!DOCTYPE html>`, `<html>`, and `<meta>`). If that raw markup were
 * injected via `dangerouslySetInnerHTML`, the browser would try to FETCH
 * `../styles/stylesheet.css`, 404, and emit a CONSOLE ERROR — and the injection
 * itself would be an unsanctioned raw-HTML sink. This pane therefore does NOT
 * inject HTML at all. Instead it renders the file's STRUCTURED `previewBlocks`
 * (a heading + paragraphs authored alongside the `code` in `@/data/editorFiles`)
 * as REAL React `<h1>`/`<p>` elements. With no `<head>`, `<link>`, `<script>`,
 * or `<meta>` ever present in the output and no `dangerouslySetInnerHTML`
 * anywhere, there is no external resource to fetch (no 404), nothing to
 * sanitize, and the AAP "zero console errors" gate (§0.1.2 / §0.9) holds by
 * construction. (The ONLY sanctioned raw-HTML sink in the app is the
 * Shiki-rendered `CodeEditor`.)
 *
 * ACTIVE-FILE SELECTION + FALLBACK (never blank — AAP data-bound integrity)
 * --------------------------------------------------------------------------
 * The active file may be a non-HTML document (`.css`/`.xml`/`.opf`/`.ncx`) or
 * `null`. The cream page must ALWAYS show readable content, so when the active
 * file is not HTML the pane falls back to the FIRST HTML chapter in the file
 * list. The preview therefore never renders blank.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, node `5:131` in `5:2`)
 * --------------------------------------------------------------------------
 * Spec reconciled from AAP §0.3.1 / §0.3.2 / §0.7.4 (the authoritative design
 * record, which takes precedence over subagent output) and the EPUB's own mock
 * `stylesheet.css` (which defines the intended book typography):
 *   • Pane → 504×788, cream `#F5F0E8` → the `bg-preview-cream` utility. Rendered
 *     responsive: `flex min-w-0 basis-[var(--size-preview-basis)] shrink …
 *     overflow-y-auto` so it honors the 504px `--size-preview-basis` token width
 *     at the 1440 baseline yet shrinks cleanly to the 1280 minimum
 *     with ZERO horizontal overflow (the center code view + this pane share the
 *     residual width); vertical scroll is internal.
 *   • Left divider (vs the center code view) → `border-l
 *     border-[var(--border-white-07)]`.
 *   • No in-pane "Preview" header: the AAP lists the pane only as a "504px cream
 *     preview"; the Preview affordance lives in the editor toolbar (a sibling),
 *     not inside this pane. The pane's accessible name is supplied by
 *     `aria-label` (invisible a11y — never conflicts with the design).
 *   • Body → serif, justified, generous line-height + reading-page padding;
 *     paragraphs use the book convention of a 1.2em first-line indent with the
 *     first paragraph un-indented (mirrors the mock `stylesheet.css`).
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR resolves to an `@theme` token: `bg-preview-cream` (page surface),
 * `border-[var(--border-white-07)]` (left divider), and the body INK
 * `text-[color:var(--color-bg-app)]` (`#0C0E1A`). The cream page deliberately
 * renders DARK-on-cream — an intentional exception to the dark dashboard theme
 * — but the ink still resolves to an EXISTING token (`--color-bg-app`); no new
 * hex is introduced. The two design-specific geometry values resolve to `@theme`
 * tokens: the pane width via `--size-preview-basis` (504px, consumed as
 * `basis-[var(--size-preview-basis)]`) and the paragraph first-line indent via
 * `--space-preview-indent` (1.2em, consumed as
 * `indent-[var(--space-preview-indent)]`). Every other class is a Tailwind
 * standard-scale typography/geometry utility (`font-serif`, `text-justify`,
 * `leading-7`, `break-words`, `hyphens-auto`, `px-10`, `py-8`, `text-2xl`,
 * `font-bold`, …) — these carry no color information and are explicitly
 * permitted. The only bare literal is `0` (`indent-0`), which is allowed.
 *
 * UI-ONLY / MOCK
 * --------------------------------------------------------------------------
 * Static render only — no scripts run, no navigation, no resource fetches, and
 * no real EPUB rendering engine. The pane reflects in-memory mock state only.
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * --------------------------------------------------------------------------
 * The live-preview concept mirrors Calibre's desktop editor preview
 * (`src/calibre/gui2/tweak_book/preview.py` — a `QWebEngineView` that renders
 * the current file's HTML and keeps it in sync with the editor). NO Python/Qt
 * code is imported, translated, or executed — only the VISUAL result (a static,
 * book-page-styled render of the active chapter) is reproduced. There is no
 * real webview, no EPUB parsing, and no file I/O.
 *
 * @see ./FileTabs.tsx — `useEditorWorkspace` (the shared editor-state hook).
 * @see ../../data/editorFiles.ts — the mock OEBPS files; HTML chapters carry the
 *   structured `previewBlocks` this pane renders (and `code` for the code view).
 * @see ../../types/index.ts — the `EditorFile` contract (`@/types`).
 * @see ./CodeEditor.tsx — the sibling center code view (same screen `5:2`).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see src/calibre/gui2/tweak_book/preview.py — Calibre live preview (reference only).
 * @see Agent Action Plan §0.3 (Figma) / §0.4.5 (zero-hardcoded tokens) / §0.7.4.
 */

import { useMemo, type JSX } from 'react';

import type { EditorFile, PreviewBlock } from '@/types';
import { useEditorWorkspace } from '@/components/editor/FileTabs';

/**
 * Render a single structured {@link PreviewBlock} as the matching React element.
 *
 * The cream page renders STRUCTURED content (not raw HTML), so each block maps
 * to a real element by its `type`: `h1`/`h2` headings, a `blockquote`, or — for
 * `p` and defensively any other value — a paragraph. The book-page typography
 * (size, weight, first-line indent, etc.) is applied by {@link BOOK_TYPOGRAPHY}
 * on the wrapping `<article>` via child-combinator variants, so these elements
 * stay style-free here.
 *
 * The `previewBlocks` list is static mock data that never reorders, so the
 * array index is a stable React key.
 *
 * @param block - The structured block to render.
 * @param index - The block's position in the list (used as a stable key).
 * @returns The rendered heading, paragraph, or blockquote element.
 */
function renderPreviewBlock(block: PreviewBlock, index: number): JSX.Element {
  switch (block.type) {
    case 'h1':
      return <h1 key={index}>{block.text}</h1>;
    case 'h2':
      return <h2 key={index}>{block.text}</h2>;
    case 'blockquote':
      return <blockquote key={index}>{block.text}</blockquote>;
    case 'p':
    default:
      return <p key={index}>{block.text}</p>;
  }
}

/**
 * Book-page typography for the rendered preview blocks.
 *
 * Tailwind v4's preflight resets headings (`font-size`/`font-weight: inherit`)
 * and clears margins, so the rendered `<h1>`/`<p>` would otherwise render flat.
 * These arbitrary child-combinator variants restore a reader-page hierarchy
 * using only typography/geometry SCALE utilities (no color literals):
 *   • `h1`         → larger, bold, tight leading, with space beneath.
 *   • `h2`         → defensive smaller heading for content variance.
 *   • `p`          → 1.2em first-line indent (the book convention from the mock
 *                    `stylesheet.css`); the FIRST paragraph is un-indented.
 *   • `blockquote` → italic, inset (mirrors the mock stylesheet).
 *
 * The body INK and the serif family are set on the `<article>` itself and
 * inherit into every child, so these variants stay color-free and token-clean.
 */
const BOOK_TYPOGRAPHY =
  '[&_h1]:mb-u24 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:leading-tight ' +
  '[&_h2]:mt-u24 [&_h2]:mb-u16 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-snug ' +
  '[&_p]:indent-[var(--space-preview-indent)] [&_p:first-of-type]:indent-0 ' +
  '[&_blockquote]:my-u16 [&_blockquote]:mx-u24 [&_blockquote]:italic';

/**
 * `PreviewPane` — the App 04 EPUB Editor's cream live preview (Figma `5:131`).
 *
 * Reads the active file from {@link useEditorWorkspace}; if it is not an HTML
 * document, falls back to the first HTML chapter so the page is never blank.
 * Renders that file's structured `previewBlocks` as REAL React headings and
 * paragraphs (see {@link renderPreviewBlock}) — NO raw-HTML injection — on a
 * dark-serif, justified cream page.
 *
 * Switching the active file (via the tab strip or the file tree) updates the
 * preview automatically, because all editor panes read the same shared state.
 *
 * @returns The rendered cream preview column.
 */
export function PreviewPane(): JSX.Element {
  const { activeFile, fileEntries } = useEditorWorkspace();

  // Show the active file when it is HTML; otherwise fall back to the first HTML
  // chapter so the cream page always shows readable content (never blank).
  const previewFile = useMemo<EditorFile | null>(() => {
    if (activeFile && activeFile.language === 'html') {
      return activeFile;
    }
    return fileEntries.find((f) => f.language === 'html') ?? null;
  }, [activeFile, fileEntries]);

  // The structured preview content for the previewed file (heading +
  // paragraphs). HTML chapters always carry `previewBlocks`; the `?? []` keeps
  // the render total and drives the never-blank fallback below.
  const blocks = previewFile?.previewBlocks ?? [];

  return (
    <section
      aria-label="Live preview"
      className="flex min-w-0 basis-[var(--size-preview-basis)] shrink flex-col overflow-y-auto border-l border-[var(--border-white-07)] bg-preview-cream"
    >
      {blocks.length > 0 ? (
        // Reader page: serif, justified, generous leading + reading-page
        // padding, dark ink token on cream. Rendered from structured
        // `previewBlocks` as REAL React elements → no raw HTML, no external
        // resources, no 404s. `break-words` + `hyphens-auto` keep the narrow
        // column overflow-safe when it shrinks toward the 1280 minimum.
        <article
          className={`px-u40 py-u32 font-serif text-justify leading-7 break-words hyphens-auto text-[color:var(--color-bg-app)] ${BOOK_TYPOGRAPHY}`}
        >
          {blocks.map(renderPreviewBlock)}
        </article>
      ) : (
        // Defensive never-blank state (the HTML-chapter fallback makes this
        // essentially unreachable in this dataset). Token ink for guaranteed
        // contrast on the cream surface.
        <div className="grid flex-1 place-items-center px-u40 py-u32">
          <p className="text-center font-serif text-[color:var(--color-bg-app)]">
            No preview available for this file.
          </p>
        </div>
      )}
    </section>
  );
}
