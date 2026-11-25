import type { ReactNode } from "react";
import type { PaletteColor } from "~/lib/palette";
import { paletteVar } from "~/lib/palette";
import s from "./Badge.module.css";

type BadgeProps = { color?: PaletteColor; children: ReactNode };

export function Badge({ color = "green", children }: BadgeProps) {
  return (
    <span className={s.badge} style={{ "--c": paletteVar(color) } as React.CSSProperties}>
      {children}
    </span>
  );
}
