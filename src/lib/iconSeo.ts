import { brand } from "~/content/site";
import { freeIconsMeta } from "~/content/freeIcons.meta";
import { paymentsMeta } from "~/content/payments.meta";
import { iconArticle } from "~/content/iconArticle";
import { libraryArticle, styleKeywords } from "~/content/libraryArticle";
import { titleCase } from "./titleCase";
import { isColorHue, type ColorHue } from "./colorStyle";
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
export type ToolSearch = { q?: string; cat?: string; size?: number; weight?: StrokeWeight; /** Color style: one hue for every icon */ hue?: ColorHue };

export function validateToolSearch(raw: Record<string, unknown>): ToolSearch {
  return {
    q: typeof raw.q === "string" && raw.q ? raw.q : undefined,
    cat: typeof raw.cat === "string" && raw.cat ? raw.cat : undefined,
    size: [24, 32, 48].includes(Number(raw.size)) ? Number(raw.size) : undefined,
    weight: strokeWeights.some((w) => w.value === raw.weight) ? (raw.weight as StrokeWeight) : undefined,
    hue: isColorHue(raw.hue) ? raw.hue : undefined,
  };
}

/* --------------------------------- Meta ---------------------------------- */

// The current year in titles signals fresh content in search results; the site rebuilds often.
const YEAR = new Date().getFullYear();

const site = brand.siteUrl.replace(/\/$/, "");
const categoryLabel = new Map<string, string>(freeIconsMeta.categories.map((c) => [c.slug, c.label]));
export const labelForCategory = (slug: string) => categoryLabel.get(slug) ?? humanName(slug);

/** `image`: a share card from public/og (built by `npm run social`), e.g. "docs". */
type HeadParts = { title: string; description: string; path: string; jsonLd?: object[]; /** A card in public/og by name, or a path such as "/og/blog-x.png" */ image?: string };

/** Title, description, canonical, Open Graph and structured data for one page. */
export function pageHead({ title, description, path, jsonLd = [], image = "home" }: HeadParts) {
  const url = site + path;
  const card = image.startsWith("/") ? site + image : `${site}/og/${image}.png`;
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

const faqLd = (items: Array<{ q: string; a: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export function libraryHead() {
  const total = freeIconsMeta.total;
  const styles = freeIconsMeta.styles.length;
  return pageHead({
    title: `${total} Free SVG Icons in ${styles} Styles (${YEAR})${SEP}${brand.name}`,
    description: `Free icons for websites and apps: ${total} open-source SVG icons in ${styles} styles, including glass and duotone. Recolour, resize and copy as SVG, PNG, React, Vue or Svelte. MIT licence, no sign-up.`,
    path: "/icons",
    jsonLd: [breadcrumbs([{ name: "Free icons", path: "/icons" }]), faqLd(libraryArticle.faq())],
  });
}

export function paymentsHead() {
  const n = paymentsMeta.logos.length;
  return pageHead({
    title: `${n} Free Payment Logos: Visa, Mastercard, PayPal SVG (${YEAR})${SEP}${brand.name}`,
    description: `${n} free payment method logos for checkout pages: Visa, Mastercard, PayPal, Apple Pay, Google Pay, Stripe and more. Three card sizes, full colour. Copy SVG or download.`,
    path: "/icons/payments",
    jsonLd: [breadcrumbs([{ name: "Free icons", path: "/icons" }, { name: "Payment logos", path: "/icons/payments" }])],
  });
}

export function styleHead(style: IconStyle) {
  const label = styleLabels[style];
  const { keyword, also } = styleKeywords[style];
  return pageHead({
    title: `${titleCase(`Free ${keyword}`)}: ${freeIconsMeta.total} SVG & PNG Icons${SEP}${brand.name}`,
    description: `${freeIconsMeta.total} free ${keyword} (${also}) for apps and websites. Download SVG or PNG, or copy React, Vue and Svelte code. Open source, MIT licensed.`,
    path: stylePath(style),
    image: "styles",
    jsonLd: [
      breadcrumbs([{ name: "Free icons", path: "/icons" }, { name: `${label} icons`, path: stylePath(style) }]),
      faqLd(libraryArticle.faq({ id: style, label })),
    ],
  });
}

/** Page title for an icon: leads with the phrase people search, e.g. "Hourglass icon (Timer)". */
export function iconTitle(name: string, primary?: string) {
  if (!primary) return `${name} icon`;
  const keyword = primary.charAt(0).toUpperCase() + primary.slice(1);
  const firstWord = name.toLowerCase().split(" ")[0];
  return primary.includes(firstWord) ? keyword : `${keyword} (${name})`;
}

/** Title separator between the page and the site: "Link Icon … - fmicon" */
export const SEP = " - ";

// Title templates for icon pages. K is the keyword heading ("Link Icon", "Hourglass Icon (Timer)"),
// S the style. Each icon gets one by a stable hash, so neighbours read differently but a page's title never changes.
const LINEAR_TITLES: Array<(k: string) => string> = [
  (k) => `${k}: Free SVG, PNG & React Download`,
  (k) => `Free ${k}: Copy SVG or Download PNG`,
  (k) => `${k} SVG: Free, Editable & Ready to Paste`,
  (k) => `${k}: 8 Free Styles in SVG & PNG`,
  (k) => `Download ${k} Free: SVG, PNG & React Code`,
  (k) => `${k} (${YEAR}): Free SVG & PNG for Web & Apps`,
];
const STYLE_TITLES: Array<(k: string, s: string) => string> = [
  (k, s) => `${k} (${s}): Free SVG, PNG & React Download`,
  (k, s) => `Free ${s} ${k}: Copy SVG or Download PNG`,
  (k, s) => `${s} ${k} SVG: Free & Ready to Paste`,
  (k, s) => `${k} in ${s} Style: Free SVG & PNG`,
  (k, s) => `Download the ${s} ${k} Free: SVG & PNG`,
];

// Short forms for long icon names, so the brand still fits in 60 characters
const SHORT_LINEAR: Array<(k: string) => string> = [(k) => `${k}: Free SVG & PNG`, (k) => `Free ${k} SVG & PNG`];
const SHORT_STYLE: Array<(k: string, s: string) => string> = [(k, s) => `${s} ${k}: Free SVG & PNG`, (k, s) => `${k} (${s}) Free SVG`];

const hash = (text: string) => [...text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const rotate = <T,>(list: T[], by: number) => list.map((_, i) => list[(by + i) % list.length]);

/**
 * The title for one icon page, always ending " - fmicon" within 60 characters when possible.
 * Order: the icon's own template (by hash) → a short form → the other templates.
 */
function pickIconTitle(keyword: string, style: IconStyle, label: string, seed: string) {
  const h = hash(seed);
  const linear = style === "linear";
  const build = (k: string) => {
    const main = (linear ? LINEAR_TITLES.map((t) => t(k)) : STYLE_TITLES.map((t) => t(k, label))).map(titleCase);
    const short = (linear ? SHORT_LINEAR.map((t) => t(k)) : SHORT_STYLE.map((t) => t(k, label))).map(titleCase);
    const mine = h % main.length;
    return [main[mine], ...rotate(short, h), ...main.filter((_, i) => i !== mine)];
  };
  // Long names: try the full keyword, then without its bracketed alias ("Next Icon (Arrow Circle Right)" -> "Next Icon")
  const keywords = keyword.includes(" (") ? [keyword, keyword.replace(/ \(.*\)$/, "")] : [keyword];
  for (const k of keywords) {
    for (const option of build(k)) {
      const withBrand = option + SEP + brand.name;
      if (withBrand.length <= 60) return withBrand;
    }
  }
  // Still too long: the shortest form, without the brand
  return build(keywords[keywords.length - 1]).sort((a, b) => a.length - b.length)[0];
}

/** Cuts text at a word boundary so meta descriptions stay within what Google shows. */
const clip = (text: string, max = 158) => (text.length <= max ? text : text.slice(0, text.lastIndexOf(" ", max - 1)).replace(/[,.:;]$/, "") + "…");

export function iconHead(style: IconStyle, icon: { slug: string; name: string; category: string }, article?: IconArticle | null) {
  const label = styleLabels[style];
  const name = humanName(icon.name);
  const path = iconPath(style, icon.slug);
  const primary = article?.primary ?? `${name.toLowerCase()} icon`;
  // e.g. "Free Refresh Icon: Copy SVG or Download PNG - fmicon", "Glass Wallet Icon SVG: Free & Ready to Paste - fmicon"
  const base = titleCase(iconTitle(name, article?.primary));
  const title = pickIconTitle(base, style, label, `${style}/${icon.slug}`);
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
