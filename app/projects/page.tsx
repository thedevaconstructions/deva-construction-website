import { ProjectsGallery } from "@/components/projects-gallery";
import { getAllProjects } from "@/content/projects";
import { Reveal } from "@/components/reveal";

export const metadata = {
  title: "Projects",
  description:
    "A selection of residential, commercial, and renovation work Deva Construction has delivered across Bangalore and Karnataka.",
};


export default function ProjectsPage() {
  return (
    <>
      <section>
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10">
          <Reveal duration={500} y={12}>
            <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-deep">
              Selected work · 2018 → 2026
            </p>
          </Reveal>
          <Reveal delay={120} duration={900}>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.02] tracking-tight text-ink md:text-7xl">
              Every build the reference for the <span className="italic">next.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <ProjectsGallery projects={getAllProjects()} />
    </>
  );
}
