/* =========================================================================
   PROJECTS — the list shown on the website
   =========================================================================

   This is the ONLY file you need to edit to change the projects on the site.
   Everything else — the home page, the projects page, and each project's own
   page — reads from here. You do not need to touch any other file.

   ---------------------------------------------------------------------
   TO ADD A PROJECT
   ---------------------------------------------------------------------
   Copy an existing block, paste it, and change the values. Keep the commas
   and the quote marks exactly where they are.

   ---------------------------------------------------------------------
   TO REMOVE A PROJECT
   ---------------------------------------------------------------------
   Delete its whole block, from the opening `{` to the closing `},`.

   ---------------------------------------------------------------------
   THE FIELDS
   ---------------------------------------------------------------------
   slug       The web address. "jayanagar-villa" becomes
              devaconstructions.in/projects/jayanagar-villa
              Lowercase letters and hyphens only, no spaces, no capitals.

              *** IMPORTANT: do not change a slug once the project is live. ***
              It is a public web address. Changing it breaks every link
              anyone has shared and every Google result pointing at it. If
              you need a different name, change `name` and leave `slug` alone.

   name       The project name as people should read it.
   location   Where it is. "Jayanagar, Bangalore".
   year       The year, in quotes: "2025".
   kind       MUST be one of exactly these three, spelled this way:
                 "Residential"   "Commercial"   "Renovation"
              Anything else stops the site from building. That is on purpose —
              a typo here is caught before it can reach the live site.
              To introduce a genuinely new category, add it to ProjectKind
              just below, or ask and it will be added for you.
   area       Floor area, written however you like: "4,200 sq. ft."

   featured   Optional. Add `featured: true,` to show the project on the
              HOME page. The home page shows the first three featured
              projects, in the order they appear in this list.

   summary    Optional. A paragraph shown on the project's own page. Leave
              it out and the page simply omits it.
   highlights Optional. A short list of points shown on the project's own
              page, e.g. ["Level threshold throughout", "Exposed structure"].

   ---------------------------------------------------------------------
   ORDER
   ---------------------------------------------------------------------
   Projects appear on the site in the order they are listed here. Newest
   first is the usual choice. Move a block up or down to reorder it.

   ---------------------------------------------------------------------
   IF YOU MAKE A MISTAKE
   ---------------------------------------------------------------------
   The site refuses to build rather than publishing something broken. The
   error message names the field and the line. Nothing reaches the live
   site until it is fixed, so a mistake here is safe.
   ========================================================================= */

/** The categories a project can have. These also become the filter buttons. */
export type ProjectKind = "Residential" | "Commercial" | "Renovation";

export type Project = {
  slug: string;
  name: string;
  location: string;
  year: string;
  kind: ProjectKind;
  area: string;
  featured?: boolean;
  summary?: string;
  highlights?: string[];
};

/*
  `satisfies` is what turns a typo into a build error instead of a broken
  page: it checks every entry against the shape above while keeping the
  literal values, so `getProjectBySlug` still knows the real slugs.
*/
export const PROJECTS = [
  {
    slug: "narayanappa-residence",
    name: "Narayanappa Residence",
    location: "Ramgondahalli, Bangalore",
    year: "2026",
    kind: "Residential",
    area: "4,200 sq. ft.",
    featured: true,
  },
  {
    slug: "koramangala-loft",
    name: "Koramangala Loft",
    location: "Koramangala, Bangalore",
    year: "2025",
    kind: "Renovation",
    area: "2,100 sq. ft.",
    featured: true,
  },
  {
    slug: "hosur-warehouse",
    name: "Hosur Industrial Warehouse",
    location: "Hosur Road, Bangalore",
    year: "2025",
    kind: "Commercial",
    area: "22,000 sq. ft.",
    featured: true,
  },
  {
    slug: "jayanagar-villa",
    name: "Jayanagar Villa",
    location: "Jayanagar, Bangalore",
    year: "2024",
    kind: "Residential",
    area: "5,800 sq. ft.",
  },
  {
    slug: "indiranagar-office",
    name: "Indiranagar Office Fit-out",
    location: "Indiranagar, Bangalore",
    year: "2024",
    kind: "Commercial",
    area: "3,400 sq. ft.",
  },
  {
    slug: "electronic-city-apartments",
    name: "Electronic City Apartments",
    location: "Electronic City, Bangalore",
    year: "2023",
    kind: "Residential",
    area: "34,000 sq. ft.",
  },
] satisfies readonly Project[];

/* =========================================================================
   Below this line is code. You do not need to edit any of it.
   ========================================================================= */

/**
 * Mistakes the type system cannot catch, checked once at module load.
 *
 * Types verify the SHAPE of each entry but say nothing about the list as a
 * whole. Two projects sharing a slug is the dangerous one: Next.js would
 * generate the same route twice and one project would silently become
 * unreachable. Failing the build with a clear message beats shipping a page
 * that quietly disappears.
 */
function assertProjectsAreValid(projects: readonly Project[]) {
  const seen = new Set<string>();
  for (const p of projects) {
    if (seen.has(p.slug)) {
      throw new Error(
        `content/projects.ts: two projects share the slug "${p.slug}". ` +
          `Slugs are web addresses and must be unique — give one of them a different slug.`
      );
    }
    seen.add(p.slug);

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) {
      throw new Error(
        `content/projects.ts: the slug "${p.slug}" is not a valid web address. ` +
          `Use lowercase letters, numbers and single hyphens only — for example "jayanagar-villa".`
      );
    }
  }
}

assertProjectsAreValid(PROJECTS);

/** Every project, in the order listed above. */
export function getAllProjects(): readonly Project[] {
  return PROJECTS;
}

/**
 * The projects shown on the home page.
 *
 * Capped at three because the home page grid is a three-column row; a fourth
 * would wrap and leave a lone card on its own line. Marking more than three
 * as featured is not an error — the extras simply wait their turn.
 */
export function getFeaturedProjects(): readonly Project[] {
  return PROJECTS.filter((p) => p.featured).slice(0, 3);
}

/** One project by slug, or undefined if there is no such project. */
export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/**
 * The categories actually present in the data, for the filter buttons.
 *
 * Derived rather than hard-coded: the filter row used to list a fixed
 * ["Commercial", "Residential"], so a Renovation project matched no filter
 * and was invisible under every tab. Reading the categories from the projects
 * themselves means a category can never go missing from the filters again.
 */
export function getProjectKinds(): readonly ProjectKind[] {
  const order: ProjectKind[] = ["Residential", "Commercial", "Renovation"];
  const present = new Set(PROJECTS.map((p) => p.kind));
  return order.filter((k) => present.has(k));
}

/**
 * The projects either side of this one, for the prev/next links.
 *
 * Wraps around, so the last project's "next" is the first. A detail page is
 * then never a dead end regardless of where in the list it sits.
 */
export function getAdjacentProjects(slug: string): {
  previous: Project | null;
  next: Project | null;
} {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i === -1 || PROJECTS.length < 2) return { previous: null, next: null };
  return {
    previous: PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length],
    next: PROJECTS[(i + 1) % PROJECTS.length],
  };
}
