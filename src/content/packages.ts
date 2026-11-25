import type { Framework } from "~/lib/svg";
import { CDN, REPO } from "./site";

/**
 * The /packages page. Each card links to its guide in /docs, so the guide stays the one
 * place to edit how a package is used. Bump VERSION when you publish (see scripts/build-packages.mjs).
 */
export const VERSION = "1.1.0";

export type PackageCard = {
  name: string;
  /** A framework logo, or "mcp" for the AI assistant logo */
  logo: Framework | "mcp";
  /** Guide link when it is not a docs page, e.g. /mcp */
  guide?: string;
  description: string;
  /** Docs page id: /docs/<doc> */
  doc: string;
  install?: string;
  /** Folder in packages/ on GitHub */
  source?: string;
  /** Published on npm */
  npm?: boolean;
  /** Shown instead of a version, e.g. for copy-paste snippets */
  badge?: string;
  /** Extra button, e.g. open the CDN */
  extra?: { label: string; href: string };
};

export const packagesPage = {
  title: "Packages",
  sub: "One icon set, ready for every stack. Install a package, read its guide, and ship.",
  sections: [
    {
      title: "Libraries & Frameworks",
      items: [
        {
          name: "fmicon",
          logo: "js",
          description: "The framework-free package: every icon as plain data with a toSvg() helper. Works in any bundler or in Node.",
          doc: "vanilla",
          install: "npm i fmicon",
          source: "core",
          npm: true,
        },
        {
          name: "fmicon-react",
          logo: "react",
          description: "React components for every icon. Tree-shakeable, typed, and works with Next.js, Vite and Remix.",
          doc: "react",
          install: "npm i fmicon-react",
          source: "react",
          npm: true,
        },
        {
          name: "fmicon-react-native",
          logo: "react-native",
          description: "React Native components built on react-native-svg. Works with Expo and bare React Native.",
          doc: "react-native",
          install: "npm i fmicon-react-native",
          source: "react-native",
          npm: true,
        },
        {
          name: "fmicon-vue",
          logo: "vue",
          description: "Vue 3 components for every icon. Tree-shakeable, typed, zero config. Works with Nuxt.",
          doc: "vue",
          install: "npm i fmicon-vue",
          source: "vue",
          npm: true,
        },
        {
          name: "fmicon-svelte",
          logo: "svelte",
          description: "One Svelte component for every icon, for Svelte 4 and 5. Works with SvelteKit.",
          doc: "svelte",
          install: "npm i fmicon-svelte",
          source: "svelte",
          npm: true,
        },
        {
          name: "fmicon-svg",
          logo: "cdn",
          description: "Every icon in every style as a plain SVG file, for design tools, static sites and build scripts.",
          doc: "svg",
          install: "npm i fmicon-svg",
          source: "svg",
          npm: true,
        },
      ],
    },
    {
      title: "Developer Tools",
      items: [
        {
          name: "fmicon-mcp",
          logo: "mcp",
          description: "Hosted MCP server for AI assistants. Claude, Cursor, VS Code and Codex search the icons and write the code for you.",
          doc: "vanilla",
          guide: "/mcp",
          install: "https://mcp.fmicon.dev/mcp",
          source: "mcp",
          badge: "Hosted",
        },
      ],
    },
    {
      title: "CDN & Snippets",
      items: [
        {
          name: "cdn.fmicon.dev",
          logo: "cdn",
          description: "Link any icon as SVG or a 256 px PNG straight from the CDN. Nothing to install, works in emails and no-code tools.",
          doc: "svg",
          badge: "SVG + PNG",
          extra: { label: "Open", href: `${CDN}/svg/linear/home.svg` },
        },
        {
          name: "Angular",
          logo: "angular",
          description: "No package needed yet. Every icon page gives you a ready standalone component to paste in.",
          doc: "angular",
          badge: "Copy & paste",
        },
        {
          name: "Flutter",
          logo: "flutter",
          description: "Use any icon through flutter_svg. Every icon page gives you a ready SvgPicture snippet.",
          doc: "flutter",
          badge: "Copy & paste",
        },
      ],
    },
  ] as Array<{ title: string; items: PackageCard[] }>,
};

export const sourceUrl = (folder: string) => `${REPO}/tree/main/packages/${folder}`;
export const npmUrl = (name: string) => `https://www.npmjs.com/package/${name}`;
