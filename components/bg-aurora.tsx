"use client";

/**
 * Aurora background — layered animated gradients that drift like the Northern
 * Lights. Adapted from the Aceternity "Aurora Background" pattern, retuned to
 * the Deva construction palette (safety orange + bronze + ink over warm bone).
 *
 * All the movement is CSS: two `background-position` keyframes with radically
 * different durations create the "living" feel without JS or Three.js.
 * Reduced-motion users see the composition frozen at its default position.
 */
export function BgAurora({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {/* Aurora layer 1 — bright coral/orange sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 aurora-layer-1"
        style={{
          backgroundImage:
            "repeating-linear-gradient(100deg, transparent 0%, rgba(234,88,12,0.35) 8%, transparent 20%, rgba(161,98,7,0.28) 32%, transparent 46%, rgba(234,88,12,0.22) 60%, transparent 76%)",
          filter: "blur(60px)",
          opacity: 0.6,
          maskImage:
            "radial-gradient(ellipse at 50% 30%, black 40%, transparent 75%)",
        }}
      />
      {/* Aurora layer 2 — deeper bronze counter-motion */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 aurora-layer-2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(120deg, transparent 0%, rgba(28,25,23,0.5) 10%, transparent 28%, rgba(161,98,7,0.35) 40%, transparent 60%, rgba(28,25,23,0.4) 78%)",
          filter: "blur(70px)",
          opacity: 0.55,
          maskImage:
            "radial-gradient(ellipse at 50% 60%, black 45%, transparent 80%)",
        }}
      />
      {/* Warm base wash so the aurora sits on tone-matched paper */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(244,239,232,0) 30%, var(--color-paper) 85%)",
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
