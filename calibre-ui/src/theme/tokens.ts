/**
 * Calibre-UI Design System — TypeScript token mirror.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * WHAT THIS FILE IS
 * ──────────────────────────────────────────────────────────────────────────
 * Mirror of the `@theme` block in `src/app/globals.css` (authoritative).
 * Keep byte-consistent. Source: Figma `JduUzjVHNhZivm5A0pAiCD`, AAP §0.3.2.
 *
 * This module is a 1:1, TypeScript-side mirror of the bespoke dark-navy
 * glassmorphic design tokens declared — once, as CSS custom properties inside a
 * Tailwind CSS v4 `@theme { … }` block — in `src/app/globals.css`. CSS is the
 * styling channel of record for the application; nearly all UI should consume
 * tokens via Tailwind utility classes or `var(--token)` custom properties.
 *
 * These typed, frozen (`as const`) constants exist for the RARE cases where a
 * token value is needed in JavaScript/TypeScript rather than in CSS — for
 * example:
 *   • the deterministic placeholder-cover generator in `@/lib/covers`
 *     (computing tints / typographic overlays from a book's identity);
 *   • computed inline `style={{ … }}` values that cannot be expressed as a
 *     static class;
 *   • any canvas / SVG / chart drawing code that needs raw hex / rgba strings.
 *
 * Consumed via the `@/theme` path alias (`tsconfig.json` → `"@/*": ["./src/*"]`):
 *   import { colors, gradients, radii } from '@/theme/tokens';
 *   const indigo = colors.accentIndigo; // '#4838C8'
 *
 * ──────────────────────────────────────────────────────────────────────────
 * HARD CONSTRAINTS (AAP §0.4.3 / §0.4.5)
 * ──────────────────────────────────────────────────────────────────────────
 * • EXACT-TOKEN FIDELITY — every value here is reproduced byte-for-byte from
 *   the AAP §0.3.2 Figma Token Manifest: zero approximation, zero snapping,
 *   zero rounding, zero color renaming. Hex digits stay UPPERCASE; rgba opacity
 *   forms are preserved verbatim (opacity such as zero-point-ten is NOT
 *   collapsed to zero-point-one); gradient strings preserve the `-45deg` angle
 *   and stop order exactly.
 * • BYTE-CONSISTENCY — `globals.css` is authoritative. If this file and
 *   `globals.css` ever diverge, `globals.css` wins. Both are authored from the
 *   same §0.3.2 manifest, so they match by construction.
 * • PURE DATA LEAF — this module imports NOTHING, runs no side effects at import
 *   time beyond declaring constants, renders no UI, and contains no JSX. It is
 *   framework-agnostic and intentionally carries NO client-component directive
 *   (it is safe to import from both Server and Client Components).
 * • BOUNDARY — per-book cover placeholder tints are NOT part of the named
 *   `@theme` token set and are deliberately NOT defined here; they belong to
 *   `@/lib/covers` (which may import named tokens such as `colors.accentIndigo`
 *   from this file but owns its own extra tint palette).
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * The Calibre appearance/theme settings page (`src/calibre/gui2/preferences/
 * look_feel.py`) is a Qt controller cited for conceptual parity only; it holds
 * no design tokens and nothing here is imported, translated, or reused from it.
 * Every value below is 100% Figma-derived (AAP §0.3.2).
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 — the Figma Token Manifest (single source of truth).
 */

// ---------------------------------------------------------------------------
// Colors — 29 named tokens (9 surfaces · 4 text · 3 accents · 13 semantic)
// ---------------------------------------------------------------------------
export const colors = {
  // surfaces / backgrounds
  bgApp: '#0C0E1A',
  titleBar: '#070810',
  surface1: '#10132A',
  surface2: '#13162E',
  card: '#181C3C',
  viewerBg: '#08080F',
  readingSurface: '#0F1020',
  codeBg: '#0A0B18',
  previewCream: '#F5F0E8',
  // text
  textPrimary: '#F1F5FF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textPlaceholder: '#3A4060',
  // accents
  accent: '#7B61FF',
  accentLight: '#A78BFA',
  accentIndigo: '#4838C8',
  // semantic — rating / format badges / danger
  star: '#F59E0B',
  formatEpub: '#4ADE80',
  formatMobi: '#FBBF24', // canonical MOBI token (amber); not the per-screen #A78BFA text styling
  formatPdf: '#F87171',
  danger: '#F87171',
  // semantic — App 04 code-editor syntax theme
  syntaxTag: '#A78BFA',
  syntaxAttr: '#38BDF8',
  syntaxString: '#FBBF24',
  syntaxValue: '#4ADE80',
  syntaxComment: '#64748B',
  // semantic — macOS window traffic-light dots
  windowDotRed: '#FF5F57',
  windowDotAmber: '#FFBD2E',
  windowDotGreen: '#28CA41',
} as const;

// ---------------------------------------------------------------------------
// Gradients — 2 named tokens (distinct: `accent` ≠ `cta`)
// ---------------------------------------------------------------------------
export const gradients = {
  // accent gradient (e.g. CheckBadge fill) — ends in accent-light #A78BFA
  accent: 'linear-gradient(-45deg, #7B61FF 0%, #A78BFA 100%)',
  // primary CTA gradient (e.g. Read Now / Save) — ends in accent-indigo #4838C8
  cta: 'linear-gradient(-45deg, #7B61FF 0%, #4838C8 100%)',
} as const;

// ---------------------------------------------------------------------------
// Borders — 5 named tokens (preserve `0.06`/`0.07`/`0.09`/`0.10` exactly)
// ---------------------------------------------------------------------------
export const borders = {
  white06: 'rgba(255,255,255,0.06)',
  white07: 'rgba(255,255,255,0.07)',
  white09: 'rgba(255,255,255,0.09)',
  white10: 'rgba(255,255,255,0.10)', // keep `0.10` — do NOT normalize to `0.1`
  accent: 'rgba(123,97,255,0.6)',
} as const;

// ---------------------------------------------------------------------------
// Scrims — 2 named tokens (modal overlay backdrops)
// ---------------------------------------------------------------------------
export const scrims = {
  convert: 'rgba(12,14,26,0.6)',
  metadata: 'rgba(0,0,0,0.55)',
} as const;

// ---------------------------------------------------------------------------
// Radii — 5 named tokens
// ---------------------------------------------------------------------------
export const radii = {
  badge: '3px',
  toolbar: '7px',
  control: '8px',
  card: '10px',
  dialog: '16px',
} as const;

// ---------------------------------------------------------------------------
// Shadows — 2 named tokens (dialog elevation)
// ---------------------------------------------------------------------------
export const shadows = {
  convert: '0 24px 64px rgba(0,0,0,0.6)',
  metadata: '0 20px 60px rgba(0,0,0,0.65)',
} as const;

// ---------------------------------------------------------------------------
// Typography — global Inter font-family + 13 per-role text scales
// ---------------------------------------------------------------------------

/**
 * Global font-family string. References the `--font-inter` CSS variable set up
 * by `next/font/google` in `layout.tsx`, with safe system fallbacks.
 */
export const fontFamily =
  'var(--font-inter), Inter, system-ui, -apple-system, sans-serif' as const;

/**
 * Per-role text scales (AAP §0.3.2). Each role carries `fontWeight` (number) and
 * `fontSize` (px string); `lineHeight` (px string) is present ONLY for roles
 * whose line-height is specified in the manifest.
 */
export const typography = {
  windowTitle: { fontWeight: 500, fontSize: '11px' },
  // `dialogHeading` fontSize: manifest gives a ~18–22px range; pinned to 20px.
  // MUST remain identical to the `--text-dialog-heading` value in globals.css.
  dialogHeading: { fontWeight: 600, fontSize: '20px' },
  detailTitle: { fontWeight: 600, fontSize: '15px', lineHeight: '22px' },
  coverTitle: { fontWeight: 700, fontSize: '14px', lineHeight: '18px' },
  cardTitle: { fontWeight: 600, fontSize: '11px', lineHeight: '15px' },
  body: { fontWeight: 400, fontSize: '12px' },
  metaLabel: { fontWeight: 400, fontSize: '10px' },
  metaValue: { fontWeight: 500, fontSize: '10px' },
  buttonPrimary: { fontWeight: 600, fontSize: '12px' },
  buttonSecondary: { fontWeight: 500, fontSize: '11px' },
  badge: { fontWeight: 500, fontSize: '8px' },
  toolbarLabel: { fontWeight: 400, fontSize: '9px' },
  readerBody: { fontWeight: 400, fontSize: '15px', lineHeight: '26px' },
} as const;

// ---------------------------------------------------------------------------
// Aggregate token object + derived literal types
// ---------------------------------------------------------------------------

/**
 * Aggregate of every token group, for ergonomic namespaced access:
 *   import tokens from '@/theme/tokens';
 *   tokens.colors.accent; tokens.radii.card;
 */
export const tokens = {
  colors,
  gradients,
  borders,
  scrims,
  radii,
  shadows,
  fontFamily,
  typography,
} as const;

/** Union of valid color token keys, e.g. `'bgApp' | 'accent' | …`. */
export type ColorToken = keyof typeof colors;
/** Union of valid gradient token keys: `'accent' | 'cta'`. */
export type GradientToken = keyof typeof gradients;
/** Union of valid border token keys, e.g. `'white06' | … | 'accent'`. */
export type BorderToken = keyof typeof borders;
/** Union of valid scrim token keys: `'convert' | 'metadata'`. */
export type ScrimToken = keyof typeof scrims;
/** Union of valid radius token keys, e.g. `'badge' | … | 'dialog'`. */
export type RadiusToken = keyof typeof radii;
/** Union of valid shadow token keys: `'convert' | 'metadata'`. */
export type ShadowToken = keyof typeof shadows;
/** Union of valid typography role keys, e.g. `'windowTitle' | … | 'readerBody'`. */
export type TypographyToken = keyof typeof typography;
/** The fully-typed shape of the aggregate `tokens` object. */
export type Tokens = typeof tokens;

export default tokens;
