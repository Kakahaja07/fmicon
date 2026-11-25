import type { IconStyle } from "~/lib/svg";
import { freeIconsMeta } from "./freeIcons.meta";

/* Written content under the icon grid on /icons and /icons/<style>, for people and search engines.
   Keywords from Keywords Everywhere (US, 2026-11-25): free icons 18.1k, svg icons 4.4k,
   free svg icons 2.9k, icon library 1.9k, icon pack 1.9k, free icons for website 1k,
   glass icons 1k, 3d icons 880, open source icons 720, line icons 720. */

const TOTAL = freeIconsMeta.total;
const STYLES = freeIconsMeta.styles.length;

/** The phrase each style page targets, and how people search for it. */
export const styleKeywords: Record<IconStyle, { keyword: string; also: string; short: string }> = {
  linear: { keyword: "line icons", also: "linear icons, outline SVG icons", short: "Toolbars and tab bars" },
  outline: { keyword: "outline icons", also: "outlined icons, filled-stroke icons", short: "Design files and print" },
  bold: { keyword: "bold icons", also: "solid icons, filled icons", short: "Selected states" },
  bulk: { keyword: "bulk icons", also: "layered icons, soft filled icons", short: "Feature lists" },
  twotone: { keyword: "two tone icons", also: "twotone icons, two colour icons", short: "Dashboards" },
  broken: { keyword: "broken line icons", also: "hand-drawn style icons", short: "Playful brands" },
  glass: { keyword: "glass icons", also: "3D icons, glassmorphism icons", short: "3D app tiles" },
  duotone: { keyword: "duotone icons", also: "two tone fill icons", short: "A hint of colour" },
};

export const libraryArticle = {
  library: {
    title: "Free SVG icons for websites and apps",
    intro: [
      `FM Icons is a free, open-source icon library of ${TOTAL} UI icons, each drawn in ${STYLES} styles. Every icon is a clean SVG on a 24 px grid, so it stays sharp from a 16 px button to a 512 px hero, and you can recolour it with one CSS value.`,
      "Use them for websites, mobile apps, dashboards, slides and design files. They are free for personal and commercial work under the MIT licence, with no sign-up and no attribution needed in your interface.",
    ],
  },
  style: (style: IconStyle, label: string) => ({
    title: `Free ${styleKeywords[style].keyword}: ${TOTAL} SVG icons in the ${label.toLowerCase()} style`,
    intro: [
      `This page holds all ${TOTAL} FM Icons in the ${label.toLowerCase()} style, the ${styleKeywords[style].keyword} people also search for as ${styleKeywords[style].also}. Every one is free, open source and ready as SVG, PNG or code.`,
    ],
  }),
  styles: {
    title: `${STYLES} icon styles in one library`,
    text: "Every icon exists in every style with the same shape, so you can mix them: linear for idle states, bold for the selected one, glass for a hero.",
  },
  categories: { title: "Browse icons by category" },
  popular: { title: "Popular free icons", text: "The icons people open most, each with its own page, sizes, colours and code." },
  howTo: {
    title: "How to use these icons",
    steps: [
      { title: "Copy or download", text: "Click any icon to copy it as SVG or JSX, or download SVG, PNG or WebP at any size from 16 to 512 px." },
      { title: "Install a package", text: "Add icons to React, Vue, Svelte or React Native with one npm package, tree-shaken so only the icons you use ship.", link: { label: "Read the docs", href: "/docs" } },
      { title: "Link from the CDN", text: "Drop a URL into an <img> tag for static sites, emails and prototypes, no install needed.", link: { label: "CDN guide", href: "/docs/svg" } },
    ],
  },
  faqTitle: "Free icons FAQ",
  faq: (style?: { id: IconStyle; label: string }) => [
    ...(style
      ? [
          {
            q: `What are ${styleKeywords[style.id].keyword}?`,
            a: `${style.label} is one of the ${STYLES} FM Icons styles. Every icon has the same shape in every style, so you can switch a whole interface to ${style.label.toLowerCase()} icons without anything moving.`,
          },
        ]
      : []),
    {
      q: "Are these icons free for commercial use?",
      a: `Yes. All ${TOTAL} icons in all ${STYLES} styles are free for personal and commercial projects, including client work and apps you sell. The code is MIT licensed; keep the licence notice if you redistribute the icon files.`,
    },
    {
      q: "Which file formats can I download?",
      a: "SVG, PNG and WebP at any size from 16 to 512 px. You can also copy each icon as JSX or as a ready component for React, React Native, Vue, Svelte, Angular and Flutter.",
    },
    {
      q: "How do I use the icons in React, Vue or Svelte?",
      a: "Install the package for your framework, for example npm i @fmicons/react, then import icons by name: import { Home } from \"@fmicons/react\". Each icon takes size, colour, style and stroke weight as props.",
    },
    {
      q: `What is the difference between the ${STYLES} icon styles?`,
      a: "Linear and outline are clean lines, bold is solid, bulk and twotone add a softer second layer, broken has small gaps for a hand-drawn feel, duotone adds a tinted fill, and glass looks like a small 3D object.",
    },
    {
      q: "Is FM Icons open source?",
      a: "Yes. The icons, packages and this website are on GitHub. You can request icons, report problems and send pull requests there.",
    },
  ],
};
