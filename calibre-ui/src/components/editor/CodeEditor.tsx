/**
 * ==========================================================================
 * Calibre-UI — CodeEditor (App 04 · Figma node `5:74`)
 * The Book/EPUB Editor's syntax-highlighted code view.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `CodeEditor` is the center "code view" panel of the App 04 Book/EPUB Editor
 * screen (`5:2`) — the 736×788 region (Figma node `5:74`, background
 * `#0A0B18`) that renders the currently-open OEBPS file as a left
 * line-number GUTTER alongside a Shiki-syntax-highlighted XML/HTML/CSS code
 * panel, with a single amber "Check Book" VALIDATION NOTICE pinned at the
 * bottom-left. It is part of the UI-only, mock-data Calibre prototype
 * (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind CSS v4
 * CSS-first tokens).
 *
 * WHY THIS IS A SERVER COMPONENT (NO `'use client'` — load-bearing)
 * --------------------------------------------------------------------------
 * This file carries NO `'use client'` directive: it is an `async` Server
 * Component. It calls `@/lib/highlight`'s `codeToHtml` ON THE SERVER, so the
 * heavy Shiki regex engine + grammars + theme run at render time and the
 * browser receives only the finished, self-contained
 * `<pre class="shiki">…</pre>` HTML — Shiki ships ZERO client JavaScript. That
 * is an explicit AAP performance / console-cleanliness gate (§0.1.3 / §0.5.2):
 * the App 04 code view costs nothing on the client and stays console-clean.
 * Consequently this component uses NO React hooks, NO event handlers, and NO
 * `window`/`document`; it reads NO client Context. It receives `code` +
 * `language` purely as PROPS and is therefore trivially cacheable/streamable.
 *
 * WHAT THIS RENDERS vs WHAT SHIKI RENDERS
 * --------------------------------------------------------------------------
 * This component owns ONLY the CONTAINER + GUTTER + NOTICE (all token-styled).
 * The COLORED CODE is produced entirely by Shiki via the shared singleton in
 * `@/lib/highlight`: `codeToHtml` returns a complete `<pre class="shiki"
 * style="background-color:#0A0B18;color:#F1F5FF…"><code><span class="line">…
 * </span></code></pre>` string whose per-token spans already carry INLINE
 * color styles (tag `#A78BFA`, attr `#38BDF8`, string `#FBBF24`, value
 * `#4ADE80`, comment `#64748B`). Those inline token colors arrive inside the
 * injected HTML — this file does NOT, and must NOT, re-color syntax tokens.
 * The highlighted HTML is injected via `dangerouslySetInnerHTML`, which is the
 * intended, designed consumption path for `@/lib/highlight`'s output.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, node `5:74` in `5:2`)
 * --------------------------------------------------------------------------
 * Reconciled via `analyze_figma_node(5:74)` against the full-screen render of
 * `5:2`. All applied color/border values resolve to named `@theme` tokens:
 *   • Panel `5:74` → 736×~787 at (200,113); fill `#0A0B18` → the `bg-code-bg`
 *     utility (token `--color-code-bg`). No panel radius, no panel border.
 *   • HEADER STRIP → ABSENT inside the panel. The open file's name lives in the
 *     separate File-Tabs strip ABOVE (a sibling, not a child of `5:74`), so this
 *     component renders NO header. `fileName` is surfaced only as the panel's
 *     accessible name (invisible a11y — never conflicts with the design).
 *   • GUTTER → ~40px, line numbers RIGHT-aligned, text `--color-text-muted`
 *     (`text-text-muted`). Figma delineates the gutter with a barely-perceptible
 *     lighter fill (`#0C0D1E`); there is NO design token for that near-identical
 *     shade and the implementation contract mandates a single `bg-code-bg`
 *     surface, so the gutter shares `bg-code-bg` and is separated instead by a
 *     token-compliant `border-[var(--border-white-07)]` hairline (the contract's
 *     prescribed divider) — the closest token-faithful rendering of the subtle
 *     boundary.
 *   • CODE → monospace, `bg-code-bg`; colors injected by Shiki (see above). The
 *     Figma mock colors each whole LINE one solid color (a designer shortcut);
 *     per AAP §0.3.3 / §0.7.4 (which mandate real syntax highlighting) this view
 *     uses Shiki's per-TOKEN coloring with the same palette — an intended,
 *     architecturally-correct divergence from the stylized mock.
 *   • NOTICE → pinned BOTTOM-LEFT, amber `--color-star` (`text-star`), with the
 *     ⚠ warning glyph. Per the CONFIRMED Figma it has NO border and NO background
 *     (it sits directly on the code surface), and its default wording is the
 *     verbatim "Missing attribute: xmlns:opf".
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color resolves to an `@theme` token: `bg-code-bg` (panel surface),
 * `text-text-muted` (gutter numbers), `text-star` (amber notice), and
 * `border-[var(--border-white-07)]` (gutter hairline). There is NO hex/rgba
 * color literal and NO inline color `style` anywhere in this file. The
 * code/gutter row pitch (line-height) is the named `--size-editor-line-h` token
 * (26px), consumed via `leading-[var(--size-editor-line-h)]`. The only remaining
 * bare literals are Tailwind's standard-scale layout utilities (`flex`,
 * `text-sm`, `text-xs`, `p-4`, `pl-12`, …) and permitted keywords
 * (`transparent`). The panel width is
 * NOT fixed to `w-[736px]`: it is `h-full w-full min-w-0` and the page layout
 * allocates the 1440-baseline 736px column, so the panel degrades cleanly to the
 * 1280px minimum (the page shrinks the column; this panel scrolls internally).
 *
 * GUTTER / LINE ALIGNMENT (the most common defect — guarded here)
 * --------------------------------------------------------------------------
 * Row-for-row alignment is governed by LINE-HEIGHT, not font-size: the gutter
 * and the code share an IDENTICAL `leading-[var(--size-editor-line-h)]` row
 * pitch and `py-4` top inset, so number N lines up with code line N even though
 * the gutter numerals
 * are intentionally smaller (`text-xs`/12px) than the code (`text-sm`/14px) —
 * see the BLITZY [FIGMA] note below. Shiki's `<pre class="shiki">` carries its
 * own UA margin, padding, background, and the `monospace`-keyword font-size
 * quirk, so the code-area wrapper normalizes it with arbitrary variants —
 * `[&_pre.shiki]` margin/padding → 0, background → transparent (revealing the
 * single `bg-code-bg` surface), and font/size/leading forced to the code
 * metrics — guaranteeing each `.line` is exactly one
 * `leading-[var(--size-editor-line-h)]` (26px) row that coincides with its
 * gutter number.
 *
 * BLITZY [FIGMA]: `analyze_figma_node(5:74)` + `compare_screenshot_with_figma`
 * (screen `5:2`) measured the code/gutter row pitch at 26px (not 24px) and the
 * gutter numerals ~1–3px smaller than the code. Per the CRITICAL Figma-precedence
 * directive these measured values override the implementation guidance's
 * `leading-6`/equal-size suggestion, so the row pitch is encoded as the
 * `--size-editor-line-h` token (26px) and consumed via
 * `leading-[var(--size-editor-line-h)]`, while the gutter uses `text-xs` and the
 * code stays `text-sm`. Alignment is preserved because both share the same
 * `leading-[var(--size-editor-line-h)]` + `py-4`.
 *
 * DESIGN-PARITY REFERENCE ONLY (NO code reuse)
 * --------------------------------------------------------------------------
 * The code-view concept mirrors Calibre's desktop editor — `src/calibre/gui2/
 * tweak_book/editor/text.py` (the code editor widget), `editor/themes.py` (its
 * dark syntax theme), and `check.py` (the Check-Book result levels
 * ERROR/WARNING/INFO that motivate the amber notice). NO Python/Qt code is
 * imported, translated, or executed — only the visual code view + a static,
 * props-driven warning banner are reproduced. There is no real EPUB parsing, no
 * file I/O, and no validation engine.
 *
 * INTEGRATION CONTRACT for the `/editor` page (owned by the app agent)
 * --------------------------------------------------------------------------
 * Because this is an `async` Server Component but open-file switching is CLIENT
 * state, the page MUST pre-render one `<CodeEditor>` per file and let the client
 * toggle which slot is visible (it cannot `await` inside a client toggle):
 *
 *   // app/editor/page.tsx (async Server Component, owned by the app agent)
 *   import { editorFiles } from '@/data/editorFiles';
 *   import { CodeEditor } from '@/components/editor/CodeEditor';
 *   import { EditorWorkspaceProvider, FileTabs, EditorCodeViewport } from '@/components/editor/FileTabs';
 *   import { FileTree } from '@/components/editor/FileTree';
 *   import { PreviewPane } from '@/components/editor/PreviewPane';
 *   import { EditorToolbar } from '@/components/editor/EditorToolbar';
 *
 *   export default function EditorPage() {
 *     const fileEntries = editorFiles.filter((f) => f.kind === 'file');
 *     const codeSlots = Object.fromEntries(
 *       fileEntries.map((f) => [f.path, <CodeEditor key={f.path} code={f.code} language={f.language} fileName={f.name} />]),
 *     );
 *     return (
 *       <EditorWorkspaceProvider>
 *         <EditorToolbar />
 *         <FileTabs />
 *         <div className="flex min-h-0 flex-1">
 *           <FileTree />
 *           <EditorCodeViewport codeSlots={codeSlots} />
 *           <PreviewPane />
 *         </div>
 *       </EditorWorkspaceProvider>
 *     );
 *   }
 *
 * @see src/lib/highlight.ts — `codeToHtml` (the cached Shiki singleton consumed here).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see src/calibre/gui2/tweak_book/editor/text.py — Calibre code editor (reference only).
 * @see src/calibre/gui2/tweak_book/editor/themes.py — Calibre editor themes (reference only).
 * @see src/calibre/gui2/tweak_book/check.py — Check-Book result levels (reference only).
 * @see Agent Action Plan §0.3 (Figma) / §0.4.2 (Component Mapping) / §0.4.5 (tokens).
 */

import type { JSX } from 'react';

import { codeToHtml } from '@/lib/highlight';

/**
 * Props for {@link CodeEditor}.
 *
 * The contract is intentionally `code` + `language` (plain strings, e.g. an
 * `EditorFile`'s `code` and `language`) rather than a full `EditorFile`, so the
 * component stays a pure, state-free Server Component that the page can
 * pre-render once per file.
 */
export interface CodeEditorProps {
  /** File contents to render (e.g. `EditorFile.code`). */
  code: string;
  /**
   * Shiki language id (e.g. `EditorFile.language`) — `'html' | 'xml' | 'css'`
   * in this prototype. Unrecognized ids degrade gracefully to `'xml'` inside
   * `@/lib/highlight`, so any string is safe to pass.
   */
  language: string;
  /**
   * Optional open-file name. NOT rendered as a visible header (Figma `5:74` has
   * none — the name lives in the sibling File-Tabs strip); it is used only as
   * the panel's accessible name so assistive tech can announce which file the
   * code belongs to.
   */
  fileName?: string;
  /**
   * Optional validation summary for the amber "Check Book" notice. Defaults to
   * the CONFIRMED Figma wording "Missing attribute: xmlns:opf". This is a
   * UI-only, mock banner — there is no real validation engine behind it.
   */
  validationMessage?: string;
  /**
   * Optional issue count, rendered as a leading number before the message (e.g.
   * `3 Missing attribute: xmlns:opf`). When omitted, NO count is shown — which
   * is the Figma default state ("⚠ Missing attribute: xmlns:opf").
   */
  validationCount?: number;
}

/**
 * Tailwind arbitrary-variant normalization for Shiki's injected
 * `<pre class="shiki">`.
 *
 * Shiki emits a self-contained `<pre>` with its own margin, padding, background,
 * and the browser `monospace`-keyword font-size quirk. To make line numbers
 * align with code rows we strip the margin/padding, make the background
 * transparent (so the single `bg-code-bg` panel surface shows through), and
 * force the pre + its `<code>` to the code metrics `font-mono text-sm
 * leading-[var(--size-editor-line-h)]` — so every `.line` is exactly one 26px
 * row that coincides with its gutter number (the gutter shares the same
 * `leading-[var(--size-editor-line-h)]` row pitch).
 */
const SHIKI_NORMALIZE =
  '[&_pre.shiki]:!m-0 [&_pre.shiki]:!p-0 [&_pre.shiki]:!bg-transparent ' +
  '[&_pre.shiki]:!font-mono [&_pre.shiki]:!text-sm [&_pre.shiki]:!leading-[var(--size-editor-line-h)] ' +
  '[&_.shiki_code]:!font-mono [&_.shiki_code]:!text-sm [&_.shiki_code]:!leading-[var(--size-editor-line-h)]';

/**
 * CodeEditor — the App 04 EPUB Editor's syntax-highlighted code view (`5:74`).
 *
 * Async Server Component: highlights `code` with `@/lib/highlight`'s cached
 * Shiki singleton on the server (zero client JS) and renders a token-styled
 * line-number gutter + the injected highlighted HTML + a bottom-left amber
 * validation notice. Owns no state and no client interactivity.
 *
 * @param props - see {@link CodeEditorProps}.
 * @returns The rendered code-view panel (resolved on the server).
 */
export async function CodeEditor({
  code,
  language,
  fileName,
  validationMessage,
  validationCount,
}: CodeEditorProps): Promise<JSX.Element> {
  // Highlight on the SERVER via the shared singleton. Returns a complete
  // `<pre class="shiki">…</pre>` string with inline per-token color styles.
  const html = await codeToHtml(code, language);

  // One gutter row per source line. `split('\n')` yields exactly `lineCount`
  // rows, matching the number of `.line` spans Shiki emits, so the gutter and
  // the code stay 1:1 aligned.
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Amber notice — props-driven with mock defaults that EXACTLY match the
  // CONFIRMED Figma default state ("⚠ Missing attribute: xmlns:opf"). A count
  // is shown only when explicitly provided (the Figma default has none).
  const noticeMessage = validationMessage ?? 'Missing attribute: xmlns:opf';
  const noticeCountPrefix =
    typeof validationCount === 'number' ? `${validationCount} ` : '';

  return (
    // `<section>` with an accessible name = a named region landmark; this is the
    // sole consumer of `fileName` (invisible a11y; the design shows no header).
    // Single `bg-code-bg` surface (#0A0B18); no panel radius/border per Figma.
    <section
      aria-label={fileName ? `Code editor: ${fileName}` : 'Code editor'}
      className="flex h-full w-full min-w-0 flex-col bg-code-bg"
    >
      {/* Code body: gutter (pinned) + horizontally-scrollable code. Vertical
          scroll lives here so the gutter and code scroll together; horizontal
          scroll lives on the code area alone so the gutter stays pinned and the
          PAGE never overflows. */}
      <div className="flex min-h-0 flex-1 flex-row overflow-y-auto">
        {/* Line-number gutter. `aria-hidden` — the numbers are a decorative
            visual aid; the code content itself carries the real line structure.
            Shares the `leading-[var(--size-editor-line-h)]` row pitch + `py-4` top inset with the code
            area so number N aligns with line N; numerals are `text-xs` (smaller
            than the `text-sm` code) per the Figma measurement (alignment depends
            on line-height, not font-size). The token hairline delineates the
            gutter in lieu of Figma's untokenizable near-identical lighter fill. */}
        <div
          aria-hidden="true"
          className="flex-none select-none border-r border-[var(--border-white-07)] px-3 py-4 text-right font-mono text-xs leading-[var(--size-editor-line-h)] text-text-muted"
        >
          {lineNumbers.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>

        {/* Code area: the Shiki HTML, injected. `overflow-x-auto` lets long lines
            scroll WITHIN the panel (no page overflow); `min-w-0` lets the flex
            child actually shrink. `SHIKI_NORMALIZE` aligns the injected pre to
            the gutter and reveals the single `bg-code-bg` surface. */}
        <div
          className={`min-w-0 flex-1 overflow-x-auto p-4 font-mono text-sm leading-[var(--size-editor-line-h)] ${SHIKI_NORMALIZE}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* Amber "Check Book" validation notice — pinned bottom-left, on the code
          surface (no border, no background, per CONFIRMED Figma). The ⚠ glyph is
          decorative (aria-hidden); an sr-only "Warning:" conveys the same meaning
          to assistive tech. */}
      {/* BLITZY [A11Y]: gutter numbers use `text-text-muted` (#64748B) on
          `bg-code-bg` (#0A0B18) ≈ 4.2:1, just under the WCAG AA 4.5:1 minimum for
          normal text. They are decorative (aria-hidden) and the color is the
          Figma/AAP-mandated token, so per the CRITICAL Directive the rendered
          value is kept exact and flagged here rather than silently darkened. */}
      <p className="flex-none pl-12 pr-4 pb-6 pt-3 text-xs leading-5 text-star">
        <span aria-hidden="true">⚠ </span>
        <span className="sr-only">Warning: </span>
        {noticeCountPrefix}
        {noticeMessage}
      </p>
    </section>
  );
}
