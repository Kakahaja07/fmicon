// The fmicon originals engine: draw an icon once, get the six base styles.
//
// An icon is a list of parts on the 24 px grid. Each part is a shape and a role:
//   body    the main closed shape(s)    linear: stroked · bold: filled · bulk: 40% fill
//   detail  marks on or around a body   linear: stroked · bold: cut out of the body it sits in
//                                        (drawn solid when it sits outside) · bulk: solid
//   faint   secondary lines             linear: stroked · bold: solid · bulk/twotone: 40%
// Strokes are 1.5 with round caps and joins, like the FMUI set the rest of fmicon comes from.
//
// Bulk is drawn with fills only (strokes become capsule outlines), because the glass, color and
// duotone generators read the bulk file's filled shapes.

const W = 1.5; // stroke width
const R = W / 2;
const f = (n) => +n.toFixed(2);
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

/* ------------------------------ shapes ------------------------------ */
// Every shape knows its path (for strokes and fills), whether it is closed, a polyline sample of
// itself (for capsule outlines) and its bounding box.

const rotate = ([x, y], [cx, cy], deg) => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
};

/** Rounded rectangle, optionally rotated about its centre. */
export function rect(x, y, w, h, r = 0, rot = 0) {
  r = Math.min(r, w / 2, h / 2);
  const c = [x + w / 2, y + h / 2];
  const P = (p) => rotate(p, c, rot);
  // corners clockwise from top-left, each as [start, end] of its arc
  const pts = [
    [[x + r, y], [x + w - r, y]],
    [[x + w, y + r], [x + w, y + h - r]],
    [[x + w - r, y + h], [x + r, y + h]],
    [[x, y + h - r], [x, y + r]],
  ];
  let d = `M${pt(P(pts[0][0]))}`;
  pts.forEach(([, end], i) => {
    d += `L${pt(P(end))}`;
    const next = pts[(i + 1) % 4][0];
    if (r > 0) d += `A${f(r)} ${f(r)} 0 0 1 ${pt(P(next))}`;
  });
  d += "Z";
  const sample = [];
  const steps = 6;
  const corners = [[x + w - r, y + r, -90], [x + w - r, y + h - r, 0], [x + r, y + h - r, 90], [x + r, y + r, 180]];
  for (const [cx, cy, a0] of corners)
    for (let i = 0; i <= steps; i++) {
      const a = ((a0 + (90 * i) / steps) * Math.PI) / 180;
      sample.push(P([cx + r * Math.cos(a), cy + r * Math.sin(a)]));
    }
  return shape(d, true, sample, { ring: { kind: "rect", x, y, w, h, r, rot } });
}

/** Ellipse (or circle when ry is left out), optionally rotated. */
export function ellipse(cx, cy, rx, ry = rx, rot = 0) {
  const a = rotate([cx - rx, cy], [cx, cy], rot), b = rotate([cx + rx, cy], [cx, cy], rot);
  const d = `M${pt(a)}A${f(rx)} ${f(ry)} ${f(rot)} 1 1 ${pt(b)}A${f(rx)} ${f(ry)} ${f(rot)} 1 1 ${pt(a)}Z`;
  const sample = [];
  for (let i = 0; i < 48; i++) {
    const t = (i / 48) * 2 * Math.PI;
    sample.push(rotate([cx + rx * Math.cos(t), cy + ry * Math.sin(t)], [cx, cy], rot));
  }
  return shape(d, true, sample, { ring: rx === ry && !rot ? { kind: "circle", cx, cy, r: rx } : null });
}
export const circle = (cx, cy, r) => ellipse(cx, cy, r);

/** A small filled dot: solid in every style (cut out of a body in bold). */
export function dot(cx, cy, r = 1) {
  const s = ellipse(cx, cy, r);
  s.dot = true;
  return s;
}

/** Straight segments through the points; closed when `closed` is true. */
export function poly(points, closed = false) {
  const d = `M${points.map(pt).join("L")}${closed ? "Z" : ""}`;
  return shape(d, closed, closed ? [...points, points[0]] : points);
}
export const line = (x1, y1, x2, y2) => poly([[x1, y1], [x2, y2]]);

/** Cubic Béziers: start point, then [c1, c2, end] triples. */
export function curve(start, ...segs) {
  let d = `M${pt(start)}`;
  const sample = [start];
  let p0 = start;
  for (const [c1, c2, p3] of segs) {
    d += `C${pt(c1)} ${pt(c2)} ${pt(p3)}`;
    for (let i = 1; i <= 16; i++) {
      const t = i / 16, u = 1 - t;
      sample.push([
        u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p3[1],
      ]);
    }
    p0 = p3;
  }
  return shape(d, false, sample);
}

/** Circular arc from angle a0 to a1 (degrees, 0 = right, clockwise on screen). */
export function arc(cx, cy, r, a0, a1) {
  const P = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const d = `M${pt(P(a0))}A${f(r)} ${f(r)} 0 ${large} ${a1 > a0 ? 1 : 0} ${pt(P(a1))}`;
  const sample = [];
  for (let i = 0; i <= 24; i++) sample.push(P(a0 + ((a1 - a0) * i) / 24));
  return shape(d, false, sample);
}

/** Any closed path (for bodies). `box` is [x0, y0, x1, y1]. */
export function path(d, box) {
  const [x0, y0, x1, y1] = box;
  return shape(d, true, [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]);
}

function shape(d, closed, sample, extra = {}) {
  const xs = sample.map((p) => p[0]), ys = sample.map((p) => p[1]);
  return { d, closed, sample, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], ...extra };
}

/* --------------------------- fill geometry --------------------------- */

/** A stroke of width W along a polyline, as filled capsules (all wound the same way). */
function capsules(points) {
  let d = "";
  for (let i = 0; i + 1 < points.length; i++) {
    const [ax, ay] = points[i], [bx, by] = points[i + 1];
    const len = Math.hypot(bx - ax, by - ay);
    if (len < 0.01) continue;
    const nx = (-(by - ay) / len) * R, ny = ((bx - ax) / len) * R;
    d +=
      `M${pt([ax + nx, ay + ny])}L${pt([bx + nx, by + ny])}` +
      `A${R} ${R} 0 0 0 ${pt([bx - nx, by - ny])}L${pt([ax - nx, ay - ny])}` +
      `A${R} ${R} 0 0 0 ${pt([ax + nx, ay + ny])}Z`;
  }
  return d;
}

/** A stroked rounded rect or circle as an even-odd ring. Other shapes fall back to capsules. */
function ring(s) {
  const g = s.ring;
  if (g?.kind === "circle") return { d: circle(g.cx, g.cy, g.r + R).d + circle(g.cx, g.cy, g.r - R).d, evenodd: true };
  if (g?.kind === "rect" && !g.rot)
    return { d: rect(g.x - R, g.y - R, g.w + W, g.h + W, g.r + R).d + rect(g.x + R, g.y + R, g.w - W, g.h - W, Math.max(g.r - R, 0)).d, evenodd: true };
  return { d: capsules(s.sample) };
}

/* ------------------------------ styles ------------------------------ */

const strokeAttrs = `stroke="currentColor" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round"`;
const stroked = (s, extra = "") => (s.dot ? `<path d="${s.d}" fill="currentColor"${extra}/>` : `<path d="${s.d}" ${strokeAttrs}${extra}/>`);
const svg = (inner) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n${inner}\n</svg>\n`;
const inside = (a, b) => a[0] >= b[0] - 0.5 && a[1] >= b[1] - 0.5 && a[2] <= b[2] + 0.5 && a[3] <= b[3] + 0.5;

// Broken: one gap in each long body stroke, at a spot that varies from shape to shape.
const GAPS = [12, 38, 64, 86];
const brokenAttrs = (s, i) =>
  s.closed && !s.dot && perimeter(s.sample) > 34 ? ` pathLength="100" stroke-dasharray="70 8 22" stroke-dashoffset="${GAPS[i % GAPS.length]}"` : "";
const perimeter = (pts) => pts.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

export function render(icon, id) {
  const parts = icon.parts;
  const by = (role) => parts.filter((p) => p.role === role);
  const bodies = by("body"), details = by("detail"), faints = by("faint");
  const insideBody = (p) => bodies.some((b) => inside(p.shape.box, b.shape.box));

  const linear = svg(parts.map((p) => stroked(p.shape)).join("\n"));

  // Twotone fades the details; an icon with no body (all lines, like DNA) keeps them and fades only the faint lines.
  const faded = bodies.length ? [...details, ...faints] : faints;
  const twotone = svg(
    [...parts.filter((p) => !faded.includes(p)).map((p) => stroked(p.shape)), `<g opacity=".4">${faded.map((p) => stroked(p.shape)).join("")}</g>`].join("\n"),
  );

  const broken = svg(parts.map((p, i) => stroked(p.shape, p.role === "body" ? brokenAttrs(p.shape, i) : "")).join("\n"));

  // Bold: bodies filled, inner details cut out with a mask, outer details solid.
  const cut = details.filter(insideBody);
  const mask = cut.length
    ? `<mask id="${id}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/>` +
      cut.map((p) => (p.shape.dot || (p.shape.closed && !p.ring) ? `<path d="${p.shape.d}" fill="#000"/>` : `<path d="${p.shape.d}" stroke="#000" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round"/>`)).join("") +
      `</mask>`
    : "";
  const bold = svg(
    [
      mask,
      `<g${cut.length ? ` mask="url(#${id}-m)"` : ""}>${bodies.map((p) => `<path d="${p.shape.d}" fill="currentColor"/>`).join("")}</g>`,
      ...[...details.filter((p) => !insideBody(p)), ...faints].map((p) =>
        p.shape.closed && !p.ring && !p.shape.dot ? `<path d="${p.shape.d}" fill="currentColor"/>` : stroked(p.shape),
      ),
    ].filter(Boolean).join("\n"),
  );

  // Bulk: fills only. Bodies and faint lines at 40%, details solid.
  const solidFill = (p) => {
    if (p.shape.dot || (p.shape.closed && !p.ring)) return `<path d="${p.shape.d}" fill="currentColor"/>`;
    const g = p.shape.closed ? ring(p.shape) : { d: capsules(p.shape.sample) };
    return `<path d="${g.d}"${g.evenodd ? ' fill-rule="evenodd"' : ""} fill="currentColor"/>`;
  };
  const bulk = svg(
    [
      `<g opacity=".4">${[...bodies.map((p) => `<path d="${p.shape.d}" fill="currentColor"/>`), ...faints.map(solidFill)].join("")}</g>`,
      ...details.map(solidFill),
    ].join("\n"),
  );

  // Outline: the same drawing as linear. Its weight is fixed (the site only changes line styles).
  return { linear, outline: linear, bold, bulk, twotone, broken };
}

/* ------------------------------ helpers ------------------------------ */
export const body = (shape) => ({ role: "body", shape });
export const detail = (shape, opts = {}) => ({ role: "detail", shape, ...opts });
export const faint = (shape) => ({ role: "faint", shape });
