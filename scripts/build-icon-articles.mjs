// Builds one JSON file per free icon for its page article: src/content/icon-articles/<slug>.json
// Inputs:
//   scripts/data/icon-keywords.json     keyword plan (primary + secondary keywords per icon)
//   scripts/data/articles/batch-*.json  the written article text per icon
//   src/content/free-icons/<style>.json the icon in every style (for the style switcher)
// Run after `npm run free-icons`:  npm run articles

import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "src/content/icon-articles";
const ICONS = "src/content/free-icons";
const STYLES = ["linear", "outline", "bold", "bulk", "twotone", "broken", "glass", "duotone"];

const read = (file) => JSON.parse(readFileSync(file, "utf8"));
const keywords = read("scripts/data/icon-keywords.json");
const text = Object.assign(
  {},
  ...readdirSync("scripts/data/articles")
    .filter((f) => f.endsWith(".json"))
    .map((f) => read(join("scripts/data/articles", f))),
);

const bySlug = (file) => new Map(read(join(ICONS, `${file}.json`)).icons.map((i) => [i.slug, i.body]));
const styleBodies = Object.fromEntries(STYLES.map((s) => [s, bySlug(s)]));
const glassLight = bySlug("glass-light");

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const missing = [];
for (const slug of styleBodies.linear.keys()) {
  const plan = keywords[slug];
  const body = text[slug];
  if (!plan || !body) {
    missing.push(slug);
    continue;
  }
  const [primary, secondary] = plan;
  const article = {
    primary,
    keywords: secondary,
    ...body,
    // The same icon in every style, for the style switcher at the top of the page
    variants: Object.fromEntries(STYLES.map((s) => [s, styleBodies[s].get(slug)])),
    glassLight: glassLight.get(slug),
  };
  writeFileSync(join(OUT, `${slug}.json`), JSON.stringify(article));
}

if (missing.length) {
  console.error(`No article for: ${missing.join(", ")}`);
  process.exit(1);
}
console.log(`Wrote ${styleBodies.linear.size} icon articles to ${OUT}`);
