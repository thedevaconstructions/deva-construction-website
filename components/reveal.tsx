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
  /** Fire only when the element is `threshold` fraction visible. */
  threshold?: number;
  /** Optional className passthrough. */
  className?: string;
  /** Render as a different motion element (default: div). */
  as?: "div" | "section" | "article" | "header" | "p" | "span";
};

/**
 * Fade + rise on first scroll into view. Motion's whileInView + viewport.once
 * handles the IntersectionObserver dance for us, and prefers-reduced-motion
 * is respected automatically -- reduced-motion users get no motion at all.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 700,
  threshold = 0.15,
  className,
  as = "div",
}: Props) {
  const MotionTag = motion[as] as React.ComponentType<HTMLMotionProps<"div">>;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        // Editorial-easing curve (outExpo-ish) tuned by hand.
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
