import type { DefineComponent } from "vue";
import type { IconData, IconVariant } from "./render.js";

export type { IconVariant };

export interface IconProps {
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
}

export type FMIcon = DefineComponent<IconProps>;

export declare function createIcon(name: string, icon: IconData): FMIcon;
