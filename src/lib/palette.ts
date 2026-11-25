/** Names of the palette colours defined in styles/tokens.css. */
export type PaletteColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "mint"
  | "teal"
  | "blue"
  | "indigo"
  | "purple"
  | "pink";

export const paletteVar = (color: PaletteColor) => `var(--${color})`;
