// Writes color-preview.html: a sheet of color icons, inline so the hover motion runs.
//   node make-color.mjs out/color && node build-color-preview.mjs [count]
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { PALETTE } from "./make-color.mjs";

const COUNT = Number(process.argv[2] ?? 120);
const files = readdirSync("out/color").filter((f) => f.endsWith(".svg") && !f.startsWith("company-logos")).sort();
const step = Math.max(1, Math.floor(files.length / COUNT));
const picked = files.filter((_, i) => i % step === 0).slice(0, COUNT);
const allHex = Object.values(PALETTE).flat();

const tiles = picked
  .map((f) => {
    const svg = readFileSync(`out/color/${f}`, "utf8").replace(/width="24" height="24"/, 'width="32" height="32"');
    return `<figure class="tile" data-hue="${svg.match(/data-hue="(\w+)"/)[1]}">${svg}<figcaption>${f.replace(/^[^-]+--/, "").replace(".svg", "")}</figcaption></figure>`;
  })
  .join("\n");

writeFileSync(
  "color-preview.html",
  `<!doctype html><html><head><meta charset="utf-8"><title>fmicon · color · preview</title><style>
body{margin:0;background:#0e0e10;color:#ececec;font:13px system-ui,sans-serif}
header{position:sticky;top:0;z-index:1;display:flex;gap:6px;align-items:center;padding:12px 20px;background:#0e0e10}
button{font:inherit;color:inherit;background:#222;border:0;border-radius:8px;padding:6px 10px;cursor:pointer}
button[aria-pressed=true]{background:#3a3a40}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px;padding:12px 20px 40px}
.tile{margin:0;display:grid;justify-items:center;gap:8px;padding:22px 6px 12px;border-radius:14px;background:#1b1b1e}
.tile:hover{background:#242428}
figcaption{font-size:11px;color:#8a8a90;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fmi .fmi-body,.fmi .fmi-accent,.fmi .fmi-detail{transform-box:fill-box;transform-origin:50% 100%}
.fmi .fmi-detail{transform-origin:50% 50%}
.tile:hover .fmi-body,.tile:hover .fmi-accent{animation:fmi-squash 560ms cubic-bezier(.2,.8,.2,1)}
.tile:hover .fmi-detail{animation:fmi-pop 560ms 50ms cubic-bezier(.2,.8,.2,1) both}
@keyframes fmi-squash{22%{transform:scale(1.08,.88)}48%{transform:scale(.96,1.06)}72%{transform:scale(1.02,.98)}}
@keyframes fmi-pop{30%{transform:translateY(-1.6px) scale(1.14) rotate(-8deg)}62%{transform:translateY(.3px) scale(.97) rotate(3deg)}}
@media (prefers-reduced-motion:reduce){.tile:hover *{animation:none!important}}
</style></head><body>
<header><b>Color · ${picked.length} of ${files.length}</b>${["mixed", ...Object.keys(PALETTE)].map((h) => `<button data-h="${h}" aria-pressed="${h === "mixed"}">${h}</button>`).join("")}</header>
<main>${tiles}</main>
<script>
const PALETTE=${JSON.stringify(PALETTE)};
const originals=[...document.querySelectorAll('.tile svg')].map(s=>s.innerHTML);
document.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('[data-h]').forEach(x=>x.setAttribute('aria-pressed',x===b));
  document.querySelectorAll('.tile svg').forEach((s,i)=>{
    const own=PALETTE[s.dataset.hue], to=PALETTE[b.dataset.h];
    s.innerHTML = b.dataset.h==='mixed'||!to ? originals[i] : own.reduce((h,hex,k)=>h.split(hex).join(to[k]),originals[i]);
  });
});
</script></body></html>`,
);
console.log(`color-preview.html: ${picked.length} icons`);
