// Logo banner for the GitHub README: the dotted F and "FM Icons" in Allo, on a transparent ground,
// one for GitHub's dark theme and one for light. Renders with headless Edge or Chrome.
//   node scripts/build-readme-assets.mjs
// Output: .github/assets/wordmark-dark.png, wordmark-light.png

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const OUT = ".github/assets";
const W = 900;
const H = 240;

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
const mark = readFileSync("public/favicon.svg", "utf8").replace("<svg ", '<svg width="92" height="97" ');

const page = (ink, soft) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Allo; src: url("${font}") format("woff2"); font-weight: 100 900; }
html, body { margin: 0; width: ${W}px; height: ${H}px; background: transparent; overflow: hidden; }
body { display: flex; align-items: center; justify-content: center; gap: 22px; font-family: Allo, sans-serif; }
.name { display: flex; align-items: baseline; gap: 18px; font-size: 84px; letter-spacing: -0.04em; line-height: 1; }
b { font-weight: 760; color: ${ink}; }
span { font-weight: 440; color: ${soft}; }
</style></head><body>${mark}<div class="name"><b>FM</b><span>Icons</span></div></body></html>`;

mkdirSync(OUT, { recursive: true });
const work = mkdtempSync(join(tmpdir(), "fmicons-readme-"));
try {
  for (const [name, ink, soft] of [["wordmark-dark", "#f5f5f7", "#a1a1aa"], ["wordmark-light", "#111214", "#5c5c66"]]) {
    const html = join(work, `${name}.html`);
    writeFileSync(html, page(ink, soft));
    execFileSync(browser, [
      "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2",
      "--default-background-color=00000000", "--virtual-time-budget=2000",
      `--window-size=${W},${H}`, `--screenshot=${resolve(OUT, `${name}.png`)}`, pathToFileURL(html).href,
    ], { stdio: "ignore" });
    console.log(`✓ ${OUT}/${name}.png`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
