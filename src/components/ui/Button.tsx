import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import type { IconComponent } from "~/components/icons/Icons";
import { cx } from "~/lib/cx";
import s from "./Button.module.css";

export type ButtonVariant = "primary" | "success" | "dark" | "ghost";
export type ButtonSize = "md" | "lg";

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon before the label */
  icon?: IconComponent;
  /** Icon after the label (nudges right on hover) */
  iconRight?: IconComponent;
  /** Small pill at the end, e.g. a price */
  badge?: ReactNode;
  block?: boolean;
  className?: string;
  children: ReactNode;
};

type LinkProps = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common> & { href: string };
type NativeProps = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common> & { href?: undefined };

export type ButtonProps = LinkProps | NativeProps;

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", icon: Icon, iconRight: IconRight, badge, block, className, children, ...rest } = props;
  const classes = cx(s.btn, s[variant], s[size], block && s.block, badge !== undefined && s.withBadge, className);
  const iconSize = size === "lg" ? 18 : 16;
  const content = (
    <>
      {Icon && <Icon size={iconSize} className={s.icon} />}
      <span>{children}</span>
      {IconRight && <IconRight size={iconSize} className={cx(s.icon, s.iconRight)} />}
      {badge !== undefined && <span className={s.badge}>{badge}</span>}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
