import { Reveal } from "@/components/reveal";

export const metadata = {
  title: "Expertise",
  description:
    "Residential construction, commercial fit-outs, renovation, and end-to-end project management across Karnataka.",
};

const SERVICES = [
  {
    n: "01",
    title: "Residential Construction",
    body: "Independent homes and small apartments, structural to interior. Design in-house or with a partner architect; we take the drawing set to a signed handover.",
    scope: ["Structural design", "MEP coordination", "Finishing & interiors", "Landscape"],
  },
  {
    n: "02",
    title: "Commercial & Industrial",
    body: "Retail shells, office fit-outs, warehouses. Tight programme, transparent BOQ, weekly progress you can actually verify from the dashboard.",
    scope: ["Fit-outs", "Warehouse builds", "Retail shell", "Base build"],
  },
  {
    n: "03",
    title: "Renovation & Interiors",
    body: "Older homes and workspaces re-plotted to how you actually live now. We treat what's there as a constraint to design with, not to fight against.",
    scope: ["Full-home renovation", "Interior joinery", "Structural retrofit", "Bathroom / kitchen"],
  },
  {
    n: "04",
    title: "Project Management",
    body: "Own the drawings but not the labour? We take a signed set through procurement, contractors, quality, and cash-flow — all in one place.",
    scope: ["Procurement", "Vendor management", "Quality on-site", "Cost control"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section>
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10">
          <Reveal duration={500} y={12}>
            <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-deep">
              What we do
            </p>
          </Reveal>
          <Reveal delay={120} duration={900}>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.02] tracking-tight text-ink md:text-7xl">
              Four disciplines. <span className="italic">One</span> team in the same room.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-10">
        <div className="divide-y divide-line/70">
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={i * 80} duration={800}>
              <article className="grid gap-8 py-14 md:grid-cols-[120px_1fr] md:gap-14">
                <div className="font-serif text-4xl italic text-accent-deep/70">{s.n}</div>
                <div>
                  <h2 className="font-serif text-3xl tracking-tight text-ink md:text-5xl">
                    {s.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/75">{s.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2">
                    {s.scope.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-ink/25 bg-paper/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
