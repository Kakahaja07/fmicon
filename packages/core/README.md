<div align="center">

<a href="https://fmicon.dev"><img src="https://raw.githubusercontent.com/Kakahaja07/fmicon/main/.github/assets/wordmark-light.png" width="260" alt="fmicon"></a>

### Free icons for any JavaScript project

<a href="https://www.npmjs.com/package/fmicon"><img src="https://img.shields.io/npm/v/fmicon?style=flat-square&color=1e8cff&label=npm" alt="npm version"></a>
<a href="https://www.npmjs.com/package/fmicon"><img src="https://img.shields.io/npm/dm/fmicon?style=flat-square&color=2b2b2f" alt="downloads"></a>
<a href="https://github.com/Kakahaja07/fmicon/blob/main/LICENSE"><img src="https://img.shields.io/badge/licence-MIT-22c55e?style=flat-square" alt="MIT licence"></a>

**[Website](https://fmicon.dev)** · **[Browse icons](https://fmicon.dev/icons)** · **[Docs](https://fmicon.dev/docs/vanilla)** · **[GitHub](https://github.com/Kakahaja07/fmicon)**

<img src="https://raw.githubusercontent.com/Kakahaja07/fmicon/main/.github/assets/showcase-light.png" width="640" alt="fmicon icons in the linear, bold, duotone and glass styles">

</div>

fmicon is a free, open-source set of 996 icons, each drawn in 8 styles. Use them in personal and commercial projects. No sign-up, and no credit needed in your app.

996 icons as plain data with no framework, plus helpers that turn them into SVG strings. The other fmicon packages are built on the same data.

## Install

```sh
npm install fmicon
```

## Usage

```js
import { lock, toSvg } from "fmicon";

el.innerHTML = toSvg(lock, { size: 24, variant: "bold" });
```

Each icon is an object:

```js
{ name: "lock", category: "security", variants: { linear: "<path …/>", outline: "…", … } }
```

Export names are the camelCase of the slug: `home-2` is `home2`, `arrow-circle-right` is `arrowCircleRight`, slugs that start with a digit get an `icon` prefix (`3d-rotate` is `icon3dRotate`), and names that are reserved words get an `Icon` suffix (`exportIcon`, `importIcon`).

Need every icon, for a picker or search? Import the full list from a separate entry so the main one stays tree-shakeable:

```js
import { icons } from "fmicon/all";
```

## API

### `toSvg(icon, options?)`

Returns a complete `<svg>` string.

| Option | Type | Default | Notes |
|---|---|---|---|
| `size` | `number \| string` | `24` | Width and height |
| `variant` | `IconVariant` | `"linear"` | One of the styles below |
| `color` | `string` | `currentColor` | Replaces `currentColor` in the artwork |
| `strokeWidth` | `number \| string` | `1.5` | Line styles only |
| `title` | `string` | none | Adds a `<title>` and `role="img"`. Without it the SVG is `aria-hidden` |
| `attrs` | `object` | none | Extra attributes for the `<svg>` tag, e.g. `{ class: "icon" }` |

### `iconBody(icon, options?)`

The inner markup only, with `variant`, `color`, `strokeWidth` and `title` applied. Useful when you build the `<svg>` element yourself.

### `variants`

The list of variant names.

## Variants

`linear`, `outline`, `bold`, `bulk`, `twotone`, `broken`, `glass`, `glass-light`, `duotone`. The default is `linear`.

- `linear`, `twotone`, `broken` and `duotone` are line styles and accept `strokeWidth`.
- `glass` is tuned for dark backgrounds and `glass-light` for light ones. Both carry their own colours, so `color` has no effect on them.

## Links

- Browse all 996 icons: https://fmicon.dev/icons
- Source and issues: https://github.com/Kakahaja07/fmicon
- Licence: MIT for the code. The icon artwork comes with an attribution notice, see [LICENSE](https://github.com/Kakahaja07/fmicon/blob/main/LICENSE).
