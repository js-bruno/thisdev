import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const RAW_DIR = join(ROOT, "assets/raw");
const OUT_DIR = join(ROOT, "public/assets/dither");
const PATTERN_DIR = join(ROOT, "public/assets/patterns");
const PHOTO_SRC_DIR = join(ROOT, "src/assets/photos");
const PHOTO_OUT_DIR = join(ROOT, "public/assets/canon");

const PALETTE_TEAL = ["#0b1d1d", "#0f5e52", "#5f9ea0", "#e8f2ee"];
const PALETTE_MONO = ["#122323", "#e8f2ee"];

const BAYER8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function nearest(r, g, b, palette) {
  let best = palette[0];
  let bestDist = Infinity;
  for (const c of palette) {
    const dr = r - c[0];
    const dg = g - c[1];
    const db = b - c[2];
    const d = dr * dr + dg * dg + db * db;
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best;
}

function orderedDither(data, width, height, palette, strength = 64) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] === 0) continue;
      const t = (BAYER8[y % 8][x % 8] + 0.5) / 64 - 0.5;
      const adj = t * strength;
      const c = nearest(
        data[i] + adj,
        data[i + 1] + adj,
        data[i + 2] + adj,
        palette,
      );
      data[i] = c[0];
      data[i + 1] = c[1];
      data[i + 2] = c[2];
    }
  }
}

function floydSteinberg(data, width, height, palette) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] === 0) continue;
      const oldR = data[i];
      const oldG = data[i + 1];
      const oldB = data[i + 2];
      const c = nearest(oldR, oldG, oldB, palette);
      data[i] = c[0];
      data[i + 1] = c[1];
      data[i + 2] = c[2];
      const errR = oldR - c[0];
      const errG = oldG - c[1];
      const errB = oldB - c[2];
      const spread = (nx, ny, factor) => {
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) return;
        const j = (ny * width + nx) * 4;
        if (data[j + 3] === 0) return;
        data[j] += errR * factor;
        data[j + 1] += errG * factor;
        data[j + 2] += errB * factor;
      };
      spread(x + 1, y, 7 / 16);
      spread(x - 1, y + 1, 3 / 16);
      spread(x, y + 1, 5 / 16);
      spread(x + 1, y + 1, 1 / 16);
    }
  }
}

async function ditherFile(input, output, opts = {}) {
  const { width, palette = PALETTE_TEAL, method = "bayer" } = opts;
  mkdirSync(dirname(output), { recursive: true });

  let pipeline = sharp(input).ensureAlpha();
  if (width) pipeline = pipeline.resize({ width, withoutEnlargement: true });

  const { data, info } = await pipeline
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rgb = new Uint8ClampedArray(data);
  const pal = palette.map(hexToRgb);

  if (method === "floyd") floydSteinberg(rgb, info.width, info.height, pal);
  else orderedDither(rgb, info.width, info.height, pal);

  await sharp(Buffer.from(rgb), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9, palette: true })
    .toFile(output);

  console.log(`  dither  ${relative(ROOT, output)}`);
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (IMAGE_EXT.has(extname(entry).toLowerCase())) out.push(full);
  }
  return out;
}

async function generatePatterns() {
  mkdirSync(PATTERN_DIR, { recursive: true });
  const size = 16;
  const pixels = (fn) => {
    const buf = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        const [r, g, b, a] = fn(x, y);
        buf[i] = r;
        buf[i + 1] = g;
        buf[i + 2] = b;
        buf[i + 3] = a;
      }
    }
    return buf;
  };
  const write = (name, fn) =>
    sharp(pixels(fn), { raw: { width: size, height: size, channels: 4 } })
      .png({ compressionLevel: 9 })
      .toFile(join(PATTERN_DIR, name))
      .then(() => console.log(`  pattern ${relative(ROOT, join(PATTERN_DIR, name))}`));

  await write("bayer.png", (x, y) => {
    const t = (BAYER8[y % 8][x % 8] + 0.5) / 64;
    return [0, 0, 0, Math.round((1 - t) * 255)];
  });
  await write("check.png", (x, y) => {
    const on = (Math.floor(x / 2) + Math.floor(y / 2)) % 2 === 0;
    return [0, 0, 0, on ? 0 : 40];
  });
  await write("scan.png", (x, y) => [0, 0, 0, y % 2 === 0 ? 0 : 35]);
  await write("grid.png", (x, y) =>
    x % 8 === 0 || y % 8 === 0 ? [0, 0, 0, 60] : [0, 0, 0, 0],
  );
}

async function processRawImages() {
  const files = walk(RAW_DIR);
  if (!files.length) {
    console.log("  no images in assets/raw/ (skipping)");
    return;
  }
  for (const file of files) {
    const rel = relative(RAW_DIR, file);
    const out = join(OUT_DIR, rel.replace(extname(rel), ".png"));
    await ditherFile(file, out, { palette: PALETTE_TEAL, method: "bayer" });
  }
}

async function processPhotos() {
  const files = walk(PHOTO_SRC_DIR);
  if (!files.length) {
    console.log("  no photos in src/assets/photos/ (skipping)");
    return;
  }
  for (const file of files) {
    const rel = relative(PHOTO_SRC_DIR, file);
    const out = join(PHOTO_OUT_DIR, rel.replace(extname(rel), ".png"));
    await ditherFile(file, out, {
      width: 900,
      palette: PALETTE_TEAL,
      method: "floyd",
    });
  }
}

async function ensureDefaultBackground() {
  const target = join(OUT_DIR, "bg.png");
  const candidates = [
    join(ROOT, "public/assets/images/rises_the_moon.jpeg"),
    join(ROOT, "public/assets/images/w.png"),
    join(ROOT, "public/assets/images/color.png"),
  ];
  const src = candidates.find((p) => existsSync(p));
  if (!src) {
    console.log("  no source image for default background (skipping)");
    return;
  }
  await ditherFile(src, target, {
    width: 640,
    palette: PALETTE_TEAL,
    method: "bayer",
  });
}

async function main() {
  console.log("dither: starting");
  await generatePatterns();
  await processRawImages();
  await processPhotos();
  await ensureDefaultBackground();
  console.log("dither: done");
}

main().catch((err) => {
  console.error("dither: failed:", err.message);
  process.exit(1);
});
