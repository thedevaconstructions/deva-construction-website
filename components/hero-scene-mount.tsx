"use client";

import dynamic from "next/dynamic";

// SSR is off because Three.js needs a real WebGL context — never available on
// the server. Loading fallback is empty so the headline stays visible before
// the canvas mounts.
export const HeroSceneMount = dynamic(
  () => import("@/components/hero-scene").then((m) => m.HeroScene),
  { ssr: false, loading: () => <div className="absolute inset-0" /> },
);
