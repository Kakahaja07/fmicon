// Builds the fmicon originals (icons-src/originals.mjs) in all nine styles.
//   npm run originals      (also part of npm run free-icons)
// Output:
//   icons-src/out/<style>/<id>.svg            linear, outline, bold, bulk, twotone, broken
//   explorations/glass-icons/out/{dark,light,duotone,color}/<id>.svg   via the same generators as the FMUI icons
//   icons-src/out/index.json                  the ids and category labels, for build-free-icons

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { render } from "../icons-src/engine.mjs";
import { categories, originals } from "../icons-src/originals.mjs";

const OUT = "icons-src/out";
const GEN = "explorations/glass-icons";
const BASE = ["linear", "outline", "bold", "bulk", "twotone", "broken"];

const ids = new Set();
for (const icon of originals) {
  if (ids.has(icon.id)) throw new Error(`Duplicate id: ${icon.id}`);
  if (!categories[icon.id.split("--")[0]]) throw new Error(`Unknown category: ${icon.id}`);
  ids.add(icon.id);
}

rmSync(OUT, { recursive: true, force: true });
for (const style of BASE) mkdirSync(join(OUT, style), { recursive: true });
for (const icon of originals) {
  const files = render(icon, `o-${icon.id.replace(/[^a-z0-9]+/gi, "-")}`);
  for (const style of BASE) writeFileSync(join(OUT, style, `${icon.id}.svg`), files[style]);
}

// Glass (two tones), duotone and color come from the bulk and linear files, like the FMUI icons.
const node = (args, env = {}) => execFileSync(process.execPath, args, { cwd: GEN, env: { ...process.env, ...env }, stdio: ["ignore", "ignore", "inherit"] });
const bulk = resolve(OUT, "bulk");
const names = originals.map((i) => i.id);
node(["make-glass.mjs", "out/dark", bulk, "--theme", "dark"]);
node(["make-glass.mjs", "out/light", bulk, "--theme", "light"]);
node(["make-duotone.mjs", "out/duotone", ...names], { FMUI_LIB: resolve(OUT) });
node(["make-color.mjs", "out/color", ...names], { BULK_DIR: bulk });

writeFileSync(join(OUT, "index.json"), JSON.stringify({ categories, ids: names }, null, 1));
console.log(`✓ ${names.length} originals × 9 styles → ${OUT} and ${GEN}/out`);
