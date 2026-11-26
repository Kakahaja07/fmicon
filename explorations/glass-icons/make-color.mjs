#!/usr/bin/env node
// Build the FMUI "color" style: playful full-colour icons with a little depth,
// made to move. Built from the bulk icons, like glass.
//
//   node make-color.mjs <out-dir> [icon-name...]     (no names = all bulk icons)
//
// Bulk icons have a solid layer and a translucent one. Here they get roles:
//   body    the translucent shapes: a hue gradient, a darker lip underneath
//           (so it sits like a key cap) and a soft white rim along the top
//   detail  solid shapes that sit inside a body: white, drawn on top
//   accent  solid shapes beside the body: the hue's deeper shade, with a lip
// Icons with only one kind of layer are all body.
//
// Every part is wrapped in a class (fmi-body, fmi-detail, fmi-accent), so CSS
// can animate the parts on their own: the body squashes, details pop.
// Each icon gets one of six hues from its name; the site can swap the whole
// palette to a single hue by replacing the hex values (see PALETTE).

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { basename, join } from "node:path";
import { parseLayers } from "./make-glass.mjs";

const LIB = process.env.BULK_DIR ?? "G:/UI Deisgn/icon-library/figma7000/bulk";

// [top, bottom, deep] per hue. Keep in step with src/lib/colorStyle.ts.
export const PALETTE = {
  blue: ["#78b4ff", "#3d8bfd", "#2563d9"],
  violet: ["#b896ff", "#8b5cf6", "#6a3fd6"],
  pink: ["#ff8cc0", "#f4479a", "#cf2c78"],
  orange: ["#ffb15e", "#ff8a1f", "#dc6a0b"],
  green: ["#6fdc92", "#2fbf5f", "#1f9a48"],
  teal: ["#6fe0d8", "#18b8ad", "#0f948b"],
};
const HUES = Object.keys(PALETTE);

// A stable hue per icon, spread evenly over the six (FNV-1a hash of the name).
export function hueFor(name) {
  let h = 0x811c9dc5;
  for (const ch of name) h = Math.imul(h ^ ch.charCodeAt(0), 0x01000193) >>> 0;
  return HUES[h % HUES.length];
}

const LIP = 0.9; // how far the darker lip shows under a body, in icon units

export function toColor(bulkSvg, id, hue) {
  const [top, bottom, deep] = PALETTE[hue];
  const layers = parseLayers(bulkSvg);
  const mixed = layers.some((l) => l.glass) && layers.some((l) => !l.glass);
  const inside = (s, g) => s.x0 >= g.x0 - 0.5 && s.y0 >= g.y0 - 0.5 && s.x1 <= g.x1 + 0.5 && s.y1 <= g.y1 + 0.5;
  for (const l of layers) {
    l.role = !mixed || l.glass ? "body" : layers.some((g) => g.glass && inside(l.box, g.box)) ? "detail" : "accent";
  }

  const fr = (l) => (l.fillRule ? ` fill-rule="${l.fillRule}"` : "");
  const defs = [
    `<linearGradient id="${id}-b" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>`,
    `<linearGradient id="${id}-a" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${bottom}"/><stop offset="1" stop-color="${deep}"/></linearGradient>`,
    `<linearGradient id="${id}-d" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".86"/></linearGradient>`,
    `<linearGradient id="${id}-r" x1="0" y1="0" x2="0" y2=".55"><stop stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`,
  ];
  const parts = layers.map((l, i) => {
    const ref = `${id}-s${i}`;
    defs.push(`<path id="${ref}" d="${l.d}"${fr(l)}/>`);
    const use = (attrs) => `<use xlink:href="#${ref}" ${attrs}/>`;
    if (l.role === "detail") return { role: l.role, svg: `<g class="fmi-detail">${use(`fill="url(#${id}-d)"`)}</g>` };
    const fill = l.role === "body" ? `url(#${id}-b)` : `url(#${id}-a)`;
    // rim: a stroke kept inside the shape by clipping to it
    defs.push(`<clipPath id="${id}-c${i}">${use("")}</clipPath>`);
    return {
      role: l.role,
      svg:
        `<g class="fmi-${l.role}">` +
        use(`fill="${deep}" transform="translate(0 ${LIP})"`) +
        use(`fill="${fill}"`) +
        `<g clip-path="url(#${id}-c${i})">${use(`fill="none" stroke="url(#${id}-r)" stroke-width="1.4"`)}</g>` +
        `</g>`,
    };
  });
  // Bodies and accents keep the file's order (an accent may sit behind a body); details go on top.
  const body = [...parts.filter((p) => p.role !== "detail"), ...parts.filter((p) => p.role === "detail")].map((p) => p.svg);

  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="fmi" data-hue="${hue}">
<defs>${defs.join("")}</defs>
${body.join("\n")}
</svg>
`;
}

const isMain = process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]));
if (isMain) {
  const [outDir, ...names] = process.argv.slice(2);
  if (!outDir) {
    console.error("usage: node make-color.mjs <out-dir> [icon-name...]");
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });
  const list = names.length ? names : readdirSync(LIB).filter((f) => f.endsWith(".svg")).map((f) => f.slice(0, -4));
  const roles = { body: 0, detail: 0, accent: 0 };
  let n = 0;
  for (const name of list) {
    const file = join(LIB, `${name}.svg`);
    if (!existsSync(file)) { console.error(`missing: ${name}`); continue; }
    const svg = toColor(readFileSync(file, "utf8"), `c-${name.replace(/[^a-z0-9]+/gi, "-")}`, hueFor(name));
    for (const r of Object.keys(roles)) roles[r] += (svg.match(new RegExp(`fmi-${r}"`, "g")) ?? []).length;
    writeFileSync(join(outDir, `${name}.svg`), svg);
    n++;
  }
  console.log(`wrote ${n} color icons to ${outDir}`, roles);
}
