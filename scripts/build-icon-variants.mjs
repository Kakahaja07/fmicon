// One small file per icon with its SVG body in every style, for the style strip on icon pages:
//   src/content/icon-variants/<slug>.json  →  { linear, outline, …, glass, "glass-light", duotone }
// Built from the style files in src/content/free-icons. Run: npm run variants (also part of npm run free-icons)
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const SRC = "src/content/free-icons";
const OUT = "src/content/icon-variants";
const STYLES = ["linear", "outline", "bold", "bulk", "twotone", "broken", "glass", "glass-light", "duotone"];

const bySlug = new Map();
for (const style of STYLES) {
  const { icons } = JSON.parse(readFileSync(`${SRC}/${style}.json`, "utf8"));
  for (const icon of icons) {
    if (!bySlug.has(icon.slug)) bySlug.set(icon.slug, {});
    bySlug.get(icon.slug)[style] = icon.body;
  }
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const [slug, variants] of bySlug) writeFileSync(`${OUT}/${slug}.json`, JSON.stringify(variants));
console.log(`✓ ${bySlug.size} icons → ${OUT}`);
