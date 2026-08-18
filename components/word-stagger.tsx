"use client";

import { animate, stagger } from "animejs";
import { useEffect, useRef } from "react";

type Props = {
  /** Segments to reveal one after another. Each entry can be plain text or
   *  a ReactNode (e.g. an <span className="italic text-accent">Built</span>). */
  segments: React.ReactNode[];
  /** Delay before the first word starts, ms. */
  delay?: number;
  /** Gap between each word, ms. */
  gap?: number;
  /** Distance each word rises from, px. */
  y?: number;
};

/**
 * Reveals its segments one after another with a fade + rise. Meant for the
 * hero heading where each word/line is its own beat. Respects
 * prefers-reduced-motion.
 */
export function WordStagger({ segments, delay = 100, gap = 90, y = 20 }: Props) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    if (!words.length) return;

    // Hide before animating so the pre-JS flash doesn't leak through.
    words.forEach((w) => {
      w.style.opacity = "0";
      w.style.transform = `translateY(${y}px)`;
    });

    animate(words, {
      opacity: [0, 1],
      translateY: [y, 0],
      delay: stagger(gap, { start: delay }),
      duration: 700,
      ease: "outExpo",
    });
  }, [delay, gap, y]);

  return (
    <span ref={rootRef}>
      {segments.map((seg, i) => (
        <span key={i} data-word className="inline-block">
          {seg}
          {i < segments.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
