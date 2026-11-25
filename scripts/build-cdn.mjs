// Files for the icon CDN (cdn.fmicon.dev, a Cloudflare R2 bucket), built from packages/svg/icons.
//   npm run cdn:build
// Output (git-ignored):
//   dist-cdn/svg/<style>/<slug>.svg   every icon, every style, recolourable (currentColor)
//   dist-cdn/png/<style>/<slug>.png   256 × 256 PNG; line and fill styles drawn in near-black
//   dist-cdn/icons.json               slug, name and category of every icon
// Upload with `npm run cdn:upload` (see scripts/upload-cdn.mjs).

import { Resvg } from "@resvg/resvg-js";
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "packages/svg/icons";
const OUT = "dist-cdn";
const PNG_SIZE = Number(process.env.PNG_SIZE ?? 256);
// PNGs can't follow the page's text colour, so pick one that reads on light backgrounds
const PNG_INK = process.env.PNG_INK ?? "#111111";

rmSync(OUT, { recursive: true, force: true });

const styles = readdirSync(SRC);
let svgs = 0;
let pngs = 0;
const started = Date.now();

for (const style of styles) {
  const from = join(SRC, style);
  const svgDir = join(OUT, "svg", style);
  const pngDir = join(OUT, "png", style);
  mkdirSync(svgDir, { recursive: true });
  mkdirSync(pngDir, { recursive: true });

  for (const file of readdirSync(from)) {
    if (!file.endsWith(".svg")) continue;
    const path = join(from, file);
    copyFileSync(path, join(svgDir, file));
    svgs++;

    const svg = readFileSync(path, "utf8").replace(/currentColor/g, PNG_INK);
    const png = new Resvg(svg, { fitTo: { mode: "width", value: PNG_SIZE }, background: "rgba(0,0,0,0)", font: { loadSystemFonts: false } }).render().asPng();
    writeFileSync(join(pngDir, file.replace(/\.svg$/, ".png")), png);
    pngs++;
  }
  console.log(`✓ ${style}`);
}

copyFileSync("packages/svg/icons.json", join(OUT, "icons.json"));
console.log(`${svgs} SVGs and ${pngs} PNGs (${PNG_SIZE}px) in ${OUT}/ · ${((Date.now() - started) / 1000).toFixed(1)}s`);
