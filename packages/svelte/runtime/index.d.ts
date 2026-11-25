import { SvelteComponent } from "svelte";
import type { IconData, IconVariant } from "fmicon";

export type { IconVariant };

export interface IconProps {
  /** Icon data from fmicon, e.g. `lock`. */
  icon: IconData;
  /** Width and height. Defaults to 24. */
  size?: number | string;
  /** Defaults to "linear". */
  variant?: IconVariant;
  /** Replaces currentColor. Defaults to the inherited text colour. */
  color?: string;
  /** Applies to linear, twotone, broken and duotone only. Default 1.5. */
  strokeWidth?: number | string;
  /** Accessible name. Without it (or aria-label) the icon is aria-hidden. */
  title?: string;
  [attr: string]: unknown;
}

export declare class Icon extends SvelteComponent<IconProps> {}
