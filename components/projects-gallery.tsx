"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/reveal";
import { CardCloud } from "@/components/card-cloud";

type Kind = "Residential" | "Commercial";
type Project = {
  slug: string;
  name: string;
  location: string;
  year: string;
  kind: Kind;
  area: string;
};

const FILTERS = ["All", "Commercial", "Residential"] as const;
type Filter = (typeof FILTERS)[number];

export function ProjectsGallery({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Filter>("All");

  const visible = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.kind === active)),
    [active, projects],
  );

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
      {/* Category filter row */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line/70 pb-6">
        <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/60">
          Category
        </span>
        {FILTERS.map((f) => {
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
        <span className="ml-auto text-xs text-ink/60">
          Showing {visible.length} of {projects.length}
        </span>
      </div>

      {/* Grid */}
      <div key={active} className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => {
          const initials = p.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2);
          return (
            <Reveal key={p.slug} delay={i * 80} duration={700}>
              <Link href={`/projects/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-bone">
                  <div className="absolute inset-0 transition duration-700 group-hover:scale-[1.04]">
                    <CardCloud index={i} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-7xl italic text-ink/25">{initials}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-paper/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
                    {p.kind}
                  </div>
                </div>
                <div className="mt-5 flex items-baseline justify-between">
                  <h2 className="font-serif text-xl text-ink transition group-hover:text-accent-deep">
                    {p.name}
                  </h2>
                  <span className="text-xs text-ink/60">{p.year}</span>
                </div>
                <p className="mt-1 text-sm text-ink/70">
                  {p.location} · {p.area}
                </p>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
