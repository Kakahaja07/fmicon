#!/usr/bin/env node
// Convert FMUI "bulk" SVGs into a monochrome "glass" style.
//
//   node make-glass.mjs <out-dir> <icon-name | path.svg | folder>...  [--theme light|dark]
//
// Bulk icons are two layers drawn with currentColor: a solid layer and a
// translucent one (opacity < 1). The glass recipe keeps that split:
//   solid layer       -> graphite gradient down each shape
//   translucent layer -> pale glass at ~62% opacity; any solid shape it sits
//                        in front of is hidden under it and shows through as
//                        a soft blur (frosted glass)
//   glass edge        -> thin white rim on the inside, fading out by 60% height
// No drop shadows or bevels: depth comes from the gradients and the blur alone.
// "--theme dark" makes the solid parts light so they read on dark surfaces.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";

const LIB = "G:/UI Deisgn/icon-library/figma7000/bulk";

const THEMES = {
  light: {
    solid: [["#5b5b5e", 1], ["#161617", 1]],
    glass: [["#e3e3e5", 0.62], ["#bbbbc0", 0.62]],
    rim: 1,
  },
  dark: {
    solid: [["#f4f4f6", 1], ["#a4a4aa", 1]],
    glass: [["#d8d8dc", 0.34], ["#9a9aa0", 0.26]],
    rim: 0.7,
  },
};

const BLUR = 1.6; // frosted blur, in icon units (24-unit grid)
const RIM = 1.5; // stroke width; half of it lands inside the glass -> 0.75 rim

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}

// Flatten <path> elements (bulk icons are almost all paths); a <g opacity>
// passes its opacity down to its children.
function parseLayers(svg) {
  const layers = [];
  const groupOpacity = [];
  for (const m of svg.matchAll(/<(\/?)(g|path)\b([^>]*?)(\/?)>/g)) {
    const [, closing, tag, rest, selfClose] = m;
    if (tag === "g") {
      if (closing) groupOpacity.pop();
      else if (!selfClose) groupOpacity.push(parseFloat(attrs(rest).opacity ?? "1"));
      continue;
    }
    if (closing) continue;
    const a = attrs(rest);
    if (!a.d) continue;
    const opacity = parseFloat(a.opacity ?? "1") * groupOpacity.reduce((x, y) => x * y, 1);
    layers.push({ d: a.d, fillRule: a["fill-rule"], glass: opacity < 0.9, box: pathBox(a.d) });
  }
  // A solid shape that sits inside a glass shape (receipt lines on a square,
  // a door on a house) is a detail on the glass, whatever order the file draws
  // them in, so it goes on top. Solid shapes that only touch or poke out of the
  // glass (the heart's top half) stay behind it and show through as blur.
  const inside = (s, g) => s.x0 >= g.x0 - 0.5 && s.y0 >= g.y0 - 0.5 && s.x1 <= g.x1 + 0.5 && s.y1 <= g.y1 + 0.5;
  const onTop = (l, i) => !l.glass && layers.slice(i + 1).some((g) => g.glass && inside(l.box, g.box));
  return [...layers.filter((l, i) => !onTop(l, i)), ...layers.filter(onTop)];
}

// Rough bounding box of a path: every end and control point. Good enough to
// tell "inside" from "beside"; curves never bulge past their control points.
function pathBox(d) {
  const box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  const add = (x, y) => {
    box.x0 = Math.min(box.x0, x); box.x1 = Math.max(box.x1, x);
    box.y0 = Math.min(box.y0, y); box.y1 = Math.max(box.y1, y);
  };
  const ARGS = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };
  let x = 0, y = 0, sx = 0, sy = 0;
  for (const [, cmd, raw] of d.matchAll(/([a-zA-Z])([^a-zA-Z]*)/g)) {
    const n = (raw.match(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) ?? []).map(Number);
    const k = cmd.toLowerCase();
    const rel = cmd !== cmd.toUpperCase();
    if (k === "z") { x = sx; y = sy; continue; }
    for (let i = 0; i + ARGS[k] <= n.length; i += ARGS[k]) {
      const p = n.slice(i, i + ARGS[k]);
      const ox = rel ? x : 0, oy = rel ? y : 0;
      if (k === "h") x = ox + p[0];
      else if (k === "v") y = oy + p[0];
      else if (k === "a") { x = ox + p[5]; y = oy + p[6]; }
      else {
        for (let j = 0; j < p.length - 2; j += 2) add(ox + p[j], oy + p[j + 1]); // control points
        x = ox + p[p.length - 2]; y = oy + p[p.length - 1];
      }
      add(x, y);
      if (k === "m" && i === 0) { sx = x; sy = y; }
    }
  }
  return box;
}

const grad = (id, [[c0, o0], [c1, o1]], y2 = 1) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="${y2}">` +
  `<stop stop-color="${c0}" stop-opacity="${o0}"/><stop offset="1" stop-color="${c1}" stop-opacity="${o1}"/></linearGradient>`;

export function toGlass(svg, id, { theme = "light" } = {}) {
  const t = THEMES[theme];
  const layers = parseLayers(svg);
  // each shape is defined once in <defs> and reused, since the glass recipe
  // needs the same outline up to four times (fill, mask, blur, rim)
  layers.forEach((l, i) => (l.ref = `${id}-s${i}`));
  const fr = (l) => (l.fillRule ? ` fill-rule="${l.fillRule}"` : "");
  const path = (l, extra) => `<use xlink:href="#${l.ref}" ${extra}/>`;
  const box = `x="-4" y="-4" width="32" height="32"`;
  const solid = `fill="url(#${id}-solid)"`;

  const defs = [
    ...layers.map((l) => `<path id="${l.ref}" d="${l.d}"${fr(l)}/>`),
    grad(`${id}-solid`, t.solid),
    grad(`${id}-glass`, t.glass),
    grad(`${id}-rim`, [["#fff", t.rim], ["#fff", 0]], 0.6),
    `<filter id="${id}-blur" filterUnits="userSpaceOnUse" ${box}><feGaussianBlur stdDeviation="${BLUR}"/></filter>`,
  ];
  const body = [];

  layers.forEach((l, i) => {
    if (!l.glass) {
      // hide the part of this solid shape that glass drawn later will cover
      const covers = layers.slice(i + 1).filter((g) => g.glass);
      if (!covers.length) return body.push(path(l, solid));
      defs.push(
        `<mask id="${id}-out${i}" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/>` +
          covers.map((g) => path(g, `fill="#000"`)).join("") +
          `</mask>`
      );
      return body.push(`<g mask="url(#${id}-out${i})">${path(l, solid)}</g>`);
    }
    // glass: blurred view of the solid shapes behind it, the tinted pane, the rim
    defs.push(`<mask id="${id}-in${i}" maskUnits="userSpaceOnUse" ${box}>${path(l, `fill="#fff"`)}</mask>`);
    const behind = layers.slice(0, i).filter((s) => !s.glass);
    if (behind.length)
      body.push(
        `<g mask="url(#${id}-in${i})"><g filter="url(#${id}-blur)">${behind.map((s) => path(s, solid)).join("")}</g></g>`
      );
    body.push(path(l, `fill="url(#${id}-glass)"`));
    body.push(
      `<g mask="url(#${id}-in${i})">${path(l, `fill="none" stroke="url(#${id}-rim)" stroke-width="${RIM}" stroke-linejoin="round"`)}</g>`
    );
  });

  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
  ${defs.join("\n  ")}
</defs>
${body.join("\n")}
</svg>
`;
}

// CLI
const isMain = process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]));
if (isMain) {
  const args = process.argv.slice(2);
  const theme = args.includes("--theme") ? args[args.indexOf("--theme") + 1] : "light";
  const positional = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--theme");
  const [outDir, ...inputs] = positional;
  if (!outDir || !inputs.length || !THEMES[theme]) {
    console.error("usage: node make-glass.mjs <out-dir> <icon-name|file.svg>... [--theme light|dark]");
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });
  // a folder (e.g. the whole bulk library) expands to its .svg files
  const files = inputs.flatMap((input) =>
    existsSync(input) && statSync(input).isDirectory()
      ? readdirSync(input).filter((f) => f.endsWith(".svg")).map((f) => join(input, f))
      : [input.endsWith(".svg") ? input : join(LIB, `${input}.svg`)]
  );
  for (const file of files) {
    if (!existsSync(file)) { console.error(`missing: ${file}`); continue; }
    const name = basename(file, ".svg");
    const id = `g-${name.replace(/[^a-z0-9]+/gi, "-")}-${theme}`;
    const out = join(outDir, `${name}.svg`);
    writeFileSync(out, toGlass(readFileSync(file, "utf8"), id, { theme }));
    console.log(`${out}`);
  }
}
