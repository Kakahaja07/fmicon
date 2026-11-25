import { cx } from "~/lib/cx";
import { AppIcon } from "./AppIcon";
import s from "./Wordmark.module.css";

/** The app tile with the name set as a wordmark: "fm" strong, "icon" lighter (same as the README logo). */
export function Wordmark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <span className={cx(s.wordmark, className)} style={{ fontSize: Math.round(size * 0.72) }}>
      <AppIcon size={size} />
      <span className={s.name}>
        <b>fm</b>
        <span>icon</span>
      </span>
    </span>
  );
}
