"use client";

import { motion, type Variants } from "motion/react";

type Props = {
  /** Segments to reveal one after another. Each entry can be plain text or
   *  a ReactNode (e.g. a keyed <span>). */
  segments: React.ReactNode[];
  /** Delay before the first word starts, ms. */
  delay?: number;
  /** Gap between each word, ms. */
  gap?: number;
  /** Distance each word rises from, px. */
  y?: number;
};

const container = (delay: number, gap: number): Variants => ({
  hidden: {},
  show: {
    transition: {
      delayChildren: delay / 1000,
      staggerChildren: gap / 1000,
    },
  },
});

const word = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
});

/**
 * Reveals its segments one after another with a fade + rise. Meant for the
 * hero heading where each word/line is its own beat. Runs on mount (not
 * scroll-triggered), because heros are always at the top of the fold.
 * Reduced-motion is respected by motion out of the box.
 */
export function WordStagger({ segments, delay = 100, gap = 90, y = 20 }: Props) {
  return (
    <motion.span
      initial="hidden"
      animate="show"
      variants={container(delay, gap)}
      className="inline"
    >
      {segments.map((seg, i) => (
        <motion.span
          key={i}
          variants={word(y)}
          className="inline-block"
        >
          {seg}
          {i < segments.length - 1 ? " " : null}
        </motion.span>
      ))}
    </motion.span>
  );
}
