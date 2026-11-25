import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { SvgProps } from "react-native-svg";
import type { IconData, IconVariant } from "./render.js";

export type { IconVariant };

export interface IconProps extends Omit<SvgProps, "color" | "strokeWidth" | "width" | "height"> {
  /** Width and height. Defaults to 24. */
  size?: number | string;
  /** Defaults to "linear". */
  variant?: IconVariant;
  /** Replaces currentColor. Defaults to "black". */
  color?: string;
  /** Applies to linear, twotone, broken and duotone only. Default 1.5. */
  strokeWidth?: number | string;
  /** Accessible label for screen readers. */
  title?: string;
}

export type FMIcon = ForwardRefExoticComponent<IconProps & RefAttributes<unknown>>;

export declare function createIcon(displayName: string, icon: IconData): FMIcon;
