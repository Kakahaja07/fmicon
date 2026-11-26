// Writes icons-src/preview.html: every original in all nine styles, beside a few FMUI icons for
// comparison. Run after scripts/build-originals.mjs:  node icons-src/build-preview.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { originals } from "./originals.mjs";

const FMUI = "G:/UI Deisgn/icon-library/figma7000";
const GEN = "explorations/glass-icons/out";
const STYLES = ["linear", "outline", "bold", "bulk", "twotone", "broken", "glass", "duotone", "color"];
const fileOf = (style, id, own) =>
  style === "glass" ? `${GEN}/dark/${id}.svg` : style === "duotone" ? `${GEN}/duotone/${id}.svg` : style === "color" ? `${GEN}/color/${id}.svg` : own ? `icons-src/out/${style}/${id}.svg` : `${FMUI}/${style}/${id}.svg`;
const inline = (file) => readFileSync(file, "utf8").replace(/width="24" height="24"/, 'width="32" height="32"');

const rows = [
  ...["essetional--home", "settings--setting-2", "support-like-question--heart"].map((id) => ({ id, own: false })),
  ...originals.map((o) => ({ id: o.id, own: true })),
];
const html = rows
  .map(
    ({ id, own }) =>
      `<tr${own ? "" : ' class="ref"'}><th>${id.split("--")[1]}${own ? "" : " <small>FMUI</small>"}</th>${STYLES.map((st) => `<td>${inline(fileOf(st, id, own))}</td>`).join("")}</tr>`,
  )
  .join("\n");

writeFileSync(
  "icons-src/preview.html",
  `<!doctype html><html><head><meta charset="utf-8"><title>fmicon originals</title><style>
body{margin:0;background:#141416;color:#ececec;font:13px system-ui,sans-serif;padding:20px}
table{border-collapse:separate;border-spacing:6px}
th{font-weight:500;text-align:left;color:#9a9aa0;padding-right:10px;white-space:nowrap}
thead th{text-align:center;font-size:11px}
td{background:#1f1f22;border-radius:12px;width:64px;height:60px;text-align:center}
tr.ref td{background:#26262a}
small{color:#5d8dff}
.fmi .fmi-body,.fmi .fmi-accent,.fmi .fmi-detail{transform-box:fill-box;transform-origin:50% 100%}
.fmi .fmi-detail{transform-origin:50% 50%}
td:hover .fmi-body,td:hover .fmi-accent{animation:sq 560ms cubic-bezier(.2,.8,.2,1)}
td:hover .fmi-detail{animation:pop 560ms 50ms cubic-bezier(.2,.8,.2,1) both}
@keyframes sq{22%{transform:scale(1.08,.88)}48%{transform:scale(.96,1.06)}72%{transform:scale(1.02,.98)}}
@keyframes pop{30%{transform:translateY(-1.6px) scale(1.14) rotate(-8deg)}62%{transform:translateY(.3px) scale(.97) rotate(3deg)}}
</style></head><body><table><thead><tr><th></th>${STYLES.map((s) => `<th>${s}</th>`).join("")}</tr></thead><tbody>
${html}
</tbody></table></body></html>`,
);
console.log(`icons-src/preview.html: ${rows.length} rows × ${STYLES.length} styles`);
