"use client";

import { CloudShader } from "@/components/ui/cloud-shader";

/**
 * Site-wide page background.
 *
 * Replaces the blueprint-grid `background-image` that used to sit on `body`
 * in globals.css — a hairline grid tiled on a fixed pixel cell, which reads
 * as generic template output rather than as something designed for this firm.
 *
 * One fixed, full-viewport WebGL layer mounted once in the root layout, so
 * the whole site shares a single GL context rather than one per section.
 * It sits at -z-10, behind everything, and never takes pointer events.
 *
 * On `/` the walkthrough canvas covers the viewport for the first 350–500vh,
 * so this only becomes visible once the editorial sections begin. That is
 * expected.
 *
 * Tuning notes — this sits behind body copy on every page, so it is
 * deliberately quiet:
 *  - The stock component is a literal blue sky. Recoloured to the warm-bone
 *    palette it reads as drifting haze over paper, not weather.
 *  - `speed` well below 1 and a low cloud `count`: movement should be
 *    noticeable only if you look for it.
 *  - Sky top/bottom are the existing paper tokens, so the shader resolves to
 *    almost exactly the page colour it replaced. `--color-paper` stays on
 *    `body` underneath as the fallback when WebGL is unavailable.
 */
export function BgShader() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <CloudShader
        className="h-full w-full"
        // Slow drift — this is atmosphere, not an animation to watch.
        speed={0.18}
        // Fewer, larger forms. High counts read as busy behind text.
        count={3}
        // Warm off-white, a hair above --color-paper so cloud edges register
        // as light rather than as a colour change.
        cloudColor="#FDFAF4"
        // --color-paper-2 → --color-paper, matching the page's own gradient.
        skyTopColor="#EEE7DA"
        skyBottomColor="#F4EFE8"
      />
    </div>
  );
}
