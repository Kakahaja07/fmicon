import { createElement, forwardRef } from "react";
import { iconBody } from "./render.js";

export function createIcon(displayName, icon) {
  const Icon = forwardRef(function FMIcon(
    { size = 24, variant = "linear", color, strokeWidth, title, children, ...rest },
    ref,
  ) {
    const labelled = Boolean(title || rest["aria-label"] || rest["aria-labelledby"]);
    return createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      "aria-hidden": labelled ? undefined : true,
      role: labelled ? "img" : undefined,
      ...rest,
      ref,
      dangerouslySetInnerHTML: { __html: iconBody(icon, { variant, color, strokeWidth, title }) },
    });
  });
  Icon.displayName = displayName;
  return Icon;
}
