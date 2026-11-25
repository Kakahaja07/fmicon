import type { CSSProperties } from "react";
import { LogoMark } from "./LogoMark";
import s from "./AppIcon.module.css";

/** The FM Icons mark at a given size: the dotted "F", no tile behind it. */
export function AppIcon({ size = 88 }: { size?: number }) {
  return (
    <span className={s.icon} style={{ "--i": `${size}px` } as CSSProperties} aria-hidden="true">
      <LogoMark size="100%" />
    </span>
  );
}
