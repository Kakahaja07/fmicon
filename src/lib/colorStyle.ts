/**
 * The "color" style's six hues. Each icon file is drawn in one of them (picked from its name);
 * the hue picker swaps every icon to a single hue by replacing the hex values.
 * Keep in step with PALETTE in explorations/glass-icons/make-color.mjs.
 */
export const colorPalette = {
  blue: ["#78b4ff", "#3d8bfd", "#2563d9"],
  violet: ["#b896ff", "#8b5cf6", "#6a3fd6"],
  pink: ["#ff8cc0", "#f4479a", "#cf2c78"],
  orange: ["#ffb15e", "#ff8a1f", "#dc6a0b"],
  green: ["#6fdc92", "#2fbf5f", "#1f9a48"],
  teal: ["#6fe0d8", "#18b8ad", "#0f948b"],
} as const;

export type ColorHue = keyof typeof colorPalette;
export const colorHues = Object.keys(colorPalette) as ColorHue[];
export const isColorHue = (v: unknown): v is ColorHue => typeof v === "string" && v in colorPalette;

/** Swatches for the picker: "Mixed" keeps each icon's own hue. */
export const hueSwatches = [
  { value: "mixed", label: "Mixed", paint: `conic-gradient(${colorHues.map((h) => colorPalette[h][1]).join(", ")}, ${colorPalette.blue[1]})` },
  ...colorHues.map((h) => ({ value: h, label: h[0].toUpperCase() + h.slice(1), paint: `linear-gradient(160deg, ${colorPalette[h][0]}, ${colorPalette[h][2]})` })),
];

/** An icon body redrawn in one hue. Its gradient ids get the hue too, so two tones of one icon can share a page. */
export function recolor(body: string, hue: ColorHue) {
  const own = colorHues.find((h) => body.includes(colorPalette[h][0]));
  if (!own || own === hue) return body;
  let out = body;
  colorPalette[own].forEach((hex, i) => (out = out.split(hex).join(colorPalette[hue][i])));
  return out.replace(/(id="|#)c-/g, `$1c${hue}-`);
}
