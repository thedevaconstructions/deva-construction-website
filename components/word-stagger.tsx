"use client";

import { motion } from "motion/react";

type Props = {
  segments: React.ReactNode[];
  /** Delay before the first word starts, ms. */
  delay?: number;
  /** Gap between each word, ms. */
  gap?: number;
  /** Distance each word rises from, px. */
  y?: number;
};

/**
 * Reveals its segments one after another with a fade + rise. Uses direct
 * `initial`/`animate` on each word (no variants) so motion always triggers
 * on mount without needing parent-variant inheritance to be wired correctly.
 */
export function WordStagger({ segments, delay = 100, gap = 90, y = 20 }: Props) {
  return (
    <span className="inline">
      {segments.map((seg, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
            delay: (delay + i * gap) / 1000,
          }}
          className="inline-block"
        >
          {seg}
          {i < segments.length - 1 ? " " : null}
        </motion.span>
      ))}
    </span>
  );
}
