import { Reveal } from "@/components/reveal";

export const metadata = {
  title: "Expertise",
  description:
    "Residential construction, commercial and industrial builds, renovation and interiors, and end-to-end site management across Bangalore and Karnataka.",
};

const SERVICES = [
  {
    n: "01",
    title: "Residential Construction",
    body: "Independent houses, villas, row houses, and apartment buildings. Design-to-handover execution with full structural and finishing work.",
    scope: ["Independent houses", "Villas & row houses", "Apartment buildings", "Structural & finishing"],
  },
  {
    n: "02",
    title: "Commercial & Industrial",
    body: "Office buildings, retail spaces, warehouses, and factory structures. Built to specification with on-time delivery.",
    scope: ["Office buildings", "Retail spaces", "Warehouses", "Factory structures"],
  },
  {
    n: "03",
    title: "Renovation & Interiors",
    body: "Structural remodelling, interior fit-outs, and complete makeovers for existing buildings. Breathing new life into old spaces.",
    scope: ["Structural remodelling", "Interior fit-outs", "Complete makeovers", "Bathroom / kitchen"],
  },
  {
    n: "04",
    title: "Site Management",
    body: "End-to-end project coordination: labour, materials, suppliers, budgets, and timelines — all tracked and reported digitally.",
    scope: ["Labour & attendance", "Materials & suppliers", "Budgets & cost control", "Timelines & reporting"],
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
