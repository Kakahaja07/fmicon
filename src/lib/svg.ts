import { cdnUrl, packageFor, pkgComponent, pkgData } from "./packages";

/** One icon from the free sample (public/free-icons/<style>.json). */
export type FreeIcon = {
  id: string;
  /** URL segment: /icons/<style>/<slug> */
  slug: string;
  name: string;
  category: string;
  /** Inner SVG markup on a 24×24 viewBox, using currentColor */
  body: string;
};

export type IconStyle = "linear" | "outline" | "bold" | "bulk" | "twotone" | "broken" | "glass" | "duotone";

export const styleLabels: Record<IconStyle, string> = {
  linear: "Linear",
  outline: "Outline",
  bold: "Bold",
  bulk: "Bulk",
  twotone: "Twotone",
  broken: "Broken",
  glass: "Glass",
  duotone: "Duotone",
};

/** Styles with their own built-in shading, which can't be recoloured. */
export const fixedColorStyles: ReadonlySet<IconStyle> = new Set(["glass"]);

/** "arrow-right-2" → "Arrow right 2" */
export function humanName(name: string) {
  const words = name.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** "arrow-right-2" → "ArrowRight2Icon" */
export function componentName(name: string) {
  return (
    name
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join("") + "Icon"
  );
}

/** Stroke weights offered for line styles. The library draws at 1.5. */
export const strokeWeights = [
  { value: "thin", label: "Thin", width: 1 },
  { value: "light", label: "Light", width: 1.25 },
  { value: "regular", label: "Regular", width: 1.5 },
  { value: "bold", label: "Bold", width: 2 },
] as const;
export type StrokeWeight = (typeof strokeWeights)[number]["value"];
export const strokeWidthOf = (w: StrokeWeight) => strokeWeights.find((s) => s.value === w)?.width ?? 1.5;

/** Styles drawn with strokes, where the weight can change. The rest are filled shapes. */
export const strokeStyles: ReadonlySet<IconStyle> = new Set(["linear", "twotone", "broken", "duotone"]);

/** Body with colour and stroke weight applied. */
function prepare(icon: FreeIcon, color?: string, stroke?: number) {
  let body = color ? icon.body.replace(/currentColor/g, color) : icon.body;
  if (stroke !== undefined && stroke !== 1.5) body = body.replace(/stroke-width="[\d.]+"/g, `stroke-width="${stroke}"`);
  return body;
}

/** A complete, standalone SVG file. Keeps currentColor unless a colour is given. */
export function toSvg(icon: FreeIcon, size: number, color?: string, stroke?: number) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${prepare(icon, color, stroke)}</svg>`;
}

/** A small React component, same shape as the ones in the app's code export. */
export function toReact(icon: FreeIcon, size: number, color = "currentColor", stroke?: number) {
  const jsxBody = prepare(icon, undefined, stroke)
    .replace(/\s([a-z]+(?:-[a-z]+)+)=/g, (_, attr: string) => " " + attr.replace(/-([a-z])/g, (__, c: string) => c.toUpperCase()) + "=")
    .replace(/\/>/g, " />")
    .replace(/></g, ">\n    <");
  return `export const ${componentName(icon.name)} = ({ size = ${size}, color = "${color}", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color }} {...props}>
    ${jsxBody}
  </svg>
);
`;
}

/** Indent markup one element per line, for reading (copy can keep the compact form). */
export function prettyMarkup(markup: string) {
  let depth = 0;
  return markup
    .replace(/>\s*</g, "><")
    .split(/(?=<)/)
    .map((part) => {
      const closing = part.startsWith("</");
      if (closing) depth = Math.max(0, depth - 1);
      const line = "  ".repeat(depth) + part.trim();
      if (!closing && !part.trimEnd().endsWith("/>") && !part.includes("</")) depth++;
      return line;
    })
    .join("\n");
}

/** Shorten long path data for display: d="M20.83 8.01L14.28…" */
export function shortenPaths(code: string, keep = 22) {
  return code.replace(new RegExp(`(\\sd=")([^"]{${keep}})[^"]{8,}(")`, "g"), "$1$2…$3");
}

/* ---------------------------- Framework snippets ---------------------------- */

export type Framework = "js" | "cdn" | "react" | "react-native" | "vue" | "svelte" | "angular" | "flutter";

/**
 * Code tabs on icon pages. Package tabs show install + import from the open-source packages;
 * Angular and Flutter have no package yet, so they show a ready-to-paste component.
 */
export const frameworks: Array<{ value: Framework; label: string; file: (name: string) => string; install?: string }> = [
  { value: "js", label: "JS", file: () => "main.js", install: `npm i ${packageFor.js}` },
  { value: "cdn", label: "CDN", file: () => "index.html" },
  { value: "react", label: "React", file: () => "App.jsx", install: `npm i ${packageFor.react}` },
  { value: "react-native", label: "React Native", file: () => "App.jsx", install: `npm i ${packageFor["react-native"]} react-native-svg` },
  { value: "vue", label: "Vue", file: () => "App.vue", install: `npm i ${packageFor.vue}` },
  { value: "svelte", label: "Svelte", file: () => "App.svelte", install: `npm i ${packageFor.svelte} ${packageFor.js}` },
  { value: "angular", label: "Angular", file: (n) => `${n}-icon.component.ts` },
  { value: "flutter", label: "Flutter", file: (n) => `${n.replace(/-/g, "_")}_icon.dart`, install: "flutter pub add flutter_svg" },
];

/** Package props that differ from the defaults, e.g. ` size={32} variant="bold"`. */
function pkgProps(style: IconStyle, size: number, color: string | undefined, stroke: number | undefined, vue = false) {
  const num = (k: string, v: number) => (vue ? ` :${k}="${v}"` : ` ${k}={${v}}`);
  let out = num("size", size);
  if (style !== "linear") out += ` variant="${style}"`;
  if (color) out += ` color="${color}"`;
  if (stroke !== undefined && stroke !== 1.5 && strokeStyles.has(style)) out += num(vue ? "stroke-width" : "strokeWidth", stroke);
  return out;
}

/** Options object for @fmicons/core, e.g. `{ size: 24, variant: "bold" }`. */
function coreOptions(style: IconStyle, size: number, color: string | undefined, stroke: number | undefined) {
  const parts = [`size: ${size}`];
  if (style !== "linear") parts.push(`variant: "${style}"`);
  if (color) parts.push(`color: "${color}"`);
  if (stroke !== undefined && stroke !== 1.5 && strokeStyles.has(style)) parts.push(`strokeWidth: ${stroke}`);
  return `{ ${parts.join(", ")} }`;
}

/** Ready-to-paste code for each framework. `color` undefined = inherit (currentColor). */
export function codeFor(fw: Framework, icon: FreeIcon, style: IconStyle, size: number, color: string | undefined, stroke?: number) {
  const name = componentName(icon.name);
  const c = color ?? "currentColor";
  const Pkg = pkgComponent(icon.slug);
  switch (fw) {
    case "js":
      return `import { ${pkgData(icon.slug)}, toSvg } from "${packageFor.js}";

document.querySelector("#icon").innerHTML = toSvg(${pkgData(icon.slug)}, ${coreOptions(style, size, color, stroke)});`;
    case "cdn":
      return `<img
  src="${cdnUrl(style, icon.slug)}"
  width="${size}"
  height="${size}"
  alt="${humanName(icon.name)}"
/>`;
    case "react":
      return `import { ${Pkg} } from "${packageFor.react}";

<${Pkg}${pkgProps(style, size, color, stroke)} />`;
    case "vue":
      return `<script setup>
import { ${Pkg} } from "${packageFor.vue}";
</script>

<template>
  <${Pkg}${pkgProps(style, size, color, stroke, true)} />
</template>`;
    case "svelte":
      return `<script>
  import { Icon } from "${packageFor.svelte}";
  import { ${pkgData(icon.slug)} } from "${packageFor.js}";
</script>

<Icon icon={${pkgData(icon.slug)}}${pkgProps(style, size, color, stroke)} />`;
    case "react-native":
      return `import { ${Pkg} } from "${packageFor["react-native"]}";

<${Pkg}${pkgProps(style, size, color, stroke)} />`;
    case "angular":
      return `import { Component, Input } from "@angular/core";

@Component({
  selector: "fm-${icon.name}-icon",
  standalone: true,
  template: \`
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" [style.color]="color">
${prettyMarkup(prepare(icon, undefined, stroke)).replace(/^/gm, "      ")}
    </svg>
  \`,
})
export class ${name}Component {
  @Input() size = ${size};
  @Input() color = "${c}";
}`;
    case "flutter":
      return `import 'package:flutter_svg/flutter_svg.dart';

// ${humanName(icon.name)} (${size} px)
final ${icon.name.replace(/-([a-z0-9])/g, (_, ch: string) => ch.toUpperCase())}Icon = SvgPicture.string(
  '''${toSvg(icon, size, color ?? "#000000", stroke)}''',
  width: ${size},
  height: ${size},
);`;
  }
}

/** SVG as a data URI, for CSS backgrounds or <img src>. */
export function toDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Rasterise an SVG (PNG or WebP) at 2× for sharp screens, then download it. */
export function downloadImage(filename: string, svg: string, size: number, type: "image/png" | "image/webp" = "image/png") {
  const scale = 2;
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size * scale;
    canvas.getContext("2d")?.drawImage(img, 0, 0, size * scale, size * scale);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, type);
  };
  img.src = toDataUri(svg);
}

export function downloadText(filename: string, text: string, type = "image/svg+xml") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
