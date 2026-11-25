# @fmicons/core

891 FM Icons as plain data with no framework, plus helpers that turn them into SVG strings. The other FM Icons packages are built on the same data.

## Install

```sh
npm install @fmicons/core
```

## Usage

```js
import { lock, toSvg } from "@fmicons/core";

el.innerHTML = toSvg(lock, { size: 24, variant: "bold" });
```

Each icon is an object:

```js
{ name: "lock", category: "security", variants: { linear: "<path …/>", outline: "…", … } }
```

Export names are the camelCase of the slug: `home-2` is `home2`, `arrow-circle-right` is `arrowCircleRight`, slugs that start with a digit get an `icon` prefix (`3d-rotate` is `icon3dRotate`), and names that are reserved words get an `Icon` suffix (`exportIcon`, `importIcon`).

Need every icon, for a picker or search? Import the full list from a separate entry so the main one stays tree-shakeable:

```js
import { icons } from "@fmicons/core/all";
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

- Browse all 891 icons: https://fmicon.dev/icons
- Source and issues: https://github.com/Kakahaja07/fmicon
- Licence: MIT for the code. The icon artwork comes with an attribution notice, see [LICENSE](https://github.com/Kakahaja07/fmicon/blob/main/LICENSE).
