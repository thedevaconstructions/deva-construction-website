"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type Props = {
  children: React.ReactNode;
  /** Delay before the reveal starts, ms. */
  delay?: number;
  /** How far to translate up, px. */
  y?: number;
  /** Animation duration, ms. */
  duration?: number;
  /** Fire only when this fraction of the element is visible (0-1). */
  threshold?: number;
  /** Optional className passthrough. */
  className?: string;
  /** Render as a different motion element (default: div). */
  as?: "div" | "section" | "article" | "header" | "p" | "span";
};

/**
 * Fade + rise on scroll into view. Uses motion's whileInView with viewport.once
 * so IntersectionObserver fires the animation on first entry. Also fires
 * immediately for elements that are already on-screen when mounted.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 700,
  threshold = 0.1,
  className,
  as = "div",
}: Props) {
  const MotionTag = motion[as] as React.ComponentType<HTMLMotionProps<"div">>;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold, margin: "0px 0px -50px 0px" }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
