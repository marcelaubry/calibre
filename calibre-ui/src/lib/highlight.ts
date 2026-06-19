/**
 * `@/lib/highlight` — cached Shiki v4 syntax-highlighting singleton.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * WHAT THIS MODULE IS
 * ──────────────────────────────────────────────────────────────────────────
 * Server-side wrapper around Shiki v4 that renders the EPUB Editor code view
 * (App04, Figma node `5:74`) as syntax-highlighted HTML, ahead-of-time, on the
 * server, shipping ZERO client JavaScript. Shiki's `codeToHtml` tokenizes the
 * source and emits a self-contained `<pre class="shiki">…</pre>` string whose
 * spans carry INLINE color styles — so the highlighted markup needs no client
 * runtime and no extra stylesheet. It is consumed by
 * `components/editor/CodeEditor.tsx`, which calls {@link codeToHtml} with an
 * `EditorFile.code` + `EditorFile.language` and injects the result via
 * `dangerouslySetInnerHTML`.
 *
 * Reachable through the `@/lib/highlight` path alias (`tsconfig.json`
 * `@/*` → `./src/*`).
 *
 * ──────────────────────────────────────────────────────────────────────────
 * SINGLETON — THE WHOLE POINT OF THIS MODULE (perf / console gate)
 * ──────────────────────────────────────────────────────────────────────────
 * `createHighlighter()` is expensive: it loads the regex engine, the requested
 * grammars, and the theme once. Creating it per render — or per `codeToHtml`
 * call — is the classic Shiki defect: it repeats that heavy work and emits
 * console warnings. To avoid that, the highlighter lives behind a MODULE-LEVEL
 * MEMOIZED `Promise<Highlighter>`: the first caller creates it; every
 * subsequent caller awaits the very same promise. `createHighlighter` is
 * therefore invoked AT MOST ONCE for the lifetime of the module.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * HARD CONSTRAINTS
 * ──────────────────────────────────────────────────────────────────────────
 * • SERVER-ONLY — this module carries NO `'use client'` directive and touches
 *   no browser-only API (`window`/`document`). It is imported by Server
 *   Components so the highlighted HTML is produced during render on the server.
 * • DETERMINISTIC / SSR-SAFE — highlighting operates only on static mock
 *   strings (from `@/data/editorFiles`). No randomness, no clock, no network,
 *   no file I/O, no real EPUB parsing.
 * • EXACT-TOKEN FIDELITY — every color in the custom theme is pulled from the
 *   design-system token mirror `@/theme/tokens` (`colors.*`). There are NO
 *   hardcoded color literals in this file; the theme stays byte-consistent with
 *   the global `@theme` token set.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * ──────────────────────────────────────────────────────────────────────────
 * The which-token-gets-which-color intent mirrors Calibre's desktop editor:
 * `src/calibre/gui2/tweak_book/editor/syntax/html.py` (its HTML/XML tokenizer:
 * tag/end-tag, attribute name, quoted string value, comment, entity, doctype,
 * preproc/PI categories) and `src/calibre/gui2/tweak_book/editor/themes.py`
 * (its editor color themes). NO Python/Qt code is imported, translated, or
 * executed — only the conceptual scope→color mapping is reproduced as a Shiki
 * TextMate theme.
 *
 * @see src/calibre/gui2/tweak_book/editor/syntax/html.py — token categories (reference only).
 * @see src/calibre/gui2/tweak_book/editor/themes.py — editor color themes (reference only).
 * @see Agent Action Plan §0.3.2 / §0.7.4 — the App04 syntax palette (authoritative).
 */

import { createHighlighter, type Highlighter } from 'shiki';

import { colors } from '@/theme/tokens';
import type { EditorFile } from '@/types';

// ---------------------------------------------------------------------------
// Supported languages
// ---------------------------------------------------------------------------

/**
 * The Shiki language ids loaded into the highlighter. The editor mock files are
 * XHTML / OPF / NCX (XML) and CSS (the OEBPS structure), which these three
 * grammars cover. Since Shiki v1.0 every theme and language MUST be loaded
 * explicitly at `createHighlighter` time — there is no lazy auto-loading — so
 * this list is the single source of truth for both the highlighter options and
 * the {@link normalizeLang} guard.
 */
const SUPPORTED_LANGS = ['html', 'xml', 'css'] as const;

/** Union of the loaded Shiki language ids: `'html' | 'xml' | 'css'`. */
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

// ---------------------------------------------------------------------------
// Custom TextMate theme — exact scope→token mapping (values from @/theme/tokens)
// ---------------------------------------------------------------------------

/**
 * Registered name of the custom theme. Used both as the theme object's `name`
 * and as the `theme` selector in {@link codeToHtml}; sharing one constant keeps
 * the two in lock-step so the highlighter always resolves the theme it loaded.
 */
const CALIBRE_CODE_THEME = 'calibre-code';

/**
 * The bespoke "calibre-code" editor theme (App04, Figma node `5:74`).
 *
 * Shape: a raw TextMate / VS Code theme (`name` + `type` + a VS Code `colors`
 * map + a `settings` array of scope rules). Every color resolves to a named
 * `@/theme/tokens` value — the design-system's App04 syntax palette:
 *   • tags        → `colors.syntaxTag`     (purple)
 *   • attributes  → `colors.syntaxAttr`    (sky-blue)
 *   • strings     → `colors.syntaxString`  (amber)
 *   • values      → `colors.syntaxValue`   (green)
 *   • comments    → `colors.syntaxComment` (slate)
 * on the `colors.codeBg` editor background with `colors.textPrimary` default
 * text. The scope lists below follow the standard TextMate scope names emitted
 * by Shiki's html / xml / css grammars.
 */
const calibreCodeTheme = {
  name: CALIBRE_CODE_THEME,
  type: 'dark' as const,
  // VS Code workbench color map — drives the editor surface + default text.
  colors: {
    'editor.background': colors.codeBg,
    'editor.foreground': colors.textPrimary,
  },
  // TextMate token rules — first entry (no `scope`) is the global default.
  settings: [
    {
      settings: {
        background: colors.codeBg,
        foreground: colors.textPrimary,
      },
    },
    {
      // HTML/XML element tags + tag punctuation (purple).
      scope: [
        'entity.name.tag',
        'entity.name.tag.html',
        'entity.name.tag.xml',
        'punctuation.definition.tag',
        'meta.tag',
        'keyword',
      ],
      settings: { foreground: colors.syntaxTag },
    },
    {
      // Attribute names (sky-blue).
      scope: [
        'entity.other.attribute-name',
        'entity.other.attribute-name.html',
        'entity.other.attribute-name.xml',
      ],
      settings: { foreground: colors.syntaxAttr },
    },
    {
      // Quoted string values (amber).
      scope: [
        'string',
        'string.quoted',
        'string.quoted.double',
        'string.quoted.single',
      ],
      settings: { foreground: colors.syntaxString },
    },
    {
      // Constants / numeric & CSS property values (green).
      scope: [
        'constant',
        'support.constant',
        'meta.property-value',
        'constant.numeric',
        'constant.other',
        'entity.name',
      ],
      settings: { foreground: colors.syntaxValue },
    },
    {
      // Comments (slate).
      scope: [
        'comment',
        'comment.block',
        'comment.line',
        'punctuation.definition.comment',
      ],
      settings: { foreground: colors.syntaxComment },
    },
  ],
};

// ---------------------------------------------------------------------------
// Memoized highlighter singleton
// ---------------------------------------------------------------------------

/**
 * Module-level memoized singleton. `null` until the first {@link getHighlighter}
 * call creates it; thereafter it holds the one-and-only highlighter promise,
 * reused for every subsequent call. NEVER reassigned once non-null.
 */
let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * Lazily create (once) and return the shared Shiki highlighter.
 *
 * The first invocation kicks off `createHighlighter` with the custom theme and
 * all {@link SUPPORTED_LANGS} grammars, memoizing the resulting promise. Every
 * later invocation returns that same promise — so the expensive engine/grammar/
 * theme load happens AT MOST ONCE.
 */
function getHighlighter(): Promise<Highlighter> {
  if (highlighterPromise === null) {
    highlighterPromise = createHighlighter({
      themes: [calibreCodeTheme],
      langs: [...SUPPORTED_LANGS],
    });
  }
  return highlighterPromise;
}

// ---------------------------------------------------------------------------
// Language guard
// ---------------------------------------------------------------------------

/**
 * Coerce an arbitrary language id to one of the loaded grammars.
 *
 * `EditorFile.language` is a plain `string` (folders may even carry an empty
 * string), so a value outside the loaded set would make Shiki throw. This guard
 * maps any unrecognized id to `'xml'` — the safe superset for OEBPS markup
 * (OPF / NCX / XHTML) — so highlighting degrades gracefully instead of failing.
 *
 * @param language - the requested Shiki language id (e.g. `EditorFile.language`).
 * @returns a guaranteed-loaded {@link SupportedLang}.
 */
function normalizeLang(language: string): SupportedLang {
  return (SUPPORTED_LANGS as readonly string[]).includes(language)
    ? (language as SupportedLang)
    : 'xml';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Highlight a code string into themed HTML using the cached singleton.
 *
 * Runs server-side and returns a complete, self-contained
 * `<pre class="shiki" …>…</pre>` string whose spans carry inline color styles
 * from the {@link calibreCodeTheme}. Deterministic for a given `(code, lang)`.
 *
 * @param code - the file contents to highlight (e.g. `EditorFile.code`).
 * @param lang - the Shiki language id (e.g. `EditorFile.language`); unrecognized
 *               ids fall back to `'xml'` via {@link normalizeLang}.
 * @returns a Promise resolving to the highlighted HTML string.
 */
export async function codeToHtml(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: normalizeLang(lang),
    theme: CALIBRE_CODE_THEME,
  });
}

/**
 * Convenience wrapper: highlight directly from an {@link EditorFile}.
 *
 * Accepts only the fields it needs (`code` + `language`) so callers may pass a
 * full `EditorFile` or any compatible subset.
 *
 * @param file - an object with the file's `code` and `language`.
 * @returns a Promise resolving to the highlighted HTML string.
 */
export function highlightEditorFile(
  file: Pick<EditorFile, 'code' | 'language'>,
): Promise<string> {
  return codeToHtml(file.code, file.language);
}
