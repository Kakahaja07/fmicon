import type { CSSProperties } from "react";
import { Element3BoldIcon } from "~/components/icons/Icons";
import s from "./AppIcon.module.css";

/** The product's app icon: a brand-coloured squircle with the grid mark. */
export function AppIcon({ size = 88 }: { size?: number }) {
  return (
    <span className={s.icon} style={{ "--i": `${size}px` } as CSSProperties} aria-hidden="true">
      <Element3BoldIcon size="54%" />
    </span>
  );
}
