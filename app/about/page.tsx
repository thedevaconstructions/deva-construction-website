import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";

export const metadata = {
  title: "About",
  description:
    "Deva Construction is a Bangalore-based construction firm founded in 2018, working across residential, commercial, and renovation across Karnataka.",
};

const PRINCIPLES = [
  {
    title: "One build at a time.",
    body: "We limit how many jobs we run in parallel on purpose. Every site gets the same team's attention every week — no farming out, no rotating faces.",
  },
  {
    title: "Numbers you can verify.",
    body: "Every client gets a live dashboard. Cash-flow, purchases, wages, materials, attendance — all visible, all the time. If you can see it, we can defend it.",
  },
  {
    title: "Drawings that match the pour.",
    body: "The most expensive mistake in construction is a slab that doesn't match the drawing. We design and build in the same room to keep that gap at zero.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section>
        <div className="mx-auto max-w-5xl px-6 pb-16 pt-8 lg:px-10">
          <Reveal duration={500} y={12}>
            <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
              About Deva Construction
            </p>
          </Reveal>
          <Reveal delay={120} duration={900}>
            <h1 className="mt-6 font-serif text-5xl leading-[1.02] tracking-tight text-ink md:text-7xl">
              A construction firm run like a <span className="italic">design</span> studio.
            </h1>
          </Reveal>
          <Reveal delay={280} duration={800}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/75">
              Founded in Bangalore in 2018, Deva Construction has grown into a team of 80+
              working across residential, commercial, and renovation across Karnataka. We stay
              narrow on purpose — a handful of active builds at any time, all managed end-to-end
              by the same core team.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div className="grid gap-16 md:grid-cols-2">
          <Reveal duration={800}>
            <div>
              <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
                How we work
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-ink md:text-5xl">
                Principles the whole team can defend.
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
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/60">
        {l}
      </div>
    </div>
  );
}
