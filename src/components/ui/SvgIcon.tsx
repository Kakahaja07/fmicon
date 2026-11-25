import type { CSSProperties } from "react";

type SvgIconProps = {
  /** Inner SVG markup on a 24×24 viewBox (from our own generated icon files) */
  body: string;
  size?: number | string;
  color?: string;
  className?: string;
  style?: CSSProperties;
};

/** Renders an icon from raw markup, for icons loaded as data rather than imported as components. */
export function SvgIcon({ body, size = 24, color, className, style }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      data-icon=""
      className={className}
      style={color ? { ...style, color } : style}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
