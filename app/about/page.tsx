import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";

export const metadata = {
  title: "About",
  description:
    "Deva Construction is a Bangalore-based construction firm building residential, commercial, and renovation projects with end-to-end site management and real-time client visibility.",
};

const PRINCIPLES = [
  {
    title: "Every site runs digitally.",
    body: "Materials ordered, daily attendance logged, payments processed, budgets monitored — all recorded as it happens. No spreadsheets, no guesswork, no reconstructing the month from memory.",
  },
  {
    title: "Clients see their own money.",
    body: "Every client gets a dashboard showing exactly where their money is going and how the project is progressing. Real-time progress, material costs, payment history — without having to call and ask.",
  },
  {
    title: "One team, one roof.",
    body: "Structure, fit-out, and site management handled in-house. No scattered subcontractors, no finger-pointing when something goes wrong on the third floor.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section>
        <div className="mx-auto max-w-5xl px-6 pb-16 pt-8 lg:px-10">
          <Reveal duration={500} y={12}>
            <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-deep">
              About Deva Construction
            </p>
          </Reveal>
          <Reveal delay={120} duration={900}>
            <h1 className="mt-6 font-serif text-5xl leading-[1.02] tracking-tight text-ink md:text-7xl">
              You deserve to know what is happening on your site <span className="italic">every day.</span>
            </h1>
          </Reveal>
          <Reveal delay={280} duration={800}>
            <div className="mt-8 max-w-2xl space-y-6 text-lg leading-relaxed text-ink/75">
              <p>
                Deva Construction is a full-service construction company based in Bangalore, India.
                We take projects from the ground up — planning, structural work, fit-out, and final
                handover — managing every trade, every material, and every worker under one roof.
              </p>
              <p>
                We specialise in three areas: residential construction (independent houses, villas,
                and apartment buildings), commercial and industrial projects (offices, retail
                spaces, warehouses), and renovation and interior work (remodelling, structural
                upgrades, and complete interior fit-outs).
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div className="grid gap-16 md:grid-cols-2">
          <Reveal duration={800}>
            <div>
              <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-deep">
                How we work
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-ink md:text-5xl">
                How we run our sites.
              </h2>
            </div>
          </Reveal>
          <div className="space-y-10">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 100} duration={800}>
                <div>
                  <h3 className="font-serif text-2xl text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line/70 bg-paper-2/70">
        <Reveal duration={900}>
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:grid-cols-4 lg:px-10">
            <AboutStat n={<>2018</>} l="Founded" />
            <AboutStat n={<CountUp to={40} suffix="+" />} l="Projects delivered" />
            <AboutStat n={<CountUp to={1200000} compact />} l="sq. ft. built" />
            <AboutStat n={<CountUp to={80} suffix="+" />} l="on-site team" />
          </div>
        </Reveal>
      </section>
    </>
  );
}

function AboutStat({ n, l }: { n: React.ReactNode; l: string }) {
  return (
    <div>
      <div className="font-serif text-4xl text-ink md:text-5xl">{n}</div>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/75">
        {l}
      </div>
    </div>
  );
}
