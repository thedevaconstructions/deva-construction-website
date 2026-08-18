"use client";

import { animate } from "animejs";
import { useEffect, useRef } from "react";

type Props = {
  /** Final numeric target. */
  to: number;
  /** Text to append after the number, e.g. "+", "M", " sq. ft." */
  suffix?: string;
  /** Format 1200000 -> "1.2M". If false, uses toLocaleString(). */
  compact?: boolean;
  /** Animation duration, ms. */
  duration?: number;
  className?: string;
};

const NF_LONG = new Intl.NumberFormat("en-IN");
const NF_COMPACT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function fmt(n: number, compact?: boolean) {
  return compact ? NF_COMPACT.format(n) : NF_LONG.format(Math.round(n));
}

/**
 * Counts from 0 -> `to` when scrolled into view. Runs once. Honors
 * prefers-reduced-motion by skipping the animation and showing the final
 * value immediately.
 */
export function CountUp({
  to,
  suffix = "",
  compact,
  duration = 1600,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.textContent = `${fmt(to, compact)}${suffix}`;
      return;
    }

    // Start visibly at 0 so the frame before observe doesn't flash the target.
    el.textContent = `${fmt(0, compact)}${suffix}`;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const state = { v: 0 };
          animate(state, {
            v: to,
            duration,
            ease: "outExpo",
            onUpdate: () => {
              el.textContent = `${fmt(state.v, compact)}${suffix}`;
            },
            onComplete: () => {
              el.textContent = `${fmt(to, compact)}${suffix}`;
            },
          });
          io.unobserve(el);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);

    return () => io.disconnect();
  }, [to, suffix, compact, duration]);

  // Rendered fallback for SSR / no-JS: the final value.
  return (
    <span ref={ref} className={className}>
      {`${fmt(to, compact)}${suffix}`}
    </span>
  );
}
