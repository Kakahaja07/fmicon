# FM Icons

891 free, open-source icons in 8 styles: linear, outline, bold, bulk, twotone, broken, glass and duotone. Every icon is drawn on a 24 by 24 grid and recolours with `currentColor`, so it picks up your text colour.

Browse, search and copy them at [fmicons.app](https://fmicons.app).

## Packages

| Package | For | Install |
|---|---|---|
| [`@fmicons/react`](packages/react) | React 17+ | `npm install @fmicons/react` |
| [`@fmicons/vue`](packages/vue) | Vue 3 | `npm install @fmicons/vue` |
| [`@fmicons/svelte`](packages/svelte) | Svelte 4 and 5 | `npm install @fmicons/svelte` |
| [`@fmicons/react-native`](packages/react-native) | React Native | `npm install @fmicons/react-native react-native-svg` |
| [`@fmicons/core`](packages/core) | Plain JavaScript, any framework | `npm install @fmicons/core` |
| [`@fmicons/svg`](packages/svg) | Raw SVG files | `npm install @fmicons/svg` |

Each icon is its own module, so bundlers only keep the icons you import. All packages ship TypeScript types.

## Usage

Every package takes the same options: `size` (default `24`), `variant` (default `linear`), `color` and `strokeWidth`. The variants are `linear`, `outline`, `bold`, `bulk`, `twotone`, `broken`, `glass`, `glass-light` and `duotone`. `glass` suits dark backgrounds and `glass-light` suits light ones. `strokeWidth` applies to the line styles: linear, twotone, broken and duotone.

Component names are the PascalCase of the icon slug (`arrow-circle-right` is `ArrowCircleRight`), and each is also exported with an `Icon` suffix (`LockIcon`) for when a name clashes with a global such as `Map`.

### React

```jsx
import { Lock } from "@fmicons/react";

<Lock size={24} variant="bold" color="#1265ec" strokeWidth={1} />
```

### Vue

```vue
<script setup>
import { Lock } from "@fmicons/vue";
</script>

<template>
  <Lock :size="24" variant="bold" />
</template>
```

### Svelte

```svelte
<script>
  import { Icon } from "@fmicons/svelte";
  import { lock } from "@fmicons/core";
</script>

<Icon icon={lock} size={24} variant="bold" />
```

### React Native

```jsx
import { Lock } from "@fmicons/react-native";

<Lock size={24} variant="bold" color="#1265ec" />
```

### Plain JavaScript

```js
import { lock, toSvg } from "@fmicons/core";

el.innerHTML = toSvg(lock, { size: 24, variant: "bold" });
```

### CDN

No install needed. Swap the style folder and slug for the icon you want:

```html
<img src="https://cdn.jsdelivr.net/gh/Kakahaja07/fmicons@main/packages/svg/icons/linear/lock.svg" width="24" height="24" alt="Lock" />
```

An SVG loaded through `<img>` cannot inherit your text colour, so it draws in black. Use one of the packages, or inline the SVG, when you need to recolour it.

## Building the packages

The packages are generated from the icon data in `src/content/free-icons/` by one script:

```sh
npm run packages
```

It writes the SVG files to `packages/svg/icons/` (committed, they serve the CDN), the JavaScript and typings to `packages/<name>/dist/` (git-ignored), and each package's `package.json` and `README.md`. Hand-written runtime code lives in `packages/<name>/runtime/` and is copied into `dist`. Change package metadata or READMEs in `scripts/build-packages.mjs`, not in the generated files.

## Contributing

Issues and pull requests are welcome at [github.com/Kakahaja07/fmicons](https://github.com/Kakahaja07/fmicons). For a bug in an icon, name the icon slug and style. For code changes, run `npm run packages` and check the output before you open a pull request.

## Licence and attribution

The code is MIT licensed. The base icon shapes come from the "7000 FREE UI ICONS" Figma Community file by Cristian Muñoz and are redistributed with attribution; the glass and duotone styles are derived from it in this project. Keep the notice in [LICENSE](LICENSE) when you redistribute the icons.

## Working on the website

The site at fmicons.app lives in this repository too: TanStack Start + React + CSS Modules. Every page is prerendered to static HTML at build time.

Pages: `/` (landing) and `/icons` (icon browser: search, recolour, copy as SVG or React).

```
npm install
npm run dev         # http://localhost:3000
npm run build       # static site in dist/client
npm run icons       # regenerate UI icons from the FMUI 7000 library
npm run free-icons  # rebuild src/content/free-icons from the source artwork (FMUI_LIB; FREE_LIMIT=99 for a small set)
npm run packages    # rebuild the packages in packages/
```

`npm run icons` and `npm run free-icons` read the original artwork from a local folder (see the paths at the top of each script), so most contributors only need `dev`, `build` and `packages`.

### Where to change things

| You want to change… | Edit |
|---|---|
| Brand colour, any colour, fonts, weights, radii, shadows, motion (the site is dark-only; dark values are the `[data-theme="dark"]` block) | `src/styles/tokens.css` (change `--brand` to re-brand everything) |
| Any text, link or FAQ | `src/content/site.ts` |
| Icons in use | add the name to `scripts/sync-icons.mjs`, run `npm run icons` |
| Page order | `src/routes/_site.index.tsx` |
| Icon page copy | `iconTool` in `src/content/site.ts` |
| Which icons are built | `scripts/build-free-icons.mjs`, then `npm run free-icons` |
| Packages (metadata, READMEs, generated code) | `scripts/build-packages.mjs` and `packages/<name>/runtime/`, then `npm run packages` |

### Structure

```
src/
  routes/          __root.tsx (document, meta) · _site.tsx (header/footer layout) · _site.index.tsx (home)
                   icons.index.tsx · icons.$style.index.tsx · icons.$style.$slug.tsx (icon browser and icon pages)
  content/         site.ts (all copy and data) · iconArticle.ts (shared icon page copy) · freeIcons.meta.ts (generated)
                   free-icons/ (generated icon data, one JSON per style) · icon-articles/ (generated, one per curated icon)
  styles/          tokens.css (design tokens) · global.css (reset, base, fonts)
  components/
    ui/            reusable pieces: Button, Tabs, CodeBlock, CommandLine, FrameworkLogo, Segmented, Slider, Switch, ...
    sections/      SiteHeader, Hero, StatsBand, AppWindow, Features, Sampler, OpenSource, OpenSourcePanel,
                   MakerNote, Faq, ClosingCta, SiteFooter
      icons/       ToolBar, IconBrowser, IconSidebar, IconGrid, IconDetail, IconArticle
    art/           bento card illustrations
    icons/         generated FMUI icon components (don't edit by hand)
  hooks/           useInView, useActiveSection, useScrolled, useIconStyle, useToolTheme
  lib/             cx, palette, svg, packages, iconSeo, iconArticle
packages/          npm packages (see "Building the packages")
scripts/           generators: sync-icons, build-free-icons, build-icon-articles, build-packages
scripts/data/      keyword plan and article text for the icon pages
```