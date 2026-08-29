"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

/**
 * The five copy beats floating over the walkthrough footage.
 *
 * Each beat owns a slice of scroll progress, fades in/out at the edges of its
 * range, and translates ~15% slower than the footage for parallax depth. All
 * copy is real DOM (beat 1's headline is the page <h1>) — never drawn into
 * the canvas.
 */

type BeatDef = {
  id: string;
  /** [enter, exit] as fractions of the walkthrough's scroll progress. */
  range: [number, number];
  /** slide-in direction for the parallax x offset */
  from?: "left" | "right";
  placement: string;
  render: (staticLayout?: boolean) => React.ReactNode;
};

/** Soft warm glow behind a copy block so text never fights the footage. */
const glow = {
  background:
    "radial-gradient(ellipse 130% 130% at 50% 60%, rgba(244,239,232,0.82) 0%, rgba(244,239,232,0.5) 55%, rgba(244,239,232,0) 100%)",
};

function Overline({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 h-px w-10 bg-bronze/30" />
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/70">
        {children}
      </p>
    </div>
  );
}

export const BEATS: BeatDef[] = [
  {
    id: "approach",
    range: [0, 0.14],
    placement: "items-end justify-start pb-24 md:pb-28",
    render: () => (
      <div className="relative max-w-2xl p-6 md:p-8">
        <div aria-hidden className="absolute -inset-8 -z-10" style={glow} />
        <Overline>Bangalore · Since 2018</Overline>
        <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-tight text-ink/[.92] md:text-7xl">
          Deva Construction
        </h1>
        <p className="mt-4 font-serif text-2xl italic text-ink/80 md:text-3xl">
          Building with precision. Delivering with trust.
        </p>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/70 md:text-base">
          Residential, commercial, and renovation across Bangalore — foundation to handover.
        </p>
      </div>
    ),
  },
  {
    id: "threshold",
    range: [0.14, 0.30],
    from: "left",
    placement: "items-center justify-start",
    render: () => (
      <div className="relative max-w-xl p-6 md:p-8">
        <div aria-hidden className="absolute -inset-8 -z-10" style={glow} />
        <Overline>01 · The threshold</Overline>
        <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-ink/[.92] md:text-6xl">
          A threshold you <span className="italic">don&rsquo;t notice.</span>
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/70 md:text-base">
          Level floor across the glass line. No step, no lip, no ridge. Getting
          inside and outside to meet at exactly the same height is a structural
          decision made months before anyone chooses a tile.
        </p>
      </div>
    ),
  },
  {
    id: "structure",
    range: [0.30, 0.60],
    from: "right",
    placement: "items-center justify-end",
    render: () => (
      <div className="relative max-w-xl p-6 md:p-8">
        <div aria-hidden className="absolute -inset-8 -z-10" style={glow} />
        <Overline>02 · The structure</Overline>
        <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-ink/[.92] md:text-6xl">
          The ceiling is <span className="italic">the drawing.</span>
        </h2>
        <ul className="mt-5 max-w-md space-y-3 text-sm leading-relaxed text-ink/70 md:text-base">
          <li className="flex gap-3">
            <span aria-hidden className="mt-[0.6em] h-px w-5 shrink-0 bg-bronze/50" />
            Exposed structure means every beam is finish-grade from the day
            it&rsquo;s lifted.
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-[0.6em] h-px w-5 shrink-0 bg-bronze/50" />
            Nothing to hide behind a false ceiling — spans, joints, and services
            planned to be seen.
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-[0.6em] h-px w-5 shrink-0 bg-bronze/50" />
            Structural design and finishing run by the same team, in the same
            room.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "services",
    range: [0.60, 0.80],
    placement: "items-center justify-center text-center",
    render: () => (
      <div className="relative max-w-2xl p-6 md:p-8">
        <div aria-hidden className="absolute -inset-8 -z-10" style={glow} />
        <div className="flex flex-col items-center">
          <div className="mb-3 h-px w-10 bg-bronze/30" />
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/70">
            03 · The services
          </p>
        </div>
        <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-ink/[.92] md:text-6xl">
          The best work is the work{" "}
          <span className="italic">you never see.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-ink/70 md:text-base">
          Plumbing, conduit, and drainage set before a single wall closed. Every
          run recorded on the as-built so the next person to open a wall knows
          exactly what&rsquo;s behind it.
        </p>
      </div>
    ),
  },
  {
    id: "view",
    range: [0.80, 1],
    placement: "items-center justify-center text-center",
    render: (staticLayout) => (
      <div className="relative max-w-2xl p-6 md:p-8">
        <div aria-hidden className="absolute -inset-8 -z-10" style={glow} />
        <h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-ink/[.92] md:text-6xl">
          Ready to build? Bring your plans —{" "}
          <span className="italic text-accent-deep">we&rsquo;ll handle the rest.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-ink/70 md:text-base">
          We reply to every enquiry inside 24 hours with a first-read from the
          team and a proposed next step.
        </p>
        <div
          className={`mt-8 flex flex-wrap items-center justify-center gap-3 ${
            staticLayout ? "" : "pointer-events-auto"
          }`}
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-accent-deep px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
          >
            Start a project
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center rounded-full border border-ink/30 bg-paper/60 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink backdrop-blur-sm transition hover:bg-bone"
          >
            See our recent work
          </Link>
        </div>
        <p className="mt-6 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/75">
          Enquiries handled directly by the owner.
        </p>
      </div>
    ),
  },
];

export function WalkthroughCopy({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  return (
    <>
      {BEATS.map((beat) => (
        <Beat key={beat.id} beat={beat} progress={progress} />
      ))}
    </>
  );
}

/** Linear interpolation over an increasing breakpoint list, clamped. */
function interp(v: number, input: number[], output: number[]) {
  if (v <= input[0]) return output[0];
  for (let i = 1; i < input.length; i++) {
    if (v <= input[i]) {
      const t = (v - input[i - 1]) / (input[i] - input[i - 1]);
      return output[i - 1] + (output[i] - output[i - 1]) * t;
    }
  }
  return output[output.length - 1];
}

function Beat({
  beat,
  progress,
}: {
  beat: BeatDef;
  progress: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enter, exit] = beat.range;
  const span = exit - enter;
  // Fade zones: ~20% of the beat's span on each side (first beat starts
  // visible, last beat stays visible at the end).
  const fadeIn = enter === 0 ? 0 : span * 0.22;
  const fadeOut = exit === 1 ? 0 : span * 0.22;

  // Styles are set imperatively from the scroll value rather than through
  // motion.div styles: motion promotes scroll-linked styles to WAAPI
  // ScrollTimeline animations, whose keyframe mapping misbehaves for
  // partial-range transforms. Direct writes are deterministic everywhere.
  const apply = (v: number) => {
    const el = ref.current;
    if (!el) return;
    const opacity = interp(
      v,
      enter === 0
        ? [exit - fadeOut, exit]
        : exit === 1
          ? [enter, enter + fadeIn]
          : [enter, enter + fadeIn, exit - fadeOut, exit],
      enter === 0 ? [1, 0] : exit === 1 ? [0, 1] : [0, 1, 1, 0]
    );
    // Parallax: copy drifts ~15% slower than the footage.
    const y = interp(v, [enter, exit], [40, -40]);
    const x =
      beat.from === "left"
        ? interp(v, [enter, enter + span * 0.35], [-60, 0])
        : beat.from === "right"
          ? interp(v, [enter, enter + span * 0.35], [60, 0])
          : 0;
    el.style.opacity = String(opacity);
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    // Skip layout/paint work for beats that are fully faded out.
    el.style.visibility = opacity === 0 ? "hidden" : "visible";
  };

  useMotionValueEvent(progress, "change", apply);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => apply(progress.get()), []);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 flex px-6 md:px-12 lg:px-16 ${beat.placement}`}
    >
      {beat.render()}
    </div>
  );
}
