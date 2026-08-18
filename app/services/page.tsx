export const metadata = {
  title: "Services",
  description:
    "Residential construction, commercial fit-outs, renovation, and end-to-end project management across Karnataka.",
};

const SERVICES = [
  {
    n: "01",
    title: "Residential Construction",
    body: "Independent homes and small apartments, structural to interior. Design in-house or a partner architect; we take the drawing set to a signed handover.",
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
    body: "Older homes and workspaces re-plotted to how you actually live now. We treat what's there as a constraint to design with — not to fight.",
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
      <section className="border-b border-line/60">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">What we do</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.04] tracking-tight text-ink md:text-6xl">
            Four services. One team. Everyone in the same room.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
        <div className="divide-y divide-line/70">
          {SERVICES.map((s) => (
            <article key={s.n} className="grid gap-8 py-14 md:grid-cols-[120px_1fr] md:gap-14">
              <div className="font-serif text-3xl italic text-ink/40">{s.n}</div>
              <div>
                <h2 className="font-serif text-3xl tracking-tight text-ink md:text-4xl">{s.title}</h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{s.body}</p>
                <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2">
                  {s.scope.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line/80 px-3 py-1 text-xs text-ink/75"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
