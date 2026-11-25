import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { docPages, type DocId } from "~/content/docs";
import { ArrowDownIcon, CodeIcon, TickCircleBoldIcon } from "~/components/icons/Icons";
import { FrameworkLogo } from "~/components/ui/FrameworkLogo";
import s from "./FrameworkPicker.module.css";

/** Framework switcher for the docs: a button and a menu of framework pages, each with its logo. */
export function FrameworkPicker({ current }: { current?: DocId }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const page = docPages.find((p) => p.id === current);

  // Close on outside click or Escape; focus the current item when opening
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    const items = list.current?.querySelectorAll<HTMLAnchorElement>("a");
    const index = Math.max(0, docPages.findIndex((p) => p.id === current));
    items?.[index]?.focus({ preventScroll: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, current]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      wrap.current?.querySelector("button")?.focus();
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = [...(list.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])];
    const at = items.indexOf(document.activeElement as HTMLAnchorElement);
    items[(at + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
  };

  return (
    <div className={s.picker} ref={wrap} onKeyDown={onKey}>
      <button type="button" className={s.button} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {page ? <FrameworkLogo framework={page.logo} size={16} /> : <CodeIcon size={16} className={s.placeholderIcon} />}
        <span className={s.label}>{page ? page.label : "Choose framework"}</span>
        <ArrowDownIcon size={14} className={s.chevron} />
      </button>

      {open && (
        <div className={s.menu} role="menu" ref={list}>
          {docPages.map((p) => (
            <Link
              key={p.id}
              role="menuitem"
              to="/docs/$framework"
              params={{ framework: p.id }}
              className={s.item}
              data-current={p.id === current || undefined}
              onClick={() => setOpen(false)}
            >
              <span className={s.logo}>
                <FrameworkLogo framework={p.logo} size={16} />
              </span>
              {p.label}
              {p.id === current && <TickCircleBoldIcon size={16} className={s.check} />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
