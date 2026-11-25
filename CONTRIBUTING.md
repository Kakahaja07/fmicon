# Contributing to FM Icons

Thanks for wanting to help! FM Icons is free for everyone, and every fix, idea and bug report makes it better.

You don't need to write code to help. Here are the ways you can contribute, easiest first.

## 1. Tell us about a problem

Found an icon that looks wrong, a broken link, or a package that doesn't work?

[Open an issue](https://github.com/Kakahaja07/fmicons/issues/new) and tell us:

- **The icon's name and style**, like `arrow-circle-right` in `bold`. You can copy it from the icon's web address on [fmicon.dev/icons](https://fmicon.dev/icons).
- **What you expected and what you saw.** A screenshot helps a lot.
- **Where it happened**: the website, or a package like `@fmicons/react` (with its version).

## 2. Ask for a new icon

[Open an issue](https://github.com/Kakahaja07/fmicons/issues/new) with:

- The icon you need, like "a shopping basket" or "a QR code".
- Where you would use it. This helps us draw it the right way.
- A link to a similar icon, if you have one.

Please search the [open issues](https://github.com/Kakahaja07/fmicons/issues) first. If someone already asked, add a 👍 to their issue instead.

## 3. Fix the website, docs or packages

The website at [fmicon.dev](https://fmicon.dev) and the npm packages all live in this repository.

### Get it running

You need [Node.js](https://nodejs.org) 22 or newer.

```sh
git clone https://github.com/Kakahaja07/fmicons.git
cd fmicons
npm install
npm run dev
```

Open http://localhost:3000 to see the site. It reloads on its own when you save a file.

### Where things are

| To change… | Edit |
|---|---|
| Any text, link or FAQ on the site | `src/content/site.ts` |
| Docs pages | `src/content/docs.ts` |
| Colours, fonts, corners, shadows | `src/styles/tokens.css` |
| Icon page and library articles | `scripts/data/`, `src/content/iconArticle.ts`, `src/content/libraryArticle.ts` |
| The npm packages | `scripts/build-packages.mjs` and `packages/<name>/runtime/`, then run `npm run packages` |
| The README pictures | `scripts/build-readme-assets.mjs`, then run `npm run readme` |

The icon drawings themselves come from the maker's design files, which are not in this repository. So `npm run icons` and `npm run free-icons` won't work for you. If an icon's shape needs fixing, [open an issue](https://github.com/Kakahaja07/fmicons/issues/new) instead.

### Before you send a pull request

```sh
npm run typecheck   # check the code for type errors
npm run build       # make sure the site still builds
```

If you changed a package, also run `npm run packages` and try the icon in a small test app.

### Sending your change

1. [Fork the repository](https://github.com/Kakahaja07/fmicons/fork) and make a new branch, like `fix-docs-typo`.
2. Make your change. Keep it small: one fix or one feature per pull request.
3. Write a commit message that says what changed, like `Fix the size example in the Vue docs`.
4. [Open a pull request](https://github.com/Kakahaja07/fmicons/compare) and explain what you changed and why. Add a screenshot if the change is something people can see.

We'll look at it as soon as we can and may ask for small changes.

## 4. Spread the word

Using FM Icons in a project? Give the repository a ⭐ and tell a friend. It helps more people find it.

## Be kind

Be friendly and patient with everyone here. We're all trying to make something nice together.

## Licence

By contributing, you agree that your work is shared under the same [MIT licence](LICENSE) as the rest of the project.
