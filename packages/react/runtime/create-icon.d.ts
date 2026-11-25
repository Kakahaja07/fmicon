import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
import type { IconData, IconVariant } from "./render.js";

export type { IconVariant };

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref" | "children" | "color" | "strokeWidth"> {
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

export type FMIcon = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

export declare function createIcon(displayName: string, icon: IconData): FMIcon;
