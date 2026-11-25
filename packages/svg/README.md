# @fmicons/svg

891 FM Icons as plain SVG files, one folder per style. Every file is a 24 by 24 SVG that uses `currentColor` (glass styles carry their own colours).

## Install

```sh
npm install @fmicons/svg
```

## Usage

Files live at `@fmicons/svg/icons/<style>/<slug>.svg`.

```js
// With a bundler that imports SVG files as URLs (Vite, webpack asset modules)
import lockUrl from "@fmicons/svg/icons/linear/lock.svg";
```

From the CDN, with no install:

```html
<img src="https://cdn.jsdelivr.net/gh/Kakahaja07/fmicons@main/packages/svg/icons/linear/lock.svg" width="24" height="24" alt="Lock" />
```

`icons.json` lists every icon with its `slug`, `name` and `category`.

## Variants

`linear`, `outline`, `bold`, `bulk`, `twotone`, `broken`, `glass`, `glass-light`, `duotone`. The default is `linear`.

- `linear`, `twotone`, `broken` and `duotone` are line styles (stroke width 1.5).
- `glass` is tuned for dark backgrounds and `glass-light` for light ones. Both carry their own colours.

## Links

- Browse all 891 icons: https://fmicon.dev/icons
- Source and issues: https://github.com/Kakahaja07/fmicons
- Licence: MIT for the code. The icon artwork comes with an attribution notice, see [LICENSE](https://github.com/Kakahaja07/fmicons/blob/main/LICENSE).
