/* ==========================================================================
   All page copy and data. Edit text, links and lists here;
   the components only decide how things look.
   Names marked PLACEHOLDER are stand-ins: swap them for your real ones.
   ========================================================================== */

import type { IconComponent } from "~/components/icons/Icons";
import * as I from "~/components/icons/Icons";
import type { PaletteColor } from "~/lib/palette";
import type { IconStyle } from "~/lib/svg";
import { freeIconsMeta } from "./freeIcons.meta";

// Counts come from the generated icon data, so copy stays right when the set changes.
const TOTAL = freeIconsMeta.total;
const STYLES = freeIconsMeta.styles.length;
const spelled = (n: number) => ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"][n] ?? String(n);

export const brand = {
  name: "FM Icons",
  siteUrl: "https://fmicon.dev",
  description:
    `${TOTAL} free, open-source icons in ${STYLES} styles. Copy them as SVG, or install them for React, Vue, Svelte and React Native.`,
};

/* ------------------------------ Open source ------------------------------ */

const REPO = "https://github.com/Kakahaja07/fmicons";

export const openSource = {
  repo: REPO,
  // jsDelivr serves files straight from the GitHub repo, no npm publish needed
  cdn: "https://cdn.jsdelivr.net/gh/Kakahaja07/fmicons@main/packages/svg/icons",
  licence: "MIT",
  badge: "Open source · MIT",
  star: { label: "Star on GitHub", href: REPO },
  // Home section and the panel under the icon browser
  title: "Free for everyone, forever",
  text: `Every one of the ${TOTAL} icons, in all ${STYLES} styles, is free for personal and commercial work. No sign-up, no paywall: install a package or copy the SVG.`,
  perks: [
    { icon: I.Element4Icon, color: "blue", text: `${TOTAL} icons × ${STYLES} styles` },
    { icon: I.CodeIcon, color: "green", text: "Packages for React, Vue, Svelte and React Native" },
    { icon: I.GlobalIcon, color: "purple", text: "Link any SVG from the jsDelivr CDN" },
    { icon: I.ShieldTickIcon, color: "orange", text: "MIT licence, use it anywhere" },
  ] satisfies Array<{ icon: IconComponent; color: PaletteColor; text: string }>,
  install: [
    { value: "react", label: "React", command: "npm i @fmicons/react", file: "App.jsx", code: `import { Home } from "@fmicons/react";

<Home size={24} variant="bold" />` },
    { value: "vue", label: "Vue", command: "npm i @fmicons/vue", file: "App.vue", code: `<script setup>
import { Home } from "@fmicons/vue";
</script>

<template>
  <Home :size="24" variant="bold" />
</template>` },
    { value: "svelte", label: "Svelte", command: "npm i @fmicons/svelte @fmicons/core", file: "App.svelte", code: `<script>
  import { Icon } from "@fmicons/svelte";
  import { home } from "@fmicons/core";
</script>

<Icon icon={home} size={24} variant="bold" />` },
    { value: "react-native", label: "React Native", command: "npm i @fmicons/react-native react-native-svg", file: "App.jsx", code: `import { Home } from "@fmicons/react-native";

<Home size={24} variant="bold" />` },
    { value: "js", label: "JS", command: "npm i @fmicons/core", file: "main.js", code: `import { home, toSvg } from "@fmicons/core";

el.innerHTML = toSvg(home, { size: 24, variant: "bold" });` },
  ] as const,
  browse: { label: `Browse all ${TOTAL} icons`, href: "/icons" },
};

/** `id` is a section on the home page; `page` is its own route. `optional` links hide on phones. */
export type NavLink = { label: string; href: string; id: string; page?: boolean; optional?: boolean };

export const nav = {
  links: [
    { label: "Home", href: "/#top", id: "top", optional: true },
    { label: "Features", href: "/#features", id: "features", optional: true },
    { label: "Icons", href: "/icons", id: "icons", page: true },
    { label: "Docs", href: "/docs", id: "docs", page: true },
    { label: "Open source", href: "/#open-source", id: "open-source", optional: true },
  ] satisfies NavLink[] as NavLink[],
  cta: { label: "Star on GitHub", href: REPO },
};

/* ---------------------------- Free icon browser --------------------------- */

export const iconTool = {
  seo: {
    title: "Icon browser",
    description:
      `Search, preview, recolour and copy ${TOTAL} free, open-source icons in ${STYLES} styles, including Glass and Duotone. Paste as SVG or code, or download the file.`,
  },
  toolbar: { title: "FM Icons", cta: "Star on GitHub", home: "Back to FM Icons" },
  windowLink: `Browse all ${TOTAL} icons`,
};

/* ---------------------------------- Hero --------------------------------- */

export const hero = {
  announce: { badge: "New", label: "FM Icons is now free and open source", href: REPO },
  title: "Every icon you need, one search away",
  sub: `${TOTAL} free, open-source icons in ${STYLES} styles. Find one in a keystroke, recolour it, and drop it into Figma, React, Vue or Flutter.`,
  search: {
    placeholder: `Search ${TOTAL} icons, e.g. wallet, arrow, chat`,
    popularLabel: "Popular:",
    popular: ["home", "wallet", "arrow", "message", "setting", "calendar"],
  },
  primary: { label: `Browse ${TOTAL} icons`, href: "/icons" },
  secondary: { label: "Star on GitHub", href: REPO },
  meta: ["MIT licence", "No sign-up", "Install with"],
  install: "npm i @fmicons/react",
};

// Real numbers from the icon set, shown right under the hero.
export const stats = [
  { value: `${TOTAL}`, label: "icons, drawn on one grid" },
  { value: `${STYLES}`, label: "styles of every icon" },
  { value: "8", label: "ways to use them, from React to Flutter" },
  { value: "MIT", label: "licence, free forever" },
];

/* ------------------------- App window in the hero ------------------------ */

export const library = {
  sidebar: {
    libraryLabel: "My library",
    library: [
      { name: "All icons", count: (TOTAL * STYLES).toLocaleString("en-GB"), color: "blue" },
      { name: "Favourites", count: "64", color: "pink" },
      { name: "Recently used", count: "20", color: "orange" },
    ],
    setsLabel: "Icon sets",
    sets: [
      { name: "Linear", count: String(TOTAL), color: "indigo", active: true },
      { name: "Bold", count: String(TOTAL), color: "blue" },
      { name: "Twotone", count: String(TOTAL), color: "teal" },
      { name: "Bulk", count: String(TOTAL), color: "green" },
      { name: "Glass", count: String(TOTAL), color: "red" },
      { name: "Duotone", count: String(TOTAL), color: "yellow" },
    ],
  } satisfies Record<string, unknown>,
  activeSet: "Linear",
  crumb: "Styles → Linear",
  icons: [
    { name: "home", icon: I.HomeIcon },
    { name: "wallet", icon: I.WalletIcon },
    { name: "search", icon: I.SearchNormalIcon },
    { name: "heart", icon: I.HeartIcon },
    { name: "camera", icon: I.CameraIcon },
    { name: "music", icon: I.MusicIcon },
    { name: "cloud", icon: I.CloudIcon },
    { name: "setting", icon: I.SettingIcon },
    { name: "calendar", icon: I.CalendarIcon },
    { name: "message", icon: I.MessageIcon },
    { name: "lock", icon: I.LockIcon },
    { name: "user", icon: I.UserIcon },
    { name: "gift", icon: I.GiftIcon },
    { name: "location", icon: I.LocationIcon },
    { name: "bag", icon: I.BagIcon },
    { name: "bookmark", icon: I.BookmarkIcon },
    { name: "microphone", icon: I.MicrophoneIcon },
    { name: "gallery", icon: I.GalleryIcon },
    { name: "map", icon: I.MapIcon },
    { name: "notification", icon: I.NotificationIcon },
    { name: "trash", icon: I.TrashIcon },
    { name: "edit", icon: I.EditIcon },
    { name: "link", icon: I.LinkIcon },
    { name: "send", icon: I.SendIcon },
    { name: "global", icon: I.GlobalIcon },
    { name: "chart", icon: I.ChartIcon },
    { name: "cup", icon: I.CupIcon },
    { name: "diamonds", icon: I.DiamondsIcon },
    { name: "crown", icon: I.CrownIcon },
    { name: "flash", icon: I.FlashIcon },
    { name: "game", icon: I.GameIcon },
    { name: "pet", icon: I.PetIcon },
    { name: "coffee", icon: I.CoffeeIcon },
    { name: "brush", icon: I.BrushIcon },
    { name: "shapes", icon: I.ShapesIcon },
    { name: "sticker", icon: I.StickerIcon },
    { name: "folder", icon: I.FolderIcon },
    { name: "copy", icon: I.CopyIcon },
    { name: "code", icon: I.CodeIcon },
    { name: "command", icon: I.CommandIcon },
  ] satisfies Array<{ name: string; icon: IconComponent }>,
  defaultSelected: "camera",
};

/* --------------------------- Proof + maker story ------------------------- */


export const story = {
  title: "Why I made FM Icons",
  // PLACEHOLDER story: rewrite these paragraphs in your own words
  paragraphs: [
    "I was an icon hoarder. Thousands of SVGs across a dozen sets, and finding the right one took longer every week.",
    "So I gathered one set, gave every icon eight styles, and made it searchable in a single place.",
    "Then I gave it away. FM Icons is free and open source, so you can use it in anything you build, and help make it better.",
  ],
  makers: [{ name: "Prashant Sharma", role: "Maker", initial: "P", emoji: "🧑‍💻", colors: ["#ffd29a", "#ff8f6b"] as const }],
  ps: "P.S. Missing an icon? Open an issue on GitHub and tell me which one.",
};

/* -------------------------------- Features ------------------------------- */

export const features = {
  title: "All the icon basics, and a lot more",
  intro: {
    text: "Fast search, eight styles, live recolouring, and code for every framework you use. All of it free and open source.",
    link: { label: "Browse the icons", href: "/icons" },
  },
  cards: {
    styles: {
      title: `${spelled(STYLES)} styles of every icon`,
      description: "Linear, bold, twotone, bulk, outline, broken, glass and duotone. Switch with one key.",
    },
    ai: {
      title: "Made for AI coding tools",
      description: "Ask your assistant for an icon and it imports the package",
      chat: {
        me: "Add a lock icon to the login button",
        ai: "Added <Lock /> from @fmicons/react",
      },
    },
    recolor: {
      title: "Recolour in one click",
      description: "Pick a brand colour and copy the icon already tinted, light or dark.",
    },
    search: {
      title: "Search that knows what you mean",
      description: "Type “money” and get wallets, cards and coins, in every style.",
      query: "money",
      tags: ["wallet", "payment", "finance", "card"],
    },
    export: {
      title: "Export to any format",
      description: "One click to SVG, PNG or ready code for your framework.",
      formats: ["SVG", "PNG", "React", "Vue", "Svelte", "React Native", "Angular", "Flutter"],
    },
    native: {
      title: "Open source on GitHub",
      description: "MIT licensed packages for React, Vue, Svelte and React Native. Fork it and send a pull request.",
    },
  },
  tiles: [
    { icon: I.SearchNormalTwotoneIcon, color: "blue", title: "Instant search", description: "Find any icon by name or category, in every style at once." },
    { icon: I.MagicpenTwotoneIcon, color: "purple", title: "Eight styles, one shape", description: "Linear for idle, bold for active: every icon matches itself." },
    { icon: I.HeartTwotoneIcon, color: "pink", title: "Free forever", description: "MIT licence. No sign-up, no account, no paywall." },
    { icon: I.MouseTwotoneIcon, color: "orange", title: "Copy or download", description: "SVG, PNG or WebP at any size from 16 to 512 px." },
    { icon: I.CodeTwotoneIcon, color: "green", title: "Packages for your stack", description: "React, Vue, Svelte and React Native, tree-shakeable and typed.", badge: "New" },
    { icon: I.CloudChangeTwotoneIcon, color: "teal", title: "CDN ready", description: "Link any icon straight from jsDelivr, no install needed." },
  ] satisfies Array<{ icon: IconComponent; color: PaletteColor; title: string; description: string; badge?: string }>,
  more: { label: `Browse all ${TOTAL} icons`, href: "/icons" },
};

/* -------------------------------- Sampler -------------------------------- */

// The same icons in four styles, side by side.
export const sampler = {
  title: "Sampler",
  sub: `A taste of four of the ${STYLES} styles. Click any icon to customise it.`,
  hint: "Point at an icon to see its name",
  styles: ["linear", "bold", "duotone", "glass"] satisfies IconStyle[] as IconStyle[],
  count: 20,
  // One line on what makes each style different
  traits: {
    linear: "Rounded 1.5px strokes",
    outline: "Outlined shapes",
    bold: "Solid filled shapes",
    bulk: "Solid with a soft layer",
    twotone: "Strokes in two tones",
    broken: "Strokes with playful gaps",
    glass: "Frosted, glossy 3D",
    duotone: "Line over a soft fill",
  } satisfies Record<IconStyle, string>,
  viewAll: "View all",
};

/* ---------------------------------- FAQ ---------------------------------- */

export const faq = {
  title: "Questions, answered",
  items: [
    {
      q: "Is FM Icons really free?",
      a: `Yes. All ${TOTAL} icons in all ${STYLES} styles are free for personal and commercial work, including client projects and apps you sell. There is no paid tier and no sign-up.`,
    },
    {
      q: "What licence is it under?",
      a: "The code and packages are MIT licensed. The icon artwork comes from the 7000 Free UI Icons Figma file by Cristian Muñoz and is shared with credit. Keep the LICENSE notice when you redistribute the files.",
    },
    {
      q: "How do I add the icons to my project?",
      a: "Install the package for your framework, for example npm i @fmicons/react, then import icons by name. You can also copy any icon as SVG or link it from the CDN.",
    },
    {
      q: "Which frameworks are supported?",
      a: "React, Vue, Svelte and React Native have packages. Plain JavaScript works through @fmicons/core, and every icon page also gives ready code for Angular and Flutter.",
    },
    {
      q: "Can I change the colour and stroke weight?",
      a: "Yes. Every package takes size, color and variant props, and the line styles take strokeWidth too. In the browser you can tweak all of it live and copy the result.",
    },
    {
      q: "Do I have to credit FM Icons?",
      a: "Not in your app's interface. If you redistribute the icon files themselves, keep the licence notice. A link back or a GitHub star is always appreciated.",
    },
    {
      q: "Can I contribute or request an icon?",
      a: "Please do. Open an issue on GitHub to request an icon or report a problem, or send a pull request.",
    },
  ],
};

/* ------------------------------ Closing CTA ------------------------------ */

export const closingCta = {
  title: "Find the right icon, every time.",
  text: `${TOTAL} free, open-source icons in ${STYLES} styles. Use them anywhere.`,
  primary: { label: `Browse ${TOTAL} icons`, href: "/icons" },
  secondary: { label: "Star on GitHub", href: REPO },
};

/* --------------------------------- Footer -------------------------------- */

export const footer = {
  tagline: `${TOTAL} free, open-source icons in ${STYLES} styles. Made for designers and developers who ship.`,
  install: "npm i @fmicons/react",
  columns: [
    {
      title: "Icons",
      links: [
        { label: "Browse all icons", href: "/icons" },
        { label: "Linear icons", href: "/icons" },
        { label: "Bold icons", href: "/icons/bold" },
        { label: "Glass icons", href: "/icons/glass" },
        { label: "Duotone icons", href: "/icons/duotone" },
      ],
    },
    {
      title: "Docs",
      links: [
        { label: "Introduction", href: "/docs" },
        { label: "React", href: "/docs/react" },
        { label: "Vue", href: "/docs/vue" },
        { label: "Svelte", href: "/docs/svelte" },
        { label: "Raw SVGs and CDN", href: "/docs/svg" },
      ],
    },
    {
      title: "Open source",
      links: [
        { label: "GitHub", href: REPO, external: true },
        { label: "Request an icon", href: `${REPO}/issues`, external: true },
        { label: "Contribute", href: `${REPO}/pulls`, external: true },
        { label: "MIT licence", href: `${REPO}/blob/main/LICENSE`, external: true },
        { label: "FAQ", href: "/#faq" },
      ],
    },
  ] satisfies Array<{ title: string; links: Array<{ label: string; href: string; external?: boolean }> }>,
  madeBy: "Made by Prashant Sharma, who loves icons.",
  copyright: `© ${new Date().getFullYear()} FM Icons · MIT licence`,
};
