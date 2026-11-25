<div align="center">

<a href="https://fmicon.dev">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/assets/wordmark-dark.png">
    <img src=".github/assets/wordmark-light.png" alt="fmicon" width="170">
  </picture>
</a>

### Contributing to fmicon

Thanks for wanting to help! Every bug report, icon idea and fix makes fmicon better for everyone.

[Website](https://fmicon.dev) · [Docs](https://fmicon.dev/docs) · [Issues](https://github.com/Kakahaja07/fmicon/issues) · [Pull requests](https://github.com/Kakahaja07/fmicon/pulls)

</div>

## Ways to help

You don't need to write code. Pick whatever fits you.

<table>
<tr>
<td width="50%" valign="top">

<picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/Kakahaja07/fmicon@main/packages/svg/icons/glass/danger.svg"><img src="https://cdn.jsdelivr.net/gh/Kakahaja07/fmicon@main/packages/svg/icons/glass-light/danger.svg" width="32" alt=""></picture>

**Report a problem**<br>
An icon looks wrong, a link is broken, or a package doesn't work.<br>
→ [Report a problem](#report-a-problem)

</td>
<td width="50%" valign="top">

<picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/Kakahaja07/fmicon@main/packages/svg/icons/glass/lamp-on.svg"><img src="https://cdn.jsdelivr.net/gh/Kakahaja07/fmicon@main/packages/svg/icons/glass-light/lamp-on.svg" width="32" alt=""></picture>

**Ask for an icon**<br>
Need an icon we don't have yet? Tell us about it.<br>
→ [Ask for an icon](#ask-for-an-icon)

</td>
</tr>
<tr>
<td width="50%" valign="top">

<picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/Kakahaja07/fmicon@main/packages/svg/icons/glass/code.svg"><img src="https://cdn.jsdelivr.net/gh/Kakahaja07/fmicon@main/packages/svg/icons/glass-light/code.svg" width="32" alt=""></picture>

**Send a fix**<br>
Improve the website, docs or npm packages.<br>
→ [Work on the code](#work-on-the-code)

</td>
<td width="50%" valign="top">

<picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/Kakahaja07/fmicon@main/packages/svg/icons/glass/heart.svg"><img src="https://cdn.jsdelivr.net/gh/Kakahaja07/fmicon@main/packages/svg/icons/glass-light/heart.svg" width="32" alt=""></picture>

**Spread the word**<br>
Give the repository a ⭐ and tell a friend who builds apps.<br>
→ [Star fmicon](https://github.com/Kakahaja07/fmicon)

</td>
</tr>
</table>

## Report a problem

Please [search the open issues](https://github.com/Kakahaja07/fmicon/issues) first. If someone already reported it, add a 👍 to their issue instead.

Then [open a new issue](https://github.com/Kakahaja07/fmicon/issues/new) and tell us:

| What | Example |
|---|---|
| The icon's name and style | `arrow-circle-right` in `bold` (copy it from the icon's address on [fmicon.dev/icons](https://fmicon.dev/icons)) |
| What you expected, and what you saw | "The arrow points left in the glass style" |
| Where it happened | The website, or a package and its version, like `fmicon-react@0.1.0` |
| A screenshot | Drag the picture into the issue |

## Ask for an icon

[Open a new issue](https://github.com/Kakahaja07/fmicon/issues/new) with:

- **The icon you need**, like "a shopping basket" or "a QR code".
- **Where you'd use it**, so we draw it the right way.
- **A link to a similar icon**, if you have one.

## Work on the code

The website at [fmicon.dev](https://fmicon.dev) and all the npm packages live in this one repository. The site uses TanStack Start, React and CSS Modules, and every page is built as a plain HTML file.

### 1. Get it running

You need [Node.js](https://nodejs.org) 22 or newer.

```sh
git clone https://github.com/Kakahaja07/fmicon.git
cd fmicons
npm install
npm run dev
```

Open http://localhost:3000. The page reloads on its own when you save a file.

### 2. Find what to change

| To change… | Edit |
|---|---|
| Any text, link or FAQ on the site | `src/content/site.ts` |
| Docs pages | `src/content/docs.ts` |
| Colours, fonts, corners, shadows | `src/styles/tokens.css` |
| Page sections and parts | `src/components/` |
| Icon page and library articles | `scripts/data/`, `src/content/iconArticle.ts`, `src/content/libraryArticle.ts` |
| The npm packages | `scripts/build-packages.mjs` and `packages/<name>/runtime/` |
| The README pictures | `scripts/build-readme-assets.mjs` |

```text
fmicons/
├── src/
│   ├── content/      text for the site, docs and articles
│   ├── components/   the parts each page is built from
│   ├── routes/       one file per page
│   └── styles/       colours, fonts and other design tokens
├── packages/         the npm packages: core, react, vue, svelte, react-native, svg
├── scripts/          the build scripts behind the npm run commands
└── public/           images and files served as they are
```

> [!NOTE]
> The icon drawings come from the maker's own design files, which aren't in this repository. So `npm run icons` and `npm run free-icons` won't work on your computer. If an icon's shape needs fixing, [report a problem](#report-a-problem) instead.

### 3. Rebuild what you changed

| Command | What it does | Run it when you changed… |
|---|---|---|
| `npm run dev` | Starts the site at http://localhost:3000 | anything on the site |
| `npm run build` | Builds the whole site into `dist/client` | before every pull request |
| `npm run typecheck` | Checks the code for type errors | before every pull request |
| `npm run packages` | Rebuilds the npm packages in `packages/` | a package |
| `npm run articles` | Rebuilds the icon page articles | `scripts/data/` |
| `npm run readme` | Rebuilds the README pictures | the README showcase |
| `npm run social` | Rebuilds the share images in `public/og/` (needs Edge or Chrome) | the share card design |

### 4. Send your pull request

1. [Fork the repository](https://github.com/Kakahaja07/fmicon/fork) and make a new branch, like `fix-vue-docs`.
2. Make your change. Keep it small: one fix or one feature per pull request.
3. Write a commit message that says what changed:

   | 👍 Clear | 👎 Unclear |
   |---|---|
   | `Fix the size example in the Vue docs` | `update` |
   | `Add a title prop to the Svelte icon` | `changes` |

4. [Open a pull request](https://github.com/Kakahaja07/fmicon/compare) and explain what you changed and why.

Before you press the button, check:

- [ ] `npm run typecheck` and `npm run build` both finish without errors
- [ ] If you changed a package, you ran `npm run packages` and tried an icon in a small test app
- [ ] If people can see the change, you added a screenshot to the pull request

We'll look at it as soon as we can and may ask for small changes. That's normal, not a "no"!

## Be kind

Be friendly and patient with everyone here. We're all trying to make something nice together.

## Licence

By contributing, you agree that your work is shared under the same [MIT licence](LICENSE) as the rest of the project.

<br>

<div align="center">
  <img src=".github/assets/maker.png" width="48" height="48" alt="Prashant Sharma">
  <br>
  <sub>Thanks for helping, from <b>Prashant Sharma</b> and everyone who uses fmicon.</sub>
</div>
