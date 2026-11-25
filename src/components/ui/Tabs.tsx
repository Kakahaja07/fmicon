import { useRef, type ReactNode } from "react";
import { cx } from "~/lib/cx";
import s from "./Tabs.module.css";

type TabsProps<T extends string> = {
  label: string;
  value: T;
  options: Array<{ value: T; label: string; icon?: ReactNode }>;
  onChange: (value: T) => void;
  className?: string;
};

/** A compact row of tabs in one track, each with an optional icon (scrolls sideways when narrow). Arrow keys move between tabs. */
export function Tabs<T extends string>({ label, value, options, onChange, className }: TabsProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className={cx(s.tabs, className)} role="tablist" aria-label={label}>
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            className={s.tab}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => {
              const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
              if (!step) return;
              e.preventDefault();
              const next = (i + step + options.length) % options.length;
              onChange(options[next].value);
              (ref.current?.children[next] as HTMLElement | undefined)?.focus();
            }}
          >
            {opt.icon && <span className={s.icon}>{opt.icon}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
