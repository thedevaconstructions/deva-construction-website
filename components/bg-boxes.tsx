"use client";

import { motion } from "motion/react";
import { useMemo } from "react";

/**
 * Grid of small square cells with a visible border. Each cell lights up in a
 * warm accent when the cursor hovers over it. Adapted from the Aceternity
 * "Background Boxes" pattern, retuned to the Deva palette (safety orange +
 * bronze) so it reads as an architectural site plan / floor grid.
 */
export function BgBoxes({
  rows = 90,
  cols = 50,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  const rowArr = useMemo(() => new Array(rows).fill(0), [rows]);
  const colArr = useMemo(() => new Array(cols).fill(0), [cols]);

  const colors = [
    "rgb(234, 88, 12)",   // safety
    "rgb(161, 98, 7)",    // bronze
    "rgb(28, 25, 23)",    // ink
    "rgb(63, 61, 58)",    // steel
    "rgb(214, 132, 90)",  // warm coral
  ];

  return (
    <div
      style={{
        // 45deg perspective — recedes like a site plan on a drafting table.
        transform:
          "translate(-40%, -60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)",
      }}
      className={`absolute left-1/4 top-1/2 flex -translate-y-1/2 p-4 ${className ?? ""}`}
    >
      {rowArr.map((_, i) => (
        <motion.div
          key={`row-${i}`}
          className="relative h-8 w-16 border-l border-ink/20"
        >
          {colArr.map((_, j) => (
            <motion.div
              key={`col-${i}-${j}`}
              whileHover={{
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                transition: { duration: 0 },
              }}
              animate={{ transition: { duration: 1.4 } }}
              className="relative h-8 w-16 border-t border-r border-ink/20"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1] text-ink/25"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
