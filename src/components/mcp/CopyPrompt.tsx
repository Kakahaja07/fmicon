import { useEffect, useRef, useState } from "react";
import { CopyIcon, MessageIcon, TickCircleIcon } from "~/components/icons/Icons";
import s from "./Mcp.module.css";

/** An example prompt you can copy straight into your AI app. */
export function CopyPrompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <button type="button" className={s.prompt} onClick={copy} aria-label={`Copy prompt: ${text}`}>
      <MessageIcon size={16} className={s.promptIcon} />
      <span className={s.promptText}>{text}</span>
      <span className={s.promptCopy} data-copied={copied || undefined}>
        {copied ? <TickCircleIcon size={15} /> : <CopyIcon size={15} />}
      </span>
    </button>
  );
}
