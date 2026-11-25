// Builds all.html: every converted glass icon, with flags for ones to eyeball.
// It loads the SVGs from out/, so open it from disk in a normal browser.
//   node build-all.mjs            (run make-glass.mjs on the bulk folder first)
//   node build-all.mjs --sheets <dir>   also write small inline contact sheets
//                                        (for previews that can't load files)
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";

const LIB = "G:/UI Deisgn/icon-library/figma7000/bulk";
const files = readdirSync("out/light").filter((f) => f.endsWith(".svg")).sort();

const icons = files.map((f) => {
  const src = readFileSync(`${LIB}/${f}`, "utf8");
  const paths = [...src.matchAll(/<path\b[^>]*>/g)].map((m) => m[0]);
  const opac = paths.map((p) => parseFloat(p.match(/opacity="([^"]*)"/)?.[1] ?? "1"));
  const flags = [];
  if (/<g\b/.test(src)) flags.push("group");
  if (/stroke=/.test(src)) flags.push("stroke");
  if (opac.every((o) => o >= 0.9)) flags.push("no-glass");
  if (opac.every((o) => o < 0.9)) flags.push("all-glass");
  if (opac.some((o) => o < 0.9 && Math.abs(o - 0.4) > 0.02)) flags.push("odd-opacity");
  // a solid shape drawn before a glass one -> frosted blur kicks in
  if (opac.some((o, i) => o >= 0.9 && opac.slice(i + 1).some((x) => x < 0.9))) flags.push("blur");
  return { f, name: f.replace(/\.svg$/, ""), flags };
});

const counts = {};
for (const i of icons) for (const fl of i.flags) counts[fl] = (counts[fl] ?? 0) + 1;
console.log(icons.length, "icons", counts);

const CSS = `
  body { margin: 0; font: 13px/1.4 system-ui, "Segoe UI", sans-serif; background: #fff; color: #161617; }
  body.dark { background: #161617; color: #f2f2f3; }
  header { position: sticky; top: 0; z-index: 1; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 12px 20px; background: inherit; border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent); }
  header b { margin-right: 8px; }
  button, input { font: inherit; color: inherit; background: color-mix(in srgb, currentColor 7%, transparent); border: 0; border-radius: 8px; padding: 6px 10px; cursor: pointer; }
  button[aria-pressed="true"] { background: color-mix(in srgb, currentColor 18%, transparent); }
  input { cursor: text; width: 180px; }
  main { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 4px; padding: 16px 20px; }
  figure { margin: 0; display: grid; justify-items: center; gap: 6px; padding: 14px 4px 10px; border-radius: 12px; }
  figure:hover { background: color-mix(in srgb, currentColor 6%, transparent); }
  figure img, figure svg { display: block; width: var(--s, 32px); height: var(--s, 32px); }
  figcaption { font-size: 10px; opacity: .5; text-align: center; overflow-wrap: anywhere; }
  figure[hidden] { display: none; }`;

const label = (i) => i.name.replace("--", " · ");

writeFileSync(
  "all.html",
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>FM Icons · glass · all ${icons.length}</title>
<style>${CSS}</style></head><body>
<header>
  <b>Glass · ${icons.length} icons</b>
  <button data-bg aria-pressed="false">Dark background</button>
  <button data-size="32" aria-pressed="true">32</button><button data-size="48" aria-pressed="false">48</button><button data-size="64" aria-pressed="false">64</button>
  <button data-flag="" aria-pressed="true">All</button>
  ${Object.entries(counts).map(([k, n]) => `<button data-flag="${k}" aria-pressed="false">${k} ${n}</button>`).join("")}
  <input type="search" placeholder="Search…">
</header>
<main>${icons
    .map((i) => `<figure data-name="${i.name}" data-flags="${i.flags.join(" ")}"><img loading="lazy" src="out/light/${i.f}" alt=""><figcaption>${label(i)}</figcaption></figure>`)
    .join("")}</main>
<script>
  const figs = [...document.querySelectorAll("figure")];
  let flag = "", q = "";
  const press = (sel, el) => document.querySelectorAll(sel).forEach((b) => b.setAttribute("aria-pressed", b === el));
  const apply = () => figs.forEach((f) => (f.hidden = (flag && !f.dataset.flags.split(" ").includes(flag)) || (q && !f.dataset.name.includes(q))));
  document.querySelector("[data-bg]").onclick = (e) => {
    const dark = document.body.classList.toggle("dark");
    e.target.setAttribute("aria-pressed", dark);
    figs.forEach((f) => { const img = f.querySelector("img"); img.src = img.getAttribute("src").replace(/\\/(light|dark)\\//, dark ? "/dark/" : "/light/"); });
  };
  document.querySelectorAll("[data-size]").forEach((b) => (b.onclick = () => { document.body.style.setProperty("--s", b.dataset.size + "px"); press("[data-size]", b); }));
  document.querySelectorAll("[data-flag]").forEach((b) => (b.onclick = () => { flag = b.dataset.flag; press("[data-flag]", b); apply(); }));
  document.querySelector("input").oninput = (e) => { q = e.target.value.trim().toLowerCase(); apply(); };
</script>
</body></html>
`
);
console.log("wrote all.html");

// Inline contact sheets: 48 icons each, light on white then dark on #161617.
const sheetsAt = process.argv.indexOf("--sheets");
if (sheetsAt > 0) {
  const dir = process.argv[sheetsAt + 1];
  mkdirSync(dir, { recursive: true });
  const SHEET = 48;
  const cell = (i, t) => `<figure>${readFileSync(`out/${t}/${i.f}`, "utf8")}<figcaption>${label(i)}${i.flags.length ? ` [${i.flags.join(",")}]` : ""}</figcaption></figure>`;
  for (let p = 0; p * SHEET < icons.length; p++) {
    const part = icons.slice(p * SHEET, (p + 1) * SHEET);
    writeFileSync(
      `${dir}/sheet-${String(p + 1).padStart(2, "0")}.html`,
      `<!doctype html><html><head><meta charset="utf-8"><style>${CSS} main.dk { background: #161617; color: #f2f2f3; } :root { --s: 40px; }</style></head><body>
<main>${part.map((i) => cell(i, "light")).join("")}</main><main class="dk">${part.map((i) => cell(i, "dark")).join("")}</main></body></html>`
    );
  }
  console.log(`wrote contact sheets to ${dir}`);
}
