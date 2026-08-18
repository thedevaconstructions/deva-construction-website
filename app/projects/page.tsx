import Link from "next/link";

export const metadata = {
  title: "Projects",
  description:
    "A selection of residential, commercial, and renovation work Deva Construction has delivered across Bangalore and Karnataka.",
};

const PROJECTS = [
  { slug: "narayanappa-residence", name: "Narayanappa Residence", location: "Ramgondahalli", year: "2026", kind: "Residential", area: "4,200 sq. ft." },
  { slug: "koramangala-loft", name: "Koramangala Loft", location: "Koramangala", year: "2025", kind: "Renovation", area: "2,100 sq. ft." },
  { slug: "hosur-warehouse", name: "Hosur Industrial Warehouse", location: "Hosur Road", year: "2025", kind: "Commercial", area: "22,000 sq. ft." },
  { slug: "jayanagar-villa", name: "Jayanagar Villa", location: "Jayanagar", year: "2024", kind: "Residential", area: "5,800 sq. ft." },
  { slug: "indiranagar-office", name: "Indiranagar Office Fit-out", location: "Indiranagar", year: "2024", kind: "Commercial", area: "3,400 sq. ft." },
  { slug: "electronic-city-apartments", name: "Electronic City Apartments", location: "Electronic City", year: "2023", kind: "Residential", area: "34,000 sq. ft." },
];

export default function ProjectsPage() {
  return (
    <>
      <section className="border-b border-line/60">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
            Selected work · 2018 → 2026
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.04] tracking-tight text-ink md:text-6xl">
            Every project run like the last one is the reference for the next.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-bone">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bone via-bone to-line/60">
                  <span className="font-serif text-6xl italic text-ink/15">
                    {p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 rounded-full bg-paper/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ink">
                  {p.kind}
                </div>
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <h2 className="font-serif text-xl text-ink transition group-hover:underline">{p.name}</h2>
                <span className="text-xs text-muted">{p.year}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{p.location} · {p.area}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
