#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const BLOG_DIR = join(ROOT, "src/content/blog");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const name = arg.slice(2);
    if (name === "draft") {
      args.draft = true;
      continue;
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`faltou valor para --${name}`);
    }
    args[name] = value;
    i++;
  }
  return args;
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const args = parseArgs(process.argv.slice(2));

if (!args.title) {
  console.error("erro: --title é obrigatório");
  process.exit(1);
}

const slug = slugify(args.slug ?? args.title);
if (!slug) {
  console.error("erro: não foi possível derivar um slug");
  process.exit(1);
}

const target = join(BLOG_DIR, `${slug}.md`);
if (existsSync(target)) {
  console.error(`erro: já existe ${target}`);
  process.exit(1);
}

const tags = (args.tags ?? "")
  .split(",")
  .map((tag) => slugify(tag.trim()))
  .filter(Boolean);

const lines = [
  "---",
  `title: ${JSON.stringify(args.title)}`,
  `description: ${JSON.stringify(args.description ?? "")}`,
  `date: ${new Date().toISOString().slice(0, 10)}`,
];

if (tags.length > 0) {
  lines.push("tags:");
  for (const tag of tags) lines.push(`  - ${tag}`);
}

if (args.draft) lines.push("draft: true");

lines.push("---", "", "<!-- escreva o conteúdo aqui -->", "");

mkdirSync(BLOG_DIR, { recursive: true });
writeFileSync(target, lines.join("\n"), "utf8");

console.log(`criado: src/content/blog/${slug}.md`);
console.log("próximo passo: escrever o corpo e rodar npm run build");
