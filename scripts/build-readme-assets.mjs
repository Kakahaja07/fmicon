// Logo banner for the GitHub README: the dotted F on an app-icon tile and "FM Icons" in Allo, on a transparent ground,
// one for GitHub's dark theme and one for light. Renders with headless Edge or Chrome.
//   npm run readme
// Output: .github/assets/wordmark-{dark,light}.png and showcase-{dark,light}.png

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const OUT = ".github/assets";
const W = 470;
const H = 120;

const browser = [
  process.env.CHROME_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean).find((p) => existsSync(p));
if (!browser) {
  console.error("No Chrome or Edge found. Set CHROME_PATH.");
  process.exit(1);
}

const font = pathToFileURL(resolve("node_modules/allo-font/fonts/webfonts/AlloVariableFriendly.woff2")).href;
const mark = readFileSync("public/favicon.svg", "utf8").replace("<svg ", '<svg width="58" height="61" ');

const page = (ink, soft, tile, edge) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Allo; src: url("${font}") format("woff2"); font-weight: 100 900; }
html, body { margin: 0; width: ${W}px; height: ${H}px; background: transparent; overflow: hidden; }
body { display: flex; align-items: center; justify-content: center; gap: 24px; font-family: Allo, sans-serif; }
.tile { width: 96px; height: 96px; border-radius: 24px; display: grid; place-items: center; background: ${tile}; box-shadow: inset 0 0 0 1.5px ${edge}; }
.tile svg { margin-left: 4px; }
.name { display: flex; align-items: baseline; gap: 14px; font-size: 68px; letter-spacing: -0.04em; line-height: 1; }
b { font-weight: 760; color: ${ink}; }
span { font-weight: 440; color: ${soft}; }
</style></head><body><div class="tile">${mark}</div><div class="name"><b>FM</b><span>Icons</span></div></body></html>`;

// Showcase: the same ten icons in four styles, one row each, labelled on the left
const load = (style) => new Map(JSON.parse(readFileSync(`src/content/free-icons/${style}.json`, "utf8")).icons.map((i) => [i.slug, i.body]));
const SHOW = ["home", "search-normal", "notification", "heart", "star", "message", "calendar", "camera", "wallet", "setting"];
const SW = 900;
const SH = 330;

const showcase = (theme) => {
  const ink = theme === "dark" ? "#f5f5f7" : "#111214";
  const soft = theme === "dark" ? "#8e8e93" : "#6b6b75";
  const cell = theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const rows = [
    ["Linear", "linear", ink],
    ["Bold", "bold", ink],
    ["Duotone", "duotone", "#4d8fff"],
    ["Glass", theme === "dark" ? "glass" : "glass-light", ink],
  ];
  const body = rows
    .map(([label, style, color]) => {
      const icons = load(style);
      const cells = SHOW.map((slug) => `<i><svg viewBox="0 0 24 24" width="30" height="30" fill="none" style="color:${color}">${icons.get(slug)}</svg></i>`).join("");
      return `<div class="row"><span>${label}</span>${cells}</div>`;
    })
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Allo; src: url("${font}") format("woff2"); font-weight: 100 900; }
html, body { margin: 0; width: ${SW}px; height: ${SH}px; background: transparent; overflow: hidden; }
body { display: grid; align-content: center; gap: 10px; padding: 0 20px; box-sizing: border-box; font-family: Allo, sans-serif; }
.row { display: grid; grid-template-columns: 96px repeat(10, 1fr); align-items: center; gap: 8px; }
span { font-size: 17px; font-weight: 520; color: ${soft}; letter-spacing: -0.01em; }
i { display: grid; place-items: center; height: 64px; border-radius: 14px; background: ${cell}; }
svg [stroke-width] { stroke-width: 1.6; }
</style></head><body>${body}</body></html>`;
};

const shots = [
  ["wordmark-dark", page("#f5f5f7", "#a1a1aa", "linear-gradient(160deg, #26262b, #161619)", "rgba(255,255,255,0.09)"), W, H, 3],
  ["wordmark-light", page("#111214", "#5c5c66", "linear-gradient(160deg, #ffffff, #f1f1f4)", "rgba(0,0,0,0.08)"), W, H, 3],
  ["showcase-dark", showcase("dark"), SW, SH],
  ["showcase-light", showcase("light"), SW, SH],
];

mkdirSync(OUT, { recursive: true });
const work = mkdtempSync(join(tmpdir(), "fmicons-readme-"));
try {
  for (const [name, htmlText, width, height, scale = 2] of shots) {
    const html = join(work, `${name}.html`);
    writeFileSync(html, htmlText);
    execFileSync(browser, [
      "--headless=new", "--disable-gpu", "--hide-scrollbars", `--force-device-scale-factor=${scale}`,
      "--default-background-color=00000000", "--virtual-time-budget=2000",
      `--window-size=${width},${height}`, `--screenshot=${resolve(OUT, `${name}.png`)}`, pathToFileURL(html).href,
    ], { stdio: "ignore" });
    console.log(`✓ ${OUT}/${name}.png`);
  }
  // The website shows the same showcase (it is dark-only, so the dark one)
  mkdirSync("public/images", { recursive: true });
  copyFileSync(resolve(OUT, "showcase-dark.png"), "public/images/showcase.png");
  console.log("✓ public/images/showcase.png");
} finally {
  rmSync(work, { recursive: true, force: true });
}
