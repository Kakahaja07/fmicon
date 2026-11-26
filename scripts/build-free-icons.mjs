// Builds the free icon sample used by the /icons page.
//   npm run free-icons              (99 hand-picked icons, the default)
//   FREE_LIMIT=150 npm run free-icons
//
// Output:
//   src/content/free-icons/<style>.json   one file per style; bundled as lazy chunks, so pages can be
//                                         prerendered with real icons and still load styles on demand
//   src/content/free-icons/pages.json     every URL to prerender (/icons, /icons/<style>, /icons/<style>/<slug>)
//   src/content/freeIcons.meta.ts         counts, categories and the slug index (known at build time)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const LIB = process.env.FMUI_LIB ?? "G:/UI Deisgn/icon-library/figma7000";
// Glass style, generated from the bulk icons by explorations/glass-icons/make-glass.mjs (dark tone).
const GLASS_DIR = process.env.GLASS_DIR ?? "explorations/glass-icons/out/dark";
// Duotone style: linear outline over a 20% fill, from explorations/glass-icons/make-duotone.mjs.
const DUOTONE_DIR = process.env.DUOTONE_DIR ?? "explorations/glass-icons/out/duotone";
// Color style: bright layered icons whose parts animate, from explorations/glass-icons/make-color.mjs.
const COLOR_DIR = process.env.COLOR_DIR ?? "explorations/glass-icons/out/color";
// Every icon is free and open source. FREE_LIMIT=99 builds a small set for quick local work.
const LIMIT = Number(process.env.FREE_LIMIT ?? Infinity);
// Icons per style in the home page previews (preview-<style>.json)
const PREVIEW = 40;

// fmicon originals: icons drawn for fmicon (icons-src/), built by scripts/build-originals.mjs.
const ORIG_DIR = "icons-src/out";
const orig = existsSync(join(ORIG_DIR, "index.json")) ? JSON.parse(readFileSync(join(ORIG_DIR, "index.json"), "utf8")) : { ids: [], categories: {} };
const ORIGINALS = new Set(orig.ids);

const LIB_STYLES = ["linear", "outline", "bold", "bulk", "twotone", "broken"];
const STYLES = [...LIB_STYLES, "glass", "duotone", "color"];
const fileFor = (style, id) =>
  style === "glass" ? join(GLASS_DIR, `${id}.svg`)
  : style === "duotone" ? join(DUOTONE_DIR, `${id}.svg`)
  : style === "color" ? join(COLOR_DIR, `${id}.svg`)
  : join(ORIGINALS.has(id) ? ORIG_DIR : LIB, style, `${id}.svg`);

// The free sample: the everyday icons people reach for first, in this order.
// A short name is matched to its category automatically; use "category--name" when a name is ambiguous.
const PICKS = [
  // Navigation & core UI
  "home", "home-2", "search-normal", "setting", "setting-2", "menu", "more", "category", "element-3", "filter",
  "add", "add-circle", "minus", "close-circle", "tick-circle", "arrow-left", "arrow-right", "arrow-up", "arrow-down",
  "arrow-circle-right", "refresh", "repeat", "export", "import", "login", "logout", "send", "share", "link", "maximize-4",
  // People & communication
  "user", "profile-2user", "people", "user-add", "message", "messages-2", "sms", "notification", "call", "microphone",
  "video", "direct-inbox", "emoji-happy", "support-like-question--like", "heart", "star", "medal-star", "crown", "magic-star",
  // Content & files
  "folder", "folder-open", "content--document", "document-text", "copy", "edit", "trash", "archive", "bookmark", "clipboard-text",
  "note", "gallery", "camera", "image", "music", "play", "pause", "volume-high", "code", "command",
  // Time, places, money
  "calendar", "clock", "timer", "location", "map", "global", "wallet", "card", "money", "dollar-circle",
  "bag", "shopping-cart", "gift", "receipt", "ticket", "discount-shape", "chart", "graph", "trend-up", "diagram",
  // Devices, security, weather & things
  "monitor", "mobile", "headphone", "keyboard", "printer", "wifi", "battery-full", "cloud", "lock", "unlock",
  "key", "shield-tick", "eye", "scan", "lamp-on", "flash", "sun", "moon", "coffee", "cup",
  "airplane", "car", "truck", "building", "box", "flag", "tag", "lifebuoy", "brush", "shapes",
];

// Clean up category names from the source library.
const LABELS = {
  essetional: "Essentials",
  programing: "Programming",
  "car-linear": "Transport",
  "computers-devices-electronics": "Devices",
  "emails-messages": "Messages",
  "support-like-question": "Support & likes",
  "type-paragraph-character": "Typography",
  "video-audio-image": "Media",
  "school-learning": "Learning",
  "design-tools": "Design tools",
  "crypto-currency": "Crypto",
  // Brand and coin logos. The marks belong to their owners (see LICENSE).
  "company-logos": "Brands",
};
const label = (slug) =>
  LABELS[slug] ?? orig.categories[slug] ?? slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

const index = JSON.parse(readFileSync(join(LIB, "index.json"), "utf8"));
const allIds = [...new Set([...index.filter((e) => e.style === "linear").map((e) => e.name), ...orig.ids])];
const usable = (id) => STYLES.every((s) => existsSync(fileFor(s, id)));

// Resolve each pick to a full id, keep the first LIMIT that exist in every style.
const picked = [];
const missing = [];
for (const pick of PICKS) {
  if (picked.length >= LIMIT) break;
  const id = pick.includes("--") ? pick : allIds.find((x) => x.split("--")[1] === pick && usable(x));
  if (id && usable(id) && !picked.includes(id)) picked.push(id);
  else missing.push(pick);
}
// The originals come right after the curated picks, so the new drawings show near the top.
for (const id of orig.ids) if (picked.length < LIMIT && usable(id) && !picked.includes(id)) picked.push(id);
// Top up from the rest of the library if the list ran short. Brand logos go last, so they never
// take a plain URL (/icons/linear/triangle) from an icon that already had it.
const brandLast = (id) => (id.startsWith("company-logos--") ? 1 : 0);
for (const id of allIds.sort((a, b) => brandLast(a) - brandLast(b) || a.localeCompare(b))) {
  if (picked.length >= LIMIT) break;
  if (usable(id) && !picked.includes(id)) picked.push(id);
}
if (missing.length) console.log(`Not found in every style (skipped): ${missing.join(", ")}`);

const body = (svg) =>
  svg
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .replace(/\s*\n\s*/g, "")
    // Plain href works inline and in React; xlink:href needs extra namespace handling.
    .replace(/xlink:href=/g, "href=")
    // 2 decimals is invisible on a 24px grid and noticeably shrinks the files.
    .replace(/(\d+\.\d\d)\d+/g, "$1")
    .trim();

// URL slug per icon: its name, made unique with the category when two icons share a name.
const slugOf = new Map();
for (const id of picked) {
  const [cat, name] = id.split("--");
  // Earlier icons (the curated picks) keep the plain name, so their URLs never change.
  const clash = picked.some((other) => other !== id && other.split("--")[1] === name && picked.indexOf(other) < picked.indexOf(id));
  slugOf.set(id, clash ? `${name}-${cat}` : name);
}

const outDir = "src/content/free-icons";
mkdirSync(outDir, { recursive: true });
for (const style of STYLES) {
  // Keep the curated order: most useful icons first.
  const icons = picked.map((id) => {
    const [cat, name] = id.split("--");
    return { id, slug: slugOf.get(id), name, category: cat, body: body(readFileSync(fileFor(style, id), "utf8")) };
  });
  writeFileSync(join(outDir, `${style}.json`), JSON.stringify({ style, icons }));
  // Small preview (the first, most-used icons) for the home page, so it never loads a whole style.
  writeFileSync(join(outDir, `preview-${style}.json`), JSON.stringify({ style, icons: icons.slice(0, PREVIEW) }));
}

// Glass has baked-in shading, so light mode needs its own tone (dark graphite on light surfaces).
const GLASS_LIGHT_DIR = process.env.GLASS_LIGHT_DIR ?? GLASS_DIR.replace(/dark$/, "light");
const glassLight = picked.map((id) => {
  const [cat, name] = id.split("--");
  return { id, slug: slugOf.get(id), name, category: cat, body: body(readFileSync(join(GLASS_LIGHT_DIR, `${id}.svg`), "utf8")) };
});
writeFileSync(join(outDir, "glass-light.json"), JSON.stringify({ style: "glass", tone: "light", icons: glassLight }));
writeFileSync(join(outDir, "preview-glass-light.json"), JSON.stringify({ style: "glass", tone: "light", icons: glassLight.slice(0, PREVIEW) }));

const categories = [...new Set(picked.map((id) => id.split("--")[0]))]
  .map((slug) => ({ slug, label: label(slug), count: picked.filter((id) => id.startsWith(slug + "--")).length }))
  .sort((a, b) => a.label.localeCompare(b.label));
const total = picked.length;

// One small sample per style for the style switcher (a bell, like a light switch for styles).
const SAMPLE = usable("notifications--notification") ? "notifications--notification" : picked[0];
const samples = Object.fromEntries(STYLES.map((s) => [s, body(readFileSync(fileFor(s, SAMPLE), "utf8"))]));
const samplesLight = { glass: body(readFileSync(join(GLASS_LIGHT_DIR, `${SAMPLE}.svg`), "utf8")) };

// A few color-style icons for the landing page (the feature tiles), so it never loads the whole color set.
const COLOR_PICKS = [
  "search--search-normal", "design-tools--magicpen", "support-like-question--heart",
  "computers-devices-electronics--mouse", "programing--code", "computers-devices-electronics--cloud-change",
];
writeFileSync(
  "src/content/colorPicks.ts",
  `// Generated by scripts/build-free-icons.mjs. Do not edit by hand.
` +
    `export const colorPicks = ${JSON.stringify(Object.fromEntries(COLOR_PICKS.map((id) => [id, body(readFileSync(fileFor("color", id), "utf8"))])), null, 2)} as const;
`,
);

// Small index for routing, SEO pages and the sitemap (no SVG bodies).
const slugIndex = picked.map((id) => ({ id, slug: slugOf.get(id), name: id.split("--")[1], category: id.split("--")[0] }));
const pages = ["/icons", ...STYLES.map((st) => `/icons/${st}`), ...STYLES.flatMap((st) => slugIndex.map((i) => `/icons/${st}/${i.slug}`))];
writeFileSync(join(outDir, "pages.json"), JSON.stringify(pages, null, 1));

writeFileSync(
  "src/content/freeIcons.meta.ts",
  `// Generated by scripts/build-free-icons.mjs. Do not edit by hand.\n` +
    `export const freeIconsMeta = ${JSON.stringify({ free: picked.length, total, styles: STYLES, categories, samples, samplesLight, index: slugIndex }, null, 2)} as const;\n`,
);

console.log(`${picked.length} free icons × ${STYLES.length} styles → ${outDir} · ${pages.length} pages`);
