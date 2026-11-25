import type { IconStyle } from "~/lib/svg";

/**
 * Shared copy for the article under every free icon page.
 * The per-icon text (intro, uses, tips, FAQ) is in src/content/icon-articles/<slug>.json,
 * built by `npm run articles` from scripts/data/.
 */
export const iconArticle = {
  toc: "On this page",
  alsoKnown: "Also searched as",
  stylesTitle: "Styles",
  bestFor: "Best for",
  sections: {
    about: (name: string) => `What is the ${name} icon?`,
    uses: (primary: string) => `When to use the ${primary}`,
    style: (name: string, style: string) => `The ${name} icon in ${style} style`,
    howTo: (name: string) => `How to use the ${name} icon`,
    tips: (name: string) => `Design tips for the ${name} icon`,
    pairs: (name: string) => `Icons that work well with ${name}`,
    faq: (name: string) => `${name} icon FAQ`,
  },
  tocLabels: {
    about: "What it means",
    uses: "When to use it",
    style: "Style",
    howTo: "How to use it",
    tips: "Design tips",
    pairs: "Works well with",
    faq: "FAQ",
  },
  otherStyles: "The same icon also comes in",
  browseCategory: (category: string) => `Browse all ${category} icons`,
  licence: (name: string, total: number) => ({
    q: `Can I use the ${name} icon in commercial projects?`,
    a: `Yes. The ${name} icon is one of ${total} free, open-source icons you can use in personal and commercial work, including client projects and apps you sell. The packages are MIT licensed; keep the licence notice if you redistribute the icon files.`,
  }),
  formats: (name: string) => ({
    q: `Which formats can I download the ${name} icon in?`,
    a: `SVG, PNG and WebP, at any size from 16 to 512 pixels. You can also copy it as JSX or as a ready-made component for React, React Native, Vue, Svelte, Angular and Flutter, with your stroke weight and colour already applied.`,
  }),
  promo: {
    title: (_total: number) => "Free and open source",
    text: (total: number) => `This icon is one of ${total}, in 8 styles, MIT licensed. A star on GitHub helps more people find it.`,
    cta: "Star on GitHub",
  },
} as const;

/** What each style looks like and where it fits. Shown in the "style" section of every icon page. */
export const styleNotes: Record<IconStyle, { summary: string; bestFor: string }> = {
  linear: {
    summary: "Linear icons are drawn with a single even stroke and no fills, so they stay light next to body text. You can change the stroke weight from thin to bold without the shape falling apart.",
    bestFor: "toolbars, tab bars, settings lists and anything that sits beside text",
  },
  outline: {
    summary: "Outline icons trace the same shapes as linear, but each line is a filled contour instead of a stroke. The weight stays fixed at every size, which makes them predictable in design tools and exports.",
    bestFor: "design files, print and exports where strokes might get scaled by accident",
  },
  bold: {
    summary: "Bold icons are solid filled shapes. They read fastest at small sizes and carry the most visual weight, which is why they work so well for the selected state of a tab or toggle.",
    bestFor: "active and selected states, small sizes and bold brands",
  },
  bulk: {
    summary: "Bulk icons put a solid shape over a softer, semi-transparent one. You get depth and a clear focal point from a single colour, with no second colour to manage.",
    bestFor: "feature lists, empty states and cards that need a bit more presence",
  },
  twotone: {
    summary: "Twotone icons draw the main lines at full strength and a secondary part at lower opacity. The eye lands on the part that matters first, while the rest of the symbol stays readable.",
    bestFor: "dashboards, onboarding screens and marketing sections",
  },
  broken: {
    summary: "Broken icons leave small, deliberate gaps in the stroke. The result feels hand-drawn and airy, and it softens an interface without making it look unfinished.",
    bestFor: "playful brands, landing pages and illustrations",
  },
  glass: {
    summary: "Glass icons have built-in gradients, highlights and a frosted layer, so they look like small 3D objects. They keep their own colours and ship in separate tones for light and dark backgrounds.",
    bestFor: "app tiles, hero sections, feature highlights and anywhere an icon is the star",
  },
  duotone: {
    summary: "Duotone icons pair the line with a soft tinted fill in the same colour. They add a hint of depth while staying easy to recolour with a single value.",
    bestFor: "product UI that wants a little colour without a full illustration style",
  },
};
