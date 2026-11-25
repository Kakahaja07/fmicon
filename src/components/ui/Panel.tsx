import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "~/lib/cx";
import s from "./Panel.module.css";

type PanelProps = HTMLAttributes<HTMLDivElement> & { padding?: "md" | "lg"; children: ReactNode };

/** Plain raised surface used for forms and callouts. */
export function Panel({ padding = "lg", className, children, ...rest }: PanelProps) {
  return (
    <div className={cx(s.panel, s[padding], className)} {...rest}>
      {children}
    </div>
  );
}
