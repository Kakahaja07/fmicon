import { brand } from "~/content/site";
import { freeIconsMeta } from "~/content/freeIcons.meta";
import { iconArticle } from "~/content/iconArticle";
import type { IconArticle } from "./iconArticle";
import { humanName, strokeWeights, styleLabels, type IconStyle, type StrokeWeight } from "./svg";

/* ------------------------------- URL rules ------------------------------- */
// /icons                    the library (linear)
// /icons/<style>            one style, e.g. /icons/duotone
// /icons/<style>/<slug>     one icon,  e.g. /icons/linear/home
// Filters that don't change the content (search, category, size, weight) stay as query params.

export const isStyle = (value: string): value is IconStyle => (freeIconsMeta.styles as readonly string[]).includes(value);

export const stylePath = (style: IconStyle) => (style === "linear" ? "/icons" : `/icons/${style}`);
export const iconPath = (style: IconStyle, slug: string) => `/icons/${style}/${slug}`;

export const slugToId = new Map<string, string>(freeIconsMeta.index.map((i) => [i.slug, i.id]));
export const idToSlug = new Map<string, string>(freeIconsMeta.index.map((i) => [i.id, i.slug]));

/** Query params shared by every /icons page. */
export type ToolSearch = { q?: string; cat?: string; size?: number; weight?: StrokeWeight };

export function validateToolSearch(raw: Record<string, unknown>): ToolSearch {
  return {
    q: typeof raw.q === "string" && raw.q ? raw.q : undefined,
    cat: typeof raw.cat === "string" && raw.cat ? raw.cat : undefined,
    size: [24, 32, 48].includes(Number(raw.size)) ? Number(raw.size) : undefined,
    weight: strokeWeights.some((w) => w.value === raw.weight) ? (raw.weight as StrokeWeight) : undefined,
  };
}

/* --------------------------------- Meta ---------------------------------- */

const site = brand.siteUrl.replace(/\/$/, "");
const categoryLabel = new Map<string, string>(freeIconsMeta.categories.map((c) => [c.slug, c.label]));
export const labelForCategory = (slug: string) => categoryLabel.get(slug) ?? humanName(slug);

/** `image`: a share card from public/og (built by `npm run social`), e.g. "docs". */
type HeadParts = { title: string; description: string; path: string; jsonLd?: object[]; image?: "home" | "docs" | "styles" };

/** Title, description, canonical, Open Graph and structured data for one page. */
export function pageHead({ title, description, path, jsonLd = [], image = "home" }: HeadParts) {
  const url = site + path;
  const card = `${site}/og/${image}.png`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { property: "og:image", content: card },
      { name: "twitter:image", content: card },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: jsonLd.map((data) => ({ type: "application/ld+json", children: JSON.stringify(data) })),
  };
}

const breadcrumbs = (items: Array<{ name: string; path: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: site + item.path })),
});

export function libraryHead() {
  return pageHead({
    title: `${freeIconsMeta.total} free, open-source icons in ${freeIconsMeta.styles.length} styles · SVG, React, Vue | ${brand.name}`,
    description: `Browse ${freeIconsMeta.total} free, open-source UI icons in ${freeIconsMeta.styles.length} styles, including glass and duotone. Recolour, resize and copy as SVG, PNG, React, Vue, Svelte or Flutter. No sign-up.`,
    path: "/icons",
    jsonLd: [breadcrumbs([{ name: "Free icons", path: "/icons" }])],
  });
}

export function styleHead(style: IconStyle) {
  const label = styleLabels[style];
  return pageHead({
    title: `Free ${label} icons · ${freeIconsMeta.total} ${label.toLowerCase()} SVG icons | ${brand.name}`,
    description: `${freeIconsMeta.total} free, open-source ${label.toLowerCase()} icons for apps and websites. Download SVG or PNG, or copy React, Vue, Svelte and Flutter code. MIT licensed, part of FM Icons.`,
    // Linear is the library's default view, so /icons is its canonical home.
    path: stylePath(style),
    image: "styles",
    jsonLd: [breadcrumbs([{ name: "Free icons", path: "/icons" }, { name: `${label} icons`, path: stylePath(style) }])],
  });
}

/** Page title for an icon: leads with the phrase people search, e.g. "Hourglass icon (Timer)". */
export function iconTitle(name: string, primary?: string) {
  if (!primary) return `${name} icon`;
  const keyword = primary.charAt(0).toUpperCase() + primary.slice(1);
  const firstWord = name.toLowerCase().split(" ")[0];
  return primary.includes(firstWord) ? keyword : `${keyword} (${name})`;
}

/** Cuts text at a word boundary so meta descriptions stay within what Google shows. */
const clip = (text: string, max = 158) => (text.length <= max ? text : text.slice(0, text.lastIndexOf(" ", max - 1)).replace(/[,.:;]$/, "") + "…");

export function iconHead(style: IconStyle, icon: { slug: string; name: string; category: string }, article?: IconArticle | null) {
  const label = styleLabels[style];
  const name = humanName(icon.name);
  const path = iconPath(style, icon.slug);
  const primary = article?.primary ?? `${name.toLowerCase()} icon`;
  const title = `${iconTitle(name, article?.primary)} · Free ${label} SVG & PNG | ${brand.name}`;
  const lead = article ? article.intro.split(/(?<=\.)\s/)[0] + " " : "";
  const description = clip(`Free ${primary} in the ${label.toLowerCase()} style. ${lead}Download SVG, PNG or WebP, or copy React, Vue and Flutter code.`);
  const faq = article
    ? [...article.faq, iconArticle.licence(name.toLowerCase(), freeIconsMeta.total), iconArticle.formats(name.toLowerCase())]
    : [];
  return pageHead({
    title,
    description,
    path,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        name: `${name} icon (${label})`,
        description,
        url: site + path,
        encodingFormat: "image/svg+xml",
        isAccessibleForFree: true,
        keywords: [primary, ...(article?.keywords ?? []), `${label.toLowerCase()} icon`, labelForCategory(icon.category)].join(", "),
        creator: { "@type": "Organization", name: brand.name, url: site },
      },
      breadcrumbs([
        { name: "Free icons", path: "/icons" },
        { name: `${label} icons`, path: stylePath(style) },
        { name: `${name} icon`, path },
      ]),
      ...(faq.length
        ? [
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ]
        : []),
    ],
  });
}
