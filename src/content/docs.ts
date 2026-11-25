/* ==========================================================================
   Docs copy: /docs and /docs/<framework>.
   Each framework page is built from the same sections, written in that
   framework's own syntax, so the guides stay consistent everywhere.
   ========================================================================== */

import type { Framework } from "~/lib/svg";
import { freeIconsMeta } from "./freeIcons.meta";
import { openSource } from "./site";

const TOTAL = freeIconsMeta.total;
const STYLES = freeIconsMeta.styles.length;

export type DocId = "vanilla" | "react" | "react-native" | "vue" | "svelte" | "angular" | "flutter" | "svg";

export type DocCode = { title: string; code: string };
export type DocSection = {
  id: string;
  title: string;
  /** Paragraphs; `code` spans are written with backticks */
  text?: string[];
  list?: string[];
  code?: DocCode[];
  tip?: string;
  /** A built-in block rendered by the page */
  block?: "install" | "props" | "styles" | "performance";
};

export type DocPage = {
  id: DocId;
  label: string;
  /** Logo on tabs and cards */
  logo: Framework;
  /** npm packages to install (none for copy-paste frameworks) */
  install?: string[];
  /** Install command outside npm, e.g. Flutter */
  installCommand?: string;
  description: string;
  sections: DocSection[];
};

/* ---------------------------- Syntax per framework ---------------------------- */

type Props = { size?: number; variant?: string; color?: string; strokeWidth?: number; extra?: string };

/** One icon in a framework's syntax, e.g. `<Home size={24} />` or `<Home :size="24" />`. */
function tag(fw: DocId, name: string, p: Props = {}) {
  const data = name[0].toLowerCase() + name.slice(1);
  const parts: string[] = [];
  const num = (k: string, v: number) => (fw === "vue" ? `:${k}="${v}"` : `${k}={${v}}`);
  if (p.size !== undefined) parts.push(num("size", p.size));
  if (p.variant) parts.push(`variant="${p.variant}"`);
  if (p.color) parts.push(`color="${p.color}"`);
  if (p.strokeWidth !== undefined) parts.push(num(fw === "vue" ? "stroke-width" : "strokeWidth", p.strokeWidth));
  if (p.extra) parts.push(p.extra);
  const attrs = parts.length ? " " + parts.join(" ") : "";
  if (fw === "svelte") return `<Icon icon={${data}}${attrs} />`;
  return `<${name}${attrs} />`;
}

/** Options object for @fmicons/core, e.g. `toSvg(home, { size: 24 })`. */
function js(name: string, p: Props = {}) {
  const data = name[0].toLowerCase() + name.slice(1);
  const parts: string[] = [];
  if (p.size !== undefined) parts.push(`size: ${p.size}`);
  if (p.variant) parts.push(`variant: "${p.variant}"`);
  if (p.color) parts.push(`color: "${p.color}"`);
  if (p.strokeWidth !== undefined) parts.push(`strokeWidth: ${p.strokeWidth}`);
  return `toSvg(${data}${parts.length ? `, { ${parts.join(", ")} }` : ""})`;
}

const pkgOf: Partial<Record<DocId, string>> = {
  vanilla: "@fmicons/core",
  react: "@fmicons/react",
  "react-native": "@fmicons/react-native",
  vue: "@fmicons/vue",
  svelte: "@fmicons/svelte",
};

/** Import line for some icons in a framework. */
function imports(fw: DocId, names: string[]) {
  const data = names.map((n) => n[0].toLowerCase() + n.slice(1));
  if (fw === "svelte") return `import { Icon } from "@fmicons/svelte";\nimport { ${data.join(", ")} } from "@fmicons/core";`;
  if (fw === "vanilla") return `import { ${data.join(", ")}, toSvg } from "@fmicons/core";`;
  return `import { ${names.join(", ")} } from "${pkgOf[fw]}";`;
}

/** A few icons inside a component, in the framework's own file format. */
function component(fw: DocId, names: string[], body: string[]) {
  const lines = body.map((l) => "      " + l).join("\n");
  switch (fw) {
    case "vue":
      return `<script setup>\n${imports(fw, names)}\n</script>\n\n<template>\n  <nav class="toolbar">\n${body.map((l) => "    " + l).join("\n")}\n  </nav>\n</template>`;
    case "svelte":
      return `<script>\n  ${imports(fw, names).replace(/\n/g, "\n  ")}\n</script>\n\n<nav class="toolbar">\n${body.map((l) => "  " + l).join("\n")}\n</nav>`;
    case "react-native":
      return `${imports(fw, names)}\nimport { View } from "react-native";\n\nexport default function Toolbar() {\n  return (\n    <View style={{ flexDirection: "row", gap: 16 }}>\n${lines}\n    </View>\n  );\n}`;
    default:
      return `${imports(fw, names)}\n\nexport default function Toolbar() {\n  return (\n    <nav className="toolbar">\n${lines}\n    </nav>\n  );\n}`;
  }
}

/* ------------------------------- Shared sections ------------------------------ */

function packageSections(fw: DocId, label: string): DocSection[] {
  const pkg = pkgOf[fw]!;
  const file = fw === "vue" ? "App.vue" : fw === "svelte" ? "App.svelte" : fw === "vanilla" ? "main.js" : "App.jsx";
  const classAttr = fw === "react" || fw === "react-native" ? "className" : "class";
  const sections: DocSection[] = [
    {
      id: "installation",
      title: "Installation",
      text: ["Install the package with your package manager."],
      block: "install",
    },
    {
      id: "usage",
      title: "Basic usage",
      text:
        fw === "vanilla"
          ? ["Every icon is exported as data. `toSvg` turns it into an SVG string you can put anywhere in the page."]
          : fw === "svelte"
            ? ["Svelte uses one `Icon` component. Pass it any icon from `@fmicons/core`."]
            : [`Import icons by their PascalCase name from \`${pkg}\`. Each icon is a ${label} component.`],
      code: [
        fw === "vanilla"
          ? { title: file, code: `${imports(fw, ["Home", "Notification", "Lock"])}\n\ndocument.querySelector("#home").innerHTML = ${js("Home", { size: 24 })};\ndocument.querySelector("#alerts").innerHTML = ${js("Notification", { size: 24, variant: "bold" })};\ndocument.querySelector("#lock").innerHTML = ${js("Lock", { size: 24, color: "#1265ec" })};` }
          : { title: file, code: component(fw, ["Home", "Notification", "Lock"], [tag(fw, "Home", { size: 24 }), tag(fw, "Notification", { size: 24, variant: "bold" }), tag(fw, "Lock", { size: 24, color: "#1265ec" })]) },
      ],
    },
    {
      id: "customising",
      title: "Customising icons",
      text: ["Every icon takes the same options for size, style, colour and stroke weight."],
      code: [
        {
          title: "Options",
          code:
            fw === "vanilla"
              ? `// Size\n${js("Home", { size: 16 })}\n${js("Home", { size: 32 })}\n\n// Style\n${js("Star")}                       // linear (default)\n${js("Star", { variant: "bold" })}\n${js("Star", { variant: "duotone" })}\n\n// Colour\n${js("Heart", { color: "#ff383c" })}\n\n// Stroke weight (line styles)\n${js("Home", { strokeWidth: 1 })}`
              : `// Size\n${tag(fw, "Home", { size: 16 })}\n${tag(fw, "Home", { size: 32 })}\n\n// Style\n${tag(fw, "Star")}                       // linear (default)\n${tag(fw, "Star", { variant: "bold" })}\n${tag(fw, "Star", { variant: "duotone" })}\n\n// Colour\n${tag(fw, "Heart", { color: "#ff383c" })}\n\n// Stroke weight (line styles)\n${tag(fw, "Home", { strokeWidth: 1 })}`,
        },
      ],
    },
  ];

  if (fw !== "svelte") {
    const direct = fw === "vanilla" ? `import { home } from "@fmicons/core/icons/home";\nimport { lock } from "@fmicons/core/icons/lock";` : `import { Home } from "${pkg}/icons/home";\nimport { Lock } from "${pkg}/icons/lock";`;
    sections.push({
      id: "direct-imports",
      title: "Direct imports",
      text: ["Each icon also lives in its own module, named after its slug. Importing from there keeps only that one icon in your bundle, even without tree-shaking."],
      code: [{ title: "Direct import", code: direct }],
      tip: "Named imports from the main entry are tree-shaken by Vite, webpack and Rollup too. Direct imports are a guarantee for setups that don't tree-shake.",
    });
  }

  if (fw !== "vanilla") {
    sections.push({
      id: "example",
      title: "Full example",
      text: [`A small toolbar with a few icons in different styles.`],
      code: [
        {
          title: "Complete example",
          code: component(fw, ["Home", "SearchNormal", "Notification", "Heart", "Setting"], [
            tag(fw, "Home", { size: 20 }),
            tag(fw, "SearchNormal", { size: 20 }),
            tag(fw, "Notification", { size: 20, variant: "bold" }),
            tag(fw, "Heart", { size: 20, variant: "bold", color: "#ff383c" }),
            tag(fw, "Setting", { size: 20, strokeWidth: 1 }),
          ]),
        },
      ],
      tip: fw === "react" ? "Icons render plain SVG, so they work with server rendering in Next.js, Remix and TanStack Start." : undefined,
    });
  }

  sections.push(
    {
      id: "props",
      title: fw === "vanilla" ? "Options" : "Props",
      text: [fw === "vanilla" ? "Everything `toSvg` accepts." : `Everything an icon accepts. Other ${fw === "react-native" ? "props" : "SVG attributes"} are passed straight through.`],
      block: "props",
    },
    {
      id: "styles",
      title: "Styles",
      text: [`Every icon comes in ${STYLES} styles. Pick one with \`variant\`; the shape stays the same, so switching never shifts your layout.`],
      block: "styles",
      code: [
        {
          title: "Using styles",
          code:
            fw === "vanilla"
              ? `${js("Home")}  // linear\n${js("Home", { variant: "bold" })}\n${js("Home", { variant: "glass" })}\n${js("Home", { variant: "glass-light" })}  // glass for light backgrounds`
              : `${tag(fw, "Home")}  {/* linear */}\n${tag(fw, "Home", { variant: "bold" })}\n${tag(fw, "Home", { variant: "glass" })}\n${tag(fw, "Home", { variant: "glass-light" })}  {/* glass for light backgrounds */}`,
        },
      ],
      tip: "A common pattern: linear for idle tabs and bold for the selected one.",
    },
    {
      id: "styling",
      title: "Styling and colour",
      text: [
        "Icons draw with `currentColor`, so with no colour set they take the text colour of their parent. That makes hover states, dark mode and theme colours work without extra code.",
      ],
      list: [
        "Inherit the parent's text colour (the default)",
        "Pass any hex, RGB, HSL or CSS variable as the colour",
        "Change the stroke weight on line styles: 1 thin, 1.5 default, 2 bold",
        `Add classes with \`${classAttr}\`, including Tailwind utilities`,
      ],
      code: [
        {
          title: "Colour",
          code:
            fw === "vanilla"
              ? `// Inherits the colour of #toolbar\ndocument.querySelector("#toolbar").style.color = "#1265ec";\n\n${js("Home", { color: "#1265ec" })}\n${js("Home", { color: "var(--brand)" })}`
              : fw === "react-native"
                ? `${tag(fw, "Home", { color: "#1265ec" })}\n${tag(fw, "Home", { color: "rgb(52, 199, 89)" })}`
                : `${tag(fw, "Home", { color: "#1265ec" })}\n${tag(fw, "Home", { color: "var(--brand)" })}\n${tag(fw, "Home", { extra: `${classAttr}="text-blue-500 hover:text-blue-600"` })}`,
        },
      ],
      tip: fw === "react-native" ? "React Native has no inherited text colour, so icons default to black. Pass `color` to match your theme." : "Glass icons keep their own colours, so `color` doesn't change them. Use glass-light on light backgrounds.",
    },
    {
      id: "accessibility",
      title: "Accessibility",
      text: [
        fw === "vanilla"
          ? "SVGs from `toSvg` are hidden from screen readers unless you pass a `title`, which adds a `<title>` and `role=\"img\"`."
          : "Icons are hidden from screen readers (`aria-hidden`) unless you give them a name with `title` or `aria-label`.",
      ],
      code:
        fw === "vanilla"
          ? [{ title: "Accessible icon", code: `button.innerHTML = ${js("Trash", { size: 20 })};\nbutton.setAttribute("aria-label", "Delete item");\n\n// An icon that carries meaning on its own\nstatus.innerHTML = toSvg(warning2, { size: 20, title: "Warning" });` }]
          : [
              {
                title: "Icon-only button",
                code:
                  fw === "react-native"
                    ? `<Pressable accessibilityLabel="Delete item">\n  ${tag(fw, "Trash", { size: 20 })}\n</Pressable>`
                    : fw === "vue"
                      ? `<button aria-label="Delete item">\n  ${tag(fw, "Trash", { size: 20 })}\n</button>`
                      : `<button aria-label="Delete item">\n  ${tag(fw, "Trash", { size: 20 })}\n</button>`,
              },
              { title: "Icon with meaning", code: tag(fw, "Warning2", { size: 20, color: "#ff383c", extra: 'title="Warning"' }) },
            ],
      tip: "Next to visible text, leave the icon unnamed: the text already says it, and screen readers won't read it twice.",
    },
    {
      id: "performance",
      title: "Performance",
      text: [`Packages are marked \`"sideEffects": false\` and every icon is its own module, so your bundle only gets the icons you import.`],
      code: [
        {
          title: "Imports",
          code: `// Good: only these icons end up in the bundle\n${imports(fw, ["Home", "Lock"])}\n\n// Avoid: pulls in all ${TOTAL} icons\nimport * as Icons from "${fw === "svelte" ? "@fmicons/core" : pkg}";`,
        },
      ],
      block: "performance",
    },
    {
      id: "typescript",
      title: "TypeScript",
      text: ["Types ship with every package. Icon names autocomplete, and so do the styles."],
      code: [
        {
          title: "Types",
          code:
            fw === "vanilla" || fw === "svelte"
              ? `import type { IconData, IconVariant } from "@fmicons/core";\n\nconst variant: IconVariant = "duotone";\nfunction render(icon: IconData) {\n  return toSvg(icon, { variant });\n}`
              : `import type { IconProps, IconVariant${fw === "react" ? ", FMIcon" : ""} } from "${pkg}";\n\nconst variant: IconVariant = "duotone";${fw === "react" ? `\n\nfunction NavItem({ icon: Icon, label }: { icon: FMIcon; label: string }) {\n  return <a><Icon size={20} variant={variant} /> {label}</a>;\n}` : ""}`,
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      text: ["Common problems and how to fix them. Not listed? Open an issue on GitHub."],
      code: [
        {
          title: "Icon name not found",
          code:
            fw === "vanilla" || fw === "svelte"
              ? `// Data exports are camelCase; reserved words get "Icon"\nimport { arrowCircleRight, exportIcon } from "@fmicons/core";`
              : `// Components are PascalCase of the icon's slug\nimport { ArrowCircleRight, SearchNormal } from "${pkg}";\n// Clashes with a global? Every icon also has an Icon suffix\nimport { MapIcon, ImageIcon } from "${pkg}";`,
        },
        {
          title: "Colour not changing",
          code:
            fw === "vanilla"
              ? `// Glass keeps its own colours; pick another style\n${js("Home", { variant: "bold", color: "#1265ec" })}`
              : `// Glass keeps its own colours; pick another style\n${tag(fw, "Home", { variant: "bold", color: "#1265ec" })}`,
        },
        {
          title: "Stroke weight has no effect",
          code: `// strokeWidth only applies to linear, twotone, broken and duotone\n${fw === "vanilla" ? js("Home", { variant: "linear", strokeWidth: 2 }) : tag(fw, "Home", { variant: "linear", strokeWidth: 2 })}`,
        },
      ],
    },
  );
  return sections;
}

/* ------------------------------------ Pages ----------------------------------- */

const packagePage = (id: DocId, label: string, logo: Framework, install: string[], description: string, list: string[]): DocPage => ({
  id,
  label,
  logo,
  install,
  description,
  sections: [{ id: "overview", title: label, text: [description, "What you can do:"], list }, ...packageSections(id, label)],
});

export const docPages: DocPage[] = [
  packagePage(
    "vanilla",
    "Vanilla JS / CDN",
    "js",
    ["@fmicons/core"],
    `The framework-free package. Every icon is plain data with a \`toSvg\` helper, so it works in any bundler, in Node, or straight from a CDN.`,
    ["Render any icon to an SVG string", "Pick size, style, colour and stroke weight", "Import only the icons you use", "Load files straight from the jsDelivr CDN, no install"],
  ),
  packagePage(
    "react",
    "React",
    "react",
    ["@fmicons/react"],
    `The React package. Import icons as components with full TypeScript support. Everything is tree-shakeable, so only the icons you use end up in your bundle.`,
    ["Import icons as individual React components", "Set size, style, colour and stroke weight with props", "Forward refs to the underlying SVG", "Use it in Next.js, Vite, Remix, TanStack Start and more"],
  ),
  packagePage(
    "react-native",
    "React Native",
    "react-native",
    ["@fmicons/react-native", "react-native-svg"],
    `The React Native package, rendered with react-native-svg. Same names and props as the React package, so code moves between web and mobile easily.`,
    ["Use the same icon names as on the web", "Works in Expo and bare React Native", "Set size, style, colour and stroke weight with props", "Name icons for VoiceOver and TalkBack with title"],
  ),
  packagePage(
    "vue",
    "Vue",
    "vue",
    ["@fmicons/vue"],
    `The Vue 3 package. Every icon is a component you can import by name and style with props, classes or your theme's text colour.`,
    ["Import icons as Vue components", "Bind size, style and colour like any prop", "Works with Nuxt, Vite and the Composition API", "Pass classes and attributes straight to the SVG"],
  ),
  packagePage(
    "svelte",
    "Svelte",
    "svelte",
    ["@fmicons/svelte", "@fmicons/core"],
    `The Svelte package: one \`Icon\` component that renders any icon from \`@fmicons/core\`. Works with Svelte 4 and 5 and SvelteKit.`,
    ["Render any icon with one component", "Set size, style, colour and stroke weight as props", "Import only the icon data you use", "Works with SvelteKit server rendering"],
  ),
  {
    id: "angular",
    label: "Angular",
    logo: "angular",
    description: "There's no Angular package yet. Every icon page gives you a ready standalone component to paste into your project.",
    sections: [
      { id: "overview", title: "Angular", text: ["There's no Angular package yet. Every icon page gives you a ready standalone component to paste into your project, with your size, colour and stroke weight already applied."] },
      { id: "usage", title: "Basic usage", text: ["Open any icon, choose the Angular tab and copy the component. Then import it where you need it."], code: [{ title: "home-icon.component.ts (from the icon page)", code: `import { Component, Input } from "@angular/core";\n\n@Component({\n  selector: "fm-home-icon",\n  standalone: true,\n  template: \`\n    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" [style.color]="color">\n      <!-- paths from the icon page -->\n    </svg>\n  \`,\n})\nexport class HomeIconComponent {\n  @Input() size = 24;\n  @Input() color = "currentColor";\n}` }, { title: "Using it", code: `@Component({\n  imports: [HomeIconComponent],\n  template: \`<fm-home-icon [size]="20" color="#1265ec" />\`,\n})\nexport class Toolbar {}` }] },
      { id: "cdn", title: "Without a component", text: ["For a quick prototype, link the SVG file from the CDN."], code: [{ title: "Template", code: `<img src="${openSource.cdn}/linear/home.svg" width="24" height="24" alt="Home" />` }] },
      { id: "styles", title: "Styles", text: [`Pick any of the ${STYLES} styles on the icon page before copying.`], block: "styles" },
      { id: "accessibility", title: "Accessibility", text: ["Add `aria-hidden=\"true\"` to the SVG when text sits next to it, and an `aria-label` on icon-only buttons."], code: [{ title: "Icon-only button", code: `<button aria-label="Delete item">\n  <fm-trash-icon aria-hidden="true" />\n</button>` }] },
    ],
  },
  {
    id: "flutter",
    label: "Flutter",
    logo: "flutter",
    installCommand: "flutter pub add flutter_svg",
    description: "Use FM Icons in Flutter through flutter_svg. Every icon page gives you a ready SvgPicture snippet.",
    sections: [
      { id: "overview", title: "Flutter", text: ["Use FM Icons in Flutter through flutter_svg. Every icon page gives you a ready `SvgPicture` snippet with your size and colour applied."] },
      { id: "installation", title: "Installation", text: ["Add flutter_svg to your app."], block: "install" },
      { id: "usage", title: "Basic usage", text: ["Copy the Flutter snippet from any icon page, or load the SVG from the CDN."], code: [{ title: "lib/icons.dart", code: `import 'package:flutter_svg/flutter_svg.dart';\n\nfinal homeIcon = SvgPicture.network(\n  '${openSource.cdn}/linear/home.svg',\n  width: 24,\n  height: 24,\n  colorFilter: const ColorFilter.mode(Color(0xFF1265EC), BlendMode.srcIn),\n);` }] },
      { id: "assets", title: "Bundling the files", text: ["For offline apps, download the SVGs you need into `assets/icons/` and load them with `SvgPicture.asset`."], code: [{ title: "pubspec.yaml", code: "flutter:\n  assets:\n    - assets/icons/" }, { title: "Widget", code: "SvgPicture.asset('assets/icons/home.svg', width: 24, height: 24)" }] },
      { id: "styles", title: "Styles", text: [`Every icon comes in ${STYLES} styles; change the folder in the URL to switch.`], block: "styles" },
    ],
  },
  {
    id: "svg",
    label: "Raw SVGs",
    logo: "cdn",
    install: ["@fmicons/svg"],
    description: "Every icon as a plain SVG file, for design tools, static sites, emails and anything without a build step.",
    sections: [
      { id: "overview", title: "Raw SVGs", text: [`All ${TOTAL} icons in all ${STYLES} styles are plain SVG files. Download them from any icon page, install them from npm, or link them from the CDN.`] },
      {
        id: "cdn",
        title: "CDN",
        text: [
          openSource.cdnLive
            ? "Every icon is served from cdn.fmicon.dev as SVG and as a 256px PNG. The URL is the format, the style, then the icon's slug."
            : "jsDelivr serves every file straight from the GitHub repo. The URL is the style, then the icon's slug.",
        ],
        code: [
          {
            title: "HTML",
            code:
              `<img src="${openSource.cdn}/linear/home.svg" width="24" height="24" alt="Home" />\n<img src="${openSource.cdn}/bold/heart.svg" width="24" height="24" alt="Favourite" />` +
              (openSource.cdnPng ? `\n\n<!-- PNG, 256 × 256 -->\n<img src="${openSource.cdnPng}/glass/status-up.png" width="64" height="64" alt="Status up" />` : ""),
          },
        ],
        tip: "An <img> can't take the page's text colour. To recolour, paste the SVG inline or use a package.",
      },
      { id: "installation", title: "Installation", text: ["The same files as an npm package, plus an `icons.json` index of names and categories."], block: "install" },
      { id: "files", title: "File layout", code: [{ title: "@fmicons/svg", code: "icons/\n  linear/home.svg\n  bold/home.svg\n  ...\n  glass/home.svg\n  glass-light/home.svg   // glass for light backgrounds\nicons.json              // slug, name, category for every icon" }] },
      { id: "styles", title: "Styles", text: [`${STYLES} styles, one folder each.`], block: "styles" },
      { id: "figma", title: "Design tools", text: ["Copy an icon as SVG from its page and paste it straight into Figma, Sketch, Framer or Illustrator. It arrives as editable vector paths."] },
    ],
  },
];

export const docsIntro = {
  title: "What is FM Icons?",
  text: [
    `FM Icons is a free, open-source library of ${TOTAL} UI icons, each drawn in ${STYLES} styles: linear, outline, bold, bulk, twotone, broken, glass and duotone.`,
    "There are packages for `@fmicons/react`, `@fmicons/react-native`, `@fmicons/vue`, `@fmicons/svelte` and `@fmicons/core` (vanilla JS), plus raw SVG files on a CDN and ready code for Angular and Flutter.",
    "Everything is MIT licensed, tree-shakeable and typed.",
  ],
  choose: "Choose an integration",
};

/** Left navigation: groups of links. Basics and guides jump to sections of the current framework page. */
export const docsNav = [
  { title: "Basics", links: [{ label: "Props", id: "props" }, { label: "Styles", id: "styles" }] },
  { title: "Guides", links: [{ label: "Styling and colour", id: "styling" }, { label: "Accessibility", id: "accessibility" }, { label: "Performance", id: "performance" }] },
  { title: "Advanced", links: [{ label: "TypeScript", id: "typescript" }, { label: "Troubleshooting", id: "troubleshooting" }] },
];

/** Props table rows. */
export const docsProps = [
  { prop: "size", type: "number | string", def: "24", text: "Width and height in pixels" },
  { prop: "variant", type: '"linear" | "outline" | "bold" | …', def: '"linear"', text: `Any of the ${STYLES} styles, plus "glass-light"` },
  { prop: "color", type: "string", def: "currentColor", text: "Any CSS colour; glass keeps its own" },
  { prop: "strokeWidth", type: "number | string", def: "1.5", text: "Line weight for linear, twotone, broken and duotone" },
  { prop: "title", type: "string", def: "–", text: "Accessible name; without it the icon is hidden from screen readers" },
];

export const docsPerformance = [
  { method: "@fmicons/react, /vue, /react-native", impact: "Only the icons you import", best: "Apps with a bundler" },
  { method: "…/icons/<slug>", impact: "Exactly one icon per import", best: "Setups without tree-shaking" },
  { method: "@fmicons/core + toSvg", impact: "Only the icons you import", best: "Vanilla JS, web components" },
  { method: "CDN <img>", impact: "Nothing in the bundle", best: "Static sites, prototypes, email" },
];
