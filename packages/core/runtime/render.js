// Shared rendering helpers. Hand-written; build-packages.mjs copies this file
// into the dist folder of every package that needs it.

export const variants = [
  "linear",
  "outline",
  "bold",
  "bulk",
  "twotone",
  "broken",
  "glass",
  "glass-light",
  "duotone",
];

// Styles drawn with strokes. Only these honour `strokeWidth`.
const lineVariants = new Set(["linear", "twotone", "broken", "duotone"]);

export function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Inner SVG markup of one icon variant, with colour, stroke width and an
 * optional <title> applied.
 */
export function iconBody(icon, { variant = "linear", color, strokeWidth, title } = {}) {
  let body = icon.variants[variant];
  if (body === undefined) {
    throw new Error(`[fmicons] Unknown variant "${variant}" for icon "${icon.name}"`);
  }
  if (strokeWidth != null && lineVariants.has(variant)) {
    body = body.replace(/stroke-width="1\.5"/g, `stroke-width="${escapeAttr(strokeWidth)}"`);
  }
  if (color && color !== "currentColor") {
    body = body.replace(/currentColor/g, escapeAttr(color));
  }
  if (title) {
    body = `<title>${escapeAttr(title)}</title>${body}`;
  }
  return body;
}

/** A complete, standalone <svg> string. */
export function toSvg(icon, { size = 24, variant = "linear", color, strokeWidth, title, attrs } = {}) {
  const all = {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    ...(title ? { role: "img" } : { "aria-hidden": "true" }),
    ...attrs,
  };
  let tag = "<svg";
  for (const [key, value] of Object.entries(all)) {
    if (value == null || value === false) continue;
    tag += ` ${key}="${escapeAttr(value)}"`;
  }
  return `${tag}>${iconBody(icon, { variant, color, strokeWidth, title })}</svg>`;
}
