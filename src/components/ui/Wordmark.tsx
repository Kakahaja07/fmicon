import { cx } from "~/lib/cx";
import { LogoMark } from "./LogoMark";
import s from "./Wordmark.module.css";

/** The dotted "F" mark with the name set as a wordmark: "FM" strong, "Icons" lighter. */
export function Wordmark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <span className={cx(s.wordmark, className)} style={{ fontSize: Math.round(size * 0.66) }}>
      <LogoMark size={size} />
      <span className={s.name}>
        <b>FM</b>
        <span>Icons</span>
      </span>
    </span>
  );
}
