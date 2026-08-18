"use client";

import { animate } from "animejs";
import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  /** Delay before the reveal starts, ms. */
  delay?: number;
  /** How far to translate up, px. */
  y?: number;
  /** Animation duration, ms. */
  duration?: number;
  /** Fire only when the element is `threshold` fraction visible. */
  threshold?: number;
  /** Optional className passthrough. */
  className?: string;
  /** Render as a different tag (default: div). */
  as?: keyof React.JSX.IntrinsicElements;
};

/**
 * Fade + rise on first scroll into view. Honors prefers-reduced-motion —
 * users who have it set see the content immediately with no motion at all.
 * Renders visibly on the server so no-JS visitors get the full content too.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 700,
  threshold = 0.15,
  className,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Hide before observing so the initial paint doesn't show it.
    el.style.opacity = "0";
    el.style.transform = `translateY(${y}px)`;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          animate(el, {
            opacity: [0, 1],
            translateY: [y, 0],
            duration,
            delay,
            ease: "outExpo",
          });
          io.unobserve(el);
        }
      },
      { threshold },
    );
    io.observe(el);

    return () => io.disconnect();
  }, [delay, y, duration, threshold]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
