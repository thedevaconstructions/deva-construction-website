"use client";

/**
 * Aurora background — layered animated gradients that drift like the Northern
 * Lights. Adapted from the Aceternity "Aurora Background" pattern, retuned to
 * the Deva construction palette (safety orange + bronze + ink over warm bone).
 *
 * All motion is CSS: two `background-position` keyframes with different
 * durations create the "living" feel without JS or Three.js. Even at rest
 * (reduced-motion), the layered gradients are clearly visible.
 */
export function BgAurora({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-paper ${className ?? ""}`}>
      {/* Aurora layer 1 — bright sky-blue sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 aurora-layer-1"
        style={{
          backgroundImage:
            "repeating-linear-gradient(100deg, transparent 0%, rgba(63,131,191,0.7) 8%, transparent 22%, rgba(161,98,7,0.55) 36%, transparent 52%, rgba(63,131,191,0.5) 66%, transparent 82%)",
          filter: "blur(70px)",
          opacity: 0.9,
        }}
      />
      {/* Aurora layer 2 — deeper bronze / ink counter-motion */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 aurora-layer-2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(130deg, transparent 0%, rgba(28,25,23,0.6) 10%, transparent 28%, rgba(161,98,7,0.5) 42%, transparent 62%, rgba(28,25,23,0.55) 78%)",
          filter: "blur(90px)",
          opacity: 0.75,
        }}
      />
      {/* Warm base wash so headline stays legible over the aurora */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 45%, rgba(244,239,232,0.8) 0%, rgba(244,239,232,0.35) 45%, transparent 80%)",
        }}
      />

      <style>{`
        @keyframes aurora-drift-1 {
          0%   { background-position: 0% 0%; }
          50%  { background-position: 100% 40%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes aurora-drift-2 {
          0%   { background-position: 100% 100%; }
          50%  { background-position: 0% 60%; }
          100% { background-position: 100% 100%; }
        }
        .aurora-layer-1 {
          background-size: 300% 200%;
          animation: aurora-drift-1 22s ease-in-out infinite;
        }
        .aurora-layer-2 {
          background-size: 260% 200%;
          animation: aurora-drift-2 28s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-layer-1, .aurora-layer-2 { animation: none; }
        }
      `}</style>
    </div>
  );
}
