import { LockIcon } from "~/components/icons/Icons";
import { AiLogo, aiTools } from "~/components/ui/AiLogo";
import s from "./ChatArt.module.css";

type ChatArtProps = { me: string; ai: string };

/**
 * An assistant asked for an icon: the request, its reply, the code it wrote and
 * the button that came out of it. Fills the tile from top to copy.
 */
export function ChatArt({ me, ai }: ChatArtProps) {
  return (
    <div className={s.art}>
      <div className={s.bubbles}>
        <span className={s.me}>{me}</span>
        <span className={s.ai}>
          <span className={s.aiMark}>
            <AiLogo tool={aiTools[0]} size={14} />
          </span>
          {ai}
        </span>

        <div className={s.code}>
          <div className={s.file}>
            LoginButton.tsx
            <span className={s.result}>
              <LockIcon size={14} />
              Log in
            </span>
          </div>
          <pre>
            <span className={s.k}>import</span> {"{ "}
            <span className={s.c}>Lock</span>
            {" }"} <span className={s.k}>from</span> <span className={s.str}>"@fmicons/react"</span>;{"\n\n"}
            {"<"}
            <span className={s.c}>Button</span>
            {">"}
            {"\n  <"}
            <span className={s.c}>Lock</span> <span className={s.a}>size</span>={"{16}"} {"/> Log in\n</"}
            <span className={s.c}>Button</span>
            {">"}
          </pre>
        </div>
      </div>
    </div>
  );
}

/** The AI coding tools it works with, as their real logos, under the card title. */
export function ToolDots({ label }: { label: string }) {
  return (
    <p className={s.tools}>
      <span className={s.logos}>
        {aiTools.map((tool) => (
          <i key={tool.id} title={tool.label}>
            <AiLogo tool={tool} size={13} />
          </i>
        ))}
      </span>
      {label}
    </p>
  );
}
