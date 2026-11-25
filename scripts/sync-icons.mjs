// Regenerates src/components/icons/Icons.tsx from the FMUI 7000 icon library.
// Add a name to the list below, then run:  npm run icons
// Names: "home" (linear), "bold/home", "twotone/heart", or "category--name" when a name is ambiguous.
// Find names with: node "G:/UI Deisgn/icon-library/_tools/use-icons.mjs" --find "wallet"

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";

const TOOL = process.env.FMUI_TOOL ?? "G:/UI Deisgn/icon-library/_tools/use-icons.mjs";
const OUT = "src/components/icons";

const icons = [...new Set([
  // UI
  "arrow-right", "import", "search-normal", "tick-circle", "add", "minus", "copy", "code", "command",
  "moon", "sun", "monitor", "folder", "shield-tick", "refresh-circle", "close-circle", "document-download", "programing--document-code", "bold/tick-circle",
  // Stickers
  "emoji-happy", "crown", "flash", "drop", "cloud", "flag", "heart", "magic-star", "camera",
  "essetional--lamp", "ghost", "cake", "location", "gift", "star", "coffee", "music", "game", "pet",
  // App window grid
  "home", "wallet", "setting", "calendar", "message", "lock", "user", "bag", "bookmark", "microphone",
  "gallery", "map", "notification", "trash", "edit", "link", "arrow--send", "global", "business--chart",
  "cup", "diamonds", "essetional--triangle", "element-4", "sticker", "brush", "shapes",
  "money--card", "money--money", "wallet-add",
  // Active / selected + art
  "bold/star", "bold/element-3", "bold/element-4", "bold/diamonds", "bold/essetional--triangle",
  "bold/message", "bold/sun", "bold/moon", "bold/monitor", "bold/folder", "bold/heart", "bold/magic-star",
  "bold/camera", "bold/music", "bold/home", "bold/flash", "bold/brush", "bold/code",
  // Feature tiles
  "twotone/search-normal", "twotone/magicpen", "twotone/heart", "twotone/computers-devices-electronics--mouse",
  "twotone/code", "twotone/cloud-change", "twotone/magic-star", "twotone/brush",
  // Icon page article
  "info-circle", "message-question", "task-square", "layer", "textalign-left", "lamp-charge",
  // Docs
  "school-learning--book", "arrow-left",
])];

for (const f of readdirSync(OUT)) rmSync(join(OUT, f));
execFileSync(process.execPath, [TOOL, OUT, ...icons, "--react"], { stdio: "inherit" });
for (const f of readdirSync(OUT)) if (f.endsWith(".svg")) rmSync(join(OUT, f));

let src = readFileSync(join(OUT, "Icons.jsx"), "utf8");
src = src.replace(
  /\(\{ size = 24, color = "currentColor", \.\.\.props \}\) =>/g,
  '({ size = 24, color = "currentColor", ...props }: IconProps) =>',
);
src = src.replace(
  /^(\/\/.*\n)/,
  `$1\nimport type { JSX, SVGProps } from "react";\n\nexport type IconProps = Omit<SVGProps<SVGSVGElement>, "color"> & { size?: number | string; color?: string };\nexport type IconComponent = (props: IconProps) => JSX.Element;\n`,
);
writeFileSync(join(OUT, "Icons.tsx"), src);
rmSync(join(OUT, "Icons.jsx"));
console.log("Icons.tsx updated");
