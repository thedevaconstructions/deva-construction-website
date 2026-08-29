import Link from "next/link";
import { CountUp } from "@/components/count-up";
import { Reveal } from "@/components/reveal";
import { Magnetic } from "@/components/magnetic";
import { TiltCard } from "@/components/tilt-card";
import { Marquee } from "@/components/marquee";
import { ProjectMedia } from "@/components/project-media";
import { Walkthrough } from "@/components/walkthrough";
import { type Project } from "@/content/projects";
import { fetchFeaturedProjects } from "@/lib/showcase";


const SERVICES = [
  {
    n: "01",
    title: "Residential Construction",
    body: "Independent houses, villas, row houses, and apartment buildings. Design-to-handover execution with full structural and finishing work.",
  },
  {
    n: "02",
    title: "Commercial & Industrial",
    body: "Office buildings, retail spaces, warehouses, and factory structures. Built to specification with on-time delivery.",
  },
  {
    n: "03",
    title: "Renovation & Interiors",
    body: "Structural remodelling, interior fit-outs, and complete makeovers for existing buildings. Breathing new life into old spaces.",
  },
  {
    n: "04",
    title: "Site Management",
    body: "End-to-end project coordination: labour, materials, suppliers, budgets, and timelines — all tracked and reported digitally.",
  },
];

/**
 * Reasons to choose the firm, in the visitor's order of doubt: can I see what
 * is happening, will it finish on time, who is actually responsible, is any of
 * it recorded, and do they know Bangalore.
 */
const WHY_US = [
  {
    title: "Full transparency",
    body: "Clients get a personal dashboard showing real-time project progress, material costs, and payment history.",
  },
  {
    title: "On-schedule delivery",
    body: "Every project is planned with milestones, daily attendance tracking, and budget alerts to keep things on track.",
  },
  {
    title: "One team, one roof",
    body: "Structure, fit-out, and management handled in-house. No scattered subcontractors, no finger-pointing.",
  },
  {
    title: "Digital-first operations",
    body: "Every material order, every wage payment, every site photo logged digitally. Complete accountability from day one.",
  },
  {
    title: "Bangalore expertise",
    body: "Built in Bangalore, for Bangalore. We understand local materials, labour, regulations, and the way construction actually works here.",
  },
];

const MARQUEE_ITEMS = [
  "Residential",
  "Commercial",
  "Renovation",
  "Interiors",
  "Structural",
  "Project management",
  "Bangalore · Karnataka",
];

/**
 * Re-check Supabase at most once a minute. Must be a literal: Next.js reads
 * this statically at build time and cannot resolve an imported constant.
 */
export const revalidate = 60;

export default async function HomePage() {
  const featured = await fetchFeaturedProjects();
  return (
    <>
      {/* HERO — one-take walkthrough of a finished build, scrubbed by scroll */}
      <Walkthrough />

      {/* Stats strip — slim bone band between the sequence and the editorial page */}
      <section className="border-t border-line/70 bg-paper-2/70">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <Reveal duration={800}>
            <dl className="grid max-w-4xl grid-cols-3 gap-8">
              <Stat n={<CountUp to={40} suffix="+" className="tabular" />} label="Projects delivered" />
              <Stat n={<CountUp to={1200000} compact className="tabular" />} label="sq. ft. built" />
              <Stat n={<CountUp to={80} suffix="+" className="tabular" />} label="On-site team" />
            </dl>
          </Reveal>
        </div>
      </section>

      {/* MARQUEE STRIP — divides hero from work */}
      <section className="border-y border-line/70 bg-ink py-6 text-paper">
        <Marquee
          items={MARQUEE_ITEMS}
          className="font-serif text-2xl italic md:text-3xl"
        />
      </section>

      {/* SELECTED WORK */}
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-8 lg:px-10">
        <Reveal duration={800}>
          <div className="flex items-end justify-between border-b border-line/70 pb-6">
            <div>
              <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-deep">
                Selected work
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-ink md:text-5xl">
                Recent projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="group hidden min-h-[24px] text-[12px] font-semibold uppercase tracking-[0.18em] text-ink/75 transition hover:text-ink md:inline-flex md:items-center md:gap-2"
            >
              View all
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 120} duration={800}>
              <ProjectCard project={p} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="mt-24 border-y border-line/70 bg-paper-2/70">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <Reveal duration={800}>
              <div>
                <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-deep">
                  Expertise
                </p>
                <h2 className="mt-3 max-w-md font-serif text-4xl leading-tight tracking-tight text-ink md:text-5xl">
                  Four disciplines. <span className="italic">One</span> team.
                </h2>
                <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink/75">
                  We stay narrow on purpose. Every build we take on gets the whole team&apos;s
                  attention — design, procurement, quality, and cash-flow in the same room.
                </p>
              </div>
            </Reveal>

            <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={i * 100} duration={700}>
                  <div className="group">
                    <div className="font-mono text-[11px] font-semibold tracking-[0.24em] text-accent-deep">
                      {s.n}
                    </div>
                    <dt className="mt-2 font-serif text-2xl text-ink transition group-hover:text-bronze">
                      {s.title}
                    </dt>
                    <dd className="mt-3 text-sm leading-relaxed text-ink/75">{s.body}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* WHY US
          Replaces a testimonial block whose quote and attribution were both
          invented — it read as a real client endorsement under the name
          "Placeholder Name". A fabricated review on a business site is worse
          than no review, and these are claims the firm can actually stand
          behind. Put a real quote back here when there is one to use. */}
      <section className="mx-auto max-w-7xl px-6 py-32 lg:px-10">
        <Reveal duration={800}>
          <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-deep">
            Why choose us
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight tracking-tight text-ink md:text-5xl">
            Construction doesn&apos;t have to be <span className="italic">opaque.</span>
          </h2>
        </Reveal>

        <dl className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((item, i) => (
            <Reveal key={item.title} delay={i * 80} duration={700}>
              <div className="border-t border-line/70 pt-6">
                <dt className="font-serif text-2xl leading-snug text-ink">{item.title}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-ink/75">{item.body}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <Reveal duration={900} y={40}>
          {/* Sky palette. Card fill is the palette's light blue rather than its
              deep #3F83BF: against the #3876BA sky behind it, deep blue gives
              only 1.17:1 separation (the card dissolves into the background)
              and nothing reads on it — near-white body text 2.71:1, ink
              4.34:1, both under AA. #94CEF2 separates at 2.77:1 and carries
              ink text at 10.3:1. Accent text and the primary button both use
              --color-accent-deep (#29557C), which measures 4.60:1 on this
              card. */}
          <div className="relative overflow-hidden rounded-[36px] bg-[#94CEF2] px-8 py-20 text-ink md:px-16 md:py-28">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -bottom-16 font-serif text-[240px] leading-none text-[#3F83BF]/25 md:text-[340px]"
            >
              Deva
            </div>
            <div className="relative max-w-2xl">
              <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-deep">
                Let&apos;s build
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-6xl">
                Ready to build?
                <br />
                Bring your plans —
                <br />
                <span className="italic text-accent-deep">we&apos;ll handle the rest.</span>
              </h2>
              <p className="mt-6 max-w-lg text-ink/80">
                We reply to every enquiry inside 24 hours with a first-read from our team and a
                proposed next step.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-accent-deep px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
                  >
                    Start a conversation
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </Magnetic>
                <a
                  href="tel:+919980144405"
                  className="inline-flex items-center rounded-full border border-ink/30 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-ink/10"
                >
                  +91 99801 44405
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Stat({ n, label }: { n: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="font-serif text-4xl text-ink md:text-5xl">{n}</div>
      <div className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/75">
        {label}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <TiltCard className="group block">
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-bone">
          <div className="absolute inset-0 transition duration-700 group-hover:scale-[1.04]">
            <ProjectMedia
              project={project}
              index={index}
              sizes="(min-width: 768px) 33vw, 100vw"
            />
          </div>
          <div className="absolute bottom-3 left-3 rounded-full bg-paper/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
            {project.kind}
          </div>
        </div>
        <div className="mt-5 flex items-baseline justify-between">
          <h3 className="font-serif text-xl leading-snug text-ink transition group-hover:text-accent-deep">
            {project.name}
          </h3>
          <span className="font-mono text-xs text-ink/75">{project.year}</span>
        </div>
        <p className="mt-1 text-sm text-ink/70">{project.location}</p>
      </Link>
    </TiltCard>
  );
}
