import type { ReactNode } from "react";
import { cx } from "~/lib/cx";
import s from "./Segmented.module.css";

export type SegmentedOption<T extends string> = {
  value: T;
  /** Visible content (text or an icon) */
  label: ReactNode;
  /** Accessible name when the label is an icon */
  title?: string;
};

type SegmentedProps<T extends string> = {
  label: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  size?: "sm" | "md";
  /** Greys the control out and blocks changes */
  disabled?: boolean;
  className?: string;
};

/** A row of mutually exclusive choices with a raised "thumb" on the selected one. */
export function Segmented<T extends string>({ label, value, options, onChange, size = "md", disabled, className }: SegmentedProps<T>) {
  return (
    <div className={cx(s.group, s[size], className)} role="radiogroup" aria-label={label} aria-disabled={disabled || undefined}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          aria-label={opt.title}
          title={opt.title}
          className={s.option}
          disabled={disabled}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
