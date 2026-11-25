import type { CSSProperties, ReactNode } from "react";
import { cx } from "~/lib/cx";
import s from "./OptionTiles.module.css";

export type OptionTile<T extends string> = {
  value: T;
  /** Small visual before the label, e.g. an icon or a stroke sample */
  visual: ReactNode;
  label: string;
};

type OptionTilesProps<T extends string> = {
  label: string;
  value: T;
  options: OptionTile<T>[];
  onChange: (value: T) => void;
  columns?: number;
  /** Greys the group out and blocks changes (with a reason shown nearby) */
  disabled?: boolean;
  className?: string;
};

/** A grid of chip buttons (visual + label). Arrow keys move between them. */
export function OptionTiles<T extends string>({ label, value, options, onChange, columns = 2, disabled, className }: OptionTilesProps<T>) {
  return (
    <div
      className={cx(s.grid, className)}
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      style={{ "--cols": columns } as CSSProperties}
    >
      {options.map((opt, i) => {
        const checked = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={disabled}
            tabIndex={checked ? 0 : -1}
            className={s.chip}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => {
              const step = { ArrowRight: 1, ArrowDown: columns, ArrowLeft: -1, ArrowUp: -columns }[e.key];
              if (!step) return;
              e.preventDefault();
              const next = (i + step + options.length) % options.length;
              onChange(options[next].value);
              (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
            }}
          >
            <span className={s.visual} aria-hidden="true">
              {opt.visual}
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
