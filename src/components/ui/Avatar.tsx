import type { CSSProperties } from "react";
import { cx } from "~/lib/cx";
import s from "./Avatar.module.css";

type AvatarProps = {
  initial: string;
  /** Shown instead of the initial, e.g. a person emoji */
  emoji?: string;
  /** Two colours for the gradient */
  colors?: readonly [string, string];
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Avatar({ initial, emoji, colors = ["#ffb199", "#ff6f61"], size = "md", className }: AvatarProps) {
  return (
    <span
      className={cx(s.avatar, s[size], emoji && s.emoji, className)}
      style={{ "--a1": colors[0], "--a2": colors[1] } as CSSProperties}
      aria-hidden="true"
    >
      {emoji ?? initial}
    </span>
  );
}
