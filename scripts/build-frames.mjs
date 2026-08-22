/**
 * Frame pipeline for the one-take walkthrough hero.
 *
 * Reads the raw JPEG sequence from SRC_DIR and writes two committed WebP sets:
 *   public/walkthrough/d/frame-0001.webp …  desktop, 1600×900, every frame
 *   public/walkthrough/m/frame-0001.webp …  mobile,   960×540, every 2nd frame
 *
 * Swapping footage later = drop the new frames in SRC_DIR (any zero-padded
 * jpg sequence sorted by name) and re-run `npm run frames`.
 *
 * Also samples the four corners of the first frame and prints their average
 * colour — the page background (--color-paper, #F4EFE8) should sit within a
 * hair of it so letterboxing at odd aspect ratios is invisible.
 */
import { readdir, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = "C:/Users/chinm/Downloads/website frames";
const OUT_ROOT = new URL("../public/walkthrough/", import.meta.url).pathname
  // On Windows the URL pathname starts with a slash before the drive letter.
  .replace(/^\/([A-Za-z]:)/, "$1");

const SETS = [
  { name: "d", width: 1920, height: 1080, quality: 85, step: 1 },
  { name: "m", width: 1280, height: 720, quality: 75, step: 2 },
];

const files = (await readdir(SRC_DIR))
  .filter((f) => /\.jpe?g$/i.test(f))
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
