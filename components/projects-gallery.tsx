"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/reveal";
import { ProjectMedia } from "@/components/project-media";
import { type Project, type ProjectKind } from "@/content/projects";

type Filter = "All" | ProjectKind;

/**
 * Filter buttons, derived from the projects themselves.
 *
 * This list used to be hard-coded as ["All", "Commercial", "Residential"].
 * A Renovation project — a category the home page already used — therefore
 * matched no filter and could not be seen under any tab. Reading the
 * categories from the data means a category can never go missing again, and
 * a new one the owner adds in content/projects.ts appears here on its own.
 */
export function ProjectsGallery({ projects }: { projects: readonly Project[] }) {
  const [active, setActive] = useState<Filter>("All");

  // Derived from the projects actually being shown, not from a fixed list.
  // These arrive from the admin app at request time, so a category must never
  // be read from anywhere that could be out of date with them.
  const filters = useMemo<readonly Filter[]>(() => {
    const order: ProjectKind[] = ["Residential", "Commercial", "Renovation"];
    const present = new Set(projects.map((p) => p.kind));
    return ["All", ...order.filter((k) => present.has(k))];
  }, [projects]);

  const visible = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.kind === active)),
    [active, projects],
  );

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
      {/* Category filter row — pointless with nothing to filter, so it is
          hidden rather than shown reading "Showing 0 of 0". */}
      <div
        className={`flex-wrap items-center gap-3 border-b border-line/70 pb-6 ${
          projects.length === 0 ? "hidden" : "flex"
        }`}
      >
        <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/75">
          Category
        </span>
        {filters.map((f) => {
          const isActive = active === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={`rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                isActive
                  ? "bg-ink text-paper shadow-[0_10px_30px_-12px_rgba(14,59,57,0.4)]"
                  : "border border-ink/25 bg-paper/60 text-ink hover:bg-bone"
              }`}
              aria-pressed={isActive}
            >
              {f}
            </button>
          );
        })}
        <span className="ml-auto text-xs text-ink/75">
          Showing {visible.length} of {projects.length}
        </span>
      </div>

      {/* Grid */}
      <div key={active} className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => {
          return (
            <Reveal key={p.slug} delay={i * 80} duration={700}>
              <Link href={`/projects/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-bone">
                  <div className="absolute inset-0 transition duration-700 group-hover:scale-[1.04]">
                    <ProjectMedia
                      project={p}
                      index={i}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-paper/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
                    {p.kind}
                  </div>
                </div>
                <div className="mt-5 flex items-baseline justify-between">
                  <h2 className="font-serif text-xl text-ink transition group-hover:text-accent-deep">
                    {p.name}
                  </h2>
                  <span className="text-xs text-ink/75">{p.year}</span>
                </div>
                <p className="mt-1 text-sm text-ink/70">
                  {p.location} · {p.area}
                </p>
              </Link>
            </Reveal>
          );
        })}
      </div>

      {/* Empty state. Reachable in normal use: the owner controls this list
          from the admin app and can unpublish or archive everything. It says
          what is true and offers a way forward, rather than leaving a visitor
          on a blank page wondering whether the site is broken. */}
      {visible.length === 0 && (
        <Reveal duration={700}>
          <div className="mt-12 rounded-[28px] border border-line/70 bg-paper/60 px-8 py-20 text-center">
            <p className="font-serif text-2xl leading-snug text-ink md:text-3xl">
              {projects.length === 0
                ? "Our project gallery is being updated."
                : `No ${active.toLowerCase()} projects to show yet.`}
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/75">
              {projects.length === 0
                ? "We are putting together a selection of recent work. In the meantime, tell us about your build and we will talk you through what we have done."
                : "Try another category, or get in touch about what you have in mind."}
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-deep px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
            >
              Start a project
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </Reveal>
      )}
    </section>
  );
}
