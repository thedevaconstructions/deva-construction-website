import { createClient } from "@supabase/supabase-js";
import { getAllProjects, type Project } from "@/content/projects";

/**
 * Where the website's project list comes from.
 *
 * The owner manages projects in the admin app at app.devaconstructions.in,
 * which writes to Supabase. This reads the published ones back out.
 *
 * SAFETY
 * ------
 * This reads with the ANONYMOUS key, from a public site. It queries
 * showcase_projects / showcase_photos, which exist precisely so that no
 * commercial column is reachable from here — the operational `projects` table
 * with total_cost and client_id is a different table this key cannot read.
 * See supabase/36_showcase.sql in the admin app repo.
 *
 * FALLBACK
 * --------
 * The hard-coded list in content/projects.ts is used ONLY when the database
 * cannot be reached: no credentials configured, or the query errored. That
 * keeps `npm run dev` and `npm run build` working without the project's
 * environment variables, and degrades a Supabase outage to the last committed
 * list rather than an empty portfolio.
 *
 * It is NOT used when the query succeeds and returns nothing. An earlier
 * version did fall back on an empty result, on the assumption that empty meant
 * "the migration has not run yet". That assumption expired the day the system
 * went live: on 1 Sep 2026 the owner removed the seeded demo projects, the
 * table was legitimately empty, and the site spent hours advertising six
 * builds that had been deliberately deleted. A portfolio must never claim work
 * its owner has retracted. Empty means empty.
 *
 * Once Supabase is configured, IT is authoritative and the content file is
 * never consulted for content the owner controls.
 */

type ShowcaseRow = {
  id: string;
  slug: string;
  name: string;
  location: string;
  year: string;
  kind: string;
  area: string;
  summary: string | null;
  featured: boolean;
  sort_order: number;
};

type PhotoRow = { showcase_id: string; url: string; sort_order: number };

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * `photos` on Project holds bare file names resolved against /projects/.
 * Supabase gives absolute URLs, so those pass through untouched — see
 * photoUrl() in content/projects.ts, which leaves anything starting with
 * http:// or https:// alone.
 */
function toProject(row: ShowcaseRow, photos: string[]): Project {
  return {
    slug: row.slug,
    name: row.name,
    location: row.location,
    year: row.year,
    kind: row.kind as Project["kind"],
    area: row.area,
    featured: row.featured,
    summary: row.summary ?? undefined,
    photos: photos.length ? photos : undefined,
  };
}

export async function fetchProjects(): Promise<readonly Project[]> {
  const supabase = client();
  if (!supabase) {
    console.warn(
      "[showcase] NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY are not set — " +
        "falling back to the list in content/projects.ts. Projects published " +
        "in the admin app will NOT appear until these are configured.",
    );
    return getAllProjects();
  }

  // RLS restricts both tables to published rows for this key, so there is no
  // `.eq("published", true)` here — the database enforces it rather than the
  // query remembering to.
  const [{ data: rows, error }, { data: photoRows, error: photoError }] = await Promise.all([
    supabase
      .from("showcase_projects")
      .select("id, slug, name, location, year, kind, area, summary, featured, sort_order")
      .order("sort_order", { ascending: true })
      .returns<ShowcaseRow[]>(),
    supabase
      .from("showcase_photos")
      .select("showcase_id, url, sort_order")
      .order("sort_order", { ascending: true })
      .returns<PhotoRow[]>(),
  ]);

  if (error || photoError || !rows) {
    console.error("[showcase] query failed, using content/projects.ts", error ?? photoError);
    return getAllProjects();
  }

  // Deliberately NO fallback here. An empty result from a working query means
  // the owner has published nothing, and the page must reflect that rather
  // than resurrecting deleted demo entries. See the FALLBACK note above.
  const byProject = new Map<string, string[]>();
  for (const p of photoRows ?? []) {
    const list = byProject.get(p.showcase_id) ?? [];
    list.push(p.url);
    byProject.set(p.showcase_id, list);
  }

  return rows.map((row) => toProject(row, byProject.get(row.id) ?? []));
}

export async function fetchFeaturedProjects(): Promise<readonly Project[]> {
  return (await fetchProjects()).filter((p) => p.featured).slice(0, 3);
}

export async function fetchProjectBySlug(slug: string): Promise<Project | undefined> {
  return (await fetchProjects()).find((p) => p.slug === slug);
}

/** The projects either side of one, for the detail page's prev/next links. */
export function adjacentIn(projects: readonly Project[], slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1 || projects.length < 2) return { previous: null, next: null };
  return {
    previous: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}
