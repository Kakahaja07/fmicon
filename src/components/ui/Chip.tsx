import type { ReactNode } from "react";
import type { IconComponent } from "~/components/icons/Icons";
import s from "./Chip.module.css";

type ChipProps = { icon?: IconComponent; iconColor?: string; children: ReactNode };

/** Inline label that sits inside running text, like a Finder folder tag. */
export function Chip({ icon: Icon, iconColor, children }: ChipProps) {
  return (
    <span className={s.chip}>
      {Icon && <Icon size={16} color={iconColor} />}
      {children}
    </span>
  );
}
