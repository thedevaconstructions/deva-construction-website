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
        // The reference sky, lightened until body copy clears WCAG AA.
        // Measured against --color-ink at the opacities this site actually
        // uses: over the native #3876BA, ink/70 body text scores 2.66:1 and
        // even full-strength headings only reach 3.72:1 — both below the 4.5
        // needed. This background is fixed and viewport-height, so the
        // deepest part of the sky sits exactly where copy scrolls past.
        // #9CC2E3 is the deepest blue that still gets ink/70 to 4.70:1.
        // The project cards keep the full-strength sky: nothing on them has
        // to be read. See components/card-cloud.tsx.
        cloudColor="#FFFFFF"
        skyTopColor="#9CC2E3"
        skyBottomColor="#D7E9F7"
      />
    </div>
  );
}
