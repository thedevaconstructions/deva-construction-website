"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "motion/react";
import { WalkthroughCopy, BEATS } from "@/components/walkthrough-copy";
import { WalkthroughProgress } from "@/components/walkthrough-progress";

/**
 * One-take walkthrough hero.
 *
 * A 250-frame FPV move through a finished house, scrubbed by scroll: sticky
 * full-screen canvas inside a tall scroll container. Scroll progress 0→1 maps
 * linearly to frame index with a lerp so fast scrolls glide instead of strobing.
 *
 * Frames live in /public/walkthrough — `d/` (3840×2160) and `m/` (2560×1440),
 * both all 250 frames. Zero-padded names make the URL pure arithmetic;
 * regenerate both sets with `npm run frames`. Which set a device gets is
 * decided by pickSet() below, on backing-store size rather than breakpoint.
 */

/**
 * Two frame sets, picked by the canvas backing store the device actually
 * needs — NOT by viewport width.
 *
 * The canvas is full-screen, so its backing store is viewport × min(DPR, 3),
 * and cover-scale is max(backingW/frameW, backingH/frameH). UHD is only
 * worth its decode cost when STANDARD would be upscaled; below that it costs
 * a 33MB bitmap decode per frame (measured: ~1s stalls, renderer hangs under
 * sustained scrubbing) to render detail the display cannot resolve.
 *
 * STANDARD at 2560×1440 still covers a 1920×1080 backing store without any
 * upscale, so mid-tier desktops lose nothing by taking it.
 */
const UHD = { set: "d", count: 250, w: 3840, h: 2160 };
const STANDARD = { set: "m", count: 250, w: 2560, h: 1440 };

const PAPER = "#F4EFE8";

const frameUrl = (set: string, i: number) =>
  `/walkthrough/${set}/frame-${String(i + 1).padStart(4, "0")}.webp`;

/** Frames shown by the reduced-motion / stacked fallback, one per beat. */
const STILL_FRAMES = [4, 29, 109, 164, 239];

/**
 * Pick the smallest set that covers this device's canvas backing store
 * without upscaling. Phones are capped at STANDARD regardless: a portrait
 * viewport covering landscape footage scales by height, so no set we ship
 * fully covers a 3x-DPI phone, and 250 decoded 4K bitmaps would get the tab
 * killed long before the extra detail paid for itself.
 */
function pickSet() {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const backingW = window.innerWidth * dpr;
  const backingH = window.innerHeight * dpr;
  const isPhone = window.matchMedia("(max-width: 767px)").matches;
  if (isPhone) return STANDARD;
  const standardUpscales = backingW > STANDARD.w || backingH > STANDARD.h;
  return standardUpscales ? UHD : STANDARD;
}

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
  // Both sets are 250 frames; kept in state so a differing set is handled.
  const [frameCount, setFrameCount] = useState(STANDARD.count);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Progressive preload.
  //
  // Blocking on the whole set stopped being viable once frames became real
  // 4K (~275KB each): waiting for all of them is tens of seconds on an
  // ordinary connection. Instead we unlock the scrub as soon as a prime
  // batch covering the opening beat is in, then stream the remainder in
  // document order behind it. drawFrame already falls back to the nearest
  // loaded frame, so an un-arrived frame holds the previous one for a beat
  // rather than showing a gap.
  useEffect(() => {
    if (!live) return;
    const { set, count } = pickSet();
    setFrameCount(count);

    const PRIME = Math.min(24, count); // enough for beat 1 before unlocking

    let done = 0;
    let primed = 0;
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(count);
    const loaded: boolean[] = new Array(count).fill(false);
    imagesRef.current = images;
    loadedRef.current = loaded;

    const request = (i: number, onSettle?: () => void) => {
      const img = new Image();
      const settle = (ok: boolean) => {
        if (cancelled) return;
        loaded[i] = ok;
        done++;
        setLoadProgress(done / count);
        onSettle?.();
      };
      img.onload = () => settle(true);
      img.onerror = () => settle(false);
      img.src = frameUrl(set, i);
      images[i] = img;
    };

    // Phase 2 — everything after the prime batch, drip-fed through a small
    // pool. Declared first but NOT started until phase 1 finishes: kicking
    // it off immediately puts 250 requests on the wire at once, the prime
    // batch gets an equal slice of a shared pipe instead of all of it, and
    // the unlock ends up waiting on most of the set anyway (measured on
    // production: >15s to scrubbable). Serialising the two phases is what
    // makes the prime batch actually prime.
    let next = PRIME;
    let inFlight = 0;
    const REST_POOL = 6;
    const pump = () => {
      if (cancelled) return;
      while (next < count && inFlight < REST_POOL) {
        const i = next++;
        inFlight++;
        request(i, () => {
          inFlight--;
          pump();
        });
      }
    };

    // Phase 1 — prime batch, all in parallel, nothing else competing.
    // Unlock the scrub the moment it lands, then release phase 2.
    for (let i = 0; i < PRIME; i++) {
      request(i, () => {
        primed++;
        if (primed === PRIME) {
          setReady(true);
          pump();
        }
      });
    }

    // Backstop: if even the prime batch stalls, go live anyway and let
    // drawFrame cope with whatever has arrived. This must release phase 2
    // as well — phase 2 is now gated on the prime batch completing, so a
    // stalled prime would otherwise mean the rest of the set never loads.
    // pump() is idempotent for an already-running pool (it only fills up to
    // REST_POOL), so calling it here and from phase 1 is safe.
    const valve = window.setTimeout(() => {
      if (cancelled) return;
      setReady(true);
      pump();
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
      {live && loadProgress < 1 && (
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
          src={frameUrl(STANDARD.set, 0)}
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
            src={frameUrl(STANDARD.set, STILL_FRAMES[i])}
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
