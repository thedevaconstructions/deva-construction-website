"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  items: string[];
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
};

/**
 * Infinite horizontal marquee — items scroll leftward. Duplicated content
 * ensures a seamless wrap. Reduced-motion users see the items in a static
 * row without any scroll.
 */
export function Marquee({ items, duration = 40, className }: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={`flex flex-wrap gap-x-10 gap-y-3 ${className ?? ""}`}>
        {items.map((it, i) => (
          <span key={i} className="whitespace-nowrap">
            {it}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {[...items, ...items].map((it, i) => (
          <span key={i} className="inline-flex items-center gap-16">
            <span>{it}</span>
            <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-accent" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
