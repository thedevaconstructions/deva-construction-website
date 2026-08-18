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
      <section className="border-b border-line/60">
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
            About Deva Construction
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
            A construction firm run like a design studio.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
            Founded in Bangalore in 2018, Deva Construction has grown into a team of 80+ working
            across residential, commercial, and renovation across Karnataka. We stay narrow on
            purpose — a handful of active builds at any time, all managed end-to-end by the same
            core team.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
              How we work
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-ink md:text-4xl">
              Principles the whole team can defend.
            </h2>
          </div>
          <div className="space-y-10">
            {PRINCIPLES.map((p) => (
              <div key={p.title}>
                <h3 className="font-serif text-xl text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line/60 bg-bone/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:grid-cols-4 lg:px-10">
          {[
            ["2018", "Founded"],
            ["40+", "Projects delivered"],
            ["1.2M", "sq. ft. built"],
            ["80+", "on-site team"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-serif text-4xl text-ink">{n}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
