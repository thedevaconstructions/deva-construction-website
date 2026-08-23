import Link from "next/link";
import { CountUp } from "@/components/count-up";
import { Reveal } from "@/components/reveal";
import { Magnetic } from "@/components/magnetic";
import { TiltCard } from "@/components/tilt-card";
import { Marquee } from "@/components/marquee";
import { CardCloud } from "@/components/card-cloud";
import { Walkthrough } from "@/components/walkthrough";

const FEATURED_PROJECTS = [
  { slug: "narayanappa-residence", name: "Narayanappa Residence", location: "Ramgondahalli, Bangalore", year: "2026", kind: "Residential" },
  { slug: "koramangala-loft", name: "Koramangala Loft", location: "Koramangala, Bangalore", year: "2025", kind: "Renovation" },
  { slug: "hosur-warehouse", name: "Hosur Warehouse", location: "Hosur Road, Bangalore", year: "2025", kind: "Commercial" },
];

const SERVICES = [
  { n: "01", title: "Residential Construction", body: "Ground-up builds — from a single-plot villa to a multi-storey apartment. Structural, MEP, and interiors as one build." },
  { n: "02", title: "Commercial & Industrial", body: "Office fit-outs, retail shells, warehouses. Tight programmes with drawings and site labour we run in-house." },
  { n: "03", title: "Renovation & Interiors", body: "Homes and workspaces re-plotted around how you actually live now. Existing structure becomes a design constraint, not a fight." },
  { n: "04", title: "Project Management", body: "You have the drawings but not the labour? We take a signed set through procurement, site quality, and cash-flow — end to end." },
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

export default function HomePage() {
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
              <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
                Selected work
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-ink md:text-5xl">
                Recent projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="group hidden text-[12px] font-semibold uppercase tracking-[0.18em] text-ink/75 transition hover:text-ink md:inline-flex md:items-center md:gap-2"
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
          {FEATURED_PROJECTS.map((p, i) => (
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
                <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
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
                    <div className="font-mono text-[11px] font-semibold tracking-[0.24em] text-accent">
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

      {/* CLIENT NOTE */}
      <section className="mx-auto max-w-4xl px-6 py-32 text-center lg:px-10">
        <Reveal duration={900}>
          <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            Client note
          </p>
          <blockquote className="mt-8 font-serif text-3xl leading-tight tracking-tight text-ink md:text-[42px]">
            &ldquo;They ran our three-storey build like a design studio and a workshop at the same
            time. On budget, on schedule, and the drawings actually matched what got poured.&rdquo;
          </blockquote>
          <div className="mt-8 text-sm text-ink/70">
            <span className="font-semibold text-ink">Placeholder Name</span> · Client, Residential build
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <Reveal duration={900} y={40}>
          <div className="relative overflow-hidden rounded-[36px] bg-ink px-8 py-20 text-paper md:px-16 md:py-28">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -bottom-16 font-serif text-[240px] leading-none text-paper/[0.06] md:text-[340px]"
            >
              Deva
            </div>
            <div className="relative max-w-2xl">
              <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
                Let&apos;s build
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-6xl">
                Have a plot,
                <br />a sketch,
                <br />or <span className="italic text-accent">just an idea?</span>
              </h2>
              <p className="mt-6 max-w-lg text-paper/75">
                We reply to every enquiry inside 24 hours with a first-read from our team and a
                proposed next step.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink transition hover:opacity-90"
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
                  href="tel:+919999999999"
                  className="inline-flex items-center rounded-full border border-paper/25 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:bg-paper/10"
                >
                  +91 99999 99999
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
      <div className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/60">
        {label}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: { slug: string; name: string; location: string; year: string; kind: string };
  index: number;
}) {
  const initials = project.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return (
    <TiltCard className="group block">
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-bone">
          <div className="absolute inset-0 transition duration-700 group-hover:scale-[1.04]">
            <CardCloud index={index} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-7xl italic text-ink/25">{initials}</span>
            </div>
          </div>
          <div className="absolute bottom-3 left-3 rounded-full bg-paper/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
            {project.kind}
          </div>
        </div>
        <div className="mt-5 flex items-baseline justify-between">
          <h3 className="font-serif text-xl leading-snug text-ink transition group-hover:text-accent">
            {project.name}
          </h3>
          <span className="font-mono text-xs text-ink/60">{project.year}</span>
        </div>
        <p className="mt-1 text-sm text-ink/70">{project.location}</p>
      </Link>
    </TiltCard>
  );
}
