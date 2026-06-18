'use client';

/**
 * ==========================================================================
 * Calibre-UI — IdentifierRows
 * The App 07 Metadata Editor "Identifiers" key/value rows editor.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `IdentifierRows` is the composition component for the "Identifiers" region in
 * the right column of the App 07 Metadata Editor modal (Figma screen `9:9`,
 * sub-nodes `9:102` label · `9:103`/`9:107`/`9:111` rows · `9:115` "+ Add ID")
 * of the UI-only Calibre e-book-manager prototype (Next.js 15 App Router ·
 * React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens). It renders
 * a small "Identifiers" label above a vertical stack of editable identifier rows
 * — each a `scheme` (key) field, a `value` field, and a destructive remove
 * control — followed by a "+ Add ID" button that appends a new blank row.
 *
 * It is a LEAF composition component built ENTIRELY from two design-system
 * primitives — {@link InputField} (the controlled key / value text inputs) and
 * {@link Button} (the per-row `danger` remove control and the quiet `ghost`
 * "+ Add ID" action). It renders NO raw `<input>`, `<button>`, or heading element
 * of its own (AAP §0.4.5 — compose from primitives only).
 *
 * UI-ONLY / MOCK (AAP §0.1.2 · §0.9)
 * --------------------------------------------------------------------------
 * There is no backend, no persistence, no network, and no validation against
 * real identifier registries (ISBN check-digits, Amazon ASIN format, …).
 * Adding / removing / editing identifier rows mutates ONLY the parent's React
 * state via the controlled callbacks — the `rows` array is fully owned by the
 * parent `MetadataDialog`. The Calibre design-parity reference
 * `src/calibre/gui2/metadata/basic_widgets.py` (`IdentifiersEdit`, ~L1690) is a
 * single comma-separated `scheme:value` line editor (e.g.
 * `isbn:1565927249, doi:10.1000/182, amazon:1565927249`) WITH ISBN validation;
 * per the file contract its validation and single-line packing are deliberately
 * NOT replicated — this is a plain, per-row key/value editor. Nothing is
 * imported or translated from the Python codebase; it informs behavior only
 * (identifiers are `scheme → value` pairs such as `isbn`, `amazon`,
 * `goodreads`, `google`).
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The rows bind `onChange` / `onClick` event handlers (key edits, value edits,
 * row removal, row addition), so this must be a Client Component — App Router
 * components default to Server Components, which cannot attach event handlers.
 * The directive is the very first line, before any import. The component is
 * SSR-safe and hook-free: it holds NO local state (it is fully controlled), and
 * there is no `window` / `Math.random` / `Date.now` / `crypto` / `localStorage`
 * access, so it renders identically on the server and client and hydrates
 * without warnings.
 *
 * FULLY CONTROLLED, NO LOCAL STATE (the state contract)
 * --------------------------------------------------------------------------
 * The identifier `rows` live ENTIRELY in the PARENT (`MetadataDialog`): this
 * component never copies them into local state and never mutates them directly.
 * Every edit is reported upward through a callback — `onChangeKey(id, key)` /
 * `onChangeValue(id, value)` for in-place edits, `onRemoveRow(id)` for deletion,
 * and `onAddRow()` to append a blank row. Each row carries a stable `id` (the
 * parent's responsibility to keep stable across renders) that is used directly
 * as the React list key, so rows can be removed or reordered without React
 * reusing the wrong DOM node or warning about duplicate / index-based keys.
 *
 * The parent derives `rows` from a `Book.identifiers` map ({@link IdentifierMap},
 * a `Record<string, string>`) by mapping its entries to `{ id, key, value }`
 * triples, and can re-serialize back to a map on Save with
 * `Object.fromEntries(rows.map((r) => [r.key, r.value]))` — but Save is a
 * UI-only no-op in this prototype. An ordered `IdentifierRow[]` (rather than the
 * `Record` itself) is the prop shape because a `Record<string, string>` cannot
 * be edited ergonomically while a KEY is mid-typing (the key IS the map's
 * index): an explicit, id-keyed row array decouples a row's React identity from
 * its still-changing `key`.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node on the App 07 modal (`9:9`), Identifiers
 * region (sits directly BELOW the Tags chip editor `9:81`, which ends at y402,
 * and ABOVE the Synopsis textarea `9:117`, which begins at y590):
 *   • Label `9:102`           — the string "IDENTIFIERS", Inter SemiBold 600
 *                               10px, fill `#3A4060`, authored uppercase.
 *   • 3 rows `9:103/107/111`  — each 580×32, radius 7px, fill rgba(29,33,72,0.5),
 *                               1px rgba(255,255,255,0.06) border, holding a KEY
 *                               text (`#64748B`), a 1px×24 vertical divider, and
 *                               a VALUE text (`#94A3B8`). key:value ≈ 15.5%:84.5%
 *                               (divider at x90 of 580). Inter-row gap 6px.
 *   • "+ Add ID" `9:115`      — 120×28 hug-width, left-aligned, neutral fill
 *                               rgba(255,255,255,0.04), 1px rgba(255,255,255,0.07)
 *                               border, radius 6px, label "+ Add ID" `#64748B`.
 *
 * BLITZY [DESIGN] (editable rows vs. the static Figma rows — scope/intent):
 * The Figma frame is a STATIC display snapshot: each row is a single read-only
 * box split into KEY | divider | VALUE TEXT, with NO per-row remove control
 * (analyze_figma_node confirmed each row FRAME has exactly three children —
 * key text, 1px divider, value text — and explicitly noted "a remove affordance
 * is NOT part of the current Figma spec; if required by product behavior it must
 * be added as a new element"). This prototype's contract requires an
 * INTERACTIVE editor (AAP §0.1.1 "stateful interactions … backed by React
 * state"; §0.3.1 Workflow 5 — the Metadata Editor is editable), and the file's
 * agent contract — which has precedence over the subagent on scope/intent —
 * mandates each row be composed as a key {@link InputField}, a value
 * {@link InputField}, and a danger remove {@link Button}, with a secondary
 * "+ Add ID" {@link Button}. So the STRUCTURE follows the editable-editor
 * contract (three discrete primitive controls per row, replacing the static
 * single divided box), while the VISIBLE VALUES map to the same `@theme` tokens
 * the Figma resolves to. The per-row remove control is the deliberately-added
 * "new element" the subagent flagged; it uses the destructive `danger` Button
 * variant — the semantically correct treatment for a delete action.
 *
 * BLITZY [DESIGN] (the "Identifiers" label): analyze_figma_node reports label
 * `9:102` as `#3A4060`, Inter SemiBold 600, 10px, authored uppercase. Per the CP4
 * Figma-fidelity finding (§IdentifierRows L305) and D1 precedence (Figma is
 * authoritative for UI), the label now reproduces that EXACTLY —
 * `text-text-placeholder` (`#3A4060`) + `text-field-label` (Inter 600 / 10px) +
 * `uppercase` — replacing the earlier readable `text-text-muted` /
 * `text-meta-label` (400) reconciliation. The sibling `MetadataFields` field
 * labels and `TagChipEditor` "Tags" label adopt the SAME `#3A4060` / 600 treatment
 * in this CP4 pass, so the whole modal column stays consistent. The
 * `#3A4060`-on-`#13162E` contrast trade-off is recorded in the `LABEL_CLASSES`
 * BLITZY [A11Y] note. The `uppercase` utility (text-transform only — no color/size
 * token) honors Figma's authoritative uppercase case while the accessible DOM text
 * stays "Identifiers".
 *
 * BLITZY [DESIGN] (key field width + "+ Add ID" variant): both reconciled to
 * EXACT Figma values in the CP4 Figma-fidelity fix (finding §IdentifierRows L330):
 *   • KEY WIDTH → the editable key field is now a fixed 90px
 *     (`w-[var(--size-identifier-key-w)]` — the EXACT Figma key column, the
 *     `9:103` divider at x90 of the 580px row), replacing the prior slightly
 *     wider `w-28` (112px). The value field stays `flex-1`, so the key reads as
 *     the narrower of the two fields exactly as in Figma.
 *   • "+ Add ID" → realized with the new `ghost` Button variant, which reproduces
 *     the Figma quiet box (`9:115`) EXACTLY: white-4% fill (`--border-white-04`) /
 *     white-7% border (`--border-white-07`) / `#64748B` text (`text-text-muted`) /
 *     6px radius (`--radius-control-sm`) / 28px height (`--size-button-quiet-h`).
 *     This replaces the prior heavier `secondary` treatment (white-6% / white-9% /
 *     `#94A3B8` / 8px / 32px). (The sibling "+ Add format" stays `secondary`: its
 *     Figma is a PURPLE box, a different reconciliation flagged in
 *     `MetadataCoverColumn` BLITZY [COLOR].)
 *
 * BLITZY [DESIGN] (scheme-key casing): the Figma static mock labels the keys
 * "ISBN" / "Amazon" / "Goodreads", but this is an EDITABLE key field and `row.key`
 * is rendered VERBATIM — the component applies no `.toLowerCase()` / `.toUpperCase()`
 * and no CSS case transform (a `capitalize` transform could not produce both the
 * all-caps acronym "ISBN" and the title-case "Amazon" from one rule, and visually
 * transforming an editable input's text would desync what the user sees from what
 * is stored). The scheme key's case is therefore owned entirely by the parent's
 * `rows` data, which derives from `Book.identifiers` whose keys are the canonical
 * Calibre identifier scheme ids — conventionally lowercase (`isbn`, `amazon`,
 * `goodreads`, `google`, `doi`; cf. the design-parity reference `IdentifiersEdit`).
 * The empty-field `placeholder` ("e.g. isbn") reinforces that canonical lowercase
 * form. Presenting capitalized display labels, if ever desired, is a parent/data
 * concern, not a transform this controlled editor should impose.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / TYPOGRAPHY value resolves to an `@theme` token from
 * `src/app/globals.css`: the label is `text-text-placeholder` (`--color-text-placeholder`)
 * + `text-field-label` (`--text-field-label`), and the key-field width is the
 * `w-[var(--size-identifier-key-w)]` (90px) token. The field surface / border /
 * radius / placeholder colors and the button fills / borders / text colors / radii
 * live INSIDE the `InputField` and `Button` primitives (the `ghost` "+ Add ID"
 * variant's white-4% fill / white-7% border / 6px radius / muted text all resolve
 * to tokens there), so this file declares NO color / radius / typography literals
 * at all. The only bare utilities here are LAYOUT / appearance values that carry
 * no color information — Tailwind's standard spacing / flex scale (`flex`,
 * `flex-col`, `w-full`, `gap-2.5`, `gap-1.5`, `gap-1`, `items-center`, `shrink-0`,
 * `flex-1`, `min-w-0`, `self-start`) and the `uppercase` text-transform — all
 * permitted (matching the sibling primitives' usage). The three vertical gaps
 * reproduce the CONFIRMED Figma rhythm EXACTLY: `gap-1` (4px) label→first row
 * (`9:102`→`9:103`), `gap-1.5` (6px) inter-row (`9:103`→`9:107`→`9:111`), and
 * `gap-2.5` (10px) last row→"+ Add ID" button (`9:111`→`9:115`).
 *
 * RESPONSIVE INTEGRITY (1440 → 1280, zero horizontal overflow — AAP §0.9)
 * --------------------------------------------------------------------------
 * Each row is a `flex items-center` line whose value field is `flex-1 min-w-0`,
 * so the value absorbs ALL available and ALL reclaimed width: the fixed-width
 * key field (`w-[var(--size-identifier-key-w)] shrink-0`, 90px) and the
 * intrinsic-width remove button (`shrink-0`) keep their size while the value
 * field shrinks toward zero rather
 * than pushing the row past its container. The `min-w-0` is the critical guard —
 * without it a long unbroken value string would establish a min-content floor
 * and force horizontal overflow. The metadata column (~580px) far exceeds the
 * row's minimum, so the layout holds cleanly from the 1440px baseline down to
 * the 1280px floor.
 *
 * ACCESSIBILITY
 * --------------------------------------------------------------------------
 * • The "Identifiers" label is a non-interactive `<span>` (NOT a heading — it
 *   must not pollute the document outline). Visible label text is preserved.
 * • Each key / value `InputField` is given an explicit, position-based
 *   `aria-label` ("Identifier N scheme" / "Identifier N value") so the
 *   label-less inputs have clear, unique accessible names (the `InputField`
 *   primitive requires the caller to supply one).
 * • Each row's remove control is a real, keyboard-operable `Button` whose
 *   visible content is the "✕" glyph; an `aria-label` ("Remove identifier: …")
 *   overrides the glyph as the accessible name so screen-reader users hear a
 *   descriptive action rather than a punctuation character.
 * • The "+ Add ID" control is a real `Button` whose visible label is its
 *   accessible name.
 * • Color is never the sole signal — the destructive remove action carries the
 *   "✕" glyph in addition to its danger-tinted styling.
 *
 * @see src/components/primitives/InputField.tsx — the controlled input primitive.
 * @see src/components/primitives/Button.tsx       — the action primitive (danger / secondary).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3 (App 07) / §0.4.2 — component & token mapping.
 * @see src/calibre/gui2/metadata/basic_widgets.py — Calibre `IdentifiersEdit` (reference only).
 */

import type { JSX } from 'react';

import { InputField } from '@/components/primitives/InputField';
import { Button } from '@/components/primitives/Button';
import type { Book } from '@/types';

/**
 * The serialized identifier map shape — `Book.identifiers`, a
 * `Record<string, string>` keyed by scheme (e.g. `{ isbn: "978-…", amazon: "B0…" }`).
 *
 * This component edits an ordered {@link IdentifierRow}[] (see the file header
 * for why), but the canonical persisted shape on a {@link Book} is this map. The
 * parent `MetadataDialog` converts between the two at the component boundary —
 * `Object.entries(map)` → rows on open, and
 * `Object.fromEntries(rows.map((r) => [r.key, r.value]))` → map on Save (a
 * UI-only no-op here). Re-exported as a named alias so the parent can type its
 * conversion helpers against the exact same shape this editor was designed for.
 */
export type IdentifierMap = Book['identifiers'];

/**
 * A single editable identifier row.
 *
 * `id` is a stable, parent-owned identity used as the React list key, decoupled
 * from `key`/`value` so a row keeps its React identity (and DOM node + focus)
 * while its still-changing `key` is being typed. `key` is the identifier scheme
 * (e.g. `"isbn"`) and `value` is the identifier itself (e.g. `"978-0441013593"`).
 */
export interface IdentifierRow {
  /** Stable, unique row identity (parent-owned) used as the React list key. */
  id: string;
  /** Identifier scheme / namespace, e.g. `"isbn"`, `"amazon"`, `"goodreads"`. */
  key: string;
  /** Identifier value, e.g. `"978-0441013593"`. */
  value: string;
}

/**
 * Props for {@link IdentifierRows}.
 *
 * The row list is fully CONTROLLED by the parent (`MetadataDialog`): this
 * component renders `rows` and reports every edit / add / remove intent through
 * the callbacks. It deliberately exposes no value/variant styling props — the
 * look is fixed by the `InputField` / `Button` primitives and the design tokens.
 */
export interface IdentifierRowsProps {
  /**
   * The current, controlled list of identifier rows to render. Owned by the
   * parent; this component never mutates or locally caches it. Each row's `id`
   * MUST be stable across renders so it can serve as the React list key.
   */
  rows: IdentifierRow[];
  /**
   * Called with a row `id` and the next scheme string when the user edits a
   * row's KEY field. The parent updates that row's `key` in its state.
   */
  onChangeKey: (id: string, key: string) => void;
  /**
   * Called with a row `id` and the next value string when the user edits a
   * row's VALUE field. The parent updates that row's `value` in its state.
   */
  onChangeValue: (id: string, value: string) => void;
  /**
   * Called with a row `id` when the user activates that row's "✕" remove
   * control. The parent removes the row from its state.
   */
  onRemoveRow: (id: string) => void;
  /**
   * Called when the user activates "+ Add ID". The parent appends a new blank
   * row (typically `{ id: <fresh stable id>, key: '', value: '' }`) to its state.
   */
  onAddRow: () => void;
}

/**
 * Outer block: a full-width vertical stack holding the label-group (the label
 * stacked above the rows) and the add button. `gap-2.5` (10px) reproduces the
 * CONFIRMED Figma gap between the last identifier row and the "+ Add ID" button
 * (row3 bottom y540 → button top y550); `w-full` lets the rows span the full
 * metadata-column width so the responsive flex math has the real width.
 */
const CONTAINER_CLASSES = 'flex w-full flex-col gap-u10';

/**
 * The label-group: the "Identifiers" label stacked directly above the rows.
 * `gap-1` (4px) reproduces the CONFIRMED Figma gap between the label (`9:102`,
 * box bottom y428) and the first row (`9:103`, top y432), and matches the
 * sibling `TagChipEditor`'s identical label→container gap. Keeping the label and
 * rows in their own group lets the 4px label→rows gap and the 10px rows→button
 * gap each be an exact, token-scale `gap` (no margins — UI2). `w-full` lets the
 * inner rows stack span the full column width.
 */
const LABEL_GROUP_CLASSES = 'flex w-full flex-col gap-u4';

/**
 * The "Identifiers" section label — the EXACT App 07 Figma treatment (`9:102`):
 * `text-text-placeholder` (`#3A4060`) + `text-field-label` (Inter SemiBold 600 /
 * 10px) + `uppercase`. Per the CP4 Figma-fidelity finding (§IdentifierRows L305)
 * and D1 precedence (Figma is authoritative for UI), this replaces the earlier
 * readable `text-text-muted` / `text-meta-label` (400) reconciliation, and is now
 * IDENTICAL to the sibling `MetadataFields` field labels and `TagChipEditor`
 * "Tags" label so the whole modal column is consistent. Rendered on a `<span>`,
 * never a heading.
 *
 * BLITZY [A11Y]: `#3A4060` on the `#13162E` modal surface computes ≈1.55:1 —
 * below WCAG AA for text. Per D1 the explicit Figma value is reproduced EXACTLY
 * (never silently lightened); this flag records the gap for designer review. The
 * label is a non-essential caption (the editable rows below carry their own
 * accessible names), so meaning never rests on the label color alone.
 */
const LABEL_CLASSES = 'text-text-placeholder text-field-label uppercase';

/**
 * The vertical rows stack. `gap-1.5` (6px) reproduces the CONFIRMED Figma
 * inter-row gap exactly; `w-full` lets each row span the column width. Rendered
 * only when there is at least one row (the empty state shows just the label and
 * the add button).
 */
const ROWS_STACK_CLASSES = 'flex w-full flex-col gap-u6';

/**
 * A single identifier row: key field | value field | remove control, vertically
 * centered (`items-center`) with an 8px (`gap-2`) inter-control gap. The value
 * field grows / shrinks (see field-width consts) so the row never overflows.
 */
const ROW_CLASSES = 'flex items-center gap-u8';

/**
 * Key (scheme) field wrapper sizing: a fixed `w-[var(--size-identifier-key-w)]`
 * (90px — the EXACT Figma key column width, the `9:103` divider at x90 of the
 * 580px row) that `shrink-0` holds so the value field absorbs all reclaimed width
 * when the column narrows. Per the CP4 Figma-fidelity finding (§IdentifierRows
 * L330) this replaces the prior slightly-wider `w-28` (112px). The `InputField`
 * primitive owns the field's surface / border / radius / height / typography;
 * this only sizes the wrapper.
 */
const KEY_FIELD_CLASSES = 'w-[var(--size-identifier-key-w)] shrink-0';

/**
 * Value field wrapper sizing: `flex-1` grows it to fill the remaining row width
 * after the key field and remove control; `min-w-0` is the critical responsive
 * guard that lets it shrink BELOW its content's intrinsic width (so a long,
 * unbroken identifier string never forces horizontal overflow at the 1280px
 * floor). The `InputField` primitive owns the field's visuals; this only sizes
 * the wrapper.
 */
const VALUE_FIELD_CLASSES = 'flex-1 min-w-0';

/**
 * Per-row remove control sizing: `shrink-0` keeps the danger button at its
 * intrinsic width so it is the value field — never the button — that absorbs
 * width changes as the row narrows. The `Button` primitive's `danger` variant
 * owns the fill / border / text color / radius / height.
 */
const REMOVE_BUTTON_CLASSES = 'shrink-0';

/**
 * "+ Add ID" button alignment: `self-start` makes the button hug its content
 * (rather than stretch to the column's full width, the flex-column default) and
 * sit flush at the inline-start edge — matching the Figma button's left-aligned,
 * 120px hug-width placement (`9:115`). The `Button` primitive's `ghost` variant
 * owns the quiet fill / border / text color / radius / height.
 */
const ADD_BUTTON_CLASSES = 'self-start';

/** Placeholder shown in an empty KEY (scheme) field (AAP App 07 Identifiers). */
const KEY_PLACEHOLDER = 'e.g. isbn';
/** Placeholder shown in an empty VALUE field (AAP App 07 Identifiers). */
const VALUE_PLACEHOLDER = 'identifier value';
/** Visible label for the add-row action (verbatim Figma text, node `9:116`). */
const ADD_ID_LABEL = '+ Add ID';
/**
 * The remove control's visible glyph — "✕" (U+2715, MULTIPLICATION X), per the
 * file contract. It is the button's visible content; an `aria-label` supplies a
 * descriptive accessible name so it is never announced as bare punctuation.
 */
const REMOVE_GLYPH = '\u2715';

/**
 * IdentifierRows — the App 07 Metadata Editor "Identifiers" key/value editor.
 *
 * Renders a muted "Identifiers" label above a vertical stack of editable rows
 * (each a controlled key {@link InputField}, a controlled value
 * {@link InputField}, and a danger remove {@link Button}), followed by a
 * secondary "+ Add ID" {@link Button}. The component is fully controlled and
 * hook-free: `rows` and every mutation are owned by the parent. When `rows` is
 * empty, only the label and the add button render.
 *
 * @param props - {@link IdentifierRowsProps}
 * @returns The rendered Identifiers editor.
 */
export function IdentifierRows({
  rows,
  onChangeKey,
  onChangeValue,
  onRemoveRow,
  onAddRow,
}: IdentifierRowsProps): JSX.Element {
  return (
    <div className={CONTAINER_CLASSES}>
      {/* Label-group: the section label stacked directly above the rows, so the
          4px label→rows gap (LABEL_GROUP_CLASSES) and the 10px rows→button gap
          (CONTAINER_CLASSES) are each an exact, token-scale `gap` — never a
          margin (UI2) — matching the Figma vertical rhythm (9:102→9:103 = 4px,
          9:111→9:115 = 10px). */}
      <div className={LABEL_GROUP_CLASSES}>
        {/* Non-interactive section label (NOT a heading — keeps the document
            outline clean); visible text "Identifiers", displayed uppercase per
            Figma (node 9:102). */}
        <span className={LABEL_CLASSES}>Identifiers</span>

        {/* The editable rows. Rendered only when at least one row exists so the
            empty state collapses to just the label + add button (no stray gap). */}
        {rows.length > 0 && (
          <div className={ROWS_STACK_CLASSES}>
            {rows.map((row, index) => {
              // 1-based position for clear, unique field accessible names. The
              // React list key uses the stable `row.id` (NOT the index), so
              // removing / reordering rows never reuses the wrong DOM node.
              const position = index + 1;
              const removeAriaLabel = `Remove identifier: ${
                row.key.trim() || `row ${position}`
              }`;

              return (
                <div key={row.id} className={ROW_CLASSES}>
                  {/* KEY (scheme) field — controlled; reports edits with the row
                      id so the parent can update the right row. The `name` is
                      derived from the stable `row.id` so each form field has a
                      unique, stable identity (proper form semantics; no autofill /
                      "field should have id or name" advisories). */}
                  <InputField
                    variant="text"
                    name={`identifier-${row.id}-scheme`}
                    value={row.key}
                    onChange={(next) => onChangeKey(row.id, next)}
                    placeholder={KEY_PLACEHOLDER}
                    aria-label={`Identifier ${position} scheme`}
                    className={KEY_FIELD_CLASSES}
                  />

                  {/* VALUE field — controlled; grows to fill the row and shrinks
                      safely (flex-1 / min-w-0) for 1440→1280 integrity. The `name`
                      is derived from the stable `row.id` for the same reason. */}
                  <InputField
                    variant="text"
                    name={`identifier-${row.id}-value`}
                    value={row.value}
                    onChange={(next) => onChangeValue(row.id, next)}
                    placeholder={VALUE_PLACEHOLDER}
                    aria-label={`Identifier ${position} value`}
                    className={VALUE_FIELD_CLASSES}
                  />

                  {/* Destructive per-row remove. The "✕" glyph is the visible
                      label; `aria-label` overrides it with a descriptive name so
                      screen readers announce the action, not punctuation. */}
                  <Button
                    variant="danger"
                    label={REMOVE_GLYPH}
                    aria-label={removeAriaLabel}
                    onClick={() => onRemoveRow(row.id)}
                    className={REMOVE_BUTTON_CLASSES}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Append a new blank identifier row. The quiet `ghost` variant (white-4%
          fill / white-7% border / 6px radius / muted text / 28px height)
          reproduces the Figma "+ Add ID" quiet box (`9:115`) EXACTLY — replacing
          the prior heavier `secondary` treatment per the CP4 finding
          (§IdentifierRows L330). Hug width + left-aligned via ADD_BUTTON_CLASSES. */}
      <Button
        variant="ghost"
        label={ADD_ID_LABEL}
        onClick={onAddRow}
        className={ADD_BUTTON_CLASSES}
      />
    </div>
  );
}

export default IdentifierRows;
