#!/usr/bin/env node
// Build the FMUI "duotone" style: the linear outline on top of a 20% tint of
// the icon's filled silhouette.
//
//   node make-duotone.mjs <out-dir> [icon-name...]     (no names = all icons)
//
// The silhouette comes from the matching bulk icon, which shares the linear
// icon's geometry. All its shapes are drawn solid inside one 20% group, so
// overlapping parts read as one even tint. Everything uses currentColor, so
// the icons follow the text colour on light and dark backgrounds alike.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { basename, join } from "node:path";

const LIB = "G:/UI Deisgn/icon-library/figma7000";
const TINT = 0.2;

const inner = (svg) => svg.replace(/^[\s\S]*?<svg\b[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();

export function toDuotone(linearSvg, bulkSvg, id) {
  // silhouette: bulk paths made fully opaque (their own opacity steps would
  // show up as uneven patches inside the tint)
  const fill = [...bulkSvg.matchAll(/<path\b[^>]*>/g)]
    .map((m) => m[0].replace(/\s(opacity|fill-opacity)="[^"]*"/g, "").replace(/\/?>$/, "/>"))
    .join("");
  // a few linear icons carry clipPath ids; make them unique per icon
  const outline = inner(linearSvg)
    .replace(/\bid="([^"]+)"/g, `id="${id}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${id}-$1)`);
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="${TINT}">${fill}</g>
${outline}
</svg>
`;
}

const isMain = process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]));
if (isMain) {
  const [outDir, ...names] = process.argv.slice(2);
  if (!outDir) {
    console.error("usage: node make-duotone.mjs <out-dir> [icon-name...]");
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });
  const list = names.length
    ? names
    : readdirSync(join(LIB, "linear")).filter((f) => f.endsWith(".svg")).map((f) => f.slice(0, -4));
  let n = 0;
  for (const name of list) {
    const lin = join(LIB, "linear", `${name}.svg`), blk = join(LIB, "bulk", `${name}.svg`);
    if (!existsSync(lin) || !existsSync(blk)) { console.error(`missing: ${name}`); continue; }
    const id = `d-${name.replace(/[^a-z0-9]+/gi, "-")}`;
    writeFileSync(join(outDir, `${name}.svg`), toDuotone(readFileSync(lin, "utf8"), readFileSync(blk, "utf8"), id));
    n++;
  }
  console.log(`wrote ${n} duotone icons to ${outDir}`);
}
