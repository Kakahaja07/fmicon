import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { docPages, docsNav, type DocId } from "~/content/docs";
import { BookIcon, CodeIcon, LayerIcon, LampChargeIcon, TextalignLeftIcon } from "~/components/icons/Icons";
import { useActiveSection } from "~/hooks/useActiveSection";
import { FrameworkPicker } from "./FrameworkPicker";
import s from "./DocsLayout.module.css";

type DocsLayoutProps = {
  /** Current framework page; none on the introduction */
  current?: DocId;
  /** "On this page" entries */
  toc: Array<{ id: string; title: string }>;
  children: ReactNode;
};

const groupIcons = [LayerIcon, LampChargeIcon, CodeIcon];

/**
 * Docs shell: grouped navigation and a framework picker on the left, the page in the middle,
 * "On this page" on the right. Basics, guides and advanced links jump to sections of the
 * current framework page (React when you're on the introduction).
 */
export function DocsLayout({ current, toc, children }: DocsLayoutProps) {
  const active = useActiveSection(toc.map((t) => t.id));
  const framework = current ?? "react";
  const currentPage = docPages.find((p) => p.id === current);

  return (
    <div className={s.layout}>
      <aside className={s.side} aria-label="Docs">
        <nav className={s.nav}>
          <div className={s.block}>
            <p className={s.group}>
              <span className={s.groupIcon}><BookIcon size={14} /></span>
              Getting started
            </p>
            <div className={s.items}>
              <Link to="/docs" className={s.link} activeOptions={{ exact: true }} activeProps={{ "data-active": "" }}>
                Introduction
              </Link>
            </div>
          </div>

          <div className={s.block}>
            <p className={s.group}>
              <span className={s.groupIcon}><CodeIcon size={14} /></span>
              Framework
            </p>
            <div className={s.items}>
              <FrameworkPicker current={current} />
              {currentPage && (
                <Link to="/docs/$framework" params={{ framework: currentPage.id }} hash="" className={s.link} data-active="">
                  {currentPage.label}
                </Link>
              )}
            </div>
          </div>

          {docsNav.map((group, i) => {
            const Icon = groupIcons[i] ?? TextalignLeftIcon;
            return (
              <div key={group.title} className={s.block} data-optional="">
                <p className={s.group}>
                  <span className={s.groupIcon}><Icon size={14} /></span>
                  {group.title}
                </p>
                <div className={s.items}>
                  {group.links.map((link) => (
                    <Link key={link.id} to="/docs/$framework" params={{ framework }} hash={link.id} className={s.link}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      <main id="top" className={s.main}>
        {children}
      </main>

      <aside className={s.toc} aria-label="On this page">
        <p className={s.group}>
          <span className={s.groupIcon}><TextalignLeftIcon size={14} /></span>
          On this page
        </p>
        <ol>
          {toc.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} data-active={active === t.id || undefined}>
                {t.title}
              </a>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
