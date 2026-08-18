import { ProjectsGallery } from "@/components/projects-gallery";

export const metadata = {
  title: "Projects",
  description:
    "A selection of residential, commercial, and renovation work Deva Construction has delivered across Bangalore and Karnataka.",
};

const PROJECTS = [
  { slug: "narayanappa-residence", name: "Narayanappa Residence", location: "Ramgondahalli", year: "2026", kind: "Residential" as const, area: "4,200 sq. ft." },
  { slug: "koramangala-loft", name: "Koramangala Loft", location: "Koramangala", year: "2025", kind: "Residential" as const, area: "2,100 sq. ft." },
  { slug: "hosur-warehouse", name: "Hosur Industrial Warehouse", location: "Hosur Road", year: "2025", kind: "Commercial" as const, area: "22,000 sq. ft." },
  { slug: "jayanagar-villa", name: "Jayanagar Villa", location: "Jayanagar", year: "2024", kind: "Residential" as const, area: "5,800 sq. ft." },
  { slug: "indiranagar-office", name: "Indiranagar Office Fit-out", location: "Indiranagar", year: "2024", kind: "Commercial" as const, area: "3,400 sq. ft." },
  { slug: "electronic-city-apartments", name: "Electronic City Apartments", location: "Electronic City", year: "2023", kind: "Residential" as const, area: "34,000 sq. ft." },
];

export default function ProjectsPage() {
  return (
    <>
      <section>
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10">
          <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            Selected work · 2018 → 2026
          </p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.02] tracking-tight text-ink md:text-7xl">
            Every build the reference for the <span className="italic">next.</span>
          </h1>
        </div>
      </section>

      <ProjectsGallery projects={PROJECTS} />
    </>
  );
}
