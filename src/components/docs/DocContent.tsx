import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { freeIconsMeta } from "~/content/freeIcons.meta";
import { docsPerformance, docsProps, type DocPage, type DocSection } from "~/content/docs";
import { CodeBlock } from "~/components/ui/CodeBlock";
import { CommandLine } from "~/components/ui/CommandLine";
import { FrameworkLogo } from "~/components/ui/FrameworkLogo";
import { SvgIcon } from "~/components/ui/SvgIcon";
import { Tabs } from "~/components/ui/Tabs";
import { styleLabels, type IconStyle } from "~/lib/svg";
import s from "./DocContent.module.css";
import { titleCase } from "~/lib/titleCase";

/** `code` spans written with backticks in the docs copy. */
export function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.startsWith("`") ? <code key={i}>{part.slice(1, -1)}</code> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard blocked: the text is still selectable */
    }
  };
  return { copied, copy };
}

const managers = [
  { value: "npm", label: "npm", cmd: (p: string) => `npm i ${p}` },
  { value: "pnpm", label: "pnpm", cmd: (p: string) => `pnpm add ${p}` },
  { value: "yarn", label: "yarn", cmd: (p: string) => `yarn add ${p}` },
  { value: "bun", label: "bun", cmd: (p: string) => `bun add ${p}` },
] as const;
type Manager = (typeof managers)[number]["value"];

/** Package-manager tabs with one copyable command. */
function Install({ page }: { page: DocPage }) {
  const [pm, setPm] = useState<Manager>("npm");
  const { copied, copy } = useCopy();
  const command = page.installCommand ?? managers.find((m) => m.value === pm)!.cmd((page.install ?? []).join(" "));
  return (
    <div className={s.install}>
      {!page.installCommand && <Tabs label="Package manager" value={pm} options={managers.map(({ value, label }) => ({ value, label }))} onChange={setPm} className={s.pmTabs} />}
      <CommandLine command={command} onCopy={() => copy("install", command)} copied={copied === "install"} />
    </div>
  );
}

function PropsTable() {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {docsProps.map((p) => (
            <tr key={p.prop}>
              <td>
                <code className={s.prop}>{p.prop}</code>
              </td>
              <td>
                <code>{p.type}</code>
              </td>
              <td>
                <code>{p.def}</code>
              </td>
              <td>{p.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PerformanceTable() {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Method</th>
            <th>Bundle impact</th>
            <th>Best for</th>
          </tr>
        </thead>
        <tbody>
          {docsPerformance.map((row) => (
            <tr key={row.method}>
              <td>
                <code>{row.method}</code>
              </td>
              <td>{row.impact}</td>
              <td>{row.best}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The same icon in every style, with the variant value to pass. */
function StylesGrid() {
  const styles = freeIconsMeta.styles as readonly IconStyle[];
  return (
    <div className={s.styles}>
      {styles.map((st) => (
        <figure key={st} className={s.style}>
          <SvgIcon body={freeIconsMeta.samples[st]} size={28} />
          <figcaption>
            {styleLabels[st]}
            <code>"{st}"</code>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function Section({ section, page, first, actions }: { section: DocSection; page: DocPage; first: boolean; actions?: ReactNode }) {
  const { copied, copy } = useCopy();
  const Heading = first ? "h1" : "h2";
  return (
    <section id={section.id} className={s.section}>
      <div className={first ? s.titleRow : undefined}>
      <Heading className={first ? s.h1 : s.h2}>
        {first && (
          <span className={s.h1Logo}>
            <FrameworkLogo framework={page.logo} size={24} />
          </span>
        )}
        {titleCase(section.title)}
      </Heading>
      {first && actions}
      </div>
      {section.text?.map((t) => (
        <p key={t} className={first ? s.lead : undefined}>
          <Inline text={t} />
        </p>
      ))}
      {section.list && (
        <ul className={s.list}>
          {section.list.map((item) => (
            <li key={item}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      )}
      {section.block === "install" && <Install page={page} />}
      {section.block === "props" && <PropsTable />}
      {section.block === "styles" && <StylesGrid />}
      {section.code?.map((c) => (
        <CodeBlock key={c.title} className={s.code} filename={c.title} code={c.code} onCopy={() => copy(c.title, c.code)} copied={copied === c.title} />
      ))}
      {section.block === "performance" && <PerformanceTable />}
      {section.tip && (
        <p className={s.tip}>
          <b>Tip:</b> <Inline text={section.tip} />
        </p>
      )}
    </section>
  );
}

/** One framework page, section by section. */
export function DocContent({ page, footer, actions }: { page: DocPage; footer?: ReactNode; actions?: ReactNode }) {
  return (
    <article className={s.article}>
      {page.sections.map((section, i) => (
        <Section key={section.id} section={section} page={page} first={i === 0} actions={actions} />
      ))}
      {footer}
    </article>
  );
}
