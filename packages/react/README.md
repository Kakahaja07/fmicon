# @fmicons/react

891 FM Icons as React components, in 9 styles. Each icon is its own module, so your bundler only keeps the ones you import.

## Install

```sh
npm install @fmicons/react
```

## Usage

```jsx
import { Lock } from "@fmicons/react";

<Lock size={24} variant="bold" color="#1265ec" strokeWidth={1} />
```

Component names are the PascalCase of the icon slug: `home-2` is `Home2`, `arrow-circle-right` is `ArrowCircleRight`, and slugs that start with a digit get an `Icon` prefix (`3d-rotate` is `Icon3dRotate`). Every icon is also exported with an `Icon` suffix (`LockIcon`) for when a name clashes with a global such as `Map` or `Image`.

Icons forward their ref to the `<svg>` element and pass any other SVG props through (`className`, `style`, `onClick` and so on).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `number \| string` | `24` | Width and height |
| `variant` | `IconVariant` | `"linear"` | One of the styles below |
| `color` | `string` | inherits text colour | Replaces `currentColor` in the artwork |
| `strokeWidth` | `number \| string` | `1.5` | Line styles only |
| `title` | `string` | none | Accessible name. Without it (or `aria-label`) the icon is `aria-hidden` |

## Variants

`linear`, `outline`, `bold`, `bulk`, `twotone`, `broken`, `glass`, `glass-light`, `duotone`. The default is `linear`.

- `linear`, `twotone`, `broken` and `duotone` are line styles and accept `strokeWidth`.
- `glass` is tuned for dark backgrounds and `glass-light` for light ones. Both carry their own colours, so `color` has no effect on them.

## Links

- Browse all 891 icons: https://fmicons.app/icons
- Source and issues: https://github.com/Kakahaja07/fmicons
- Licence: MIT for the code. The icon artwork comes with an attribution notice, see [LICENSE](https://github.com/Kakahaja07/fmicons/blob/main/LICENSE).
