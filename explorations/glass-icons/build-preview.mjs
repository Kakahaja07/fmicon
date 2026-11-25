// Regenerates out/ and index.html (the 4-icon glass prototype preview).
//   node build-preview.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { toGlass } from "./make-glass.mjs";

const LIB = "G:/UI Deisgn/icon-library/figma7000/bulk";
const ICONS = [
  ["support-like-question--heart", "Heart"],
  ["notifications--notification", "Bell"],
  ["video-audio-image--camera", "Camera"],
  ["essetional--home-2", "Home"],
];

const src = (n) => readFileSync(`${LIB}/${n}.svg`, "utf8");
const sized = (svg, px) => svg.replace(/width="24" height="24"/, `width="${px}" height="${px}"`);

for (const theme of ["light", "dark"]) {
  mkdirSync(`out/${theme}`, { recursive: true });
  for (const [n] of ICONS) writeFileSync(`out/${theme}/${n}.svg`, toGlass(src(n), `g-${n}-${theme}`, { theme }));
}

let uid = 0;
// inline each copy with its own id prefix so many can share one page
const glass = (n, theme, px) => sized(toGlass(src(n), `p${uid++}`, { theme }), px);
const bulk = (n, px) => sized(src(n), px);

function panel(kind) {
  const dark = kind === "dark";
  const cols = dark
    ? ["Bulk (original)", "Glass · light tone", "Glass · dark tone"]
    : ["Bulk (original)", "Glass"];
  const rows = ICONS.map(([n, label]) => {
    const cells = [
      `<div class="pair">${bulk(n, 32)}${bulk(n, 64)}</div>`,
      `<div class="pair">${glass(n, "light", 32)}${glass(n, "light", 64)}</div>`,
      ...(dark ? [`<div class="pair">${glass(n, "dark", 32)}${glass(n, "dark", 64)}</div>`] : []),
    ];
    return `<div class="row"><div class="label">${label}<small>${n}</small></div>${cells.join("")}</div>`;
  }).join("");
  return `<section class="panel ${kind}" style="--cols:${cols.length}">
    <div class="row head"><div></div>${cols.map((c) => `<div>${c}<small>32 px · 64 px</small></div>`).join("")}</div>
    ${rows}
  </section>`;
}

const grid = (theme) =>
  `<div class="strip">${ICONS.map(([n, label]) => `<figure>${glass(n, theme, 128)}<figcaption>${label}</figcaption></figure>`).join("")}</div>`;

writeFileSync(
  "index.html",
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>FM Icons · glass prototype</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font: 14px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif; background: #e9e9eb; color: #161617; padding: 32px; }
  h1 { font-size: 20px; font-weight: 600; margin: 0 0 4px; }
  p.lede { margin: 0 0 24px; color: #6b6b70; max-width: 64ch; }
  .wrap { display: grid; grid-template-columns: 1fr; gap: 24px; max-width: 760px; }
  .panel { border-radius: 20px; padding: 24px; }
  .panel.light { background: #fff; color: #161617; }
  .panel.dark { background: #161617; color: #f2f2f3; }
  .row { display: grid; grid-template-columns: 150px repeat(var(--cols), 1fr); align-items: center; gap: 12px; padding: 14px 0; border-top: 1px solid color-mix(in srgb, currentColor 8%, transparent); }
  .row.head { border-top: 0; padding-top: 0; font-size: 12px; font-weight: 600; }
  small { display: block; font-weight: 400; font-size: 11px; opacity: .5; }
  .label { font-weight: 500; }
  .pair { display: flex; align-items: center; gap: 20px; }
  .pair svg { display: block; flex: none; }
  .strip { display: flex; gap: 40px; padding: 28px 24px 20px; border-radius: 20px; margin-top: 24px; }
  .strip figure { margin: 0; display: grid; justify-items: center; gap: 10px; }
  .strip figcaption { font-size: 12px; opacity: .55; }
  .strip.light { background: #fff; } .strip.dark { background: #161617; color: #f2f2f3; }
</style></head>
<body>
  <h1>Glass style — 4-icon prototype</h1>
  <p class="lede">Made automatically from the FMUI <b>bulk</b> SVGs by <code>make-glass.mjs</code>: the solid layer becomes a graphite gradient, the 40% layer becomes a 62% glass pane that blurs whatever solid shape sits behind it, and each pane gets a thin white rim fading down from the top. No shadows or bevels.</p>
  <div class="wrap">${panel("light")}${panel("dark")}</div>
  <div class="wrap">
    <div class="strip light">${grid("light")}</div>
    <div class="strip dark">${grid("dark")}</div>
  </div>
</body></html>
`
);
console.log("wrote index.html and out/");
