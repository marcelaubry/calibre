'use client';

/**
 * ==========================================================================
 * Calibre-UI — EditorToolbar (App 04 · Figma node `5:8`)
 * The Book/EPUB Editor's OWN top action bar.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `EditorToolbar` is the editor screen's dedicated action toolbar — the
 * full-width 1440×44 bar (Figma node `5:8`) that sits directly UNDER the
 * macOS window title bar (rendered by the shell, NOT here) and ABOVE the
 * `FileTabs` strip on the App 04 Book/EPUB Editor screen (`5:2`). It is part
 * of the UI-only, mock-data Calibre prototype (Next.js 15 App Router · React
 * 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 *
 * It exposes the editor's nine primary actions, left-to-right:
 *   Save · Undo · Redo · Find · Check Book · Polishing · Images ·
 *   Table of Contents · Preview.
 * Only **Save** is wired: it navigates back to the Library List (`/`), per the
 * AAP workflow `App04 → App01`. Every other action is a deliberate UI-only
 * NO-OP — this prototype performs no real EPUB editing / conversion / checking
 * / polishing, so those controls render as inert affordances.
 *
 * It is DISTINCT from the app-wide `TopToolbar` in the shell: App 04 is a
 * focused editing mode entered via "Edit Book" and exited via "Save". This
 * toolbar is stateless and standalone — it owns no Context and has no
 * active-file dependency; its only side effect is the Save navigation.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * It calls `useRouter()` (`next/navigation`) and binds `onClick` handlers, so
 * it MUST be a Client Component (App Router components default to Server
 * Components, which can neither use the router hook nor attach event handlers).
 * The directive is the very first line, before any import.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, node `5:8` in screen `5:2`)
 * --------------------------------------------------------------------------
 * Reconciled via `analyze_figma_node(5:8)` against the full-screen render of
 * `5:2`. All values resolve to named tokens (no raw color literals, even here):
 *   • Bar `5:8` → 1440×44, solid fill `--color-surface-1` (definitively
 *     surface-1, NOT surface-2). Buttons are LEFT-ALIGNED with a uniform 6px
 *     gap and an 8px left inset; the row does not overflow (~700px of empty bar
 *     remains right of Preview — Preview is NOT right-aligned / no `ml-auto`).
 *   • Bottom border → a 1px child rectangle `5:9` at the bar's bottom edge,
 *     full width, token `--border-white-06`. (The implementation contract's
 *     illustrative sample suggested `--border-white-07`; the CONFIRMED
 *     structural value is `--border-white-06`, so this file uses `06` per the
 *     MANDATORY Figma fidelity protocol — Figma values are authoritative.)
 *   • Save `5:10` → the ONLY FILLED button: the accent CTA gradient
 *     (`--gradient-cta`) with a `--color-text-primary` label. That is exactly
 *     the design-system "Primary CTA" treatment, so — per AAP §0.4.2, which
 *     maps "Save" → `Button variant="primary"` — Save is rendered with
 *     `variant="primary"` and the remaining eight use `variant="toolbar"`.
 *     Using the variant (rather than a caller color override) keeps the fill
 *     and label color 100% token-backed and avoids a fragile same-property
 *     utility-precedence conflict.
 *   • Glyphs are unicode TEXT (AAP §0.3.4 — there are no icon asset files). The
 *     CONFIRMED per-button glyphs/labels CORRECT the contract's illustrative
 *     suggestions: Check Book uses ✂️ (scissors, U+2702) not a check mark;
 *     Polishing uses 🌐 (globe, U+1F310) not sparkles; Preview uses ↗
 *     (north-east arrow, U+2197) not an eye; and button 8's label is the FULL
 *     "Table of Contents" with 📋 (clipboard, U+1F4CB), not the abbreviation
 *     "TOC". Undo/Redo/Preview use the bare arrow codepoints (text
 *     presentation) exactly as the design shows.
 *
 * NOTE ON THE PRIMITIVE'S STANDARDIZATION (AAP §0.4.2 / HARD CONSTRAINT)
 * --------------------------------------------------------------------------
 * Every action is the bespoke `Button` primitive — never a hand-rolled
 * `<button>`. The eight editing actions use `variant="toolbar"` (the
 * primitive's standardized 84px-min × 38px, 7px-radius, glyph-then-label
 * shape). The toolbar buttons therefore adopt the system's standardized
 * footprint and `--color-text-muted` label color rather than Figma's
 * per-instance hug widths and `--color-text-secondary` label color — a
 * deliberate design-system standardization: the `Button` primitive is shared
 * with the App 01 `TopToolbar` and must not be forked here.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color resolves to an `@theme` token declared in `src/app/globals.css`:
 * the bar via the `bg-surface-1` utility, the hairline via the
 * `border-[var(--border-white-06)]` arbitrary-value utility, and Save's
 * gradient + label color via the `primary` variant's own token utilities. The
 * only bare literals are Tailwind's standard layout scale (`h-11` = 44px,
 * `gap-1.5` = 6px, `px-2` = 8px) and permitted keywords. There is NO hex/rgba
 * color literal anywhere in this file.
 *
 * RESPONSIVE (AAP — 1440 → 1280, zero horizontal overflow)
 * --------------------------------------------------------------------------
 * `w-full` spans the bar; `flex-none` keeps the 44px height when the toolbar is
 * stacked in the editor's vertical column; `overflow-x-auto` lets the single
 * button row scroll rather than overflow the page if it ever exceeds the bar
 * width. At the 1440px baseline the row leaves the right side empty, and it
 * stays within the 1280px minimum, so there is no horizontal page overflow at
 * any supported width.
 *
 * DESIGN-PARITY REFERENCE ONLY (NO code reuse): `src/calibre/gui2/tweak_book/
 * ui.py` and `boss.py` confirm the real Calibre editor's action set — Save
 * (Ctrl+S), Undo/Redo, Find/replace (Ctrl+F), Check book (F7), Polish book,
 * Manage fonts / Images, Edit Table of Contents, and a live Preview. Nothing is
 * imported or translated from the Python codebase; only the visual toolbar and
 * the Save → library navigation are reproduced.
 *
 * @see src/components/primitives/Button.tsx — the `Button` primitive consumed here.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3 (Figma) / §0.4.2 (Component Mapping) / §0.4.5 (tokens).
 */

import type { JSX } from 'react';
import { useRouter } from 'next/navigation';

import { Button, type ButtonVariant } from '@/components/primitives/Button';

/**
 * A single editor toolbar action.
 *
 * The action set, order, labels, and glyphs are taken verbatim from the
 * CONFIRMED Figma node `5:8` (see the file header). Icons are unicode glyphs
 * rendered as text — there are no icon asset files (AAP §0.3.4).
 */
interface ToolbarAction {
  /** Visible label — also the {@link Button}'s accessible name. Verbatim from Figma `5:8`. */
  label: string;
  /** Leading emoji / unicode glyph (Figma `5:8` uses inline text glyphs, never assets). */
  icon: string;
  /**
   * Which {@link Button} variant renders this action. Defaults to `'toolbar'`
   * for the eight editing actions; `Save` is `'primary'` because Figma `5:10`
   * shows it as the only gradient-filled button and AAP §0.4.2 maps "Save" to
   * the primary CTA.
   */
  variant?: ButtonVariant;
  /**
   * Click handler. Only `Save` is wired (→ Library List `/`); the remaining
   * actions are deliberate UI-only no-ops in this mock prototype, so they omit
   * `onClick` entirely (the {@link Button} then renders a harmless inert
   * control rather than performing any real EPUB operation).
   */
  onClick?: () => void;
}

/**
 * EditorToolbar — the App 04 EPUB Editor's own top action bar (Figma `5:8`).
 *
 * Renders a full-width 44px bar of nine {@link Button} actions in exact Figma
 * left-to-right order. `Save` navigates back to the Library List (`/`) via the
 * App Router; the other eight actions are UI-only no-ops. The component is
 * stateless apart from the router handle used for the Save navigation.
 *
 * @returns The rendered editor action toolbar.
 */
export function EditorToolbar(): JSX.Element {
  const router = useRouter();

  // Action set in exact Figma `5:8` left-to-right order. `Save` is the only
  // wired/primary action (it exits the editor back to App 01); the remaining
  // eight are transparent toolbar no-ops. Glyphs are the CONFIRMED Figma
  // codepoints (see the file header for the corrections vs. the contract's
  // illustrative sample).
  /*
   * BLITZY [DESIGN_SYSTEM_GAP]: The eight `variant="toolbar"` labels render at
   * the shared `Button` primitive's standardized label color
   * `--color-text-muted`; Figma node `5:8` specifies `--color-text-secondary`
   * for these labels. The color is baked into the primitive's toolbar variant
   * (applied to an internal label span), so it cannot be corrected from this
   * call site: a `className` on the Button root is same-property /
   * same-specificity and does not win, and DS3-f forbids targeting a
   * primitive's internal classes. The `Button` primitive is also consumed by
   * the App 01 `TopToolbar`, so it must not be forked or mutated from this
   * consumer file. Chose the system-standard variant (DS3 component mapping)
   * and flag the gap per DS5-f ("flag — do not override internals").
   * RESOLUTION OWNER: the primitives task — introduce a toolbar-label token /
   * Button prop that maps to `--color-text-secondary` (and verify App 01 is not
   * regressed) to close this gap globally.
   */
  /*
   * BLITZY [A11Y]: Consequence of the gap above — `--color-text-muted` on
   * `--color-surface-1` computes to ~3.84:1, below the WCAG AA 4.5:1 minimum
   * for normal text, whereas the Figma intent `--color-text-secondary`
   * computes to ~7.13:1 (passes AA). Per the CRITICAL Directive, the rendered
   * output is left exactly as the shared primitive constrains it (no silent
   * call-site auto-correction) and the issue is flagged for designer /
   * primitives-owner review rather than masked here.
   */
  const actions: ToolbarAction[] = [
    { label: 'Save', icon: '💾', variant: 'primary', onClick: () => router.push('/') },
    { label: 'Undo', icon: '↩' },
    { label: 'Redo', icon: '↪' },
    { label: 'Find', icon: '🔍' },
    { label: 'Check Book', icon: '✂️' },
    { label: 'Polishing', icon: '🌐' },
    { label: 'Images', icon: '🖼️' },
    { label: 'Table of Contents', icon: '📋' },
    { label: 'Preview', icon: '↗' },
  ];

  return (
    <header className="flex h-11 w-full flex-none items-center gap-1.5 overflow-x-auto border-b border-[var(--border-white-06)] bg-surface-1 px-2">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant={action.variant ?? 'toolbar'}
          label={action.label}
          icon={<span aria-hidden="true">{action.icon}</span>}
          onClick={action.onClick}
        />
      ))}
    </header>
  );
}

export default EditorToolbar;
