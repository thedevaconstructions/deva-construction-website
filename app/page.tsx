import Link from "next/link";

const FEATURED_PROJECTS = [
  {
    slug: "narayanappa-residence",
    name: "Narayanappa Residence",
    location: "Ramgondahalli, Bangalore",
    year: "2026",
    kind: "Residential",
  },
  {
    slug: "koramangala-loft",
    name: "Koramangala Loft",
    location: "Koramangala, Bangalore",
    year: "2025",
    kind: "Renovation",
  },
  {
    slug: "hosur-warehouse",
    name: "Hosur Industrial Warehouse",
    location: "Hosur Road, Bangalore",
    year: "2025",
    kind: "Commercial",
  },
];

const SERVICES = [
  {
    title: "Residential Construction",
    body: "Ground-up builds for independent homes, from a single-plot villa to a five-storey apartment. Structural design, MEP, and interiors coordinated as one build.",
  },
  {
    title: "Commercial & Industrial",
    body: "Office fit-outs, retail shells, warehouses. Delivered on tight programmes with the drawings, procurement, and site labour we already run in-house.",
  },
  {
    title: "Renovation & Interiors",
    body: "Homes and workspaces re-plotted around how you actually live and work. We treat existing structure as a constraint to design with, not fight against.",
  },
  {
    title: "Project Management",
    body: "Own the drawings but not the labour? We take a signed set to handover — contractors, materials, quality, cash-flow all through one dashboard.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line/60">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-24 lg:px-10 lg:pt-32">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
            Bangalore · Since 2018
          </p>
          <h1 className="mt-6 font-serif text-5xl leading-[1.02] tracking-tight text-ink md:text-7xl lg:text-[92px]">
            Buildings you can
            <br />
            <span className="italic">actually</span> live inside.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Deva Construction runs residential, commercial, and renovation builds across Karnataka
            — end-to-end, from the first drawing to the day you hand over the keys.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:opacity-90"
            >
              Start a project
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition hover:bg-bone"
            >
              See our projects
            </Link>
          </div>

          {/* Stats strip */}
          <dl className="mt-20 grid max-w-3xl grid-cols-3 gap-8 border-t border-line/70 pt-10">
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
                Delivered
              </dt>
              <dd className="mt-2 font-serif text-3xl text-ink">40+</dd>
              <dd className="text-xs text-muted">projects</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
                Built sq. ft.
              </dt>
              <dd className="mt-2 font-serif text-3xl text-ink">1.2M</dd>
              <dd className="text-xs text-muted">since 2018</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
                On-site team
              </dt>
              <dd className="mt-2 font-serif text-3xl text-ink">80+</dd>
              <dd className="text-xs text-muted">across Karnataka</dd>
            </div>
          </dl>
        </div>

        {/* Editorial hero mark */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-16 hidden font-serif text-[380px] leading-none text-ink/[0.03] md:block lg:right-0"
        >
          Deva
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="flex items-end justify-between border-b border-line/60 pb-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
              Selected work
            </p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-ink md:text-4xl">
              Recent projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden text-sm text-ink/75 transition hover:text-ink md:inline"
          >
            View all →
          </Link>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {FEATURED_PROJECTS.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-bone">
                {/* Placeholder image slot — replace with real project photography */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bone via-bone to-line/60">
                  <span className="font-serif text-6xl italic text-ink/15">
                    {project.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 rounded-full bg-paper/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ink">
                  {project.kind}
                </div>
              </div>

              <div className="mt-5 flex items-baseline justify-between">
                <h3 className="font-serif text-xl leading-snug text-ink transition group-hover:underline">
                  {project.name}
                </h3>
                <span className="text-xs text-muted">{project.year}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{project.location}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-line/60 bg-bone/40">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
                What we do
              </p>
              <h2 className="mt-2 max-w-md font-serif text-3xl leading-tight tracking-tight text-ink md:text-4xl">
                Four things,
                <br />
                <span className="italic">very</span> well.
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
                We stay narrow on purpose. Every build we take on gets the whole team's attention —
                design, procurement, quality, and cash-flow all sitting in the same room.
              </p>
            </div>

            <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {SERVICES.map((s, i) => (
                <div key={s.title}>
                  <div className="text-[11px] font-medium text-muted">
                    0{i + 1}
                  </div>
                  <dt className="mt-2 font-serif text-xl text-ink">{s.title}</dt>
                  <dd className="mt-3 text-sm leading-relaxed text-muted">{s.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="mx-auto max-w-4xl px-6 py-32 text-center lg:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
          Client note
        </p>
        <blockquote className="mt-6 font-serif text-3xl leading-tight tracking-tight text-ink md:text-4xl">
          &ldquo;They ran our three-storey build like a design studio and a workshop at the same
          time. On budget, on schedule, and the drawings actually matched what got poured.&rdquo;
        </blockquote>
        <div className="mt-8 text-sm text-muted">
          <span className="font-medium text-ink">Placeholder Name</span> · Client, Residential build
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-20 text-paper md:px-16 md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -bottom-16 font-serif text-[240px] leading-none text-paper/[0.05] md:text-[320px]"
          >
            Deva
          </div>
          <div className="relative max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-paper/60">
              Let's build
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight md:text-6xl">
              Have a plot,
              <br />
              a sketch,
              <br />
              or just an idea?
            </h2>
            <p className="mt-6 max-w-lg text-paper/70">
              We reply to every enquiry inside 24 hours with a first-read from our team and a
              proposed next step.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:bg-bone"
              >
                Start a conversation
                <span aria-hidden>→</span>
              </Link>
              <a
                href="tel:+919999999999"
                className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-6 py-3 text-sm font-medium text-paper transition hover:bg-paper/10"
              >
                +91 99999 99999
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
