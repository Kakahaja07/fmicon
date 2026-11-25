// Social share cards (Open Graph / X / LinkedIn previews) built from the real icons.
// Renders HTML templates to PNG with headless Microsoft Edge or Chrome, no extra dependencies.
//   npm run social
// Output: public/og/<name>.png (1200×630)

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const OUT = "public/og";
const W = 1200;
const H = 630;

const BROWSERS = [
  process.env.CHROME_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const browser = BROWSERS.find((p) => existsSync(p));
if (!browser) {
  console.error("No Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser.");
  process.exit(1);
}

const load = (style) => new Map(JSON.parse(readFileSync(`src/content/free-icons/${style}.json`, "utf8")).icons.map((i) => [i.slug, i.body]));
const linear = load("linear");
const byStyle = Object.fromEntries(["linear", "outline", "bold", "bulk", "twotone", "broken", "glass", "duotone"].map((s) => [s, load(s)]));
const total = linear.size;

const font = (file) => pathToFileURL(resolve("src/assets/fonts", file)).href;
const allo = pathToFileURL(resolve("node_modules/allo-font/fonts/webfonts/AlloVariableFriendly.woff2")).href;
const glassBodies = byStyle.glass;
const duoBodies = byStyle.duotone;
// Film grain over the whole card (SVG noise), so the dark surfaces don't look flat
const GRAIN = "data:image/svg+xml;utf8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
);
const mark = readFileSync("public/favicon.svg", "utf8").replace("<svg ", '<svg width="26" height="27" ');
// The app icon, large, top-left, with the three yellow pencil strokes from the header logo's hover
const bigMark = readFileSync("public/favicon.svg", "utf8").replace("<svg ", '<svg width="72" height="75" ');
const strokes = `<svg class="strokes" viewBox="0 0 14 14" width="34" height="34" fill="none" stroke="#ffd60a" stroke-width="1.6" stroke-linecap="round"><path d="M2.6 8.6Q3.1 5.4 3.4 1.8"/><path d="M5.4 10.2Q8.2 7.8 11.2 4.6"/><path d="M6.6 13Q9.8 12.6 12.8 11.6"/></svg>`;

// Colours from the site palette, one per tile
const COLORS = ["#4d8dff", "#34c759", "#a78bfa", "#ffcc00", "#5ac8fa", "#ff9f0a", "#ff453a", "#7c7cff", "#30d1c4", "#a3e635", "#f5a524", "#a1a1aa"];

const svg = (body, color) =>
  `<svg viewBox="0 0 24 24" width="60" height="60" fill="none" style="color:${color}">${body}</svg>`;

// Faint wall of icons behind each card, like the hero on the landing page
const WALL = [...linear.values()].filter((_, i) => i % 7 === 0).slice(0, 60);
const wall = WALL.map((b) => `<svg viewBox="0 0 24 24" width="30" height="30" fill="none">${b}</svg>`).join("");

function page({ lines, prompt, tiles, highlight = 5 }) {
  const cells = tiles
    .map((t, i) => `<div class="cell${i === highlight ? " hot" : ""}">${t.html}${t.label ? `<span>${t.label}</span>` : ""}</div>`)
    .join("");
  const heading = lines.map((l, i) => `<span class="${i === lines.length - 1 ? "on" : ""}">${l}</span>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Allo; src: url("${allo}") format("woff2"); font-weight: 100 900; }
@font-face { font-family: GoeistMono; src: url("${font("GoeistMono-Variable.woff2")}") format("woff2"); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
html, body { width: ${W}px; height: ${H}px; background: #070708; overflow: hidden; }
body { padding: 18px; font-family: Allo, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
.grain { position: absolute; inset: 0; z-index: 5; pointer-events: none; background: url("${GRAIN}"); opacity: .09; mix-blend-mode: overlay; border-radius: 30px; }
.card { position: relative; isolation: isolate; overflow: hidden; height: 100%; border-radius: 30px; border: 1px solid #2a2a2e;
  background:
    radial-gradient(42% 60% at 76% 46%, rgba(18,101,236,.38), transparent 70%),
    radial-gradient(30% 45% at 92% 8%, rgba(155,61,255,.22), transparent 70%),
    radial-gradient(35% 50% at 2% 100%, rgba(255,61,139,.14), transparent 70%),
    #0b0b0d;
  display: grid; grid-template-columns: 1fr 560px; align-items: center; padding: 0 44px 0 64px; gap: 40px; }
/* Fine grid, fading out from the centre */
.card::before { content: ""; position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px) 0 0 / 44px 44px,
              linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px) 0 0 / 44px 44px;
  -webkit-mask-image: radial-gradient(80% 85% at 60% 50%, #000 30%, transparent 85%); }
/* Faint icons along the left, behind the headline */
.logo { position: absolute; left: 64px; top: 52px; filter: drop-shadow(0 14px 28px rgba(0,0,0,.55)); }
.logo .strokes { position: absolute; right: -26px; top: -20px; }
.wall { position: absolute; z-index: -1; inset: -10px auto -10px -10px; width: 640px; display: grid;
  grid-template-columns: repeat(10, 30px); gap: 34px; padding: 22px; color: #fff; opacity: .05;
  -webkit-mask-image: linear-gradient(90deg, #000 20%, transparent 95%); }
.wall svg [stroke-width] { stroke-width: 1.5; }
h1 { display: grid; font-size: 76px; line-height: 1.02; letter-spacing: -0.04em; font-weight: 700; color: #6c6c72; }
h1 .on { color: #fafafa; }
.chip { position: absolute; left: 40px; bottom: 36px; display: flex; align-items: center; gap: 10px; padding: 9px 16px 9px 12px;
  border-radius: 12px; background: #000; border: 1px solid #222; font-size: 22px; font-weight: 560; color: #f2f2f2; letter-spacing: -0.01em; }
.panel { border-radius: 28px; background: rgba(21,21,24,.92); border: 1px solid #2c2c31; padding: 22px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.06), 0 40px 90px rgba(0,0,0,.55), 0 0 0 8px rgba(255,255,255,.02); }
.prompt { display: flex; align-items: center; gap: 10px; height: 52px; padding: 0 18px; border-radius: 14px; background: #0c0c0d;
  font-family: GoeistMono, monospace; font-size: 19px; color: #8e8e93; white-space: nowrap; overflow: hidden; }
.prompt b { color: #fafafa; font-weight: 600; }
.prompt i { display: inline-block; width: 11px; height: 24px; background: #e5e5e5; margin-left: 2px; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 18px; }
.cell { height: 108px; display: grid; place-items: center; align-content: center; gap: 6px; border-radius: 16px; }
.cell.hot { background: #222226; box-shadow: inset 0 0 0 1px #34343a; }
.cell svg [stroke-width] { stroke-width: 1.7; }
.cell span { font-size: 15px; color: #8e8e93; letter-spacing: -0.01em; }
</style></head><body><div class="card">
<div class="wall" aria-hidden="true">${wall}</div>
<div class="logo">${bigMark}${strokes}</div>
<h1>${heading}</h1>
<div class="panel"><div class="prompt"><span>${prompt}</span><i></i></div><div class="grid">${cells}</div></div>
<div class="chip">${mark}fmicon.dev</div>
<div class="grain"></div>
</div></body></html>`;
}

const icon = (slug, i) => ({ html: svg(linear.get(slug), COLORS[i % COLORS.length]) });
const glass = (slug) => ({ html: `<svg viewBox="0 0 24 24" width="62" height="62" fill="none">${glassBodies.get(slug)}</svg>` });
const duo = (slug, i) => ({ html: svg(duoBodies.get(slug), COLORS[i % COLORS.length]) });
// Alternate glass and duotone so every card shows both looks
const mix = (slugs) => slugs.map((slug, i) => (i % 2 === 0 ? glass(slug) : duo(slug, i)));

const cards = {
  home: {
    lines: ["Every icon", "you need,", "free forever"],
    prompt: `&gt; <b>npm i</b> fmicon-react`,
    tiles: mix(["wallet", "home", "heart", "chart", "camera", "notification", "folder", "message", "star", "calendar", "lock", "setting-2"]),
  },
  docs: {
    lines: ["Drop icons", "into any", "framework"],
    prompt: `<b>import</b> { Home } <b>from</b> "fmicon-react"`,
    tiles: mix(["code", "command", "monitor", "mobile", "cloud", "folder", "document", "link", "send", "search-normal", "lock", "global"]),
    highlight: 0,
  },
  styles: {
    lines: ["One icon,", "every", "style"],
    prompt: `&lt;Heart <b>variant</b>="glass" /&gt;`,
    // The same heart in every style; glass keeps its own colours
    tiles: Object.entries(byStyle).map(([style, map], i) => ({
      html: `<svg viewBox="0 0 24 24" width="52" height="52" fill="none" style="color:${COLORS[i]}">${map.get("heart")}</svg>`,
      label: style,
    })),
    highlight: 6,
  },
};

// Blog posts: the same card, used as the post's thumbnail and share image (public/og/blog-<slug>.png).
// Keep the slugs in step with src/content/blog/index.ts.
Object.assign(cards, {
  "blog-svg-vs-png": {
    lines: ["SVG vs PNG", "for icons:", "which wins?"],
    prompt: `&lt;img src="<b>home.svg</b>" /&gt;`,
    tiles: mix(["image", "gallery", "document", "home", "monitor", "mobile", "colorfilter", "brush", "folder", "cloud", "export", "magicpen"]),
  },
  "blog-react-icons": {
    lines: ["React icons,", "the easy", "way"],
    prompt: `<b>import</b> { Lock } <b>from</b> "fmicon-react"`,
    tiles: mix(["code", "command", "layer", "lock", "monitor", "mobile", "setting-2", "search-normal", "user", "notification", "heart", "star"]),
    highlight: 3,
  },
  "blog-free-svg-icons": {
    lines: ["Free SVG", "icons for", "your website"],
    prompt: `cdn.fmicon.dev/<b>svg</b>/linear/home.svg`,
    tiles: mix(["home", "star", "heart", "global", "shop", "calendar", "message", "location", "camera", "wallet", "gift", "people"]),
    highlight: 0,
  },
  "blog-accessible-icons": {
    lines: ["Icons that", "everyone", "can use"],
    prompt: `&lt;button <b>aria-label</b>="Close"&gt;`,
    tiles: mix(["eye", "user", "tick-circle", "close-circle", "info-circle", "warning-2", "notification", "keyboard", "microphone", "volume-high", "eye-slash", "shield-tick"]),
    highlight: 3,
  },
});

mkdirSync(OUT, { recursive: true });
const work = mkdtempSync(join(tmpdir(), "fmicons-og-"));
try {
  const only = process.argv[2];
  for (const [name, card] of Object.entries(cards)) {
    if (only && !name.startsWith(only)) continue;
    const html = join(work, `${name}.html`);
    writeFileSync(html, page(card));
    const png = resolve(OUT, `${name}.png`);
    execFileSync(browser, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--default-background-color=00000000",
      "--virtual-time-budget=2000",
      `--window-size=${W},${H}`,
      `--screenshot=${png}`,
      pathToFileURL(html).href,
    ], { stdio: "ignore" });
    console.log(`✓ ${OUT}/${name}.png`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
