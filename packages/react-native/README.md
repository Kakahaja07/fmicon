<div align="center">

<a href="https://fmicon.dev"><img src="https://raw.githubusercontent.com/Kakahaja07/fmicon/main/.github/assets/wordmark-light.png" width="260" alt="fmicon"></a>

### Free icons for React Native

<a href="https://www.npmjs.com/package/fmicon-react-native"><img src="https://img.shields.io/npm/v/fmicon-react-native?style=flat-square&color=1e8cff&label=npm" alt="npm version"></a>
<a href="https://www.npmjs.com/package/fmicon-react-native"><img src="https://img.shields.io/npm/dm/fmicon-react-native?style=flat-square&color=2b2b2f" alt="downloads"></a>
<a href="https://github.com/Kakahaja07/fmicon/blob/main/LICENSE"><img src="https://img.shields.io/badge/licence-MIT-22c55e?style=flat-square" alt="MIT licence"></a>

**[Website](https://fmicon.dev)** · **[Browse icons](https://fmicon.dev/icons)** · **[Docs](https://fmicon.dev/docs/react-native)** · **[GitHub](https://github.com/Kakahaja07/fmicon)**

<img src="https://raw.githubusercontent.com/Kakahaja07/fmicon/main/.github/assets/showcase-light.png" width="640" alt="fmicon icons in the linear, bold, duotone and glass styles">

</div>

fmicon is a free, open-source set of 996 icons, each drawn in 9 styles. Use them in personal and commercial projects. No sign-up, and no credit needed in your app.

996 icons as React Native components, in 9 styles (plus glass-light). They render with `SvgXml` from [react-native-svg](https://github.com/software-mansion/react-native-svg).

## Install

```sh
npm install fmicon-react-native react-native-svg
```

With Expo: `npx expo install react-native-svg`.

## Usage

```jsx
import { Lock } from "fmicon-react-native";

<Lock size={24} variant="bold" color="#1265ec" strokeWidth={1} />
```

Component names are the PascalCase of the icon slug: `home-2` is `Home2`, `arrow-circle-right` is `ArrowCircleRight`, and slugs that start with a digit get an `Icon` prefix (`3d-rotate` is `Icon3dRotate`). Every icon is also exported with an `Icon` suffix (`LockIcon`) for when a name clashes with a global such as `Map` or `Image`.

Other props are passed to `SvgXml` (`style`, `testID` and so on).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `number \| string` | `24` | Width and height |
| `variant` | `IconVariant` | `"linear"` | One of the styles below |
| `color` | `string` | `"black"` | Replaces `currentColor` in the artwork |
| `strokeWidth` | `number \| string` | `1.5` | Line styles only |
| `title` | `string` | none | Sets `accessibilityLabel` |

## Variants

`linear`, `outline`, `bold`, `bulk`, `twotone`, `broken`, `glass`, `glass-light`, `duotone`, `color`. The default is `linear`.

- `linear`, `twotone`, `broken` and `duotone` are line styles and accept `strokeWidth`.
- `glass` is tuned for dark backgrounds and `glass-light` for light ones. Both carry their own colours, so `color` has no effect on them.
- `color` icons are bright and layered, with their own hues. Their parts carry the classes `fmi-body`, `fmi-accent` and `fmi-detail`, so you can animate them with CSS (the snippet is in the fmicon README on GitHub).

The glass styles use gradients, masks and blur filters. Check them on your target platforms, as react-native-svg support for filters depends on its version.

## Links

- Browse all 996 icons: https://fmicon.dev/icons
- Source and issues: https://github.com/Kakahaja07/fmicon
- Licence: MIT for the code. The icon artwork comes with an attribution notice, see [LICENSE](https://github.com/Kakahaja07/fmicon/blob/main/LICENSE).
