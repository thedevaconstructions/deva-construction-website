"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Radius (px) in which the element starts pulling toward the cursor. */
  range?: number;
  /** Maximum offset (px) the element can drift from rest. */
  strength?: number;
};

/**
 * "Magnetic" wrapper — as the cursor approaches, the child element drifts
 * toward it. Springs back to center when the cursor leaves. Great on primary
 * CTAs. Respects prefers-reduced-motion.
 */
export function Magnetic({
  children,
  className,
  range = 80,
  strength = 14,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.35 });

  function handleMove(e: React.MouseEvent<HTMLSpanElement>) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > range) {
      x.set(0);
      y.set(0);
      return;
    }
    // Falloff — stronger pull the closer we are, capped at `strength`.
    const t = 1 - dist / range;
    x.set((dx / dist) * strength * t);
    y.set((dy / dist) * strength * t);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy, display: "inline-flex" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
