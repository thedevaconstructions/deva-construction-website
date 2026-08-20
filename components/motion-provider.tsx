"use client";

import { MotionConfig } from "motion/react";

/**
 * App-wide motion configuration.
 *
 * `reducedMotion="never"` forces every child motion element to run its
 * animation regardless of the operating system's prefers-reduced-motion
 * setting. This site is explicitly a design showcase where the motion is
 * the point of the experience -- respecting the OS flag would leave
 * visitors with a static page and would misrepresent what the site does.
 * When we ship a "prefers-reduced-motion off" toggle in the settings we
 * can revisit this.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="never" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}
