/**
 * `@/data/books` — the application's mock book catalog (the catalog of record).
 *
 * ──────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ──────────────────────────────────────────────────────────────────────────
 * Single source of truth for the prototype's book data: a fixed array of
 * EXACTLY 15 fully-populated {@link Book} objects. This dataset seeds
 * `LibraryProvider` and flows into every screen that shows a book — the App01
 * library list table, the App02 cover grid (5×3 = 15 cards), the App03 viewer
 * header, the App05 Convert modal, and the App07 Metadata modal — and it is the
 * source `@/data/sidebar` reads to derive its facet counts (sections, tags,
 * authors). Many downstream invariants depend on this file: the status bar
 * reads "15 books", the grid is exactly 5×3, and the sidebar counts are
 * computed from these entries — so the count, order, and field completeness are
 * load-bearing, not cosmetic.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * EXACTLY 15, FIXED ORDER (AAP §0.1.2 — non-negotiable)
 * ──────────────────────────────────────────────────────────────────────────
 * The catalog is exactly these 15 science-fiction titles, in this order:
 * Dune, Neuromancer, Foundation, 1984, Brave New World, The Martian,
 * Snow Crash, Ender's Game, The Expanse, Hyperion, The Left Hand of Darkness,
 * A Fire Upon the Deep, Blindsight, Accelerando, Use of Weapons. Not 14, not 16
 * — exactly 15, and the order must match character-for-character.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * UI-ONLY / MOCK DATA — DETERMINISTIC & SSR-SAFE
 * ──────────────────────────────────────────────────────────────────────────
 * Pure, deterministic, SSR-safe data: static TypeScript literals plus a single
 * deterministic `.map`. There is NO backend, NO database, NO API, NO real file
 * I/O, and NO `fetch`. There is NO `Math.random`, NO `Date.now`, and NO
 * `new Date()` — so module evaluation yields byte-identical output on the server
 * and the client, preventing React hydration-mismatch console errors (the "zero
 * console errors" gate). The module carries no `'use client'` directive and
 * exposes only named exports (no default export); there is no barrel
 * `index.ts` in `data/`, so consumers import from `@/data/books` directly.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * GENERATED COVERS ONLY — NEVER REAL ART (AAP §0.9)
 * ──────────────────────────────────────────────────────────────────────────
 * Each book's `coverUrl` is a generated placeholder produced deterministically
 * by {@link generateCoverDataUri} from `@/lib/covers` (a tinted SVG `data:` URI
 * with an Inter-Bold title overlay, derived from the book's own identity). NO
 * real, copyrighted cover art, remote image URL, encoded-image blob, or external
 * link is ever embedded here. The seed→map construction below resolves the
 * cover-is-derived-from-the-book chicken-and-egg cleanly while keeping the whole
 * module a deterministic static literal.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ORIGINAL PROSE — COPYRIGHT-SAFE BY DESIGN
 * ──────────────────────────────────────────────────────────────────────────
 * Every `synopsis` is ORIGINAL prose written for this prototype. It does NOT
 * reproduce real jacket/back-cover copy or any copyrighted description; each
 * blurb is a short, neutral, original summary that weaves in the book's
 * publication year for flavor.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * `date` SEMANTICS = "DATE ADDED" (AAP §0.7.4)
 * ──────────────────────────────────────────────────────────────────────────
 * The App01 table column is "Date Added", and {@link Book} carries a single
 * `date` field, so `date` is the (recent) date the book was added to the
 * library — NOT the publication year. The publication year lives in the
 * `synopsis` text instead.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * ──────────────────────────────────────────────────────────────────────────
 * The field set mirrors, for visual/structural parity only, Calibre's desktop
 * client: `src/calibre/gui2/library/models.py` (`BooksModel` columns — title,
 * authors→author, timestamp→date, rating with `allow_half_stars` → 0.5-step
 * rating, tags, series (+ series_index), formats→format, size→sizeBytes,
 * comments→synopsis, identifiers) and `src/calibre/gui2/book_details.py` (which
 * confirms the series/tags/formats/identifiers/comments/rating fields rendered
 * in a detail view). NO Python/Qt code is imported, translated, or executed —
 * the Calibre tree is a read-only conceptual reference.
 *
 * @see ./../types/book.ts — the authoritative, verbatim {@link Book} contract (AAP §0.1.2).
 * @see ./../lib/covers.ts — {@link generateCoverDataUri} (deterministic generated covers).
 * @see src/calibre/gui2/library/models.py — Calibre `BooksModel` (reference only).
 * @see src/calibre/gui2/book_details.py — Calibre book details (reference only).
 */

import type { Book } from '@/types';
import { generateCoverDataUri } from '@/lib/covers';

/**
 * A book "seed" — every {@link Book} field EXCEPT the generated `coverUrl`.
 *
 * Authoring seeds (rather than full `Book` literals) lets us declare the data
 * cleanly and then derive `coverUrl` deterministically from each seed's own
 * identity in a single `.map` (see {@link books}). Standalone titles simply
 * OMIT the optional `series` key.
 */
type BookSeed = Omit<Book, 'coverUrl'>;

/**
 * The 15 book seeds, in the exact AAP §0.1.2 order. Standalone titles (1984,
 * Brave New World, The Martian, Snow Crash, Accelerando) OMIT `series` entirely
 * (the `?` optional marker on `Book.series` — never `series: undefined`).
 * Format mix is EPUB ×10, MOBI ×3, PDF ×2; ratings are all 0.5-increment legal.
 */
const bookSeeds: BookSeed[] = [
  {
    id: 'book-01',
    title: 'Dune',
    author: 'Frank Herbert',
    series: 'Dune Chronicles',
    date: '2024-01-12',
    rating: 5,
    tags: ['Space Opera', 'Politics', 'Ecology'],
    format: 'EPUB',
    sizeBytes: 2415919,
    identifiers: { isbn: '9780441013593', goodreads: '44767458', amazon: '0441013597' },
    synopsis:
      "A political and ecological epic set on the desert world of Arrakis, where control of a rare and precious spice shapes the fate of empires. Frank Herbert's 1965 saga follows a young heir who becomes the focal point of prophecy, betrayal, and revolution.",
  },
  {
    id: 'book-02',
    title: 'Neuromancer',
    author: 'William Gibson',
    series: 'Sprawl Trilogy',
    date: '2024-02-03',
    rating: 4.5,
    tags: ['Cyberpunk', 'Artificial Intelligence', 'Noir'],
    format: 'EPUB',
    sizeBytes: 1178531,
    identifiers: { isbn: '9780441569595', goodreads: '22328' },
    synopsis:
      "William Gibson's 1984 cyberpunk landmark follows a burned-out console cowboy hired for one last run through cyberspace. Neon, artificial intelligence, and corporate intrigue define a future stitched together from data and desire.",
  },
  {
    id: 'book-03',
    title: 'Foundation',
    author: 'Isaac Asimov',
    series: 'Foundation',
    date: '2023-11-20',
    rating: 4.5,
    tags: ['Space Opera', 'Galactic Empire', 'Classic'],
    format: 'MOBI',
    sizeBytes: 1356204,
    identifiers: { isbn: '9780553293357', goodreads: '29579' },
    synopsis:
      "As a vast galactic empire slides toward collapse, a mathematician's new science of psychohistory predicts a coming dark age — and a daring plan to shorten it. Isaac Asimov's 1951 classic opens a sweeping chronicle of civilization and power.",
  },
  {
    id: 'book-04',
    title: '1984',
    author: 'George Orwell',
    date: '2023-09-15',
    rating: 5,
    tags: ['Dystopia', 'Politics', 'Classic'],
    format: 'EPUB',
    sizeBytes: 1022976,
    identifiers: { isbn: '9780451524935', goodreads: '5470', google: 'kotPYEqx7kMC' },
    synopsis:
      "George Orwell's 1949 dystopia imagines a society under total surveillance, where language and memory are weapons of the state. One clerk's quiet rebellion tests how much truth can survive absolute power.",
  },
  {
    id: 'book-05',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    date: '2023-10-02',
    rating: 4,
    tags: ['Dystopia', 'Classic', 'Society'],
    format: 'PDF',
    sizeBytes: 3884512,
    identifiers: { isbn: '9780060850524', goodreads: '5129' },
    synopsis:
      "Aldous Huxley's 1932 vision of engineered happiness trades freedom for comfort in a rigidly ordered future. When an outsider begins to question the system, the true cost of perfect stability comes into focus.",
  },
  {
    id: 'book-06',
    title: 'The Martian',
    author: 'Andy Weir',
    date: '2024-03-19',
    rating: 4.5,
    tags: ['Hard SF', 'Survival', 'Mars'],
    format: 'EPUB',
    sizeBytes: 1996488,
    identifiers: { isbn: '9780553418026', goodreads: '18007564', amazon: '0553418025' },
    synopsis:
      "Stranded alone on Mars after a mission goes wrong, an astronaut improvises his way toward survival with science, stubbornness, and humor. Andy Weir's 2011 debut turns relentless problem-solving into a gripping fight to stay alive.",
  },
  {
    id: 'book-07',
    title: 'Snow Crash',
    author: 'Neal Stephenson',
    date: '2024-04-07',
    rating: 4,
    tags: ['Cyberpunk', 'Metaverse', 'Satire'],
    format: 'EPUB',
    sizeBytes: 2201640,
    identifiers: { isbn: '9780553380958', goodreads: '830' },
    synopsis:
      "Neal Stephenson's 1992 romp races between a fractured America and a sprawling virtual Metaverse while chasing a mind-altering data plague. A pizza-delivering hacker and a teenage courier collide with myth, code, and commerce.",
  },
  {
    id: 'book-08',
    title: "Ender's Game",
    author: 'Orson Scott Card',
    series: "Ender's Saga",
    date: '2024-05-22',
    rating: 4.5,
    tags: ['Military SF', 'Coming of Age'],
    format: 'MOBI',
    sizeBytes: 1488972,
    identifiers: { isbn: '9780812550702', goodreads: '375802' },
    synopsis:
      "A gifted child is recruited into a military academy where simulated war games conceal a far graver purpose. Orson Scott Card's 1985 novel weighs genius, empathy, and the ethics of command.",
  },
  {
    id: 'book-09',
    title: 'The Expanse',
    author: 'James S. A. Corey',
    series: 'The Expanse',
    date: '2024-06-30',
    rating: 4.5,
    tags: ['Space Opera', 'Hard SF'],
    format: 'EPUB',
    sizeBytes: 2785133,
    identifiers: { isbn: '9780316129084', goodreads: '8855321' },
    synopsis:
      "A missing-person case and a derelict ship ignite tensions among Earth, Mars, and the Belt. James S. A. Corey's 2011 space opera blends hard science, hard politics, and a solar system on the brink of war.",
  },
  {
    id: 'book-10',
    title: 'Hyperion',
    author: 'Dan Simmons',
    series: 'Hyperion Cantos',
    date: '2024-07-14',
    rating: 5,
    tags: ['Space Opera', 'Literary SF'],
    format: 'EPUB',
    sizeBytes: 2523447,
    identifiers: { isbn: '9780553283686', goodreads: '77566' },
    synopsis:
      "Seven pilgrims journey toward a deadly enigma, each recounting the tale that drew them there. Dan Simmons's 1989 novel weaves their stories into a rich tapestry of myth, time, and dread.",
  },
  {
    id: 'book-11',
    title: 'The Left Hand of Darkness',
    author: 'Ursula K. Le Guin',
    series: 'Hainish Cycle',
    date: '2024-08-09',
    rating: 4.5,
    tags: ['Anthropological SF', 'Classic'],
    format: 'PDF',
    sizeBytes: 2960201,
    identifiers: { isbn: '9780441478125', goodreads: '18423' },
    synopsis:
      "On an icy world whose inhabitants embody no fixed gender, a lone envoy struggles to bridge two wary cultures. Ursula K. Le Guin's 1969 masterwork examines identity, loyalty, and what it means to be human.",
  },
  {
    id: 'book-12',
    title: 'A Fire Upon the Deep',
    author: 'Vernor Vinge',
    series: 'Zones of Thought',
    date: '2024-09-01',
    rating: 4,
    tags: ['Space Opera', 'Hard SF', 'First Contact'],
    format: 'EPUB',
    sizeBytes: 2645880,
    identifiers: { isbn: '9780812515282', goodreads: '77711' },
    synopsis:
      "An ancient power awakens at the galaxy's edge, and a desperate rescue hinges on a world of pack-minded aliens. Vernor Vinge's 1992 epic spans zones of thought where the very laws of intelligence change.",
  },
  {
    id: 'book-13',
    title: 'Blindsight',
    author: 'Peter Watts',
    series: 'Firefall',
    date: '2024-09-28',
    rating: 4,
    tags: ['Hard SF', 'First Contact', 'Transhumanism'],
    format: 'EPUB',
    sizeBytes: 1703226,
    identifiers: { isbn: '9780765319647', goodreads: '48484' },
    synopsis:
      "A crew of radically augmented humans is sent to meet an enigmatic intelligence at the solar system's rim. Peter Watts's 2006 novel interrogates consciousness, selfhood, and whether sentience is an advantage at all.",
  },
  {
    id: 'book-14',
    title: 'Accelerando',
    author: 'Charles Stross',
    date: '2024-10-16',
    rating: 4,
    tags: ['Hard SF', 'Singularity', 'Transhumanism'],
    format: 'MOBI',
    sizeBytes: 1902774,
    identifiers: { isbn: '9780441014156', goodreads: '17863' },
    synopsis:
      "Charles Stross's 2005 mosaic follows three generations through an accelerating technological singularity. Economies, identities, and minds are remade as the future arrives faster than anyone can adapt.",
  },
  {
    id: 'book-15',
    title: 'Use of Weapons',
    author: 'Iain M. Banks',
    series: 'Culture',
    date: '2024-11-05',
    rating: 4.5,
    tags: ['Space Opera', 'Culture', 'Literary SF'],
    format: 'EPUB',
    sizeBytes: 2088419,
    identifiers: { isbn: '9781857231359', goodreads: '129387' },
    synopsis:
      "A skilled operative is drawn back into service by a vast, benevolent civilization for one more mission. Iain M. Banks's 1990 Culture novel braids past and present toward a haunting revelation.",
  },
];

/**
 * The application's mock catalog: exactly 15 fully-populated {@link Book}
 * objects, in the fixed AAP §0.1.2 order.
 *
 * Built from {@link bookSeeds} by attaching a deterministic, generated
 * `coverUrl` to each seed via {@link generateCoverDataUri}. The function reads
 * only the book's identity (`id`/`title`/`author`), so passing
 * `{ ...seed, coverUrl: '' }` (a complete `Book`) keeps the call type-correct
 * while the placeholder `''` is immediately overwritten by the return value.
 * The map runs once at module load and is fully deterministic, so `books` is
 * byte-identical on the server and the client (hydration-safe).
 */
export const books: Book[] = bookSeeds.map((seed) => ({
  ...seed,
  coverUrl: generateCoverDataUri({ ...seed, coverUrl: '' }),
}));

/**
 * Convenience count of the catalog (always `15`). Handy for the App01 status
 * bar ("15 books") and the sidebar's "All Books" total, so consumers need not
 * recompute `books.length`.
 */
export const bookCount: number = books.length;

