"use client";

import { MotionConfig } from "motion/react";

/**
 * App-wide motion configuration.
 *
 * This used to set `reducedMotion="never"`, forcing every animation to run
 * regardless of the operating system setting, on the argument that motion is
 * the point of this site. Two things were wrong with that.
 *
 * The first is who it affects. People enable reduced motion because parallax
 * and scroll-driven movement make them ill — vestibular disorders, migraine,
 * motion sickness. A scroll-scrubbed flythrough with parallax copy is
 * precisely the content that triggers it. Overriding the setting does not
 * show them the site as intended; it makes them close the tab.
 *
 * The second is that it quietly disabled work already done. `reducedMotion`
 * feeds motion's `useReducedMotion()` hook, so "never" made that hook return
 * false everywhere — and components/marquee.tsx branches on it to render a
 * static row instead of an infinite scroll. That branch could never run. The
 * codebase contradicted itself: walkthrough.tsx reads matchMedia directly and
 * does switch to stills, so a reduced-motion visitor got a still hero and
 * then an endless marquee sliding past it.
 *
 * `reducedMotion="user"` follows the operating system. The site still animates
 * fully for everyone who has not asked otherwise, which is nearly everyone —
 * and the fallbacks that were already written now do their job.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}
