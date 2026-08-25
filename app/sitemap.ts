import type { MetadataRoute } from "next";
import { fetchProjects } from "@/lib/showcase";

/**
 * Served at /sitemap.xml, which previously 404'd.
 *
 * Project pages are built from the live showcase rather than a hard-coded
 * list, so publishing a project in the admin app puts it in the sitemap
 * without anyone remembering to. Archiving or unpublishing removes it, since
 * fetchProjects only ever sees what the public can see.
 */

const SITE = "https://devaconstructions.in";

/** Match the showcase revalidation window; a stale sitemap helps nobody. */
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/services`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];

  const projects = await fetchProjects();
  for (const project of projects) {
    pages.push({
      url: `${SITE}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  return pages;
}
