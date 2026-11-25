import type { CSSProperties } from "react";
import { LogoMark } from "./LogoMark";
import s from "./AppIcon.module.css";

/** The fmicon app icon: the dotted "F" on a dark rounded tile (same as the README logo). */
export function AppIcon({ size = 88 }: { size?: number }) {
  return (
    <span className={s.icon} style={{ "--i": `${size}px` } as CSSProperties} aria-hidden="true">
      <LogoMark size="62%" />
    </span>
  );
}
