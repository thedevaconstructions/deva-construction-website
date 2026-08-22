/**
 * Frame pipeline for the one-take walkthrough hero.
 *
 * Reads the raw PNG sequence from SRC_DIR and writes two committed WebP sets:
 *   public/walkthrough/d/frame-0001.webp …  desktop, 3840×2160, every frame
 *   public/walkthrough/m/frame-0001.webp …  mobile,  2560×1440, every frame
 *
 * Source is a 3840x2160 @ 25.5Mbps upscale of the villa master, extracted
 * at native resolution with no downscale:
 *   ffmpeg -i upscaled-video.mp4 frame-%04d.png
 *
 * Desktop serves the full 2160p because the canvas genuinely resolves it.
 * Backing store is viewport x min(DPR,3), and cover-scale is
 * max(backingW/frameW, backingH/frameH) — measured against real devices:
 *
 *   device                      backing      1080p src   4K src
 *   MacBook Pro 16" DPR 2       3456x2160    UP 2.00x    1.00x
 *   4K desktop DPR 1            3840x2160    UP 2.00x    1.00x
 *   27" 1440p DPR 1             2560x1440    UP 1.33x    0.67x
 *   iPhone 14 portrait DPR 3    1170x2532    UP 2.34x    UP 1.17x
 *
 * A 1080p set was being upscaled on every high-DPI device. Mobile portrait
 * is the worst case: landscape footage covering a portrait viewport scales
 * by HEIGHT, so a phone wants ~2532px of vertical detail.
 *
 * Mobile stops at 1440p rather than 4K on purpose: phones need the vertical
 * detail but cannot hold 292 decoded 4K bitmaps (3840*2160*4B = 33MB each)
 * without being killed by the OS. 1440p is the compromise — still a large
 * improvement on 720p, still survivable.
 *
 * Source frames are extracted as lossless PNG (not JPEG) — the pipeline is
 * source-video → WebP with exactly one lossy hop instead of two. A JPEG
 * intermediate at any quality setting throws away information the source
 * still had; PNG doesn't.
 *
 * Preload byte budget is not a constraint here (explicit call) — both sets
 * are full source resolution at near-lossless quality, and mobile no longer
 * skips frames (the skip made the motion choppier, not just the image
 * softer). Revisit if load time on slow connections becomes a complaint.
 *
 * Swapping footage later = drop the new frames in SRC_DIR (any zero-padded
 * png sequence sorted by name; extract with `ffmpeg -i in.mp4 frame-%04d.png`
 * — not .jpg, see above) and re-run `npm run frames`.
 *
 * Also samples the four corners of the first frame and prints their average
 * colour — the page background (--color-paper, #F4EFE8) should sit within a
 * hair of it so letterboxing at odd aspect ratios is invisible.
 */
import { readdir, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = "C:/Users/chinm/Downloads/villa-4k-frames-png";
const OUT_ROOT = new URL("../public/walkthrough/", import.meta.url).pathname
  // On Windows the URL pathname starts with a slash before the drive letter.
  .replace(/^\/([A-Za-z]:)/, "$1");

const SETS = [
  { name: "d", width: 3840, height: 2160, quality: 86, step: 1 },
  { name: "m", width: 2560, height: 1440, quality: 88, step: 1 },
];

const files = (await readdir(SRC_DIR))
  .filter((f) => /\.png$/i.test(f))
  .sort();
if (files.length === 0) {
  console.error(`No JPEG frames found in ${SRC_DIR}`);
  process.exit(1);
}
console.log(`${files.length} source frames in ${SRC_DIR}`);

// Corner-colour check on the first frame.
{
  const img = sharp(path.join(SRC_DIR, files[0]));
  const { width, height } = await img.metadata();
  const s = 24; // corner sample size
  let r = 0, g = 0, b = 0;
  for (const [left, top] of [
    [0, 0],
    [width - s, 0],
    [0, height - s],
    [width - s, height - s],
  ]) {
    const { data, info } = await sharp(path.join(SRC_DIR, files[0]))
      .extract({ left, top, width: s, height: s })
      .raw()
      .toBuffer({ resolveWithObject: true });
    let cr = 0, cg = 0, cb = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      cr += data[i];
      cg += data[i + 1];
      cb += data[i + 2];
    }
    const n = data.length / info.channels;
    r += cr / n;
    g += cg / n;
    b += cb / n;
  }
  const hex = (v) => Math.round(v / 4).toString(16).padStart(2, "0");
  console.log(
    `Average corner colour of ${files[0]}: #${hex(r)}${hex(g)}${hex(b)} ` +
      `(page paper is #F4EFE8)`
  );
}

for (const set of SETS) {
  const outDir = path.join(OUT_ROOT, set.name);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const picked = files.filter((_, i) => i % set.step === 0);
  let done = 0;
  let bytes = 0;

  // Small concurrency pool — sharp is libvips-backed, 8 at a time is plenty.
  const POOL = 8;
  let next = 0;
  await Promise.all(
    Array.from({ length: POOL }, async () => {
      while (next < picked.length) {
        const i = next++;
        const out = path.join(
          outDir,
          `frame-${String(i + 1).padStart(4, "0")}.webp`
        );
        await sharp(path.join(SRC_DIR, picked[i]))
          .resize(set.width, set.height, { fit: "cover" })
          .webp({ quality: set.quality })
          .toFile(out);
        bytes += (await stat(out)).size;
        done++;
      }
    })
  );
  console.log(
    `set "${set.name}": ${done} frames @ ${set.width}×${set.height} q${set.quality} → ` +
      `${(bytes / 1024 / 1024).toFixed(2)} MB`
  );
}
