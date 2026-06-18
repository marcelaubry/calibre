'use client';

/**
 * ==========================================================================
 * Calibre-UI Design System — Textarea
 * The single multi-line text-entry primitive.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `Textarea` is a bespoke design-system primitive (the multi-line sibling of
 * {@link InputField}) for the UI-only Calibre e-book-manager prototype
 * (Next.js 15 App Router · React 19 · TypeScript 5 strict · Tailwind CSS v4
 * CSS-first tokens). It is the ONE controlled multi-line text-entry control —
 * used most authoritatively by the App 07 Metadata Editor's "Synopsis" field
 * (Figma `9:9`). Screen code must NEVER hand-roll a raw `<textarea>`; it always
 * composes this primitive so the surface, border, radius, placeholder, focus,
 * and typography stay identical and 100% token-backed across every screen — the
 * exact same canonical field look as {@link InputField}, only multi-line.
 *
 * Introduced by the CP4 Figma-fidelity fix (finding §MetadataFields L677): the
 * Synopsis previously used a raw token-styled `<textarea>` because no Textarea
 * primitive existed (a design-system coverage gap, Rules R4). This primitive
 * closes that gap so the Synopsis is primitive-backed like every other field.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * This primitive renders a real, CONTROLLED `<textarea>` (its `value` is owned
 * by the caller and every keystroke is reported through `onChange`), so it must
 * be a Client Component — App Router components default to Server Components,
 * which cannot bind change handlers. The directive is the very first line,
 * before any import.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Shares the canonical field look reconciled for {@link InputField} against the
 * Metadata Editor modal (`9:9`):
 *   • RESTING fill   → `#181C3C` (= `--color-card`)
 *   • RESTING border → `rgba(255,255,255,0.09)` 1px (= `--border-white-09`)
 *   • RADIUS         → `8px` (= `--radius-control`)
 *   • PLACEHOLDER    → `#3A4060` (= `--color-text-placeholder`)
 *   • VALUE text     → `#F1F5FF` (= `--color-text-primary`)
 *   • TYPOGRAPHY     → `text-body` (Inter 400 / 12px), with a relaxed
 *                      multi-line `leading` for readability.
 * FOCUS (EXACT Figma, NO glow — identical to `InputField`): `focus:bg-accent/10`
 * + `focus:border-accent/50`, with the default UA outline removed. `:focus`
 * (not `:focus-visible`) reveals the active affordance whenever the field is
 * focused — including by mouse click — which is when the user begins typing.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / radius / typography value resolves to an `@theme` token,
 * consumed via a Tailwind v4 utility (`bg-card`, `rounded-control`,
 * `text-text-primary`, `text-body`, `placeholder:text-text-placeholder`), an
 * opacity-modifier on a color token (`bg-accent/10`, `border-accent/50`), or a
 * CSS-variable arbitrary value (`border-[var(--border-white-09)]`). There are NO
 * raw hex / rgba color literals. The only bare literals are LAYOUT values that
 * carry no color information — paddings (`px-3`, `py-2`), `w-full`, the
 * `leading-relaxed` line-height, and `resize-none`.
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/metadata/
 * single.py` (the Qt metadata editor whose comments field this textarea is the
 * web analog of). Nothing is imported or translated from the Python codebase.
 *
 * @see src/components/primitives/InputField.tsx — the single-line sibling.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.3 / §0.4.2 / §0.7.4 (App 07) — component manifest.
 */

import type { ChangeEvent, JSX, TextareaHTMLAttributes } from 'react';

/**
 * Props for {@link Textarea}.
 *
 * Extends the native `<textarea>` attribute set (so `id`, `name`, `rows`,
 * `aria-*`, `disabled`, `readOnly`, `maxLength`, `style`, … are all forwarded
 * via `...rest`) EXCEPT `onChange`, which is re-declared below with a simpler
 * value-first signature suited to this controlled primitive.
 */
export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  /** The current (controlled) field value. Always rendered as-is. */
  value: string;
  /**
   * Called on every edit with the textarea's NEXT string value (already
   * unwrapped from the change event, so callers can bind `onChange={setValue}`
   * directly). Optional so the field can be rendered read-only / display-only.
   */
  onChange?: (value: string) => void;
  /**
   * Placeholder shown when the field is empty, rendered in the muted
   * `--color-text-placeholder` (#3A4060) token.
   */
  placeholder?: string;
}

/**
 * The single canonical, token-backed multi-line field — the exact `InputField`
 * surface, plus multi-line affordances:
 *
 * - Box: `block w-full` fills the wrapping container (callers size width via the
 *   merged `className`); `resize-none` keeps the Figma-fixed box (height comes
 *   from the native `rows` attribute the caller forwards).
 * - Surface: `bg-card` (#181C3C) + 1px `border-[var(--border-white-09)]` +
 *   `rounded-control` (8px) — CONFIRMED for the metadata fields (`9:9`).
 * - Type: `text-text-primary` (#F1F5FF) value + `placeholder:text-text-placeholder`
 *   (#3A4060) + the `text-body` (12px) scale at `leading-relaxed` for readable
 *   multi-line text. Padding `px-3 py-2`.
 * - Focus (EXACT Figma, NO glow): `focus:bg-accent/10` + `focus:border-accent/50`,
 *   default UA outline removed (`outline-none`). Color animates when motion is
 *   allowed (UI6).
 */
const BASE_TEXTAREA_CLASSES =
  'block w-full resize-none bg-card border border-[var(--border-white-09)] rounded-control ' +
  'px-3 py-2 text-text-primary text-body leading-relaxed placeholder:text-text-placeholder ' +
  'outline-none ' +
  'focus:bg-accent/10 focus:border-accent/50 ' +
  'motion-safe:transition-colors';

/**
 * Textarea — the bespoke design-system multi-line text-entry primitive.
 *
 * Renders a single CONTROLLED `<textarea>`. The caller `className` is merged
 * onto the textarea (after the base, so caller utilities such as width/height
 * win) and all remaining native attributes are spread via `...rest`, with
 * `value` / `onChange` / `placeholder` applied AFTER the spread so they always
 * take effect. The textarea always carries a change handler (so React never
 * warns about a controlled field without `onChange`); when the caller omits
 * `onChange`, edits are simply not propagated.
 *
 * @param props - {@link TextareaProps}
 * @returns The rendered multi-line field.
 */
export function Textarea({
  value,
  onChange,
  placeholder,
  className,
  ...rest
}: TextareaProps): JSX.Element {
  // Merge caller className AFTER the base so caller utilities win on conflicts.
  const textareaClassName = [BASE_TEXTAREA_CLASSES, className]
    .filter(Boolean)
    .join(' ');

  // Controlled-change adapter: hand the caller the unwrapped NEXT string value
  // (not the raw event), so screen code binds `onChange={setValue}` directly.
  // Optional-chained so an omitted `onChange` is a safe no-op.
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    onChange?.(event.target.value);
  };

  return (
    <textarea
      {...rest}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={textareaClassName}
    />
  );
}

export default Textarea;
