import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { docPages, docsNav, type DocId } from "~/content/docs";
import { BookIcon, CodeIcon, LayerIcon, LampChargeIcon, TextalignLeftIcon } from "~/components/icons/Icons";
import { FrameworkLogo } from "~/components/ui/FrameworkLogo";
import { useActiveSection } from "~/hooks/useActiveSection";
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
  const navigate = useNavigate();
  const active = useActiveSection(toc.map((t) => t.id));
  const framework = current ?? "react";
  const currentPage = docPages.find((p) => p.id === current);

  return (
    <div className={s.layout}>
      <aside className={s.side} aria-label="Docs">
        <nav className={s.nav}>
          <p className={s.group}>
            <BookIcon size={14} />
            Getting started
          </p>
          <Link to="/docs" className={s.link} activeOptions={{ exact: true }} activeProps={{ "data-active": "" }}>
            Introduction
          </Link>

          <p className={s.group}>
            <CodeIcon size={14} />
            Framework
          </p>
          <label className={s.picker}>
            <span className={s.pickerLogo}>{currentPage ? <FrameworkLogo framework={currentPage.logo} size={14} /> : null}</span>
            <select
              aria-label="Framework"
              value={current ?? ""}
              onChange={(e) => navigate({ to: "/docs/$framework", params: { framework: e.target.value } })}
            >
              <option value="" disabled>
                Select
              </option>
              {docPages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          {currentPage && (
            <Link to="/docs/$framework" params={{ framework: currentPage.id }} hash="" className={s.link} data-active="">
              {currentPage.label}
            </Link>
          )}

          {docsNav.map((group, i) => {
            const Icon = groupIcons[i] ?? TextalignLeftIcon;
            return (
              <div key={group.title}>
                <p className={s.group}>
                  <Icon size={14} />
                  {group.title}
                </p>
                {group.links.map((link) => (
                  <Link key={link.id} to="/docs/$framework" params={{ framework }} hash={link.id} className={s.link}>
                    {link.label}
                  </Link>
                ))}
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
          <TextalignLeftIcon size={14} />
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
