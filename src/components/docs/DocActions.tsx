import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { DocPage } from "~/content/docs";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CopyIcon,
  DocumentTextIcon,
  Export3Icon,
  MagicStarIcon,
  TickCircleIcon,
} from "~/components/icons/Icons";
import { pageToMarkdown, pageToPrompt } from "~/lib/docsExport";
import s from "./DocActions.module.css";

type DocActionsProps = {
  page: DocPage;
  prev?: { to: string; label: string };
  next?: { to: string; label: string };
};

/**
 * Next to the page title: "Copy page" (Markdown) with a menu for an AI prompt or
 * opening the prompt in ChatGPT or Claude, then previous / next page.
 */
export function DocActions({ page, prev, next }: DocActionsProps) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Close the menu on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = async (what: "page" | "prompt") => {
    try {
      await navigator.clipboard.writeText(what === "page" ? pageToMarkdown(page) : pageToPrompt(page));
      setDone(what);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setDone(null), 1800);
    } catch {
      /* clipboard blocked */
    }
    setOpen(false);
  };

  const ask = (base: string) => `${base}${encodeURIComponent(pageToPrompt(page))}`;

  return (
    <div className={s.actions}>
      <div className={s.split} ref={wrap}>
        <button type="button" className={s.main} onClick={() => copy("page")}>
          {done === "page" ? <TickCircleIcon size={16} className={s.ok} /> : <CopyIcon size={15} />}
          {done === "page" ? "Copied" : done === "prompt" ? "Prompt copied" : "Copy page"}
        </button>
        <span className={s.sep} aria-hidden="true" />
        <button type="button" className={s.toggle} aria-label="More copy options" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <ArrowDownIcon size={14} />
        </button>

        {open && (
          <div className={s.menu} role="menu">
            <button type="button" role="menuitem" onClick={() => copy("page")}>
              <DocumentTextIcon size={18} />
              <span>
                <b>Copy page</b>
                As Markdown, for notes and READMEs
              </span>
            </button>
            <button type="button" role="menuitem" onClick={() => copy("prompt")}>
              <MagicStarIcon size={18} />
              <span>
                <b>Copy prompt for AI</b>
                Paste into any coding agent
              </span>
            </button>
            <a role="menuitem" href={ask("https://chatgpt.com/?q=")} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
              <Export3Icon size={18} />
              <span>
                <b>Open in ChatGPT</b>
                Ask about this page
              </span>
            </a>
            <a role="menuitem" href={ask("https://claude.ai/new?q=")} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
              <Export3Icon size={18} />
              <span>
                <b>Open in Claude</b>
                Ask about this page
              </span>
            </a>
          </div>
        )}
      </div>

      {prev ? (
        <Link to={prev.to} className={s.nav} aria-label={`Previous: ${prev.label}`} title={prev.label}>
          <ArrowLeftIcon size={15} />
        </Link>
      ) : (
        <span className={s.nav} aria-hidden="true" data-disabled="" />
      )}
      {next ? (
        <Link to={next.to} className={s.nav} aria-label={`Next: ${next.label}`} title={next.label}>
          <ArrowRightIcon size={15} />
        </Link>
      ) : (
        <span className={s.nav} aria-hidden="true" data-disabled="" />
      )}
    </div>
  );
}
