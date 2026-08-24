import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { CardCloud } from "@/components/card-cloud";
import {
  getAdjacentProjects,
  getAllProjects,
  getProjectBySlug,
} from "@/content/projects";

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

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
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
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { previous, next } = getAdjacentProjects(slug);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-8 lg:px-10">
        <Reveal duration={500} y={12}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/60 transition hover:text-accent-deep"
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
          <p className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/60">
            {project.kind} · {project.year}
          </p>
        </Reveal>
      </section>

      {/* Hero visual. CardCloud stands in until real photography exists, and
          matches what the cards on the gallery show, so arriving here from a
          card is continuous rather than a jump-cut. */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal delay={120} duration={900}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-bone md:aspect-[16/7]">
            <CardCloud index={0} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-7xl italic text-ink/25 md:text-8xl">
                {initialsOf(project.name)}
              </span>
            </div>
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

/** First letters of the first two words — the same stand-in the cards use. */
function initialsOf(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-paper/60 px-5 py-4">
      <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/60">
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
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/60">
        {direction}
      </span>
      <span className="mt-2 block font-serif text-xl text-ink transition group-hover:text-accent-deep">
        {project.name}
      </span>
    </Link>
  );
}
