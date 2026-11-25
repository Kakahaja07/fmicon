import type { CSSProperties, ReactNode } from "react";
import type { IconComponent } from "~/components/icons/Icons";
import type { PaletteColor } from "~/lib/palette";
import { paletteVar } from "~/lib/palette";
import { Badge } from "./Badge";
import s from "./FeatureTile.module.css";

export type FeatureTileProps = {
  icon: IconComponent;
  color: PaletteColor;
  title: string;
  description: string;
  badge?: string;
};

/** Small feature card: tinted icon tile, title, one line of copy. */
export function FeatureTile({ icon: Icon, color, title, description, badge }: FeatureTileProps) {
  return (
    <li className={s.tile} style={{ "--c": paletteVar(color) } as CSSProperties}>
      <span className={s.icon} aria-hidden="true">
        <Icon size={22} />
      </span>
      <h3 className={s.title}>
        {title}
        {badge && <Badge>{badge}</Badge>}
      </h3>
      <p className={s.desc}>{description}</p>
    </li>
  );
}

export function FeatureTileGrid({ children }: { children: ReactNode }) {
  return <ul className={s.grid}>{children}</ul>;
}
