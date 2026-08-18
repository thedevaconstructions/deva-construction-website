"use client";

import { animate, useInView, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Props = {
  /** Final numeric target. */
  to: number;
  /** Text to append after the number, e.g. "+", " sq. ft." */
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
 * Counts from 0 -> `to` when scrolled into view. Runs once. Uses motion's
 * useInView + useMotionValue -- no manual IntersectionObserver, no manual
 * requestAnimationFrame loop. Reduced-motion users see the final value
 * immediately (skip the count animation).
 */
export function CountUp({
  to,
  suffix = "",
  compact,
  duration = 1600,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const value = useMotionValue(0);
  const [display, setDisplay] = useState(() => `${fmt(to, compact)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(`${fmt(to, compact)}${suffix}`);
      return;
    }
    value.set(0);
    setDisplay(`${fmt(0, compact)}${suffix}`);
    const controls = animate(value, to, {
      duration: duration / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(`${fmt(v, compact)}${suffix}`),
      onComplete: () => setDisplay(`${fmt(to, compact)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, to, suffix, compact, duration, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
