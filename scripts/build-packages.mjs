// Builds the installable icon packages in packages/ from src/content/free-icons.
//
//   npm run packages
//
// Writes:
//   packages/svg/icons/<style>/<slug>.svg, packages/svg/icons.json   (committed, power the CDN)
//   packages/<pkg>/dist/**                                            (git-ignored build output)
//   packages/<pkg>/package.json, packages/<pkg>/README.md             (committed, generated here)
// Hand-written runtime code lives in packages/<pkg>/runtime/ and is copied into dist.

import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "src/content/free-icons");
const PACKAGES = join(ROOT, "packages");
const VERSION = "0.1.0";
const REPO = "https://github.com/Kakahaja07/fmicon";
const SITE = "https://fmicon.dev";
const CDN = "https://cdn.jsdelivr.net/gh/Kakahaja07/fmicon@main/packages/svg/icons";

// Variant order is the public order (types, docs, data objects).
const STYLES = ["linear", "outline", "bold", "bulk", "twotone", "broken", "glass", "glass-light", "duotone"];

// ---------------------------------------------------------------------------
// Load and check the source data

const sources = Object.fromEntries(
  STYLES.map((style) => [style, JSON.parse(readFileSync(join(SOURCE, `${style}.json`), "utf8")).icons]),
);
const base = sources.linear;
for (const style of STYLES) {
  const list = sources[style];
  if (list.length !== base.length) throw new Error(`${style}.json has ${list.length} icons, linear has ${base.length}`);
  list.forEach((icon, i) => {
    if (icon.slug !== base[i].slug) throw new Error(`${style}.json: icon ${i} is "${icon.slug}", expected "${base[i].slug}"`);
  });
}

const RESERVED = new Set(
  ("break case catch class const continue debugger default delete do else enum export extends false finally for " +
    "function if import in instanceof new null return super switch this throw true try typeof var void while with " +
    "yield let static implements interface package private protected public await arguments eval undefined").split(" "),
);

function pascalCase(slug) {
  const name = slug
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
  return /^\d/.test(name) ? `Icon${name}` : name;
}

function camelCase(slug) {
  const pascal = pascalCase(slug);
  const name = pascal[0].toLowerCase() + pascal.slice(1);
  return RESERVED.has(name) ? `${name}Icon` : name;
}

const icons = base.map((icon, i) => ({
  slug: icon.slug,
  name: icon.name,
  category: icon.category,
  component: pascalCase(icon.slug),
  data: camelCase(icon.slug),
  variants: Object.fromEntries(STYLES.map((style) => [style, sources[style][i].body])),
}));

for (const key of ["component", "data"]) {
  const seen = new Set();
  for (const icon of icons) {
    if (seen.has(icon[key])) throw new Error(`Duplicate ${key} name "${icon[key]}"`);
    seen.add(icon[key]);
  }
}

// ---------------------------------------------------------------------------
// Helpers

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function clean(path) {
  rmSync(path, { recursive: true, force: true });
}

function copyRuntime(pkg, files) {
  for (const [from, to] of files) copyFileSync(join(PACKAGES, from), join(PACKAGES, pkg, "dist", to));
}

function iconLiteral(icon) {
  const variants = STYLES.map((style) => `    ${JSON.stringify(style)}: ${JSON.stringify(icon.variants[style])},`).join("\n");
  return `{\n  name: ${JSON.stringify(icon.name)},\n  category: ${JSON.stringify(icon.category)},\n  variants: {\n${variants}\n  },\n}`;
}

function packageJson(pkg, fields) {
  const json = {
    name: `@fmicons/${pkg}`,
    version: VERSION,
    description: fields.description,
    keywords: ["icons", "svg", "fmicons", ...(fields.keywords ?? [])],
    license: "MIT",
    homepage: SITE,
    repository: { type: "git", url: `${REPO}.git`, directory: `packages/${pkg}` },
    bugs: { url: `${REPO}/issues` },
    type: "module",
    sideEffects: false,
    ...fields.entry,
    files: fields.files ?? ["dist"],
    ...(fields.dependencies && { dependencies: fields.dependencies }),
    ...(fields.peerDependencies && { peerDependencies: fields.peerDependencies }),
  };
  write(join(PACKAGES, pkg, "package.json"), `${JSON.stringify(json, null, 2)}\n`);
}

// Standard entry points for a package with dist/index.js and dist/icons/<slug>.js.
function iconEntries(extra = {}) {
  return {
    main: "./dist/index.js",
    module: "./dist/index.js",
    types: "./dist/index.d.ts",
    ...extra.fields,
    exports: {
      ".": { types: "./dist/index.d.ts", ...extra.conditions, default: "./dist/index.js" },
      ...extra.exports,
      "./icons/*": { types: "./dist/icons/*.d.ts", default: "./dist/icons/*.js" },
      "./package.json": "./package.json",
    },
  };
}

const variantList = STYLES.map((s) => `\`${s}\``).join(", ");

const variantsSection = `## Variants

${variantList}. The default is \`linear\`.

- \`linear\`, \`twotone\`, \`broken\` and \`duotone\` are line styles and accept \`strokeWidth\`.
- \`glass\` is tuned for dark backgrounds and \`glass-light\` for light ones. Both carry their own colours, so \`color\` has no effect on them.`;

const linksSection = `## Links

- Browse all ${icons.length} icons: ${SITE}/icons
- Source and issues: ${REPO}
- Licence: MIT for the code. The icon artwork comes with an attribution notice, see [LICENSE](${REPO}/blob/main/LICENSE).`;

const componentProps = (colorDefault) => `| Prop | Type | Default | Notes |
|---|---|---|---|
| \`size\` | \`number \\| string\` | \`24\` | Width and height |
| \`variant\` | \`IconVariant\` | \`"linear"\` | One of the styles below |
| \`color\` | \`string\` | ${colorDefault} | Replaces \`currentColor\` in the artwork |
| \`strokeWidth\` | \`number \\| string\` | \`1.5\` | Line styles only |
| \`title\` | \`string\` | none | Accessible name. Without it (or \`aria-label\`) the icon is \`aria-hidden\` |`;

const naming = `Component names are the PascalCase of the icon slug: \`home-2\` is \`Home2\`, \`arrow-circle-right\` is \`ArrowCircleRight\`, and slugs that start with a digit get an \`Icon\` prefix (\`3d-rotate\` is \`Icon3dRotate\`). Every icon is also exported with an \`Icon\` suffix (\`LockIcon\`) for when a name clashes with a global such as \`Map\` or \`Image\`.`;

// ---------------------------------------------------------------------------
// 1. @fmicons/svg

function buildSvg() {
  const pkg = "svg";
  const iconsDir = join(PACKAGES, pkg, "icons");
  clean(iconsDir);
  for (const style of STYLES) {
    for (const icon of icons) {
      write(
        join(iconsDir, style, `${icon.slug}.svg`),
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">${icon.variants[style]}</svg>\n`,
      );
    }
  }
  write(
    join(PACKAGES, pkg, "icons.json"),
    `${JSON.stringify(icons.map(({ slug, name, category }) => ({ slug, name, category })), null, 2)}\n`,
  );

  packageJson(pkg, {
    description: `${icons.length} FM Icons as plain SVG files in ${STYLES.length} styles.`,
    keywords: ["svg-icons"],
    files: ["icons", "icons.json"],
    entry: { exports: { "./icons/*": "./icons/*", "./icons.json": "./icons.json", "./package.json": "./package.json" } },
  });

  write(
    join(PACKAGES, pkg, "README.md"),
    `# @fmicons/svg

${icons.length} FM Icons as plain SVG files, one folder per style. Every file is a 24 by 24 SVG that uses \`currentColor\` (glass styles carry their own colours).

## Install

\`\`\`sh
npm install @fmicons/svg
\`\`\`

## Usage

Files live at \`@fmicons/svg/icons/<style>/<slug>.svg\`.

\`\`\`js
// With a bundler that imports SVG files as URLs (Vite, webpack asset modules)
import lockUrl from "@fmicons/svg/icons/linear/lock.svg";
\`\`\`

From the CDN, with no install:

\`\`\`html
<img src="${CDN}/linear/lock.svg" width="24" height="24" alt="Lock" />
\`\`\`

\`icons.json\` lists every icon with its \`slug\`, \`name\` and \`category\`.

${variantsSection.replace(" and accept `strokeWidth`", " (stroke width 1.5)").replace(", so `color` has no effect on them", "")}

${linksSection}
`,
  );
}

// ---------------------------------------------------------------------------
// 2. @fmicons/core

function buildCore() {
  const pkg = "core";
  const dist = join(PACKAGES, pkg, "dist");
  clean(dist);
  mkdirSync(dist, { recursive: true });
  copyRuntime(pkg, [
    ["core/runtime/render.js", "render.js"],
    ["core/runtime/render.d.ts", "render.d.ts"],
  ]);

  const indexJs = ['export { toSvg, iconBody, variants } from "./render.js";'];
  const indexDts = [
    'export { toSvg, iconBody, variants } from "./render.js";',
    'export type { IconData, IconVariant, IconBodyOptions, ToSvgOptions } from "./render.js";',
  ];
  const allImports = [];
  for (const icon of icons) {
    write(join(dist, "icons", `${icon.slug}.js`), `const icon = ${iconLiteral(icon)};\n\nexport { icon as ${icon.data} };\n`);
    write(
      join(dist, "icons", `${icon.slug}.d.ts`),
      `import type { IconData } from "../render.js";\ndeclare const icon: IconData;\nexport { icon as ${icon.data} };\n`,
    );
    const line = `export { ${icon.data} } from "./icons/${icon.slug}.js";`;
    indexJs.push(line);
    indexDts.push(line);
    allImports.push(`import { ${icon.data} } from "./icons/${icon.slug}.js";`);
  }
  write(join(dist, "index.js"), `${indexJs.join("\n")}\n`);
  write(join(dist, "index.d.ts"), `${indexDts.join("\n")}\n`);
  write(join(dist, "all.js"), `${allImports.join("\n")}\n\nexport const icons = [\n${icons.map((i) => `  ${i.data},`).join("\n")}\n];\n`);
  write(join(dist, "all.d.ts"), `import type { IconData } from "./render.js";\nexport declare const icons: IconData[];\n`);

  packageJson(pkg, {
    description: `${icons.length} FM Icons as framework-free data, plus a toSvg() helper.`,
    keywords: ["svg-icons", "vanilla-js"],
    entry: iconEntries({ exports: { "./all": { types: "./dist/all.d.ts", default: "./dist/all.js" } } }),
  });

  write(
    join(PACKAGES, pkg, "README.md"),
    `# @fmicons/core

${icons.length} FM Icons as plain data with no framework, plus helpers that turn them into SVG strings. The other FM Icons packages are built on the same data.

## Install

\`\`\`sh
npm install @fmicons/core
\`\`\`

## Usage

\`\`\`js
import { lock, toSvg } from "@fmicons/core";

el.innerHTML = toSvg(lock, { size: 24, variant: "bold" });
\`\`\`

Each icon is an object:

\`\`\`js
{ name: "lock", category: "security", variants: { linear: "<path …/>", outline: "…", … } }
\`\`\`

Export names are the camelCase of the slug: \`home-2\` is \`home2\`, \`arrow-circle-right\` is \`arrowCircleRight\`, slugs that start with a digit get an \`icon\` prefix (\`3d-rotate\` is \`icon3dRotate\`), and names that are reserved words get an \`Icon\` suffix (\`exportIcon\`, \`importIcon\`).

Need every icon, for a picker or search? Import the full list from a separate entry so the main one stays tree-shakeable:

\`\`\`js
import { icons } from "@fmicons/core/all";
\`\`\`

## API

### \`toSvg(icon, options?)\`

Returns a complete \`<svg>\` string.

| Option | Type | Default | Notes |
|---|---|---|---|
| \`size\` | \`number \\| string\` | \`24\` | Width and height |
| \`variant\` | \`IconVariant\` | \`"linear"\` | One of the styles below |
| \`color\` | \`string\` | \`currentColor\` | Replaces \`currentColor\` in the artwork |
| \`strokeWidth\` | \`number \\| string\` | \`1.5\` | Line styles only |
| \`title\` | \`string\` | none | Adds a \`<title>\` and \`role="img"\`. Without it the SVG is \`aria-hidden\` |
| \`attrs\` | \`object\` | none | Extra attributes for the \`<svg>\` tag, e.g. \`{ class: "icon" }\` |

### \`iconBody(icon, options?)\`

The inner markup only, with \`variant\`, \`color\`, \`strokeWidth\` and \`title\` applied. Useful when you build the \`<svg>\` element yourself.

### \`variants\`

The list of variant names.

${variantsSection}

${linksSection}
`,
  );
}

// ---------------------------------------------------------------------------
// 3-5. Component packages that share the per-icon layout (React, Vue, React Native)

function buildComponents(pkg, { description, keywords, peerDependencies, entryFields, readme }) {
  const dist = join(PACKAGES, pkg, "dist");
  clean(dist);
  mkdirSync(dist, { recursive: true });
  copyRuntime(pkg, [
    ["core/runtime/render.js", "render.js"],
    ["core/runtime/render.d.ts", "render.d.ts"],
    [`${pkg}/runtime/create-icon.js`, "create-icon.js"],
    [`${pkg}/runtime/create-icon.d.ts`, "create-icon.d.ts"],
  ]);

  const indexJs = [];
  const indexDts = ['export type { IconProps, IconVariant, FMIcon } from "./create-icon.js";'];
  for (const icon of icons) {
    const exports = `export { Icon as ${icon.component}, Icon as ${icon.component}Icon };\n`;
    write(
      join(dist, "icons", `${icon.slug}.js`),
      `import { createIcon } from "../create-icon.js";\n\nconst Icon = /*#__PURE__*/ createIcon(${JSON.stringify(icon.component)}, ${iconLiteral(icon)});\n\n${exports}`,
    );
    write(
      join(dist, "icons", `${icon.slug}.d.ts`),
      `import type { FMIcon } from "../create-icon.js";\ndeclare const Icon: FMIcon;\n${exports}`,
    );
    const line = `export { ${icon.component}, ${icon.component}Icon } from "./icons/${icon.slug}.js";`;
    indexJs.push(line);
    indexDts.push(line);
  }
  write(join(dist, "index.js"), `${indexJs.join("\n")}\n`);
  write(join(dist, "index.d.ts"), `${indexDts.join("\n")}\n`);

  packageJson(pkg, { description, keywords, peerDependencies, entry: iconEntries({ fields: entryFields }) });
  write(join(PACKAGES, pkg, "README.md"), readme);
}

function buildReact() {
  buildComponents("react", {
    description: `${icons.length} FM Icons as React components.`,
    keywords: ["react", "react-icons"],
    peerDependencies: { react: ">=17" },
    readme: `# @fmicons/react

${icons.length} FM Icons as React components, in ${STYLES.length} styles. Each icon is its own module, so your bundler only keeps the ones you import.

## Install

\`\`\`sh
npm install @fmicons/react
\`\`\`

## Usage

\`\`\`jsx
import { Lock } from "@fmicons/react";

<Lock size={24} variant="bold" color="#1265ec" strokeWidth={1} />
\`\`\`

${naming}

Icons forward their ref to the \`<svg>\` element and pass any other SVG props through (\`className\`, \`style\`, \`onClick\` and so on).

## Props

${componentProps("inherits text colour")}

${variantsSection}

${linksSection}
`,
  });
}

function buildVue() {
  buildComponents("vue", {
    description: `${icons.length} FM Icons as Vue 3 components.`,
    keywords: ["vue", "vue3", "vue-icons"],
    peerDependencies: { vue: ">=3" },
    readme: `# @fmicons/vue

${icons.length} FM Icons as Vue 3 components, in ${STYLES.length} styles. Each icon is its own module, so your bundler only keeps the ones you import.

## Install

\`\`\`sh
npm install @fmicons/vue
\`\`\`

## Usage

\`\`\`vue
<script setup>
import { Lock } from "@fmicons/vue";
</script>

<template>
  <Lock :size="24" variant="bold" color="#1265ec" />
</template>
\`\`\`

${naming}

Other attributes (\`class\`, \`style\`, listeners) are passed to the \`<svg>\` element.

## Props

${componentProps("inherits text colour")}

${variantsSection}

${linksSection}
`,
  });
}

function buildReactNative() {
  buildComponents("react-native", {
    description: `${icons.length} FM Icons as React Native components (react-native-svg).`,
    keywords: ["react-native", "react-native-svg"],
    peerDependencies: { react: ">=17", "react-native-svg": ">=12" },
    entryFields: { "react-native": "./dist/index.js" },
    readme: `# @fmicons/react-native

${icons.length} FM Icons as React Native components, in ${STYLES.length} styles. They render with \`SvgXml\` from [react-native-svg](https://github.com/software-mansion/react-native-svg).

## Install

\`\`\`sh
npm install @fmicons/react-native react-native-svg
\`\`\`

With Expo: \`npx expo install react-native-svg\`.

## Usage

\`\`\`jsx
import { Lock } from "@fmicons/react-native";

<Lock size={24} variant="bold" color="#1265ec" strokeWidth={1} />
\`\`\`

${naming}

Other props are passed to \`SvgXml\` (\`style\`, \`testID\` and so on).

## Props

${componentProps('`"black"`').replace("Accessible name. Without it (or `aria-label`) the icon is `aria-hidden`", "Sets `accessibilityLabel`")}

${variantsSection}

The glass styles use gradients, masks and blur filters. Check them on your target platforms, as react-native-svg support for filters depends on its version.

${linksSection}
`,
  });
}

// ---------------------------------------------------------------------------
// 6. @fmicons/svelte

function buildSvelte() {
  const pkg = "svelte";
  const dist = join(PACKAGES, pkg, "dist");
  clean(dist);
  mkdirSync(dist, { recursive: true });
  copyRuntime(pkg, [
    ["svelte/runtime/Icon.svelte", "Icon.svelte"],
    ["svelte/runtime/index.js", "index.js"],
    ["svelte/runtime/index.d.ts", "index.d.ts"],
  ]);

  packageJson(pkg, {
    description: `A Svelte component for the ${icons.length} FM Icons.`,
    keywords: ["svelte", "svelte-icons"],
    dependencies: { "@fmicons/core": `^${VERSION}` },
    peerDependencies: { svelte: "^4.0.0 || ^5.0.0" },
    entry: {
      svelte: "./dist/index.js",
      types: "./dist/index.d.ts",
      exports: {
        ".": { types: "./dist/index.d.ts", svelte: "./dist/index.js", default: "./dist/index.js" },
        "./package.json": "./package.json",
      },
    },
  });

  write(
    join(PACKAGES, pkg, "README.md"),
    `# @fmicons/svelte

One Svelte component that draws any of the ${icons.length} FM Icons. The icon data comes from [@fmicons/core](https://www.npmjs.com/package/@fmicons/core), which is installed with it and tree-shakes to the icons you import. Works with Svelte 4 and 5.

## Install

\`\`\`sh
npm install @fmicons/svelte
\`\`\`

## Usage

\`\`\`svelte
<script>
  import { Icon } from "@fmicons/svelte";
  import { lock } from "@fmicons/core";
</script>

<Icon icon={lock} size={24} variant="bold" color="#1265ec" />
\`\`\`

Icon data names are the camelCase of the slug (\`arrow-circle-right\` is \`arrowCircleRight\`). See the [@fmicons/core README](${REPO}/tree/main/packages/core) for the naming rules. Other attributes (\`class\`, \`style\`) are passed to the \`<svg>\` element.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| \`icon\` | \`IconData\` | required | An icon from \`@fmicons/core\` |
${componentProps("inherits text colour").split("\n").slice(2).join("\n")}

${variantsSection}

${linksSection}
`,
  );
}

// ---------------------------------------------------------------------------

function sizeOf(path) {
  if (!existsSync(path)) return { files: 0, bytes: 0 };
  const stat = statSync(path);
  if (stat.isFile()) return { files: 1, bytes: stat.size };
  let files = 0;
  let bytes = 0;
  for (const entry of readdirSync(path)) {
    const sub = sizeOf(join(path, entry));
    files += sub.files;
    bytes += sub.bytes;
  }
  return { files, bytes };
}

const started = Date.now();
buildSvg();
buildCore();
buildReact();
buildVue();
buildReactNative();
buildSvelte();

console.log(`Built ${icons.length} icons x ${STYLES.length} styles in ${((Date.now() - started) / 1000).toFixed(1)}s`);
for (const [pkg, dir] of [
  ["svg", "svg/icons"],
  ["core", "core/dist"],
  ["react", "react/dist"],
  ["vue", "vue/dist"],
  ["react-native", "react-native/dist"],
  ["svelte", "svelte/dist"],
]) {
  const { files, bytes } = sizeOf(join(PACKAGES, dir));
  console.log(`  @fmicons/${pkg.padEnd(13)} ${String(files).padStart(5)} files  ${(bytes / 1024 / 1024).toFixed(2)} MB  (${dir})`);
}
