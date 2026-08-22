/**
 * Frame pipeline for the one-take walkthrough hero.
 *
 * Reads the raw PNG sequence from SRC_DIR and writes two committed WebP sets:
 *   public/walkthrough/d/frame-0001.webp …  desktop, 1920×1080, every frame
 *   public/walkthrough/m/frame-0001.webp …  mobile,  1280×720,  every frame
 *
 * Source is a 3840x2160 @ 25.5Mbps upscale of the villa master, lanczos-
 * downscaled to 1920x1080 during frame extraction:
 *   ffmpeg -i upscaled-video.mp4 -vf "scale=1920:1080:flags=lanczos" \
 *     frame-%04d.png
 * Downscaling from true 4K is why 1080p is honest here — unlike the
 * previous 720p source, the detail genuinely exists. Serving the full
 * 2160p would roughly quadruple bytes for detail no viewport actually
 * resolves (canvas caps at viewport x min(DPR,3)).
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
  { name: "d", width: 1920, height: 1080, quality: 92, step: 1 },
  { name: "m", width: 1280, height: 720, quality: 90, step: 1 },
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
