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
 * Tuning notes:
 *  - Colours are the shader's native sky, chosen deliberately over the
 *    warm-bone retune it shipped with first. It is a real blue sky behind a
 *    warm-bone brand, so the two are in tension by design — if it ever needs
 *    to recede again, the sky/cloud props here are the only thing to change.
 *  - `speed` stays well below 1: drift should read as calm, not animated.
 *  - `--color-paper` remains on `html` as the ground beneath, and is the
 *    whole background when WebGL is unavailable.
 */
export function BgShader() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <CloudShader
        className="h-full w-full"
        // Calm drift — visible, but not something that pulls the eye off copy.
        speed={0.3}
        count={5}
        // Full-strength reference sky, matching components/card-cloud.tsx.
        //
        // ACCESSIBILITY NOTE — this is a known, deliberate trade-off, not an
        // oversight. Measured contrast of --color-ink over #3876BA at the
        // opacities this site uses:
        //     ink/100 headings  3.72:1
        //     ink/75  body      2.85:1
        //     ink/70  body      2.66:1
        //     ink/60  meta      2.33:1
        // WCAG AA wants 4.5:1 for normal text and 3.0:1 for large text, so
        // body copy fails wherever it crosses the darker top of the sky —
        // and this layer is fixed and viewport-height, so it does that on
        // every page. A lighter variant (#9CC2E3 -> #D7E9F7) clears AA at
        // 4.70:1 and was shipped first; the owner reviewed those numbers and
        // chose the full reference sky anyway. Swap the two colours below to
        // go back.
        cloudColor="#FFFFFF"
        skyTopColor="#3876BA"
        skyBottomColor="#8CBFE8"
      />
    </div>
  );
}
