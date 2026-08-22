"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "motion/react";
import { WalkthroughCopy, BEATS } from "@/components/walkthrough-copy";
import { WalkthroughProgress } from "@/components/walkthrough-progress";

/**
 * One-take walkthrough hero.
 *
 * A 292-frame FPV move through a finished house, scrubbed by scroll: sticky
 * full-screen canvas inside a tall scroll container. Scroll progress 0→1 maps
 * linearly to frame index with a lerp so fast scrolls glide instead of strobing.
 *
 * Frames live in /public/walkthrough — `d/` (1600×900, all 292) for desktop,
 * `m/` (960×540, every 2nd) for mobile. Zero-padded names make the URL pure
 * arithmetic; regenerate both sets with `npm run frames`.
 */

const DESKTOP = { set: "d", count: 240 };
const MOBILE = { set: "m", count: 240 };

const PAPER = "#F4EFE8";

const frameUrl = (set: string, i: number) =>
  `/walkthrough/${set}/frame-${String(i + 1).padStart(4, "0")}.webp`;

/** Frames shown by the reduced-motion / stacked fallback, one per beat. */
const STILL_FRAMES = [0, 48, 106, 172, 233];

export function Walkthrough() {
  // null until we know; decided once on mount so SSR and hydration agree.
  const [mode, setMode] = useState<"scrub" | "stills" | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(reduce ? "stills" : "scrub");
  }, []);

  if (mode === "stills") return <StackedStills />;

  // Server render + pre-decision paint: the scrub shell with frame 1 as a
  // plain <img> so the opening terrace shot (and the real <h1>) are there
  // from first paint even before the canvas takes over.
  return <ScrubWalkthrough live={mode === "scrub"} />;
}

/* ------------------------------------------------------------------ */
/* Scrubbed canvas version                                             */
/* ------------------------------------------------------------------ */

function ScrubWalkthrough({ live }: { live: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [ready, setReady] = useState(false);
  // Set once the breakpoint is known — 292 desktop / 146 mobile.
  const [frameCount, setFrameCount] = useState(DESKTOP.count);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Preload the whole set for the current breakpoint.
  useEffect(() => {
    if (!live) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const { set, count } = isMobile ? MOBILE : DESKTOP;
    setFrameCount(count);

    let done = 0;
    let cancelled = false;
    const images: HTMLImageElement[] = [];
    const loaded: boolean[] = new Array(count).fill(false);

    for (let i = 0; i < count; i++) {
      const img = new Image();
      const settle = (ok: boolean) => {
        if (cancelled) return;
        loaded[i] = ok;
        done++;
        setLoadProgress(done / count);
        if (done === count) setReady(true);
      };
      img.onload = () => settle(true);
      img.onerror = () => settle(false);
      img.src = frameUrl(set, i);
      images.push(img);
    }
    imagesRef.current = images;
    loadedRef.current = loaded;

    // Safety valve: on a slow connection go live anyway after 8s and let
    // drawFrame fall back to the nearest loaded frame.
    const valve = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 8000);

    return () => {
      cancelled = true;
      window.clearTimeout(valve);
    };
  }, [live]);

  // Scroll → target frame index (float).
  const targetFrame = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  // rAF loop: lerp toward the target, redraw only when the rounded index moves.
  useEffect(() => {
    if (!live || !ready) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    let width = 0;
    let height = 0;
    let current = targetFrame.get();
    let drawn = -1;
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawn = -1; // force redraw at the new size
    };

    // Manual object-fit: cover.
    const drawFrame = (index: number) => {
      const images = imagesRef.current;
      const loaded = loadedRef.current;
      let i = Math.max(0, Math.min(images.length - 1, index));
      if (!loaded[i]) {
        // Nearest loaded frame in either direction.
        for (let d = 1; d < images.length; d++) {
          if (loaded[i - d]) { i = i - d; break; }
          if (loaded[i + d]) { i = i + d; break; }
        }
        if (!loaded[i]) return;
      }
      const img = images[i];
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const tick = () => {
      const target = targetFrame.get();
      current += (target - current) * 0.18;
      if (Math.abs(target - current) < 0.05) current = target;
      const index = Math.round(current);
      if (index !== drawn) {
        drawFrame(index);
        drawn = index;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [live, ready, targetFrame]);

  return (
    <section ref={containerRef} aria-label="Walkthrough of a finished build" className="relative h-[350vh] md:h-[500vh]">
      {/* Preload hairline — bone on bone, top edge, no spinner. */}
      {live && !ready && (
        <div className="fixed inset-x-0 top-0 z-50 h-px bg-bone/60">
          <div
            className="h-full origin-left bg-ink/40 transition-transform duration-300 ease-out"
            style={{ transform: `scaleX(${loadProgress})` }}
          />
        </div>
      )}

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Frame 1 as a real image under the canvas: first paint + no-JS. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frameUrl(DESKTOP.set, 0)}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <canvas
          ref={canvasRef}
          aria-hidden
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Scrim: bone gradient rising from the bottom + soft radial vignette. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            background:
              "linear-gradient(to top, rgba(244,239,232,0.88), rgba(244,239,232,0.42) 40%, rgba(244,239,232,0) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 90% at 50% 45%, rgba(244,239,232,0) 62%, rgba(244,239,232,0.35) 100%)",
          }}
        />

        {/* Copy beats float over the footage. */}
        <WalkthroughCopy progress={scrollYProgress} />
      </div>

      <WalkthroughProgress progress={scrollYProgress} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reduced-motion fallback: five stacked stills with the same copy     */
/* ------------------------------------------------------------------ */

function StackedStills() {
  return (
    <section aria-label="Walkthrough of a finished build">
      {BEATS.map((beat, i) => (
        <div key={beat.id} className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={frameUrl(DESKTOP.set, STILL_FRAMES[i])}
            alt=""
            className="h-[70vh] w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
            style={{
              background:
                "linear-gradient(to top, rgba(244,239,232,0.9), rgba(244,239,232,0) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-10 lg:px-10">
            <div className="mx-auto max-w-7xl">{beat.render(true)}</div>
          </div>
        </div>
      ))}
    </section>
  );
}
