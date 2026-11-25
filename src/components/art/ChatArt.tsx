import { CardIcon, MoneyIcon, WalletAddIcon as WalletIcon } from "~/components/icons/Icons";
import s from "./ChatArt.module.css";

type ChatArtProps = { me: string; ai: string };

/** A short chat with an assistant that answers with icons. */
export function ChatArt({ me, ai }: ChatArtProps) {
  return (
    <div className={s.art}>
      <div className={s.bubbles}>
        <span className={s.me}>{me}</span>
        <span className={s.ai}>
          <span className={s.results}>
            <WalletIcon size={18} />
            <CardIcon size={18} />
            <MoneyIcon size={18} />
          </span>
          {ai}
        </span>
      </div>
    </div>
  );
}

/** Row of tool dots that sits under the card title. */
export function ToolDots({ label }: { label: string }) {
  return (
    <p className={s.tools}>
      <span aria-hidden="true">
        <i style={{ background: "var(--orange)" }} />
        <i style={{ background: "var(--text)" }} />
        <i style={{ background: "var(--blue)" }} />
        <i style={{ background: "var(--purple)" }} />
      </span>
      {label}
    </p>
  );
}
