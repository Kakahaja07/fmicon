<div align="center">

<a href="https://fmicon.dev"><img src="https://raw.githubusercontent.com/Kakahaja07/fmicon/main/.github/assets/wordmark-light.png" width="260" alt="fmicon"></a>

### Free icons for Svelte

<a href="https://www.npmjs.com/package/fmicon-svelte"><img src="https://img.shields.io/npm/v/fmicon-svelte?style=flat-square&color=1e8cff&label=npm" alt="npm version"></a>
<a href="https://www.npmjs.com/package/fmicon-svelte"><img src="https://img.shields.io/npm/dm/fmicon-svelte?style=flat-square&color=2b2b2f" alt="downloads"></a>
<a href="https://github.com/Kakahaja07/fmicon/blob/main/LICENSE"><img src="https://img.shields.io/badge/licence-MIT-22c55e?style=flat-square" alt="MIT licence"></a>

**[Website](https://fmicon.dev)** · **[Browse icons](https://fmicon.dev/icons)** · **[Docs](https://fmicon.dev/docs/svelte)** · **[GitHub](https://github.com/Kakahaja07/fmicon)**

<img src="https://raw.githubusercontent.com/Kakahaja07/fmicon/main/.github/assets/showcase-light.png" width="640" alt="fmicon icons in the linear, bold, duotone and glass styles">

</div>

fmicon is a free, open-source set of 1021 icons, each drawn in 9 styles. Use them in personal and commercial projects. No sign-up, and no credit needed in your app.

One Svelte component that draws any of the 1021 fmicon. The icon data comes from [fmicon](https://www.npmjs.com/package/fmicon), which is installed with it and tree-shakes to the icons you import. Works with Svelte 4 and 5.

## Install

```sh
npm install fmicon-svelte
```

## Usage

```svelte
<script>
  import { Icon } from "fmicon-svelte";
  import { lock } from "fmicon";
</script>

<Icon icon={lock} size={24} variant="bold" color="#1265ec" />
```

Icon data names are the camelCase of the slug (`arrow-circle-right` is `arrowCircleRight`). See the [fmicon README](https://github.com/Kakahaja07/fmicon/tree/main/packages/core) for the naming rules. Other attributes (`class`, `style`) are passed to the `<svg>` element.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `IconData` | required | An icon from `fmicon` |
| `size` | `number \| string` | `24` | Width and height |
| `variant` | `IconVariant` | `"linear"` | One of the styles below |
| `color` | `string` | inherits text colour | Replaces `currentColor` in the artwork |
| `strokeWidth` | `number \| string` | `1.5` | Line styles only |
| `title` | `string` | none | Accessible name. Without it (or `aria-label`) the icon is `aria-hidden` |

## Variants

`linear`, `outline`, `bold`, `bulk`, `twotone`, `broken`, `glass`, `glass-light`, `duotone`, `color`. The default is `linear`.

- `linear`, `twotone`, `broken` and `duotone` are line styles and accept `strokeWidth`.
- `glass` is tuned for dark backgrounds and `glass-light` for light ones. Both carry their own colours, so `color` has no effect on them.
- `color` icons are bright and layered, with their own hues. Their parts carry the classes `fmi-body`, `fmi-accent` and `fmi-detail`, so you can animate them with CSS (the snippet is in the fmicon README on GitHub).

## Links

- Browse all 1021 icons: https://fmicon.dev/icons
- Source and issues: https://github.com/Kakahaja07/fmicon
- Licence: MIT for the code. The icon artwork comes with an attribution notice, see [LICENSE](https://github.com/Kakahaja07/fmicon/blob/main/LICENSE).
