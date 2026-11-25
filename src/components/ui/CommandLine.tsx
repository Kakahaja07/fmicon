import { CopyIcon, TickCircleIcon } from "~/components/icons/Icons";
import { cx } from "~/lib/cx";
import s from "./CommandLine.module.css";

type CommandLineProps = {
  command: string;
  onCopy: () => void;
  copied?: boolean;
  className?: string;
};

/** One terminal command, e.g. `npm i @fmicons/react`. Click anywhere on it to copy. */
export function CommandLine({ command, onCopy, copied, className }: CommandLineProps) {
  return (
    <button type="button" className={cx(s.command, className)} onClick={onCopy} aria-label={`Copy command: ${command}`}>
      <span className={s.prompt} aria-hidden="true">
        $
      </span>
      <code>{command}</code>
      {copied ? <TickCircleIcon size={16} className={s.done} /> : <CopyIcon size={16} />}
    </button>
  );
}
