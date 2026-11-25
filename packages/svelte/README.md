# @fmicons/svelte

One Svelte component that draws any of the 891 FM Icons. The icon data comes from [@fmicons/core](https://www.npmjs.com/package/@fmicons/core), which is installed with it and tree-shakes to the icons you import. Works with Svelte 4 and 5.

## Install

```sh
npm install @fmicons/svelte
```

## Usage

```svelte
<script>
  import { Icon } from "@fmicons/svelte";
  import { lock } from "@fmicons/core";
</script>

<Icon icon={lock} size={24} variant="bold" color="#1265ec" />
```

Icon data names are the camelCase of the slug (`arrow-circle-right` is `arrowCircleRight`). See the [@fmicons/core README](https://github.com/Kakahaja07/fmicon/tree/main/packages/core) for the naming rules. Other attributes (`class`, `style`) are passed to the `<svg>` element.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `IconData` | required | An icon from `@fmicons/core` |
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

- Browse all 891 icons: https://fmicon.dev/icons
- Source and issues: https://github.com/Kakahaja07/fmicon
- Licence: MIT for the code. The icon artwork comes with an attribution notice, see [LICENSE](https://github.com/Kakahaja07/fmicon/blob/main/LICENSE).
