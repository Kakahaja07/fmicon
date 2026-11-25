import type { ReactNode } from "react";
import { cx } from "~/lib/cx";
import s from "./BentoCard.module.css";

export type BentoCardProps = {
  title: string;
  description: ReactNode;
  /** Decorative illustration that fills the card */
  art: ReactNode;
  tone?: "light" | "dark";
  /** Where the text sits */
  align?: "top" | "bottom";
  /** Optional sticker peeking over the edge */
  sticker?: ReactNode;
  /** Extra classes for the art layer (e.g. a background) */
  artClassName?: string;
};

/** Large feature tile with an illustration behind the copy. */
export function BentoCard({ title, description, art, tone = "light", align = "top", sticker, artClassName }: BentoCardProps) {
  return (
    <article className={cx(s.card, s[tone], s[align])}>
      {sticker}
      <div className={cx(s.art, artClassName)} aria-hidden="true">
        {art}
      </div>
      <h3 className={s.title}>{title}</h3>
      <div className={s.desc}>{description}</div>
    </article>
  );
}

export function BentoGrid({ children }: { children: ReactNode }) {
  return <div className={s.grid}>{children}</div>;
}
