'use client';

/**
 * ==========================================================================
 * Calibre-UI State — PreferencesProvider
 * UI-only application-settings Context (App 06 — Figma node `8:2`).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `PreferencesProvider` is the React Context provider that owns the application
 * settings of the Preferences screen in the UI-only Calibre e-book-manager
 * prototype (Next.js 15 App Router · React 19 · TypeScript 5 strict). It models,
 * against hardcoded mock defaults, everything App 06 renders and edits:
 *   1. the Default Font row — `fontFamily` + `fontSizePx` (node `8:33`);
 *   2. the 2×3 Reading-Behavior toggle grid — `readingBehavior`, keyed by the
 *      six toggle ids from `@/data/preferences`;
 *   3. the four Viewer-Theme swatches — `viewerTheme` (active = purple border +
 *      checkmark); and
 *   4. the Margins slider — `marginsPx` (the purple-filled track).
 * Defaults are seeded from `@/data/preferences`; the `PreferencesState` and
 * `ViewerTheme` shapes come from `@/types`. Consumed by the `components/
 * preferences/*` panels (App 06) and by the viewer's theme switch
 * (`components/viewer/ReaderToolbar`, node `4:8`) via the {@link usePreferences}
 * hook.
 *
 * SINGLE SOURCE OF TRUTH FOR `viewerTheme`
 * --------------------------------------------------------------------------
 * `viewerTheme` lives ONLY here. Both the App 06 theme swatches and the viewer
 * ReaderToolbar theme switch read and write it through {@link
 * PreferencesContextValue.setViewerTheme}, so the two surfaces can never
 * disagree. `ReaderProvider` deliberately exposes no `theme` field for exactly
 * this reason.
 *
 * DETERMINISTIC / SSR-SAFE (the defining correctness property)
 * --------------------------------------------------------------------------
 * Initial state is a deterministic clone of {@link defaultPreferences}, so the
 * server and the client render identically and the App Router hydrates the
 * Preferences screen with zero console/hydration errors. There is NO
 * `Math.random()`, NO `Date.now()`, NO `new Date()`, NO `window` / `document` /
 * `localStorage` access during render or in the state initializer, and NO
 * mount-time `useEffect` that mutates state. The provider is entirely
 * side-effect-free; every state change is driven by an explicit user action.
 *
 * UI-ONLY · IN-MEMORY · NO PERSISTENCE
 * --------------------------------------------------------------------------
 * All settings live in React state only — there is NO backend, NO API, NO
 * database, NO cookies, and NO `localStorage`. A page reload resets every
 * setting to {@link defaultPreferences}; that reset-on-reload is the intended
 * behavior (AAP §0.8.2 — "no required localStorage"). The App 06 header's
 * "Save & Restart" action is a UI-only no-op (a calling component may navigate
 * back to `/`, but nothing is persisted here); "Restore Defaults" maps to
 * {@link PreferencesContextValue.restoreDefaults}.
 *
 * THE CLONE INVARIANT (the one subtle trap)
 * --------------------------------------------------------------------------
 * The imported `defaultPreferences` object — and especially its nested
 * `readingBehavior` map — MUST NEVER be mutated, or a later `restoreDefaults`
 * would restore corrupted "defaults". Every entry point that seeds from the
 * defaults therefore routes through {@link clonePreferences}, which shallow-
 * clones the top level AND the nested `readingBehavior` object. All updates use
 * immutable spreads, so the shared default is never written through.
 *
 * COMPOSITION & CONSUMERS
 * --------------------------------------------------------------------------
 * Mounted in `app/layout.tsx` in the provider stack:
 *   LibraryProvider → PreferencesProvider → ReaderProvider → ModalProvider →
 *   AppShell (AAP §0.6.2). It is INDEPENDENT — it imports no other provider.
 * Read by the `components/preferences/*` panels and `components/viewer/
 * ReaderToolbar` through {@link usePreferences}.
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * --------------------------------------------------------------------------
 * The settings + "restore defaults" concepts conceptually parallel Calibre's
 * desktop preferences — `src/calibre/gui2/preferences/look_feel.py` (font /
 * appearance settings and its `restore_defaults()` that resets each child
 * widget) and `src/calibre/gui2/preferences/behavior.py` (its setting-
 * registration pattern and `restore_defaults`). NO Python/Qt code is imported,
 * translated, or executed — the parallel is conceptual only.
 *
 * @see @/types — the `PreferencesState` / `ViewerTheme` contracts consumed here.
 * @see @/data/preferences — the seeded default settings.
 * @see src/calibre/gui2/preferences/look_feel.py — Calibre look & feel (reference only).
 * @see src/calibre/gui2/preferences/behavior.py — Calibre behavior toggles (reference only).
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { PreferencesState, ViewerTheme } from '@/types';
import { defaultPreferences } from '@/data/preferences';

// ───────────────────────────────────────────────────────────────────────────
// Context value contract
// ───────────────────────────────────────────────────────────────────────────

/**
 * The value exposed by {@link PreferencesContext} and returned by
 * {@link usePreferences}. Holds the live settings plus the imperative actions
 * that mutate them. Every action is a pure state setter — none performs I/O,
 * navigation, or persistence.
 */
export interface PreferencesContextValue {
  /** Current settings (seeded from {@link defaultPreferences}; in-memory only). */
  preferences: PreferencesState;
  /** Set the Default Font family (App 06 Default Font row). */
  setFontFamily: (family: string) => void;
  /** Set the reading font size, in pixels (App 06 Default Font row). */
  setFontSize: (px: number) => void;
  /** Set a single reading-behavior toggle (2×3 grid) to an explicit value, by its key. */
  setBehavior: (key: string, value: boolean) => void;
  /** Flip a single reading-behavior toggle (2×3 grid) by its key. */
  toggleBehavior: (key: string) => void;
  /** Set the active viewer theme (App 06 swatches + viewer ReaderToolbar switch). */
  setViewerTheme: (theme: ViewerTheme) => void;
  /** Set the Margins slider value, in pixels (the purple-filled track). */
  setMargins: (px: number) => void;
  /** App 06 "Restore Defaults" — reset all settings to a fresh clone of {@link defaultPreferences}. */
  restoreDefaults: () => void;
}

// ───────────────────────────────────────────────────────────────────────────
// Helpers (pure, deterministic — safe to call during render / initialization)
// ───────────────────────────────────────────────────────────────────────────

/**
 * Clone a {@link PreferencesState} so the shared {@link defaultPreferences}
 * object is never mutated. Shallow-clones the top level AND the nested
 * `readingBehavior` map (the only nested object on the state) — the specific
 * value that would otherwise be aliased and corrupted by a toggle followed by a
 * later `restoreDefaults`. Pure and side-effect-free.
 */
function clonePreferences(p: PreferencesState): PreferencesState {
  return { ...p, readingBehavior: { ...p.readingBehavior } };
}

// ───────────────────────────────────────────────────────────────────────────
// Context
// ───────────────────────────────────────────────────────────────────────────

/**
 * The preferences Context. Defaults to `null` so {@link usePreferences} can
 * detect usage outside a {@link PreferencesProvider} and throw a descriptive
 * error rather than handing back a silently-undefined value.
 */
const PreferencesContext = createContext<PreferencesContextValue | null>(null);

// ───────────────────────────────────────────────────────────────────────────
// Provider
// ───────────────────────────────────────────────────────────────────────────

/**
 * Provides application-settings state to the subtree (App 06 + the viewer theme
 * switch).
 *
 * The state is initialized via a LAZY initializer that clones
 * {@link defaultPreferences} (see {@link clonePreferences}) so the imported
 * default — including its nested `readingBehavior` — is never mutated. Every
 * action is memoized with {@link useCallback} (stable identities, empty
 * dependency arrays — each uses the functional-update form of the setter, so it
 * never closes over `preferences`), and the exposed value is memoized with
 * {@link useMemo} so consumers re-render only when the settings or an action
 * identity actually change. Renders nothing of its own beyond the Context
 * provider wrapping `children`; all App 06 visuals live in
 * `components/preferences/*`.
 */
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<PreferencesState>(() =>
    clonePreferences(defaultPreferences),
  );

  const setFontFamily = useCallback((family: string) => {
    setPreferences((prev) => ({ ...prev, fontFamily: family }));
  }, []);

  const setFontSize = useCallback((px: number) => {
    setPreferences((prev) => ({ ...prev, fontSizePx: px }));
  }, []);

  const setBehavior = useCallback((key: string, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      readingBehavior: { ...prev.readingBehavior, [key]: value },
    }));
  }, []);

  const toggleBehavior = useCallback((key: string) => {
    setPreferences((prev) => ({
      ...prev,
      readingBehavior: { ...prev.readingBehavior, [key]: !prev.readingBehavior[key] },
    }));
  }, []);

  const setViewerTheme = useCallback((theme: ViewerTheme) => {
    setPreferences((prev) => ({ ...prev, viewerTheme: theme }));
  }, []);

  const setMargins = useCallback((px: number) => {
    setPreferences((prev) => ({ ...prev, marginsPx: px }));
  }, []);

  const restoreDefaults = useCallback(() => {
    setPreferences(clonePreferences(defaultPreferences));
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      preferences,
      setFontFamily,
      setFontSize,
      setBehavior,
      toggleBehavior,
      setViewerTheme,
      setMargins,
      restoreDefaults,
    }),
    [
      preferences,
      setFontFamily,
      setFontSize,
      setBehavior,
      toggleBehavior,
      setViewerTheme,
      setMargins,
      restoreDefaults,
    ],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

// ───────────────────────────────────────────────────────────────────────────
// Hook
// ───────────────────────────────────────────────────────────────────────────

/**
 * Access the application-settings state and actions.
 *
 * @returns the live {@link PreferencesContextValue}.
 * @throws if called outside a {@link PreferencesProvider} (the Context default
 *   is `null`), which surfaces a missing-provider mistake immediately instead of
 *   failing later with an opaque `undefined` access.
 */
export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (ctx === null) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return ctx;
}
