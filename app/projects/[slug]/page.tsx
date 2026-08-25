import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { ProjectMedia } from "@/components/project-media";
import { photoAlt, photoUrl } from "@/content/projects";
import { adjacentIn, fetchProjectBySlug, fetchProjects } from "@/lib/showcase";

/**
 * A single project's page.
 *
 * This route did not exist until now, while both the home page and the
 * projects gallery had always linked every card to `/projects/<slug>` — so
 * every project card on the site led to a 404.
 *
 * Fully prerendered: generateStaticParams below emits one static page per
 * project, so the site stays entirely static and there is no server work at
 * request time. Adding a project to content/projects.ts is all it takes for a
 * new page to appear at the next build.
 */

/**
 * Re-check Supabase at most once a minute. Must be a literal: Next.js reads
 * this statically at build time and cannot resolve an imported constant.
 */
export const revalidate = 60;

/**
 * Prerender the projects that exist at build time. A project published in the
 * admin app afterwards is rendered on first visit and then cached, so a new
 * project does not need a deploy to appear.
 */
export async function generateStaticParams() {
  return (await fetchProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const project = await fetchProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.name,
    description:
      project.summary ??
      `${project.kind} project in ${project.location} — ${project.area}, completed ${project.year} by Deva Construction.`,
  };
}

export default async function ProjectPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const projects = await fetchProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const { previous, next } = adjacentIn(projects, slug);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-8 lg:px-10">
        <Reveal duration={500} y={12}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/75 transition hover:text-accent-deep"
          >
            <span aria-hidden>←</span> All projects
          </Link>
        </Reveal>

        <Reveal delay={100} duration={900}>
          <h1 className="mt-8 max-w-4xl font-serif text-5xl leading-[1.02] tracking-tight text-ink md:text-7xl">
            {project.name}
          </h1>
        </Reveal>

        <Reveal delay={200} duration={700}>
          <p className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/75">
            {project.kind} · {project.year}
          </p>
        </Reveal>
      </section>

      {/* Hero: the project's first photograph, or the animated sky when it has
          none yet — the same visual its card shows, so arriving from a card is
          continuous rather than a jump-cut. */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal delay={120} duration={900}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-bone md:aspect-[16/7]">
            <ProjectMedia
              project={project}
              index={0}
              priority
              sizes="(min-width: 1280px) 1216px, 100vw"
            />
          </div>
        </Reveal>
      </section>

      {/* Facts as separate bordered boxes rather than one run-on line, so each
          one can be read at a glance. */}
      <section className="mx-auto max-w-7xl px-6 pt-12 lg:px-10">
        <Reveal delay={80} duration={700}>
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Fact label="Location" value={project.location} />
            <Fact label="Year" value={project.year} />
            <Fact label="Type" value={project.kind} />
            <Fact label="Area" value={project.area} />
          </dl>
        </Reveal>
      </section>

      {(project.summary || project.highlights?.length) && (
        <section className="mx-auto max-w-7xl px-6 pt-14 lg:px-10">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {project.summary && (
              <Reveal duration={800}>
                <p className="max-w-xl text-base leading-relaxed text-ink/75">
                  {project.summary}
                </p>
              </Reveal>
            )}
            {project.highlights?.length ? (
              <Reveal delay={100} duration={800}>
                <ul className="max-w-xl space-y-3 text-sm leading-relaxed text-ink/75 md:text-base">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-[0.6em] h-px w-5 shrink-0 bg-bronze/50"
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>
        </section>
      )}

      {/* Remaining photographs. The first is already the hero above, so this
          starts at index 1 and the section disappears when there is only one. */}
      {project.photos && project.photos.length > 1 && (
        <section className="mx-auto max-w-7xl px-6 pt-14 lg:px-10">
          <div className="grid gap-6 md:grid-cols-2">
            {project.photos.slice(1).map((file, i) => (
              <Reveal key={file} delay={i * 80} duration={800}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-bone">
                  <Image
                    src={photoUrl(file)}
                    alt={photoAlt(project, i + 1)}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Never a dead end: somewhere to go next, and a way to start a project. */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal duration={700}>
          <div className="flex flex-col gap-8 border-t border-line/70 pt-10 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              {previous && <Sibling direction="Previous" project={previous} />}
              {next && <Sibling direction="Next" project={next} />}
            </div>
            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-accent-deep px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
            >
              Start a project
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-paper/60 px-5 py-4">
      <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/75">
        {label}
      </dt>
      <dd className="mt-2 font-serif text-lg leading-snug text-ink">{value}</dd>
    </div>
  );
}

function Sibling({
  direction,
  project,
}: {
  direction: "Previous" | "Next";
  project: { slug: string; name: string };
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/75">
        {direction}
      </span>
      <span className="mt-2 block font-serif text-xl text-ink transition group-hover:text-accent-deep">
        {project.name}
      </span>
    </Link>
  );
}
