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
 * THE CRITICAL CONSOLE-ERROR GUARD (the single most important detail)
 * --------------------------------------------------------------------------
 * The mock chapter files in `@/data/editorFiles` are FULL XHTML documents:
 * each `chapter-00X.xhtml` carries a `<head>` containing
 * `<link rel="stylesheet" type="text/css" href="../styles/stylesheet.css">`
 * (plus `<!DOCTYPE html>`, `<html>`, and `<meta>`). If that raw markup were
 * injected via `dangerouslySetInnerHTML`, the browser would try to FETCH
 * `../styles/stylesheet.css`, 404, and emit a CONSOLE ERROR — violating the
 * AAP "zero console errors" gate (§0.1.2 / §0.9). Therefore this component
 * renders BODY-ONLY inner HTML: {@link extractBodyHtml} returns only what is
 * inside `<body>…</body>` and defensively strips any `<!doctype>`, `<html>`,
 * `<head>…</head>`, `<link>`, `<script>`, and `<meta>` so NO external resource
 * reference can survive into the rendered output. The extraction is a pure
 * string/regex transform (NO `DOMParser`/`document`), so it is SSR-safe and
 * deterministic, and it runs inside `useMemo` keyed on the previewed file.
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
 * @see ../../data/editorFiles.ts — the mock OEBPS files (HTML chapters link an
 *   external stylesheet → the 404 this component guards against).
 * @see ../../types/index.ts — the `EditorFile` contract (`@/types`).
 * @see ./CodeEditor.tsx — the sibling center code view (same screen `5:2`).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see src/calibre/gui2/tweak_book/preview.py — Calibre live preview (reference only).
 * @see Agent Action Plan §0.3 (Figma) / §0.4.5 (zero-hardcoded tokens) / §0.7.4.
 */

import { useMemo, type JSX } from 'react';

import type { EditorFile } from '@/types';
import { useEditorWorkspace } from '@/components/editor/FileTabs';

/**
 * Strip the document scaffolding from a (possibly full) XHTML string and return
 * only the inner `<body>` markup, so NO external resource reference (e.g.
 * `<link rel="stylesheet" href="../styles/stylesheet.css">`) survives into the
 * injected HTML — which would otherwise trigger a 404 fetch and a console
 * error, violating the AAP "zero console errors" gate.
 *
 * Pure string/regex transform (NO `DOMParser`/`document`): SSR-safe and
 * deterministic, so server and client produce identical output and the
 * `/editor` route hydrates without warnings.
 *
 * Algorithm:
 *   1. If a `<body>…</body>` block exists, take its inner markup.
 *   2. Otherwise, fall back to the whole string (defensive — the previewed file
 *      is always an HTML chapter, which has a body).
 *   3. Either way, defensively remove any `<!doctype>`, `<html>`,
 *      `<head>…</head>`, `<link>`, `<script>…</script>`, and `<meta>` so
 *      resource- and head-only tags can never leak into the output.
 *
 * @param code - The raw file contents (a full XHTML chapter, or any markup).
 * @returns The inner body markup, trimmed; `''` for empty input.
 */
function extractBodyHtml(code: string): string {
  if (!code) {
    return '';
  }

  // Prefer the explicit <body>…</body> inner markup when present.
  const bodyMatch = code.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let html = bodyMatch ? bodyMatch[1] : code;

  // Defensively strip doctype / html / head / external-resource / script /
  // meta tags so no external fetch (404) can be triggered by the injected HTML.
  html = html
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<\/?html[^>]*>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<meta[^>]*>/gi, '');

  return html.trim();
}

/**
 * Book-page typography for the injected chapter markup.
 *
 * Tailwind v4's preflight resets headings (`font-size`/`font-weight: inherit`)
 * and clears margins, so the injected `<h1>`/`<p>` would otherwise render flat.
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
  '[&_h1]:mb-6 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:leading-tight ' +
  '[&_h2]:mt-6 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-snug ' +
  '[&_p]:indent-[var(--space-preview-indent)] [&_p:first-of-type]:indent-0 ' +
  '[&_blockquote]:my-4 [&_blockquote]:mx-6 [&_blockquote]:italic';

/**
 * `PreviewPane` — the App 04 EPUB Editor's cream live preview (Figma `5:131`).
 *
 * Reads the active file from {@link useEditorWorkspace}; if it is not an HTML
 * document, falls back to the first HTML chapter so the page is never blank.
 * Renders the active file's BODY-ONLY HTML (see {@link extractBodyHtml}) as a
 * dark-serif, justified reader page on a cream surface.
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

  // Body-only markup (the console-error guard); recomputed only when the
  // previewed file changes.
  const bodyHtml = useMemo(
    () => extractBodyHtml(previewFile?.code ?? ''),
    [previewFile],
  );

  return (
    <section
      aria-label="Live preview"
      className="flex min-w-0 basis-[var(--size-preview-basis)] shrink flex-col overflow-y-auto border-l border-[var(--border-white-07)] bg-preview-cream"
    >
      {bodyHtml ? (
        // Reader page: serif, justified, generous leading + reading-page
        // padding, dark ink token on cream. Body-only markup → no external
        // resources → no 404s. `break-words` + `hyphens-auto` keep the narrow
        // column overflow-safe when it shrinks toward the 1280 minimum.
        <article
          className={`px-10 py-8 font-serif text-justify leading-7 break-words hyphens-auto text-[color:var(--color-bg-app)] ${BOOK_TYPOGRAPHY}`}
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      ) : (
        // Defensive never-blank state (the HTML-chapter fallback makes this
        // essentially unreachable in this dataset). Token ink for guaranteed
        // contrast on the cream surface.
        <div className="grid flex-1 place-items-center px-10 py-8">
          <p className="text-center font-serif text-[color:var(--color-bg-app)]">
            No preview available for this file.
          </p>
        </div>
      )}
    </section>
  );
}
