"use client";

import { useEffect, useRef, useState } from "react";
import { CloudShader } from "@/components/ui/cloud-shader";

/**
 * Cloud shader used as a project-card placeholder, until real project
 * photography exists. Replaces the flat `bg-gradient-to-br` fill the cards
 * used to carry.
 *
 * Two things this has to solve that the raw component does not:
 *
 * 1. **Every instance would otherwise look identical.** CloudShader has no
 *    seed, so instances mounted together render the same sky — obvious when
 *    three cards sit side by side. Each card passes a different `timeOffset`
 *    (and slightly different speed/count), so they read as separate skies.
 *
 * 2. **Each instance is its own WebGL context.** The projects page has six
 *    cards, plus the site background — enough contexts to be wasteful, and on
 *    weaker machines enough to start getting evicted by the browser. So the
 *    shader is only mounted while the card is near the viewport, and is torn
 *    down (freeing the context and its rAF loop) once it is well out of view.
 *
 * The gradient stays underneath as the pre-mount and no-WebGL appearance, so
 * a card is never empty.
 */
export function CardCloud({
  /** Index in the grid — derives the per-card offset so cards differ. */
  index = 0,
  className,
}: {
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      // Start a little before the card scrolls in, drop it once well past.
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Spread the cards around the shader's clock and vary the weather slightly.
  const offset = 7.3 * (index + 1);
  const speed = 0.16 + (index % 3) * 0.05;
  const count = 2 + (index % 3);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`absolute inset-0 bg-gradient-to-b from-[#3876BA] to-[#8CBFE8] ${className ?? ""}`}
    >
      {active ? (
        <CloudShader
          className="h-full w-full"
          speed={speed}
          count={count}
          timeOffset={offset}
          // Same native sky as the page background, so cards read as windows
          // onto it rather than as a different material.
          // Deliberately the full-strength sky, unlike the page background in
          // components/bg-shader.tsx which was lightened so body copy clears
          // WCAG AA. No body text sits on a card — only a badge on its own
          // opaque pill — so the vivid sky can stay where it costs nothing.
          cloudColor="#FFFFFF"
          skyTopColor="#3876BA"
          skyBottomColor="#8CBFE8"
        />
      ) : null}
    </div>
  );
}
