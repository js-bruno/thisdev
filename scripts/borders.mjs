import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/assets/borders");

const D = 36;
const S = 12;
const B = 3;

const svg = (parts) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${D}" height="${D}" viewBox="0 0 ${D} ${D}" shape-rendering="crispEdges">${parts.join("")}</svg>`;

function frame({ band, spike, accent }) {
  const p = [];
  const e = S;
  const mid = S + e / 2;

  p.push(`<rect x="${S}" y="0" width="${e}" height="${B}" fill="${band}"/>`);
  p.push(`<rect x="${S}" y="${D - B}" width="${e}" height="${B}" fill="${band}"/>`);
  p.push(`<rect x="0" y="${S}" width="${B}" height="${e}" fill="${band}"/>`);
  p.push(`<rect x="${D - B}" y="${S}" width="${B}" height="${e}" fill="${band}"/>`);

  for (const x of [S + 3, S + e - 3]) {
    p.push(`<path d="M${x - 3},${B} L${x},${B + 6} L${x + 3},${B} Z" fill="${spike}"/>`);
    p.push(`<path d="M${x - 3},${D - B} L${x},${D - B - 6} L${x + 3},${D - B} Z" fill="${spike}"/>`);
  }
  for (const y of [S + 3, S + e - 3]) {
    p.push(`<path d="M${B},${y - 3} L${B + 6},${y} L${B},${y + 3} Z" fill="${spike}"/>`);
    p.push(`<path d="M${D - B},${y - 3} L${D - B - 6},${y} L${D - B},${y + 3} Z" fill="${spike}"/>`);
  }

  p.push(`<path d="M0,0 h${S} v${B} h-${S - B} v${S - B} h-${B} z" fill="${band}"/>`);
  p.push(`<path d="M${D},0 h-${S} v${B} h${S - B} v${S - B} h${B} z" fill="${band}"/>`);
  p.push(`<path d="M0,${D} h${S} v-${B} h-${S - B} v-${S - B} h-${B} z" fill="${band}"/>`);
  p.push(`<path d="M${D},${D} h-${S} v-${B} h${S - B} v-${S - B} h${B} z" fill="${band}"/>`);

  p.push(`<path d="M${B},${B} l5,5 h-5 z" fill="${accent}"/>`);
  p.push(`<path d="M${D - B},${B} l-5,5 h5 z" fill="${accent}"/>`);
  p.push(`<path d="M${B},${D - B} l5,-5 h-5 z" fill="${accent}"/>`);
  p.push(`<path d="M${D - B},${D - B} l-5,-5 h5 z" fill="${accent}"/>`);

  return svg(p);
}

function stitched({ band, thread }) {
  const p = [];
  const e = S;
  p.push(`<rect x="${S}" y="0" width="${e}" height="${B}" fill="${band}"/>`);
  p.push(`<rect x="${S}" y="${D - B}" width="${e}" height="${B}" fill="${band}"/>`);
  p.push(`<rect x="0" y="${S}" width="${B}" height="${e}" fill="${band}"/>`);
  p.push(`<rect x="${D - B}" y="${S}" width="${B}" height="${e}" fill="${band}"/>`);

  const cross = (cx, cy) => {
    p.push(`<path d="M${cx - 3},${cy - 3} l6,6 M${cx + 3},${cy - 3} l-6,6" stroke="${thread}" stroke-width="1" fill="none"/>`);
  };
  for (const x of [S + 3, S + e - 3]) {
    cross(x, 2);
    cross(x, D - 2);
  }
  for (const y of [S + 3, S + e - 3]) {
    cross(2, y);
    cross(D - 2, y);
  }

  p.push(`<path d="M0,0 h${S} v${B} h-${S - B} v${S - B} h-${B} z" fill="${band}"/>`);
  p.push(`<path d="M${D},0 h-${S} v${B} h${S - B} v${S - B} h${B} z" fill="${band}"/>`);
  p.push(`<path d="M0,${D} h${S} v-${B} h-${S - B} v-${S - B} h-${B} z" fill="${band}"/>`);
  p.push(`<path d="M${D},${D} h-${S} v-${B} h${S - B} v-${S - B} h${B} z" fill="${band}"/>`);

  cross(4, 4);
  cross(D - 4, 4);
  cross(4, D - 4);
  cross(D - 4, D - 4);

  return svg(p);
}

function terminal({ line, bright, dim }) {
  const p = [];
  const L = 7;
  const T = 2;

  p.push(`<rect x="0" y="0" width="${D}" height="1" fill="${line}"/>`);
  p.push(`<rect x="0" y="${D - 1}" width="${D}" height="1" fill="${line}"/>`);
  p.push(`<rect x="0" y="0" width="1" height="${D}" fill="${line}"/>`);
  p.push(`<rect x="${D - 1}" y="0" width="1" height="${D}" fill="${line}"/>`);

  for (let x = S + 1; x < 2 * S; x += 4) {
    p.push(`<rect x="${x}" y="4" width="2" height="1" fill="${dim}"/>`);
    p.push(`<rect x="${x}" y="${D - 5}" width="2" height="1" fill="${dim}"/>`);
  }
  for (let y = S + 1; y < 2 * S; y += 4) {
    p.push(`<rect x="4" y="${y}" width="1" height="2" fill="${dim}"/>`);
    p.push(`<rect x="${D - 5}" y="${y}" width="1" height="2" fill="${dim}"/>`);
  }

  p.push(`<rect x="0" y="0" width="${L}" height="${T}" fill="${bright}"/>`);
  p.push(`<rect x="0" y="0" width="${T}" height="${L}" fill="${bright}"/>`);
  p.push(`<rect x="${D - L}" y="0" width="${L}" height="${T}" fill="${bright}"/>`);
  p.push(`<rect x="${D - T}" y="0" width="${T}" height="${L}" fill="${bright}"/>`);
  p.push(`<rect x="0" y="${D - T}" width="${L}" height="${T}" fill="${bright}"/>`);
  p.push(`<rect x="0" y="${D - L}" width="${T}" height="${L}" fill="${bright}"/>`);
  p.push(`<rect x="${D - L}" y="${D - T}" width="${L}" height="${T}" fill="${bright}"/>`);
  p.push(`<rect x="${D - T}" y="${D - L}" width="${T}" height="${L}" fill="${bright}"/>`);

  p.push(`<rect x="${S + 5}" y="1" width="2" height="2" fill="${bright}"/>`);
  p.push(`<rect x="${S + 5}" y="${D - 3}" width="2" height="2" fill="${bright}"/>`);
  p.push(`<rect x="1" y="${S + 5}" width="2" height="2" fill="${bright}"/>`);
  p.push(`<rect x="${D - 3}" y="${S + 5}" width="2" height="2" fill="${bright}"/>`);

  return svg(p);
}

function drips({ band, drop }) {
  const p = [];
  const e = S;
  p.push(`<rect x="${S}" y="0" width="${e}" height="${B}" fill="${band}"/>`);
  p.push(`<rect x="${S}" y="${D - B}" width="${e}" height="${B}" fill="${band}"/>`);
  p.push(`<rect x="0" y="${S}" width="${B}" height="${e}" fill="${band}"/>`);
  p.push(`<rect x="${D - B}" y="${S}" width="${B}" height="${e}" fill="${band}"/>`);

  for (const x of [S + 3, S + 7, S + e - 3]) {
    p.push(`<rect x="${x}" y="${B}" width="1" height="6" fill="${drop}"/>`);
    p.push(`<rect x="${x}" y="${D - B - 6}" width="1" height="6" fill="${drop}"/>`);
  }
  for (const y of [S + 3, S + 7, S + e - 3]) {
    p.push(`<rect x="${B}" y="${y}" width="6" height="1" fill="${drop}"/>`);
    p.push(`<rect x="${D - B - 6}" y="${y}" width="6" height="1" fill="${drop}"/>`);
  }

  p.push(`<path d="M0,0 h${S} v${B} h-${S - B} v${S - B} h-${B} z" fill="${band}"/>`);
  p.push(`<path d="M${D},0 h-${S} v${B} h${S - B} v${S - B} h${B} z" fill="${band}"/>`);
  p.push(`<path d="M0,${D} h${S} v-${B} h-${S - B} v-${S - B} h-${B} z" fill="${band}"/>`);
  p.push(`<path d="M${D},${D} h-${S} v-${B} h${S - B} v-${S - B} h${B} z" fill="${band}"/>`);

  return svg(p);
}

mkdirSync(OUT, { recursive: true });

const files = {
  "thorn.svg": frame({ band: "#151a10", spike: "#4f6b2a", accent: "#8a1c24" }),
  "blood.svg": drips({ band: "#1a0a0c", drop: "#b3161f" }),
  "stitch.svg": stitched({ band: "#0d0d10", thread: "#cfc9bf" }),
  "terminal.svg": terminal({
    line: "#2c5a53",
    bright: "#9fe0c8",
    dim: "#5f9ea0",
  }),
};

for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT, name), content);
  console.log(`  border ${name}`);
}

console.log("borders: done");
