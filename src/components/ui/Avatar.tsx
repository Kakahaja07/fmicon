import { useState, type CSSProperties } from "react";
import { cx } from "~/lib/cx";
import s from "./Avatar.module.css";

type AvatarProps = {
  initial: string;
  /** Shown instead of the initial, e.g. a person emoji */
  emoji?: string;
  /** A photo or portrait; falls back to the emoji or initial if it can't load */
  image?: string;
  /** Two colours for the gradient */
  colors?: readonly [string, string];
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** Round avatar: a photo when there is one, otherwise an emoji or initial on a gradient. */
export function Avatar({ initial, emoji, image, colors = ["#ffb199", "#ff6f61"], size = "md", className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const photo = image && !failed;
  return (
    <span
      className={cx(s.avatar, s[size], !photo && emoji && s.emoji, photo && s.photo, className)}
      style={{ "--a1": colors[0], "--a2": colors[1] } as CSSProperties}
      aria-hidden="true"
    >
      {photo ? <img src={image} alt="" onError={() => setFailed(true)} /> : (emoji ?? initial)}
    </span>
  );
}
