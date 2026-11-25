<div align="center">

<a href="https://fmicon.dev"><img src="https://raw.githubusercontent.com/Kakahaja07/fmicon/main/.github/assets/wordmark-light.png" width="260" alt="fmicon"></a>

### Free icons for Vue 3

<a href="https://www.npmjs.com/package/fmicon-vue"><img src="https://img.shields.io/npm/v/fmicon-vue?style=flat-square&color=1e8cff&label=npm" alt="npm version"></a>
<a href="https://www.npmjs.com/package/fmicon-vue"><img src="https://img.shields.io/npm/dm/fmicon-vue?style=flat-square&color=2b2b2f" alt="downloads"></a>
<a href="https://github.com/Kakahaja07/fmicon/blob/main/LICENSE"><img src="https://img.shields.io/badge/licence-MIT-22c55e?style=flat-square" alt="MIT licence"></a>

**[Website](https://fmicon.dev)** · **[Browse icons](https://fmicon.dev/icons)** · **[Docs](https://fmicon.dev/docs/vue)** · **[GitHub](https://github.com/Kakahaja07/fmicon)**

<img src="https://raw.githubusercontent.com/Kakahaja07/fmicon/main/.github/assets/showcase-light.png" width="640" alt="fmicon icons in the linear, bold, duotone and glass styles">

</div>

fmicon is a free, open-source set of 891 icons, each drawn in 8 styles. Use them in personal and commercial projects. No sign-up, and no credit needed in your app.

891 icons as Vue 3 components, in 8 styles (plus glass-light). Each icon is its own module, so your bundler only keeps the ones you import.

## Install

```sh
npm install fmicon-vue
```

## Usage

```vue
<script setup>
import { Lock } from "fmicon-vue";
</script>

<template>
  <Lock :size="24" variant="bold" color="#1265ec" />
</template>
```

Component names are the PascalCase of the icon slug: `home-2` is `Home2`, `arrow-circle-right` is `ArrowCircleRight`, and slugs that start with a digit get an `Icon` prefix (`3d-rotate` is `Icon3dRotate`). Every icon is also exported with an `Icon` suffix (`LockIcon`) for when a name clashes with a global such as `Map` or `Image`.

Other attributes (`class`, `style`, listeners) are passed to the `<svg>` element.

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

- Browse all 891 icons: https://fmicon.dev/icons
- Source and issues: https://github.com/Kakahaja07/fmicon
- Licence: MIT for the code. The icon artwork comes with an attribution notice, see [LICENSE](https://github.com/Kakahaja07/fmicon/blob/main/LICENSE).
