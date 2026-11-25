import type { ElementType, ReactNode } from "react";
import { cx } from "~/lib/cx";
import s from "./Container.module.css";

type ContainerProps = { as?: ElementType; className?: string; children: ReactNode; id?: string };

/** Centred page column (max width comes from --wrap). */
export function Container({ as: Tag = "div", className, children, id }: ContainerProps) {
  return (
    <Tag id={id} className={cx(s.wrap, className)}>
      {children}
    </Tag>
  );
}
