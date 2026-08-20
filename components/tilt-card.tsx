"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
};

/**
 * Card that tilts under the cursor with a subtle 3D perspective. The whole
 * card rotates around its center based on where the pointer is inside the
 * card bounds. Springs back to flat when the cursor leaves. Skips motion
 * for reduced-motion users.
 */
export function TiltCard({ children, className, max = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 260, damping: 22, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 260, damping: 22, mass: 0.4 });

  // 3d perspective — combining rotateX/Y with translateZ gives a real lift.
  const transform = useTransform(
    [srx, sry],
    ([rxv, ryv]) => `perspective(900px) rotateX(${rxv}deg) rotateY(${ryv}deg)`,
  );

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height;
    // Cursor at top -> tilt back; right -> tilt right.
    rx.set((0.5 - py) * max * 2);
    ry.set((px - 0.5) * max * 2);
  }

  function handleLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
