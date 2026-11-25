import {
  BriefcaseIcon,
  Element3Icon,
  PeopleIcon,
  Setting2Icon,
  Setting3Icon,
  Setting4Icon,
  SettingIcon,
  TickCircleIcon,
  type IconComponent,
} from "~/components/icons/Icons";
import { AiLogo, aiTools } from "~/components/ui/AiLogo";
import { AppTile } from "~/components/ui/AppTile";
import { Reveal } from "~/components/ui/Reveal";
import s from "./Mcp.module.css";

const found: Array<{ name: string; Icon: IconComponent }> = [
  { name: "setting-2", Icon: Setting2Icon },
  { name: "setting", Icon: SettingIcon },
  { name: "setting-3", Icon: Setting3Icon },
  { name: "setting-4", Icon: Setting4Icon },
];

const nav: Array<{ label: string; Icon: IconComponent }> = [
  { label: "Dashboard", Icon: Element3Icon },
  { label: "Projects", Icon: BriefcaseIcon },
  { label: "Team", Icon: PeopleIcon },
];

/**
 * A real conversation, drawn with the real icons: the request, the two fmicon tool calls,
 * the code the assistant wrote and the navbar it produced. Each step rises in as it scrolls into view.
 */
export function McpChat() {
  const claude = aiTools[0];
  return (
    <div className={s.chat}>
      <div className={s.chatBar}>
        <span className={s.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={s.chatTitle}>
          <AppTile app="claude-code" size={16} />
          Claude Code
        </span>
        <span className={s.chatServer}>
          <i aria-hidden="true" />
          fmicon connected
        </span>
      </div>

      <div className={s.thread}>
        <Reveal className={s.me}>Add a settings button to the navbar. Use a gear icon.</Reveal>

        <Reveal delay={120} className={s.call}>
          <p className={s.callHead}>
            <span className={s.callTool}>fmicon · search_icons</span>
            <code>{`{ "query": "gear" }`}</code>
          </p>
          <div className={s.found}>
            {found.map(({ name, Icon }, i) => (
              <span key={name} className={i === 0 ? s.pick : undefined}>
                <Icon size={22} />
                <small>{name}</small>
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={220} className={s.callDone}>
          <TickCircleIcon size={14} />
          <span className={s.callTool}>fmicon · get_icon</span>
          <code>{`{ "name": "setting-2", "format": "react" }`}</code>
        </Reveal>

        <Reveal delay={320} className={s.ai}>
          <span className={s.aiMark}>
            <AiLogo tool={claude} size={14} />
          </span>
          <div className={s.aiBody}>
            <p>
              Added a settings button with <code>Setting2</code> from fmicon-react, and gave it a label for screen readers:
            </p>
            <pre className={s.snippet}>
              <code>
                <span className={s.k}>import</span> {"{ "}
                <span className={s.c}>Setting2</span>
                {" }"} <span className={s.k}>from</span> <span className={s.str}>"fmicon-react"</span>;{"\n\n"}
                {"<"}
                <span className={s.c}>button</span> <span className={s.a}>aria-label</span>=<span className={s.str}>"Settings"</span>
                {">\n  <"}
                <span className={s.c}>Setting2</span> <span className={s.a}>size</span>={"{20}"} {"/>\n</"}
                <span className={s.c}>button</span>
                {">"}
              </code>
            </pre>
          </div>
        </Reveal>

        <Reveal delay={420} className={s.result}>
          <span className={s.resultLabel}>Result</span>
          <nav className={s.miniNav} aria-label="Example navbar">
            {nav.map(({ label, Icon }) => (
              <span key={label}>
                <Icon size={16} />
                {label}
              </span>
            ))}
            <span className={s.gear} title="Settings">
              <Setting2Icon size={18} />
            </span>
          </nav>
        </Reveal>
      </div>
    </div>
  );
}
