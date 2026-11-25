export type IconVariant =
  | "linear"
  | "outline"
  | "bold"
  | "bulk"
  | "twotone"
  | "broken"
  | "glass"
  | "glass-light"
  | "duotone";

export interface IconData {
  /** Icon slug, e.g. "arrow-circle-right". */
  name: string;
  category: string;
  /** Inner SVG markup for a 0 0 24 24 viewBox, one entry per style. */
  variants: Record<IconVariant, string>;
}

export interface IconBodyOptions {
  /** Defaults to "linear". */
  variant?: IconVariant;
  /** Replaces currentColor. Glass styles have their own colours and ignore it. */
  color?: string;
  /** Applies to linear, twotone, broken and duotone only. Default 1.5. */
  strokeWidth?: number | string;
  /** Adds a <title>, which makes the icon visible to screen readers. */
  title?: string;
}

export interface ToSvgOptions extends IconBodyOptions {
  /** Width and height. Defaults to 24. */
  size?: number | string;
  /** Extra attributes for the <svg> tag, e.g. { class: "icon" }. */
  attrs?: Record<string, string | number | boolean | null | undefined>;
}

export declare const variants: readonly IconVariant[];
export declare function escapeAttr(value: unknown): string;
export declare function iconBody(icon: IconData, options?: IconBodyOptions): string;
export declare function toSvg(icon: IconData, options?: ToSvgOptions): string;
