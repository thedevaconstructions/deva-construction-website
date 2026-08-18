import Link from "next/link";
import { WordStagger } from "@/components/word-stagger";
import { CountUp } from "@/components/count-up";
import { Reveal } from "@/components/reveal";
import { Magnetic } from "@/components/magnetic";
import { BgBoxes } from "@/components/bg-boxes";
import { PreviewChooser } from "@/components/preview-chooser";

export const metadata = {
  title: "Preview · Background Boxes",
  description: "Preview of the Deva Construction hero with the Background Boxes background.",
};

export default function BoxesPreviewPage() {
  return (
    <>
      <PreviewChooser active="boxes" />

      <section className="relative min-h-[100svh] overflow-hidden">
        {/* Background Boxes layer — visible and interactive on hover */}
        <div
          aria-hidden
          className="absolute inset-0 h-full w-full overflow-hidden bg-paper"
        >
          <BgBoxes />
          {/* Soft radial paper wash so the headline is legible where it lands */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 40%, rgba(244,239,232,0.85) 0%, rgba(244,239,232,0.3) 40%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-6 lg:px-10 lg:pt-10">
          <Reveal duration={500} y={12}>
            <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/70">
              Bangalore · Since 2018
            </p>
          </Reveal>

          <h1 className="mt-8 font-serif text-[52px] leading-[0.98] tracking-tight text-ink md:text-[92px] lg:text-[120px]">
            <WordStagger
              segments={[
                <span key="design">Design</span>,
                <span key="built">
                  &amp; <span className="italic text-accent">Built</span>
                </span>,
                <span key="elegance">to elegance.</span>,
              ]}
              gap={140}
              delay={120}
            />
          </h1>

          <div className="mt-10 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
            <Reveal delay={500} duration={800}>
              <p className="max-w-xl text-base leading-relaxed text-ink/75 md:text-lg">
                Deva Construction runs residential, commercial, and renovation builds across
                Karnataka — end-to-end, from the first drawing to the day you hand over the keys.
              </p>
            </Reveal>

            <Reveal delay={700} duration={800}>
              <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end">
                <Magnetic>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:bg-ink-2"
                  >
                    Start a project
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </Magnetic>
                <Link
                  href="/projects"
                  className="inline-flex items-center rounded-full border border-ink/30 bg-paper/70 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink backdrop-blur-sm transition hover:bg-bone"
                >
                  See work
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} duration={800}>
            <dl className="mt-20 grid max-w-4xl grid-cols-3 gap-8 border-t border-line/70 pt-10">
              <Stat n={<CountUp to={40} suffix="+" className="tabular" />} label="Projects delivered" />
              <Stat n={<CountUp to={1200000} compact className="tabular" />} label="sq. ft. built" />
              <Stat n={<CountUp to={80} suffix="+" className="tabular" />} label="On-site team" />
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Stat({ n, label }: { n: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="font-serif text-4xl text-ink md:text-5xl">{n}</div>
      <div className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/60">
        {label}
      </div>
    </div>
  );
}
