import accessibleIcons from "./accessible-icons.html?raw";
import freeSvgIcons from "./free-svg-icons.html?raw";
import reactIcons from "./react-icons.html?raw";
import svgVsPng from "./svg-vs-png.html?raw";

/**
 * Blog posts. Each article is a self-contained HTML file (title, meta description,
 * FAQPage JSON-LD and the <article>), written answer-first. Edit the file, then run
 * `npm run blog` to refresh its FAQ schema.
 */

type PostMeta = {
  slug: string;
  source: string;
  /** Short label on cards */
  tag: string;
  date: string;
  /** Three icons shown on the cover, from the glass set */
  cover: [string, string, string];
};

const posts: PostMeta[] = [
  { slug: "svg-vs-png", source: svgVsPng, tag: "Formats", date: "2026-11-25", cover: ["image", "document", "gallery"] },
  { slug: "react-icons", source: reactIcons, tag: "React", date: "2026-11-25", cover: ["code", "layer", "mobile"] },
  { slug: "free-svg-icons", source: freeSvgIcons, tag: "Guides", date: "2026-11-25", cover: ["home", "star", "heart"] },
  { slug: "accessible-icons", source: accessibleIcons, tag: "Accessibility", date: "2026-11-25", cover: ["eye", "user", "tick-circle"] },
];

export const blogAuthor = { name: "Prashant Sharma", avatar: "/prashant.jpg" };

export const blogIntro = {
  eyebrow: "Blog",
  title: "Guides for Icons, SVG and Better Interfaces",
  sub: "Plain-English guides on using icons well: formats, frameworks, accessibility and design. Tested on the 891 icons in fmicon.",
};

const decode = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const plain = (html: string) => decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** A label for a code sample, from what it looks like. */
function codeLabel(code: string) {
  const c = code.trim();
  if (/^(npm|npx|pnpm|yarn|bun|claude|codex|code) /.test(c)) return "Terminal";
  if (/^<script setup>/.test(c)) return "Vue";
  if (/^\{[\s\S]*"mcpServers"/.test(c)) return "JSON";
  if (/^[.#]?[a-z-]+(:[a-z-]+)?\s*\{[\s\S]*:/.test(c) && !c.includes("<")) return "CSS";
  if (/^(import|export|\/\/)/m.test(c) || /<[A-Z]/.test(c)) return "React";
  if (/^</.test(c)) return "HTML";
  return "Code";
}

export type BlogPart = { type: "html"; html: string } | { type: "code"; code: string; label: string };

/** Article HTML cut into prose and code samples, so code renders as a copyable block. */
function splitParts(html: string): BlogPart[] {
  const parts: BlogPart[] = [];
  let last = 0;
  for (const m of html.matchAll(/<pre><code>([\s\S]*?)<\/code><\/pre>/g)) {
    const i = m.index ?? 0;
    if (i > last) parts.push({ type: "html", html: html.slice(last, i) });
    const code = decode(m[1]);
    parts.push({ type: "code", code, label: codeLabel(code) });
    last = i + m[0].length;
  }
  if (last < html.length) parts.push({ type: "html", html: html.slice(last) });
  return parts;
}

function parse(meta: PostMeta) {
  const src = meta.source;
  const metaTitle = plain(src.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  const description = src.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  const ld = src.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const article = src.match(/<article>([\s\S]*?)<\/article>/)?.[1] ?? "";
  const title = plain(article.match(/<h1>([\s\S]*?)<\/h1>/)?.[1] ?? metaTitle);

  // Page body without the H1 (the page header renders it), with ids on every H2 for the table of contents.
  const toc: Array<{ id: string; title: string }> = [];
  const html = article
    .replace(/<h1>[\s\S]*?<\/h1>/, "")
    .replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
      const id = slugify(plain(inner));
      toc.push({ id, title: plain(inner) });
      return `<h2 id="${id}">${inner}</h2>`;
    })
    .trim();

  const words = plain(article).split(" ").length;
  return {
    ...meta,
    title,
    metaTitle,
    description,
    html,
    parts: splitParts(html),
    toc,
    faqLd: ld ? (JSON.parse(ld) as object) : undefined,
    minutes: Math.max(1, Math.round(words / 220)),
  };
}

export type BlogPost = ReturnType<typeof parse>;

export const blogPosts: BlogPost[] = posts.map(parse);
export const findPost = (slug: string) => blogPosts.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
