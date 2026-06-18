'use client';

/**
 * ==========================================================================
 * Calibre-UI — LookAndFeelPanel
 * The "Look & Feel" option-panel body of the App05 "Convert Books" dialog.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `LookAndFeelPanel` is 1 of the 5 composition components of the Convert Books
 * dialog (App05, Figma screen node `6:9`) in the UI-only Calibre e-book-manager
 * prototype (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind
 * CSS v4 CSS-first `@theme` tokens). It is the panel shown BELOW the option-tab
 * strip when the "Look & Feel" tab is active. Per the Agent Action Plan (§0.3 /
 * §0.7.4 App05) it presents the look-and-feel subset of the conversion options:
 *
 *   • a "Margins (pt)" numeric field,
 *   • a "Base font size (pt)" numeric field,
 *   • a "Line height (pt)" numeric field,
 *   • a "Justify text" on/off switch, and
 *   • a 2×3 grid of six paragraph/processing status-dot toggles.
 *
 * UI-ONLY / MOCK — NOTHING IS APPLIED
 * --------------------------------------------------------------------------
 * Every control here is self-contained and INERT: each owns its own React
 * `useState` and nothing is persisted, applied, or fed into any real conversion
 * pipeline. There is NO file I/O, NO EPUB parsing, and NO option commit — the
 * panel is purely demonstrative within the Convert dialog. Design-parity
 * reference ONLY (never imported or translated): `src/calibre/gui2/convert/
 * look_and_feel.py` and its `look_and_feel.ui`, whose Qt widget exposes
 * `opt_base_font_size`, `opt_line_height`, `opt_margin_*`,
 * `opt_change_justification`, `opt_remove_paragraph_spacing`,
 * `opt_insert_blank_line`, `opt_disable_font_rescaling`,
 * `opt_smarten_punctuation`, `opt_keep_ligatures`, `opt_linearize_tables`, etc.
 * We reproduce only the VISUAL subset the AAP lists; no Python is reused.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * This component owns interactive `useState` for every control and binds change
 * handlers into the controlled `InputField` / `Toggle` primitives. App Router
 * components default to Server Components (which cannot hold state or bind
 * handlers), so the directive is the very first line of the file, before any
 * import.
 *
 * COMPOSE FROM PRIMITIVES ONLY (concrete paths, NO barrel)
 * --------------------------------------------------------------------------
 * All accent styling — the numeric field's focus fill/border and the toggle
 * "on" fill (gradient track or status dot) — lives INSIDE the bespoke
 * `InputField` / `Toggle` primitives (the accent token). This panel never
 * hand-rolls a raw number input, a raw checkbox, or any unstyled control; it
 * composes the primitives, imported from their CONCRETE module paths (there is
 * no `@/components/primitives` barrel). Each processing-option cell is a FLUSH
 * `dot + label` row (no per-cell card surface — see BLITZY [LAYOUT] / [COLOR]).
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, screen `6:9`)
 * --------------------------------------------------------------------------
 * Reconciled via `analyze_figma_node` against screen `6:9` (parent screen
 * `6:9`). The render of the Look & Feel region was used to fix the exact label
 * colors, the toggle on/off label treatment, the grid orientation, and the
 * inter-control spacing. Because the live structural API was unavailable during
 * analysis, exact colors are token-named below (never literal) and geometry is
 * mapped to the nearest Tailwind spacing step.
 *
 * BLITZY [COMPONENT] (CP4 Figma-fidelity fix, finding §LookAndFeelPanel
 * L296/311/326/342/359-363): the `6:9` render draws Margins / Base font size /
 * Line height as numeric INPUT FIELDS, the six processing options as bare status
 * DOTS, and justification as a three-way SEGMENTED control. This panel now
 * resolves each control against the D1 precedence order (explicit AAP rule >
 * Figma > everything else):
 *   • Margins / Base font size / Line height → numeric `InputField`
 *     (`variant="number"`, bounded via `min`/`max`/`step`). This matches Figma
 *     `6:9` exactly and does NOT conflict with the AAP: §0.3.3 / §0.4.2 scope
 *     the `Slider` primitive to the App 06 Preferences "Margins" control ONLY,
 *     and §0.3.1 / §0.7.4 list these App 05 controls by name without pinning a
 *     control type. So the prior Slider rendering was corrected to Figma's
 *     numeric fields.
 *   • Six processing options → `Toggle presentation="dot"` (the 18×18 accent
 *     status dot). The 2×3 GRID is AAP-pinned (§0.3.1 / §0.7.4 "2×3 processing-
 *     toggle grid") and is preserved; only the per-cell visual (dot vs. iOS
 *     pill) follows Figma `6:9`, which the AAP does not pin.
 *   • Justification → a BINARY `Toggle` (`presentation="switch"`). Figma `6:9`
 *     shows a three-way Left/Justify/Right segmented control, but AAP §0.3.1 /
 *     §0.7.4 EXPLICITLY specify a binary "justification toggle". Per D1 the
 *     explicit AAP rule wins over Figma, so the segmented variant is DECLINED
 *     and the binary toggle is kept (documented again at its call site).
 *
 * BLITZY [CONTENT]: the `6:9` render shows a different set of processing labels.
 * Per the agent contract (§4 / §6) and the authentic Calibre options confirmed
 * in `look_and_feel.py`, this panel uses the six canonical Calibre labels (see
 * {@link PROCESSING_TOGGLE_LABELS}); the subagent values were used only to
 * confirm the grid orientation and styling.
 *
 * BLITZY [LAYOUT]: the processing options are laid out as the AAP §0.3.1 /
 * §0.7.4 "2×3 processing-toggle grid" — i.e. 2 ROWS × 3 COLUMNS (rendered as
 * `grid-cols-3` with two implicit rows; "2×3" rows×cols ≡ 3 cols × 2 rows, the
 * orientation CONFIRMED by both prior `6:9` reconciliations). Column gap ≈ the
 * `gap-x-7` step, row gap ≈ the `gap-y-3` step. Each cell is a FLUSH `dot +
 * label` row: the `6:9` Figma render lays the processing options out as bare
 * status-dot + label rows with NO per-cell filled card, so wrapping each cell in
 * a `GlassCard` surface would hallucinate card chrome (a `bg-card` fill +
 * hairline) not present in the design (DS2-d). The cells therefore sit flush on
 * the dialog body; the grid's `gap-x-7` / `gap-y-3` provide all the inter-option
 * separation.
 *
 * BLITZY [COLOR]: control labels + the "Processing options" caption resolve to
 * the `text-secondary` token; a dot/switch's adjacent label brightens to the
 * `text-primary` token when that control is ON (the Figma on/off label
 * treatment) and stays `text-secondary` when OFF. Section dividers use the
 * `border-white-07` hairline token, and BOTH the panel as a whole AND every
 * processing cell sit FLUSH on the dialog surface (the render shows no inset
 * card behind the panel or behind any individual option).
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / radius / spacing value resolves to an `@theme` token from
 * `src/app/globals.css`, consumed via a Tailwind v4 utility (`text-body`,
 * `text-text-secondary`, `text-text-primary`, `rounded-card`) or a CSS-variable
 * arbitrary value (`border-[var(--border-white-07)]`). There are NO raw hex /
 * color-function literals anywhere in this file — including these comments. The
 * only bare literals are layout values that carry no color information (flex /
 * grid utilities, the Tailwind spacing scale, and the numeric control bounds).
 *
 * @see src/components/primitives/InputField.tsx — the numeric-field primitive.
 * @see src/components/primitives/Toggle.tsx  — the on/off switch / status-dot primitive.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3 / §0.7.4 (App05) — the Look & Feel option subset.
 */

import { useId, useState } from 'react';
import type { JSX } from 'react';

import { InputField } from '@/components/primitives/InputField';
import { Toggle } from '@/components/primitives/Toggle';

/**
 * Props for {@link LookAndFeelPanel}.
 *
 * The panel is fully self-contained — it owns all of its control state
 * internally and exposes no value/onChange surface (it is demonstrative,
 * UI-only). The single optional `className` lets the owner (`ConvertDialog`)
 * own the panel's OUTER layout / spacing within the dialog body.
 */
export interface LookAndFeelPanelProps {
  /**
   * Extra classes merged onto the panel's outer container (after the base
   * layout classes, so caller utilities win). Use it to position the panel
   * within the Convert dialog body (e.g. a top margin or a max-width).
   */
  className?: string;
}

/**
 * The six processing-option switch labels, in the exact AAP §4 order and using
 * the authentic Calibre wording (confirmed against `look_and_feel.py`'s
 * `opt_remove_paragraph_spacing` / `opt_insert_blank_line` /
 * `opt_disable_font_rescaling` / `opt_smarten_punctuation` / `opt_keep_ligatures`
 * / `opt_linearize_tables`). Laid out row-major in the 3-column × 2-row grid:
 * row 1 = entries 0–2, row 2 = entries 3–5.
 */
const PROCESSING_TOGGLE_LABELS = [
  'Remove spacing between paragraphs',
  'Insert blank line between paragraphs',
  'Disable font size rescaling',
  'Smarten punctuation',
  'Keep ligatures',
  'Linearize tables',
] as const;

/**
 * Outer panel container: a full-width vertical stack. Transparent (the panel
 * sits flush on the dialog surface — BLITZY [COLOR]); `gap-u12` separates the
 * three control groups, reinforced by the hairline {@link DIVIDER_CLASSES}.
 *
 * The inter-group gap is the `gap-u12` (12px) step rather than a looser value:
 * the fixed 880×740 Figma `6:9` frame (AAP §0.3.1 Workflow 4 / §0.7.4) DEPICTS
 * the header + format row + option tabs + this Look & Feel panel + the terminal
 * conversion log + the footer all WITHIN the 740px frame, so the panel must fit
 * its slice of that fixed height with NO internal scroll. The original loose
 * spacing was "mapped to the nearest Tailwind step" while the live structural
 * API was unavailable (see file header), so the authoritative 740px frame
 * height governs: tightening the intra-panel rhythm to `gap-u12` (a named token)
 * keeps every section — including the depicted conversion log and footer —
 * inside the frame without scroll, while the hairline {@link DIVIDER_CLASSES}
 * preserves clear visual separation between the three control groups.
 */
const PANEL_BASE = 'flex w-full flex-col gap-u12';

/**
 * Horizontal ROW holding the three labelled numeric fields side by side
 * (Margins · Base font size · Line height). Reconciled against the FIXED
 * 880×740 Figma `6:9` frame: per AAP §0.3.1 (Workflow 4) / §0.7.4 the dialog
 * DEPICTS the header + format row + option tabs + this Look & Feel panel + the
 * terminal conversion log + the footer all WITHIN the 740px frame, so the three
 * compact numeric controls sit on ONE row rather than stacked vertically. A
 * vertical stack made the dialog body 182px taller than its fixed height,
 * pushing the conversion log (a depicted element) below the fold and forcing an
 * internal scroll the design never shows. `flex-wrap` lets the controls wrap on
 * a narrow viewport so the panel never forces HORIZONTAL overflow at the 1280px
 * responsive floor; `items-start` top-aligns the label/field columns so an
 * uneven label never misaligns its field; `gap-u24` separates the controls.
 */
const NUMERIC_ROW = 'flex flex-row flex-wrap items-start gap-u24';

/**
 * One labelled numeric control: the label sits ABOVE its field (the Figma
 * field-label placement), separated by the `gap-1.5` (6px) step.
 */
const CONTROL_STACK = 'flex flex-col gap-u6';

/**
 * Compact width for a numeric field's WRAPPER (the `InputField` `className`
 * merges onto the wrapper). `w-24` (96px, Tailwind spacing scale — a layout
 * value with no color information, permitted under the zero-hardcoded-token
 * rule) keeps each "pt" field a tidy box rather than spanning the panel width,
 * matching the compact numeric fields in the Figma `6:9` Look & Feel render.
 */
const NUMERIC_FIELD_WIDTH = 'w-u96';

/**
 * Control-label / caption typography: the `text-body` role (12px) in the
 * `text-secondary` token (BLITZY [COLOR]). `select-none` keeps labels from being
 * drag-selected while the user works the controls.
 */
const LABEL_CLASSES = 'select-none text-body text-text-secondary';

/**
 * Section divider — a full-width hairline rule using the `border-white-07`
 * token (the house hairline, identical to `GlassCard`'s default border). Reset
 * all native `<hr>` borders/margins, then add only the 1px top border.
 */
const DIVIDER_CLASSES =
  'm-0 h-0 w-full border-0 border-t border-[var(--border-white-07)]';

/** The "Justify text" switch row: switch on the left, label to its right. */
const JUSTIFY_ROW = 'flex items-center gap-u12';

/** The processing-options group: caption above the dot grid; `gap-3` between. */
const PROCESSING_GROUP = 'flex flex-col gap-u12';

/**
 * The processing-options GRID — the AAP "2×3" grid = 3 columns × 2 rows
 * (BLITZY [LAYOUT]). Implicit rows size to content so a wrapped label never
 * clips. Column gap ≈ the `gap-x-7` step (~Figma 27px); row gap ≈ the `gap-y-3`
 * step (~Figma 12px).
 */
const PROCESSING_GRID = 'grid grid-cols-3 gap-x-u28 gap-y-u12';

/**
 * One FLUSH processing cell: a flex row with the status DOT on the left and its
 * label to the right (`gap-3`), sitting directly on the dialog body with NO card
 * surface (BLITZY [LAYOUT] — the `6:9` render shows bare dot+label rows, not
 * cards). `min-w-0` lets the cell shrink within its grid column so a long label
 * can wrap instead of forcing horizontal overflow; `py-0.5` adds a hair of
 * vertical breathing room around the 18px dot without implying a filled chip.
 */
const PROCESSING_CELL = 'flex min-w-0 items-center gap-u12 py-u2';

/**
 * Base classes for a toggle's adjacent label. The color is appended at render
 * time: `text-primary` when the control is ON, `text-secondary` when OFF
 * (BLITZY [COLOR]). `break-words` lets a long label wrap inside its cell rather
 * than overflow (responsive integrity); `select-none` avoids stray selection.
 */
const SWITCH_LABEL_BASE = 'select-none break-words text-body';

/** Keeps the dot/switch from being squeezed by a long, flexible adjacent label. */
const SWITCH_SHRINK = 'shrink-0';

/**
 * Resolve a toggle label's color utility from its on/off state: brighter
 * `text-primary` when ON, muted `text-secondary` when OFF (the Figma on/off
 * label treatment — BLITZY [COLOR]). Returns a token-backed utility class only.
 */
function switchLabelClasses(checked: boolean): string {
  return `${SWITCH_LABEL_BASE} ${checked ? 'text-text-primary' : 'text-text-secondary'}`;
}

/**
 * LookAndFeelPanel — the App05 Convert dialog "Look & Feel" option panel.
 *
 * Renders three labelled numeric fields (margins, base font size, line height),
 * a "Justify text" switch, and a 2×3 grid of six paragraph/processing status-dot
 * toggles, each backed by its own internal `useState`. Nothing is applied or
 * persisted — the panel is a demonstrative, UI-only surface composed entirely
 * from the design-system `InputField` and `Toggle` primitives, so every accent,
 * radius, and border resolves to an `@theme` token inside those primitives. The
 * processing cells sit FLUSH (no per-cell card). The caller `className` is
 * merged onto the outer container.
 *
 * @param props - {@link LookAndFeelPanelProps}
 * @returns The rendered Look & Feel option panel.
 */
export function LookAndFeelPanel({ className }: LookAndFeelPanelProps): JSX.Element {
  // Self-contained mock state (UI-only; nothing is persisted or applied). The
  // seeded mix (justify + smarten on, the rest off) keeps the panel looking
  // populated and exercises BOTH the on and off visual states of the toggles.
  //
  // The three numeric fields hold their value as a STRING: the `InputField`
  // primitive is a controlled text-entry control (`value: string`, value-first
  // `onChange`), and a string lets the user type, clear, and edit freely
  // (intermediate states like an empty field are not clobbered). The numeric
  // SEMANTICS — bounds and stepping — are enforced at the control by the native
  // `type="number"` field via the `min` / `max` / `step` attributes the
  // `InputField` forwards. Seeded from the Calibre defaults (margins 5pt, base
  // font 12pt, line height 0 = "use source").
  const [baseFontSize, setBaseFontSize] = useState<string>('12'); // pt
  const [lineHeight, setLineHeight] = useState<string>('0'); // pt (0 = default)
  const [margins, setMargins] = useState<string>('5'); // pt
  const [justify, setJustify] = useState<boolean>(true);
  const [removeParaSpacing, setRemoveParaSpacing] = useState<boolean>(false);
  const [insertBlankLine, setInsertBlankLine] = useState<boolean>(false);
  const [disableFontRescale, setDisableFontRescale] = useState<boolean>(false);
  const [smartenPunctuation, setSmartenPunctuation] = useState<boolean>(true);
  const [keepLigatures, setKeepLigatures] = useState<boolean>(false);
  const [linearizeTables, setLinearizeTables] = useState<boolean>(false);

  // A stable, SSR-safe id prefix (React 19 `useId`) so each visible label can be
  // associated with its control (numeric-field `htmlFor`, toggle
  // `aria-labelledby`).
  const fieldId = useId();
  const marginsId = `${fieldId}-margins`;
  const baseFontId = `${fieldId}-base-font-size`;
  const lineHeightId = `${fieldId}-line-height`;
  const justifyId = `${fieldId}-justify`;

  // Pair each processing-option label with its controlled state + setter so the
  // 2×3 grid renders from a single source of truth (the setter binds directly:
  // a `Dispatch<SetStateAction<boolean>>` satisfies the `(checked: boolean) =>
  // void` toggle callback contract).
  const processingToggles: ReadonlyArray<{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }> = [
    { label: PROCESSING_TOGGLE_LABELS[0], checked: removeParaSpacing, onChange: setRemoveParaSpacing },
    { label: PROCESSING_TOGGLE_LABELS[1], checked: insertBlankLine, onChange: setInsertBlankLine },
    { label: PROCESSING_TOGGLE_LABELS[2], checked: disableFontRescale, onChange: setDisableFontRescale },
    { label: PROCESSING_TOGGLE_LABELS[3], checked: smartenPunctuation, onChange: setSmartenPunctuation },
    { label: PROCESSING_TOGGLE_LABELS[4], checked: keepLigatures, onChange: setKeepLigatures },
    { label: PROCESSING_TOGGLE_LABELS[5], checked: linearizeTables, onChange: setLinearizeTables },
  ];

  // Merge caller className AFTER the base so caller utilities win on conflicts.
  const panelClassName = [PANEL_BASE, className].filter(Boolean).join(' ');

  return (
    <div className={panelClassName}>
      {/* ---- Numeric fields: margins / base font size / line height -------- */}
      {/* Figma `6:9` draws these as compact numeric INPUT FIELDS (not sliders);
          each is the `InputField` `variant="number"` primitive with its bounds
          forwarded to the native control via `min` / `max` / `step`. The
          `htmlFor`/`id` pair gives each field its accessible name from the
          visible label (gold-standard association — no `aria-label` override).
          The three label+field columns sit side by side on ONE row (see
          {@link NUMERIC_ROW}) so the panel + log + footer fit the fixed 740px
          `6:9` frame without internal scroll. */}
      <div className={NUMERIC_ROW}>
        <div className={CONTROL_STACK}>
          <label htmlFor={marginsId} className={LABEL_CLASSES}>
            Margins (pt)
          </label>
          <InputField
            id={marginsId}
            variant="number"
            value={margins}
            min={0}
            max={50}
            step={1}
            onChange={setMargins}
            className={NUMERIC_FIELD_WIDTH}
          />
        </div>

        <div className={CONTROL_STACK}>
          <label htmlFor={baseFontId} className={LABEL_CLASSES}>
            Base font size (pt)
          </label>
          <InputField
            id={baseFontId}
            variant="number"
            value={baseFontSize}
            min={8}
            max={24}
            step={0.5}
            onChange={setBaseFontSize}
            className={NUMERIC_FIELD_WIDTH}
          />
        </div>

        <div className={CONTROL_STACK}>
          <label htmlFor={lineHeightId} className={LABEL_CLASSES}>
            Line height (pt)
          </label>
          <InputField
            id={lineHeightId}
            variant="number"
            value={lineHeight}
            min={0}
            max={30}
            step={1}
            onChange={setLineHeight}
            className={NUMERIC_FIELD_WIDTH}
          />
        </div>
      </div>

      <hr className={DIVIDER_CLASSES} />

      {/* ---- Justify text switch ------------------------------------------- */}
      {/* BLITZY [COMPONENT] (D1 precedence): Figma `6:9` shows a three-way
          Left / Justify / Right SEGMENTED control here, but AAP §0.3.1 / §0.7.4
          EXPLICITLY specify a binary "justification toggle". The explicit AAP
          rule outranks Figma (D1), so this stays a binary `Toggle` in its
          default `presentation="switch"` (iOS pill) and the segmented variant is
          DECLINED. */}
      <div className={JUSTIFY_ROW}>
        <Toggle
          checked={justify}
          onChange={setJustify}
          ariaLabelledby={justifyId}
          className={SWITCH_SHRINK}
        />
        <span id={justifyId} className={switchLabelClasses(justify)}>
          Justify text
        </span>
      </div>

      <hr className={DIVIDER_CLASSES} />

      {/* ---- Processing options: 2×3 (3-col × 2-row) status-dot grid ------- */}
      {/* Each option is the `Toggle` primitive in its `presentation="dot"` mode
          — the 18×18 accent status dot CONFIRMED for Figma `6:9` (gradient fill
          = ON, white-10 = OFF; no pill, no knob). The AAP-pinned 2×3 grid is
          preserved; only the per-cell visual follows Figma. */}
      <div className={PROCESSING_GROUP}>
        <span className={LABEL_CLASSES}>Processing options</span>
        <div className={PROCESSING_GRID}>
          {processingToggles.map((toggle, index) => {
            const id = `${fieldId}-processing-${index}`;
            return (
              <div key={toggle.label} className={PROCESSING_CELL}>
                <Toggle
                  checked={toggle.checked}
                  onChange={toggle.onChange}
                  ariaLabelledby={id}
                  presentation="dot"
                  className={SWITCH_SHRINK}
                />
                <span id={id} className={switchLabelClasses(toggle.checked)}>
                  {toggle.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LookAndFeelPanel;
