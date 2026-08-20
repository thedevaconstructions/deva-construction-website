"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

/**
 * Adapted from 21st.dev's "Modern Background Paths" (uniquesonu). Reduced to
 * two construction-relevant patterns -- Geometric grid + Neural network --
 * and retuned to the Deva palette (ink / bronze / safety orange over warm
 * bone). Alternates between the two every 14s so the hero never feels
 * static, without the original component's spiral/flow patterns that read
 * as generic web art rather than architectural drafting.
 *
 * Deterministic path generation (seeded from indexes) so SSR and client
 * render the same paths -- no hydration mismatch.
 */
export function BgPaths({ className }: { className?: string }) {
  const [pattern, setPattern] = useState<"geometric" | "neural">("geometric");

  useEffect(() => {
    const id = setInterval(() => {
      setPattern((p) => (p === "geometric" ? "neural" : "geometric"));
    }, 14000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden text-ink ${className ?? ""}`}
    >
      <motion.div
        key={pattern}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6 }}
        className="absolute inset-0"
      >
        {pattern === "geometric" ? <GeometricPaths /> : <NeuralPaths />}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Geometric grid — animated cells drawing themselves in and out.     */
/* Reads as an architectural site plan being drafted live.            */
/* ------------------------------------------------------------------ */
function GeometricPaths() {
  const paths = useMemo(() => {
    const gridSize = 40;
    const cols = 20;
    const rows = 12;
    const out: Array<{ id: string; d: string; delay: number; kind: number }> = [];
    // Deterministic pseudo-random so SSR + client agree.
    const rand = mulberry32(1729);
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if (rand() > 0.72) {
          out.push({
            id: `g-${x}-${y}`,
            d: `M${x * gridSize},${y * gridSize} L${(x + 1) * gridSize},${y * gridSize} L${(x + 1) * gridSize},${(y + 1) * gridSize} L${x * gridSize},${(y + 1) * gridSize} Z`,
            delay: rand() * 5,
            kind: Math.floor(rand() * 3),
          });
        }
      }
    }
    return out;
  }, []);

  const strokes = ["#1C1917", "#A16207", "#EA580C"];

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 800 480"
      preserveAspectRatio="xMidYMid slice"
    >
      {paths.map((p) => (
        <motion.path
          key={p.id}
          d={p.d}
          fill="none"
          stroke={strokes[p.kind]}
          strokeWidth={1.2}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0, 0.55, 0],
          }}
          transition={{
            duration: 8,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Neural network — nodes + connecting lines.                          */
/* Reads as a structural framework / connection diagram.              */
/* ------------------------------------------------------------------ */
function NeuralPaths() {
  const { nodes, connections } = useMemo(() => {
    const rand = mulberry32(4210);
    const ns = Array.from({ length: 44 }, (_, i) => ({
      id: `n-${i}`,
      x: rand() * 800,
      y: rand() * 600,
    }));
    const conns: Array<{ id: string; d: string; delay: number }> = [];
    ns.forEach((n, i) => {
      ns.forEach((o, j) => {
        if (i >= j) return;
        const dx = n.x - o.x;
        const dy = n.y - o.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130 && rand() > 0.55) {
          conns.push({
            id: `c-${i}-${j}`,
            d: `M${n.x},${n.y} L${o.x},${o.y}`,
            delay: rand() * 8,
          });
        }
      });
    });
    return { nodes: ns, connections: conns };
  }, []);

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
    >
      {connections.map((c) => (
        <motion.path
          key={c.id}
          d={c.d}
          stroke="#1C1917"
          strokeWidth={0.6}
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 6,
            delay: c.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={2.2}
          fill={i % 5 === 0 ? "#EA580C" : "#1C1917"}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 1.2, 1],
            opacity: [0, 0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 4,
            delay: (i * 0.05) % 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

/**
 * Small deterministic PRNG so SSR + client render identical paths --
 * mulberry32 is 12 lines, no dependencies, plenty random for decoration.
 */
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
