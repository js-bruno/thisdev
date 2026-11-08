import { existsSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ASSET_DIR = join(ROOT, "blog/_astro");
const SOURCE_EXT = new Set([".png", ".jpg", ".jpeg"]);

if (!existsSync(ASSET_DIR)) {
  console.log("clean-build: blog/_astro not found (skipping)");
  process.exit(0);
}

let removed = 0;
for (const file of readdirSync(ASSET_DIR)) {
  if (!SOURCE_EXT.has(extname(file).toLowerCase())) continue;
  unlinkSync(join(ASSET_DIR, file));
  removed++;
}

console.log(`clean-build: removed ${removed} unused source image(s)`);
