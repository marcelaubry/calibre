'use client';

/**
 * ==========================================================================
 * Calibre-UI State — ModalProvider
 * UI-only modal-overlay state Context (App 05 Convert · App 07 Metadata).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ModalProvider` is the React Context provider that owns the open-state of the
 * app's two modal overlays in the UI-only Calibre e-book-manager prototype
 * (Next.js 15 App Router · React 19 · TypeScript 5 strict). It tracks exactly
 * two things:
 *   1. WHICH modal is open — `openModal: ModalKind` (`'convert' | 'metadata' |
 *      null`), or `null` when none is open; and
 *   2. the modal's TARGET book — `targetBookId: string | null` (the book being
 *      converted / edited).
 * The two overlays are:
 *   • the Convert Books dialog — App 05, Figma node `6:9`  (`'convert'`)
 *   • the Metadata Editor      — App 07, Figma node `9:9`  (`'metadata'`)
 *
 * ROUTE-INDEPENDENT OVERLAYS (the defining correctness property)
 * --------------------------------------------------------------------------
 * These modals overlay the dimmed library and DO NOT change the route — they
 * are NOT route segments (AAP §0.1.1, §0.6.2). This provider therefore holds
 * open-state ONLY and MUST NEVER touch the router: there is no `next/navigation`
 * import, no `useRouter`, no `router.push`, and no `window.location` here.
 * Toggling Convert/Metadata produces zero route changes (the App Router stays on
 * `/` or `/grid`) and zero console errors. `AppShell` reads `openModal` to mount
 * `ModalShell → ConvertDialog / MetadataDialog`; those dialogs subscribe via
 * {@link useModal} to decide whether to render and call {@link
 * ModalContextValue.close} from Cancel / Save / Apply / × / scrim-click.
 *
 * UI-ONLY · IN-MEMORY · DETERMINISTIC / SSR-SAFE
 * --------------------------------------------------------------------------
 * State is in-memory React state only — there is NO backend, NO API, NO
 * database, and NO persistence (a reload resets to no-modal-open). The initial
 * state is a constant (`openModal = null`, `targetBookId = null`); render and
 * initialization use NO `Math.random`, `Date.now`, `window`, or `localStorage`,
 * and NO mount-time `useEffect` mutates state. This determinism keeps the
 * provider safe under React Server Components hydration and satisfies the
 * zero-console-errors gate.
 *
 * DECOUPLED FROM THE BOOKS DATASET (id only)
 * --------------------------------------------------------------------------
 * This provider stores only a `targetBookId: string | null`; it does NOT import
 * `@/data/books` or the `Book` type and has no dependency on any other provider.
 * Consumers that need the full target `Book` resolve it themselves via
 * `useLibrary().books.find(b => b.id === targetBookId)` at the dialog boundary —
 * NOT here. Keeping the modal state dependency-light (its only import is the
 * `ModalKind` type from `@/types`) avoids a books→modal coupling and lets any
 * call site drive it.
 *
 * COMPOSITION & CONSUMERS
 * --------------------------------------------------------------------------
 * Mounted in `app/layout.tsx` as the innermost data provider:
 *   LibraryProvider → PreferencesProvider → ReaderProvider → ModalProvider →
 *   AppShell (AAP §0.6.2). It is independent of the providers above it.
 * Driven (opened) by: `TopToolbar` ("Convert"), and `BookDetailPanel` /
 * `BatchActionsPanel` ("Convert Format", "Edit Metadata"). Read by:
 * `AppShell`, `ConvertDialog`, and `MetadataDialog` — all via {@link useModal}.
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * --------------------------------------------------------------------------
 * The concept of launching a book dialog (Convert / Edit Metadata) against a
 * selected book from the library context conceptually parallels Calibre's
 * desktop client (`src/calibre/gui2/library/views.py`, where `BooksView`
 * connects actions such as `iactions['Edit Metadata'].edit_metadata` to the
 * current selection). NO Python/Qt code is imported, translated, or executed —
 * the parallel is conceptual only.
 *
 * @see @/types — the `ModalKind` union consumed here.
 * @see src/components/primitives/ModalShell — the dialog scaffold this state drives (reference only).
 * @see src/calibre/gui2/library/views.py — Calibre `BooksView` (design-parity reference only).
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ModalKind } from '@/types';

/**
 * A modal kind that can actually be OPENED — the `ModalKind` union with its
 * `null` ("closed") member excluded. This narrows {@link ModalContextValue.open}
 * so call sites can only request a real dialog (`'convert' | 'metadata'`);
 * passing `null` (or any other string) to `open` is a compile-time type error.
 * Use {@link ModalContextValue.close} to return to the closed state.
 */
type OpenableModal = Exclude<ModalKind, null>; // 'convert' | 'metadata'

/**
 * The value exposed by {@link ModalContext} and returned by {@link useModal}.
 *
 * Holds the modal open-state plus the imperative actions that mutate it. All
 * actions are pure state setters — none performs navigation.
 */
export interface ModalContextValue {
  /** Which modal is open, or `null` when none. */
  openModal: ModalKind;
  /** The book the modal targets (e.g. the book being converted / edited), or `null`. */
  targetBookId: string | null;
  /** Convenience: `true` when any modal is open (derived from `openModal`). */
  isOpen: boolean;
  /** Open a specific modal, optionally targeting a book. */
  open: (kind: OpenableModal, bookId?: string | null) => void;
  /** Open the Convert Books dialog (App 05), optionally for a book. */
  openConvert: (bookId?: string | null) => void;
  /** Open the Metadata Editor (App 07), optionally for a book. */
  openMetadata: (bookId?: string | null) => void;
  /** Close any open modal and clear the target. Never navigates. */
  close: () => void;
}

/**
 * The modal-overlay Context. Defaults to `null` so {@link useModal} can detect
 * usage outside a {@link ModalProvider} and throw a descriptive error rather
 * than handing back a silently-undefined value.
 */
const ModalContext = createContext<ModalContextValue | null>(null);

/**
 * Provides modal-overlay open-state to the subtree.
 *
 * Holds `openModal` and `targetBookId` in React state initialized to constants
 * (`null` / `null`) for deterministic, SSR-safe rendering. The action callbacks
 * are memoized with {@link useCallback} (stable identities, empty dependency
 * arrays — they only call state setters), and the exposed value is memoized with
 * {@link useMemo} so consumers re-render only when the open-state actually
 * changes. Renders nothing of its own beyond the Context provider wrapping
 * `children`; all modal visuals live in `primitives/ModalShell`,
 * `components/convert/*`, and `components/metadata/*`.
 */
export function ModalProvider({ children }: { children: ReactNode }) {
  const [openModal, setOpenModal] = useState<ModalKind>(null);
  const [targetBookId, setTargetBookId] = useState<string | null>(null);

  const open = useCallback((kind: OpenableModal, bookId: string | null = null) => {
    setOpenModal(kind);
    setTargetBookId(bookId);
  }, []);

  const openConvert = useCallback((bookId: string | null = null) => {
    setOpenModal('convert');
    setTargetBookId(bookId);
  }, []);

  const openMetadata = useCallback((bookId: string | null = null) => {
    setOpenModal('metadata');
    setTargetBookId(bookId);
  }, []);

  const close = useCallback(() => {
    setOpenModal(null);
    setTargetBookId(null);
  }, []);

  const value = useMemo<ModalContextValue>(
    () => ({
      openModal,
      targetBookId,
      isOpen: openModal !== null,
      open,
      openConvert,
      openMetadata,
      close,
    }),
    [openModal, targetBookId, open, openConvert, openMetadata, close],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

/**
 * Access the modal-overlay state and actions.
 *
 * @returns the live {@link ModalContextValue}.
 * @throws if called outside a {@link ModalProvider} (the Context default is
 *   `null`), which surfaces a missing-provider mistake immediately instead of
 *   failing later with an opaque `undefined` access.
 */
export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (ctx === null) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return ctx;
}
