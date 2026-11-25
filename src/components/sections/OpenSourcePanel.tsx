import { useEffect, useRef, useState, type CSSProperties } from "react";
import { openSource } from "~/content/site";
import { ArrowRightIcon } from "~/components/icons/Icons";
import { Button } from "~/components/ui/Button";
import { CodeBlock } from "~/components/ui/CodeBlock";
import { CommandLine } from "~/components/ui/CommandLine";
import { FrameworkLogo, GithubLogo } from "~/components/ui/FrameworkLogo";
import { Reveal } from "~/components/ui/Reveal";
import { Tabs } from "~/components/ui/Tabs";
import { paletteVar } from "~/lib/palette";
import s from "./OpenSourcePanel.module.css";

type OpenSourcePanelProps = {
  /** h2 on its own, h3 under a section heading */
  titleAs?: "h2" | "h3";
  titleId?: string;
};

type InstallTab = (typeof openSource.install)[number]["value"];

/**
 * "Free and open source": what you get on the left, install-and-use on the right.
 * Used on the home page and under the icon browser. Copy lives in `openSource` in content/site.ts.
 */
export function OpenSourcePanel({ titleAs: Title = "h2", titleId }: OpenSourcePanelProps) {
  const [tab, setTab] = useState<InstallTab>("react");
  const [copied, setCopied] = useState<"command" | "code" | null>(null);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const current = openSource.install.find((i) => i.value === tab) ?? openSource.install[0];
  const tabs = openSource.install.map((i) => ({ value: i.value, label: i.label, icon: <FrameworkLogo framework={i.value} size={14} /> }));

  const copy = async (text: string, what: "command" | "code") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard blocked: the text is still selectable */
    }
  };

  return (
    <div className={s.wrap}>
      <Reveal className={s.panel}>
        {/* What you get */}
        <div className={s.pitch}>
          <span className={s.badge}>
            <GithubLogo size={14} />
            {openSource.badge}
          </span>
          <Title id={titleId} className={s.title}>
            {openSource.title}
          </Title>
          <p className={s.text}>{openSource.text}</p>
          <ul className={s.perks}>
            {openSource.perks.map(({ icon: Icon, color, text }) => (
              <li key={text} style={{ "--c": paletteVar(color) } as CSSProperties}>
                <span className={s.perkIcon} aria-hidden="true">
                  <Icon size={18} />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <div className={s.actions}>
            <Button href={openSource.star.href} target="_blank" rel="noreferrer" icon={GithubLogo}>
              {openSource.star.label}
            </Button>
            <Button href={openSource.browse.href} variant="ghost" iconRight={ArrowRightIcon}>
              {openSource.browse.label}
            </Button>
          </div>
        </div>

        {/* Install and use */}
        <div className={s.use}>
          <Tabs label="Framework" value={tab} options={tabs} onChange={setTab} />
          <CommandLine command={current.command} onCopy={() => copy(current.command, "command")} copied={copied === "command"} />
          <CodeBlock className={s.code} filename={current.file} code={current.code} onCopy={() => copy(current.code, "code")} copied={copied === "code"} />
        </div>
      </Reveal>
    </div>
  );
}
