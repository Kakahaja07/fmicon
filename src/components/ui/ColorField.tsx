import { useEffect, useState } from "react";
import { cx } from "~/lib/cx";
import s from "./ColorField.module.css";

type ColorFieldProps = {
  label: string;
  /** "#rrggbb", or "currentColor" for "inherit" */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Colour swatch (opens the system picker) + a hex field you can type or paste into. */
export function ColorField({ label, value, onChange, disabled, className }: ColorFieldProps) {
  const inherit = value === "currentColor";
  const [text, setText] = useState(inherit ? "" : value);

  useEffect(() => setText(inherit ? "" : value), [value, inherit]);

  const commit = (raw: string) => {
    const m = raw.trim().match(HEX);
    if (!m) return setText(inherit ? "" : value);
    let hex = m[1].toLowerCase();
    if (hex.length === 3) hex = hex.split("").map((ch) => ch + ch).join("");
    onChange(`#${hex}`);
  };

  return (
    <div className={cx(s.field, disabled && s.disabled, className)}>
      <label className={s.swatch} style={{ background: inherit ? "var(--text)" : value }} title={label}>
        <span className="sr-only">{label}</span>
        <input type="color" value={inherit ? "#4d8fff" : value} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
      </label>
      <input
        className={s.hex}
        value={text}
        placeholder="Inherit"
        aria-label={`${label} hex`}
        spellCheck={false}
        maxLength={7}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && commit(e.currentTarget.value)}
      />
    </div>
  );
}
