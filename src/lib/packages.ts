import { openSource } from "~/content/site";
import type { IconStyle } from "./svg";

/* How the open-source packages name things (must match scripts/build-packages.mjs). */

const words = (slug: string) => slug.split(/[^a-zA-Z0-9]+/).filter(Boolean);

/** "arrow-circle-right" → "ArrowCircleRight"; names starting with a digit get an "Icon" prefix. */
export function pkgComponent(slug: string) {
  const name = words(slug).map((w) => w[0].toUpperCase() + w.slice(1)).join("");
  return /^\d/.test(name) ? `Icon${name}` : name;
}

const RESERVED = new Set(
  ("break case catch class const continue debugger default delete do else enum export extends false finally for " +
    "function if import in instanceof new null return super switch this throw true try typeof var void while with " +
    "yield let static implements interface package private protected public await arguments eval undefined").split(" "),
);

/** "arrow-circle-right" → "arrowCircleRight": the icon's data export in @fmicons/core. Reserved words get "Icon" ("exportIcon"). */
export function pkgData(slug: string) {
  const pascal = pkgComponent(slug);
  const name = pascal[0].toLowerCase() + pascal.slice(1);
  return RESERVED.has(name) ? `${name}Icon` : name;
}

/** Public URL of one SVG file, served by jsDelivr straight from the GitHub repo. */
export const cdnUrl = (style: IconStyle | "glass-light", slug: string) => `${openSource.cdn}/${style}/${slug}.svg`;

export const packageFor = {
  js: "@fmicons/core",
  react: "@fmicons/react",
  "react-native": "@fmicons/react-native",
  vue: "@fmicons/vue",
  svelte: "@fmicons/svelte",
} as const;
