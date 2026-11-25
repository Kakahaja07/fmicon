import type { ReactNode } from "react";
import { cx } from "~/lib/cx";
import s from "./SectionHeading.module.css";

type SectionHeadingProps = {
  title: ReactNode;
  children?: ReactNode;
  as?: "h1" | "h2";
  id?: string;
  narrow?: boolean;
  className?: string;
};

export function SectionHeading({ title, children, as: Tag = "h2", id, narrow, className }: SectionHeadingProps) {
  return (
    <header className={cx(s.head, className)}>
      <Tag id={id} className={s.title}>
        {title}
      </Tag>
      {children && <p className={cx(s.lead, narrow && s.narrow)}>{children}</p>}
    </header>
  );
}
