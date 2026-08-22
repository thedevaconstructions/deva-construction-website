"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

/**
 * Thin vertical scroll-progress rail on the right edge of the walkthrough:
 * a 1px safety-orange line that fills with progress, doubling as a
 * five-chapter marker. Desktop only.
 *
 * Styles are written imperatively from the scroll value (see the note in
 * walkthrough-copy.tsx about motion's WAAPI promotion of scroll-linked
 * styles).
 */

const CHAPTERS = [
  { label: "Approach", at: 0 },
  { label: "Threshold", at: 0.16 },
  { label: "Structure", at: 0.335 },
  { label: "Services", at: 0.628 },
  { label: "View", at: 0.795 },
];

export function WalkthroughProgress({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  const apply = (v: number) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleY(${v})`;
    if (railRef.current) {
      // The rail is position:fixed — fade it out as the sequence hands over
      // to the editorial page below.
      const o = v >= 1 ? 0 : v > 0.96 ? (1 - v) / 0.04 : 1;
      railRef.current.style.opacity = String(o);
    }
    CHAPTERS.forEach((c, i) => {
      const el = chapterRefs.current[i];
      if (!el) return;
      const next = CHAPTERS[i + 1]?.at ?? 1.01;
      const active = v >= c.at && v < next;
      el.style.opacity = active ? "1" : "0.35";
    });
  };

  useMotionValueEvent(progress, "change", apply);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => apply(progress.get()), []);

  return (
    <div
      ref={railRef}
      aria-hidden
      className="pointer-events-none fixed right-6 top-1/2 z-30 hidden h-64 -translate-y-1/2 md:block"
    >
      {/* Track + fill */}
      <div className="absolute right-0 top-0 h-full w-px bg-ink/15" />
      <div
        ref={fillRef}
        className="absolute right-0 top-0 h-full w-px origin-top bg-accent"
        style={{ transform: "scaleY(0)" }}
      />

      {/* Chapter ticks + labels */}
      {CHAPTERS.map((c, i) => (
        <div
          key={c.label}
          ref={(el) => {
            chapterRefs.current[i] = el;
          }}
          style={{ top: `${c.at * 100}%`, opacity: 0.35 }}
          className="absolute right-0 flex -translate-y-1/2 items-center gap-2 transition-opacity duration-300"
        >
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-ink">
            {c.label}
          </span>
          <span className="h-px w-3 bg-ink/60" />
        </div>
      ))}
    </div>
  );
}
