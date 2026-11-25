import type { FreeIcon, IconStyle } from "./svg";

/** The article and style variants for one free icon: src/content/icon-articles/<slug>.json */
export type IconArticle = {
  /** Main search phrase this page targets, e.g. "refresh icon" */
  primary: string;
  /** Other phrases people search for the same icon */
  keywords: string[];
  intro: string;
  meaning: string;
  uses: string[];
  tips: string[];
  /** Suggested aria-label for an icon-only button */
  aria: string;
  /** Slugs of icons often used next to this one */
  pairs: string[];
  faq: Array<{ q: string; a: string }>;
  /** The icon in every style, for the style switcher */
  variants: Record<IconStyle, string>;
  glassLight: string;
  /** Added by the page loader: same-category and paired icons in the page's style, so links render before the full list loads */
  nearby?: FreeIcon[];
};

const files = import.meta.glob<IconArticle>("../content/icon-articles/*.json", { import: "default" });

/** Every icon in every style: src/content/icon-variants/<slug>.json (npm run variants) */
export type IconVariants = Partial<Record<IconStyle | "glass-light", string>>;
const variantFiles = import.meta.glob<IconVariants>("../content/icon-variants/*.json", { import: "default" });

/** Loads one icon's bodies in all styles (its own small chunk), for the style strip. */
export function loadVariants(slug: string): Promise<IconVariants | null> {
  const loader = variantFiles[`../content/icon-variants/${slug}.json`];
  return loader ? loader() : Promise.resolve(null);
}

/** Loads one icon's article (its own small chunk). Null when the icon has none. */
export function loadArticle(slug: string): Promise<IconArticle | null> {
  const loader = files[`../content/icon-articles/${slug}.json`];
  return loader ? loader() : Promise.resolve(null);
}
