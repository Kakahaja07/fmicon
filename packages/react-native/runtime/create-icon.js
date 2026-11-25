import { createElement, forwardRef } from "react";
import { SvgXml } from "react-native-svg";
import { toSvg } from "./render.js";

export function createIcon(displayName, icon) {
  const Icon = forwardRef(function FMIcon(
    { size = 24, variant = "linear", color = "black", strokeWidth, title, ...rest },
    ref,
  ) {
    const xml = toSvg(icon, { size, variant, color, strokeWidth });
    return createElement(SvgXml, {
      xml,
      width: size,
      height: size,
      accessible: title ? true : undefined,
      accessibilityRole: title ? "image" : undefined,
      accessibilityLabel: title,
      ...rest,
      ref,
    });
  });
  Icon.displayName = displayName;
  return Icon;
}
